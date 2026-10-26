import { motion, useReducedMotion } from "framer-motion"
import { cn } from "../../lib/utils"

export function ShimmerButton({ className, children, ...props }) {
  const reduce = useReducedMotion()
  return (
    <motion.button
      whileHover={reduce ? undefined : { y: -1 }}
      whileTap={reduce ? undefined : { scale: 0.98 }}
      className={cn(
        "relative isolate cursor-pointer overflow-hidden rounded-full px-6 py-3 text-sm font-semibold text-white",
        "bg-cta shadow-lg shadow-emerald-500/25 transition-colors duration-200",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta",
        className
      )}
      {...props}
    >
      {!reduce && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.45),transparent)] bg-[length:200%_100%] motion-safe-only animate-shimmer"
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}
