'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
}

// 系统提示词 - 定义 AI 助手的角色和工具箱信息
const SYSTEM_PROMPT = `你叫"TheGuide 助手"，是 TheGuide 工具箱的智能助手。你的任务是帮助用户了解和使用工具箱的各项功能。

## 工具箱功能介绍：

### 1. 在线工具集合
- **JSON 格式化**：格式化、验证 JSON 数据
- **Base64 编解码**：Base64 编码和解码工具
- **URL 编解码**：URL 编码和解码工具
- **时间戳转换**：Unix 时间戳与日期时间互转
- **密码生成器**：生成高强度随机密码
- **Hash 计算**：计算 MD5、SHA1、SHA256 等哈希值
- **UUID 生成器**：生成 UUID/GUID
- **颜色选择器**：RGB、HEX、HSL 颜色转换
- **文本对比**：对比两个文本的差异
- **Markdown 预览**：实时预览 Markdown 渲染效果

### 2. 文件处理工具
- **PDF 工具**：PDF 查看、合并、拆分
- **图片处理**：图片格式转换、压缩、裁剪
- **文档转换**：Word、Excel、PPT 格式转换
- **文件压缩**：ZIP 压缩和解压

### 3. 开发工具
- **代码格式化**：支持 JavaScript、TypeScript、Python 等
- **正则表达式测试**：在线测试和验证正则
- **API 测试工具**：发送 HTTP 请求测试 API
- **Cron 表达式生成器**：生成和解析 Cron 表达式

### 4. 实用工具
- **天气查询**：实时天气和预报
- **汇率转换**：实时汇率计算
- **单位换算**：长度、重量、温度等单位转换
- **收藏夹**：收藏常用工具和配置

## 你的行为准则：
1. 友好、专业、耐心地回答用户问题
2. 主动介绍工具箱的功能，帮助用户快速找到需要的工具
3. 提供详细的使用指导和操作步骤
4. 如果用户遇到问题，帮助排查并提供解决方案
5. 不要编造工具箱没有的功能，如果不确定就告诉用户
6. 使用简洁清晰的语言，避免过于技术化的术语
7. 可以适当使用表情符号让对话更生动

## 对话风格：
- 热情友好，像朋友一样交流
- 专业但不生硬，通俗易懂
- 主动询问用户是否需要进一步帮助
- 对于复杂操作，分步骤说明

现在，请开始和用户对话，帮助他们使用工具箱！`

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // 准备发送给 API 的消息（包含系统提示词）
      const apiMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage.content },
      ]

      const response = await fetch('/api/workersai/qwen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 2048,
        }),
      })

      if (!response.ok) {
        throw new Error('请求失败')
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.data.choices[0]?.message?.content || '抱歉，我遇到了一些问题',
        timestamp: Date.now(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('AI 对话错误:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: '抱歉，我遇到了一些问题，请稍后再试。',
        timestamp: Date.now(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* 聊天头部 */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">TheGuide 助手</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">您的智能工具箱助手</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={clearChat}
          className="gap-2"
        >
          <Trash2 className="w-4 h-4" />
          清空对话
        </Button>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mb-4">
              <Bot className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              你好！我是 TheGuide 助手 👋
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              我可以帮你了解和使用工具箱的各种功能，比如 JSON 格式化、文件处理、开发工具等。有什么我可以帮你的吗？
            </p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
              <Button
                variant="outline"
                onClick={() => setInput('你能介绍一下这个工具箱吗？')}
                className="text-left h-auto py-3 px-4"
              >
                📦 介绍一下这个工具箱
              </Button>
              <Button
                variant="outline"
                onClick={() => setInput('如何使用 JSON 格式化工具？')}
                className="text-left h-auto py-3 px-4"
              >
                🔧 如何使用 JSON 格式化工具？
              </Button>
              <Button
                variant="outline"
                onClick={() => setInput('有什么文件处理工具？')}
                className="text-left h-auto py-3 px-4"
              >
                📄 有什么文件处理工具？
              </Button>
              <Button
                variant="outline"
                onClick={() => setInput('推荐一些实用的开发工具')}
                className="text-left h-auto py-3 px-4"
              >
                💻 推荐一些实用的开发工具
              </Button>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-green-400 to-blue-500'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words text-sm">
                    {message.content}
                  </p>
                  <p
                    className={`text-xs mt-2 ${
                      message.role === 'user'
                        ? 'text-blue-100'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-md">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      正在思考中...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* 输入区域 */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t">
        <div className="max-w-4xl mx-auto flex gap-3">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入你的问题，按 Enter 发送..."
            className="flex-1 resize-none border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            rows={1}
            style={{ minHeight: '48px', maxHeight: '200px' }}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="px-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
          AI 助手可能会提供不准确的信息，请谨慎参考
        </p>
      </div>
    </div>
  )
}
