import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Check, Download, Send } from "lucide-react"
import { MagicCard } from "../components/magicui/magic-card"
import { ShimmerButton } from "../components/magicui/shimmer-button"
import { api } from "../lib/api"

export default function CourseDetail() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [resources, setResources] = useState([])
  const [question, setQuestion] = useState("")
  const [messages, setMessages] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    api(`/api/courses/${id}/`).then(setCourse)
    api(`/api/resources/?course=${id}`).then(setResources)
    api(`/api/chat/?course=${id}`).then((rows) => setMessages([...rows].reverse()))
  }, [id])

  async function complete(rid) {
    await api(`/api/resources/${rid}/complete/`, { method: "POST", body: "{}" })
    setResources((prev) => prev.map((r) => (r.id === rid ? { ...r, completed: true } : r)))
  }

  async function ask(e) {
    e.preventDefault()
    if (!question.trim()) return
    setBusy(true)
    setError("")
    try {
      const res = await api("/api/chat/", {
        method: "POST",
        body: JSON.stringify({ question, course: Number(id) }),
      })
      setMessages((m) => [...m, res])
      setQuestion("")
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (!course) return <div className="h-40 animate-pulse rounded-3xl bg-white/60" />

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-4">
        <MagicCard>
          <p className="text-xs font-bold text-primary">{course.code}</p>
          <h2 className="text-2xl font-bold">{course.name}</h2>
          <p className="mt-2 text-sm text-slate-600">{course.description}</p>
        </MagicCard>
        {resources.map((r) => (
          <MagicCard key={r.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-primary">{r.resource_type}</p>
                <h3 className="font-bold">{r.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{r.description}</p>
              </div>
              {r.completed && <Check className="h-5 w-5 text-cta" />}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {r.file_url && (
                <a
                  href={r.file_url}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-indigo-100 px-3 py-2 text-sm font-semibold transition-colors duration-200 hover:bg-primary/5"
                >
                  <Download className="h-4 w-4" />
                  Download
                </a>
              )}
              {!r.completed && (
                <button
                  type="button"
                  onClick={() => complete(r.id)}
                  className="cursor-pointer rounded-full bg-cta px-3 py-2 text-sm font-semibold text-white"
                >
                  Mark complete
                </button>
              )}
            </div>
          </MagicCard>
        ))}
      </div>

      <div className="flex min-h-[480px] flex-col rounded-3xl border border-white/70 bg-white/75 p-5 shadow-glass backdrop-blur-xl">
        <h3 className="font-bold">Ask Heirloom about {course.name}</h3>
        <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
          {messages.length === 0 && <p className="text-sm text-slate-600">Ask anything from this course’s notes.</p>}
          {messages.map((m) => (
            <div key={m.id} className="space-y-2">
              <div className="ml-8 rounded-2xl bg-primary px-4 py-3 text-sm text-white">{m.question}</div>
              <div className="mr-8 whitespace-pre-wrap rounded-2xl bg-indigo-50 px-4 py-3 text-sm text-ink">{m.answer}</div>
            </div>
          ))}
        </div>
        {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
        <form onSubmit={ask} className="mt-4 flex gap-2">
          <label htmlFor="q" className="sr-only">
            Question
          </label>
          <input
            id="q"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. Explain normalization"
            className="flex-1 rounded-2xl border border-indigo-100 bg-white px-4 py-3 text-sm outline-none ring-primary/30 focus:ring-2"
          />
          <ShimmerButton type="submit" disabled={busy} className="px-4">
            <Send className="h-4 w-4" />
          </ShimmerButton>
        </form>
      </div>
    </div>
  )
}
