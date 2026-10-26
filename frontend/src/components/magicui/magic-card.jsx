import { useRef, useState } from "react"
import { cn } from "../../lib/utils"

export function MagicCard({ children, className }) {
  const ref = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0, show: false })

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const rect = ref.current.getBoundingClientRect()
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, show: true })
      }}
      onMouseLeave={() => setPos((p) => ({ ...p, show: false }))}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-indigo-100 bg-white/80 p-6 shadow-glass backdrop-blur-xl",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-200"
        style={{
          opacity: pos.show ? 1 : 0,
          background: `radial-gradient(240px circle at ${pos.x}px ${pos.y}px, rgba(99,102,241,0.18), transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
