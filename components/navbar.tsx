"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Compass, Wrench, Menu, X, LogIn, LogOut, User, ChevronDown, ExternalLink, Heart, Settings, Github, MessageSquare, Mail } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import { useTranslation } from "@/hooks/use-translation"
import type { LoginMethod } from "@/components/auth-provider"
import { createPortal } from "react-dom"

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user, isAuthenticated, isLoading, login, logout } = useAuth()
  const { t } = useTranslation()
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const navItems = [
    { href: "/", label: t("首页"), icon: Home },
    { href: "/guide", label: t("网站导航"), icon: Compass },
    { href: "/tools", label: t("工具箱"), icon: Wrench },
    { href: "/favorites", label: t("我的收藏"), icon: Heart }
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="TheGuide" className="h-9 w-9" />
          <span className="text-xl font-bold text-foreground">TheGuide</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </a>
            )
          })}
        </div>

        {/* Desktop Right Section */}
        <div className="hidden items-center gap-2 md:flex">
          {/* Settings Button */}
          <a
            href="/settings"
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-secondary",
              pathname === "/settings"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
            title={t("设置")}
          >
            <Settings className="h-5 w-5" />
          </a>

          {/* Auth Button */}
          {!isLoading && (
            isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 transition-colors hover:bg-secondary/80"
                >
                  {user?.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.name}
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <User className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium">{user?.name}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setUserMenuOpen(false)}
                    />
                    
                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-popover py-2 shadow-lg z-50">
                      <button
                        onClick={() => {
                          logout()
                          setUserMenuOpen(false)
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-accent"
                      >
                        <LogOut className="h-4 w-4" />
                        {t("退出")}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => setLoginDialogOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <LogIn className="h-4 w-4" />
                {t("登录")}
              </button>
            )
          )}

          {/* Login Dialog */}
          {loginDialogOpen && mounted && createPortal(
            <>
              <div 
                className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
                onClick={() => setLoginDialogOpen(false)}
              />
              <div 
                className="fixed inset-0 z-[101] flex items-center justify-center p-4"
                onClick={() => setLoginDialogOpen(false)}
              >
                <div 
                  className="w-full max-w-md rounded-2xl border border-border bg-popover p-6 shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="mb-6 text-center">
                    <h3 className="text-lg font-semibold text-foreground">选择登录方式</h3>
                    <p className="mt-1 text-sm text-muted-foreground">请选择您要使用的登录方式</p>
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        login('ruanm')
                        setLoginDialogOpen(false)
                      }}
                      className="flex w-full items-center gap-3 rounded-lg border border-border bg-background p-4 transition-colors hover:bg-accent"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-foreground">Ruanm 账号登录</p>
                        <p className="text-xs text-muted-foreground">使用您的 Ruanm 账号快速登录</p>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        login('github')
                        setLoginDialogOpen(false)
                      }}
                      className="flex w-full items-center gap-3 rounded-lg border border-border bg-background p-4 transition-colors hover:bg-accent"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#24292e] text-white dark:bg-[#f0f6fc] dark:text-[#24292e]">
                        <Github className="h-5 w-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-foreground">GitHub 登录</p>
                        <p className="text-xs text-muted-foreground">使用您的 GitHub 账号登录</p>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        login('discord')
                        setLoginDialogOpen(false)
                      }}
                      className="flex w-full items-center gap-3 rounded-lg border border-border bg-background p-4 transition-colors hover:bg-accent"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5865F2] text-white">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-foreground">Discord 登录</p>
                        <p className="text-xs text-muted-foreground">使用您的 Discord 账号登录</p>
                      </div>
                    </button>
                  </div>
                  <button
                    onClick={() => setLoginDialogOpen(false)}
                    className="mt-4 w-full rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    取消
                  </button>
                </div>
              </div>
            </>,
            document.body
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground md:hidden hover:bg-secondary"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
            
            {/* Mobile Auth */}
            {!isLoading && (
              isAuthenticated ? (
                <>
                  <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.name}
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                        <User className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-destructive px-4 py-3 text-sm font-medium text-destructive-foreground"
                  >
                    <LogOut className="h-5 w-5" />
                    退出登录
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setLoginDialogOpen(true)
                    setMobileMenuOpen(false)
                  }}
                  className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground"
                >
                  <LogIn className="h-5 w-5" />
                  登录
                </button>
              )
            )}
          </div>
        </div>
      )}
    </header>
  )
}
