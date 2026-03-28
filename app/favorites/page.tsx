"use client"

import { useState, useMemo } from "react"
import { Navbar } from "@/components/navbar"
import { useFavorites } from "@/hooks/use-favorites"
import { useFavicon, getInitials, getGradientColor } from "@/hooks/use-favicon"
import { useSettings } from "@/hooks/use-settings"
import { Heart, ExternalLink, Trash2, Wrench, Compass, X } from "lucide-react"
import Link from "next/link"

interface FavoriteItem {
  id: string
  type: 'tool' | 'website'
  name: string
  url: string
  description?: string
  category?: string
}

interface WebsiteCardProps {
  fav: FavoriteItem
  onRemove: () => void
}

function WebsiteCard({ fav, onRemove }: WebsiteCardProps) {
  const { src: faviconSrc, error: faviconError, onError: handleFaviconError, onLoad: handleFaviconLoad } = useFavicon({
    url: fav.url,
    name: fav.name,
  })

  return (
    <div className="relative group">
      <a
        href={fav.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
      >
        <div className="mb-3 flex items-start gap-3">
          {faviconError ? (
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded bg-gradient-to-br ${getGradientColor(fav.name)}`}>
              <span className="text-xs font-bold text-white">{getInitials(fav.name)}</span>
            </div>
          ) : (
            <img
              src={faviconSrc}
              alt={fav.name}
              className="h-8 w-8 rounded"
              onError={handleFaviconError}
              onLoad={handleFaviconLoad}
            />
          )}
          <div className="flex-1">
            <h3 className="font-medium text-foreground group-hover:text-primary line-clamp-1">
              {fav.name}
            </h3>
          </div>
        </div>
        {fav.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {fav.description}
          </p>
        )}
      </a>
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onRemove()
        }}
        className="absolute right-2 top-2 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
        title="取消收藏"
      >
        <Trash2 className="h-4 w-4" />
      </button>
      <div className="absolute bottom-2 right-2 rounded-full bg-primary/10 p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
        <ExternalLink className="h-3 w-3 text-primary" />
      </div>
    </div>
  )
}

export default function FavoritesPage() {
  const { favorites, removeFavorite, isLoaded } = useFavorites()
  const [filter, setFilter] = useState<'all' | 'tool' | 'website'>('all')
  
  // 应用全局设置
  useSettings()

  // 使用 useMemo 缓存过滤结果
  const filteredFavorites = useMemo(() => {
    return favorites.filter(fav => {
      if (filter === 'all') return true
      return fav.type === filter
    })
  }, [favorites, filter])

  const toolFavorites = useMemo(() => 
    filteredFavorites.filter(f => f.type === 'tool'),
    [filteredFavorites]
  )
  
  const websiteFavorites = useMemo(() => 
    filteredFavorites.filter(f => f.type === 'website'),
    [filteredFavorites]
  )

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center text-muted-foreground">加载中...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            我的收藏
          </h1>
          <p className="mt-2 text-muted-foreground">
            收藏了 {favorites.length} 个工具和网站
          </p>
        </div>

        {/* Filter */}
        <div className="mb-8 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === 'all'
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            全部 ({favorites.length})
          </button>
          <button
            onClick={() => setFilter('tool')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === 'tool'
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            工具 ({toolFavorites.length})
          </button>
          <button
            onClick={() => setFilter('website')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === 'website'
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            网站 ({websiteFavorites.length})
          </button>
        </div>

        {/* Content */}
        {filteredFavorites.length === 0 ? (
          <div className="py-12 text-center">
            <Heart className="mx-auto mb-4 h-16 w-16 text-muted-foreground/20" />
            <h3 className="text-lg font-medium text-foreground">暂无收藏</h3>
            <p className="mt-2 text-muted-foreground">
              在工具箱或网站导航中点击爱心图标添加收藏
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Link
                href="/tools"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                浏览工具
              </Link>
              <Link
                href="/guide"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                浏览网站
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {(filter === 'all' || filter === 'tool') && toolFavorites.length > 0 && (
              <section>
                <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
                  <Wrench className="h-5 w-5" />
                  收藏的工具
                  <span className="text-sm font-normal text-muted-foreground">
                    ({toolFavorites.length})
                  </span>
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {toolFavorites.map((fav) => (
                    <div key={fav.id} className="relative group">
                      <Link
                        href={fav.url}
                        className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Wrench className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground group-hover:text-primary line-clamp-1">
                            {fav.name}
                          </h3>
                          {fav.category && (
                            <p className="text-xs text-muted-foreground">
                              {fav.category}
                            </p>
                          )}
                          {fav.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {fav.description}
                            </p>
                          )}
                        </div>
                      </Link>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          removeFavorite(fav.id)
                        }}
                        className="absolute right-2 top-2 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
                        title="取消收藏"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {(filter === 'all' || filter === 'website') && websiteFavorites.length > 0 && (
              <section>
                <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
                  <Compass className="h-5 w-5" />
                  收藏的网站
                  <span className="text-sm font-normal text-muted-foreground">
                    ({websiteFavorites.length})
                  </span>
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {websiteFavorites.map((fav) => (
                    <WebsiteCard key={fav.id} fav={fav} onRemove={() => removeFavorite(fav.id)} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
