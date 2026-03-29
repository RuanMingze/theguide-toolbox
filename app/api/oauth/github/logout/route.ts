import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST() {
  try {
    const response = NextResponse.json({ success: true })
    
    // 清除 GitHub OAuth 相关的 cookie
    response.cookies.delete('github_oauth_state')
    response.cookies.delete('github_access_token')
    
    return response
  } catch (error) {
    console.error('GitHub logout error:', error)
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    )
  }
}
