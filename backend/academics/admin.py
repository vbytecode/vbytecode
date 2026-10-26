from django.contrib import admin

from .models import Course, Enrollment, Mark, Resource, ResourceCompletion


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("code", "name", "faculty")
    search_fields = ("code", "name")


admin.site.register(Enrollment)
admin.site.register(Resource)
admin.site.register(ResourceCompletion)
admin.site.register(Mark)
