import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function errorMessage(data, fallback = "Something went wrong.") {
  if (!data) return fallback
  if (typeof data === "string") return data
  if (data.detail) return Array.isArray(data.detail) ? data.detail[0] : data.detail
  const first = Object.values(data)[0]
  if (Array.isArray(first)) return first[0]
  if (typeof first === "string") return first
  return fallback
}
