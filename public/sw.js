/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'theguide-cache-v1'
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/logo.png',
  '/icon-192x192.png',
  '/icon-512x512.png',
]

// 安装事件
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...')
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets')
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// 激活事件
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name)
            return caches.delete(name)
          })
      )
    })
  )
  self.clients.claim()
})

// 拦截请求
self.addEventListener('fetch', (event) => {
  // 跳过非 GET 请求
  if (event.request.method !== 'GET') {
    return
  }

  // 跳过跨域请求
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  // 跳过开发环境的 HMR 和 Turbopack 请求
  const url = new URL(event.request.url)
  if (
    // 跳过 Next.js 开发资源
    url.pathname.startsWith('/_next/static') ||
    url.pathname.startsWith('/_next/webpack-hmr') ||
    url.pathname.startsWith('/_next/webpack') ||
    url.pathname.includes('hmr') ||
    url.pathname.includes('webpack') ||
    // 跳过本地开发服务器
    url.hostname === 'localhost' ||
    url.hostname === '127.0.0.1'
  ) {
    console.log('[SW] Skipping cache for dev resource:', url.pathname)
    return
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // 克隆响应，因为流只能使用一次
        const responseToCache = networkResponse.clone()
        
        // 只缓存成功的请求
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === 'basic'
        ) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
        }
        
        return networkResponse
      }).catch((error) => {
        console.log('[SW] Fetch failed, using cache:', error)
        // 网络失败时返回缓存
        return cachedResponse
      })

      // 优先返回缓存，同时更新缓存
      return cachedResponse || fetchPromise
    })
  )
})

// 监听消息
self.addEventListener('message', (event) => {
  console.log('[SW] Received message:', event.data)
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
