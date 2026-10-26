import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { api } from "../lib/api"

export default function ChatHistory() {
  const [rows, setRows] = useState([])

  useEffect(() => {
    api("/api/chat/").then(setRows)
  }, [])

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Conversation history</h2>
      {rows.length === 0 && <p className="text-slate-600">No chats yet. Open a course and ask Heirloom.</p>}
      {rows.map((m) => (
        <article key={m.id} className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-glass">
          <p className="text-xs font-semibold text-primary">{m.course_name || "General"}</p>
          <p className="mt-2 font-semibold">{m.question}</p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{m.answer}</p>
          {m.course && (
            <Link to={`/app/courses/${m.course}`} className="mt-3 inline-block text-sm font-semibold text-primary">
              Continue in course
            </Link>
          )}
        </article>
      ))}
    </div>
  )
}
