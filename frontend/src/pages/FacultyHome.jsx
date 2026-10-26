import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { NumberTicker } from "../components/magicui/number-ticker"
import { BentoCard, BentoGrid } from "../components/magicui/bento-grid"
import { api } from "../lib/api"

export default function FacultyHome() {
  const [data, setData] = useState(null)

  useEffect(() => {
    api("/api/dashboard/faculty/").then(setData)
  }, [])

  if (!data) return <div className="h-40 animate-pulse rounded-3xl bg-white/60" />

  return (
    <div className="space-y-6">
      <BentoGrid>
        <BentoCard>
          <p className="text-sm text-slate-600">Courses</p>
          <p className="mt-2 text-4xl font-extrabold">
            <NumberTicker value={data.courses.length} />
          </p>
        </BentoCard>
        <BentoCard>
          <p className="text-sm text-slate-600">Students</p>
          <p className="mt-2 text-4xl font-extrabold">
            <NumberTicker value={data.student_count} />
          </p>
        </BentoCard>
        <BentoCard>
          <p className="text-sm text-slate-600">Resources</p>
          <p className="mt-2 text-4xl font-extrabold">
            <NumberTicker value={data.resource_count} />
          </p>
        </BentoCard>
      </BentoGrid>
      <div className="rounded-3xl border border-white/70 bg-white/75 p-6 shadow-glass">
        <h2 className="mb-4 font-bold">Assigned courses</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {data.courses.map((c) => (
            <Link
              key={c.id}
              to={`/app/faculty/courses/${c.id}`}
              className="cursor-pointer rounded-2xl border border-indigo-50 bg-primary/5 p-4 transition-colors duration-200 hover:bg-primary/10"
            >
              <p className="text-xs font-bold text-primary">{c.code}</p>
              <p className="font-semibold">{c.name}</p>
              <p className="text-sm text-slate-600">{c.student_count} enrolled</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
