import { useEffect, useState } from "react"
import { ShimmerButton } from "../components/magicui/shimmer-button"
import { api } from "../lib/api"

export default function AdminCourses() {
  const [courses, setCourses] = useState([])
  const [faculty, setFaculty] = useState([])
  const [form, setForm] = useState({ code: "", name: "", description: "", faculty: "" })

  function load() {
    api("/api/courses/").then(setCourses)
    api("/api/auth/admin/users/").then((users) => setFaculty(users.filter((u) => u.role === "faculty")))
  }

  useEffect(load, [])

  async function create(e) {
    e.preventDefault()
    await api("/api/courses/", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        faculty: form.faculty ? Number(form.faculty) : null,
      }),
    })
    setForm({ code: "", name: "", description: "", faculty: "" })
    load()
  }

  async function assign(courseId, facultyId) {
    await api(`/api/courses/${courseId}/`, {
      method: "PATCH",
      body: JSON.stringify({ faculty: facultyId ? Number(facultyId) : null }),
    })
    load()
  }

  return (
    <div className="space-y-6">
      <form onSubmit={create} className="grid gap-3 rounded-3xl border border-white/70 bg-white/75 p-5 shadow-glass md:grid-cols-2">
        <h2 className="font-bold md:col-span-2">Create course</h2>
        <div>
          <label htmlFor="code" className="text-sm font-semibold">
            Code
          </label>
          <input
            id="code"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            className="mt-1 w-full rounded-2xl border border-indigo-100 px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="name" className="text-sm font-semibold">
            Name
          </label>
          <input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full rounded-2xl border border-indigo-100 px-3 py-2 text-sm"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="desc" className="text-sm font-semibold">
            Description
          </label>
          <textarea
            id="desc"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1 w-full rounded-2xl border border-indigo-100 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="fac" className="text-sm font-semibold">
            Faculty
          </label>
          <select
            id="fac"
            value={form.faculty}
            onChange={(e) => setForm({ ...form, faculty: e.target.value })}
            className="mt-1 w-full rounded-2xl border border-indigo-100 px-3 py-2 text-sm"
          >
            <option value="">Unassigned</option>
            {faculty.map((f) => (
              <option key={f.id} value={f.id}>
                {f.full_name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <ShimmerButton type="submit">Add course</ShimmerButton>
        </div>
      </form>

      <div className="space-y-3">
        {courses.map((c) => (
          <div key={c.id} className="flex flex-col gap-3 rounded-3xl border border-white/70 bg-white/75 p-4 shadow-glass md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold text-primary">{c.code}</p>
              <p className="font-semibold">{c.name}</p>
            </div>
            <label className="text-sm">
              Assign faculty
              <select
                className="ml-2 rounded-xl border border-indigo-100 px-2 py-1"
                value={c.faculty || ""}
                onChange={(e) => assign(c.id, e.target.value)}
              >
                <option value="">Unassigned</option>
                {faculty.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.full_name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}
