import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.GITHUB_OAUTH_CLIENT_ID
    const redirectUri = process.env.GITHUB_OAUTH_REDIRECT_URI

    if (!clientId || !redirectUri) {
      return NextResponse.json(
        { error: 'GitHub OAuth configuration error' },
        { status: 500 }
      )
    }

    // 生成 CSRF 防护的 state 参数（使用 Web Crypto API）
    const randomValues = new Uint8Array(16)
    crypto.getRandomValues(randomValues)
    const state = Array.from(randomValues)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email&state=${state}`

    const response = NextResponse.json({ authUrl, state })

    // 将 state 存储到 cookie 中，用于后续验证
    response.cookies.set('github_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('GitHub OAuth authorize error:', error)
    return NextResponse.json(
      { error: 'Failed to generate authorization URL' },
      { status: 500 }
    )
  }
}
