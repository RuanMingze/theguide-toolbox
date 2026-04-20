'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send, Mail, User, MessageSquare, X } from 'lucide-react'
import { Navbar } from '../../components/navbar'
import { useAuth } from '../../hooks/use-auth'
import { useSettings } from '../../hooks/use-settings'

export default function FeedbackPage() {
  const router = useRouter()
  const { user } = useAuth()
  
  // 应用壁纸设置
  useSettings()
  
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          message,
          email: email || undefined,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '发送失败')
      }

      setSubmitStatus('success')
      setSubject('')
      setMessage('')
      setEmail('')

      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (error) {
      console.error('Failed to send feedback:', error)
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : '发送失败，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            反馈与建议
          </h1>
          <p className="mt-2 text-muted-foreground">
            有任何问题或建议？请告诉我们，我们会认真听取每一条反馈
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 发件人信息 */}
            <div className="rounded-lg bg-muted p-4">
              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-foreground">发件人</h3>
                  {user ? (
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{user.email || '用户'}</span>
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        已登录
                      </span>
                    </div>
                  ) : (
                    <div className="mt-2 text-sm text-muted-foreground">
                      未登录，将使用匿名邮箱发送
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 主题 */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                主题 <span className="text-red-500">*</span>
              </label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="请简要描述您的反馈主题"
                required
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* 自定义邮箱（可选） */}
            {!user && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  您的邮箱 <span className="text-muted-foreground">(可选)</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="如果您希望我们回复，请留下邮箱"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  不填写将使用 no-reply@ruanmgjx.dpdns.org
                </p>
              </div>
            )}

            {/* 消息内容 */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                详细内容 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="请详细描述您的问题、建议或其他反馈..."
                required
                rows={8}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                请尽量详细描述，帮助我们更好地理解您的需求
              </p>
            </div>

            {/* 提交按钮 */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    发送中...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    发送反馈
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                <X className="h-4 w-4" />
                取消
              </button>
            </div>

            {/* 状态提示 */}
            {submitStatus === 'success' && (
              <div className="rounded-lg bg-green-500/10 p-4 text-green-500">
                <p className="font-medium">发送成功！</p>
                <p className="text-sm mt-1">感谢您的反馈，我们会尽快处理</p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="rounded-lg bg-red-500/10 p-4 text-red-500">
                <p className="font-medium">发送失败</p>
                <p className="text-sm mt-1">{errorMessage}</p>
              </div>
            )}
          </form>
        </div>

        {/* 其他联系方式 */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h3 className="font-medium text-foreground">Discord 社区</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              加入我们的 Discord 服务器，与其他用户和开发者交流
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="h-5 w-5 text-primary" />
              <h3 className="font-medium text-foreground">直接邮件</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              发送邮件至 support@ruanmgjx.dpdns.org
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
