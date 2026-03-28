import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const user_profile = searchParams.get('user_profile')

    if (!code) {
      return NextResponse.redirect(new URL('/?error=oauth_failed', request.url))
    }

    const clientSecret = process.env.RUANM_OAUTH_CLIENT_SECRET
    const clientId = process.env.RUANM_OAUTH_CLIENT_ID
    const baseUrl = process.env.RUANM_OAUTH_BASE_URL

    if (!clientSecret || !clientId || !baseUrl) {
      return NextResponse.redirect(new URL('/?error=oauth_config_error', request.url))
    }

    const tokenResponse = await fetch(`${baseUrl}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: process.env.RUANM_OAUTH_REDIRECT_URI,
      }),
    })

    if (!tokenResponse.ok) {
      return NextResponse.redirect(new URL('/?error=token_exchange_failed', request.url))
    }

    const tokenData = await tokenResponse.json()

    const response = NextResponse.redirect(new URL('/?logged_in=true', request.url))

    if (tokenData.access_token) {
      response.cookies.set('oauth_access_token', tokenData.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
    }

    if (user_profile) {
      try {
        const userProfile = JSON.parse(user_profile)
        response.cookies.set('oauth_user_profile', JSON.stringify(userProfile), {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
          path: '/',
        })
      } catch (e) {
        console.error('Failed to parse user profile:', e)
      }
    }

    return response
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(new URL('/?error=oauth_error', request.url))
  }
}
