'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    // 注册 Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // 仅在生产环境注册 SW
      if (process.env.NODE_ENV === 'production') {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('[SW] Service Worker registered:', registration.scope)
          },
          (error) => {
            console.log('[SW] Service Worker registration failed:', error)
          }
        )
      }
    }
  }, [])

  return null
}
