import { cn } from "../../lib/utils"

export function AnimatedShinyText({ children, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-indigo-100 bg-white/70 px-3 py-1 text-xs font-semibold text-primary",
        className
      )}
    >
      <span className="bg-[linear-gradient(110deg,#4338CA,45%,#818CF8,55%,#4338CA)] bg-[length:200%_100%] bg-clip-text text-transparent motion-safe-only animate-shimmer">
        {children}
      </span>
    </span>
  )
}
