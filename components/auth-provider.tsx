'use client'

import { createContext, useContext, useState, useEffect, ReactNode, Suspense } from 'react'

interface UserProfile {
  id: number
  name: string
  email: string
  avatar_url: string
  has_beta_access: boolean
  provider?: 'ruanm' | 'github'
  github_login?: string
}

export type LoginMethod = 'ruanm' | 'github'

interface AuthContextType {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (method?: LoginMethod) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function AuthProviderContent({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    const handleStorageChange = () => {
      checkAuth()
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  async function checkAuth() {
    try {
      // 从本地存储读取用户信息
      const storedUser = localStorage.getItem('oauth_user')
      const isLoggedIn = localStorage.getItem('oauth_logged_in')

      if (storedUser && isLoggedIn === 'true') {
        setUser(JSON.parse(storedUser))
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
      // 清除本地存储
      localStorage.removeItem('oauth_user')
      localStorage.removeItem('oauth_logged_in')
      
      // 调用服务端清除 cookie
      await fetch('/api/oauth/status', { method: 'POST' })
      
      setUser(null)
      window.location.reload()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  async function login(method: LoginMethod = 'ruanm') {
    try {
      if (method === 'github') {
        const response = await fetch('/api/oauth/github/authorize')
        const data = await response.json()
        
        if (data.authUrl) {
          window.location.href = data.authUrl
        } else {
          console.error('No GitHub authUrl in response')
        }
        return
      }
      
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

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AuthProviderContent>{children}</AuthProviderContent>
    </Suspense>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
