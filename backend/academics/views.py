from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsAdminRole, IsFacultyRole, IsStudentRole
from chatbot.models import ChatMessage

from .models import Course, Enrollment, Mark, Resource, ResourceCompletion
from .serializers import CourseSerializer, MarkSerializer, ResourceSerializer


class CourseListCreateView(generics.ListCreateAPIView):
    serializer_class = CourseSerializer

    def get_queryset(self):
        user = self.request.user
        qs = Course.objects.select_related("faculty").prefetch_related("resources", "enrollments")
        if user.role == "faculty":
            return qs.filter(faculty=user)
        if user.role == "student":
            return qs
        return qs

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAdminRole()]
        return [permissions.IsAuthenticated()]


class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.select_related("faculty")
    serializer_class = CourseSerializer

    def get_permissions(self):
        if self.request.method in ("PUT", "PATCH", "DELETE"):
            return [IsAdminRole()]
        return [permissions.IsAuthenticated()]


class EnrollView(APIView):
    permission_classes = (IsStudentRole,)

    def post(self, request, pk):
        try:
            course = Course.objects.get(pk=pk)
        except Course.DoesNotExist:
            return Response({"detail": "Course not found."}, status=404)
        Enrollment.objects.get_or_create(student=request.user, course=course)
        return Response({"detail": "Enrolled successfully."})


class ResourceListCreateView(generics.ListCreateAPIView):
    serializer_class = ResourceSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        qs = Resource.objects.select_related("course", "uploaded_by")
        course_id = self.request.query_params.get("course")
        if course_id:
            qs = qs.filter(course_id=course_id)
        user = self.request.user
        if user.role == "student":
            enrolled = Enrollment.objects.filter(student=user).values_list("course_id", flat=True)
            qs = qs.filter(course_id__in=enrolled)
        elif user.role == "faculty":
            qs = qs.filter(course__faculty=user)
        return qs

    def perform_create(self, serializer):
        user = self.request.user
        if user.role not in ("faculty", "admin"):
            raise PermissionDenied("Only faculty or admin can upload resources.")
        course = serializer.validated_data["course"]
        if user.role == "faculty" and course.faculty_id != user.id:
            raise PermissionDenied("You can only upload to your own courses.")
        serializer.save(uploaded_by=user)


class ResourceCompleteView(APIView):
    permission_classes = (IsStudentRole,)

    def post(self, request, pk):
        try:
            resource = Resource.objects.get(pk=pk)
        except Resource.DoesNotExist:
            return Response({"detail": "Resource not found."}, status=404)
        if not Enrollment.objects.filter(student=request.user, course=resource.course).exists():
            return Response({"detail": "Enroll in this course first."}, status=403)
        ResourceCompletion.objects.get_or_create(student=request.user, resource=resource)
        return Response({"detail": "Marked as completed."})


class MarkListCreateView(generics.ListCreateAPIView):
    serializer_class = MarkSerializer

    def get_queryset(self):
        user = self.request.user
        qs = Mark.objects.select_related("student", "course")
        course_id = self.request.query_params.get("course")
        if course_id:
            qs = qs.filter(course_id=course_id)
        if user.role == "student":
            return qs.filter(student=user)
        if user.role == "faculty":
            return qs.filter(course__faculty=user)
        return qs

    def perform_create(self, serializer):
        user = self.request.user
        course = serializer.validated_data["course"]
        if user.role == "faculty" and course.faculty_id != user.id:
            raise PermissionDenied("You can only add marks for your courses.")
        if user.role == "student":
            raise PermissionDenied("Students cannot enter marks.")
        serializer.save()


class StudentDashboardView(APIView):
    permission_classes = (IsStudentRole,)

    def get(self, request):
        enrolled_ids = Enrollment.objects.filter(student=request.user).values_list("course_id", flat=True)
        courses = Course.objects.filter(id__in=enrolled_ids).select_related("faculty")
        resources = Resource.objects.filter(course_id__in=enrolled_ids)
        completions = ResourceCompletion.objects.filter(student=request.user, resource__course_id__in=enrolled_ids)
        marks = Mark.objects.filter(student=request.user)
        percents = [
            (float(m.score) / float(m.max_score) * 100) for m in marks if m.max_score
        ]
        avg = sum(percents) / len(percents) if percents else 0
        return Response(
            {
                "courses": CourseSerializer(courses, many=True, context={"request": request}).data,
                "recent_resources": ResourceSerializer(
                    resources[:6], many=True, context={"request": request}
                ).data,
                "marks": MarkSerializer(marks[:8], many=True, context={"request": request}).data,
                "completions": completions.count(),
                "total_resources": resources.count(),
                "average_score": round(float(avg), 1),
                "chat_count": ChatMessage.objects.filter(user=request.user).count(),
            }
        )


class FacultyDashboardView(APIView):
    permission_classes = (IsFacultyRole,)

    def get(self, request):
        courses = Course.objects.filter(faculty=request.user)
        students = Enrollment.objects.filter(course__in=courses).values("student").distinct().count()
        resources = Resource.objects.filter(course__in=courses).count()
        return Response(
            {
                "courses": CourseSerializer(courses, many=True, context={"request": request}).data,
                "student_count": students,
                "resource_count": resources,
                "recent_marks": MarkSerializer(
                    Mark.objects.filter(course__in=courses)[:8],
                    many=True,
                    context={"request": request},
                ).data,
            }
        )


class AdminDashboardView(APIView):
    permission_classes = (IsAdminRole,)

    def get(self, request):
        from accounts.models import User

        return Response(
            {
                "students": User.objects.filter(role="student").count(),
                "faculty": User.objects.filter(role="faculty").count(),
                "courses": Course.objects.count(),
                "resources": Resource.objects.count(),
                "enrollments": Enrollment.objects.count(),
                "chats": ChatMessage.objects.count(),
                "courses_list": CourseSerializer(
                    Course.objects.all(), many=True, context={"request": request}
                ).data,
            }
        )


class CourseStudentsView(APIView):
    def get(self, request, pk):
        user = request.user
        try:
            course = Course.objects.get(pk=pk)
        except Course.DoesNotExist:
            return Response({"detail": "Course not found."}, status=404)
        if user.role == "faculty" and course.faculty_id != user.id:
            return Response({"detail": "Forbidden."}, status=403)
        if user.role == "student":
            return Response({"detail": "Forbidden."}, status=403)
        enrollments = Enrollment.objects.filter(course=course).select_related("student")
        data = [
            {
                "id": e.student_id,
                "email": e.student.email,
                "full_name": e.student.full_name,
            }
            for e in enrollments
        ]
        return Response(data)
