const DB_NAME = 'theguide-weather-db'
const DB_VERSION = 1
const STORE_NAME = 'weather-cache'

export interface WeatherCacheData {
  location: string
  data: any
  timestamp: number
}

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'location' })
      }
    }
  })
}

export async function getWeatherCache(location: string): Promise<WeatherCacheData | null> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(location)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const result = request.result as WeatherCacheData | undefined
        resolve(result || null)
      }
    })
  } catch (error) {
    console.error('Failed to get weather cache:', error)
    return null
  }
}

export async function setWeatherCache(location: string, data: any): Promise<void> {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put({
        location,
        data,
        timestamp: Date.now()
      })
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  } catch (error) {
    console.error('Failed to set weather cache:', error)
  }
}

export function isCacheValid(timestamp: number, maxAge: number = 60 * 60 * 1000): boolean {
  // 默认缓存 1 小时
  return Date.now() - timestamp < maxAge
}
