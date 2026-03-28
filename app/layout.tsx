import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import Script from 'next/script'
import { AuthProvider } from '@/components/auth-provider'
import { PageProgress } from '@/components/page-progress'

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: 'TheGuide 工具箱',
  description: '您的一站式效率工具与网站导航平台',
  generator: 'Ruanm',
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.png',
  },
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
          <PageProgress />
          {children}
          <Analytics />
          <Script 
            src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js"
            strategy="lazyOnload"
          />
          <Script 
            src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
            strategy="lazyOnload"
          />
        </AuthProvider>
      </body>
    </html>
  )
}
