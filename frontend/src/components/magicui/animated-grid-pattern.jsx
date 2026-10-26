import { cn } from "../../lib/utils"

export function AnimatedGridPattern({ className }) {
  return (
    <svg
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full fill-primary/15 stroke-primary/20", className)}
    >
      <defs>
        <pattern id="heirloom-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#heirloom-grid)" />
    </svg>
  )
}
