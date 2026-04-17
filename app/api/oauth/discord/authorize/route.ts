import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.DISCORD_OAUTH_CLIENT_ID
    const redirectUri = process.env.DISCORD_OAUTH_REDIRECT_URI

    if (!clientId || !redirectUri) {
      console.error('Discord OAuth configuration missing')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const state = randomUUID()
    
    const authUrl = new URL('https://discord.com/api/oauth2/authorize')
    authUrl.searchParams.set('client_id', clientId)
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('scope', 'identify email')
    authUrl.searchParams.set('state', state)
    authUrl.searchParams.set('prompt', 'consent')

    const response = NextResponse.json({
      authUrl: authUrl.toString(),
      state,
    })

    response.cookies.set('discord_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Discord authorize error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
