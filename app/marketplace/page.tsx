"use client"

import { useState, useEffect, useCallback } from "react"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/hooks/use-auth"
import { useSettings } from "@/hooks/use-settings"
import JSZip from 'jszip'
import { 
  Search, 
  Download, 
  Upload, 
  Filter, 
  Grid3x3, 
  List,
  Zap,
  TrendingUp,
  Clock,
  Star,
  X,
  ShoppingCart,
  Plus,
  Check,
  Loader2,
  Trash2,
  BadgeCheck,
  Mail,
  MessageCircle
} from "lucide-react"

interface Tool {
  id: number
  user_id: number
  name: string
  description: string
  version: string
  zip_name: string
  zip_path: string
  zip_size: number
  status: string
  download_count: number
  created_at: string
}

export default function MarketplacePage() {
  const { user } = useAuth()
  useSettings()
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [addingToolId, setAddingToolId] = useState<number | null>(null)
  const [addedToolIds, setAddedToolIds] = useState<Set<number>>(new Set())
  const [showNativeToolTip, setShowNativeToolTip] = useState(true)

  // 加载工具列表
  const loadTools = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (category) params.set('category', category)
      
      const res = await fetch(`/api/tools?${params}`)
      const data = await res.json()
      
      if (data.success) {
        setTools(data.tools)
      }
    } catch (error) {
      console.error('加载工具列表失败:', error)
    } finally {
      setLoading(false)
    }
  }, [search, category])

  useEffect(() => {
    loadTools()
  }, [loadTools])

  // 加载已添加的工具 ID
  useEffect(() => {
    const savedCustomTools = localStorage.getItem('custom_tools')
    if (savedCustomTools) {
      try {
        const customTools = JSON.parse(savedCustomTools)
        // 从市场添加的工具会有 marketplaceToolId
        const addedIds = new Set<number>()
        customTools.forEach((tool: any) => {
          if (tool.marketplaceToolId) {
            addedIds.add(tool.marketplaceToolId)
          }
        })
        setAddedToolIds(addedIds)
      } catch (error) {
        console.error('加载已添加工具失败:', error)
      }
    }
  }, [])

  // 处理添加市场工具到本地
  const handleAddTool = async (tool: Tool) => {
    if (addedToolIds.has(tool.id)) {
      alert('此工具已添加到您的工具箱')
      return
    }

    setAddingToolId(tool.id)
    
    try {
      // 1. 从 Supabase Storage 下载 ZIP 文件
      const zipUrl = `/api/tools/${tool.id}/download`
      const res = await fetch(zipUrl)
      
      if (!res.ok) {
        throw new Error('下载工具文件失败')
      }

      const blob = await res.blob()
      const arrayBuffer = await blob.arrayBuffer()
      
      // 2. 使用 JSZip 读取 ZIP 内容
      const zip = await JSZip.loadAsync(arrayBuffer)
      
      // 3. 验证文件结构
      if (!zip.file('tool.json') || !zip.file('tool.tsx')) {
        throw new Error('无效的工具包：缺少 tool.json 或 tool.tsx')
      }
      
      // 4. 读取 tool.json
      const jsonContent = await zip.file('tool.json')!.async('text')
      const toolMeta = JSON.parse(jsonContent)
      
      // 5. 验证必填字段
      const requiredFields = ['name', 'description', 'category']
      const missingFields = requiredFields.filter(field => !toolMeta[field])
      
      if (missingFields.length > 0) {
        throw new Error(`缺少必填字段：${missingFields.join(', ')}`)
      }
      
      // 6. 读取 tool.tsx
      const tsxContent = await zip.file('tool.tsx')!.async('text')
      
      // 7. 创建工具 ID
      const toolId = `custom-${Date.now()}`
      
      // 8. 保存自定义工具到 localStorage
      const customTool = {
        id: toolId,
        name: toolMeta.name,
        description: toolMeta.description,
        category: toolMeta.category || '市场工具',
        icon: toolMeta.icon || 'Zap',
        code: tsxContent,
        isCustom: true,
        marketplaceToolId: tool.id, // 记录来自市场的工具 ID
        marketplaceToolInfo: {
          zipName: tool.zip_name,
          version: tool.version,
          originalUserId: tool.user_id
        }
      }
      
      const savedCustomTools = localStorage.getItem('custom_tools')
      const existingTools = savedCustomTools ? JSON.parse(savedCustomTools) : []
      const updatedTools = [...existingTools, customTool]
      
      localStorage.setItem('custom_tools', JSON.stringify(updatedTools))
      
      // 9. 更新状态
      setAddedToolIds(prev => new Set([...prev, tool.id]))
      
      alert(`工具 "${tool.name}" 已成功添加到您的工具箱！`)
      
    } catch (error) {
      console.error('添加工具失败:', error)
      alert(`添加失败：${error instanceof Error ? error.message : '请稍后重试'}`)
    } finally {
      setAddingToolId(null)
    }
  }

  // 处理从市场移除工具（从 localStorage 删除）
  const handleRemoveTool = (tool: Tool) => {
    try {
      const savedCustomTools = localStorage.getItem('custom_tools')
      if (!savedCustomTools) {
        alert('未找到已保存的工具')
        return
      }

      const customTools = JSON.parse(savedCustomTools)
      
      // 过滤掉这个工具
      const updatedTools = customTools.filter((ct: any) => ct.marketplaceToolId !== tool.id)
      
      // 更新 localStorage
      localStorage.setItem('custom_tools', JSON.stringify(updatedTools))
      
      // 更新状态
      setAddedToolIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(tool.id)
        return newSet
      })
      
      alert(`工具 "${tool.name}" 已从您的工具箱移除`)
      
    } catch (error) {
      console.error('移除工具失败:', error)
      alert(`移除失败：${error instanceof Error ? error.message : '请稍后重试'}`)
    }
  }

  // 处理文件上传
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.zip')) {
      alert('请上传 ZIP 格式的文件')
      return
    }

    if (file.size > 3 * 1024 * 1024) {
      alert('文件大小不能超过 3MB')
      return
    }

    try {
      setUploading(true)
      setUploadProgress(0)

      // 验证用户是否登录
      if (!user) {
        alert('请先登录')
        return
      }

      const formData = new FormData()
      formData.append('zip', file)

      // 使用 fflate 读取 ZIP 文件中的 tool.json
      try {
        const { unzip } = await import('fflate')
        
        const arrayBuffer = await file.arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer)
        
        const unzipped = await new Promise<Record<string, Uint8Array>>((resolve, reject) => {
          unzip(uint8Array, (err, files) => {
            if (err) reject(err)
            else resolve(files)
          })
        })
        
        const toolJsonBytes = unzipped['tool.json']
        if (toolJsonBytes) {
          const toolJsonBlob = new Blob([toolJsonBytes.buffer.slice(toolJsonBytes.byteOffset, toolJsonBytes.byteOffset + toolJsonBytes.byteLength)], { type: 'application/json' })
          formData.append('toolJson', toolJsonBlob)
        }
      } catch (error) {
        console.warn('无法读取 ZIP 中的 tool.json，将使用默认值:', error)
      }

      // 模拟进度
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      // 添加 user_id 参数
      const res = await fetch(`/api/upload-tool?user_id=${user.id}`, {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const result = await res.json()

      if (result.success) {
        alert('工具上传成功！')
        setUploadDialogOpen(false)
        loadTools()
      } else {
        alert(`上传失败：${result.error}`)
      }
    } catch (error) {
      console.error('上传失败:', error)
      alert('上传失败，请稍后重试')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  // 处理下载
  const handleDownload = async (toolId: number, fileName: string) => {
    try {
      const res = await fetch(`/api/tools/${toolId}/download`)
      
      if (!res.ok) {
        const error = await res.json()
        console.error('下载错误详情:', {
          status: res.status,
          error: error.error,
          details: error.details,
          debug: error.debug,
          toolId
        })
        throw new Error(error.error || '下载失败')
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('下载失败:', error)
      alert(`下载失败：${error instanceof Error ? error.message : '请稍后重试'}`)
    }
  }

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  // 格式化时间
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <ShoppingCart className="h-10 w-10 text-primary" />
                工具市场
              </h1>
              <p className="text-muted-foreground">
                发现和分享社区创建的优质工具
              </p>
            </div>
            
            {user && (
              <button
                onClick={() => setUploadDialogOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Upload className="h-5 w-5" />
                发布工具
              </button>
            )}
          </div>
          
          {/* 原生工具申请说明 */}
          {showNativeToolTip && (
            <div className="mt-6 rounded-lg border border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5 p-4 relative">
              <button
                onClick={() => setShowNativeToolTip(false)}
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
                title="关闭提示"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-start gap-3 pr-8">
                <BadgeCheck className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-primary mb-1">
                    成为原生工具
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    如果您开发的工具足够优秀，可以向官方申请成为原生工具！通过审核的工具将会：
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>获得官方认证标识，提升可信度</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>集成到工具箱核心功能，获得更高曝光</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>获得更好的性能优化和技术支持</span>
                    </li>
                  </ul>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm">
                    <a 
                      href="https://discord.gg/MNvQFkmwCE" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:text-primary/80"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Discord 社区
                    </a>
                    <a 
                      href="mailto:support@ruanmgjx.dpdns.org" 
                      className="inline-flex items-center gap-1 text-primary hover:text-primary/80"
                    >
                      <Mail className="h-4 w-4" />
                      support@ruanmgjx.dpdns.org
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 搜索和筛选 */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="搜索工具..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-card/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-card/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">所有类别</option>
              <option value="计算工具">计算工具</option>
              <option value="转换工具">转换工具</option>
              <option value="生成器">生成器</option>
              <option value="编辑器">编辑器</option>
              <option value="其他">其他</option>
            </select>
            
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-card/80 backdrop-blur-sm hover:bg-muted'}`}
              >
                <Grid3x3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-card/80 backdrop-blur-sm hover:bg-muted'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 工具列表 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-muted-foreground">加载中...</p>
          </div>
        ) : tools.length === 0 ? (
          <div className="text-center py-12">
            <Zap className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">暂无工具</h3>
            <p className="text-muted-foreground mb-4">
              {user ? '成为第一个发布工具的人！' : '登录后即可发布你的第一个工具'}
            </p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {tools.map((tool) => (
              <div
                key={tool.id}
                className={`border rounded-lg p-6 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-shadow ${
                  viewMode === 'list' ? 'flex items-center gap-6' : ''
                }`}
              >
                <div className={`flex-1 ${viewMode === 'list' ? '' : 'mb-4'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold">{tool.name}</h3>
                    <span className="text-xs px-2 py-1 bg-muted rounded-full">
                      v{tool.version}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    {tool.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      {tool.download_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDate(tool.created_at)}
                    </span>
                    <span>{formatFileSize(tool.zip_size)}</span>
                  </div>
                </div>
                
                <div className={`flex gap-2 ${viewMode === 'list' ? '' : 'w-full'}`}>
                  {addedToolIds.has(tool.id) ? (
                    <button
                      onClick={() => handleRemoveTool(tool)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      删除
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddTool(tool)}
                      disabled={addingToolId === tool.id}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addingToolId === tool.id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          添加中...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          添加
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 上传对话框 */}
        {uploadDialogOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">发布工具</h2>
                <button
                  onClick={() => setUploadDialogOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mb-4 p-4 bg-muted rounded-lg">
                <p className="text-sm mb-2">📦 工具包要求：</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• 必须是 ZIP 格式</li>
                  <li>• 包含 tool.json（元数据）</li>
                  <li>• 包含 tool.tsx（React 组件）</li>
                  <li>• 最大 3MB</li>
                </ul>
              </div>
              
              {uploading ? (
                <div className="py-8">
                  <div className="w-full bg-muted rounded-full h-2 mb-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    上传中... {uploadProgress}%
                  </p>
                </div>
              ) : (
                <label className="block">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm mb-2">点击选择或拖拽 ZIP 文件到此处</p>
                    <p className="text-xs text-muted-foreground">
                      支持 tool.json + tool.tsx 的工具包
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".zip"
                    onChange={handleUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
