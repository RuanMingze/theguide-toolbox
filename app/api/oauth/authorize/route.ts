import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.RUANM_OAUTH_CLIENT_ID
    const redirectUri = process.env.RUANM_OAUTH_REDIRECT_URI
    const baseUrl = process.env.RUANM_OAUTH_BASE_URL

    if (!clientId || !redirectUri || !baseUrl) {
      return NextResponse.json(
        { error: 'OAuth configuration error' },
        { status: 500 }
      )
    }

    // 生成 CSRF 防护的 state 参数（使用 Web Crypto API）
    const randomValues = new Uint8Array(16)
    crypto.getRandomValues(randomValues)
    const state = Array.from(randomValues)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    
    const authUrl = `${baseUrl}/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=read write&state=${state}`

    const response = NextResponse.json({ authUrl, state })
    
    // 将 state 存储到 cookie 中，用于后续验证
    response.cookies.set('oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10, // 10 分钟过期
      path: '/',
    })

    return response
  } catch (error) {
    console.error('OAuth authorize error:', error)
    return NextResponse.json(
      { error: 'Failed to generate authorization URL' },
      { status: 500 }
    )
  }
}
