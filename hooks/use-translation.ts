'use client'

import { useState, useEffect, useCallback } from 'react'
import { getTranslation, translatableTexts } from '@/lib/translations'

// 检测用户语言
function detectUserLanguage(): string {
  if (typeof navigator === 'undefined') {
    return 'zh'
  }
  
  const browserLang = navigator.language || (navigator as any).userLanguage
  
  // 检查是否包含中文
  if (browserLang.toLowerCase().includes('zh') || 
      browserLang.toLowerCase().includes('cn') ||
      browserLang.toLowerCase().includes('tw') ||
      browserLang.toLowerCase().includes('hk')) {
    return 'zh'
  }
  
  // 其他语言默认使用英文
  return 'en'
}

// 从 Cookie 读取语言
function getLanguageFromCookie(): string {
  if (typeof document === 'undefined') {
    return 'zh'
  }
  
  const cookies = document.cookie.split(';').map(cookie => cookie.trim())
  const langCookie = cookies.find(cookie => cookie.startsWith('user-language='))
  
  if (langCookie) {
    return langCookie.split('=')[1]
  }
  
  return 'zh'
}

// 设置语言 Cookie
function setLanguageCookie(lang: string): void {
  if (typeof document === 'undefined') {
    return
  }
  
  const maxAge = 30 * 24 * 60 * 60 // 30 天
  document.cookie = `user-language=${lang}; path=/; max-age=${maxAge}`
  localStorage.setItem('user-language', lang)
}

export function useTranslation() {
  const [lang, setLang] = useState<string>('zh')
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  // 初始化：从 Cookie 读取语言，如果没有则检测浏览器语言
  useEffect(() => {
    let lang = getLanguageFromCookie()
    
    // 如果没有 Cookie，检测浏览器语言
    if (lang === 'zh' && !document.cookie.includes('user-language=')) {
      lang = detectUserLanguage()
      setLanguageCookie(lang)
    }
    
    setLang(lang)
  }, [])

  // 加载预设翻译
  useEffect(() => {
    if (lang === 'zh') {
      setTranslations({})
      setLoading(false)
      return
    }

    setLoading(true)
    
    // 使用预设翻译，不需要异步加载
    const translationMap: Record<string, string> = {}
    translatableTexts.forEach(text => {
      translationMap[text] = getTranslation(text, lang)
    })
    
    setTranslations(translationMap)
    setLoading(false)
  }, [lang])

  // 翻译单个文本
  const t = useCallback((text: string): string => {
    if (lang === 'zh' || !text) {
      return text
    }
    return translations[text] || text
  }, [lang, translations])

  // 切换语言
  const setLanguage = useCallback((newLang: string) => {
    setLang(newLang)
    setLanguageCookie(newLang)
  }, [])

  return {
    lang,
    t,
    setLanguage,
    loading,
    isRTL: false, // 是否从右到左（阿拉伯语等需要）
  }
}
