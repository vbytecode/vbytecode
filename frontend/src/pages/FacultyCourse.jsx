import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { ShimmerButton } from "../components/magicui/shimmer-button"
import { MagicCard } from "../components/magicui/magic-card"
import { api } from "../lib/api"

export default function FacultyCourse() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [students, setStudents] = useState([])
  const [resources, setResources] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState("notes")
  const [file, setFile] = useState(null)
  const [mark, setMark] = useState({ student: "", title: "Quiz", score: "", max_score: "100" })
  const [message, setMessage] = useState("")

  function reload() {
    api(`/api/courses/${id}/`).then(setCourse)
    api(`/api/courses/${id}/students/`).then(setStudents)
    api(`/api/resources/?course=${id}`).then(setResources)
  }

  useEffect(reload, [id])

  async function upload(e) {
    e.preventDefault()
    const form = new FormData()
    form.append("course", id)
    form.append("title", title)
    form.append("description", description)
    form.append("resource_type", type)
    if (file) form.append("file", file)
    await api("/api/resources/", { method: "POST", body: form })
    setTitle("")
    setDescription("")
    setFile(null)
    setMessage("Resource uploaded.")
    reload()
  }

  async function addMark(e) {
    e.preventDefault()
    await api("/api/marks/", {
      method: "POST",
      body: JSON.stringify({
        course: Number(id),
        student: Number(mark.student),
        title: mark.title,
        score: mark.score,
        max_score: mark.max_score,
      }),
    })
    setMessage("Mark saved.")
  }

  if (!course) return <div className="h-40 animate-pulse rounded-3xl bg-white/60" />

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <MagicCard>
        <h2 className="text-xl font-bold">
          {course.code} · {course.name}
        </h2>
        {message && <p className="mt-2 text-sm text-cta">{message}</p>}
        <form onSubmit={upload} className="mt-4 space-y-3">
          <h3 className="font-semibold">Upload resource</h3>
          <label htmlFor="rt" className="text-sm font-semibold">
            Title
          </label>
          <input
            id="rt"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-2xl border border-indigo-100 px-3 py-2 text-sm"
            required
          />
          <label htmlFor="rd" className="text-sm font-semibold">
            Description
          </label>
          <textarea
            id="rd"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-2xl border border-indigo-100 px-3 py-2 text-sm"
          />
          <label htmlFor="ty" className="text-sm font-semibold">
            Type
          </label>
          <select id="ty" value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-2xl border border-indigo-100 px-3 py-2 text-sm">
            <option value="notes">Notes</option>
            <option value="assignment">Assignment</option>
            <option value="reference">Reference</option>
          </select>
          <label htmlFor="file" className="text-sm font-semibold">
            File
          </label>
          <input id="file" type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full text-sm" />
          <ShimmerButton type="submit">Upload</ShimmerButton>
        </form>
      </MagicCard>

      <MagicCard>
        <h3 className="font-semibold">Enter marks</h3>
        <form onSubmit={addMark} className="mt-4 space-y-3">
          <label htmlFor="st" className="text-sm font-semibold">
            Student
          </label>
          <select
            id="st"
            value={mark.student}
            onChange={(e) => setMark({ ...mark, student: e.target.value })}
            className="w-full rounded-2xl border border-indigo-100 px-3 py-2 text-sm"
            required
          >
            <option value="">Select</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.full_name} ({s.email})
              </option>
            ))}
          </select>
          <label htmlFor="mt" className="text-sm font-semibold">
            Title
          </label>
          <input
            id="mt"
            value={mark.title}
            onChange={(e) => setMark({ ...mark, title: e.target.value })}
            className="w-full rounded-2xl border border-indigo-100 px-3 py-2 text-sm"
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="sc" className="text-sm font-semibold">
                Score
              </label>
              <input
                id="sc"
                type="number"
                value={mark.score}
                onChange={(e) => setMark({ ...mark, score: e.target.value })}
                className="w-full rounded-2xl border border-indigo-100 px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="mx" className="text-sm font-semibold">
                Max
              </label>
              <input
                id="mx"
                type="number"
                value={mark.max_score}
                onChange={(e) => setMark({ ...mark, max_score: e.target.value })}
                className="w-full rounded-2xl border border-indigo-100 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <ShimmerButton type="submit">Save mark</ShimmerButton>
        </form>
        <ul className="mt-6 space-y-2 text-sm">
          {resources.map((r) => (
            <li key={r.id} className="rounded-2xl bg-primary/5 px-3 py-2">
              {r.title}
            </li>
          ))}
        </ul>
      </MagicCard>
    </div>
  )
}
