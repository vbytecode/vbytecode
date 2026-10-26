from rest_framework import serializers

from accounts.serializers import UserSerializer

from .models import Course, Enrollment, Mark, Resource, ResourceCompletion


class CourseSerializer(serializers.ModelSerializer):
    faculty_detail = UserSerializer(source="faculty", read_only=True)
    enrolled = serializers.SerializerMethodField()
    resource_count = serializers.IntegerField(source="resources.count", read_only=True)
    student_count = serializers.IntegerField(source="enrollments.count", read_only=True)

    class Meta:
        model = Course
        fields = (
            "id",
            "code",
            "name",
            "description",
            "faculty",
            "faculty_detail",
            "enrolled",
            "resource_count",
            "student_count",
        )

    def get_enrolled(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated or request.user.role != "student":
            return False
        return obj.enrollments.filter(student=request.user).exists()


class ResourceSerializer(serializers.ModelSerializer):
    uploaded_by_detail = UserSerializer(source="uploaded_by", read_only=True)
    completed = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Resource
        fields = (
            "id",
            "course",
            "title",
            "resource_type",
            "description",
            "file",
            "file_url",
            "uploaded_by",
            "uploaded_by_detail",
            "completed",
            "created_at",
        )
        read_only_fields = ("uploaded_by",)

    def get_completed(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        return obj.completions.filter(student=request.user).exists()

    def get_file_url(self, obj):
        if not obj.file:
            return None
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.file.url)
        return obj.file.url


class MarkSerializer(serializers.ModelSerializer):
    student_detail = UserSerializer(source="student", read_only=True)

    class Meta:
        model = Mark
        fields = (
            "id",
            "student",
            "student_detail",
            "course",
            "title",
            "score",
            "max_score",
            "created_at",
        )


class EnrollmentSerializer(serializers.ModelSerializer):
    student_detail = UserSerializer(source="student", read_only=True)

    class Meta:
        model = Enrollment
        fields = ("id", "student", "student_detail", "course", "created_at")
        read_only_fields = ("student",)


class DashboardSerializer(serializers.Serializer):
    courses = CourseSerializer(many=True)
    recent_resources = ResourceSerializer(many=True)
    marks = MarkSerializer(many=True)
    completions = serializers.IntegerField()
    total_resources = serializers.IntegerField()
    average_score = serializers.FloatField()
    chat_count = serializers.IntegerField()
