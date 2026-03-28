"use client"

import { useState, useCallback } from "react"
import { Navbar } from "@/components/navbar"
import { useFavorites } from "@/hooks/use-favorites"
import { useSettings } from "@/hooks/use-settings"
import { useTranslation } from "@/hooks/use-translation"
import { 
  Search, 
  FileText, 
  Image, 
  Type, 
  Hash, 
  Lock, 
  QrCode, 
  Palette, 
  Calculator, 
  Clock, 
  Calendar,
  Ruler,
  Percent,
  Binary,
  FileJson,
  Code,
  Link,
  Shuffle,
  Download,
  Scissors,
  RotateCw,
  Zap,
  FileImage,
  Eraser,
  Crop,
  FlipHorizontal,
  Contrast,
  Filter,
  X,
  Copy,
  Check,
  Upload,
  ArrowLeftRight,
  Heart
} from "lucide-react"

interface Tool {
  id: string
  name: string
  description: string
  category: string
  icon: React.ElementType
}

const tools: Tool[] = [
  // 文本工具
  { id: "text-counter", name: "字数统计", description: "统计文本字数、字符数、行数", category: "文本工具", icon: Type },
  { id: "case-converter", name: "大小写转换", description: "转换文本大小写格式", category: "文本工具", icon: Type },
  { id: "text-diff", name: "文本对比", description: "比较两段文本的差异", category: "文本工具", icon: FileText },
  { id: "text-replace", name: "批量替换", description: "批量查找替换文本内容", category: "文本工具", icon: Shuffle },
  { id: "text-reverse", name: "文本反转", description: "反转文本字符顺序", category: "文本工具", icon: RotateCw },
  { id: "text-dedupe", name: "去除重复行", description: "删除重复的文本行", category: "文本工具", icon: Scissors },
  { id: "text-sort", name: "文本排序", description: "按字母或数字排序文本行", category: "文本工具", icon: FileText },
  
  // 编码转换
  { id: "base64", name: "Base64编解码", description: "文本与Base64互转", category: "编码转换", icon: Binary },
  { id: "url-encode", name: "URL编解码", description: "URL编码与解码", category: "编码转换", icon: Link },
  { id: "unicode", name: "Unicode转换", description: "Unicode编码转换", category: "编码转换", icon: Hash },
  { id: "html-entity", name: "HTML实体转换", description: "HTML特殊字符转义", category: "编码转换", icon: Code },
  { id: "json-format", name: "JSON格式化", description: "格式化和校验JSON", category: "编码转换", icon: FileJson },
  { id: "hex-converter", name: "进制转换", description: "二进制、八进制、十进制、十六进制互转", category: "编码转换", icon: Binary },
  { id: "ascii-converter", name: "ASCII转换", description: "字符与ASCII码互转", category: "编码转换", icon: Hash },
  
  // 图片工具
  { id: "image-compress", name: "图片压缩", description: "压缩图片文件大小", category: "图片工具", icon: FileImage },
  { id: "image-resize", name: "图片调整", description: "调整图片尺寸大小", category: "图片工具", icon: Crop },
  { id: "image-rotate", name: "图片旋转", description: "旋转和翻转图片", category: "图片工具", icon: FlipHorizontal },
  { id: "image-filter", name: "图片滤镜", description: "添加滤镜效果", category: "图片工具", icon: Filter },
  { id: "image-grayscale", name: "黑白转换", description: "彩色图片转黑白", category: "图片工具", icon: Contrast },
  { id: "remove-bg", name: "背景透明", description: "移除图片背景使之透明", category: "图片工具", icon: Eraser },
  { id: "image-to-base64", name: "图片转 Base64", description: "图片转换为 Base64 编码", category: "图片工具", icon: Image },
  
  // 格式转换
  { id: "file-converter", name: "文件格式转换", description: "转换文件格式", category: "格式转换", icon: ArrowLeftRight },
  
  // 生成器
  { id: "password-gen", name: "密码生成器", description: "生成安全随机密码", category: "生成器", icon: Lock },
  { id: "uuid-gen", name: "UUID生成器", description: "生成唯一识别码UUID", category: "生成器", icon: Hash },
  { id: "qrcode-gen", name: "二维码生成", description: "生成自定义二维码", category: "生成器", icon: QrCode },
  { id: "lorem-gen", name: "Lorem生成器", description: "生成占位文本", category: "生成器", icon: FileText },
  { id: "color-gen", name: "随机颜色", description: "生成随机颜色代码", category: "生成器", icon: Palette },
  
  // 计算工具
  { id: "calculator", name: "科学计算器", description: "支持高级数学运算", category: "计算工具", icon: Calculator },
  { id: "unit-converter", name: "单位换算", description: "长度、重量、温度等单位转换", category: "计算工具", icon: Ruler },
  { id: "percentage", name: "百分比计算", description: "计算百分比和比例", category: "计算工具", icon: Percent },
  { id: "date-calc", name: "日期计算", description: "计算日期差和日期加减", category: "计算工具", icon: Calendar },
  { id: "timestamp", name: "时间戳转换", description: "Unix时间戳与日期互转", category: "计算工具", icon: Clock },
  { id: "bmi-calc", name: "BMI计算器", description: "计算身体质量指数", category: "计算工具", icon: Calculator },
  
  // 颜色工具
  { id: "color-picker", name: "取色器", description: "选择和提取颜色", category: "颜色工具", icon: Palette },
  { id: "color-converter", name: "颜色转换", description: "HEX、RGB、HSL互转", category: "颜色工具", icon: ArrowLeftRight },
  { id: "gradient-gen", name: "渐变生成器", description: "创建CSS渐变效果", category: "颜色工具", icon: Palette },
]

const categories = Array.from(new Set(tools.map(tool => tool.category)))

// 分类翻译
const categoryTranslations: Record<string, string> = {
  "文本工具": "Text Tools",
  "编码转换": "Encoding & Conversion",
  "图片工具": "Image Tools",
  "格式转换": "File Converter",
  "生成器": "Generators",
  "计算工具": "Calculators",
  "颜色工具": "Color Tools",
}

// 工具名称翻译
const toolNameTranslations: Record<string, string> = {
  "字数统计": "Character Counter",
  "大小写转换": "Case Converter",
  "文本对比": "Text Diff",
  "批量替换": "Batch Replace",
  "文本反转": "Text Reverser",
  "去除重复行": "Remove Duplicate Lines",
  "文本排序": "Text Sorter",
  "Base64 编解码": "Base64 Encoder/Decoder",
  "URL 编解码": "URL Encoder/Decoder",
  "Unicode 转换": "Unicode Converter",
  "HTML 实体转换": "HTML Entity Converter",
  "JSON 格式化": "JSON Formatter",
  "进制转换": "Base Converter",
  "ASCII 转换": "ASCII Converter",
  "图片压缩": "Image Compressor",
  "图片调整": "Image Resizer",
  "图片旋转": "Image Rotator",
  "图片滤镜": "Image Filters",
  "黑白转换": "Grayscale Converter",
  "背景透明": "Background Remover",
  "图片转 Base64": "Image to Base64",
  "文件格式转换": "File Converter",
  "密码生成器": "Password Generator",
  "UUID 生成器": "UUID Generator",
  "二维码生成": "QR Code Generator",
  "Lorem 生成器": "Lorem Ipsum Generator",
  "随机颜色": "Random Color",
  "科学计算器": "Scientific Calculator",
  "单位换算": "Unit Converter",
  "百分比计算": "Percentage Calculator",
  "日期计算": "Date Calculator",
  "时间戳转换": "Timestamp Converter",
  "BMI 计算器": "BMI Calculator",
  "取色器": "Color Picker",
  "颜色转换": "Color Converter",
  "渐变生成器": "Gradient Generator",
}

