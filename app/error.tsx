'use client'

import { useState } from 'react'
import { AlertTriangle, RefreshCw, Home, Bug, BookOpen, MessageSquare } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [showDetails, setShowDetails] = useState(false)

  // 根据错误信息提供解决方案
  const getSolution = (errorMessage: string) => {
    const solutions: Array<{ pattern: RegExp; title: string; steps: string[] }> = [
      {
        pattern: /Failed to fetch|NetworkError|network/i,
        title: '网络连接问题',
        steps: [
          '检查您的网络连接是否正常',
          '尝试刷新页面或重新加载',
          '如果您使用了代理或 VPN，请尝试关闭或切换节点',
          '检查防火墙设置，确保没有阻止网站访问'
        ]
      },
      {
        pattern: /404|Not Found/i,
        title: '页面未找到',
        steps: [
          '检查 URL 地址是否正确',
          '该页面可能已被删除或移动',
          '尝试返回首页浏览其他内容',
          '如果您是通过链接访问，可能是链接已失效'
        ]
      },
      {
        pattern: /403|Forbidden|unauthorized|authentication/i,
        title: '访问权限问题',
        steps: [
          '您可能需要登录才能访问此页面',
          '检查您的账户是否有访问权限',
          '尝试清除浏览器缓存和 Cookie 后重新登录',
          '联系管理员获取访问权限'
        ]
      },
      {
        pattern: /500|Internal Server Error|server/i,
        title: '服务器错误',
        steps: [
          '这是服务器端的问题，请稍后重试',
          '刷新页面可能会解决问题',
          '如果问题持续，请联系技术支持',
          '您可以稍后再来访问'
        ]
      },
      {
        pattern: /hydration|render|React/i,
        title: '页面渲染问题',
        steps: [
          '清除浏览器缓存后刷新页面',
          '尝试使用无痕模式打开',
          '检查浏览器是否为最新版本',
          '如果问题持续，请更换浏览器尝试'
        ]
      },
      {
        pattern: /API|api|endpoint/i,
        title: 'API 接口问题',
        steps: [
          'API 服务暂时不可用，请稍后重试',
          '检查网络连接是否正常',
          '如果是天气等第三方 API，可能是服务限制',
          '刷新页面或重新尝试操作'
        ]
      }
    ]

    const matched = solutions.find(s => s.pattern.test(errorMessage))
    return matched || {
      title: '通用解决方案',
      steps: [
        '刷新页面或点击"重试"按钮',
        '清除浏览器缓存和 Cookie',
        '检查网络连接是否正常',
        '如果问题持续，请联系技术支持'
      ]
    }
  }

  const solution = getSolution(error.message)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="max-w-2xl space-y-6">
        {/* 错误图标和标题 */}
        <div className="flex flex-col items-center space-y-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">发生错误</h1>
        </div>

        {/* 错误信息 */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">错误详情</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {error.message || '抱歉，出现了一些未预期的问题'}
              </p>
            </div>

            {error.digest && (
              <div className="rounded bg-muted p-3">
                <p className="text-xs font-mono text-muted-foreground">
                  Error ID: {error.digest}
                </p>
              </div>
            )}

            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-primary hover:underline"
            >
              {showDetails ? '隐藏详情' : '显示更多技术细节'}
            </button>

            {showDetails && (
              <div className="rounded bg-muted p-4">
                <pre className="whitespace-pre-wrap text-xs font-mono text-muted-foreground">
                  {JSON.stringify({
                    name: error.name,
                    message: error.message,
                    stack: error.stack,
                    digest: error.digest
                  }, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* 解决方案 */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">如何解决这个问题？</h2>
          </div>
          
          <div className="mb-4 rounded bg-primary/10 p-3">
            <p className="text-sm font-medium text-primary">
              可能的问题：{solution.title}
            </p>
          </div>

          <ol className="space-y-2">
            {solution.steps.map((step, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <span className="text-sm text-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <RefreshCw className="h-4 w-4" />
            重试
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <RefreshCw className="h-4 w-4" />
            刷新页面
          </button>
          
          <a
            href="/"
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <Home className="h-4 w-4" />
            返回首页
          </a>
        </div>

        {/* 报告问题 */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-start gap-3">
            <Bug className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                问题仍然存在？
              </p>
              <p className="text-sm text-muted-foreground">
                如果以上方法都无法解决问题，您可以：
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://github.com/your-repo/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <MessageSquare className="h-3 w-3" />
                  提交 Issue
                </a>
                <span className="text-xs text-muted-foreground">或</span>
                <a
                  href="/feedback"
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <MessageSquare className="h-3 w-3" />
                  反馈问题
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 页脚提示 */}
        <div className="text-center text-xs text-muted-foreground">
          <p>提示：清除浏览器缓存 (Ctrl+Shift+Delete) 通常可以解决大部分问题</p>
        </div>
      </div>
    </div>
  )
}
