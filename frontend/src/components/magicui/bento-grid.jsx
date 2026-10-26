import { cn } from "../../lib/utils"

export function BentoGrid({ children, className }) {
  return <div className={cn("grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-4 md:grid-cols-3", className)}>{children}</div>
}

export function BentoCard({ className, children }) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-6 shadow-glass backdrop-blur-xl",
        "transition-colors duration-200 hover:border-primary/30",
        className
      )}
    >
      {children}
    </div>
  )
}
