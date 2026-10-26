import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { BookOpen, LayoutDashboard, LogOut, MessageSquare, Sparkles, Users } from "lucide-react"
import { useAuth } from "../context/AuthContext"

const links = {
  student: [
    { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/app/courses", label: "Courses", icon: BookOpen },
    { to: "/app/chat", label: "Heirloom Chat", icon: MessageSquare },
  ],
  faculty: [
    { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/app/faculty/courses", label: "My courses", icon: BookOpen },
  ],
  admin: [
    { to: "/app", label: "Overview", icon: LayoutDashboard, end: true },
    { to: "/app/admin/users", label: "People", icon: Users },
    { to: "/app/admin/courses", label: "Courses", icon: BookOpen },
  ],
}

export function AppShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const items = links[user?.role] || []

  return (
    <div className="min-h-screen bg-canvas">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(129,140,248,0.28),_transparent_45%),radial-gradient(ellipse_at_bottom_left,_rgba(16,185,129,0.12),_transparent_40%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-4 md:px-6">
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="sticky top-4 rounded-3xl border border-white/70 bg-white/75 p-5 shadow-glass backdrop-blur-xl">
            <div className="mb-8 flex items-center gap-2 font-bold text-ink">
              <span className="grid h-9 w-9 place-items-center rounded-2xl bg-primary text-white">
                <Sparkles className="h-4 w-4" />
              </span>
              Heirloom
            </div>
            <nav className="space-y-1">
              {items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                      isActive ? "bg-primary text-white" : "text-slate-600 hover:bg-primary/10 hover:text-ink"
                    }`
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <button
              type="button"
              onClick={() => {
                logout()
                navigate("/")
              }}
              className="mt-10 flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-rose-50 hover:text-rose-600"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </aside>
        <div className="min-w-0 flex-1 pb-20 md:pb-6">
          <header className="mb-6 flex items-center justify-between rounded-3xl border border-white/70 bg-white/70 px-5 py-4 shadow-glass backdrop-blur-xl">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">{user?.role}</p>
              <h1 className="text-lg font-bold text-ink">{user?.full_name}</h1>
            </div>
            <p className="hidden text-sm text-slate-600 sm:block">{user?.email}</p>
          </header>
          <Outlet />
        </div>
      </div>
      <nav className="fixed bottom-3 left-3 right-3 z-20 flex justify-around rounded-2xl border border-white/70 bg-white/90 p-2 shadow-lift backdrop-blur-xl md:hidden">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex cursor-pointer flex-col items-center gap-1 rounded-xl px-3 py-1 text-[11px] font-medium ${
                isActive ? "text-primary" : "text-slate-500"
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
