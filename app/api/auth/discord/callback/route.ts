import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const { code, state } = await request.json()

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      )
    }

    const clientId = process.env.DISCORD_OAUTH_CLIENT_ID
    const clientSecret = process.env.DISCORD_OAUTH_CLIENT_SECRET
    const redirectUri = process.env.DISCORD_OAUTH_REDIRECT_URI

    console.log('Discord OAuth Environment Check:', {
      has_client_id: !!clientId,
      has_client_secret: !!clientSecret,
      has_redirect_uri: !!redirectUri,
      client_id: clientId ? `${clientId.substring(0, 5)}...` : 'undefined',
      client_secret_length: clientSecret?.length || 0,
      redirect_uri: redirectUri || 'undefined',
    })

    if (!clientId || !clientSecret || !redirectUri) {
      console.error('Discord OAuth configuration missing:', {
        missing_client_id: !clientId,
        missing_client_secret: !clientSecret,
        missing_redirect_uri: !redirectUri,
      })
      return NextResponse.json(
        { 
          error: 'Server configuration error',
          missing: {
            client_id: !clientId,
            client_secret: !clientSecret,
            redirect_uri: !redirectUri,
          }
        },
        { status: 500 }
      )
    }

    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
    }).catch((fetchError) => {
      console.error('Fetch to Discord API failed:', {
        error: fetchError,
        message: fetchError?.message,
        cause: fetchError?.cause,
        name: fetchError?.name,
      })
      throw fetchError
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      console.error('Discord token exchange failed:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: errorData,
        client_id: clientId,
        redirect_uri: redirectUri,
        code_length: code?.length,
      })
      return NextResponse.json(
        { 
          error: 'Failed to exchange authorization code',
          details: errorData,
          status: tokenResponse.status,
        },
        { status: 400 }
      )
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!userResponse.ok) {
      console.error('Failed to fetch user data from Discord')
      return NextResponse.json(
        { error: 'Failed to fetch user information' },
        { status: 400 }
      )
    }

    const userData = await userResponse.json()

    const user = {
      id: userData.id,
      username: userData.username,
      discriminator: userData.discriminator,
      email: userData.email,
      avatar: userData.avatar,
      verified: userData.verified,
    }

    const response = NextResponse.json({
      success: true,
      user: user,
      message: 'Successfully authenticated with Discord',
    })

    response.cookies.set('discord_user', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Discord callback error:', {
      error: error,
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        details: error instanceof Error ? { name: error.name, message: error.message } : undefined
      },
      { status: 500 }
    )
  }
}
