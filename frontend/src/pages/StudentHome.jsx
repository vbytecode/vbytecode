import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { BookOpen, MessageSquare, Sparkles } from "lucide-react"
import { BentoCard, BentoGrid } from "../components/magicui/bento-grid"
import { NumberTicker } from "../components/magicui/number-ticker"
import { BlurFade } from "../components/magicui/blur-fade"
import { api } from "../lib/api"

export default function StudentHome() {
  const [data, setData] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    api("/api/dashboard/student/")
      .then(setData)
      .catch((e) => setError(e.message))
  }, [])

  if (error) return <p className="text-rose-600">{error}</p>
  if (!data) return <div className="h-40 animate-pulse rounded-3xl bg-white/60" />

  const pct = data.total_resources ? Math.round((data.completions / data.total_resources) * 100) : 0

  return (
    <div className="space-y-6">
      <BlurFade>
        <BentoGrid>
          <BentoCard>
            <p className="text-sm font-medium text-slate-600">Courses</p>
            <p className="mt-3 text-4xl font-extrabold text-ink">
              <NumberTicker value={data.courses.length} />
            </p>
          </BentoCard>
          <BentoCard>
            <p className="text-sm font-medium text-slate-600">Avg score</p>
            <p className="mt-3 text-4xl font-extrabold text-ink">
              <NumberTicker value={data.average_score} suffix="%" />
            </p>
          </BentoCard>
          <BentoCard>
            <p className="text-sm font-medium text-slate-600">Heirloom chats</p>
            <p className="mt-3 text-4xl font-extrabold text-ink">
              <NumberTicker value={data.chat_count} />
            </p>
          </BentoCard>
        </BentoGrid>
      </BlurFade>

      <div className="rounded-3xl border border-white/70 bg-white/75 p-6 shadow-glass backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Resource completion</h2>
          <span className="text-sm font-semibold text-primary">{pct}%</span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-indigo-50">
          <div className="h-full rounded-full bg-cta transition-[width] duration-500" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-sm text-slate-600">
          {data.completions} of {data.total_resources} notes marked done
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/70 bg-white/75 p-6 shadow-glass">
          <h2 className="mb-4 font-bold">Your courses</h2>
          <div className="space-y-3">
            {data.courses.map((c) => (
              <Link
                key={c.id}
                to={`/app/courses/${c.id}`}
                className="flex cursor-pointer items-center justify-between rounded-2xl border border-indigo-50 bg-primary/5 px-4 py-3 transition-colors duration-200 hover:bg-primary/10"
              >
                <span>
                  <span className="block text-xs font-semibold text-primary">{c.code}</span>
                  <span className="font-semibold">{c.name}</span>
                </span>
                <BookOpen className="h-4 w-4 text-primary" />
              </Link>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-white/70 bg-white/75 p-6 shadow-glass">
          <h2 className="mb-4 font-bold">Recent marks</h2>
          {data.marks.length === 0 && <p className="text-sm text-slate-600">No marks yet.</p>}
          <ul className="space-y-3">
            {data.marks.map((m) => (
              <li key={m.id} className="flex items-center justify-between text-sm">
                <span className="font-medium">{m.title}</span>
                <span className="font-bold text-cta">
                  {m.score}/{m.max_score}
                </span>
              </li>
            ))}
          </ul>
          <Link to="/app/chat" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <Sparkles className="h-4 w-4" />
            Ask Heirloom
            <MessageSquare className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
