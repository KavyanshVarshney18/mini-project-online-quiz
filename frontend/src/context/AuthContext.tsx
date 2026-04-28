import { createContext, useContext, useMemo, useState } from 'react'
import api from '../api/client'
import type { AuthResponse } from '../types'

type AuthContextValue = {
  user: AuthResponse | null
  login: (email: string, password: string) => Promise<AuthResponse>
  register: (name: string, email: string, password: string) => Promise<AuthResponse>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const STORAGE_KEY = 'quiz_session'
const TOKEN_KEY = 'quiz_auth'

function readStoredUser(): AuthResponse | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return null
  }
  try {
    return JSON.parse(raw) as AuthResponse
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse | null>(readStoredUser())

  const persist = (payload: AuthResponse) => {
    localStorage.setItem(TOKEN_KEY, payload.token)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    setUser(payload)
    return payload
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      async login(email, password) {
        const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
        return persist(data)
      },
      async register(name, email, password) {
        const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password })
        return persist(data)
      },
      logout() {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(STORAGE_KEY)
        setUser(null)
      },
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
