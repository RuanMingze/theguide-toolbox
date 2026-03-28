'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { cacheFavicon, getCachedFavicon } from '@/lib/favicon-cache'

interface UseFaviconProps {
  url: string
  name: string
}

export function useFavicon({ url, name }: UseFaviconProps) {
  const [currentSrc, setCurrentSrc] = useState<string | null>(null)
  const [errorCount, setErrorCount] = useState(0)
  const [isTryingFallback, setIsTryingFallback] = useState(false)
  const [hasLoadedFromCache, setHasLoadedFromCache] = useState(false)
  const initializedRef = useRef(false)
  const cacheCheckedRef = useRef(false)
  const objectUrlRef = useRef<string | null>(null)

  const baseUrl = url.replace(/\/$/, '')
  const hostname = new URL(url).hostname

  // 尝试多个 favicon 路径
  const faviconPaths = [
    `${baseUrl}/favicon.ico`,
    `${baseUrl}/favicon.png`,
    `${baseUrl}/favicon.svg`,
    `${baseUrl}/apple-touch-icon.png`,
    `${baseUrl}/apple-touch-icon-precomposed.png`,
    `${baseUrl}/icon.ico`,
    `${baseUrl}/icon.png`,
    `${baseUrl}/icon.svg`,
    `${baseUrl}/logo.ico`,
    `${baseUrl}/logo.png`,
    `${baseUrl}/logo.svg`,
    `https://${hostname}/favicon.ico`,
    `https://${hostname}/favicon.png`,
    `https://${hostname}/favicon.svg`,
    `https://${hostname}/apple-touch-icon.png`,
    `https://${hostname}/icon.ico`,
    `https://${hostname}/icon.png`,
    `https://${hostname}/logo.ico`,
    `https://${hostname}/logo.png`,
  ]

  // 检查缓存
  useEffect(() => {
    const checkCache = async () => {
      if (cacheCheckedRef.current) return
      cacheCheckedRef.current = true
      
      try {
        const cachedUrl = await getCachedFavicon(url)
        if (cachedUrl) {
          setCurrentSrc(cachedUrl)
          setHasLoadedFromCache(true)
          initializedRef.current = true
        }
      } catch (error) {
        console.error('Failed to check cache:', error)
      }
    }
    
    checkCache()
  }, [url])

  // 初始化第一个路径（如果没有缓存）
  useEffect(() => {
    if (!initializedRef.current && cacheCheckedRef.current && currentSrc === null && errorCount === 0) {
      setCurrentSrc(faviconPaths[0])
      initializedRef.current = true
    }
  }, [cacheCheckedRef.current, currentSrc, errorCount])

  // 清理 Object URL
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
      }
    }
  }, [])

  // 重试下一个路径
  const tryNextPath = useCallback((currentIndex: number) => {
    const nextIndex = currentIndex + 1
    
    if (nextIndex >= faviconPaths.length) {
      // 所有路径都失败了
      setErrorCount(nextIndex)
      setIsTryingFallback(false)
      return
    }
    
    // 标记正在尝试 fallback
    setIsTryingFallback(true)
    setErrorCount(nextIndex)
    
    // 预加载新图片
    const img = new Image()
    img.src = faviconPaths[nextIndex]
    
    img.onload = () => {
      // 只有加载成功后才切换
      setCurrentSrc(faviconPaths[nextIndex])
      setIsTryingFallback(false)
    }
    
    img.onerror = () => {
      // 如果也失败了，继续尝试下一个
      setIsTryingFallback(false)
      // 使用微任务避免在同一事件中递归调用
      queueMicrotask(() => {
        tryNextPath(nextIndex)
      })
    }
  }, [faviconPaths])

  const handleError = useCallback(() => {
    // 从当前错误计数继续
    tryNextPath(errorCount)
  }, [errorCount, tryNextPath])

  const handleLoad = useCallback(async (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsTryingFallback(false)
    
    // 如果是从缓存加载的，不需要再次缓存
    if (hasLoadedFromCache) return
    
    // 缓存成功的 favicon
    try {
      const img = e.currentTarget
      const response = await fetch(img.src)
      const blob = await response.blob()
      await cacheFavicon(url, blob)
    } catch (error) {
      console.error('Failed to cache favicon:', error)
    }
  }, [url, hasLoadedFromCache])

  // 如果所有路径都失败，使用字母图标
  const showFallback = errorCount >= faviconPaths.length

  return {
    src: showFallback ? '' : (currentSrc || ''),
    error: showFallback,
    onError: handleError,
    onLoad: handleLoad,
    isFallback: showFallback,
    isTryingFallback,
  }
}

// 获取首字母作为备用图标
export function getInitials(name: string): string {
  const match = name.match(/[a-zA-Z\u4e00-\u9fa5]/)
  return match ? match[0].toUpperCase() : '?'
}

// 生成渐变色
export function getGradientColor(name: string): string {
  const colors = [
    'from-red-500 to-red-600',
    'from-orange-500 to-orange-600',
    'from-amber-500 to-amber-600',
    'from-yellow-500 to-yellow-600',
    'from-lime-500 to-lime-600',
    'from-green-500 to-green-600',
    'from-emerald-500 to-emerald-600',
    'from-teal-500 to-teal-600',
    'from-cyan-500 to-cyan-600',
    'from-sky-500 to-sky-600',
    'from-blue-500 to-blue-600',
    'from-indigo-500 to-indigo-600',
    'from-violet-500 to-violet-600',
    'from-purple-500 to-purple-600',
    'from-fuchsia-500 to-fuchsia-600',
    'from-pink-500 to-pink-600',
    'from-rose-500 to-rose-600',
  ]
  
  const index = name.length % colors.length
  return colors[index]
}
