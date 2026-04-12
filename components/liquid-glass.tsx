'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

// 动态导入 liquid-glass-react，禁用 SSR（因为它依赖 Canvas/WebGL）
const LiquidGlassLib = dynamic(
  () => import('liquid-glass-react').then(mod => mod.default),
  { 
    ssr: false,
    loading: () => null
  }
)

interface LiquidGlassProps {
  children: React.ReactNode
  className?: string
  /** 位移/折射强度 (0-100) */
  displacementScale?: number
  /** 模糊量 (0-1) */
  blurAmount?: number
  /** 饱和度 (100-200) */
  saturation?: number
  /** 色差强度 (0-5) */
  aberrationIntensity?: number
  /** 弹性系数 (0-1) */
  elasticity?: number
  /** 圆角 */
  cornerRadius?: number
  /** 是否在浅色背景上 */
  overLight?: boolean
  /** 内边距 */
  padding?: string
  /** 点击回调 */
  onClick?: () => void
  /** 折射模式 */
  mode?: 'standard' | 'polar' | 'prominent' | 'shader'
  /** 自定义样式 */
  style?: React.CSSProperties
}

/**
 * iOS 26 风格的液态玻璃组件
 * 使用 liquid-glass-react 库实现真实的折射和边缘反射效果
 */
export function LiquidGlass({
  children,
  className,
  displacementScale = 70,
  blurAmount = 0.0625,
  saturation = 140,
  aberrationIntensity = 2,
  elasticity = 0.15,
  cornerRadius = 24,
  overLight = false,
  padding,
  onClick,
  mode = 'standard',
  style,
}: LiquidGlassProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // SSR 或未 mount 时使用 CSS 回退
  if (!mounted) {
    return (
      <div 
        className={cn(
          'liquid-glass-fallback rounded-3xl',
          'bg-white/5 backdrop-blur-xl',
          'border border-white/20',
          'shadow-[0_20px_40px_-10px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.5)]',
          className
        )}
        style={{ 
          padding, 
          borderRadius: cornerRadius,
          ...style 
        }}
        onClick={onClick}
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
      overLight={overLight}
      padding={padding}
      onClick={onClick}
      mode={mode}
      className={cn('liquid-glass-component', className)}
      style={style}
    >
      {children}
    </LiquidGlassLib>
  )
}

/**
 * 液态玻璃卡片 - 预设配置
 */
export function LiquidGlassCard({
  children,
  className,
  ...props
}: Omit<LiquidGlassProps, 'cornerRadius' | 'padding'>) {
  return (
    <LiquidGlass
      displacementScale={50}
      blurAmount={0.05}
      saturation={130}
      aberrationIntensity={1.5}
      elasticity={0.12}
      cornerRadius={24}
      padding="24px"
      className={cn('liquid-glass-card', className)}
      {...props}
    >
      {children}
    </LiquidGlass>
  )
}

/**
 * 液态玻璃按钮 - 预设配置
 */
export function LiquidGlassButton({
  children,
  className,
  onClick,
  ...props
}: Omit<LiquidGlassProps, 'cornerRadius' | 'padding'>) {
  return (
    <LiquidGlass
      displacementScale={40}
      blurAmount={0.08}
      saturation={150}
      aberrationIntensity={2}
      elasticity={0.25}
      cornerRadius={999}
      padding="12px 24px"
      onClick={onClick}
      className={cn('liquid-glass-button cursor-pointer', className)}
      {...props}
    >
      {children}
    </LiquidGlass>
  )
}

/**
 * 液态玻璃导航栏 - 预设配置
 */
export function LiquidGlassNav({
  children,
  className,
  ...props
}: Omit<LiquidGlassProps, 'cornerRadius' | 'padding'>) {
  return (
    <LiquidGlass
      displacementScale={30}
      blurAmount={0.04}
      saturation={120}
      aberrationIntensity={1}
      elasticity={0.1}
      cornerRadius={0}
      className={cn('liquid-glass-nav w-full', className)}
      {...props}
    >
      {children}
    </LiquidGlass>
  )
}

export default LiquidGlass
