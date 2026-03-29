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

    // 从环境变量获取配置
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
    const apiToken = process.env.CLOUDFLARE_API_TOKEN

    if (!accountId || !apiToken) {
      console.error('Missing Cloudflare credentials')
      return NextResponse.json(
        { error: 'Cloudflare API 配置缺失，请检查环境变量' },
        { status: 500 }
      )
    }

    // 调用 Cloudflare AI Gateway (OpenAI 兼容接口)
    const gatewayUrl = `https://gateway.ai.cloudflare.com/v1/${accountId}/default/compat/chat/completions`

    const response = await fetch(gatewayUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'cf-aig-authorization': `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        model: 'workers-ai/@cf/qwen/qwen2.5-7b-instruct',
        messages,
        temperature,
        max_tokens,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('AI Gateway error:', response.status, errorText)
      return NextResponse.json(
        { error: `AI 服务请求失败：${response.status} ${errorText}` },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        choices: data.choices,
        usage: data.usage,
      },
    })
  } catch (error) {
    console.error('WorkersAI Qwen API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '请求失败' },
      { status: 500 }
    )
  }
}
