import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

// Resend API 配置
const RESEND_API_KEY = process.env.RESEND_API_KEY
const RESEND_API_URL = 'https://api.resend.com/emails'

// 收件人邮箱
const RECEIVING_EMAIL = process.env.RESEND_RECEIVING_EMAIL || 'support@ruanmgjx.dpdns.org'
// 默认发件人（未登录用户）
const DEFAULT_FROM_EMAIL = 'no-reply@ruanmgjx.dpdns.org'

export async function POST(request: NextRequest) {
  const requestId = `feedback-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  
  try {
    console.log(`[${requestId}] 开始处理反馈邮件`)

    // 解析请求体
    const body = await request.json()
    const { subject, message, email } = body

    // 验证必填字段
    if (!subject || !message) {
      return NextResponse.json(
        { success: false, error: '主题和内容不能为空' },
        { status: 400 }
      )
    }

    // 确定发件人邮箱
    let fromEmail = DEFAULT_FROM_EMAIL
    let userEmail = null

    // 尝试从请求头获取用户信息
    const oauthUserHeader = request.headers.get('x-oauth-user')
    if (oauthUserHeader) {
      try {
        const oauthUser = JSON.parse(decodeURIComponent(oauthUserHeader))
        userEmail = oauthUser.email
        
        // 如果用户提供了自定义邮箱，优先使用
        if (email && email.trim()) {
          fromEmail = email.trim()
        } else if (oauthUser.email) {
          fromEmail = oauthUser.email
        }
      } catch (e) {
        console.warn(`[${requestId}] 解析用户信息失败:`, e)
      }
    } else if (email && email.trim()) {
      // 未登录但提供了自定义邮箱
      fromEmail = email.trim()
    }

    console.log(`[${requestId}] 发送邮件：from=${fromEmail}, to=${RECEIVING_EMAIL}`)

    // 使用 fetch 直接调用 Resend API
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `TheGuide Feedback <${fromEmail}>`,
        to: [RECEIVING_EMAIL],
        subject: `[反馈] ${subject}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #0070f3; padding-bottom: 10px;">新的用户反馈</h2>
            
            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #666;">
                <strong>发件人：</strong> ${fromEmail}
              </p>
              ${userEmail ? `<p style="margin: 10px 0 0 0; color: #666;"><strong>用户邮箱：</strong> ${userEmail}</p>` : ''}
              <p style="margin: 10px 0 0 0; color: #666;">
                <strong>时间：</strong> ${new Date().toLocaleString('zh-CN')}
              </p>
            </div>

            <div style="background: #fff; border: 1px solid #eaeaea; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">反馈主题</h3>
              <p style="color: #555; font-size: 16px;">${escapeHtml(subject)}</p>
              
              <h3 style="color: #333; margin-top: 20px;">详细内容</h3>
              <div style="color: #555; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</div>
            </div>

            <div style="text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea;">
              <p>此邮件由 TheGuide 工具箱反馈系统自动发送</p>
              <p>请勿直接回复此邮件</p>
            </div>
          </div>
        `,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error(`[${requestId}] 发送邮件失败:`, result)
      return NextResponse.json(
        { success: false, error: `邮件发送失败：${result.message || '未知错误'}` },
        { status: response.status }
      )
    }

    console.log(`[${requestId}] 邮件发送成功:`, result)

    return NextResponse.json({
      success: true,
      message: '反馈发送成功',
      data: {
        id: result.id,
        from: fromEmail,
      }
    })

  } catch (error) {
    console.error(`[${requestId}] 处理反馈失败:`, error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '发送失败，请稍后重试' 
      },
      { status: 500 }
    )
  }
}

// HTML 转义函数，防止 XSS 攻击
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}
