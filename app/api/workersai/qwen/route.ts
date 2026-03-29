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

    // 检查 Workers AI 绑定是否存在
    const workersAI = (globalThis as any).WORKERS_AI_ENV
    if (!workersAI) {
      console.error('Workers AI 绑定未配置')
      return NextResponse.json(
        { error: 'Workers AI 服务未配置' },
        { status: 500 }
      )
    }

    // 调用 Workers AI 的 Qwen 模型
    const response = await workersAI.run('@cf/qwen/qwen2.5-7b-instruct', {
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
