"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { useFavorites } from "@/hooks/use-favorites"
import { useFavicon, getInitials, getGradientColor } from "@/hooks/use-favicon"
import { useSettings } from "@/hooks/use-settings"
import { useTranslation } from "@/hooks/use-translation"
import { Search, ExternalLink, Heart } from "lucide-react"

interface Site {
  name: string
  url: string
  description: string
  category: string
}

interface SiteCardProps {
  site: Site
  isFav: boolean
  onToggleFavorite: () => void
}

function SiteCard({ site, isFav, onToggleFavorite }: SiteCardProps) {
  const { src: faviconSrc, error: faviconError, onError: handleFaviconError, onLoad: handleFaviconLoad } = useFavicon({
    url: site.url,
    name: site.name,
  })

  return (
    <div className="relative group">
      <a
        href={site.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
      >
        <div className="mb-3 flex items-start gap-3">
          {faviconError || !faviconSrc ? (
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded bg-gradient-to-br ${getGradientColor(site.name)}`}>
              <span className="text-xs font-bold text-white">{getInitials(site.name)}</span>
            </div>
          ) : (
            <img
              src={faviconSrc}
              alt={site.name}
              crossOrigin="anonymous"
              className="h-8 w-8 rounded"
              onError={handleFaviconError}
              onLoad={handleFaviconLoad}
            />
          )}
          <div className="flex-1">
            <h3 className="font-medium text-foreground group-hover:text-primary line-clamp-1">
              {site.name}
            </h3>
          </div>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {site.description}
        </p>
      </a>
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onToggleFavorite()
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
      <div className="absolute bottom-2 right-2 rounded-full bg-primary/10 p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
        <ExternalLink className="h-3 w-3 text-primary" />
      </div>
    </div>
  )
}

const sites: Site[] = [
  // 开发工具 (15)
  { name: "Vercel", url: "https://vercel.com", description: "静态网站托管与部署平台", category: "开发工具" },
  { name: "V0", url: "https://v0.dev", description: "AI 驱动的前端开发助手", category: "开发工具" },
  { name: "GitHub", url: "https://github.com", description: "全球最大的代码托管平台", category: "开发工具" },
  { name: "GitLab", url: "https://gitlab.com", description: "DevOps 生命周期工具", category: "开发工具" },
  { name: "Netlify", url: "https://netlify.com", description: "现代化 Web 项目自动化平台", category: "开发工具" },
  { name: "Railway", url: "https://railway.app", description: "快速部署应用的云平台", category: "开发工具" },
  { name: "Render", url: "https://render.com", description: "统一云平台构建部署", category: "开发工具" },
  { name: "Supabase", url: "https://supabase.com", description: "开源 Firebase 替代方案", category: "开发工具" },
  { name: "PlanetScale", url: "https://planetscale.com", description: "MySQL 兼容的无服务器数据库", category: "开发工具" },
  { name: "Neon", url: "https://neon.tech", description: "无服务器 PostgreSQL 数据库", category: "开发工具" },
  { name: "CodeSandbox", url: "https://codesandbox.io", description: "在线代码编辑器", category: "开发工具" },
  { name: "StackBlitz", url: "https://stackblitz.com", description: "在线 IDE 开发环境", category: "开发工具" },
  { name: "Replit", url: "https://replit.com", description: "在线编程学习平台", category: "开发工具" },
  { name: "Glitch", url: "https://glitch.com", description: "创意编程社区", category: "开发工具" },
  { name: "JetBrains", url: "https://jetbrains.com", description: "专业开发工具套件", category: "开发工具" },
  
  // 域名与 CDN (10)
  { name: "Cloudflare", url: "https://cloudflare.com", description: "域名、CDN 与安全服务", category: "域名与 CDN" },
  { name: "Namecheap", url: "https://namecheap.com", description: "域名注册与网络服务", category: "域名与 CDN" },
  { name: "GoDaddy", url: "https://godaddy.com", description: "全球领先的域名注册商", category: "域名与 CDN" },
  { name: "DNSPod", url: "https://dnspod.cn", description: "智能 DNS 解析服务", category: "域名与 CDN" },
  { name: "阿里云", url: "https://aliyun.com", description: "云计算与域名服务", category: "域名与 CDN" },
  { name: "腾讯云", url: "https://cloud.tencent.com", description: "全球云服务提供商", category: "域名与 CDN" },
  { name: "华为云", url: "https://huaweicloud.com", description: "华为云服务", category: "域名与 CDN" },
  { name: "AWS", url: "https://aws.amazon.com", description: "亚马逊云服务", category: "域名与 CDN" },
  { name: "Google Cloud", url: "https://cloud.google.com", description: "谷歌云平台", category: "域名与 CDN" },
  { name: "Azure", url: "https://azure.microsoft.com", description: "微软云服务", category: "域名与 CDN" },
  
  // 设计资源 (15)
  { name: "Figma", url: "https://figma.com", description: "协作设计工具", category: "设计资源" },
  { name: "Dribbble", url: "https://dribbble.com", description: "设计师作品展示社区", category: "设计资源" },
  { name: "Behance", url: "https://behance.net", description: "创意作品展示平台", category: "设计资源" },
  { name: "Unsplash", url: "https://unsplash.com", description: "免费高清图片素材库", category: "设计资源" },
  { name: "Pexels", url: "https://pexels.com", description: "免费图片与视频素材", category: "设计资源" },
  { name: "Pixabay", url: "https://pixabay.com", description: "免费素材图片库", category: "设计资源" },
  { name: "Iconfont", url: "https://iconfont.cn", description: "阿里巴巴矢量图标库", category: "设计资源" },
  { name: "Iconify", url: "https://iconify.design", description: "统一图标框架", category: "设计资源" },
  { name: "Lucide", url: "https://lucide.dev", description: "精美开源图标库", category: "设计资源" },
  { name: "Font Awesome", url: "https://fontawesome.com", description: "流行图标库", category: "设计资源" },
  { name: "Coolors", url: "https://coolors.co", description: "配色方案生成器", category: "设计资源" },
  { name: "Color Hunt", url: "https://colorhunt.co", description: "色彩搭配灵感", category: "设计资源" },
  { name: "Adobe Color", url: "https://color.adobe.com", description: "Adobe 配色工具", category: "设计资源" },
  { name: "Canva", url: "https://canva.com", description: "在线设计工具", category: "设计资源" },
  { name: "Remove.bg", url: "https://remove.bg", description: "AI 抠图工具", category: "设计资源" },
  
  // 前端框架 (15)
  { name: "Next.js", url: "https://nextjs.org", description: "React 全栈框架", category: "前端框架" },
  { name: "React", url: "https://react.dev", description: "用于构建用户界面的库", category: "前端框架" },
  { name: "Vue.js", url: "https://vuejs.org", description: "渐进式 JavaScript 框架", category: "前端框架" },
  { name: "Nuxt", url: "https://nuxt.com", description: "Vue 全栈框架", category: "前端框架" },
  { name: "Svelte", url: "https://svelte.dev", description: "编译时前端框架", category: "前端框架" },
  { name: "Astro", url: "https://astro.build", description: "内容驱动网站框架", category: "前端框架" },
  { name: "Remix", url: "https://remix.run", description: "全栈 Web 框架", category: "前端框架" },
  { name: "Tailwind CSS", url: "https://tailwindcss.com", description: "实用优先的 CSS 框架", category: "前端框架" },
  { name: "shadcn/ui", url: "https://ui.shadcn.com", description: "可复用组件集合", category: "前端框架" },
  { name: "Radix UI", url: "https://radix-ui.com", description: "无样式组件库", category: "前端框架" },
  { name: "Chakra UI", url: "https://chakra-ui.com", description: "模块化组件库", category: "前端框架" },
  { name: "Ant Design", url: "https://ant.design", description: "企业级 UI 组件库", category: "前端框架" },
  { name: "Material UI", url: "https://mui.com", description: "React 组件库", category: "前端框架" },
  { name: "Bootstrap", url: "https://getbootstrap.com", description: "流行 CSS 框架", category: "前端框架" },
  { name: "Vite", url: "https://vitejs.dev", description: "下一代前端构建工具", category: "前端框架" },
  
  // AI 工具 (15)
  { name: "ChatGPT", url: "https://chat.openai.com", description: "OpenAI 对话 AI", category: "AI 工具" },
  { name: "Claude", url: "https://claude.ai", description: "Anthropic AI 助手", category: "AI 工具" },
  { name: "Midjourney", url: "https://midjourney.com", description: "AI 图像生成工具", category: "AI 工具" },
  { name: "Stable Diffusion", url: "https://stability.ai", description: "开源 AI 图像生成", category: "AI 工具" },
  { name: "Cursor", url: "https://cursor.sh", description: "AI 驱动的代码编辑器", category: "AI 工具" },
  { name: "GitHub Copilot", url: "https://github.com/features/copilot", description: "AI 编程助手", category: "AI 工具" },
  { name: "Perplexity", url: "https://perplexity.ai", description: "AI 搜索引擎", category: "AI 工具" },
  { name: "Notion AI", url: "https://notion.so", description: "AI 增强的笔记工具", category: "AI 工具" },
  { name: "Jasper", url: "https://jasper.ai", description: "AI 内容创作", category: "AI 工具" },
  { name: "Copy.ai", url: "https://copy.ai", description: "AI 文案生成", category: "AI 工具" },
  { name: "Runway", url: "https://runwayml.com", description: "AI 视频编辑", category: "AI 工具" },
  { name: "ElevenLabs", url: "https://elevenlabs.io", description: "AI 语音合成", category: "AI 工具" },
  { name: "Hugging Face", url: "https://huggingface.co", description: "AI 模型社区", category: "AI 工具" },
  { name: "Replicate", url: "https://replicate.com", description: "AI 模型部署", category: "AI 工具" },
  { name: "Civitai", url: "https://civitai.com", description: "AI 模型分享平台", category: "AI 工具" },
  
  // 效率工具 (12)
  { name: "Notion", url: "https://notion.so", description: "全能型协作工作空间", category: "效率工具" },
  { name: "Obsidian", url: "https://obsidian.md", description: "本地知识库笔记软件", category: "效率工具" },
  { name: "Todoist", url: "https://todoist.com", description: "任务管理工具", category: "效率工具" },
  { name: "Linear", url: "https://linear.app", description: "现代化项目管理工具", category: "效率工具" },
  { name: "Slack", url: "https://slack.com", description: "团队协作沟通平台", category: "效率工具" },
  { name: "Discord", url: "https://discord.com", description: "社区聊天与语音平台", category: "效率工具" },
  { name: "Lark", url: "https://larksuite.com", description: "字节跳动协作套件", category: "效率工具" },
  { name: "飞书", url: "https://feishu.cn", description: "企业协作平台", category: "效率工具" },
  { name: "Trello", url: "https://trello.com", description: "看板项目管理", category: "效率工具" },
  { name: "Asana", url: "https://asana.com", description: "团队协作管理", category: "效率工具" },
  { name: "Monday", url: "https://monday.com", description: "工作操作系统", category: "效率工具" },
  { name: "Evernote", url: "https://evernote.com", description: "笔记应用", category: "效率工具" },
  
  // 学习资源 (15)
  { name: "MDN Web Docs", url: "https://developer.mozilla.org", description: "Web 技术权威文档", category: "学习资源" },
  { name: "Stack Overflow", url: "https://stackoverflow.com", description: "程序员问答社区", category: "学习资源" },
  { name: "掘金", url: "https://juejin.cn", description: "开发者社区", category: "学习资源" },
  { name: "SegmentFault", url: "https://segmentfault.com", description: "技术问答社区", category: "学习资源" },
  { name: "freeCodeCamp", url: "https://freecodecamp.org", description: "免费编程学习平台", category: "学习资源" },
  { name: "Codecademy", url: "https://codecademy.com", description: "交互式编程学习", category: "学习资源" },
  { name: "LeetCode", url: "https://leetcode.com", description: "算法题库与面试准备", category: "学习资源" },
  { name: "力扣", url: "https://leetcode.cn", description: "算法刷题平台中国站", category: "学习资源" },
  { name: "Coursera", url: "https://coursera.org", description: "在线课程平台", category: "学习资源" },
  { name: "edX", url: "https://edx.org", description: "哈佛大学 MIT 课程", category: "学习资源" },
  { name: "Udemy", url: "https://udemy.com", description: "技能学习平台", category: "学习资源" },
  { name: "YouTube", url: "https://youtube.com", description: "视频学习平台", category: "学习资源" },
  { name: "Bilibili", url: "https://bilibili.com", description: "学习视频网站", category: "学习资源" },
  { name: "阮一峰", url: "https://ruanyifeng.com", description: "技术博客", category: "学习资源" },
  { name: "廖雪峰", url: "https://liaoxuefeng.com", description: "编程教程", category: "学习资源" },
  
  // 社交媒体 (10)
  { name: "Twitter/X", url: "https://twitter.com", description: "社交媒体平台", category: "社交媒体" },
  { name: "微博", url: "https://weibo.com", description: "中国版 Twitter", category: "社交媒体" },
  { name: "Instagram", url: "https://instagram.com", description: "图片分享社交", category: "社交媒体" },
  { name: "Facebook", url: "https://facebook.com", description: "全球社交网络", category: "社交媒体" },
  { name: "LinkedIn", url: "https://linkedin.com", description: "职场社交", category: "社交媒体" },
  { name: "Reddit", url: "https://reddit.com", description: "社交新闻网站", category: "社交媒体" },
  { name: "知乎", url: "https://zhihu.com", description: "问答社区", category: "社交媒体" },
  { name: "小红书", url: "https://xiaohongshu.com", description: "生活方式社区", category: "社交媒体" },
  { name: "抖音", url: "https://douyin.com", description: "短视频平台", category: "社交媒体" },
  { name: "TikTok", url: "https://tiktok.com", description: "国际版抖音", category: "社交媒体" },
  
  // 云服务 (10)
  { name: "Vercel", url: "https://vercel.com", description: "前端部署平台", category: "云服务" },
  { name: "Netlify", url: "https://netlify.com", description: "Jamstack 部署", category: "云服务" },
  { name: "Heroku", url: "https://heroku.com", description: "云平台即服务", category: "云服务" },
  { name: "DigitalOcean", url: "https://digitalocean.com", description: "云服务器", category: "云服务" },
  { name: "Linode", url: "https://linode.com", description: "云主机服务", category: "云服务" },
  { name: "Vultr", url: "https://vultr.com", description: "云服务器", category: "云服务" },
  { name: "Oracle Cloud", url: "https://oracle.com/cloud", description: "甲骨文云服务", category: "云服务" },
  { name: "Fly.io", url: "https://fly.io", description: "边缘计算平台", category: "云服务" },
  { name: "Cloudflare Pages", url: "https://pages.cloudflare.com", description: "边缘网站托管", category: "云服务" },
  { name: "GitHub Pages", url: "https://pages.github.com", description: "静态网站托管", category: "云服务" },
]

const categories = Array.from(new Set(sites.map(site => site.category)))

// 分类翻译
const categoryTranslations: Record<string, string> = {
  "开发工具": "Development Tools",
  "云服务": "Cloud Services",
  "社交媒体": "Social Media",
  "设计资源": "Design Resources",
  "学习资源": "Learning Resources",
  "新闻媒体": "News & Media",
  "娱乐": "Entertainment",
  "购物": "Shopping",
  "搜索引擎": "Search Engines",
  "音乐": "Music",
  "视频": "Video",
  "阅读": "Reading",
  "博客": "Blogs",
  "论坛": "Forums",
  "文档": "Documentation",
  "API": "APIs",
  "数据分析": "Data Analytics",
  "人工智能": "Artificial Intelligence",
  "网络安全": "Cybersecurity",
  "游戏": "Gaming",
  "旅游": "Travel",
  "美食": "Food",
  "健康": "Health",
  "运动": "Sports",
  "财经": "Finance",
  "科技": "Technology",
  "时尚": "Fashion",
  "摄影": "Photography",
  "艺术": "Art",
  "文化": "Culture",
  "教育": "Education",
  "科学": "Science",
  "工具": "Tools",
  "社区": "Community",
  "其他": "Others",
}

export default function GuidePage() {
  const { t, lang } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { isFavorite, toggleFavorite } = useFavorites()
  
  // 应用全局设置
  useSettings()

  const filteredSites = sites.filter(site => {
    const matchesSearch = 
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || site.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const groupedSites = categories.reduce((acc, category) => {
    const categorySites = filteredSites.filter(site => site.category === category)
    if (categorySites.length > 0) {
      acc[category] = categorySites
    }
    return acc
  }, {} as Record<string, Site[]>)

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t("网站导航")}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {lang === 'en' ? `Curated ${sites.length}+ quality websites` : `精选 ${sites.length}+ 优质网站，快速访问`}
          </p>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={lang === 'en' ? 'Search websites...' : '搜索网站...'}
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

        {/* Sites Grid */}
        <div className="space-y-8">
          {Object.entries(groupedSites).map(([category, categorySites]) => (
            <section key={category}>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                {lang === 'en' && categoryTranslations[category] ? categoryTranslations[category] : category}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({categorySites.length})
                </span>
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categorySites.map((site) => {
                  const isFav = isFavorite(`website-${site.url}`)
                  
                  return (
                    <SiteCard key={site.url} site={site} isFav={isFav} onToggleFavorite={() => {
                      toggleFavorite({
                        type: 'website',
                        id: site.url,
                        name: site.name,
                        url: site.url,
                        description: site.description,
                        category: site.category,
                      })
                    }} />
                  )
                })}
              </div>
            </section>
          ))}
        </div>

        {filteredSites.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">{lang === 'en' ? 'No matching websites found' : '未找到匹配的网站'}</p>
          </div>
        )}
      </main>
    </div>
  )
}
