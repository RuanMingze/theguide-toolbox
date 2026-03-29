// Cloudflare Pages Function - 拦截所有 API 请求并路由
interface Env {
  AI: Ai
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context
  const url = new URL(request.url)
  
  // 只处理 /api/workersai/qwen 路由
  if (url.pathname === '/api/workersai/qwen') {
    // 只处理 POST 请求
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    try {
      // 解析请求体
      const { messages, temperature = 0.7, max_tokens = 1024 } = await request.json()

      // 验证 messages 参数
      if (!messages || !Array.isArray(messages)) {
        return new Response(JSON.stringify({ 
          error: 'messages 参数必须是数组' 
        }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // 检查 AI 绑定是否存在
      if (!env.AI) {
        console.error('Workers AI binding not found')
        return new Response(JSON.stringify({ 
          error: 'Workers AI 服务未配置，请检查 Cloudflare Pages 绑定设置' 
        }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // 调用 Workers AI 的 Qwen 模型
      const response = await env.AI.run('@cf/qwen/qwen2.5-7b-instruct', {
        messages,
        temperature,
        max_tokens,
        stream: false,
      })

      return new Response(JSON.stringify({
        success: true,
        data: response,
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.error('WorkersAI Qwen API error:', error)
      return new Response(JSON.stringify({ 
        error: error instanceof Error ? error.message : '请求失败' 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }
  
  // 其他路由交给 Next.js 处理
  return context.next()
}
