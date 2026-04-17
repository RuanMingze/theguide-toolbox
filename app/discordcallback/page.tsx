'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function DiscordCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      const state = searchParams.get('state')
      const error = searchParams.get('error')

      if (error) {
        setStatus('error')
        setErrorMessage(`Discord authorization error: ${error}`)
        return
      }

      if (!code) {
        setStatus('error')
        setErrorMessage('No authorization code received')
        return
      }

      try {
        const response = await fetch('/api/auth/discord/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            state,
          }),
        })

        const data = await response.json()
        
        console.error('Discord callback response:', {
          status: response.status,
          data,
        })

        if (!response.ok) {
          throw new Error(data.error || data.details?.error || `HTTP ${response.status}: ${JSON.stringify(data)}`)
        }

        // 保存用户信息到本地存储
        const userProfile = {
          id: data.user.id,
          name: data.user.username,
          email: data.user.email || '',
          avatar_url: data.user.avatar ? `https://cdn.discordapp.com/avatars/${data.user.id}/${data.user.avatar}.png` : '',
          has_beta_access: false,
          provider: 'discord' as const,
          discord_username: data.user.username,
          discord_discriminator: data.user.discriminator,
        }
        
        localStorage.setItem('oauth_user', JSON.stringify(userProfile))
        localStorage.setItem('oauth_logged_in', 'true')
        localStorage.setItem('oauth_provider', 'discord')

        setUserData(data.user)
        setStatus('success')

        setTimeout(() => {
          router.push('/')
        }, 2000)
      } catch (err) {
        console.error('Discord callback error:', err)
        setStatus('error')
        setErrorMessage(err instanceof Error ? err.message : '发生未知错误')
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5865F2] via-[#4752C4] to-[#3641A0] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Discord Logo */}
          <div className="flex justify-center mb-6">
            <svg
              className="w-20 h-20 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
            </svg>
          </div>

          {status === 'loading' && (
            <>
              <h1 className="text-2xl font-bold text-white text-center mb-4">
                正在连接到 Discord...
              </h1>
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
              <p className="text-white/80 text-center">
                请稍候，我们正在完成您的身份验证
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white text-center mb-4">
                连接成功！
              </h1>
              {userData && (
                <div className="bg-white/10 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3">
                    {userData.avatar ? (
                      <img
                        src={`https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`}
                        alt={userData.username}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                        {userData.username?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <div>
                      <p className="text-white font-semibold">
                        {userData.username}#{userData.discriminator}
                      </p>
                      <p className="text-white/60 text-sm">
                        {userData.email || '未提供邮箱'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <p className="text-white/80 text-center">
                正在跳转回首页...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white text-center mb-4">
                连接失败
              </h1>
              <p className="text-white/80 text-center mb-6">
                {errorMessage}
              </p>
              <div className="flex gap-3">
                <Link
                  href="/"
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-center"
                >
                  回到首页
                </Link>
                <button
                  onClick={() => router.push('/')}
                  className="flex-1 bg-white hover:bg-gray-100 text-indigo-600 font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  再试一次
                </button>
              </div>
            </>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-white/60 text-sm">
            继续即表示您同意我们的{' '}
            <Link href="/terms" className="text-white/80 hover:text-white underline">
              服务条款
            </Link>
            {' '}和{' '}
            <Link href="/privacy" className="text-white/80 hover:text-white underline">
              隐私政策
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function DiscordCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#5865F2] via-[#4752C4] to-[#3641A0] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    }>
      <DiscordCallbackContent />
    </Suspense>
  )
}
