import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

interface ServiceConfig {
  id: string
  name: string
  description: string
  checkUrl: string
  timeout: number
}

interface ServiceStatusResult {
  id: string
  name: string
  description: string
  status: 'operational' | 'degraded' | 'down'
  responseTime?: number
  statusCode?: number
  error?: string
}

// 定义要监控的服务
const services: ServiceConfig[] = [
  { 
    id: 'cloudflare', 
    name: 'Cloudflare Pages', 
    description: '主站域名托管',
    checkUrl: 'https://www.cloudflare.com',
    timeout: 10000
  },
  { 
    id: 'vercel', 
    name: 'Vercel', 
    description: '备用站域名托管',
    checkUrl: 'https://vercel.com',
    timeout: 10000
  },
  { 
    id: 'github', 
    name: 'GitHub', 
    description: 'OAuth 认证服务',
    checkUrl: 'https://github.com',
    timeout: 10000
  },
  { 
    id: 'discord', 
    name: 'Discord', 
    description: 'OAuth 认证服务',
    checkUrl: 'https://discord.com',
    timeout: 10000
  },
  { 
    id: 'supabase', 
    name: 'SupaBase', 
    description: '后端数据库服务',
    checkUrl: 'https://supabase.com',
    timeout: 10000
  },
  { 
    id: 'resend', 
    name: 'Resend', 
    description: '邮件发送服务',
    checkUrl: 'https://resend.com',
    timeout: 10000
  },
  { 
    id: 'openweathermap', 
    name: 'OpenWeatherMap', 
    description: '天气数据服务',
    checkUrl: 'https://openweathermap.org',
    timeout: 10000
  },
]

// 检查单个服务状态 - 在服务器端执行，无 CORS 限制
async function checkServiceStatus(service: ServiceConfig): Promise<ServiceStatusResult> {
  const startTime = Date.now()
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), service.timeout)
  
  try {
    const response = await fetch(service.checkUrl, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
    })
    
    clearTimeout(timeoutId)
    const responseTime = Date.now() - startTime
    
    // 能收到响应就说明服务在线（包括 401/403/404）
    // 只有 5xx 才算服务器错误
    if (response.status < 500) {
      return {
        id: service.id,
        name: service.name,
        description: service.description,
        status: 'operational',
        responseTime,
        statusCode: response.status
      }
    } else {
      return {
        id: service.id,
        name: service.name,
        description: service.description,
        status: 'down',
        responseTime,
        statusCode: response.status,
        error: `HTTP ${response.status}`
      }
    }
  } catch (error) {
    const responseTime = Date.now() - startTime
    clearTimeout(timeoutId)
    
    const errorMessage = error instanceof Error ? error.message : '连接失败'
    
    // 连接失败、超时、DNS 错误等都算服务宕机
    return {
      id: service.id,
      name: service.name,
      description: service.description,
      status: 'down',
      responseTime,
      error: errorMessage
    }
  }
}

export async function GET(request: NextRequest) {
  const requestId = `status-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  
  try {
    console.log(`[${requestId}] 开始检查服务状态`)
    
    // 并行检查所有服务
    const results = await Promise.all(
      services.map(service => checkServiceStatus(service))
    )
    
    // 计算整体状态
    const downCount = results.filter(s => s.status === 'down').length
    const degradedCount = results.filter(s => s.status === 'degraded').length
    
    let overallStatus: 'operational' | 'degraded' | 'down' = 'operational'
    if (downCount > 0) {
      overallStatus = 'down'
    } else if (degradedCount > 0) {
      overallStatus = 'degraded'
    }
    
    const operationalCount = results.filter(s => s.status === 'operational').length
    console.log(`[${requestId}] 检查完成：${operationalCount}/${results.length} 正常运行`)
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      overallStatus,
      services: results,
      summary: {
        total: results.length,
        operational: operationalCount,
        degraded: degradedCount,
        down: downCount
      }
    })
    
  } catch (error) {
    console.error(`[${requestId}] 检查服务状态失败:`, error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '检查服务状态失败' 
      },
      { status: 500 }
    )
  }
}
