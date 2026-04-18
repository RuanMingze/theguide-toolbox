import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import '@/lib/setimmediate-polyfill'

export const runtime = 'edge'

// 最大文件大小：3MB
const MAX_FILE_SIZE = 3 * 1024 * 1024

// 初始化 Supabase 客户端（使用 Service Key 以绕过 RLS）
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials')
}

const supabase = createClient(supabaseUrl || '', supabaseServiceKey || '', {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

/**
 * 从请求中提取 user_id
 * 优先级：user_id 参数 > oauth_user 对象
 */
function extractUserId(request: NextRequest): number | null {
  try {
    // 1. 优先从请求参数中取 user_id
    const urlParamUserId = request.nextUrl.searchParams.get('user_id')
    if (urlParamUserId) {
      const parsed = parseInt(urlParamUserId, 10)
      if (!isNaN(parsed)) {
        console.log('从 URL 参数获取 user_id:', parsed)
        return parsed
      }
    }

    // 2. 从 oauth_user 对象中获取
    const oauthUserHeader = request.headers.get('x-oauth-user')
    if (oauthUserHeader) {
      const oauthUser = JSON.parse(decodeURIComponent(oauthUserHeader))
      
      // Ruanm OAuth 取 user-id
      if (oauthUser['user-id']) {
        const ruanmUserId = parseInt(oauthUser['user-id'], 10)
        if (!isNaN(ruanmUserId)) {
          console.log('从 Ruanm OAuth 获取 user_id:', ruanmUserId)
          return ruanmUserId
        }
      }
      
      // GitHub / Discord OAuth 取 id
      if (oauthUser.id) {
        const oauthUserId = parseInt(oauthUser.id, 10)
        if (!isNaN(oauthUserId)) {
          console.log('从 GitHub/Discord OAuth 获取 user_id:', oauthUserId)
          return oauthUserId
        }
      }
    }

    console.warn('无法提取 user_id')
    return null
  } catch (error) {
    console.error('提取 user_id 失败:', error)
    return null
  }
}

/**
 * 验证 ZIP 文件内容结构
 * 使用简单的字节检查来验证 ZIP 文件
 */
async function validateZipContent(arrayBuffer: ArrayBuffer): Promise<{ valid: boolean; error?: string }> {
  // ZIP 文件魔数检查 (PK)
  const bytes = new Uint8Array(arrayBuffer)
  if (bytes.length < 4 || bytes[0] !== 0x50 || bytes[1] !== 0x4b) {
    return { valid: false, error: '不是有效的 ZIP 文件格式' }
  }

  // 简化验证：只检查文件大小
  if (bytes.length > MAX_FILE_SIZE) {
    return { valid: false, error: `文件大小不能超过 ${MAX_FILE_SIZE / 1024 / 1024}MB` }
  }

  // 在 Edge Runtime 中无法使用 JSZip，跳过详细验证
  // 工具的实际验证在客户端沙箱中进行
  return { valid: true }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const requestId = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  
  console.log(`[${requestId}] 开始处理工具上传请求`)

  try {
    // 验证 Supabase 配置
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error(`[${requestId}] Supabase 配置缺失`)
      return NextResponse.json(
        { success: false, error: '服务器配置错误：Supabase 凭证未配置' },
        { status: 500 }
      )
    }

    // 提取 user_id
    const userId = extractUserId(request)
    if (!userId) {
      console.warn(`[${requestId}] 未认证的用户`)
      return NextResponse.json(
        { success: false, error: '未认证：无法获取用户 ID，请确保已登录' },
        { status: 401 }
      )
    }

    // 解析 multipart/form-data
    const formData = await request.formData()
    
    // 获取上传的文件
    const zipFile = formData.get('zip') as File
    if (!zipFile) {
      return NextResponse.json(
        { success: false, error: '缺少 ZIP 文件' },
        { status: 400 }
      )
    }

    // 验证文件类型
    if (!zipFile.name.endsWith('.zip')) {
      return NextResponse.json(
        { success: false, error: '只能上传 ZIP 格式的文件' },
        { status: 400 }
      )
    }

    // 验证文件大小
    if (zipFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: `文件大小不能超过 ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    if (zipFile.size === 0) {
      return NextResponse.json(
        { success: false, error: 'ZIP 文件不能为空' },
        { status: 400 }
      )
    }

    console.log(`[${requestId}] 文件验证通过：${zipFile.name}, 大小：${zipFile.size} 字节`)

    // 读取 ZIP 文件内容并验证
    const arrayBuffer = await zipFile.arrayBuffer()
    const validation = await validateZipContent(arrayBuffer)
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }

    console.log(`[${requestId}] ZIP 内容验证通过`)

    // 从 FormData 中读取 tool.json（前端已经添加）
    const toolJsonBlob = formData.get('toolJson') as Blob
    let toolMeta = { name: zipFile.name, description: '', version: '1.0.0' }
    
    if (toolJsonBlob) {
      const toolJsonContent = await toolJsonBlob.text()
      try {
        toolMeta = JSON.parse(toolJsonContent)
      } catch (error) {
        console.warn(`[${requestId}] tool.json 解析失败，使用默认值`)
      }
    }

    // 生成存储路径：tool-files/{user_id}/{文件名}.zip
    const timestamp = Date.now()
    const safeFileName = zipFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const storagePath = `tool-files/${userId}/${timestamp}-${safeFileName}`

    console.log(`[${requestId}] 准备上传到 Supabase Storage: ${storagePath}`)

    // 上传到 Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('tool-files')
      .upload(storagePath, zipFile, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'application/zip'
      })

    if (uploadError) {
      console.error(`[${requestId}] 上传到 Storage 失败:`, uploadError)
      return NextResponse.json(
        { success: false, error: `文件上传失败：${uploadError.message}` },
        { status: 500 }
      )
    }

    console.log(`[${requestId}] 文件上传成功：${uploadData.path}`)

    // 插入数据库记录（使用 uploadData.path 作为存储路径）
    const { data: toolData, error: dbError } = await supabase
      .from('tools')
      .insert({
        user_id: userId,
        name: toolMeta.name,
        description: toolMeta.description,
        version: toolMeta.version || '1.0.0',
        zip_name: zipFile.name,
        zip_path: uploadData.path, // 使用实际存储路径
        zip_size: zipFile.size,
        status: 'published',
        download_count: 0
      })
      .select('id')
      .single()

    if (dbError) {
      console.error(`[${requestId}] 数据库插入失败:`, dbError)
      
      // 回滚：删除已上传的文件
      await supabase.storage
        .from('tool-files')
        .remove([storagePath])
      
      return NextResponse.json(
        { success: false, error: `数据库操作失败：${dbError.message}` },
        { status: 500 }
      )
    }

    const toolId = toolData.id
    const duration = Date.now() - startTime
    
    console.log(`[${requestId}] 工具上传成功：toolId=${toolId}, 耗时=${duration}ms`)

    return NextResponse.json({
      success: true,
      toolId,
      message: '工具上传成功',
      data: {
        name: toolMeta.name,
        version: toolMeta.version || '1.0.0',
        size: zipFile.size
      }
    })

  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`[${requestId}] 上传失败 (耗时=${duration}ms):`, error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '上传失败，请稍后重试' 
      },
      { status: 500 }
    )
  }
}
