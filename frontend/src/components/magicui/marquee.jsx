import { cn } from "../../lib/utils"

export function Marquee({ children, className, pauseOnHover = true }) {
  return (
    <div
      className={cn(
        "flex overflow-hidden --duration",
        pauseOnHover && "[&:hover_.track]:[animation-play-state:paused]",
        className
      )}
    >
      <div className="track flex min-w-full shrink-0 gap-4 motion-safe-only animate-marquee" style={{ "--duration": "32s" }}>
        {children}
        {children}
      </div>
    </div>
  )
}
