'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '../../components/navbar'
import { useSettings } from '../../hooks/use-settings'
import { CheckCircle, XCircle, AlertCircle, Loader2, RefreshCw, Server, Cloud, Mail, Clock } from 'lucide-react'

interface ServiceStatus {
  id: string
  name: string
  description: string
  status: 'operational' | 'degraded' | 'down'
  responseTime?: number
  error?: string
}

interface StatusAPIResponse {
  success: boolean
  timestamp: string
  overallStatus: 'operational' | 'degraded' | 'down'
  services: ServiceStatus[]
  summary: {
    total: number
    operational: number
    degraded: number
    down: number
  }
}

const serviceIcons: Record<string, any> = {
  cloudflare: Cloud,
  vercel: Cloud,
  github: Server,
  discord: Server,
  supabase: Server,
  resend: Mail,
  openweathermap: Cloud,
}

export default function StatusPage() {
  const [services, setServices] = useState<ServiceStatus[]>([])
  const [isChecking, setIsChecking] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [overallStatus, setOverallStatus] = useState<'operational' | 'degraded' | 'down'>('operational')
  
  // 应用壁纸设置
  useSettings()

  // 检查所有服务状态
  const checkAllServices = async () => {
    setIsChecking(true)
    
    try {
      const response = await fetch('/api/status')
      if (!response.ok) {
        throw new Error('检查服务状态失败')
      }
      
      const data: StatusAPIResponse = await response.json()
      
      setServices(data.services)
      setOverallStatus(data.overallStatus)
      // 使用客户端当前时间，避免 SSR 水合问题
      setLastUpdated(new Date())
    } catch (error) {
      console.error('检查服务状态失败:', error)
    } finally {
      setIsChecking(false)
    }
  }

  // 初始加载时检查
  useEffect(() => {
    checkAllServices()
    
    // 每 60 秒自动刷新一次
    const interval = setInterval(checkAllServices, 60000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'operational':
        return 'text-green-500 bg-green-500/10 border-green-500/20'
      case 'degraded':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
      case 'down':
        return 'text-red-500 bg-red-500/10 border-red-500/20'
      default:
        return 'text-gray-500 bg-gray-500/10 border-gray-500/20'
    }
  }

  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-5 w-5" />
      case 'degraded':
        return <AlertCircle className="h-5 w-5" />
      case 'down':
        return <XCircle className="h-5 w-5" />
      default:
        return <AlertCircle className="h-5 w-5" />
    }
  }

  const getOverallStatusColor = () => {
    switch (overallStatus) {
      case 'operational':
        return 'text-green-500'
      case 'degraded':
        return 'text-yellow-500'
      case 'down':
        return 'text-red-500'
    }
  }

  const getOverallStatusText = () => {
    switch (overallStatus) {
      case 'operational':
        return '所有系统正常运行'
      case 'degraded':
        return '部分系统性能下降'
      case 'down':
        return '部分系统停止服务'
    }
  }

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            服务状态
          </h1>
          <p className="mt-2 text-muted-foreground">
            实时监控 TheGuide 工具箱依赖的各项服务状态
          </p>
        </div>

        {/* 整体状态概览 */}
        <div className="mb-8 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`rounded-full p-3 ${
                overallStatus === 'operational' ? 'bg-green-500/10' :
                overallStatus === 'degraded' ? 'bg-yellow-500/10' : 'bg-red-500/10'
              }`}>
                {overallStatus === 'operational' ? (
                  <CheckCircle className={`h-8 w-8 ${getOverallStatusColor()}`} />
                ) : overallStatus === 'degraded' ? (
                  <AlertCircle className={`h-8 w-8 ${getOverallStatusColor()}`} />
                ) : (
                  <XCircle className={`h-8 w-8 ${getOverallStatusColor()}`} />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {getOverallStatusText()}
                </h2>
                {lastUpdated && (
                  <p className="text-sm text-muted-foreground">
                    最后更新：{lastUpdated.toLocaleTimeString('zh-CN')}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={checkAllServices}
              disabled={isChecking}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
              {isChecking ? '检查中...' : '刷新'}
            </button>
          </div>
        </div>

        {/* 服务列表 */}
        <div className="space-y-4">
          {services.length === 0 ? (
            // 加载中
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">正在检查服务状态...</span>
            </div>
          ) : (
            // 服务状态列表
            services.map((service) => {
              const Icon = serviceIcons[service.id] || Server

              return (
                <div
                  key={service.id}
                  className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${getStatusColor(service.status)}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-background/50 p-2">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{service.name}</h3>
                      <p className="text-sm opacity-80">{service.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      {service.responseTime && (
                        <div className="flex items-center gap-1 text-sm opacity-80 justify-end">
                          <Clock className="h-4 w-4" />
                          <span>{service.responseTime}ms</span>
                        </div>
                      )}
                      {service.error && service.status === 'down' && (
                        <p className="text-xs text-red-500 mt-1">{service.error}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 min-w-[100px] justify-end">
                      <span className="text-sm font-medium">
                        {service.status === 'operational' ? '正常运行' :
                         service.status === 'degraded' ? '性能下降' :
                         service.status === 'down' ? '停止服务' : '未知'}
                      </span>
                      {getStatusIcon(service.status)}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* 状态说明 */}
        <div className="mt-8 rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
          <h3 className="mb-2 font-semibold text-foreground">状态说明</h3>
          <ul className="space-y-1">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>正常运行 - 服务可访问并响应请求</span>
            </li>
            <li className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span>停止服务 - 服务器错误或无法连接</span>
            </li>
          </ul>
          <p className="mt-3 text-xs opacity-80">
            提示：部分服务（如 GitHub、Discord）对于未认证的请求会返回 401/403/404，但这表示服务本身正常运行。
          </p>
        </div>
      </main>
    </div>
  )
}
