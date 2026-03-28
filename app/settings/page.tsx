'use client'

import { useState, useEffect, useRef } from 'react'
import { Image, Eye, EyeOff, X, Upload, Link as LinkIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const wallpapers = [
  {
    id: 'none',
    name: '无',
    url: '',
  },
  {
    id: 'gradient-1',
    name: '渐变 1',
    url: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: 'gradient-2',
    name: '渐变 2',
    url: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    id: 'gradient-3',
    name: '渐变 3',
    url: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    id: 'gradient-4',
    name: '渐变 4',
    url: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  },
  {
    id: 'gradient-5',
    name: '渐变 5',
    url: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
]

export default function SettingsPage() {
  const [wallpaper, setWallpaper] = useState<string>('')
  const [glassEffect, setGlassEffect] = useState<boolean>(true)
  const [glassColor, setGlassColor] = useState<string>('255, 255, 255')
  const [glassOpacity, setGlassOpacity] = useState<number>(10)
  const [customImageUrl, setCustomImageUrl] = useState<string>('')
  const [isImageUrlMode, setIsImageUrlMode] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showRefreshTip, setShowRefreshTip] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // 从 localStorage 加载设置
    const savedSettings = localStorage.getItem('theguide-settings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setWallpaper(settings.wallpaper || '')
      setGlassEffect(settings.glassEffect ?? true)
      setGlassColor(settings.glassColor || '255, 255, 255')
      setGlassOpacity(settings.glassOpacity || 10)
      if (settings.customImageUrl) {
        setCustomImageUrl(settings.customImageUrl)
      }
    }
  }, [])
  
  // 每次设置变化时立即应用
  useEffect(() => {
    // 应用壁纸
    const body = document.body
    if (wallpaper) {
      body.style.setProperty('background-image', wallpaper, 'important')
      body.style.setProperty('background-size', 'cover', 'important')
      body.style.setProperty('background-position', 'center', 'important')
      body.style.setProperty('background-attachment', 'fixed', 'important')
      body.style.setProperty('background-color', 'transparent', 'important')
      console.log('[SettingsPage] Wallpaper applied:', wallpaper.substring(0, 50) + '...')
      
      // 广播设置变化
      const channel = new BroadcastChannel('theguide-settings')
      channel.postMessage({
        type: 'wallpaper-changed',
        wallpaper
      })
      channel.close()
    } else {
      body.style.removeProperty('background-image')
      body.style.removeProperty('background-size')
      body.style.removeProperty('background-position')
      body.style.removeProperty('background-attachment')
      body.style.removeProperty('background-color')
    }
    
    // 应用毛玻璃效果
    const root = document.documentElement
    if (glassEffect) {
      root.style.setProperty('--glass-bg', `rgba(${glassColor}, ${glassOpacity / 100})`)
      root.style.setProperty('--glass-blur', '20px')
    } else {
      root.style.removeProperty('--glass-bg')
      root.style.removeProperty('--glass-blur')
    }
  }, [wallpaper, glassEffect, glassColor, glassOpacity])

  const handleSettingChange = () => {
    setHasUnsavedChanges(true)
  }

  useEffect(() => {
    // 自动保存设置（实时保存）
    const settings = {
      wallpaper,
      glassEffect,
      glassColor,
      glassOpacity,
      customImageUrl,
    }
    localStorage.setItem('theguide-settings', JSON.stringify(settings))
    setHasUnsavedChanges(false)
    
    // 提示用户刷新页面
    if (wallpaper || glassEffect) {
      setShowRefreshTip(true)
      // 3 秒后自动隐藏提示
      setTimeout(() => setShowRefreshTip(false), 3000)
    }
  }, [wallpaper, glassEffect, glassColor, glassOpacity, customImageUrl])

  const handleReset = () => {
    setWallpaper('')
    setGlassEffect(true)
    setGlassColor('255, 255, 255')
    setGlassOpacity(10)
    setCustomImageUrl('')
    localStorage.removeItem('theguide-settings')
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File selected:', e.target.files?.[0])
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('请上传图片文件')
        return
      }
      
      handleSettingChange()
      
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        console.log('Image loaded:', result.substring(0, 50) + '...')
        setCustomImageUrl(result)
        setWallpaper(`url('${result}')`)
      }
      reader.onerror = (error) => {
        console.error('FileReader error:', error)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUrlSubmit = () => {
    if (customImageUrl) {
      setWallpaper(`url('${customImageUrl}')`)
    }
  }

  return (
    <div className="min-h-screen bg-transparent py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">设置</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            自定义您的个性化设置
          </p>
        </div>

        <div className="space-y-6">
          {/* 壁纸设置 */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <Image className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">壁纸</h2>
            </div>
            
            {/* 预设壁纸 */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-medium text-foreground">预设壁纸</h3>
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
                {wallpapers.map((wp) => (
                  <button
                    key={wp.id}
                    onClick={() => {
                      handleSettingChange()
                      setWallpaper(wp.url)
                      setCustomImageUrl('')
                    }}
                    className={cn(
                      "relative aspect-square rounded-lg border-2 transition-all hover:scale-105",
                      wallpaper === wp.url && !customImageUrl
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border"
                    )}
                  >
                    {wp.url ? (
                      <div
                        className="absolute inset-0 rounded-md"
                        style={{ background: wp.url }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <X className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    {wallpaper === wp.url && !customImageUrl && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/20">
                        <div className="h-3 w-3 rounded-full bg-white" />
                      </div>
                    )}
                    <span className="sr-only">{wp.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 自定义壁纸 */}
            <div className="border-t border-border pt-6">
              <h3 className="mb-3 text-sm font-medium text-foreground">自定义壁纸</h3>
              
              {/* 切换按钮 */}
              <div className="mb-4 flex gap-2">
                <button
                onClick={() => {
                  handleSettingChange()
                  setIsImageUrlMode(false)
                }}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  !isImageUrlMode
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                )}
              >
                <Upload className="h-4 w-4" />
                上传图片
              </button>
              <button
                onClick={() => {
                  handleSettingChange()
                  setIsImageUrlMode(true)
                }}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  isImageUrlMode
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                )}
              >
                <LinkIcon className="h-4 w-4" />
                图片链接
              </button>
              </div>

              {isImageUrlMode ? (
                /* 图片链接输入 */
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    placeholder="输入图片 URL，例如：https://example.com/wallpaper.jpg"
                    className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    onClick={handleImageUrlSubmit}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    应用
                  </button>
                </div>
              ) : (
                /* 图片上传 */
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    onClick={(e) => {
                      // 清空之前的选择，确保同一文件可以重复选择
                      ;(e.target as HTMLInputElement).value = ''
                    }}
                    className="hidden"
                  />
                  <button
                    onClick={() => {
                      console.log('Upload button clicked')
                      fileInputRef.current?.click()
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-6 transition-colors hover:border-primary/50 hover:bg-secondary/50"
                  >
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">点击上传图片</p>
                      <p className="text-xs text-muted-foreground">支持 JPG、PNG、GIF 等格式</p>
                    </div>
                  </button>
                </div>
              )}

              {/* 当前自定义壁纸预览 */}
              {customImageUrl && (
                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">当前自定义壁纸</span>
                    <button
                      onClick={() => {
                        setCustomImageUrl('')
                        setWallpaper('')
                      }}
                      className="text-sm text-destructive hover:text-destructive-foreground"
                    >
                      清除
                    </button>
                  </div>
                  <div
                    className="h-32 w-full rounded-lg border border-border bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url('${customImageUrl}')` }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* 毛玻璃效果 */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">毛玻璃特效</h2>
              </div>
              <button
                onClick={() => {
                  handleSettingChange()
                  setGlassEffect(!glassEffect)
                }}
                className={cn(
                  "relative h-6 w-11 rounded-full transition-colors",
                  glassEffect ? "bg-primary" : "bg-muted"
                )}
              >
                <div
                  className={cn(
                    "absolute top-1 h-4 w-4 rounded-full bg-white transition-transform",
                    glassEffect ? "left-6" : "left-1"
                  )}
                />
              </button>
            </div>

            {glassEffect && (
              <div className="space-y-6">
                {/* 颜色选择 */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    毛玻璃颜色
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => {
                        handleSettingChange()
                        setGlassColor('255, 255, 255')
                      }}
                      className={cn(
                        "h-12 rounded-lg border-2 transition-all",
                        glassColor === '255, 255, 255'
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border"
                      )}
                      style={{ background: 'rgb(255, 255, 255)' }}
                    />
                    <button
                      onClick={() => {
                        handleSettingChange()
                        setGlassColor('0, 0, 0')
                      }}
                      className={cn(
                        "h-12 rounded-lg border-2 transition-all",
                        glassColor === '0, 0, 0'
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border"
                      )}
                      style={{ background: 'rgb(0, 0, 0)' }}
                    />
                    <button
                      onClick={() => {
                        handleSettingChange()
                        setGlassColor('255, 255, 255')
                      }}
                      className={cn(
                        "h-12 rounded-lg border-2 transition-all",
                        glassColor === '255, 255, 255'
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border"
                      )}
                      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                    />
                  </div>
                </div>

                {/* 透明度滑块 */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    透明度：{glassOpacity}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={glassOpacity}
                    onChange={(e) => {
                      handleSettingChange()
                      setGlassOpacity(Number(e.target.value))
                    }}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted"
                  />
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>50%</span>
                  </div>
                </div>

                {/* 预览 */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    预览
                  </label>
                  <div
                    className="h-24 rounded-lg border border-border"
                    style={{
                      background: `rgba(${glassColor}, ${glassOpacity / 100})`,
                      backdropFilter: 'blur(20px)',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 保存和重置按钮 */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleReset}
              className="rounded-lg border border-border bg-card px-6 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              重置为默认设置
            </button>
            {hasUnsavedChanges && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>设置已自动保存</span>
              </div>
            )}
          </div>
          
          {/* 刷新提示 */}
          {showRefreshTip && (
            <div className="fixed bottom-4 right-4 flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 shadow-lg backdrop-blur-sm">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">设置已保存</p>
                <p className="text-xs text-muted-foreground">刷新页面后生效</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                立即刷新
              </button>
              <button
                onClick={() => setShowRefreshTip(false)}
                className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
