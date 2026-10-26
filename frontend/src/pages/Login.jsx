import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Sparkles } from "lucide-react"
import { BorderBeam } from "../components/magicui/border-beam"
import { ShimmerButton } from "../components/magicui/shimmer-button"
import { useAuth } from "../context/AuthContext"

const demos = [
  { role: "Student · Kunal choudhary", email: "kunal@heirloom.test", password: "Student@123" },
  { role: "Student · priyansh", email: "priyansh@heirloom.test", password: "Student@123" },
  { role: "Student", email: "student@heirloom.test", password: "Student@123" },
  { role: "Faculty · Geeta Gandi", email: "faculty@heirloom.test", password: "Faculty@123" },
  { role: "Admin", email: "admin@heirloom.test", password: "Admin@123" },
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError("")
    setBusy(true)
    try {
      const user = await login(email, password)
      navigate("/app")
      return user
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-canvas px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.2),transparent_40%)]" />
      <div className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-indigo-100 bg-white/70 p-8 shadow-lift backdrop-blur-xl">
        <BorderBeam />
        <div className="relative z-10">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 font-bold text-ink">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-primary text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            Heirloom
          </Link>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-600">Enter your email and password to open your dashboard.</p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-semibold">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-indigo-100 bg-white px-4 py-3 text-sm outline-none ring-primary/30 focus:ring-2"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-semibold">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-indigo-100 bg-white px-4 py-3 text-sm outline-none ring-primary/30 focus:ring-2"
                required
              />
            </div>
            {error && <p className="rounded-2xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
            <ShimmerButton type="submit" disabled={busy} className="w-full disabled:opacity-60">
              {busy ? "Checking…" : "Sign in"}
            </ShimmerButton>
          </form>
          <p className="mt-4 text-sm text-slate-600">
            New student?{" "}
            <Link to="/register" className="font-semibold text-primary">
              Create an account
            </Link>
          </p>
          <div className="mt-6 grid gap-2">
            {demos.map((d) => (
              <button
                key={d.role}
                type="button"
                onClick={() => {
                  setEmail(d.email)
                  setPassword(d.password)
                }}
                className="cursor-pointer rounded-2xl border border-indigo-50 bg-primary/5 px-3 py-2 text-left text-xs text-slate-600 transition-colors duration-200 hover:bg-primary/10"
              >
                <span className="font-semibold text-ink">{d.role}</span> · {d.email}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
