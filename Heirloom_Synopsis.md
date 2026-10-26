# Heirloom: digital legacy, preservation & access system

**Author:** Vigya Upadhyay

**Partners:** Kunal choudhary and priyansh

## 1. Abstract

Heirloom is a web application for organizing knowledge, providing access to learning resources, and recording academic progress. It gives students, faculty, and administrators a shared platform with responsibilities suited to each role. The application combines a resource library, course management, progress dashboards, and a conversational assistant. Its current implementation demonstrates knowledge access in an academic setting, with a future direction toward broader digital legacy preservation.

## 2. Problem statement

Learning materials can become scattered across messages, folders, and separate systems. Students may struggle to find the correct notes or remember which materials they have completed. Faculty need a practical way to publish resources and record performance. Administrators need a central place to maintain course assignments and user accounts. Heirloom addresses these needs through an organized course workspace.

## 3. Objectives

- Centralize course notes, assignments, and reference material.
- Provide email-based registration and authentication.
- Give each role a dashboard aligned with its responsibilities.
- Record resource completion and display student marks.
- Support questions using available course context.
- Retain conversation history so students can revisit questions.
- Provide a foundation for future preservation and access features.

## 4. Scope of the current release

The implemented system includes accounts, courses, enrollments, uploaded resources, completion records, marks, and chat history. It supports a local demonstration with synthetic data. Long-term preservation, inheritance transfers, beneficiary verification, scheduled release, and private archival storage remain future development work.

## 5. Users and responsibilities

| User | Responsibilities |
| --- | --- |
| Student | Register, sign in, browse and enroll in courses, access resources, record completion, review marks, and ask questions. |
| Faculty | Review assigned courses, upload course resources, view enrolled students, and record marks. |
| Administrator | Manage people and courses, assign faculty, and view system totals. |

The demonstration faculty account is **Geeta Gandi**, available at `faculty@heirloom.test`, with all five demo courses assigned. **Kunal choudhary** (`kunal@heirloom.test`) and **priyansh** (`priyansh@heirloom.test`) have student demo accounts. The project author and partners remain Vigya Upadhyay, Kunal choudhary, and priyansh.

## 6. Functional modules

### 6.1 Account management

Students register with their name, email, and password. The backend hashes passwords and issues JWT tokens after successful login. Faculty and administrator accounts are created through administration workflows. API permissions restrict role-specific actions.

### 6.2 Course management

A course has a code, title, description, and faculty assignment. Student enrollments connect users to courses. Faculty see their assigned courses, while administrators manage the catalog and assignments.

### 6.3 Resource library

Resources belong to a course and include a title, type, description, uploader, and optional file. Faculty publish notes, assignments, and reference material for their courses. Students browse resources for enrolled courses, download files, and mark items complete.

### 6.4 Progress tracking

The student dashboard brings together enrolled courses, recent resources, marks, completion totals, and chat activity. Average scores are calculated from recorded marks. Faculty dashboards summarize assigned courses, enrolled students, and available resources.

### 6.5 Conversational assistance

The assistant receives a student's question with a selected course's description and resource metadata. A configured Gemini service can generate a response. Without an API key, a demonstration response lists available course resources. Conversations are stored and displayed in chat history. The current assistant does not extract or index complete uploaded file contents.

## 7. System architecture

The React frontend renders the interface and sends HTTP requests to Django REST Framework endpoints. The backend validates requests, applies permissions, and uses Django's ORM to access SQLite. Uploaded files are stored through Django's configured media storage. During local development, Vite forwards API and media requests to Django.

| Layer | Technology | Purpose |
| --- | --- | --- |
| Interface | React and React Router | Pages, forms, navigation, and role dashboards. |
| Styling | Tailwind CSS and Framer Motion | Responsive layouts and visual transitions. |
| API | Django REST Framework | Serialization, request validation, and endpoints. |
| Authentication | SimpleJWT | Token-based API sessions. |
| Data | SQLite and Django ORM | Account, course, resource, progress, and conversation records. |
| Optional assistant | Gemini API | Responses using supplied course context. |

## 8. Main data entities

- **User:** email, name, password hash, role, and account status.
- **Course:** code, name, description, and assigned faculty.
- **Enrollment:** association between a student and a course.
- **Resource:** course material metadata, file path, and uploader.
- **ResourceCompletion:** association between a student and a completed resource.
- **Mark:** student, course, assessment title, score, and maximum score.
- **ChatMessage:** user, optional course, question, response, and timestamp.

Enrollments and resource completions are unique for each student/course and student/resource pair, respectively. Course resources and marks remain associated with their owning course.

## 9. Authentication and access flow

1. A user submits an email and password from the sign-in screen.
2. The backend locates the user and checks the password hash and account status.
3. Successful authentication returns access and refresh tokens together with user details.
4. The frontend includes the access token with authenticated API requests.
5. The API checks the user's permissions before serving role-specific operations.
6. Signing out clears the stored frontend tokens.

## 10. Demonstration workflow

1. Initialize the database with migrations and run `seed_demo`.
2. Open the administrator dashboard to review people, courses, and totals.
3. Sign in as Geeta Gandi to explore all five assigned demo courses.
4. Open the student dashboard and select an enrolled course.
5. Download a resource and record completion.
6. Review marks and completion totals on the student dashboard.
7. Ask a course question and revisit it through chat history.

Demo passwords and commands are documented in the project README. The seeding command resets demo passwords and should only be used with demonstration data.

## 11. Validation approach

Frontend linting and a production build check the interface and imports. Django system checks verify configuration, while migration checks identify unintended schema changes. The account regression test exercises administrator creation for explicit roles and the default student role. Workflow checks additionally exercise demo login, dashboards, resources, completion, marks, and assistant fallback. These checks do not establish production security or durable preservation guarantees.

## 12. Deployment and storage considerations

Local execution uses a Python backend and Node-based frontend tooling. Separate frontend and backend deployment configurations are provided. The demonstration serverless configuration copies SQLite and bundled media into temporary storage. Persistent database and file storage, private download controls, backups, and operational monitoring are needed before the system handles personal legacy material.

## 13. Future scope

- Personal collections with descriptive preservation metadata.
- Beneficiary invitations and verified access policies.
- Controlled or scheduled release of selected materials.
- Persistent object storage with backups and recovery procedures.
- Search across document contents with suitable access controls.
- Export tools and accessible presentation formats.

These proposals require additional design, implementation, and validation. They are separate from the current academic demonstration.

## 14. Conclusion

Heirloom provides a working foundation for organizing and accessing knowledge through role-specific workflows. Its course library, progress records, and conversational interface support a coherent academic demonstration. Future work can extend that foundation toward the project's digital legacy vision while introducing the storage durability and access controls that personal collections require.
