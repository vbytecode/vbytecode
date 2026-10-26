import { errorMessage } from "./utils"

const TOKEN_KEY = "heirloom_tokens"
const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "")

function url(path) {
  if (path.startsWith("http")) return path
  return `${API_BASE}${path}`
}

export function getTokens() {
  try {
    return JSON.parse(localStorage.getItem(TOKEN_KEY) || "null")
  } catch {
    return null
  }
}

export function setTokens(tokens) {
  if (!tokens) localStorage.removeItem(TOKEN_KEY)
  else localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens))
}

export async function api(path, options = {}) {
  const tokens = getTokens()
  const headers = { ...(options.headers || {}) }
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json"
  }
  if (tokens?.access) headers.Authorization = `Bearer ${tokens.access}`

  const response = await fetch(url(path), { ...options, headers })
  const text = await response.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }
  if (!response.ok) {
    const payload = typeof data === "string" && data.startsWith("<!") ? { detail: "Server error. Please try again." } : data
    const error = new Error(errorMessage(payload))
    error.status = response.status
    error.data = data
    throw error
  }
  return data
}
