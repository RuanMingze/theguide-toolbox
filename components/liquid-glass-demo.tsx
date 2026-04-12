'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

// 动态导入 liquid-glass-react，因为它依赖 Canvas/WebGL
const LiquidGlassLib = dynamic(
  () => import('liquid-glass-react').then(mod => mod.default),
  { 
    ssr: false,
    loading: () => (
      <div className="rounded-3xl bg-white/10 backdrop-blur-xl p-6 animate-pulse">
        Loading...
      </div>
    )
  }
)

interface LiquidGlassDemoProps {
  children: React.ReactNode
  className?: string
  displacementScale?: number
  blurAmount?: number
  saturation?: number
  aberrationIntensity?: number
  elasticity?: number
  cornerRadius?: number
  padding?: string
  mode?: 'standard' | 'polar' | 'prominent' | 'shader'
  overLight?: boolean
  onClick?: () => void
  style?: React.CSSProperties
}

/**
 * 液态玻璃演示组件 - 使用 liquid-glass-react 库
 * 实现真正的 iOS 26 风格折射效果
 */
export function LiquidGlassDemo({
  children,
  className = '',
  displacementScale = 70,
  blurAmount = 0.0625,
  saturation = 140,
  aberrationIntensity = 2,
  elasticity = 0.15,
  cornerRadius = 24,
  padding = '24px',
  mode = 'standard',
  overLight = false,
  onClick,
  style,
}: LiquidGlassDemoProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div 
        className={`rounded-3xl bg-white/10 backdrop-blur-xl ${className}`}
        style={{ padding, borderRadius: cornerRadius, ...style }}
      >
        {children}
      </div>
    )
  }

  return (
    <LiquidGlassLib
      displacementScale={displacementScale}
      blurAmount={blurAmount}
      saturation={saturation}
      aberrationIntensity={aberrationIntensity}
      elasticity={elasticity}
      cornerRadius={cornerRadius}
      padding={padding}
      mode={mode}
      overLight={overLight}
      onClick={onClick}
      className={className}
      style={style}
    >
      {children}
    </LiquidGlassLib>
  )
}

/**
 * 液态玻璃卡片 - 预设配置
 */
export function LiquidGlassDemoCard({
  children,
  className = '',
  ...props
}: Omit<LiquidGlassDemoProps, 'cornerRadius' | 'padding'>) {
  return (
    <LiquidGlassDemo
      displacementScale={50}
      blurAmount={0.05}
      saturation={130}
      aberrationIntensity={1.5}
      elasticity={0.12}
      cornerRadius={24}
      padding="24px"
      mode="standard"
      className={className}
      {...props}
    >
      {children}
    </LiquidGlassDemo>
  )
}

/**
 * 液态玻璃按钮 - 预设配置
 */
export function LiquidGlassDemoButton({
  children,
  className = '',
  onClick,
  ...props
}: Omit<LiquidGlassDemoProps, 'cornerRadius' | 'padding'>) {
  return (
    <LiquidGlassDemo
      displacementScale={40}
      blurAmount={0.08}
      saturation={150}
      aberrationIntensity={2}
      elasticity={0.25}
      cornerRadius={999}
      padding="12px 24px"
      onClick={onClick}
      className={`cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </LiquidGlassDemo>
  )
}

export default LiquidGlassDemo