// 工具描述翻译
const toolDescriptionTranslations: Record<string, string> = {
  "统计文本字数、字符数、行数": "Count characters, words, and lines in text",
  "转换文本大小写格式": "Convert text case format",
  "比较两段文本的差异": "Compare differences between two texts",
  "批量查找替换文本内容": "Batch find and replace text content",
  "反转文本字符顺序": "Reverse text character order",
  "删除重复的文本行": "Remove duplicate text lines",
  "按字母或数字排序文本行": "Sort text lines alphabetically or numerically",
  "文本与 Base64 互转": "Convert text to/from Base64",
  "URL 编码与解码": "URL encoding and decoding",
  "Unicode 编码转换": "Unicode encoding conversion",
  "HTML 特殊字符转义": "HTML special character escaping",
  "格式化和校验 JSON": "Format and validate JSON",
  "二进制、八进制、十进制、十六进制互转": "Convert between binary, octal, decimal, hexadecimal",
  "字符与 ASCII 码互转": "Convert characters to/from ASCII codes",
  "压缩图片文件大小": "Compress image file size",
  "调整图片尺寸大小": "Resize image dimensions",
  "旋转和翻转图片": "Rotate and flip images",
  "添加滤镜效果": "Add filter effects",
  "彩色图片转黑白": "Convert color images to grayscale",
  "移除图片背景使之透明": "Remove image background to make it transparent",
  "图片转换为 Base64 编码": "Convert image to Base64 encoding",
  "转换文件格式": "Convert file formats",
  "生成安全随机密码": "Generate secure random passwords",
  "生成唯一识别码 UUID": "Generate unique identifier UUID",
  "生成自定义二维码": "Generate custom QR codes",
  "生成占位文本": "Generate placeholder text",
  "生成随机颜色代码": "Generate random color codes",
  "支持高级数学运算": "Support advanced mathematical operations",
  "长度、重量、温度等单位转换": "Convert units like length, weight, temperature",
  "计算百分比和比例": "Calculate percentage and ratios",
  "计算日期差和日期加减": "Calculate date difference and date arithmetic",
  "Unix 时间戳与日期互转": "Convert Unix timestamp to/from date",
  "计算身体质量指数": "Calculate Body Mass Index",
  "选择和提取颜色": "Select and extract colors",
  "HEX、RGB、HSL 互转": "Convert between HEX, RGB, HSL",
  "创建 CSS 渐变效果": "Create CSS gradient effects",
}

// Tool Modal Component
function ToolModal({ tool, onClose }: { tool: Tool; onClose: () => void }) {
  const { lang } = useTranslation()
  
  const displayName = lang === 'en' && toolNameTranslations[tool.name] 
    ? toolNameTranslations[tool.name] 
    : tool.name
  const displayDescription = lang === 'en' && toolDescriptionTranslations[tool.description]
    ? toolDescriptionTranslations[tool.description]
    : tool.description
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-auto rounded-2xl border border-border bg-card shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <tool.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{displayName}</h2>
              <p className="text-sm text-muted-foreground">{displayDescription}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          <ToolContent toolId={tool.id} />
        </div>
      </div>
    </div>
  )
}

// Individual Tool Implementations
function ToolContent({ toolId }: { toolId: string }) {
  switch (toolId) {
    case "text-counter":
      return <TextCounterTool />
    case "case-converter":
      return <CaseConverterTool />
    case "base64":
      return <Base64Tool />
    case "url-encode":
      return <UrlEncodeTool />
    case "json-format":
      return <JsonFormatTool />
    case "password-gen":
      return <PasswordGeneratorTool />
    case "uuid-gen":
      return <UuidGeneratorTool />
    case "qrcode-gen":
      return <QrCodeGeneratorTool />
    case "color-picker":
      return <ColorPickerTool />
    case "color-converter":
      return <ColorConverterTool />
    case "timestamp":
      return <TimestampTool />
    case "unit-converter":
      return <UnitConverterTool />
    case "percentage":
      return <PercentageTool />
    case "calculator":
      return <CalculatorTool />
    case "hex-converter":
      return <HexConverterTool />
    case "text-replace":
      return <TextReplaceTool />
    case "text-reverse":
      return <TextReverseTool />
    case "text-dedupe":
      return <TextDedupeTool />
    case "text-sort":
      return <TextSortTool />
    case "unicode":
      return <UnicodeTool />
    case "html-entity":
      return <HtmlEntityTool />
    case "ascii-converter":
      return <AsciiConverterTool />
    case "lorem-gen":
      return <LoremGeneratorTool />
    case "color-gen":
      return <ColorGeneratorTool />
    case "gradient-gen":
      return <GradientGeneratorTool />
    case "date-calc":
      return <DateCalcTool />
    case "bmi-calc":
      return <BmiCalcTool />
    case "text-diff":
      return <TextDiffTool />
    case "image-compress":
    case "image-resize":
    case "image-rotate":
    case "image-filter":
    case "image-grayscale":
    case "remove-bg":
    case "image-to-base64":
      return <ImageTool toolId={toolId} />
    case "file-converter":
      return <FileConverterTool />
    default:
      return <PlaceholderTool />
  }
}

// Utility Components
function CopyButton({ text }: { text: string }) {
  const { lang } = useTranslation()
  const [copied, setCopied] = useState(false)
  
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? (lang === 'en' ? 'Copied' : '已复制') : (lang === 'en' ? 'Copy' : '复制')}
    </button>
  )
}

// Text Counter Tool
function TextCounterTool() {
  const { lang } = useTranslation()
  const [text, setText] = useState("")
  
  const stats = {
    chars: text.length,
    charsNoSpace: text.replace(/\s/g, "").length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    lines: text.trim() ? text.split("\n").length : 0,
    paragraphs: text.trim() ? text.split(/\n\n+/).filter(p => p.trim()).length : 0,
  }
  
  const statLabels = lang === 'en' ? [
    { label: "Characters", value: stats.chars },
    { label: "No Spaces", value: stats.charsNoSpace },
    { label: "Words", value: stats.words },
    { label: "Lines", value: stats.lines },
    { label: "Paragraphs", value: stats.paragraphs },
  ] : [
    { label: "字符数", value: stats.chars },
    { label: "不含空格", value: stats.charsNoSpace },
    { label: "单词数", value: stats.words },
    { label: "行数", value: stats.lines },
    { label: "段落数", value: stats.paragraphs },
  ]
  
  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={lang === 'en' ? 'Enter or paste text here...' : '在此输入或粘贴文本...'}
        className="h-40 w-full rounded-lg border border-border bg-background p-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {statLabels.map((stat) => (
          <div key={stat.label} className="rounded-lg bg-secondary p-3 text-center">
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Case Converter Tool
function CaseConverterTool() {
  const { lang } = useTranslation()
  const [text, setText] = useState("")
  
  const conversions = lang === 'en' ? [
    { label: "UPPERCASE", value: text.toUpperCase() },
    { label: "lowercase", value: text.toLowerCase() },
    { label: "Title Case", value: text.replace(/\b\w/g, c => c.toUpperCase()) },
    { label: "Sentence case", value: text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() },
  ] : [
    { label: "大写", value: text.toUpperCase() },
    { label: "小写", value: text.toLowerCase() },
    { label: "首字母大写", value: text.replace(/\b\w/g, c => c.toUpperCase()) },
    { label: "句首大写", value: text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() },
  ]
  
  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={lang === 'en' ? 'Enter text to convert...' : '输入要转换的文本...'}
        className="h-32 w-full rounded-lg border border-border bg-background p-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      <div className="space-y-3">
        {conversions.map((conv) => (
          <div key={conv.label} className="flex items-center gap-3">
            <span className="w-24 text-sm text-muted-foreground">{conv.label}</span>
            <div className="flex-1 rounded-lg bg-secondary p-3 text-foreground">{conv.value || "-"}</div>
            {conv.value && <CopyButton text={conv.value} />}
          </div>
        ))}
      </div>
    </div>
  )
}

