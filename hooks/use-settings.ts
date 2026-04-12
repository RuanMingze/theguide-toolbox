import { useEffect } from 'react'

// iOS 26 液态玻璃 SVG 滤镜 - 真正的折射效果
// 核心：使用 feDisplacementMap 实现背景位移/折射
// 边缘反射：使用 feSpecularLighting + feMorphology 边缘检测
// 色差：使用 feOffset + feColorMatrix 实现 RGB 通道分离
const LIQUID_GLASS_SVG = `
<svg class="liquid-glass-svg-filters" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="position:fixed;left:-9999px;top:-9999px;width:0;height:0;overflow:hidden;">
  <defs>
    <!-- ================================================
         主折射滤镜 - 用于卡片等主要元素
         实现真实的边缘折射和镜面反射
         ================================================ -->
    <filter id="liquid-glass-refraction" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB">
      
      <!-- Step 1: 创建边缘位移贴图 (用于折射) -->
      <!-- 基于元素 alpha 通道生成高度图 -->
      <feGaussianBlur in="SourceAlpha" stdDeviation="15" result="blurredAlpha"/>
      
      <!-- 将模糊的 alpha 转换为位移贴图 -->
      <feColorMatrix in="blurredAlpha" type="matrix"
        values="0 0 0 0 0.5
                0 0 0 0 0.5
                0 0 0 0 0.5
                0 0 0 1 0" result="displacementMap"/>
      
      <!-- Step 2: 应用位移映射实现折射 -->
      <!-- scale 控制折射强度，越大变形越明显 -->
      <feDisplacementMap in="SourceGraphic" in2="displacementMap" 
        scale="25" xChannelSelector="R" yChannelSelector="G" result="displaced"/>
      
      <!-- Step 3: 边缘检测 - 创建边缘高光 -->
      <feMorphology in="SourceAlpha" operator="dilate" radius="2" result="dilated"/>
      <feMorphology in="SourceAlpha" operator="erode" radius="2" result="eroded"/>
      <feComposite in="dilated" in2="eroded" operator="out" result="edge"/>
      <feGaussianBlur in="edge" stdDeviation="3" result="edgeBlur"/>
      
      <!-- 边缘高光着色 - 白色发光 -->
      <feColorMatrix in="edgeBlur" type="matrix"
        values="0 0 0 0 1
                0 0 0 0 1
                0 0 0 0 1
                0 0 0 0.5 0" result="edgeHighlight"/>
      
      <!-- Step 4: 镜面反射 (Specular Lighting) -->
      <feGaussianBlur in="SourceAlpha" stdDeviation="8" result="specBlur"/>
      <feSpecularLighting in="specBlur" surfaceScale="4" specularConstant="1" specularExponent="20" lighting-color="#ffffff" result="specular">
        <!-- 光源位置：左上方 -->
        <fePointLight x="-200" y="-300" z="400"/>
      </feSpecularLighting>
      <feComposite in="specular" in2="SourceAlpha" operator="in" result="specularMasked"/>
      
      <!-- Step 5: 色差效果 (Chromatic Aberration) -->
      <!-- 红色通道向右偏移 -->
      <feOffset in="displaced" dx="1.5" dy="0" result="redChannel"/>
      <feColorMatrix in="redChannel" type="matrix"
        values="1 0 0 0 0
                0 0 0 0 0
                0 0 0 0 0
                0 0 0 0.08 0" result="redOnly"/>
      
      <!-- 蓝色通道向左偏移 -->
      <feOffset in="displaced" dx="-1.5" dy="0" result="blueChannel"/>
      <feColorMatrix in="blueChannel" type="matrix"
        values="0 0 0 0 0
                0 0 0 0 0
                0 0 1 0 0
                0 0 0 0.08 0" result="blueOnly"/>
      
      <!-- Step 6: 合成所有效果 -->
      <!-- 基础图像 + 色差 -->
      <feBlend in="displaced" in2="redOnly" mode="screen" result="withRed"/>
      <feBlend in="withRed" in2="blueOnly" mode="screen" result="withAberration"/>
      
      <!-- 添加边缘高光 -->
      <feBlend in="withAberration" in2="edgeHighlight" mode="screen" result="withEdge"/>
      
      <!-- 添加镜面反射 -->
      <feBlend in="withEdge" in2="specularMasked" mode="screen"/>
    </filter>

    <!-- ================================================
         轻量折射滤镜 - 用于按钮和导航栏
         ================================================ -->
    <filter id="liquid-glass-refraction-subtle" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">
      <!-- 简化的位移效果 -->
      <feGaussianBlur in="SourceAlpha" stdDeviation="8" result="blur"/>
      <feColorMatrix in="blur" type="matrix"
        values="0 0 0 0 0.5
                0 0 0 0 0.5
                0 0 0 0 0.5
                0 0 0 1 0" result="dispMap"/>
      <feDisplacementMap in="SourceGraphic" in2="dispMap" 
        scale="12" xChannelSelector="R" yChannelSelector="G" result="displaced"/>
      
      <!-- 简化的镜面反射 -->
      <feSpecularLighting in="blur" surfaceScale="2" specularConstant="0.7" specularExponent="25" lighting-color="#ffffff" result="specular">
        <fePointLight x="-100" y="-150" z="250"/>
      </feSpecularLighting>
      <feComposite in="specular" in2="SourceAlpha" operator="in" result="specMasked"/>
      
      <!-- 合成 -->
      <feBlend in="displaced" in2="specMasked" mode="screen"/>
    </filter>

    <!-- ================================================
         边缘发光滤镜 - 用于悬停效果
         ================================================ -->
    <filter id="liquid-glass-glow" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="15" result="blur"/>
      <feColorMatrix in="blur" type="matrix"
        values="0 0 0 0 1
                0 0 0 0 1
                0 0 0 0 1
                0 0 0 0.2 0"/>
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
