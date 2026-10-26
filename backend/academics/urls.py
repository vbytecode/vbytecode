from django.urls import path

from .views import (
    AdminDashboardView,
    CourseDetailView,
    CourseListCreateView,
    CourseStudentsView,
    EnrollView,
    FacultyDashboardView,
    MarkListCreateView,
    ResourceCompleteView,
    ResourceListCreateView,
    StudentDashboardView,
)

urlpatterns = [
    path("courses/", CourseListCreateView.as_view()),
    path("courses/<int:pk>/", CourseDetailView.as_view()),
    path("courses/<int:pk>/enroll/", EnrollView.as_view()),
    path("courses/<int:pk>/students/", CourseStudentsView.as_view()),
    path("resources/", ResourceListCreateView.as_view()),
    path("resources/<int:pk>/complete/", ResourceCompleteView.as_view()),
    path("marks/", MarkListCreateView.as_view()),
    path("dashboard/student/", StudentDashboardView.as_view()),
    path("dashboard/faculty/", FacultyDashboardView.as_view()),
    path("dashboard/admin/", AdminDashboardView.as_view()),
]
