import { useEffect, useState } from "react"
import { NumberTicker } from "../components/magicui/number-ticker"
import { BentoCard, BentoGrid } from "../components/magicui/bento-grid"
import { api } from "../lib/api"

export default function AdminHome() {
  const [data, setData] = useState(null)

  useEffect(() => {
    api("/api/dashboard/admin/").then(setData)
  }, [])

  if (!data) return <div className="h-40 animate-pulse rounded-3xl bg-white/60" />

  const stats = [
    ["Students", data.students],
    ["Faculty", data.faculty],
    ["Courses", data.courses],
    ["Resources", data.resources],
    ["Enrollments", data.enrollments],
    ["Chats", data.chats],
  ]

  return (
    <div className="space-y-6">
      <BentoGrid>
        {stats.map(([label, value]) => (
          <BentoCard key={label}>
            <p className="text-sm text-slate-600">{label}</p>
            <p className="mt-2 text-4xl font-extrabold">
              <NumberTicker value={value} />
            </p>
          </BentoCard>
        ))}
      </BentoGrid>
    </div>
  )
}
