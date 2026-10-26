import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Sparkles } from "lucide-react"
import { BorderBeam } from "../components/magicui/border-beam"
import { ShimmerButton } from "../components/magicui/shimmer-button"
import { useAuth } from "../context/AuthContext"

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError("")
    setBusy(true)
    try {
      await register({ full_name: fullName, email, password })
      navigate("/app")
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 py-10">
      <div className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-indigo-100 bg-white/70 p-8 shadow-lift backdrop-blur-xl">
        <BorderBeam colorFrom="#10B981" colorTo="#6366F1" />
        <div className="relative z-10">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-primary text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            Heirloom
          </Link>
          <h1 className="text-2xl font-bold">Create student account</h1>
          <p className="mt-1 text-sm text-slate-600">Faculty and admin accounts are created by the platform admin.</p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="name" className="text-sm font-semibold">
                Full name
              </label>
              <input
                id="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-indigo-100 bg-white px-4 py-3 text-sm outline-none ring-primary/30 focus:ring-2"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-semibold">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-indigo-100 bg-white px-4 py-3 text-sm outline-none ring-primary/30 focus:ring-2"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-semibold">
                Password (min 8 characters)
              </label>
              <input
                id="password"
                type="password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-indigo-100 bg-white px-4 py-3 text-sm outline-none ring-primary/30 focus:ring-2"
                required
              />
            </div>
            {error && <p className="rounded-2xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
            <ShimmerButton type="submit" disabled={busy} className="w-full">
              {busy ? "Creating…" : "Register"}
            </ShimmerButton>
          </form>
          <p className="mt-4 text-sm text-slate-600">
            Already enrolled?{" "}
            <Link to="/login" className="font-semibold text-primary">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
