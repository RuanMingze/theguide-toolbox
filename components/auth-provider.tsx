'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface UserProfile {
  id: number
  name: string
  email: string
  avatar_url: string
  has_beta_access: boolean
}

interface AuthContextType {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  login: () => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const response = await fetch('/api/oauth/status')
      const data = await response.json()

      if (data.authenticated && data.user) {
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  async function logout() {
    try {
      await fetch('/api/oauth/status', { method: 'POST' })
      setUser(null)
      window.location.reload()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  async function login() {
    try {
      const response = await fetch('/api/oauth/authorize')
      const data = await response.json()
      
      if (data.authUrl) {
        window.location.href = data.authUrl
      } else {
        console.error('No authUrl in response')
      }
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
