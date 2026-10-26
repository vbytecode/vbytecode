import { useEffect, useState } from "react"
import { ShimmerButton } from "../components/magicui/shimmer-button"
import { api } from "../lib/api"

export default function AdminPeople() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ email: "", full_name: "", role: "faculty", password: "Heirloom@123" })
  const [message, setMessage] = useState("")

  function load() {
    api("/api/auth/admin/users/").then(setUsers)
  }

  useEffect(load, [])

  async function create(e) {
    e.preventDefault()
    await api("/api/auth/admin/users/", { method: "POST", body: JSON.stringify(form) })
    setMessage("User created.")
    setForm({ email: "", full_name: "", role: "faculty", password: "Heirloom@123" })
    load()
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/75 shadow-glass">
        <table className="w-full text-left text-sm">
          <thead className="bg-primary/5 text-xs uppercase text-slate-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-indigo-50">
                <td className="px-4 py-3 font-semibold">{u.full_name}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3 capitalize">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form onSubmit={create} className="space-y-3 rounded-3xl border border-white/70 bg-white/75 p-5 shadow-glass">
        <h2 className="font-bold">Add faculty / admin</h2>
        {message && <p className="text-sm text-cta">{message}</p>}
        <label htmlFor="n" className="text-sm font-semibold">
          Full name
        </label>
        <input
          id="n"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          className="w-full rounded-2xl border border-indigo-100 px-3 py-2 text-sm"
          required
        />
        <label htmlFor="e" className="text-sm font-semibold">
          Email
        </label>
        <input
          id="e"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-2xl border border-indigo-100 px-3 py-2 text-sm"
          required
        />
        <label htmlFor="r" className="text-sm font-semibold">
          Role
        </label>
        <select
          id="r"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full rounded-2xl border border-indigo-100 px-3 py-2 text-sm"
        >
          <option value="faculty">Faculty</option>
          <option value="admin">Admin</option>
          <option value="student">Student</option>
        </select>
        <ShimmerButton type="submit" className="w-full">
          Create
        </ShimmerButton>
      </form>
    </div>
  )
}
