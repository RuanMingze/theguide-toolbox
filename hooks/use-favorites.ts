'use client'

import { useState, useEffect, useCallback } from 'react'

interface FavoriteItem {
  id: string
  type: 'tool' | 'website'
  name: string
  url: string
  description?: string
  icon?: string
  category?: string
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [counter, setCounter] = useState(0)

  // 从 localStorage 加载收藏
  useEffect(() => {
    const stored = localStorage.getItem('favorites')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setFavorites(parsed)
      } catch (e) {
        console.error('Failed to parse favorites:', e)
      }
    }
    setIsLoaded(true)
  }, [])

  // 检查是否已收藏 - 使用 useCallback 确保总是使用最新的 favorites
  const isFavorite = useCallback((id: string) => {
    return favorites.some(f => f.id === id)
  }, [favorites])

  // 添加收藏
  const addFavorite = useCallback((item: Omit<FavoriteItem, 'id'>) => {
    const newItem: FavoriteItem = {
      ...item,
      id: `${item.type}-${item.url}`,
    }

    setFavorites(prev => {
      // 检查是否已存在
      const exists = prev.find(f => f.id === newItem.id)
      if (exists) {
        console.log('收藏已存在:', newItem.id)
        return prev
      }
      
      const updated = [...prev, newItem]
      localStorage.setItem('favorites', JSON.stringify(updated))
      console.log('添加收藏:', newItem.id, '总数:', updated.length)
      return updated
    })
    
    // 强制触发重新渲染
    setCounter(c => c + 1)
  }, [])

  // 移除收藏
  const removeFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const updated = prev.filter(f => f.id !== id)
      localStorage.setItem('favorites', JSON.stringify(updated))
      console.log('移除收藏:', id, '总数:', updated.length)
      return updated
    })
    
    // 强制触发重新渲染
    setCounter(c => c + 1)
  }, [])

  // 切换收藏状态
  const toggleFavorite = useCallback((item: Omit<FavoriteItem, 'id'>) => {
    const id = `${item.type}-${item.url}`
    const currentlyFavorite = favorites.some(f => f.id === id)
    
    console.log('切换收藏:', id, '当前状态:', currentlyFavorite ? '已收藏' : '未收藏')
    
    if (currentlyFavorite) {
      removeFavorite(id)
    } else {
      addFavorite(item)
    }
  }, [favorites, addFavorite, removeFavorite])

  // 获取指定类型的收藏
  const getFavoritesByType = useCallback((type: 'tool' | 'website') => {
    return favorites.filter(f => f.type === type)
  }, [favorites])

  // 获取所有收藏
  const getAllFavorites = useCallback(() => {
    return favorites
  }, [favorites])

  return {
    favorites: favorites,
    isLoaded,
    counter, // 暴露 counter 用于调试
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    getFavoritesByType,
    getAllFavorites,
  }
}
