import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { MagicCard } from "../components/magicui/magic-card"
import { ShimmerButton } from "../components/magicui/shimmer-button"
import { api } from "../lib/api"

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [error, setError] = useState("")

  function load() {
    api("/api/courses/")
      .then(setCourses)
      .catch((e) => setError(e.message))
  }

  useEffect(load, [])

  async function enroll(id) {
    await api(`/api/courses/${id}/enroll/`, { method: "POST", body: "{}" })
    load()
  }

  if (error) return <p className="text-rose-600">{error}</p>

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {courses.map((c) => (
        <MagicCard key={c.id}>
          <p className="text-xs font-bold uppercase tracking-wide text-primary">{c.code}</p>
          <h2 className="mt-1 text-xl font-bold">{c.name}</h2>
          <p className="mt-2 text-sm text-slate-600">{c.description}</p>
          <p className="mt-3 text-xs text-slate-500">Faculty: {c.faculty_detail?.full_name || "Unassigned"}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {c.enrolled ? (
              <Link
                to={`/app/courses/${c.id}`}
                className="cursor-pointer rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-600"
              >
                Open course
              </Link>
            ) : (
              <ShimmerButton type="button" onClick={() => enroll(c.id)} className="px-4 py-2">
                Enroll
              </ShimmerButton>
            )}
          </div>
        </MagicCard>
      ))}
    </div>
  )
}
