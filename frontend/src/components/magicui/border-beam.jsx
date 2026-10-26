import { cn } from "../../lib/utils"

export function BorderBeam({ className, size = 180, duration = 8, colorFrom = "#6366F1", colorTo = "#10B981" }) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden", className)}
      aria-hidden
    >
      <div
        className="absolute left-1/2 top-1/2 motion-safe-only animate-border-spin"
        style={{
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          animationDuration: `${duration}s`,
          background: `conic-gradient(from 0deg, transparent 0 70%, ${colorFrom}, ${colorTo}, transparent)`,
        }}
      />
      <div className="absolute inset-[1px] rounded-[inherit] bg-white/80 backdrop-blur-xl" />
    </div>
  )
}
