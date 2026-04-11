'use client'

import { useEffect, useState } from 'react'

export function ServiceWorkerRegistration() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)
  const [updateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    // 开发环境下不注册 Service Worker
    if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('开发环境：禁用 Service Worker')
      
      // 清理已存在的 Service Worker
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => {
            console.log('开发环境：注销 Service Worker', registration.scope)
            registration.unregister()
          })
        })
        
        // 清理缓存
        caches.keys().then((cacheNames) => {
          cacheNames.forEach((cacheName) => {
            console.log('开发环境：清理缓存', cacheName)
            caches.delete(cacheName)
          })
        })
      }
      
      return
    }

    if (!('serviceWorker' in navigator)) {
      console.log('浏览器不支持 Service Worker')
      return
    }

    const registerWorker = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        })
        setRegistration(reg)
        console.log('Service Worker 注册成功:', reg.scope)

        // 检查更新
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setWaitingWorker(newWorker)
                setUpdateAvailable(true)
                console.log('新版本可用，等待刷新')
              }
            })
          }
        })
      } catch (error) {
        console.error('Service Worker 注册失败:', error)
      }
    }

    registerWorker()

    // 监听控制器变化
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service Worker 控制器已变更，页面将刷新')
    })
  }, [])

  // 更新 Service Worker
  const updateWorker = () => {
    if (waitingWorker && registration) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' })
      window.location.reload()
    }
  }

  // 只在有更新时显示 UI
  if (!updateAvailable) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-primary-foreground shadow-lg">
      <span className="text-sm">新版本可用</span>
      <button
        onClick={updateWorker}
        className="rounded bg-white px-3 py-1 text-sm font-medium text-primary hover:bg-gray-100"
      >
        立即更新
      </button>
    </div>
  )
}
