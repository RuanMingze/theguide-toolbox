'use client'

// IndexedDB 配置
const DB_NAME = 'favicon-cache'
const DB_VERSION = 1
const STORE_NAME = 'favicons'

// 初始化 IndexedDB
function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'url' })
      }
    }
  })
}

// 缓存 favicon 数据
export async function cacheFavicon(url: string, data: Blob): Promise<void> {
  try {
    const db = await initDB()
    
    // 先转换数据，再创建事务，避免事务超时
    const arrayBuffer = await data.arrayBuffer()
    
    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        
        const request = store.put({
          url,
          data: arrayBuffer,
          type: data.type,
          timestamp: Date.now(),
        })
        
        request.onsuccess = () => {
          db.close()
          resolve()
        }
        
        request.onerror = () => {
          db.close()
          reject(request.error)
        }
      } catch (error) {
        db.close()
        reject(error)
      }
    })
  } catch (error) {
    console.error('Failed to cache favicon:', error)
  }
}

// 从缓存获取 favicon
export async function getCachedFavicon(url: string): Promise<string | null> {
  try {
    const db = await initDB()
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    
    const request = store.get(url)
    
    const result = await new Promise<any>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    
    db.close()
    
    if (result && result.data) {
      // 检查缓存是否过期（7 天）
      const sevenDays = 7 * 24 * 60 * 60 * 1000
      if (Date.now() - result.timestamp < sevenDays) {
        const blob = new Blob([result.data], { type: result.type })
        return URL.createObjectURL(blob)
      }
    }
    
    return null
  } catch (error) {
    console.error('Failed to get cached favicon:', error)
    return null
  }
}

// 清除过期缓存
export async function clearExpiredCache(): Promise<void> {
  try {
    const db = await initDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    
    const sevenDays = 7 * 24 * 60 * 60 * 1000
    const now = Date.now()
    
    const request = store.openCursor()
    
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result
      if (cursor) {
        const value = cursor.value as { url: string; timestamp: number }
        if (now - value.timestamp > sevenDays) {
          cursor.delete()
        }
        cursor.continue()
      }
    }
    
    await new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve(true)
      transaction.onerror = () => reject(transaction.error)
    })
    
    db.close()
  } catch (error) {
    console.error('Failed to clear expired cache:', error)
  }
}

// 清除所有缓存
export async function clearAllCache(): Promise<void> {
  try {
    const db = await initDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    store.clear()
    
    await new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve(true)
      transaction.onerror = () => reject(transaction.error)
    })
    
    db.close()
  } catch (error) {
    console.error('Failed to clear all cache:', error)
  }
}
