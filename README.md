# Heirloom: digital legacy, preservation & access system

**Author:** Vigya Upadhyay
**Partners:** Kunal choudhary and priyansh

## Overview

Heirloom brings learning materials, course access, progress records, and contextual assistance into one workspace. Its goal is to keep useful knowledge organized and accessible to the people who need it. The current application supports an academic knowledge library with dedicated student, faculty, and administrator experiences.

Students can create an account, explore courses, enroll, download resources, record completion, review marks, and revisit their assistant conversations. Faculty manage resources and marks for their assigned courses. Administrators manage accounts and the course catalog, assign faculty, and view activity totals.

## Project objectives

- Give notes, assignments, and reference materials a clear place in a course library.
- Help students find resources and keep track of completed work.
- Support faculty with course-specific uploads and student performance records.
- Provide contextual assistance using course descriptions and resource metadata.
- Keep account management and course allocation in a dedicated administrator workspace.

## Main modules

| Module | What it provides |
| --- | --- |
| Accounts and access | Student registration, email login, password hashing, JWT sessions, and role-based API permissions. |
| Course catalog | Course descriptions, faculty assignments, enrollments, and course detail pages. |
| Resource library | Faculty uploads, notes, assignments, reference files, downloads, and completion records. |
| Progress dashboard | Resource completion totals, marks, average scores, and recent activity. |
| Course assistant | Course-context questions, saved conversation history, and a local demonstration fallback. |
| Administration | People management, course management, and summary totals for the demonstration workspace. |

## How to demonstrate Heirloom

1. Sign in as the administrator to explore the overview, people, and courses.
2. Choose the **Faculty · Geeta Gandi** demo button to open the faculty workspace. Geeta is assigned all five demo courses.
3. Sign in as the student to browse enrolled courses and download a resource.
4. Mark a resource complete and return to the dashboard to review progress.
5. Ask a question from a course page, then open chat history to revisit the exchange.

## Development roadmap

The current release focuses on academic knowledge access. Planned digital legacy capabilities include beneficiary management, controlled release of personal collections, preservation metadata, and durable storage. These are future work; they are not available in the current release.

## Technology

- Backend: Django REST Framework, JWT authentication, SQLite.
- Frontend: React, Vite, Tailwind CSS, Framer Motion, and Magic UI–style components.
- Use Python 3.12 and Node.js 24 (npm 11).

## Run locally

### 1. Backend

From the repository root:

```bash
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
cd backend
python manage.py migrate
python manage.py seed_demo
python manage.py runserver
```

On Windows, use `py -3.12 -m venv venv`, `venv\Scripts\activate`, and `copy .env.example .env` instead of the corresponding commands above.

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm ci
npm run dev
```

Open http://localhost:5173. Vite proxies `/api` and `/media` to Django at http://127.0.0.1:8000.

## Demo accounts

Run `seed_demo` only on a demo database; it resets these accounts' passwords.

| Role | Name | Email | Password |
| --- | --- | --- | --- |
| Admin | Vigya Upadhyay | admin@heirloom.test | Admin@123 |
| Faculty | Geeta Gandi | faculty@heirloom.test | Faculty@123 |
| Student | Kunal choudhary | kunal@heirloom.test | Student@123 |
| Student | priyansh | priyansh@heirloom.test | Student@123 |
| Student | BCA Student | student@heirloom.test | Student@123 |

## Optional Gemini assistant

Set `GEMINI_API_KEY` in the root `.env` to enable live answers. Set `GEMINI_MODEL` to a model available to your key. Without a key, chat uses the built-in demo fallback; login, resources, marks, and progress work locally.

## Verification

```bash
cd frontend
npm run lint
npm run build
```

With the Python virtual environment active, from `backend`:

```bash
python manage.py check
python manage.py makemigrations --check --dry-run
python manage.py test
```

The account regression test covers admin creation with each explicit role and the default student role. Additional academic and chatbot test coverage is planned.

## Deployment

The repository contains separate Vercel configurations for `frontend` and `backend`. The API entry point is `backend/heirloom/wsgi.py`.

1. Deploy `backend` as the API project. Set `DJANGO_SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS` to the API hostname, and `CORS_ALLOWED_ORIGINS` to the exact frontend URL. Set Gemini variables if needed.
2. Deploy `frontend` as a Vite project. Set `VITE_API_URL` to the API origin without a trailing slash, then build.
3. Confirm the frontend URL is included in the backend's `CORS_ALLOWED_ORIGINS` and redeploy the API if it changed.

The bundled SQLite database and files are synthetic demo data. On Vercel they are copied to temporary storage and may reset between instances. Use persistent database and file storage, private file access, and proper secret configuration before storing personal legacy material. Hosted deployment has not been verified.

## Project documents

- [Detailed synopsis](Heirloom_Synopsis.md)
- [Presentation](backend/seed/media/resources/Heirloom_Presentation.pptx)

The synopsis describes the current modules, architecture, demonstration workflow, and future scope. Presentation content can be refined using the project team's Word and PDF submissions.