// Base64 Tool
function Base64Tool() {
  const { lang } = useTranslation()
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  
  const convert = () => {
    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))))
      } else {
        setOutput(decodeURIComponent(escape(atob(input))))
      }
    } catch {
      setOutput(lang === 'en' ? 'Conversion error: Invalid input format' : '转换错误：输入格式不正确')
    }
  }
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setMode("encode")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "encode" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
          }`}
        >
          {lang === 'en' ? 'Encode' : '编码'}
        </button>
        <button
          onClick={() => setMode("decode")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "decode" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
          }`}
        >
          {lang === 'en' ? 'Decode' : '解码'}
        </button>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={lang === 'en' 
          ? (mode === "encode" ? "Enter text to encode..." : "Enter Base64 to decode...")
          : (mode === "encode" ? "输入要编码的文本..." : "输入要解码的 Base64...")
        }
        className="h-32 w-full rounded-lg border border-border bg-background p-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      <button
        onClick={convert}
        className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90"
      >
        {lang === 'en' ? 'Convert' : '转换'}
      </button>
      <div className="flex items-start gap-3">
        <textarea
          value={output}
          readOnly
          placeholder={lang === 'en' ? 'Result will be shown here...' : '结果将显示在这里...'}
          className="h-32 flex-1 rounded-lg border border-border bg-secondary p-4 text-foreground placeholder:text-muted-foreground"
        />
        {output && <CopyButton text={output} />}
      </div>
    </div>
  )
}

// URL Encode Tool
function UrlEncodeTool() {
  const { lang } = useTranslation()
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  
  const convert = () => {
    try {
      if (mode === "encode") {
        setOutput(encodeURIComponent(input))
      } else {
        setOutput(decodeURIComponent(input))
      }
    } catch {
      setOutput(lang === 'en' ? 'Conversion error: Invalid input format' : '转换错误：输入格式不正确')
    }
  }
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setMode("encode")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "encode" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
          }`}
        >
          {lang === 'en' ? 'Encode' : '编码'}
        </button>
        <button
          onClick={() => setMode("decode")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            mode === "decode" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
          }`}
        >
          {lang === 'en' ? 'Decode' : '解码'}
        </button>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={lang === 'en' 
          ? (mode === "encode" ? "Enter URL to encode..." : "Enter URL to decode...")
          : (mode === "encode" ? "输入要编码的 URL..." : "输入要解码的 URL...")
        }
        className="h-32 w-full rounded-lg border border-border bg-background p-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      <button
        onClick={convert}
        className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90"
      >
        {lang === 'en' ? 'Convert' : '转换'}
      </button>
      <div className="flex items-start gap-3">
        <textarea
          value={output}
          readOnly
          placeholder={lang === 'en' ? 'Result will be shown here...' : '结果将显示在这里...'}
          className="h-32 flex-1 rounded-lg border border-border bg-secondary p-4 text-foreground placeholder:text-muted-foreground"
        />
        {output && <CopyButton text={output} />}
      </div>
    </div>
  )
}

// JSON Format Tool
function JsonFormatTool() {
  const { lang } = useTranslation()
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  
  const format = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, 2))
      setError("")
    } catch (e) {
      setError((lang === 'en' ? 'JSON format error: ' : 'JSON 格式错误：') + (e as Error).message)
      setOutput("")
    }
  }
  
  const minify = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError("")
    } catch (e) {
      setError((lang === 'en' ? 'JSON format error: ' : 'JSON 格式错误：') + (e as Error).message)
      setOutput("")
    }
  }
  
  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={lang === 'en' ? 'Paste JSON data here...' : '粘贴 JSON 数据...'}
        className="h-40 w-full rounded-lg border border-border bg-background p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      <div className="flex gap-2">
        <button
          onClick={format}
          className="flex-1 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90"
        >
          {lang === 'en' ? 'Format' : '格式化'}
        </button>
        <button
          onClick={minify}
          className="flex-1 rounded-lg bg-secondary px-4 py-2 font-medium text-secondary-foreground hover:bg-secondary/80"
        >
          {lang === 'en' ? 'Minify' : '压缩'}
        </button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex items-start gap-3">
        <textarea
          value={output}
          readOnly
          placeholder={lang === 'en' ? 'Result will be shown here...' : '结果将显示在这里...'}
          className="h-40 flex-1 rounded-lg border border-border bg-secondary p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground"
        />
        {output && <CopyButton text={output} />}
      </div>
    </div>
  )
}

// Password Generator Tool
function PasswordGeneratorTool() {
  const { lang } = useTranslation()
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  })
  const [password, setPassword] = useState("")
  
  const generate = useCallback(() => {
    let chars = ""
    if (options.uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (options.lowercase) chars += "abcdefghijklmnopqrstuvwxyz"
    if (options.numbers) chars += "0123456789"
    if (options.symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?"
    
    if (!chars) {
      setPassword(lang === 'en' ? 'Please select at least one character type' : '请至少选择一种字符类型')
      return
    }
    
    let result = ""
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(result)
  }, [length, options, lang])
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-sm text-muted-foreground">长度: {length}</label>
        <input
          type="range"
          min="4"
          max="64"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          className="flex-1"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { key: "uppercase", label: "大写字母 (A-Z)" },
          { key: "lowercase", label: "小写字母 (a-z)" },
          { key: "numbers", label: "数字 (0-9)" },
          { key: "symbols", label: "特殊符号 (!@#$...)" },
        ].map((opt) => (
          <label key={opt.key} className="flex items-center gap-2 rounded-lg bg-secondary p-3">
            <input
              type="checkbox"
              checked={options[opt.key as keyof typeof options]}
              onChange={(e) => setOptions({ ...options, [opt.key]: e.target.checked })}
              className="h-4 w-4 rounded border-border"
            />
            <span className="text-sm text-foreground">{opt.label}</span>
          </label>
        ))}
      </div>
      <button
        onClick={generate}
        className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90"
      >
        生成密码
      </button>
      {password && (
        <div className="flex items-center gap-3 rounded-lg bg-secondary p-4">
          <code className="flex-1 break-all font-mono text-foreground">{password}</code>
          <CopyButton text={password} />
        </div>
      )}
    </div>
  )
}

// UUID Generator Tool
function UuidGeneratorTool() {
  const { lang } = useTranslation()
  const [uuids, setUuids] = useState<string[]>([])
  const [count, setCount] = useState(1)
  
  const generate = () => {
    const newUuids = Array.from({ length: count }, () => 
      "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0
        const v = c === "x" ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    )
    setUuids(newUuids)
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-sm text-muted-foreground">
          {lang === 'en' ? 'Count:' : '生成数量:'}
        </label>
        <input
          type="number"
          min="1"
          max="100"
          value={count}
          onChange={(e) => setCount(parseInt(e.target.value) || 1)}
          className="w-20 rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
        />
      </div>
      <button
        onClick={generate}
        className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90"
      >
        {lang === 'en' ? 'Generate UUID' : '生成 UUID'}
      </button>
      {uuids.length > 0 && (
        <div className="space-y-2">
          {uuids.map((uuid, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg bg-secondary p-3">
              <code className="flex-1 font-mono text-sm text-foreground">{uuid}</code>
              <CopyButton text={uuid} />
            </div>
          ))}
          <CopyButton text={uuids.join("\n")} />
        </div>
      )}
    </div>
  )
}

