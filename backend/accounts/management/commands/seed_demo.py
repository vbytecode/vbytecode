from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand

from academics.models import Course, Enrollment, Mark, Resource, ResourceCompletion
from accounts.models import User
from chatbot.models import ChatMessage


class Command(BaseCommand):
    help = "Seed Heirloom with BCA demo users, courses, notes, marks, and sample chat."

    def handle(self, *args, **options):
        admin, _ = User.objects.get_or_create(
            email="admin@heirloom.test",
            defaults={
                "full_name": "Vigya Upadhyay",
                "role": User.Roles.ADMIN,
                "is_staff": True,
                "is_superuser": True,
            },
        )
        admin.full_name = "Vigya Upadhyay"
        admin.role = User.Roles.ADMIN
        admin.is_staff = True
        admin.is_superuser = True
        admin.set_password("Admin@123")
        admin.save()

        faculty, _ = User.objects.get_or_create(
            email="faculty@heirloom.test",
            defaults={"full_name": "Geeta Gandi", "role": User.Roles.FACULTY},
        )
        faculty.full_name = "Geeta Gandi"
        faculty.role = User.Roles.FACULTY
        faculty.set_password("Faculty@123")
        faculty.save()

        students = []
        for email, name in (
            ("student@heirloom.test", "BCA Student"),
            ("kunal@heirloom.test", "Kunal choudhary"),
            ("priyansh@heirloom.test", "priyansh"),
        ):
            student, _ = User.objects.get_or_create(email=email)
            # Transfer any former demo faculty responsibilities before changing roles.
            Course.objects.filter(faculty=student).update(faculty=faculty)
            Resource.objects.filter(uploaded_by=student).update(uploaded_by=faculty)
            student.full_name = name
            student.role = User.Roles.STUDENT
            student.is_staff = False
            student.is_superuser = False
            student.set_password("Student@123")
            student.save()
            students.append(student)

        catalog = [
            (
                "BCA501",
                "Python Programming",
                "Core Python for BCA: syntax, OOP, files, and small academic projects.",
                faculty,
                [
                    (
                        "Unit 1 — Python Basics",
                        "notes",
                        "Variables, data types, operators, input/output, and control flow with examples used in BCA labs.",
                    ),
                    (
                        "Assignment 1 — Loops & Functions",
                        "assignment",
                        "Write functions for factorial, palindrome check, and a simple grade calculator.",
                    ),
                ],
            ),
            (
                "BCA502",
                "Database Management Systems",
                "Relational models, SQL, normalization, and ER diagrams for academic systems.",
                faculty,
                [
                    (
                        "ER Diagram Notes — Heirloom",
                        "notes",
                        "Entities: User, Course, Enrollment, Resource, Mark, ChatMessage. Keys and relationships.",
                    ),
                    (
                        "SQL Practice Sheet",
                        "reference",
                        "SELECT, JOIN, GROUP BY queries on a STUDENT table similar to the login DFD.",
                    ),
                ],
            ),
            (
                "BCA503",
                "Web Development",
                "HTML, CSS, JavaScript, and Django views for building academic portals.",
                faculty,
                [
                    (
                        "Django MVT Crash Notes",
                        "notes",
                        "Models, views, templates, REST APIs, JWT auth for a React frontend.",
                    ),
                    (
                        "Bootstrap vs Tailwind",
                        "reference",
                        "When to use utility CSS for dashboards versus classic Bootstrap grids.",
                    ),
                ],
            ),
            (
                "BCA504",
                "Data Structures",
                "Arrays, stacks, queues, trees, and complexity analysis for BCA semester exams.",
                faculty,
                [
                    (
                        "Stacks and Queues",
                        "notes",
                        "LIFO vs FIFO, infix to postfix, and circular queue operations.",
                    ),
                ],
            ),
            (
                "BCA505",
                "Computer Networks",
                "OSI model, TCP/IP, routing basics, and application-layer protocols.",
                faculty,
                [
                    (
                        "OSI vs TCP/IP",
                        "notes",
                        "Layer mapping, encapsulation, and exam-oriented comparison tables.",
                    ),
                ],
            ),
        ]

        created_courses = []
        for code, name, desc, fac, resources in catalog:
            course, _ = Course.objects.update_or_create(
                code=code,
                defaults={"name": name, "description": desc, "faculty": fac},
            )
            created_courses.append(course)
            for student in students:
                Enrollment.objects.get_or_create(student=student, course=course)
            for title, rtype, description in resources:
                resource, created = Resource.objects.get_or_create(
                    course=course,
                    title=title,
                    defaults={
                        "resource_type": rtype,
                        "description": description,
                        "uploaded_by": fac,
                    },
                )
                if created or not resource.file:
                    content = (
                        f"Heirloom — {course.code} {course.name}\n\n{title}\n\n{description}\n\n"
                        "Team Heirloom: Vigya Upadhyay, Kunal choudhary, priyansh\n"
                    ).encode("utf-8")
                    resource.file.save(
                        f"{code}_{title[:20].replace(' ', '_')}.txt",
                        ContentFile(content),
                        save=True,
                    )

        python_course = created_courses[0]
        dbms = created_courses[1]
        first_note = Resource.objects.filter(course=python_course).first()
        for student in students:
            if first_note:
                ResourceCompletion.objects.get_or_create(student=student, resource=first_note)

            Mark.objects.get_or_create(
                student=student,
                course=python_course,
                title="Midterm",
                defaults={"score": 86, "max_score": 100},
            )
            Mark.objects.get_or_create(
                student=student,
                course=dbms,
                title="Quiz 1",
                defaults={"score": 18, "max_score": 20},
            )

            ChatMessage.objects.get_or_create(
                user=student,
                course=python_course,
                question="What is the difference between a list and a tuple in Python?",
                defaults={
                    "answer": "A list is mutable (you can change items) and uses square brackets. "
                    "A tuple is immutable and uses parentheses. Use lists when data will change, "
                    "and tuples for fixed records such as (roll_no, name)."
                },
            )

        self.stdout.write(self.style.SUCCESS("Demo data ready."))
        self.stdout.write("Admin    admin@heirloom.test / Admin@123")
        self.stdout.write("Faculty  faculty@heirloom.test / Faculty@123")
        for student in students:
            self.stdout.write(f"Student  {student.full_name}: {student.email} / Student@123")
