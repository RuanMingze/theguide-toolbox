"use client"

import Link from "next/link"
import { ExternalLink, Heart, Mail, MessageSquare } from "lucide-react"
import { useLiquidGlass } from "@/components/liquid-glass-provider"
import dynamic from "next/dynamic"

export function Footer() {
  const { settings, mouseContainerRef, mounted } = useLiquidGlass()

  const footerContent = (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center gap-4">
        {/* Copyright and Brand */}
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="TheGuide" className="h-6 w-6" />
          <span className="text-sm font-semibold text-foreground">TheGuide 工具箱</span>
        </div>

        {/* Copyright Text */}
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Ruanm. All rights reserved.
        </p>

        {/* Contact Links */}
        <div className="flex items-center gap-4">
          {/* Email Contact */}
          <a
            href="mailto:support@ruanmgjx.dpdns.org"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            title="发送邮件至 support@ruanmgjx.dpdns.org"
          >
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">support@ruanmgjx.dpdns.org</span>
            <span className="sm:hidden">Email</span>
          </a>

          {/* Divider */}
          <div className="h-4 w-px bg-border" />

          {/* Discord Community */}
          <Link
            href="https://discord.gg/MNvQFkmwCE"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            title="加入 Discord 社区"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Discord 社区</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        {/* Made with Love */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Made with</span>
          <Heart className="h-3 w-3 fill-red-500 text-red-500" />
          <span>by Ruanm</span>
        </div>
      </div>
    </div>
  )

  if (settings.enabled && mounted) {
    return (
      <footer className="w-full border-t-0">
        {footerContent}
      </footer>
    )
  }

  return (
    <footer className="w-full border-t border-border bg-background/80 backdrop-blur-xl">
      {footerContent}
    </footer>
  )
}
