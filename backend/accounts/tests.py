from rest_framework.test import APITestCase

from .models import User


class AdminAccountCreationTests(APITestCase):
    def setUp(self):
        admin = User.objects.create_user(
            email="admin@heirloom.test", password="TestAdmin123!", role=User.Roles.ADMIN
        )
        self.client.force_authenticate(admin)

    def test_admin_can_create_each_role_and_default_student(self):
        for role in (User.Roles.ADMIN, User.Roles.FACULTY, User.Roles.STUDENT, None):
            with self.subTest(role=role):
                email = f"new-{role or 'default'}@heirloom.test"
                payload = {
                    "email": email,
                    "full_name": "Test account",
                    "password": "TestAccount123!",
                }
                if role is not None:
                    payload["role"] = role
                response = self.client.post("/api/auth/admin/users/", payload, format="json")
                self.assertEqual(response.status_code, 201, response.data)
                user = User.objects.get(email=email)
                self.assertEqual(user.role, role or User.Roles.STUDENT)
                self.assertTrue(user.check_password(payload["password"]))
                self.assertNotIn("password", response.data)


class DemoStudentAccountsTests(APITestCase):
    def test_seed_converts_former_faculty_and_keeps_student_demo_data(self):
        from io import StringIO
        from tempfile import TemporaryDirectory

        from django.core.management import call_command
        from django.test import override_settings

        from academics.models import Course, Enrollment, Mark, Resource

        priyansh = User.objects.create_user(
            email="priyansh@heirloom.test", password="Faculty@123",
            full_name="priyansh", role=User.Roles.FACULTY, is_staff=True,
        )
        course = Course.objects.create(code="BCA503", name="Web Development", faculty=priyansh)
        resource = Resource.objects.create(course=course, title="Existing note", uploaded_by=priyansh)
        with TemporaryDirectory() as media, override_settings(MEDIA_ROOT=media):
            for _ in range(2):
                call_command("seed_demo", stdout=StringIO())
                self.assertEqual(User.objects.count(), 5)
                self.assertEqual(User.objects.filter(role=User.Roles.FACULTY).count(), 1)
                faculty = User.objects.get(email="faculty@heirloom.test")
                course.refresh_from_db()
                resource.refresh_from_db()
                self.assertEqual(course.faculty, faculty)
                self.assertEqual(resource.uploaded_by, faculty)
                for email, name in (
                    ("kunal@heirloom.test", "Kunal choudhary"),
                    ("priyansh@heirloom.test", "priyansh"),
                ):
                    with self.subTest(email=email):
                        student = User.objects.get(email=email)
                        self.assertEqual(student.role, User.Roles.STUDENT)
                        self.assertEqual(student.full_name, name)
                        self.assertFalse(student.is_staff)
                        self.assertFalse(student.is_superuser)
                        self.assertEqual(Enrollment.objects.filter(student=student).count(), 5)
                        self.assertEqual(Mark.objects.filter(student=student).count(), 2)
                        self.client.credentials()
                        response = self.client.post("/api/auth/login/", {
                            "email": email, "password": "Student@123",
                        }, format="json")
                        self.assertEqual(response.status_code, 200, response.data)
                        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['access']}")
                        self.assertEqual(self.client.get("/api/dashboard/student/").status_code, 200)
                        self.assertEqual(self.client.get("/api/dashboard/faculty/").status_code, 403)
