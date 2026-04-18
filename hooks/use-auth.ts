'use client'

import { useState, useEffect } from 'react'

interface User {
  id: number
  name: string
  avatar_url?: string
  email?: string
  provider?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (method?: 'ruanm' | 'github' | 'discord') => void
  logout: () => void
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 检查本地存储中的用户信息
    const storedUser = localStorage.getItem('oauth_user')
    const isLoggedIn = localStorage.getItem('oauth_logged_in')

    if (storedUser && isLoggedIn === 'true') {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('解析用户信息失败:', error)
        setUser(null)
      }
    } else {
      setUser(null)
    }

    setIsLoading(false)
  }, [])

  const login = async (method: 'ruanm' | 'github' | 'discord' = 'ruanm') => {
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
      
      if (method === 'discord') {
        const response = await fetch('/api/oauth/discord/authorize')
        const data = await response.json()
        
        if (data.authUrl) {
          window.location.href = data.authUrl
        } else {
          console.error('No Discord authUrl in response')
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

  const logout = async () => {
    try {
      // 清除本地存储
      localStorage.removeItem('oauth_user')
      localStorage.removeItem('oauth_logged_in')
      localStorage.removeItem('oauth_provider')
      
      // 清除会话存储
      sessionStorage.clear()
      
      // 清除 IndexedDB（如果有）
      try {
        const databases = await indexedDB.databases()
        databases.forEach((db) => {
          if (db.name) {
            indexedDB.deleteDatabase(db.name)
          }
        })
      } catch (e) {
        console.warn('Failed to clear IndexedDB:', e)
      }
      
      // 调用服务端清除 cookie
      await fetch('/api/oauth/status', { method: 'POST' })
      
      // 清除 GitHub OAuth 相关的 cookie（通过服务端 API）
      try {
        await fetch('/api/oauth/github/logout', { method: 'POST' })
      } catch (e) {
        console.warn('Failed to clear GitHub OAuth cookies:', e)
      }
      
      setUser(null)
      window.location.reload()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  }
}
