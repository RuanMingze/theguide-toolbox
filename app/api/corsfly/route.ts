import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

interface CorsFlyRequest {
  url: string
  method?: string
  headers?: Record<string, string>
  body?: any
  timeout?: number
}

interface CorsFlyResponse {
  success: boolean
  status?: number
  statusText?: string
  headers?: Record<string, string>
  body?: any
  error?: string
  timestamp: string
}

// 允许的请求方法白名单
const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']

// 默认超时时间（毫秒）
const DEFAULT_TIMEOUT = 30000

// 最大超时时间（毫秒）
const MAX_TIMEOUT = 60000

// 黑名单域名列表（防止内部网络攻击）
const BLOCKED_HOSTS = [
  '169.254.169.254', // AWS 元数据
  'metadata.google.internal', // GCP 元数据
]

// 验证 URL 是否合法
function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString)
    
    // 只允许 HTTP 和 HTTPS 协议
    if (!['http:', 'https:'].includes(url.protocol)) {
      return false
    }
    
    // 检查黑名单
    const hostname = url.hostname.toLowerCase()
    if (BLOCKED_HOSTS.some(blocked => hostname === blocked || hostname.endsWith(`.${blocked}`))) {
      return false
    }
    
    return true
  } catch {
    return false
  }
}

// 过滤不安全的请求头
function filterHeaders(headers: Record<string, string>): Record<string, string> {
  const forbiddenHeaders = [
    'host',
    'content-length',
    'connection',
    'expect',
    'transfer-encoding',
    'upgrade',
    'te',
    'proxy-',
    'sec-',
    'cookie',
    'origin',
    'referer',
  ]
  
  const filtered: Record<string, string> = {}
  
  for (const [key, value] of Object.entries(headers)) {
    const lowerKey = key.toLowerCase()
    // 跳过禁止的请求头
    if (!forbiddenHeaders.some(forbidden => lowerKey === forbidden || lowerKey.startsWith(forbidden))) {
      filtered[key] = value
    }
  }
  
  return filtered
}

export async function POST(request: NextRequest) {
  const requestId = `corsfly-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  const timestamp = new Date().toISOString()
  
  try {
    console.log(`[${requestId}] 收到 CORS 代理请求`)
    
    // 解析请求体
    let body: CorsFlyRequest
    try {
      body = await request.json()
    } catch {
      return NextResponse.json<CorsFlyResponse>({
        success: false,
        error: '无效的 JSON 请求体',
        timestamp
      }, { status: 400 })
    }
    
    // 验证必填参数
    if (!body.url) {
      return NextResponse.json<CorsFlyResponse>({
        success: false,
        error: '缺少必填参数：url',
        timestamp
      }, { status: 400 })
    }
    
    // 验证 URL
    if (!isValidUrl(body.url)) {
      return NextResponse.json<CorsFlyResponse>({
        success: false,
        error: '无效的 URL 或 URL 被禁止访问',
        timestamp
      }, { status: 400 })
    }
    
    // 验证请求方法
    const method = (body.method || 'GET').toUpperCase()
    if (!ALLOWED_METHODS.includes(method)) {
      return NextResponse.json<CorsFlyResponse>({
        success: false,
        error: `不支持的请求方法：${method}`,
        timestamp
      }, { status: 400 })
    }
    
    // 验证超时时间
    const timeout = Math.min(body.timeout || DEFAULT_TIMEOUT, MAX_TIMEOUT)
    
    console.log(`[${requestId}] ${method} ${body.url} (timeout: ${timeout}ms)`)
    
    // 准备请求头
    const headers = body.headers ? filterHeaders(body.headers) : {}
    
    // 添加默认的 User-Agent
    if (!headers['User-Agent'] && !headers['user-agent']) {
      headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    
    // 设置 AbortController 用于超时控制
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    // 准备 fetch 选项
    const fetchOptions: RequestInit = {
      method,
      signal: controller.signal,
      redirect: 'follow',
      cache: 'no-store',
      headers,
    }
    
    // 添加请求体（GET 和 HEAD 请求不需要）
    if (!['GET', 'HEAD'].includes(method) && body.body !== undefined) {
      fetchOptions.body = typeof body.body === 'string' 
        ? body.body 
        : JSON.stringify(body.body)
      
      // 自动设置 Content-Type
      if (!headers['Content-Type'] && !headers['content-type']) {
        headers['Content-Type'] = 'application/json'
      }
    }
    
    // 发起请求
    const response = await fetch(body.url, fetchOptions)
    clearTimeout(timeoutId)
    
    // 获取响应头
    const responseHeaders: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value
    })
    
    // 尝试解析响应体
    let responseBody: any
    const contentType = response.headers.get('content-type')
    
    try {
      if (contentType && contentType.includes('application/json')) {
        responseBody = await response.json()
      } else if (contentType && contentType.includes('text/')) {
        responseBody = await response.text()
      } else {
        // 其他类型返回 base64
        const arrayBuffer = await response.arrayBuffer()
        const base64 = Buffer.from(arrayBuffer).toString('base64')
        responseBody = {
          type: 'binary',
          encoding: 'base64',
          data: base64
        }
      }
    } catch (parseError) {
      console.warn(`[${requestId}] 解析响应体失败:`, parseError)
      responseBody = await response.text()
    }
    
    console.log(`[${requestId}] 响应：${response.status} ${response.statusText}`)
    
    // 返回成功响应
    return NextResponse.json<CorsFlyResponse>({
      success: true,
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: responseBody,
      timestamp
    })
    
  } catch (error) {
    console.error(`[${requestId}] CORS 代理请求失败:`, error)
    
    const errorMessage = error instanceof Error ? error.message : '未知错误'
    
    // 判断是否是超时错误
    if (errorMessage.includes('timeout') || errorMessage.includes('AbortError')) {
      return NextResponse.json<CorsFlyResponse>({
        success: false,
        error: `请求超时（超过 ${DEFAULT_TIMEOUT / 1000} 秒）`,
        timestamp
      }, { status: 504 })
    }
    
    return NextResponse.json<CorsFlyResponse>({
      success: false,
      error: errorMessage,
      timestamp
    }, { status: 500 })
  }
}

// 添加 OPTIONS 预检请求支持
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    }
  })
}
