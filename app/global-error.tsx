'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-background">
          <div className="max-w-md space-y-6 text-center">
            <h1 className="text-6xl font-bold text-primary">Oops!</h1>
            <h2 className="text-2xl font-semibold text-foreground">全局错误</h2>
            <p className="text-muted-foreground">
              {error.message || '抱歉，应用遇到了严重错误'}
            </p>
            
            {error.digest && (
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-xs font-mono text-muted-foreground">
                  Error ID: {error.digest}
                </p>
              </div>
            )}
            
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={reset}
                className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                重试
              </button>
              <button
                onClick={() => window.location.reload()}
                className="rounded-lg border border-border bg-card px-6 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                刷新页面
              </button>
            </div>
            
            <div className="mt-8 rounded-lg border border-border bg-card p-4 text-left">
              <h3 className="mb-2 text-sm font-medium text-foreground">建议操作：</h3>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li>检查网络连接</li>
                <li>清除浏览器缓存</li>
                <li>如果问题持续，请联系管理员</li>
              </ul>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
