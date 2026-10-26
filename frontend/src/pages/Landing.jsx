import { Link } from "react-router-dom"
import { BookOpen, Bot, LineChart, Shield, Sparkles } from "lucide-react"
import { AnimatedGridPattern } from "../components/magicui/animated-grid-pattern"
import { AnimatedShinyText } from "../components/magicui/animated-shiny-text"
import { BentoCard, BentoGrid } from "../components/magicui/bento-grid"
import { BlurFade } from "../components/magicui/blur-fade"
import { Marquee } from "../components/magicui/marquee"
import { ShimmerButton } from "../components/magicui/shimmer-button"
import { MagicCard } from "../components/magicui/magic-card"

const courses = ["Python", "DBMS", "Web Dev", "Data Structures", "Networks", "OOP"]

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas text-ink">
      <AnimatedGridPattern className="opacity-60 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,0.22),transparent_35%),radial-gradient(circle_at_90%_20%,rgba(16,185,129,0.16),transparent_30%)]" />

      <nav className="relative z-10 mx-4 mt-4 flex items-center justify-between rounded-2xl border border-white/70 bg-white/80 px-5 py-3 shadow-glass backdrop-blur-xl md:mx-auto md:max-w-6xl">
        <div className="flex items-center gap-2 font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-primary text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          Heirloom
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="cursor-pointer text-sm font-semibold text-slate-600 transition-colors duration-200 hover:text-ink">
            Sign in
          </Link>
          <Link to="/register">
            <ShimmerButton className="px-4 py-2">Join as student</ShimmerButton>
          </Link>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-16 md:pt-24">
        <BlurFade>
          <div className="mb-6">
            <AnimatedShinyText>Heirloom · Preserve knowledge. Share access.</AnimatedShinyText>
          </div>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Heirloom: digital legacy, preservation &amp; access system
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600">
            Keep knowledge within reach. Organize course resources, ask Heirloom in natural language, and track
            your progress — with access for students, faculty, and admins.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register">
              <ShimmerButton>Start learning</ShimmerButton>
            </Link>
            <Link
              to="/login"
              className="cursor-pointer rounded-full border border-indigo-100 bg-white/80 px-6 py-3 text-sm font-semibold text-ink transition-colors duration-200 hover:border-primary/40"
            >
              Demo login
            </Link>
          </div>
        </BlurFade>

        <div className="mt-14">
          <Marquee>
            {courses.map((c) => (
              <span key={c} className="rounded-full border border-white/80 bg-white/70 px-4 py-2 text-sm font-semibold text-primary shadow-sm">
                {c}
              </span>
            ))}
          </Marquee>
        </div>

        <BlurFade delay={0.1} className="mt-16">
          <BentoGrid>
            <BentoCard className="md:col-span-2">
              <Bot className="h-6 w-6 text-primary" />
              <h3 className="mt-4 text-xl font-bold">Course-aware chatbot</h3>
              <p className="mt-2 text-slate-600">Gemini answers using your notes, assignments, and course context — with a demo fallback if no API key is set.</p>
            </BentoCard>
            <BentoCard>
              <BookOpen className="h-6 w-6 text-primary" />
              <h3 className="mt-4 text-xl font-bold">Study locker</h3>
              <p className="mt-2 text-slate-600">Faculty upload notes. Students browse, download, and mark them complete.</p>
            </BentoCard>
            <BentoCard>
              <LineChart className="h-6 w-6 text-cta" />
              <h3 className="mt-4 text-xl font-bold">Progress pulse</h3>
              <p className="mt-2 text-slate-600">Marks and completion bars on a glass dashboard.</p>
            </BentoCard>
            <BentoCard className="md:col-span-2">
              <Shield className="h-6 w-6 text-primary" />
              <h3 className="mt-4 text-xl font-bold">Three roles, one campus</h3>
              <p className="mt-2 text-slate-600">Students learn, faculty teach, admins assign courses — with secure hashed passwords and JWT sessions.</p>
            </BentoCard>
          </BentoGrid>
        </BlurFade>

        <section className="mt-16" aria-labelledby="about-heirloom">
          <h2 id="about-heirloom" className="text-3xl font-bold">Knowledge deserves a lasting place.</h2>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            Heirloom brings resources, learning activity, and helpful conversations into one workspace.
            Start with a course, find the material you need, and build a clearer picture of your progress.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              ["01", "Discover your courses", "Browse the catalog, enroll in a course, and find notes, assignments, and reference material together."],
              ["02", "Make steady progress", "Download resources, mark completed work, and review your recorded marks from your dashboard."],
              ["03", "Return to what matters", "Revisit course resources and saved conversations whenever you need to refresh your understanding."],
            ].map(([step, title, description]) => (
              <article key={step} className="rounded-3xl border border-white/70 bg-white/75 p-6 shadow-glass">
                <p className="text-sm font-bold text-primary">{step}</p>
                <h3 className="mt-3 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-white/70 bg-white/75 p-8 shadow-glass" aria-labelledby="faculty-workspace">
          <p className="text-sm font-semibold text-primary">A workspace for every role</p>
          <h2 id="faculty-workspace" className="mt-2 text-3xl font-bold">Meet your demo faculty: Geeta Gandi</h2>
          <p className="mt-4 max-w-3xl text-slate-600">
            Explore Python Programming, Database Management Systems, Web Development, Data Structures, and Computer Networks from the faculty perspective.
            Review enrolled students, publish resources, and record marks for assigned courses.
            Students have their own progress dashboard, while administrators manage the people and course catalog.
          </p>
          <Link to="/login" className="mt-6 inline-block font-semibold text-primary underline underline-offset-4">Explore the demo accounts</Link>
        </section>

        <section className="mt-16" aria-labelledby="heirloom-questions">
          <h2 id="heirloom-questions" className="text-3xl font-bold">Before you begin</h2>
          <div className="mt-6 space-y-4">
            {[
              ["Who can create an account?", "Students can register directly. Faculty and administrator accounts are created by the platform administrator."],
              ["What can I keep in the resource library?", "Faculty can upload course notes, assignments, and reference files. Students access materials for the courses they join."],
              ["How does the assistant help?", "Ask a question with course context and revisit your conversation history. The demo can also guide you to available resources."],
            ].map(([question, answer]) => (
              <details key={question} className="rounded-2xl border border-white/70 bg-white/75 p-5">
                <summary className="cursor-pointer font-semibold">{question}</summary>
                <p className="mt-3 text-slate-600">{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <BlurFade delay={0.15} className="mt-16">
          <MagicCard>
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="text-sm font-semibold text-primary">Project team</p>
                <h2 className="mt-1 text-2xl font-bold">Team Heirloom</h2>
                <p className="mt-2 text-slate-600">Author: Vigya Upadhyay</p>
                <p className="mt-1 text-slate-600">Partners: Kunal choudhary · priyansh</p>
              </div>
              <Link to="/register">
                <ShimmerButton>Create student account</ShimmerButton>
              </Link>
            </div>
          </MagicCard>
        </BlurFade>
      </main>
    </div>
  )
}
