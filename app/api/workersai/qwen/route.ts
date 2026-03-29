import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const { messages, temperature = 0.7, max_tokens = 1024 } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'messages 参数必须是数组' },
        { status: 400 }
      )
    }

    // 获取 Workers AI 绑定（从 Cloudflare Pages Functions 的 env 中获取）
    const envKeys = Object.keys((request as any).env || {})
    const hasGlobalAI = !!(globalThis as any).AI
    const ai = (request as any).env?.AI || (globalThis as any).AI
    
    if (!ai) {
      // 返回调试信息帮助诊断
      return NextResponse.json({
        error: 'Workers AI 服务未配置',
        debug: {
          envKeys,
          hasGlobalAI,
          envAI: !!(request as any).env?.AI,
          message: '请在 Cloudflare Pages 设置中绑定 Workers AI，变量名称为 AI'
        }
      }, { status: 500 })
    }

    // 调用 Workers AI 的 Qwen 模型
    const response = await ai.run('@cf/qwen/qwen2.5-7b-instruct', {
      messages,
      temperature,
      max_tokens,
      stream: false,
    })

    return NextResponse.json({
      success: true,
      data: response,
    })
  } catch (error) {
    console.error('WorkersAI Qwen API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '请求失败' },
      { status: 500 }
    )
  }
}
