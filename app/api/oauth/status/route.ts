import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('oauth_access_token')?.value
    const userProfile = request.cookies.get('oauth_user_profile')?.value

    if (!accessToken || !userProfile) {
      return NextResponse.json({ authenticated: false })
    }

    return NextResponse.json({
      authenticated: true,
      user: JSON.parse(userProfile),
    })
  } catch (error) {
    console.error('OAuth status error:', error)
    return NextResponse.json({ authenticated: false })
  }
}

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true })
    response.cookies.delete('oauth_access_token')
    response.cookies.delete('oauth_user_profile')
    return response
  } catch (error) {
    console.error('OAuth logout error:', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}
