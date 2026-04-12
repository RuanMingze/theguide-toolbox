'use client'

import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils'

// 动态导入 liquid-glass-react，禁用 SSR
const LiquidGlassLib = dynamic(
  () => import('liquid-glass-react').then(mod => mod.default),
  { 
    ssr: false,
    loading: () => null
  }
)

interface LiquidGlassSettings {
  enabled: boolean
  blur: number
  refraction: number
  saturation: number
  aberration: number
  elasticity: number
}

interface LiquidGlassContextType {
  settings: LiquidGlassSettings
  updateSettings: (settings: Partial<LiquidGlassSettings>) => void
  mouseContainerRef: React.RefObject<HTMLDivElement | null>
  mounted: boolean
}

const defaultSettings: LiquidGlassSettings = {
  enabled: false,
  blur: 0.05,
  refraction: 70,
  saturation: 140,
  aberration: 2,
  elasticity: 0.15,
}

const LiquidGlassContext = createContext<LiquidGlassContextType | null>(null)

export function useLiquidGlass() {
  const context = useContext(LiquidGlassContext)
  if (!context) {
    // 返回默认值而不是抛出错误，以便在 Provider 外部使用时也能工作
    return {
      settings: defaultSettings,
      updateSettings: () => {},
      mouseContainerRef: { current: null },
      mounted: false,
    }
  }
  return context
}

interface LiquidGlassProviderProps {
  children: React.ReactNode
}

export function LiquidGlassProvider({ children }: LiquidGlassProviderProps) {
  const [settings, setSettings] = useState<LiquidGlassSettings>(defaultSettings)
  const [mounted, setMounted] = useState(false)
  const mouseContainerRef = useRef<HTMLDivElement>(null)

  // 客户端 mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // 从 localStorage 加载设置
  useEffect(() => {
    if (!mounted) return
    
    const savedSettings = localStorage.getItem('theguide-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings({
          enabled: parsed.liquidGlassEffect ?? false,
          blur: (parsed.liquidBlur ?? 50) / 1000, // 转换为 0-0.1 范围
          refraction: parsed.liquidRefraction ?? 70,
          saturation: 100 + (parsed.liquidRefraction ?? 70) / 2,
          aberration: 2,
          elasticity: 0.15,
        })
      } catch (e) {
        console.error('[LiquidGlassProvider] Failed to parse settings:', e)
      }
    }
  }, [mounted])

  // 监听设置变化
  useEffect(() => {
    if (!mounted) return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theguide-settings' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          setSettings({
            enabled: parsed.liquidGlassEffect ?? false,
            blur: (parsed.liquidBlur ?? 50) / 1000,
            refraction: parsed.liquidRefraction ?? 70,
            saturation: 100 + (parsed.liquidRefraction ?? 70) / 2,
            aberration: 2,
            elasticity: 0.15,
          })
        } catch (e) {
          console.error('[LiquidGlassProvider] Failed to parse settings:', e)
        }
      }
    }

    // 监听自定义事件（同页面内的设置变化）
    const handleSettingsUpdate = () => {
      const savedSettings = localStorage.getItem('theguide-settings')
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings)
          setSettings({
            enabled: parsed.liquidGlassEffect ?? false,
            blur: (parsed.liquidBlur ?? 50) / 1000,
            refraction: parsed.liquidRefraction ?? 70,
            saturation: 100 + (parsed.liquidRefraction ?? 70) / 2,
            aberration: 2,
            elasticity: 0.15,
          })
        } catch (e) {
          console.error('[LiquidGlassProvider] Failed to parse settings:', e)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('settings-updated', handleSettingsUpdate)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('settings-updated', handleSettingsUpdate)
    }
  }, [mounted])

  const updateSettings = useCallback((newSettings: Partial<LiquidGlassSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }, [])

  return (
    <LiquidGlassContext.Provider value={{ settings, updateSettings, mouseContainerRef, mounted }}>
      <div ref={mouseContainerRef} className="liquid-glass-root min-h-screen">
        {children}
      </div>
    </LiquidGlassContext.Provider>
  )
}

/**
 * 液态玻璃卡片组件 - 使用 liquid-glass-react 库
 * 自动从 Provider 获取设置
 */
interface LiquidGlassCardProps {
  children: React.ReactNode
  className?: string
  padding?: string
  cornerRadius?: number
  onClick?: () => void
  style?: React.CSSProperties
  /** 折射模式 */
  mode?: 'standard' | 'polar' | 'prominent' | 'shader'
  /** 是否在浅色背景上 */
  overLight?: boolean
}

export function LiquidGlassCard({
  children,
  className = '',
  padding = '24px',
  cornerRadius = 24,
  onClick,
  style,
  mode = 'standard',
  overLight = false,
}: LiquidGlassCardProps) {
  const { settings, mouseContainerRef, mounted } = useLiquidGlass()

  // 如果液态玻璃未启用或未 mount，返回普通卡片
  if (!settings.enabled || !mounted) {
    return (
      <div 
        className={cn(
          'bg-card rounded-3xl border border-border shadow-sm',
          className
        )}
        style={{ padding, borderRadius: cornerRadius, ...style }}
        onClick={onClick}
      >
        {children}
      </div>
    )
  }

  return (
    <LiquidGlassLib
      displacementScale={settings.refraction}
      blurAmount={settings.blur}
      saturation={settings.saturation}
      aberrationIntensity={settings.aberration}
      elasticity={settings.elasticity}
      cornerRadius={cornerRadius}
      padding={padding}
      onClick={onClick}
      mode={mode}
      overLight={overLight}
      mouseContainer={mouseContainerRef}
      className={className}
      style={style}
    >
      {children}
    </LiquidGlassLib>
  )
}

/**
 * 液态玻璃按钮组件
 */
interface LiquidGlassButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
}

export function LiquidGlassButton({
  children,
  className = '',
  onClick,
  disabled,
}: LiquidGlassButtonProps) {
  const { settings, mouseContainerRef, mounted } = useLiquidGlass()

  if (!settings.enabled || !mounted) {
    return (
      <button 
        className={cn(
          'bg-primary text-primary-foreground px-4 py-2 rounded-full',
          className
        )}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    )
  }

  return (
    <LiquidGlassLib
      displacementScale={40}
      blurAmount={0.08}
      saturation={150}
      aberrationIntensity={2}
      elasticity={0.25}
      cornerRadius={999}
      padding="12px 24px"
      onClick={disabled ? undefined : onClick}
      mouseContainer={mouseContainerRef}
      className={cn(
        'cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </LiquidGlassLib>
  )
}

export default LiquidGlassProvider
