// 语言代理 - 处理语言切换和检测
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 检测用户语言
export function detectUserLanguage(acceptLanguage?: string): string {
  if (!acceptLanguage) {
    return 'zh'
  }
  
  // 解析 Accept-Language 头
  const languages = acceptLanguage.split(',').map(lang => {
    const [code, quality = 'q=1'] = lang.trim().split(';')
    const q = parseFloat(quality.split('=')[1]) || 1
    return { code, q }
  })
  
  // 按质量排序
  languages.sort((a, b) => b.q - a.q)
  
  // 检查是否包含中文
  const hasChinese = languages.some(lang => 
    lang.code.toLowerCase().includes('zh') || 
    lang.code.toLowerCase().includes('cn') ||
    lang.code.toLowerCase().includes('tw') ||
    lang.code.toLowerCase().includes('hk')
  )
  
  // 如果用户语言包含中文，返回中文
  if (hasChinese) {
    return 'zh'
  }
  
  // 否则返回英文
  return 'en'
}

// 设置语言 Cookie
export function setLanguageCookie(lang: string): void {
  if (typeof document === 'undefined') {
    return
  }
  
  const maxAge = 30 * 24 * 60 * 60 // 30 天
  document.cookie = `user-language=${lang}; path=/; max-age=${maxAge}`
  localStorage.setItem('user-language', lang)
}

// 获取语言 Cookie
export function getLanguageCookie(): string {
  if (typeof document === 'undefined') {
    return 'zh'
  }
  
  const cookies = document.cookie.split(';').map(cookie => cookie.trim())
  const langCookie = cookies.find(cookie => cookie.startsWith('user-language='))
  
  if (langCookie) {
    return langCookie.split('=')[1]
  }
  
  return 'zh'
}

// 初始化语言设置
export function initLanguage(): string {
  if (typeof document === 'undefined') {
    return 'zh'
  }
  
  // 先从 Cookie 读取
  let lang = getLanguageCookie()
  
  // 如果没有 Cookie，从浏览器语言检测
  if (lang === 'zh' && !document.cookie.includes('user-language=')) {
    const browserLang = navigator.language || (navigator as any).userLanguage
    lang = detectUserLanguage(browserLang)
    setLanguageCookie(lang)
  }
  
  return lang
}

// Next.js Proxy 函数 - 处理服务端请求的语言检测
export function proxy(request: NextRequest) {
  // 获取 Accept-Language 头
  const acceptLanguage = request.headers.get('accept-language') || ''
  
  // 检测用户语言
  const lang = detectUserLanguage(acceptLanguage)
  
  // 创建响应
  const response = NextResponse.next()
  
  // 设置 Cookie，让客户端可以读取
  response.cookies.set('user-language', lang, {
    maxAge: 30 * 24 * 60 * 60, // 30 天
    path: '/',
    sameSite: 'lax',
  })
  
  // 添加响应头，供页面使用
  response.headers.set('x-user-language', lang)
  
  return response
}

export const config = {
  matcher: [
    /*
     * 匹配所有路由，除了：
     * - api (Next.js API 路由)
     * - _next/static (静态文件)
     * - _next/image (图片优化)
     * - favicon.ico (favicon 文件)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

// 使用 Edge Runtime
export const runtime = 'edge'
