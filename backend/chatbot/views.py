from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from academics.models import Course, Enrollment

from .gemini import answer_question
from .models import ChatMessage


class ChatView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        qs = ChatMessage.objects.filter(user=request.user).select_related("course")
        course_id = request.query_params.get("course")
        if course_id:
            qs = qs.filter(course_id=course_id)
        data = [
            {
                "id": m.id,
                "course": m.course_id,
                "course_name": m.course.name if m.course else None,
                "question": m.question,
                "answer": m.answer,
                "created_at": m.created_at,
            }
            for m in qs[:40]
        ]
        return Response(data)

    def post(self, request):
        question = (request.data.get("question") or "").strip()
        if not question:
            return Response({"detail": "Please type a question."}, status=status.HTTP_400_BAD_REQUEST)
        course = None
        course_id = request.data.get("course")
        if course_id:
            try:
                course = Course.objects.prefetch_related("resources").get(pk=course_id)
            except Course.DoesNotExist:
                return Response({"detail": "Course not found."}, status=404)
            if request.user.role == "student":
                if not Enrollment.objects.filter(student=request.user, course=course).exists():
                    return Response({"detail": "Enroll in this course to ask Heirloom."}, status=403)

        answer, mode = answer_question(request.user, course, question)
        message = ChatMessage.objects.create(
            user=request.user,
            course=course,
            question=question,
            answer=answer,
        )
        return Response(
            {
                "id": message.id,
                "question": message.question,
                "answer": message.answer,
                "course": course.id if course else None,
                "mode": mode or "live",
                "created_at": message.created_at,
            }
        )
