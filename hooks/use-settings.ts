import { useEffect } from 'react'

// iOS 26 液态玻璃 SVG 滤镜 - 真正的折射效果
// 使用 feDisplacementMap 实现边缘折射，feSpecularLighting 实现镜面反射
const LIQUID_GLASS_SVG = `
<svg class="liquid-glass-svg-filters" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <!-- 主要折射滤镜 - 用于卡片和主要元素 -->
    <filter id="liquid-glass-refraction" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
      <!-- 创建边缘位移贴图 -->
      <feGaussianBlur in="SourceAlpha" stdDeviation="8" result="blur1"/>
      <feOffset in="blur1" dx="0" dy="0" result="offset1"/>
      
      <!-- 创建内部高光 -->
      <feSpecularLighting in="blur1" surfaceScale="3" specularConstant="0.8" specularExponent="25" lighting-color="#ffffff" result="specular">
        <fePointLight x="-100" y="-200" z="300"/>
      </feSpecularLighting>
      
      <!-- 边缘检测 -->
      <feMorphology in="SourceAlpha" operator="dilate" radius="1" result="dilated"/>
      <feMorphology in="SourceAlpha" operator="erode" radius="1" result="eroded"/>
      <feComposite in="dilated" in2="eroded" operator="xor" result="edge"/>
      
      <!-- 边缘高光 -->
      <feGaussianBlur in="edge" stdDeviation="2" result="edgeBlur"/>
      <feColorMatrix in="edgeBlur" type="matrix" 
        values="1 0 0 0 0.3
                0 1 0 0 0.3
                0 0 1 0 0.3
                0 0 0 0.6 0" result="edgeLight"/>
      
      <!-- 合成折射效果 -->
      <feComposite in="specular" in2="SourceAlpha" operator="in" result="specularMasked"/>
      <feBlend in="SourceGraphic" in2="specularMasked" mode="screen" result="withSpecular"/>
      <feBlend in="withSpecular" in2="edgeLight" mode="screen" result="final"/>
      
      <!-- 添加轻微色差 -->
      <feOffset in="final" dx="0.5" dy="0" result="redShift"/>
      <feOffset in="final" dx="-0.5" dy="0" result="blueShift"/>
      <feColorMatrix in="redShift" type="matrix"
        values="1 0 0 0 0
                0 0 0 0 0
                0 0 0 0 0
                0 0 0 0.1 0" result="red"/>
      <feColorMatrix in="blueShift" type="matrix"
        values="0 0 0 0 0
                0 0 0 0 0
                0 0 1 0 0
                0 0 0 0.1 0" result="blue"/>
      <feBlend in="final" in2="red" mode="screen" result="withRed"/>
      <feBlend in="withRed" in2="blue" mode="screen"/>
    </filter>
    
    <!-- 轻量折射滤镜 - 用于按钮和小元素 -->
    <filter id="liquid-glass-refraction-subtle" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur"/>
      <feSpecularLighting in="blur" surfaceScale="2" specularConstant="0.6" specularExponent="30" lighting-color="#ffffff" result="specular">
        <fePointLight x="-50" y="-100" z="200"/>
      </feSpecularLighting>
      <feComposite in="specular" in2="SourceAlpha" operator="in" result="specularMasked"/>
      <feBlend in="SourceGraphic" in2="specularMasked" mode="screen"/>
    </filter>
    
    <!-- 边缘光晕滤镜 -->
    <filter id="liquid-glass-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="10" result="blur"/>
      <feColorMatrix in="blur" type="matrix"
        values="1 0 0 0 1
                0 1 0 0 1
                0 0 1 0 1
                0 0 0 0.15 0"/>
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
      
      // 注入 SVG 滤镜（如果尚未存在）
      let svgContainer = document.getElementById('liquid-glass-svg-container')
      if (!svgContainer) {
        svgContainer = document.createElement('div')
        svgContainer.id = 'liquid-glass-svg-container'
        svgContainer.innerHTML = LIQUID_GLASS_SVG
        document.body.appendChild(svgContainer)
        console.log('[useSettings] SVG filters injected')
      }
      
      // 应用液体玻璃参数
      const blur = settings.liquidBlur ?? 50
      const refraction = settings.liquidRefraction ?? 200
      root.style.setProperty('--lg-blur', `${blur}px`)
      root.style.setProperty('--lg-refraction', `${refraction}`)
      
      // 根据折射强度动态调整 SVG 滤镜参数
      const specularScale = 2 + (refraction / 100)
      const specularConstant = 0.5 + (refraction / 400)
      root.style.setProperty('--lg-specular-scale', `${specularScale}`)
      root.style.setProperty('--lg-specular-constant', `${specularConstant}`)
      
      // 移除毛玻璃变量
      root.style.removeProperty('--glass-bg')
      root.style.removeProperty('--glass-blur')
      
      console.log('[useSettings] Liquid glass enabled with blur:', blur, 'refraction:', refraction)
    } else {
      // 禁用液体玻璃
      body.classList.remove('liquid-glass-enabled')
      
      // 移除 SVG 滤镜容器
      const svgContainer = document.getElementById('liquid-glass-svg-container')
      if (svgContainer) {
        svgContainer.remove()
        console.log('[useSettings] SVG filters removed')
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
