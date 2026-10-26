import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { api, getTokens, setTokens } from "../lib/api"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const tokens = getTokens()
    if (!tokens?.access) {
      setLoading(false)
      return
    }
    api("/api/auth/me/")
      .then(setUser)
      .catch(() => {
        setTokens(null)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      async login(email, password) {
        const data = await api("/api/auth/login/", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        })
        setTokens({ access: data.access, refresh: data.refresh })
        setUser(data.user)
        return data.user
      },
      async register(payload) {
        await api("/api/auth/register/", {
          method: "POST",
          body: JSON.stringify(payload),
        })
        const data = await api("/api/auth/login/", {
          method: "POST",
          body: JSON.stringify({ email: payload.email, password: payload.password }),
        })
        setTokens({ access: data.access, refresh: data.refresh })
        setUser(data.user)
        return data.user
      },
      logout() {
        setTokens(null)
        setUser(null)
      },
    }),
    [user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
