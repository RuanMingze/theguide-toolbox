import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

// 初始化 Supabase 客户端
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

const supabase = createClient(supabaseUrl || '', supabaseServiceKey || '', {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function GET(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase 配置缺失')
      return NextResponse.json(
        { error: '服务器配置错误' },
        { status: 500 }
      )
    }

    // 获取查询参数
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    // 构建查询
    let query = supabase
      .from('tools')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // 按类别筛选
    if (category) {
      query = query.ilike('category', `%${category}%`)
    }

    // 搜索功能
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data: tools, error } = await query

    if (error) {
      console.error('查询工具列表失败:', error)
      return NextResponse.json(
        { error: '获取工具列表失败' },
        { status: 500 }
      )
    }

    // 获取总数量
    const { count } = await supabase
      .from('tools')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')

    return NextResponse.json({
      success: true,
      tools: tools || [],
      total: count || 0,
      hasMore: (tools?.length || 0) >= limit
    })

  } catch (error) {
    console.error('获取工具列表异常:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
