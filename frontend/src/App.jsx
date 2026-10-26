import { Navigate, Route, Routes } from "react-router-dom"
import { AppShell } from "./components/AppShell"
import { useAuth } from "./context/AuthContext"
import AdminCourses from "./pages/AdminCourses"
import AdminHome from "./pages/AdminHome"
import AdminPeople from "./pages/AdminPeople"
import ChatHistory from "./pages/ChatHistory"
import CourseDetail from "./pages/CourseDetail"
import Courses from "./pages/Courses"
import FacultyCourse from "./pages/FacultyCourse"
import FacultyHome from "./pages/FacultyHome"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Register from "./pages/Register"
import StudentHome from "./pages/StudentHome"

function Guard({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="grid min-h-screen place-items-center bg-canvas text-ink">Loading Heirloom…</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

function Guest({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="grid min-h-screen place-items-center bg-canvas">Loading…</div>
  if (user) return <Navigate to="/app" replace />
  return children
}

function RoleHome() {
  const { user } = useAuth()
  if (user.role === "faculty") return <FacultyHome />
  if (user.role === "admin") return <AdminHome />
  return <StudentHome />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/login"
        element={
          <Guest>
            <Login />
          </Guest>
        }
      />
      <Route
        path="/register"
        element={
          <Guest>
            <Register />
          </Guest>
        }
      />
      <Route
        path="/app"
        element={
          <Guard>
            <AppShell />
          </Guard>
        }
      >
        <Route index element={<RoleHome />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:id" element={<CourseDetail />} />
        <Route path="chat" element={<ChatHistory />} />
        <Route path="faculty/courses" element={<FacultyHome />} />
        <Route path="faculty/courses/:id" element={<FacultyCourse />} />
        <Route path="admin/users" element={<AdminPeople />} />
        <Route path="admin/courses" element={<AdminCourses />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
