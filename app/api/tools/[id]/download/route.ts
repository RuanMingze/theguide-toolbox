import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

const supabaseUrl = process.env.SUPABASE_URL || 'https://example.com'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '123456789'

const supabase = createClient(supabaseUrl || 'https://example.com', supabaseServiceKey || '123456789', {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: '服务器配置错误' },
        { status: 500 }
      )
    }

    // 解构 params（Promise）
    const { id } = await params
    const toolId = parseInt(id, 10)
    
    if (isNaN(toolId)) {
      return NextResponse.json(
        { error: '无效的工具 ID' },
        { status: 400 }
      )
    }

    // 获取工具信息
    const { data: tool, error: toolError } = await supabase
      .from('tools')
      .select('zip_path, zip_name, download_count')
      .eq('id', toolId)
      .single()

    if (toolError || !tool) {
      console.error('工具不存在:', toolError)
      return NextResponse.json(
        { error: '工具不存在' },
        { status: 404 }
      )
    }

    // 从 Storage 获取文件
    // 数据库中存储的路径格式：'tool-files/2/xxx.zip'
    // 直接使用这个路径（相对于 bucket）
    const filePath = tool.zip_path
    
    console.log(`开始下载文件：${filePath}, 工具 ID: ${toolId}`)
    
    // 生成公共 URL
    const { data: urlData } = supabase.storage
      .from('tool-files')
      .getPublicUrl(filePath)
    
    console.log('=== Supabase Storage 调试信息 ===')
    console.log(`Bucket 名称：tool-files`)
    console.log(`数据库存储路径：${tool.zip_path}`)
    console.log(`Supabase 生成的公共 URL: ${urlData?.publicUrl}`)
    console.log('=================================')
    
    // 直接使用 fetch 获取文件，而不是用 download() 方法
    const response = await fetch(urlData.publicUrl)
    
    if (!response.ok) {
      console.error('下载文件失败:', {
        status: response.status,
        statusText: response.statusText,
        url: urlData.publicUrl,
        filePath,
        toolId,
        zipPath: tool.zip_path
      })
      return NextResponse.json(
        { 
          error: `下载失败：${response.status} ${response.statusText}`, 
          debug: {
            bucket: 'tool-files',
            databasePath: tool.zip_path,
            correctedPath: filePath,
            publicUrl: urlData?.publicUrl,
            responseStatus: response.status,
            responseStatusText: response.statusText
          }
        },
        { status: 500 }
      )
    }
    
    const arrayBuffer = await response.arrayBuffer()
    const blob = new Blob([arrayBuffer], { type: 'application/zip' })
    
    console.log(`文件下载成功，大小：${blob.size} 字节`)

    // 增加下载次数
    await supabase
      .from('tools')
      .update({ download_count: (tool.download_count || 0) + 1 })
      .eq('id', toolId)

    // 返回文件
    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${tool.zip_name}"`,
        'Cache-Control': 'no-cache'
      }
    })

  } catch (error) {
    console.error('下载工具异常:', error)
    return NextResponse.json(
      { error: '下载失败' },
      { status: 500 }
    )
  }
}
