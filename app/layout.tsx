import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import Script from 'next/script'
import { AuthProvider } from '@/components/auth-provider'
import { PageProgress } from '@/components/page-progress'
import { ServiceWorkerRegistration } from '@/components/service-worker-registration'
import { LiquidGlassProvider } from '@/components/liquid-glass-provider'
import { Footer } from '@/components/footer'

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: 'TheGuide 工具箱',
  description: '您的一站式效率工具与网站导航平台',
  generator: 'Ruanm',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TheGuide 工具箱',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#f97316',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <LiquidGlassProvider>
            <ServiceWorkerRegistration />
            <PageProgress />
            {children}
            <Footer />
            <Analytics />
            <Script 
              src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js"
              strategy="lazyOnload"
            />
            <Script 
              src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
              strategy="lazyOnload"
            />
            <Script 
              src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.28.4/babel.min.js"
              strategy="lazyOnload"
            />
          </LiquidGlassProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
