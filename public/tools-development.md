# 自由工具开发指南

## 快速开始

### 1. 工具包结构

创建一个工具需要两个文件，打包为 zip 格式：

```
my-tool.zip
├── tool.json    # 工具元数据
└── tool.tsx     # 工具组件代码
```

### 2. tool.json 格式

```json
{
  "name": "工具名称",
  "description": "工具简介，一句话说明这个工具是做什么的",
  "category": "工具类别",
  "icon": "Calculator",
  "author": "作者名",
  "version": "1.0.0",
  "tags": ["标签 1", "标签 2"]
}
```

**字段说明：**
- `name`: 工具名称（必填，最多 20 字）
- `description`: 工具简介（必填，最多 100 字）
- `category`: 工具类别（必填，如：计算工具、转换工具、生成器等）
- `icon`: 图标名称（选填，使用 Lucide React 图标，默认 Calculator）
- `author`: 作者（选填）
- `version`: 版本号（选填，默认 1.0.0）
- `tags`: 标签数组（选填，用于搜索）

### 3. tool.tsx 基础模板

```typescript
import React, { useState } from 'react'

interface ToolProps {
  onSaveResult?: (data: any) => void
  onExport?: (data: any) => void
}

export default function MyTool({ onSaveResult, onExport }: ToolProps) {
  const [input, setInput] = useState('')
  const [result, setResult] = useState('')

  const handleCalculate = () => {
    // 在这里编写你的工具逻辑
    setResult('计算结果')
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          输入
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="请输入..."
        />
      </div>

      <button
        onClick={handleCalculate}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
      >
        计算
      </button>

      {result && (
        <div>
          <label className="block text-sm font-medium mb-2">
            结果
          </label>
          <div className="p-3 bg-muted rounded-lg">
            {result}
          </div>
        </div>
      )}
    </div>
  )
}
```

### 4. 打包和导入

1. 将 `tool.json` 和 `tool.tsx` 放在同一目录
2. 压缩为 zip 文件
3. 在工具箱页面拖拽 zip 文件到导入区域
4. 系统自动解析并添加工具

---

## 完整示例：Base64 编解码工具

### tool.json

```json
{
  "name": "Base64 编解码",
  "description": "Base64 编码和解码工具，支持文本和文件",
  "category": "转换工具",
  "icon": "Lock",
  "author": "Your Name",
  "version": "1.0.0",
  "tags": ["base64", "编码", "解码", "转换"]
}
```

### tool.tsx

```typescript
import React, { useState } from 'react'

interface ToolProps {
  onSaveResult?: (data: any) => void
  onExport?: (data: any) => void
}

export default function Base64Tool({ onSaveResult, onExport }: ToolProps) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')

  const handleEncode = () => {
    try {
      const result = btoa(encodeURIComponent(input).replace(/%([0-9A-F]{2})/g,
        (match, p1) => String.fromCharCode(parseInt(p1, 16))
      ))
      setOutput(result)
      onSaveResult?.({ type: 'base64_encode', input, output: result })
    } catch (error) {
      setOutput('编码失败：' + (error as Error).message)
    }
  }

  const handleDecode = () => {
    try {
      const result = decodeURIComponent(atob(input).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''))
      setOutput(result)
      onSaveResult?.({ type: 'base64_decode', input, output: result })
    } catch (error) {
      setOutput('解码失败：' + (error as Error).message)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
  }

  return (
    <div className="space-y-4">
      {/* 模式切换 */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('encode')}
          className={`flex-1 px-4 py-2 rounded-lg ${
            mode === 'encode'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted'
          }`}
        >
          编码
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`flex-1 px-4 py-2 rounded-lg ${
            mode === 'decode'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted'
          }`}
        >
          解码
        </button>
      </div>

      {/* 输入框 */}
      <div>
        <label className="block text-sm font-medium mb-2">
          {mode === 'encode' ? '输入文本' : '输入 Base64'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg min-h-[120px]"
          placeholder={mode === 'encode' ? '请输入要编码的文本' : '请输入 Base64 字符串'}
        />
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-2">
        <button
          onClick={mode === 'encode' ? handleEncode : handleDecode}
          className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          {mode === 'encode' ? '编码' : '解码'}
        </button>
        <button
          onClick={handleCopy}
          disabled={!output}
          className="px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/90 disabled:opacity-50"
        >
          复制
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90"
        >
          清空
        </button>
      </div>

      {/* 输出框 */}
      {output && (
        <div>
          <label className="block text-sm font-medium mb-2">
            结果
          </label>
          <textarea
            value={output}
            readOnly
            className="w-full px-3 py-2 border rounded-lg min-h-[120px] bg-muted"
          />
        </div>
      )}
    </div>
  )
}
```

