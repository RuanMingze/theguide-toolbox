'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Github } from 'lucide-react'

function GitHubCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('processing')

  useEffect(() => {
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const state = searchParams.get('state')

    if (error) {
      setStatus('error')
      setTimeout(() => {
        router.push('/')
      }, 3000)
      return
    }

    if (code) {
      // 调用服务端 API 交换 token
      fetch('/api/oauth/github/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, state }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user) {
            // 保存用户信息到本地存储
            localStorage.setItem('oauth_user', JSON.stringify(data.user))
            localStorage.setItem('oauth_logged_in', 'true')
            localStorage.setItem('oauth_provider', 'github')

            setStatus('success')
            setTimeout(() => {
              router.push('/?logged_in=true')
            }, 2000)
          } else {
            setStatus('error')
            setTimeout(() => {
              router.push('/')
            }, 3000)
          }
        })
        .catch((err) => {
          console.error('GitHub callback error:', err)
          setStatus('error')
          setTimeout(() => {
            router.push('/')
          }, 3000)
        })
      return
    }

    setStatus('error')
    setTimeout(() => {
      router.push('/')
    }, 3000)
  }, [searchParams, router])

  return (
    <div className="text-center">
      {status === 'processing' && (
        <>
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
          <h1 className="mb-2 text-2xl font-bold">正在处理 GitHub 登录...</h1>
          <p className="text-muted-foreground">请稍候，正在完成授权流程</p>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <svg
              className="h-6 w-6 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold">GitHub 登录成功！</h1>
          <p className="text-muted-foreground">正在返回首页...</p>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <Github className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="mb-2 text-2xl font-bold">登录失败</h1>
          <p className="text-muted-foreground">正在返回...</p>
        </>
      )}
    </div>
  )
}

export default function GitHubCallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Suspense fallback={
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
          <h1 className="mb-2 text-2xl font-bold">加载中...</h1>
        </div>
      }>
        <GitHubCallbackContent />
      </Suspense>
    </div>
  )
}
