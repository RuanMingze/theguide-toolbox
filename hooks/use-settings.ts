import { useEffect } from 'react'

// 液体玻璃 SVG 滤镜 HTML
const LIQUID_GLASS_SVG = `
<svg class="liquid-glass-filter" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="liquid-glass-filter" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur"/>
      <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="liquid"/>
      <feGaussianBlur in="liquid" stdDeviation="3" result="blur2"/>
      <feSpecularLighting in="blur2" surfaceScale="5" specularConstant="0.75" specularExponent="20" lighting-color="#fff" result="specular">
        <fePointLight x="-5000" y="-10000" z="20000"/>
      </feSpecularLighting>
      <feComposite in="specular" in2="SourceGraphic" operator="in" result="specular2"/>
      <feComposite in="SourceGraphic" in2="specular2" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
    </filter>
  </defs>
</svg>
`

export function useSettings() {
  const applySettings = () => {
    const savedSettings = localStorage.getItem('theguide-settings')
    const root = document.documentElement
    const body = document.body
    
    console.log('[useSettings] applySettings called')
    console.log('[useSettings] savedSettings:', savedSettings ? 'exists' : 'null')
    
    // 如果没有保存的设置，使用默认壁纸
    const defaultWallpaper = "url('https://luckycola.com.cn/public/imgs/luckycola_Imghub_forever_5Z1Q1XpG17752164264304110.jpg')"
    const wallpaperToApply = savedSettings ? JSON.parse(savedSettings).wallpaper : defaultWallpaper
    
    console.log('[useSettings] wallpaperToApply:', wallpaperToApply)
    console.log('[useSettings] Before apply - CSS variable:', root.style.getPropertyValue('--custom-wallpaper'))
    console.log('[useSettings] Before apply - body computed style:', getComputedStyle(body).backgroundImage)
    
    // 应用壁纸 - 使用 CSS 变量
    if (wallpaperToApply) {
      root.style.setProperty('--custom-wallpaper', wallpaperToApply)
      console.log('[useSettings] Wallpaper applied:', wallpaperToApply)
    } else {
      root.style.removeProperty('--custom-wallpaper')
      console.log('[useSettings] Wallpaper removed')
    }
    
    console.log('[useSettings] After apply - CSS variable:', root.style.getPropertyValue('--custom-wallpaper'))
    console.log('[useSettings] After apply - body computed style:', getComputedStyle(body).backgroundImage)
    
    // 应用液体玻璃效果（优先于毛玻璃）
    const settings = savedSettings ? JSON.parse(savedSettings) : null
    
    if (settings?.liquidGlassEffect) {
      // 启用液体玻璃时，添加 class
      body.classList.add('liquid-glass-enabled')
      body.classList.remove('glass-enabled')
      
      // 移除 SVG 滤镜容器（不再使用）
      const svgContainer = document.getElementById('liquid-glass-svg-container')
      if (svgContainer) {
        svgContainer.remove()
      }
      
      // 应用液体玻璃参数
      root.style.setProperty('--lg-blur', `${settings.liquidBlur ?? 50}px`)
      root.style.setProperty('--lg-refraction', `${settings.liquidRefraction ?? 200}%`)
      
      // 移除毛玻璃变量
      root.style.removeProperty('--glass-bg')
      root.style.removeProperty('--glass-blur')
    } else {
      // 禁用液体玻璃
      body.classList.remove('liquid-glass-enabled')
      const svgContainer = document.getElementById('liquid-glass-svg-container')
      if (svgContainer) {
        svgContainer.remove()
      }
      
      // 应用毛玻璃效果
      if (settings?.glassEffect !== false) {
        root.style.setProperty('--glass-bg', `rgba(${settings?.glassColor || '255, 255, 255'}, ${settings?.glassOpacity || 10} / 100)`)
        root.style.setProperty('--glass-blur', '20px')
      } else {
        root.style.removeProperty('--glass-bg')
        root.style.removeProperty('--glass-blur')
      }
    }
  }

  useEffect(() => {
    console.log('[useSettings] useEffect initialized')
    // 初始应用设置
    applySettings()
    
    // 监听 storage 变化（跨标签页）
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theguide-settings') {
        console.log('[useSettings] storage changed, reapplying settings')
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
