import withPWAInit from 'next-pwa'

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {},
  // 排除 functions 目录，让 Cloudflare Pages Functions 直接处理
  outputFileTracingExcludes: {
    '*': ['./functions/**/*'],
  },
  // Electron 支持
  output: 'standalone',
}

export default withPWA(nextConfig)
