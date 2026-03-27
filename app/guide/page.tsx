"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Search, ExternalLink } from "lucide-react"

interface Site {
  name: string
  url: string
  description: string
  category: string
}

const sites: Site[] = [
  // 开发工具
  { name: "Vercel", url: "https://vercel.com", description: "静态网站托管与部署平台", category: "开发工具" },
  { name: "V0", url: "https://v0.dev", description: "AI驱动的前端开发助手", category: "开发工具" },
  { name: "GitHub", url: "https://github.com", description: "全球最大的代码托管平台", category: "开发工具" },
  { name: "GitLab", url: "https://gitlab.com", description: "DevOps生命周期工具", category: "开发工具" },
  { name: "Netlify", url: "https://netlify.com", description: "现代化Web项目自动化平台", category: "开发工具" },
  { name: "Railway", url: "https://railway.app", description: "快速部署应用的云平台", category: "开发工具" },
  { name: "Render", url: "https://render.com", description: "统一云平台构建部署", category: "开发工具" },
  { name: "Supabase", url: "https://supabase.com", description: "开源Firebase替代方案", category: "开发工具" },
  { name: "PlanetScale", url: "https://planetscale.com", description: "MySQL兼容的无服务器数据库", category: "开发工具" },
  { name: "Neon", url: "https://neon.tech", description: "无服务器PostgreSQL数据库", category: "开发工具" },
  
  // 域名与CDN
  { name: "Cloudflare", url: "https://cloudflare.com", description: "域名、CDN与安全服务", category: "域名与CDN" },
  { name: "Namecheap", url: "https://namecheap.com", description: "域名注册与网络服务", category: "域名与CDN" },
  { name: "GoDaddy", url: "https://godaddy.com", description: "全球领先的域名注册商", category: "域名与CDN" },
  { name: "DNSPod", url: "https://dnspod.cn", description: "智能DNS解析服务", category: "域名与CDN" },
  { name: "阿里云", url: "https://aliyun.com", description: "云计算与域名服务", category: "域名与CDN" },
  { name: "腾讯云", url: "https://cloud.tencent.com", description: "全球云服务提供商", category: "域名与CDN" },
  
  // 设计资源
  { name: "Figma", url: "https://figma.com", description: "协作设计工具", category: "设计资源" },
  { name: "Dribbble", url: "https://dribbble.com", description: "设计师作品展示社区", category: "设计资源" },
  { name: "Behance", url: "https://behance.net", description: "创意作品展示平台", category: "设计资源" },
  { name: "Unsplash", url: "https://unsplash.com", description: "免费高清图片素材库", category: "设计资源" },
  { name: "Pexels", url: "https://pexels.com", description: "免费图片与视频素材", category: "设计资源" },
  { name: "Iconfont", url: "https://iconfont.cn", description: "阿里巴巴矢量图标库", category: "设计资源" },
  { name: "Iconify", url: "https://iconify.design", description: "统一图标框架", category: "设计资源" },
  { name: "Lucide", url: "https://lucide.dev", description: "精美开源图标库", category: "设计资源" },
  { name: "Coolors", url: "https://coolors.co", description: "配色方案生成器", category: "设计资源" },
  { name: "Color Hunt", url: "https://colorhunt.co", description: "色彩搭配灵感", category: "设计资源" },
  
  // 前端框架
  { name: "Next.js", url: "https://nextjs.org", description: "React全栈框架", category: "前端框架" },
  { name: "React", url: "https://react.dev", description: "用于构建用户界面的库", category: "前端框架" },
  { name: "Vue.js", url: "https://vuejs.org", description: "渐进式JavaScript框架", category: "前端框架" },
  { name: "Nuxt", url: "https://nuxt.com", description: "Vue全栈框架", category: "前端框架" },
  { name: "Svelte", url: "https://svelte.dev", description: "编译时前端框架", category: "前端框架" },
  { name: "Astro", url: "https://astro.build", description: "内容驱动网站框架", category: "前端框架" },
  { name: "Remix", url: "https://remix.run", description: "全栈Web框架", category: "前端框架" },
  { name: "Tailwind CSS", url: "https://tailwindcss.com", description: "实用优先的CSS框架", category: "前端框架" },
  { name: "shadcn/ui", url: "https://ui.shadcn.com", description: "可复用组件集合", category: "前端框架" },
  { name: "Radix UI", url: "https://radix-ui.com", description: "无样式组件库", category: "前端框架" },
  
  // AI工具
  { name: "ChatGPT", url: "https://chat.openai.com", description: "OpenAI对话AI", category: "AI工具" },
  { name: "Claude", url: "https://claude.ai", description: "Anthropic AI助手", category: "AI工具" },
  { name: "Midjourney", url: "https://midjourney.com", description: "AI图像生成工具", category: "AI工具" },
  { name: "Stable Diffusion", url: "https://stability.ai", description: "开源AI图像生成", category: "AI工具" },
  { name: "Cursor", url: "https://cursor.sh", description: "AI驱动的代码编辑器", category: "AI工具" },
  { name: "GitHub Copilot", url: "https://github.com/features/copilot", description: "AI编程助手", category: "AI工具" },
  { name: "Perplexity", url: "https://perplexity.ai", description: "AI搜索引擎", category: "AI工具" },
  { name: "Notion AI", url: "https://notion.so", description: "AI增强的笔记工具", category: "AI工具" },
  
  // 效率工具
  { name: "Notion", url: "https://notion.so", description: "全能型协作工作空间", category: "效率工具" },
  { name: "Obsidian", url: "https://obsidian.md", description: "本地知识库笔记软件", category: "效率工具" },
  { name: "Todoist", url: "https://todoist.com", description: "任务管理工具", category: "效率工具" },
  { name: "Linear", url: "https://linear.app", description: "现代化项目管理工具", category: "效率工具" },
  { name: "Slack", url: "https://slack.com", description: "团队协作沟通平台", category: "效率工具" },
  { name: "Discord", url: "https://discord.com", description: "社区聊天与语音平台", category: "效率工具" },
  { name: "Lark", url: "https://larksuite.com", description: "字节跳动协作套件", category: "效率工具" },
  { name: "飞书", url: "https://feishu.cn", description: "企业协作平台", category: "效率工具" },
  
  // 学习资源
  { name: "MDN Web Docs", url: "https://developer.mozilla.org", description: "Web技术权威文档", category: "学习资源" },
  { name: "Stack Overflow", url: "https://stackoverflow.com", description: "程序员问答社区", category: "学习资源" },
  { name: "掘金", url: "https://juejin.cn", description: "开发者社区", category: "学习资源" },
  { name: "SegmentFault", url: "https://segmentfault.com", description: "技术问答社区", category: "学习资源" },
  { name: "freeCodeCamp", url: "https://freecodecamp.org", description: "免费编程学习平台", category: "学习资源" },
  { name: "Codecademy", url: "https://codecademy.com", description: "交互式编程学习", category: "学习资源" },
  { name: "LeetCode", url: "https://leetcode.com", description: "算法题库与面试准备", category: "学习资源" },
  { name: "力扣", url: "https://leetcode.cn", description: "算法刷题平台中国站", category: "学习资源" },
]

const categories = Array.from(new Set(sites.map(site => site.category)))

export default function GuidePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

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
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            网站导航
          </h1>
          <p className="mt-2 text-muted-foreground">
            精选 {sites.length}+ 优质网站，助您快速访问
          </p>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="搜索网站..."
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
              全部
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
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Sites Grid */}
        <div className="space-y-8">
          {Object.entries(groupedSites).map(([category, categorySites]) => (
            <section key={category}>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                {category}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({categorySites.length})
                </span>
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categorySites.map((site) => (
                  <a
                    key={site.name}
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-lg font-bold text-foreground">
                          {site.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground group-hover:text-primary">
                            {site.name}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {site.description}
                          </p>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>

        {filteredSites.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">未找到匹配的网站</p>
          </div>
        )}
      </main>
    </div>
  )
}
