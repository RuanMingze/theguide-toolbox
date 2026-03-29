import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const { code, state } = await request.json()

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'No code provided' },
        { status: 400 }
      )
    }

    // 验证 CSRF state 参数
    const savedState = request.cookies.get('github_oauth_state')?.value
    if (!state || !savedState || state !== savedState) {
      console.error('CSRF state mismatch')
      return NextResponse.json(
        { success: false, error: 'CSRF validation failed' },
        { status: 400 }
      )
    }

    const clientId = process.env.GITHUB_OAUTH_CLIENT_ID
    const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET
    const redirectUri = process.env.GITHUB_OAUTH_REDIRECT_URI

    if (!clientId || !clientSecret || !redirectUri) {
      console.error('GitHub OAuth configuration error')
      return NextResponse.json(
        { success: false, error: 'OAuth configuration error' },
        { status: 500 }
      )
    }

    // 使用 code 交换 access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
      }),
    })

    if (!tokenResponse.ok) {
      console.error('Failed to exchange token:', tokenResponse.status)
      return NextResponse.json(
        { success: false, error: 'Failed to exchange token' },
        { status: 500 }
      )
    }

    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token) {
      console.error('No access token in response')
      return NextResponse.json(
        { success: false, error: 'No access token received' },
        { status: 500 }
      )
    }

    // 使用 access token 获取用户信息
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${tokenData.access_token}`,
        Accept: 'application/json',
      },
    })

    if (!userResponse.ok) {
      console.error('Failed to fetch user info:', userResponse.status)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch user info' },
        { status: 500 }
      )
    }

    const userData = await userResponse.json()

    // 如果用户没有公开邮箱，尝试获取邮箱列表
    let email = userData.email || null
    if (!email) {
      try {
        const emailsResponse = await fetch('https://api.github.com/user/emails', {
          headers: {
            Authorization: `token ${tokenData.access_token}`,
            Accept: 'application/json',
          },
        })

        if (emailsResponse.ok) {
          const emailsData = await emailsResponse.json()
          const primaryEmail = emailsData.find((e: any) => e.primary && e.verified)
          email = primaryEmail ? primaryEmail.email : null
        }
      } catch (e) {
        console.error('Failed to fetch emails:', e)
      }
    }

    // 构建用户信息对象
    const userProfile = {
      id: userData.id,
      name: userData.name || userData.login,
      email: email || `${userData.login}@users.noreply.github.com`,
      avatar_url: userData.avatar_url || '',
      has_beta_access: false,
      provider: 'github',
      github_login: userData.login,
    }

    const response = NextResponse.json({
      success: true,
      user: userProfile,
    })

    // 存储 access token 到 cookie
    response.cookies.set('github_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    // 删除已使用的 state cookie
    response.cookies.delete('github_oauth_state')

    return response
  } catch (error) {
    console.error('GitHub OAuth callback error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
