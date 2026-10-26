import json
import urllib.error
import urllib.request
from datetime import timedelta

from django.conf import settings
from django.utils import timezone

from chatbot.models import ChatMessage


def _generate(api_key, model, prompt):
    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"{model}:generateContent?key={api_key}"
    )
    payload = json.dumps({"contents": [{"parts": [{"text": prompt}]}]}).encode("utf-8")
    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        body = json.loads(resp.read().decode("utf-8"))
    text = (
        body.get("candidates", [{}])[0]
        .get("content", {})
        .get("parts", [{}])[0]
        .get("text")
    )
    if not text:
        return None, "empty"
    return text.strip(), None


def _call_gemini(prompt):
    api_key = (settings.GEMINI_API_KEY or "").strip()
    if not api_key:
        return None, "missing_key"
    models = []
    primary = settings.GEMINI_MODEL
    for name in (primary, "gemini-3.8-flash", "gemini-flash-latest"):
        if name and name not in models:
            models.append(name)
    last_error = "network"
    for model in models:
        try:
            return _generate(api_key, model, prompt)
        except urllib.error.HTTPError as exc:
            last_error = f"http_{exc.code}"
            if exc.code not in (404, 400):
                return None, last_error
        except Exception:
            return None, "network"
    return None, last_error


def _course_context(course):
    if not course:
        return "No specific course selected."
    parts = [f"Course: {course.code} — {course.name}", course.description or ""]
    for resource in course.resources.all()[:8]:
        snippet = (resource.description or "")[:400]
        parts.append(f"- {resource.title} ({resource.get_resource_type_display()}): {snippet}")
    return "\n".join(parts)


def answer_question(user, course, question):
    recent = ChatMessage.objects.filter(
        user=user, created_at__gte=timezone.now() - timedelta(seconds=60)
    ).count()
    if recent >= 10:
        return (
            "You are sending questions too quickly. Please wait a moment and try again.",
            "rate_limited",
        )

    context = _course_context(course)
    prompt = (
        "You are Heirloom, a college academic assistant for BCA students. "
        "Answer clearly and helpfully using the course context. "
        "If the answer is not in the context, say so and give a careful general explanation. "
        "Keep answers concise (under 280 words). Do not invent grades or personal data.\n\n"
        f"COURSE CONTEXT:\n{context}\n\n"
        f"STUDENT QUESTION:\n{question}"
    )
    text, error = _call_gemini(prompt)
    if error == "missing_key":
        fallback = (
            "Heirloom is running in demo mode (no Gemini API key). "
            "Add GEMINI_API_KEY to your .env file to enable live answers. "
            "Based on your course materials: "
        )
        if course:
            titles = list(course.resources.values_list("title", flat=True)[:5])
            fallback += (
                f"You asked about {course.name}. Available resources: "
                + (", ".join(titles) if titles else "none uploaded yet.")
            )
        else:
            fallback += "Enroll in a course and ask from the course page for better context."
        return fallback, "fallback"
    if error:
        return (
            "I could not reach the AI service right now. Please try again shortly. "
            "Your notes and progress are still available in the dashboard.",
            error,
        )
    return text, None
