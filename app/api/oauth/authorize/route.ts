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

    const authUrl = `${baseUrl}/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=read write`

    return NextResponse.json({ authUrl })
  } catch (error) {
    console.error('OAuth authorize error:', error)
    return NextResponse.json(
      { error: 'Failed to generate authorization URL' },
      { status: 500 }
    )
  }
}