// QR Code Generator Tool
function QrCodeGeneratorTool() {
  const { lang } = useTranslation()
  const [text, setText] = useState("")
  const [qrUrl, setQrUrl] = useState("")
  
  const generate = () => {
    if (text) {
      setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`)
    }
  }
  
  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={lang === 'en' ? 'Enter text or URL to generate QR code...' : '输入要生成二维码的文本或链接...'}
        className="h-24 w-full rounded-lg border border-border bg-background p-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      <button
        onClick={generate}
        className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90"
      >
        {lang === 'en' ? 'Generate QR Code' : '生成二维码'}
      </button>
      {qrUrl && (
        <div className="flex flex-col items-center gap-4">
          <img src={qrUrl} alt="QR Code" className="rounded-lg" />
          <a
            href={qrUrl}
            download="qrcode.png"
            className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
          >
            <Download className="h-4 w-4" />
            {lang === 'en' ? 'Download QR Code' : '下载二维码'}
          </a>
        </div>
      )}
    </div>
  )
}

// Color Picker Tool
function ColorPickerTool() {
  const [color, setColor] = useState("#3b82f6")
  
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
      : ""
  }
  
  const hexToHsl = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return ""
    
    let r = parseInt(result[1], 16) / 255
    let g = parseInt(result[2], 16) / 255
    let b = parseInt(result[3], 16) / 255
    
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2
    
    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / d + 2) / 6; break
        case b: h = ((r - g) / d + 4) / 6; break
      }
    }
    
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-16 w-16 cursor-pointer rounded-lg border border-border"
        />
        <div className="flex-1 space-y-2">
          {[
            { label: "HEX", value: color.toUpperCase() },
            { label: "RGB", value: hexToRgb(color) },
            { label: "HSL", value: hexToHsl(color) },
          ].map((format) => (
            <div key={format.label} className="flex items-center gap-2">
              <span className="w-12 text-sm text-muted-foreground">{format.label}</span>
              <code className="flex-1 rounded bg-secondary px-2 py-1 text-sm text-foreground">{format.value}</code>
              <CopyButton text={format.value} />
            </div>
          ))}
        </div>
      </div>
      <div className="h-24 w-full rounded-lg" style={{ backgroundColor: color }} />
    </div>
  )
}

// Color Converter Tool
function ColorConverterTool() {
  const [hex, setHex] = useState("#3b82f6")
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 })
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 })
  
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (result) {
      return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    }
    return null
  }
  
  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("")
  }
  
  const updateFromHex = (newHex: string) => {
    setHex(newHex)
    const newRgb = hexToRgb(newHex)
    if (newRgb) {
      setRgb(newRgb)
    }
  }
  
  const updateFromRgb = (key: "r" | "g" | "b", value: number) => {
    const newRgb = { ...rgb, [key]: Math.min(255, Math.max(0, value)) }
    setRgb(newRgb)
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
  }
  
  return (
    <div className="space-y-4">
      <div className="h-20 w-full rounded-lg" style={{ backgroundColor: hex }} />
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <label className="w-12 text-sm text-muted-foreground">HEX</label>
          <input
            type="text"
            value={hex}
            onChange={(e) => updateFromHex(e.target.value)}
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <label className="w-12 text-sm text-muted-foreground">RGB</label>
          <input
            type="number"
            min="0"
            max="255"
            value={rgb.r}
            onChange={(e) => updateFromRgb("r", parseInt(e.target.value) || 0)}
            className="w-20 rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
            placeholder="R"
          />
          <input
            type="number"
            min="0"
            max="255"
            value={rgb.g}
            onChange={(e) => updateFromRgb("g", parseInt(e.target.value) || 0)}
            className="w-20 rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
            placeholder="G"
          />
          <input
            type="number"
            min="0"
            max="255"
            value={rgb.b}
            onChange={(e) => updateFromRgb("b", parseInt(e.target.value) || 0)}
            className="w-20 rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
            placeholder="B"
          />
        </div>
      </div>
    </div>
  )
}

// Timestamp Tool
function TimestampTool() {
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000).toString())
  const [date, setDate] = useState(new Date().toISOString().slice(0, 19))
  
  const timestampToDate = () => {
    try {
      const ts = parseInt(timestamp)
      const d = new Date(ts * 1000)
      setDate(d.toISOString().slice(0, 19))
    } catch {
      // ignore
    }
  }
  
  const dateToTimestamp = () => {
    try {
      const d = new Date(date)
      setTimestamp(Math.floor(d.getTime() / 1000).toString())
    } catch {
      // ignore
    }
  }
  
  const now = () => {
    const d = new Date()
    setTimestamp(Math.floor(d.getTime() / 1000).toString())
    setDate(d.toISOString().slice(0, 19))
  }
  
  return (
    <div className="space-y-4">
      <button
        onClick={now}
        className="w-full rounded-lg bg-secondary px-4 py-2 font-medium text-secondary-foreground hover:bg-secondary/80"
      >
        获取当前时间
      </button>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-sm text-muted-foreground">Unix时间戳</label>
          <input
            type="text"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <button
          onClick={timestampToDate}
          className="mt-6 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          转换
        </button>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-sm text-muted-foreground">日期时间</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <button
          onClick={dateToTimestamp}
          className="mt-6 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          转换
        </button>
      </div>
    </div>
  )
}

// Unit Converter Tool
function UnitConverterTool() {
  const [category, setCategory] = useState("length")
  const [value, setValue] = useState("1")
  const [fromUnit, setFromUnit] = useState("")
  const [toUnit, setToUnit] = useState("")
  
  const units: Record<string, { name: string; units: { id: string; name: string; factor: number }[] }> = {
    length: {
      name: "长度",
      units: [
        { id: "m", name: "米", factor: 1 },
        { id: "km", name: "千米", factor: 1000 },
        { id: "cm", name: "厘米", factor: 0.01 },
        { id: "mm", name: "毫米", factor: 0.001 },
        { id: "in", name: "英寸", factor: 0.0254 },
        { id: "ft", name: "英尺", factor: 0.3048 },
      ]
    },
    weight: {
      name: "重量",
      units: [
        { id: "kg", name: "千克", factor: 1 },
        { id: "g", name: "克", factor: 0.001 },
        { id: "mg", name: "毫克", factor: 0.000001 },
        { id: "lb", name: "磅", factor: 0.453592 },
        { id: "oz", name: "盎司", factor: 0.0283495 },
      ]
    },
    temperature: {
      name: "温度",
      units: [
        { id: "c", name: "摄氏度", factor: 1 },
        { id: "f", name: "华氏度", factor: 1 },
        { id: "k", name: "开尔文", factor: 1 },
      ]
    }
  }
  
  const currentUnits = units[category].units
  
  useState(() => {
    if (currentUnits.length >= 2) {
      setFromUnit(currentUnits[0].id)
      setToUnit(currentUnits[1].id)
    }
  })
  
  const convert = () => {
    const val = parseFloat(value)
    if (isNaN(val)) return "-"
    
    if (category === "temperature") {
      let celsius = val
      if (fromUnit === "f") celsius = (val - 32) * 5 / 9
      else if (fromUnit === "k") celsius = val - 273.15
      
      if (toUnit === "c") return celsius.toFixed(2)
      if (toUnit === "f") return (celsius * 9 / 5 + 32).toFixed(2)
      if (toUnit === "k") return (celsius + 273.15).toFixed(2)
    }
    
    const from = currentUnits.find(u => u.id === fromUnit)
    const to = currentUnits.find(u => u.id === toUnit)
    if (!from || !to) return "-"
    
    return (val * from.factor / to.factor).toFixed(6)
  }
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {Object.entries(units).map(([key, val]) => (
          <button
            key={key}
            onClick={() => {
              setCategory(key)
              setFromUnit(val.units[0].id)
              setToUnit(val.units[1]?.id || val.units[0].id)
            }}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              category === key ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            }`}
          >
            {val.name}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-24 rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
        />
        <select
          value={fromUnit}
          onChange={(e) => setFromUnit(e.target.value)}
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
        >
          {currentUnits.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
        <span className="text-muted-foreground">=</span>
        <div className="w-24 rounded-lg bg-secondary px-3 py-2 text-center font-medium text-foreground">
          {convert()}
        </div>
        <select
          value={toUnit}
          onChange={(e) => setToUnit(e.target.value)}
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
        >
          {currentUnits.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
      </div>
    </div>
  )
}

// Percentage Tool
function PercentageTool() {
  const { lang } = useTranslation()
  const [a, setA] = useState("")
  const [b, setB] = useState("")
  
  const calc1 = () => {
    const numA = parseFloat(a)
    const numB = parseFloat(b)
    if (!isNaN(numA) && !isNaN(numB) && numB !== 0) {
      return ((numA / numB) * 100).toFixed(2) + "%"
    }
    return "-"
  }
  
  const calc2 = () => {
    const numA = parseFloat(a)
    const numB = parseFloat(b)
    if (!isNaN(numA) && !isNaN(numB)) {
      return (numA * numB / 100).toFixed(2)
    }
    return "-"
  }
  
  const calc3 = () => {
    const numA = parseFloat(a)
    const numB = parseFloat(b)
    if (!isNaN(numA) && !isNaN(numB) && numB !== 0) {
      return (((numA - numB) / numB) * 100).toFixed(2) + "%"
    }
    return "-"
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input
          type="number"
          value={a}
          onChange={(e) => setA(e.target.value)}
          placeholder={lang === 'en' ? 'Value A' : '数值 A'}
          className="w-32 rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
        <input
          type="number"
          value={b}
          onChange={(e) => setB(e.target.value)}
          placeholder={lang === 'en' ? 'Value B' : '数值 B'}
          className="w-32 rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
      </div>
      <div className="space-y-2 rounded-lg bg-secondary p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {lang === 'en' ? 'A as % of B' : 'A 占 B 的百分比'}
          </span>
          <span className="font-medium text-foreground">{calc1()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {lang === 'en' ? 'A% of B' : 'A 的 B%'}
          </span>
          <span className="font-medium text-foreground">{calc2()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {lang === 'en' ? 'Growth rate of A relative to B' : 'A 相对 B 的增长率'}
          </span>
          <span className="font-medium text-foreground">{calc3()}</span>
        </div>
      </div>
    </div>
  )
}

// Calculator Tool
function CalculatorTool() {
  const [display, setDisplay] = useState("0")
  const [expression, setExpression] = useState("")
  
  const handleInput = (value: string) => {
    if (display === "0" && value !== ".") {
      setDisplay(value)
    } else {
      setDisplay(display + value)
    }
    setExpression(expression + value)
  }
  
  const handleOperator = (op: string) => {
    setExpression(expression + op)
    setDisplay("0")
  }
  
  const calculate = () => {
    try {
      const result = eval(expression.replace(/×/g, "*").replace(/÷/g, "/"))
      setDisplay(String(result))
      setExpression(String(result))
    } catch {
      setDisplay("Error")
    }
  }
  
  const clear = () => {
    setDisplay("0")
    setExpression("")
  }
  
  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-secondary p-4 text-right">
        <div className="text-sm text-muted-foreground">{expression || "0"}</div>
        <div className="text-3xl font-bold text-foreground">{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "-", "0", ".", "=", "+"].map((btn) => (
          <button
            key={btn}
            onClick={() => {
              if (btn === "=") calculate()
              else if (["+", "-", "×", "÷"].includes(btn)) handleOperator(btn)
              else handleInput(btn)
            }}
            className={`rounded-lg px-4 py-3 text-lg font-medium transition-colors ${
              ["+", "-", "×", "÷", "="].includes(btn)
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {btn}
          </button>
        ))}
        <button
          onClick={clear}
          className="col-span-4 rounded-lg bg-destructive/20 px-4 py-2 text-destructive hover:bg-destructive/30"
        >
          清除
        </button>
      </div>
    </div>
  )
}

// Hex Converter Tool
function HexConverterTool() {
  const [decimal, setDecimal] = useState("255")
  const [binary, setBinary] = useState("11111111")
  const [octal, setOctal] = useState("377")
  const [hex, setHex] = useState("ff")
  
  const updateFromDecimal = (val: string) => {
    const num = parseInt(val, 10)
    if (!isNaN(num)) {
      setDecimal(val)
      setBinary(num.toString(2))
      setOctal(num.toString(8))
      setHex(num.toString(16))
    }
  }
  
  const updateFromBinary = (val: string) => {
    const num = parseInt(val, 2)
    if (!isNaN(num)) {
      setBinary(val)
      setDecimal(num.toString(10))
      setOctal(num.toString(8))
      setHex(num.toString(16))
    }
  }
  
  const updateFromOctal = (val: string) => {
    const num = parseInt(val, 8)
    if (!isNaN(num)) {
      setOctal(val)
      setDecimal(num.toString(10))
      setBinary(num.toString(2))
      setHex(num.toString(16))
    }
  }
  
  const updateFromHex = (val: string) => {
    const num = parseInt(val, 16)
    if (!isNaN(num)) {
      setHex(val)
      setDecimal(num.toString(10))
      setBinary(num.toString(2))
      setOctal(num.toString(8))
    }
  }
  
  return (
    <div className="space-y-3">
      {[
        { label: "十进制", value: decimal, onChange: updateFromDecimal },
        { label: "二进制", value: binary, onChange: updateFromBinary },
        { label: "八进制", value: octal, onChange: updateFromOctal },
        { label: "十六进制", value: hex, onChange: updateFromHex },
      ].map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <label className="w-20 text-sm text-muted-foreground">{item.label}</label>
          <input
            type="text"
            value={item.value}
            onChange={(e) => item.onChange(e.target.value)}
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 font-mono text-foreground focus:border-primary focus:outline-none"
          />
          <CopyButton text={item.value} />
        </div>
      ))}
    </div>
  )
}

// Text Replace Tool
function TextReplaceTool() {
  const { lang } = useTranslation()
  const [text, setText] = useState("")
  const [find, setFind] = useState("")
  const [replace, setReplace] = useState("")
  const [result, setResult] = useState("")
  
  const doReplace = () => {
    setResult(text.split(find).join(replace))
  }
  
  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={lang === 'en' ? 'Enter original text...' : '输入原始文本...'}
        className="h-24 w-full rounded-lg border border-border bg-background p-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
      />
      <div className="flex gap-3">
        <input
          type="text"
          value={find}
          onChange={(e) => setFind(e.target.value)}
          placeholder={lang === 'en' ? 'Find' : '查找'}
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
        <input
          type="text"
          value={replace}
          onChange={(e) => setReplace(e.target.value)}
          placeholder={lang === 'en' ? 'Replace with' : '替换为'}
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
      </div>
      <button
        onClick={doReplace}
        className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90"
      >
        {lang === 'en' ? 'Replace' : '替换'}
      </button>
      <div className="flex items-start gap-3">
        <textarea
          value={result}
          readOnly
          placeholder={lang === 'en' ? 'Result...' : '结果...'}
          className="h-24 flex-1 rounded-lg border border-border bg-secondary p-4 text-foreground"
        />
        {result && <CopyButton text={result} />}
      </div>
    </div>
  )
}

// Text Reverse Tool
function TextReverseTool() {
  const { lang } = useTranslation()
  const [text, setText] = useState("")
  const result = text.split("").reverse().join("")
  
  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={lang === 'en' ? 'Enter text to reverse...' : '输入要反转的文本...'}
        className="h-32 w-full rounded-lg border border-border bg-background p-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
      />
      <div className="flex items-start gap-3">
        <textarea
          value={result}
          readOnly
          placeholder={lang === 'en' ? 'Reversed result...' : '反转结果...'}
          className="h-32 flex-1 rounded-lg border border-border bg-secondary p-4 text-foreground"
        />
        {result && <CopyButton text={result} />}
      </div>
    </div>
  )
}

// Text Dedupe Tool
function TextDedupeTool() {
  const { lang } = useTranslation()
  const [text, setText] = useState("")
  const result = Array.from(new Set(text.split("\n"))).join("\n")
  
  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={lang === 'en' ? 'One item per line...' : '每行一个内容...'}
        className="h-32 w-full rounded-lg border border-border bg-background p-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
      />
      <div className="flex items-start gap-3">
        <textarea
          value={result}
          readOnly
          placeholder={lang === 'en' ? 'Deduplicated result...' : '去重结果...'}
          className="h-32 flex-1 rounded-lg border border-border bg-secondary p-4 text-foreground"
        />
        {result && <CopyButton text={result} />}
      </div>
    </div>
  )
}

// Text Sort Tool
function TextSortTool() {
  const { lang } = useTranslation()
  const [text, setText] = useState("")
  const [order, setOrder] = useState<"asc" | "desc">("asc")
  const result = text.split("\n").filter(Boolean).sort((a, b) => 
    order === "asc" ? a.localeCompare(b) : b.localeCompare(a)
  ).join("\n")
  
  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={lang === 'en' ? 'One item per line...' : '每行一个内容...'}
        className="h-32 w-full rounded-lg border border-border bg-background p-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
      />
      <div className="flex gap-2">
        <button
          onClick={() => setOrder("asc")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium ${
            order === "asc" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
          }`}
        >
          {lang === 'en' ? 'Ascending' : '升序'}
        </button>
        <button
          onClick={() => setOrder("desc")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium ${
            order === "desc" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
          }`}
        >
          {lang === 'en' ? 'Descending' : '降序'}
        </button>
      </div>
      <div className="flex items-start gap-3">
        <textarea
          value={result}
          readOnly
          placeholder={lang === 'en' ? 'Sorted result...' : '排序结果...'}
          className="h-32 flex-1 rounded-lg border border-border bg-secondary p-4 text-foreground"
        />
        {result && <CopyButton text={result} />}
      </div>
    </div>
  )
}

// Unicode Tool
function UnicodeTool() {
  const [text, setText] = useState("")
  const [unicode, setUnicode] = useState("")
  
  const textToUnicode = () => {
    setUnicode(text.split("").map(c => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0")).join(""))
  }
  
  const unicodeToText = () => {
    try {
      setText(unicode.replace(/\\u([0-9a-fA-F]{4})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16))))
    } catch {
      // ignore
    }
  }
  
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm text-muted-foreground">文本</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="输入文本..."
          className="h-24 w-full rounded-lg border border-border bg-background p-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
        <button onClick={textToUnicode} className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          转换为Unicode
        </button>
      </div>
      <div>
        <label className="mb-1 block text-sm text-muted-foreground">Unicode</label>
        <textarea
          value={unicode}
          onChange={(e) => setUnicode(e.target.value)}
          placeholder="\u4f60\u597d..."
          className="h-24 w-full rounded-lg border border-border bg-background p-4 font-mono text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
        <button onClick={unicodeToText} className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          转换为文本
        </button>
      </div>
    </div>
  )
}

// HTML Entity Tool
function HtmlEntityTool() {
  const [text, setText] = useState("")
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  
  const convert = () => {
    if (mode === "encode") {
      const div = document.createElement("div")
      div.textContent = text
      return div.innerHTML
    } else {
      const div = document.createElement("div")
      div.innerHTML = text
      return div.textContent || ""
    }
  }
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setMode("encode")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium ${
            mode === "encode" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
          }`}
        >
          编码
        </button>
        <button
          onClick={() => setMode("decode")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium ${
            mode === "decode" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
          }`}
        >
          解码
        </button>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="输入文本..."
        className="h-32 w-full rounded-lg border border-border bg-background p-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
      />
      <div className="flex items-start gap-3">
        <textarea
          value={convert()}
          readOnly
          placeholder="结果..."
          className="h-32 flex-1 rounded-lg border border-border bg-secondary p-4 text-foreground"
        />
        <CopyButton text={convert()} />
      </div>
    </div>
  )
}

// ASCII Converter Tool
function AsciiConverterTool() {
  const [text, setText] = useState("")
  const [ascii, setAscii] = useState("")
  
  const textToAscii = () => {
    setAscii(text.split("").map(c => c.charCodeAt(0)).join(" "))
  }
  
  const asciiToText = () => {
    try {
      setText(ascii.split(/\s+/).map(n => String.fromCharCode(parseInt(n))).join(""))
    } catch {
      // ignore
    }
  }
  
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm text-muted-foreground">文本</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="输入文本..."
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
        <button onClick={textToAscii} className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          转换为ASCII
        </button>
      </div>
      <div>
        <label className="mb-1 block text-sm text-muted-foreground">ASCII码 (空格分隔)</label>
        <input
          type="text"
          value={ascii}
          onChange={(e) => setAscii(e.target.value)}
          placeholder="72 101 108 108 111..."
          className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
        <button onClick={asciiToText} className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          转换为文本
        </button>
      </div>
    </div>
  )
}

// Lorem Generator Tool
function LoremGeneratorTool() {
  const [paragraphs, setParagraphs] = useState(1)
  const [result, setResult] = useState("")
  
  const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  
  const generate = () => {
    setResult(Array(paragraphs).fill(lorem).join("\n\n"))
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-sm text-muted-foreground">段落数:</label>
        <input
          type="number"
          min="1"
          max="20"
          value={paragraphs}
          onChange={(e) => setParagraphs(parseInt(e.target.value) || 1)}
          className="w-20 rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
        />
        <button
          onClick={generate}
          className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90"
        >
          生成
        </button>
      </div>
      {result && (
        <div className="flex items-start gap-3">
          <textarea
            value={result}
            readOnly
            className="h-40 flex-1 rounded-lg border border-border bg-secondary p-4 text-foreground"
          />
          <CopyButton text={result} />
        </div>
      )}
    </div>
  )
}

// Color Generator Tool
function ColorGeneratorTool() {
  const [colors, setColors] = useState<string[]>([])
  
  const generate = () => {
    const newColors = Array.from({ length: 5 }, () => 
      "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")
    )
    setColors(newColors)
  }
  
  return (
    <div className="space-y-4">
      <button
        onClick={generate}
        className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90"
      >
        生成随机颜色
      </button>
      {colors.length > 0 && (
        <div className="grid gap-2">
          {colors.map((color, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg" style={{ backgroundColor: color }} />
              <code className="flex-1 rounded bg-secondary px-3 py-2 font-mono text-sm text-foreground">{color.toUpperCase()}</code>
              <CopyButton text={color.toUpperCase()} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Gradient Generator Tool
function GradientGeneratorTool() {
  const [color1, setColor1] = useState("#aca544ff")
  const [color2, setColor2] = useState("#fbbf24")
  const [angle, setAngle] = useState(90)
  
  const css = `background: linear-gradient(${angle}deg, ${color1}, ${color2});`
  
  return (
    <div className="space-y-4">
      <div
        className="h-32 w-full rounded-lg"
        style={{ background: `linear-gradient(${angle}deg, ${color1}, ${color2})` }}
      />
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={color1}
            onChange={(e) => setColor1(e.target.value)}
            className="h-10 w-10 cursor-pointer rounded border border-border"
          />
          <input
            type="color"
            value={color2}
            onChange={(e) => setColor2(e.target.value)}
            className="h-10 w-10 cursor-pointer rounded border border-border"
          />
        </div>
        <div className="flex-1">
          <label className="text-sm text-muted-foreground">角度: {angle}°</label>
          <input
            type="range"
            min="0"
            max="360"
            value={angle}
            onChange={(e) => setAngle(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <code className="flex-1 rounded-lg bg-secondary p-3 font-mono text-sm text-foreground">{css}</code>
        <CopyButton text={css} />
      </div>
    </div>
  )
}

// Date Calc Tool
function DateCalcTool() {
  const { lang } = useTranslation()
  const [date1, setDate1] = useState(new Date().toISOString().split("T")[0])
  const [date2, setDate2] = useState(new Date().toISOString().split("T")[0])
  
  const diff = () => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    const diffTime = Math.abs(d2.getTime() - d1.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-sm text-muted-foreground">
            {lang === 'en' ? 'Start Date' : '开始日期'}
          </label>
          <input
            type="date"
            value={date1}
            onChange={(e) => setDate1(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-sm text-muted-foreground">
            {lang === 'en' ? 'End Date' : '结束日期'}
          </label>
          <input
            type="date"
            value={date2}
            onChange={(e) => setDate2(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </div>
      <div className="rounded-lg bg-secondary p-4 text-center">
        <div className="text-3xl font-bold text-foreground">{diff()}</div>
        <div className="text-sm text-muted-foreground">
          {lang === 'en' ? 'days' : '天'}
        </div>
      </div>
    </div>
  )
}

// BMI Calc Tool
function BmiCalcTool() {
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  
  const bmi = () => {
    const h = parseFloat(height) / 100
    const w = parseFloat(weight)
    if (h > 0 && w > 0) {
      return (w / (h * h)).toFixed(1)
    }
    return "-"
  }
  
  const status = () => {
    const b = parseFloat(bmi())
    if (isNaN(b)) return ""
    if (b < 18.5) return "偏瘦"
    if (b < 24) return "正常"
    if (b < 28) return "偏胖"
    return "肥胖"
  }
  
  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-sm text-muted-foreground">身高 (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="170"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-sm text-muted-foreground">体重 (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="65"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </div>
      <div className="rounded-lg bg-secondary p-4 text-center">
        <div className="text-3xl font-bold text-foreground">{bmi()}</div>
        <div className="text-sm text-muted-foreground">BMI指数 {status() && `- ${status()}`}</div>
      </div>
    </div>
  )
}

// Text Diff Tool
function TextDiffTool() {
  const [text1, setText1] = useState("")
  const [text2, setText2] = useState("")
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm text-muted-foreground">文本 1</label>
          <textarea
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            placeholder="输入第一段文本..."
            className="h-40 w-full rounded-lg border border-border bg-background p-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-muted-foreground">文本 2</label>
          <textarea
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            placeholder="输入第二段文本..."
            className="h-40 w-full rounded-lg border border-border bg-background p-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </div>
      <div className="rounded-lg bg-secondary p-4">
        <div className="text-sm text-muted-foreground">
          {text1 === text2 ? (
            <span className="text-green-500">两段文本完全相同</span>
          ) : (
            <span className="text-amber-500">两段文本存在差异</span>
          )}
        </div>
        <div className="mt-2 text-sm text-foreground">
          文本1长度: {text1.length} | 文本2长度: {text2.length}
        </div>
      </div>
    </div>
  )
}

// Image Tool (Generic)
function ImageTool({ toolId }: { toolId: string }) {
  const [image, setImage] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [rotateAngle, setRotateAngle] = useState(90)
  const [filterType, setFilterType] = useState("sepia")
  const [filterValue, setFilterValue] = useState(50)
  
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  
  const processImage = () => {
    if (!image) return
    
    const img = new window.Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      
      if (toolId === "image-rotate") {
        const angleInRadians = (rotateAngle * Math.PI) / 180
        canvas.width = img.height
        canvas.height = img.width
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate(angleInRadians)
        ctx.drawImage(img, -img.width / 2, -img.height / 2)
      } else if (toolId === "image-filter") {
        canvas.width = img.width
        canvas.height = img.height
        ctx.filter = `${filterType}(${filterValue}%)`
        ctx.drawImage(img, 0, 0)
      } else if (toolId === "image-grayscale") {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
          data[i] = avg
          data[i + 1] = avg
          data[i + 2] = avg
        }
        ctx.putImageData(imageData, 0, 0)
      } else if (toolId === "image-resize") {
        canvas.width = img.width / 2
        canvas.height = img.height / 2
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      } else if (toolId === "image-compress") {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
      } else if (toolId === "remove-bg") {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        for (let i = 0; i < data.length; i += 4) {
          // 简单的背景移除逻辑：如果像素接近白色，则使其透明
          if (data[i] > 200 && data[i + 1] > 200 && data[i + 2] > 200) {
            data[i + 3] = 0
          }
        }
        ctx.putImageData(imageData, 0, 0)
      } else {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
      }
      
      setResult(canvas.toDataURL(toolId === "image-compress" ? "image/jpeg" : "image/png", 0.7))
    }
    img.src = image
  }
  
  const getBase64 = () => {
    if (image) {
      return image.split(",")[1]
    }
    return ""
  }
  
  return (
    <div className="space-y-4">
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary p-8 transition-colors hover:border-primary">
        <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">点击或拖拽上传图片</span>
        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </label>
      
      {image && (
        <>
          {toolId === "image-rotate" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">旋转角度：{rotateAngle}°</label>
              <input
                type="range"
                min="0"
                max="360"
                step="15"
                value={rotateAngle}
                onChange={(e) => setRotateAngle(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0°</span>
                <span>90°</span>
                <span>180°</span>
                <span>270°</span>
                <span>360°</span>
              </div>
            </div>
          )}
          
          {toolId === "image-filter" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">滤镜类型</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background p-2 text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="sepia">怀旧 (Sepia)</option>
                  <option value="grayscale">黑白 (Grayscale)</option>
                  <option value="blur">模糊 (Blur)</option>
                  <option value="brightness">亮度 (Brightness)</option>
                  <option value="contrast">对比度 (Contrast)</option>
                  <option value="saturate">饱和度 (Saturate)</option>
                  <option value="hue-rotate">色相旋转 (Hue Rotate)</option>
                  <option value="invert">反色 (Invert)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">滤镜强度：{filterValue}%</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="5"
                  value={filterValue}
                  onChange={(e) => setFilterValue(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-2 text-sm text-muted-foreground">原图</p>
              <img src={image} alt="Original" className="w-full rounded-lg" />
            </div>
            {result && (
              <div>
                <p className="mb-2 text-sm text-muted-foreground">结果</p>
                <img src={result} alt="Result" className="w-full rounded-lg" />
              </div>
            )}
          </div>
          
          {toolId === "image-to-base64" ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Base64 编码:</p>
              <div className="flex items-start gap-3">
                <textarea
                  value={getBase64()}
                  readOnly
                  className="h-32 flex-1 rounded-lg border border-border bg-secondary p-4 font-mono text-xs text-foreground"
                />
                <CopyButton text={getBase64()} />
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={processImage}
                className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90"
              >
                处理图片
              </button>
              {result && (
                <a
                  href={result}
                  download="processed.png"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-2 font-medium text-secondary-foreground hover:bg-secondary/80"
                >
                  <Download className="h-4 w-4" />
                  下载结果
                </a>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}

// File Converter Tool
function FileConverterTool() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [targetFormat, setTargetFormat] = useState("txt")
  const [converting, setConverting] = useState(false)
  
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    if (uploadedFile) {
      setFile(uploadedFile)
      setResult(null)
      
      // 根据上传的文件类型自动设置目标格式
      const fileType = uploadedFile.name.split('.').pop()?.toLowerCase()
      if (fileType === 'docx') {
        setTargetFormat('txt')
      } else if (fileType === 'pdf') {
        setTargetFormat('txt')
      }
    }
  }
  
  const convertFile = async () => {
    if (!file) return
    
    setConverting(true)
    
    try {
      const fileType = file.name.split('.').pop()?.toLowerCase()
      
      if (fileType === 'docx') {
        // DOCX to TXT using mammoth
        const arrayBuffer = await file.arrayBuffer()
        // @ts-ignore - mammoth types
        const result = await window.mammoth.extractRawText({ arrayBuffer })
        setResult(result.value)
      } else if (fileType === 'pdf') {
        // PDF to TXT using pdf.js
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await (window as any).pdfjsLib.getDocument({ data: arrayBuffer }).promise
        let fullText = ''
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const textContent = await page.getTextContent()
          const pageText = textContent.items.map((item: any) => item.str).join(' ')
          fullText += pageText + '\n'
        }
        
        setResult(fullText)
      } else {
        // 其他格式直接读取文本
        const reader = new FileReader()
        reader.onload = (e) => {
          setResult(e.target?.result as string)
          setConverting(false)
        }
        reader.readAsText(file)
        return
      }
    } catch (error) {
      console.error("Conversion error:", error)
      setResult("转换失败：" + (error as Error).message)
    }
    
    setConverting(false)
  }
  
  const downloadResult = () => {
    if (!result) return
    
    const blob = new Blob([result], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `converted.${targetFormat}`
    a.click()
    URL.revokeObjectURL(url)
  }
  
  return (
    <div className="space-y-4">
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary p-8 transition-colors hover:border-primary">
        <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">点击或拖拽上传文件</span>
        <input 
          type="file" 
          accept=".docx,.pdf,.txt,.md"
          onChange={handleUpload} 
          className="hidden" 
        />
      </label>
      
      {file && (
        <>
          <div className="rounded-lg bg-secondary p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium text-foreground">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFile(null)
                  setResult(null)
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">目标格式</label>
            <select
              value={targetFormat}
              onChange={(e) => setTargetFormat(e.target.value)}
              className="w-full rounded-lg border border-border bg-background p-2 text-foreground focus:border-primary focus:outline-none"
            >
              <option value="txt">TXT (文本文件)</option>
              <option value="md">MD (Markdown)</option>
            </select>
          </div>
          
          <button
            onClick={convertFile}
            disabled={converting}
            className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {converting ? "转换中..." : "开始转换"}
          </button>
          
          {result && (
            <>
              <div className="rounded-lg bg-secondary p-4">
                <p className="mb-2 text-sm font-medium text-foreground">转换结果</p>
                <textarea
                  value={result}
                  readOnly
                  className="h-64 w-full rounded-lg border border-border bg-background p-2 text-sm text-foreground"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={downloadResult}
                  className="flex-1 rounded-lg bg-secondary px-4 py-2 font-medium text-secondary-foreground hover:bg-secondary/80"
                >
                  下载结果
                </button>
                <CopyButton text={result} />
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

// Placeholder Tool
function PlaceholderTool() {
  return (
    <div className="py-8 text-center text-muted-foreground">
      此工具正在开发中...
    </div>
  )
}

// Main Page Component
export default function ToolsPage() {
  const { t, lang } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)
  const { isFavorite, toggleFavorite } = useFavorites()
  
  // 应用全局设置
  useSettings()

  const filteredTools = tools.filter(tool => {
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || tool.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const groupedTools = categories.reduce((acc, category) => {
    const categoryTools = filteredTools.filter(tool => tool.category === category)
    if (categoryTools.length > 0) {
      acc[category] = categoryTools
    }
    return acc
  }, {} as Record<string, Tool[]>)

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t("实用工具")}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {lang === 'en' ? `${tools.length}+ online tools to improve your work efficiency` : `${tools.length}+ 在线工具，提升您的工作效率`}
          </p>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={lang === 'en' ? 'Search tools...' : '搜索工具...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-card px-10 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                !selectedCategory
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {lang === 'en' ? 'All' : '全部'}
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {lang === 'en' && categoryTranslations[category] ? categoryTranslations[category] : category}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="space-y-8">
          {Object.entries(groupedTools).map(([category, categoryTools]) => (
            <section key={category}>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                {lang === 'en' && categoryTranslations[category] ? categoryTranslations[category] : category}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({categoryTools.length})
                </span>
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categoryTools.map((tool) => {
                  const Icon = tool.icon
                  const isFav = isFavorite(`tool-${tool.id}`)
                  const displayToolName = lang === 'en' && toolNameTranslations[tool.name] 
                    ? toolNameTranslations[tool.name] 
                    : tool.name
                  const displayToolDesc = lang === 'en' && toolDescriptionTranslations[tool.description]
                    ? toolDescriptionTranslations[tool.description]
                    : tool.description
                  return (
                    <div key={tool.id} className="relative group">
                      <button
                        onClick={() => setSelectedTool(tool)}
                        className="group flex w-full items-start gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/50 hover:shadow-md"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground group-hover:text-primary">
                            {displayToolName}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {displayToolDesc}
                          </p>
                        </div>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite({
                            type: 'tool',
                            id: tool.id,
                            name: tool.name,
                            url: `/tools?tool=${tool.id}`,
                            description: tool.description,
                            category: tool.category,
                          })
                        }}
                        className="absolute right-2 top-2 rounded-full p-1.5 transition-colors hover:bg-secondary"
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            isFav
                              ? "fill-red-500 text-red-500"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">{lang === 'en' ? 'No matching tools found' : '未找到匹配的工具'}</p>
          </div>
        )}
      </main>

      {/* Tool Modal */}
      {selectedTool && (
        <ToolModal tool={selectedTool} onClose={() => setSelectedTool(null)} />
      )}
    </div>
  )
}