---

## API 参考

### ToolProps 接口

```typescript
interface ToolProps {
  /**
   * 保存结果回调
   * 调用后会将数据保存到工具箱的历史记录
   */
  onSaveResult?: (data: any) => void
  
  /**
   * 导出回调
   * 调用后会触发工具箱的导出功能
   */
  onExport?: (data: any) => void
}
```

### 可用的样式类

工具箱使用 Tailwind CSS，你可以使用所有 Tailwind 类：

```typescript
// 常用样式
className="bg-primary text-primary-foreground"  // 主按钮样式
className="bg-secondary"                        // 次要样式
className="bg-destructive text-destructive-foreground"  // 危险操作
className="bg-muted"                            // 背景色
className="border rounded-lg"                   // 边框和圆角
```

### 主题支持

工具会自动适配工具箱的深色/浅色模式，使用语义化颜色：

- `bg-background` - 背景色
- `bg-foreground` - 前景色
- `text-foreground` - 文字颜色
- `border-border` - 边框颜色
- `bg-primary` - 主色调
- `bg-secondary` - 次色调
- `bg-destructive` - 危险色

---

## 最佳实践

### 1. 代码组织

```typescript
// ✅ 推荐：清晰的代码结构
export default function MyTool({ onSaveResult, onExport }: ToolProps) {
  // 1. State 定义
  const [input, setInput] = useState('')
  
  // 2. 处理函数
  const handleAction = () => {
    // 逻辑
  }
  
  // 3. 辅助函数
  const helperFunction = () => {
    // 辅助逻辑
  }
  
  // 4. 渲染
  return (
    <div>...</div>
  )
}
```

### 2. 错误处理

```typescript
// ✅ 推荐：完整的错误处理
const handleCalculate = () => {
  try {
    const result = someOperation()
    setResult(result)
  } catch (error) {
    setResult('操作失败：' + (error as Error).message)
  }
}

// ❌ 不推荐：忽略错误
const handleCalculate = () => {
  const result = someOperation()  // 可能抛出异常
  setResult(result)
}
```

### 3. 用户反馈

```typescript
// ✅ 推荐：清晰的状态提示
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')

const handleAction = async () => {
  setLoading(true)
  setError('')
  
  try {
    await doSomething()
  } catch (err) {
    setError('操作失败')
  } finally {
    setLoading(false)
  }
}
```

### 4. 性能优化

```typescript
// ✅ 推荐：使用 useMemo 缓存计算结果
const expensiveResult = useMemo(() => {
  return heavyComputation(input)
}, [input])

// ✅ 推荐：使用 useCallback 缓存函数
const handleClick = useCallback(() => {
  // 处理逻辑
}, [dependency])
```

### 5. 可访问性

```typescript
// ✅ 推荐：添加无障碍属性
<button
  onClick={handleClick}
  aria-label="点击执行操作"
  disabled={loading}
>
  {loading ? '加载中...' : '执行'}
</button>

<label htmlFor="input-field">输入</label>
<input id="input-field" type="text" />
```

---

## 常见问题

### Q1: 导入工具失败

**问题：** 拖拽 zip 文件后显示"无效的工具包"

**解决方案：**
1. 检查 zip 文件结构，必须包含 `tool.json` 和 `tool.tsx`
2. 确保 `tool.json` 格式正确，包含必填字段
3. 确保 `tool.tsx` 导出默认函数

### Q2: 工具代码编译错误

**问题：** 导入后显示"代码编译失败"

**解决方案：**
1. 检查 TypeScript 语法是否正确
2. 确保使用了 React 18 的语法
3. 避免使用浏览器不支持的新特性
4. 检查是否使用了未定义的变量或函数

### Q3: 样式冲突

**问题：** 工具样式与工具箱冲突

**解决方案：**
1. 使用 Tailwind CSS 的语义化颜色类
2. 避免使用内联样式
3. 使用 `className` 而不是 `class`
4. 不要修改全局样式

### Q4: 工具无法保存结果

**问题：** 调用 `onSaveResult` 后没有反应

**解决方案：**
1. 确保传递的是可序列化的数据对象
2. 检查浏览器是否支持 localStorage
3. 确保数据大小不超过限制（1MB）

### Q5: 如何调试工具

**问题：** 工具运行不符合预期

**解决方案：**
1. 打开浏览器开发者工具
2. 查看 Console 中的错误信息
3. 在代码中添加 `console.log` 调试
4. 使用 React Developer Tools 检查组件状态

---