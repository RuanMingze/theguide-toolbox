'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

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
  /** 是否禁用交互效果 */
  disableInteraction?: boolean
}

/**
 * iOS 26 风格的液态玻璃组件
 * 使用 SVG 滤镜实现真实的折射和边缘反射效果
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
  disableInteraction = false,
}: LiquidGlassProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const [isHovered, setIsHovered] = useState(false)
  const [filterId] = useState(() => `liquid-glass-${Math.random().toString(36).substr(2, 9)}`)

  // 处理鼠标移动 - 计算相对位置
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (disableInteraction || !containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    
    // 应用弹性效果
    setMousePos(prev => ({
      x: prev.x + (x - prev.x) * (1 - elasticity),
      y: prev.y + (y - prev.y) * (1 - elasticity),
    }))
  }, [disableInteraction, elasticity])

  // 动态计算滤镜参数
  const filterBlur = blurAmount * 16
  const edgeHighlightOpacity = overLight ? 0.3 : 0.6
  const innerShadowOpacity = overLight ? 0.1 : 0.2

  // 计算边缘高光位置（基于鼠标位置）
  const highlightX = mousePos.x * 100
  const highlightY = mousePos.y * 100

  return (
    <>
      {/* SVG 滤镜定义 */}
      <svg 
        className="absolute w-0 h-0 overflow-hidden" 
        aria-hidden="true"
        style={{ position: 'fixed', left: -9999, top: -9999 }}
      >
        <defs>
          {/* 主折射滤镜 */}
          <filter 
            id={filterId} 
            x="-50%" 
            y="-50%" 
            width="200%" 
            height="200%"
            colorInterpolationFilters="sRGB"
          >
            {/* 创建高斯模糊用于位移映射 */}
            <feGaussianBlur in="SourceAlpha" stdDeviation="10" result="blur" />
            
            {/* 创建边缘位移贴图 */}
            <feComponentTransfer in="blur" result="heightMap">
              <feFuncR type="linear" slope="2" intercept="-0.5" />
              <feFuncG type="linear" slope="2" intercept="-0.5" />
            </feComponentTransfer>
            
            {/* 位移映射 - 核心折射效果 */}
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="heightMap" 
              scale={displacementScale} 
              xChannelSelector="R" 
              yChannelSelector="G" 
              result="displaced"
            />
            
            {/* 模糊效果 */}
            <feGaussianBlur in="displaced" stdDeviation={filterBlur} result="blurred" />
            
            {/* 饱和度调整 */}
            <feColorMatrix 
              in="blurred" 
              type="saturate" 
              values={saturation / 100} 
              result="saturated"
            />
            
            {/* 色差效果 - 红色通道偏移 */}
            <feOffset in="saturated" dx={aberrationIntensity} dy={0} result="redShift" />
            <feColorMatrix 
              in="redShift" 
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0.15 0"
              result="red"
            />
            
            {/* 色差效果 - 蓝色通道偏移 */}
            <feOffset in="saturated" dx={-aberrationIntensity} dy={0} result="blueShift" />
            <feColorMatrix 
              in="blueShift" 
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 1 0 0
                      0 0 0 0.15 0"
              result="blue"
            />
            
            {/* 合并色差 */}
            <feBlend in="saturated" in2="red" mode="screen" result="withRed" />
            <feBlend in="withRed" in2="blue" mode="screen" result="final" />
            
            {/* 镜面高光 */}
            <feSpecularLighting 
              in="blur" 
              surfaceScale="3" 
              specularConstant="0.8" 
              specularExponent="20"
              lightingColor="#ffffff"
              result="specular"
            >
              <fePointLight x={highlightX} y={highlightY} z="200" />
            </feSpecularLighting>
            
            <feComposite in="specular" in2="SourceAlpha" operator="in" result="specularMasked" />
            <feBlend in="final" in2="specularMasked" mode="screen" />
          </filter>

          {/* 边缘高光渐变 */}
          <linearGradient id={`${filterId}-edge-top`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity={edgeHighlightOpacity} />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          <linearGradient id={`${filterId}-edge-left`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity={edgeHighlightOpacity * 0.7} />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* 主容器 */}
      <div
        ref={containerRef}
        className={cn(
          'liquid-glass-container relative',
          className
        )}
        style={{
          borderRadius: cornerRadius,
          isolation: 'isolate',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false)
          setMousePos({ x: 0.5, y: 0.5 })
        }}
      >
        {/* 背景折射层 */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{
            borderRadius: cornerRadius,
            filter: `url(#${filterId})`,
            backdropFilter: `blur(${filterBlur}px) saturate(${saturation}%)`,
            WebkitBackdropFilter: `blur(${filterBlur}px) saturate(${saturation}%)`,
          }}
        />

        {/* 边缘高光层 - 顶部 */}
        <div
          className="absolute inset-x-0 top-0 h-[2px] pointer-events-none"
          style={{
            borderRadius: `${cornerRadius}px ${cornerRadius}px 0 0`,
            background: `linear-gradient(
              90deg,
              transparent 0%,
              rgba(255, 255, 255, ${edgeHighlightOpacity * 0.5}) 20%,
              rgba(255, 255, 255, ${edgeHighlightOpacity}) 50%,
              rgba(255, 255, 255, ${edgeHighlightOpacity * 0.5}) 80%,
              transparent 100%
            )`,
            transform: isHovered ? 'scaleX(1.02)' : 'scaleX(1)',
            transition: 'transform 0.3s ease',
          }}
        />

        {/* 边缘高光层 - 左侧 */}
        <div
          className="absolute inset-y-0 left-0 w-[2px] pointer-events-none"
          style={{
            borderRadius: `${cornerRadius}px 0 0 ${cornerRadius}px`,
            background: `linear-gradient(
              180deg,
              rgba(255, 255, 255, ${edgeHighlightOpacity * 0.3}) 0%,
              rgba(255, 255, 255, ${edgeHighlightOpacity * 0.5}) 30%,
              rgba(255, 255, 255, ${edgeHighlightOpacity * 0.3}) 100%
            )`,
          }}
        />

        {/* 边缘暗影层 - 底部 */}
        <div
          className="absolute inset-x-0 bottom-0 h-[1px] pointer-events-none"
          style={{
            borderRadius: `0 0 ${cornerRadius}px ${cornerRadius}px`,
            background: `linear-gradient(
              90deg,
              transparent 10%,
              rgba(0, 0, 0, ${innerShadowOpacity}) 50%,
              transparent 90%
            )`,
          }}
        />

        {/* 边缘暗影层 - 右侧 */}
        <div
          className="absolute inset-y-0 right-0 w-[1px] pointer-events-none"
          style={{
            borderRadius: `0 ${cornerRadius}px ${cornerRadius}px 0`,
            background: `linear-gradient(
              180deg,
              transparent 10%,
              rgba(0, 0, 0, ${innerShadowOpacity * 0.5}) 50%,
              transparent 90%
            )`,
          }}
        />

        {/* 内容区域 */}
        <div 
          className="relative z-10"
          style={{
            borderRadius: cornerRadius,
          }}
        >
          {children}
        </div>

        {/* 外阴影 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: cornerRadius,
            boxShadow: `
              0 25px 50px -12px rgba(0, 0, 0, 0.25),
              0 12px 25px -8px rgba(0, 0, 0, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, ${edgeHighlightOpacity}),
              inset 0 -1px 0 rgba(0, 0, 0, ${innerShadowOpacity}),
              inset 1px 0 0 rgba(255, 255, 255, ${edgeHighlightOpacity * 0.5}),
              inset -1px 0 0 rgba(0, 0, 0, ${innerShadowOpacity * 0.5})
            `,
          }}
        />
      </div>
    </>
  )
}

export default LiquidGlass
