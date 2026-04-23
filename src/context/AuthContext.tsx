import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { accountApi, authApi, tokenStorage } from '../lib/api'
import type { AccountUser } from '../types/account'

interface AuthContextValue {
  user: AccountUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  refreshMe: () => Promise<void>
  updateAccount: (payload: { name?: string; email?: string; password?: string }) => Promise<void>
  uploadAvatar: (file: File) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AccountUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshMe = async () => {
    const token = tokenStorage.get()
    if (!token) {
      setUser(null)
      return
    }

    const response = await authApi.me()
    setUser(response.user)
  }

  useEffect(() => {
    refreshMe()
      .catch(() => {
        tokenStorage.clear()
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password)
    tokenStorage.set(response.token)
    setUser(response.user)
  }

  const signup = async (name: string, email: string, password: string) => {
    const response = await authApi.signup(name, email, password)
    tokenStorage.set(response.token)
    setUser(response.user)
  }

  const logout = () => {
    tokenStorage.clear()
    setUser(null)
  }

  const updateAccount = async (payload: { name?: string; email?: string; password?: string }) => {
    const response = await accountApi.update(payload)
    setUser(response.user)
  }

  const uploadAvatar = async (file: File) => {
    const response = await accountApi.uploadAvatar(file)
    setUser(response.user)
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      signup,
      logout,
      refreshMe,
      updateAccount,
      uploadAvatar,
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}