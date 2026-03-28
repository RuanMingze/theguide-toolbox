import { useEffect } from 'react'

export function useSettings() {
  const applySettings = () => {
    const savedSettings = localStorage.getItem('theguide-settings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      
      // 应用壁纸
      const body = document.body
      if (settings.wallpaper) {
        body.style.setProperty('background-image', settings.wallpaper, 'important')
        body.style.setProperty('background-size', 'cover', 'important')
        body.style.setProperty('background-position', 'center', 'important')
        body.style.setProperty('background-attachment', 'fixed', 'important')
        body.style.setProperty('background-color', 'transparent', 'important')
        console.log('[useSettings] Wallpaper applied:', settings.wallpaper.substring(0, 50) + '...')
      } else {
        body.style.removeProperty('background-image')
        body.style.removeProperty('background-size')
        body.style.removeProperty('background-position')
        body.style.removeProperty('background-attachment')
        body.style.removeProperty('background-color')
        // 确保有默认的深色背景
        body.style.backgroundColor = 'var(--background)'
      }
      
      // 应用毛玻璃效果
      const root = document.documentElement
      if (settings.glassEffect) {
        root.style.setProperty('--glass-bg', `rgba(${settings.glassColor || '255, 255, 255'}, ${settings.glassOpacity / 100})`)
        root.style.setProperty('--glass-blur', '20px')
      } else {
        root.style.removeProperty('--glass-bg')
        root.style.removeProperty('--glass-blur')
      }
    } else {
      // 没有保存的设置时，确保有默认背景
      document.body.style.backgroundColor = 'var(--background)'
    }
  }

  useEffect(() => {
    // 初始应用设置
    applySettings()
    
    // 监听 storage 变化（跨标签页）
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theguide-settings') {
        applySettings()
      }
    }
    
    // 监听广播消息（同标签页路由变化）
    const channel = new BroadcastChannel('theguide-settings')
    channel.onmessage = (event) => {
      console.log('[useSettings] Received broadcast:', event.data)
      if (event.data.type === 'wallpaper-changed') {
        applySettings()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // 清理函数
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      channel.close()
    }
  }, [])
}
