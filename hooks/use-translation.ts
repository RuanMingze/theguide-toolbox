'use client'

import { useState, useEffect, useCallback } from 'react'
import { getTranslation, translatableTexts } from '@/lib/translations'
import { initLanguage, setLanguageCookie } from '@/proxy'

export function useTranslation() {
  const [lang, setLang] = useState<string>('zh')
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  // 初始化：从 Cookie 读取语言
  useEffect(() => {
    const lang = initLanguage()
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
