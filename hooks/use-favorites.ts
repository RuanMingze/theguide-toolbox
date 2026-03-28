'use client'

import { useState, useEffect } from 'react'

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

  useEffect(() => {
    const stored = localStorage.getItem('favorites')
    if (stored) {
      try {
        setFavorites(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse favorites:', e)
      }
    }
    setIsLoaded(true)
  }, [])

  const addFavorite = (item: Omit<FavoriteItem, 'id'>) => {
    const newItem: FavoriteItem = {
      ...item,
      id: `${item.type}-${item.url}`,
    }

    setFavorites(prev => {
      const exists = prev.find(f => f.id === newItem.id)
      if (exists) {
        return prev
      }
      const updated = [...prev, newItem]
      localStorage.setItem('favorites', JSON.stringify(updated))
      return updated
    })
  }

  const removeFavorite = (id: string) => {
    setFavorites(prev => {
      const updated = prev.filter(f => f.id !== id)
      localStorage.setItem('favorites', JSON.stringify(updated))
      return updated
    })
  }

  const isFavorite = (id: string) => {
    return favorites.some(f => f.id === id)
  }

  const toggleFavorite = (item: Omit<FavoriteItem, 'id'>) => {
    const id = `${item.type}-${item.url}`
    if (isFavorite(id)) {
      removeFavorite(id)
      return false
    } else {
      addFavorite(item)
      return true
    }
  }

  const getFavoritesByType = (type: 'tool' | 'website') => {
    return favorites.filter(f => f.type === type)
  }

  return {
    favorites,
    isLoaded,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    getFavoritesByType,
  }
}
