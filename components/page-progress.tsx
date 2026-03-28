'use client'

import { useEffect, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'

export function PageProgress() {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()

  // 重置进度条
  const resetProgress = useCallback(() => {
    setProgress(0)
    setIsVisible(true)
  }, [])

  // 完成进度条
  const completeProgress = useCallback(() => {
    setProgress(100)
    setTimeout(() => {
      setIsVisible(false)
      setProgress(0)
    }, 300)
  }, [])

  // 路由变化时启动进度条
  useEffect(() => {
    resetProgress()
    
    // 模拟进度条动画
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(timer)
          return prev
        }
        // 非线性进度：先快后慢
        const increment = (100 - prev) * 0.2
        return Math.min(prev + increment, 95)
      })
    }, 150)

    return () => clearInterval(timer)
  }, [pathname, resetProgress])

  // 页面加载完成后完成进度条
  useEffect(() => {
    const handleLoad = () => {
      completeProgress()
    }

    // 使用 requestIdleCallback 或 setTimeout 确保在页面渲染后执行
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(handleLoad)
    } else {
      setTimeout(handleLoad, 100)
    }
  }, [pathname, completeProgress])

  // 只在有进度或可见时显示
  if (!isVisible && progress === 0) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-transparent overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary/60"
        style={{ 
          width: `${progress}%`,
          opacity: isVisible ? 1 : 0,
          transition: 'width 150ms ease-out, opacity 300ms ease-out'
        }}
      />
    </div>
  )
}
