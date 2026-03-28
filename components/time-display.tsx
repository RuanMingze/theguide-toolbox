'use client'

import { useState, useEffect } from 'react'

export function TimeDisplay() {
  const [time, setTime] = useState<Date | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
    setTime(new Date())
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (!isHydrated) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-card p-8 shadow-sm border border-border">
        <div className="flex items-baseline gap-1 text-6xl font-normal text-foreground sm:text-8xl">
          <span>--</span>
          <span className="text-primary">:</span>
          <span>--</span>
          <span className="text-primary">:</span>
          <span className="text-muted-foreground">--</span>
        </div>
        <p className="mt-4 text-lg text-muted-foreground">加载中...</p>
      </div>
    )
  }

  const hours = time.getHours().toString().padStart(2, "0")
  const minutes = time.getMinutes().toString().padStart(2, "0")
  const seconds = time.getSeconds().toString().padStart(2, "0")
  
  const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
  const dateStr = `${time.getFullYear()}年${time.getMonth() + 1}月${time.getDate()}日 ${weekdays[time.getDay()]}`

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-card p-8 shadow-sm border border-border">
      <div className="flex items-baseline gap-1 text-6xl font-normal text-foreground sm:text-8xl">
        <span>{hours}</span>
        <span className="animate-pulse text-primary">:</span>
        <span>{minutes}</span>
        <span className="animate-pulse text-primary">:</span>
        <span className="text-muted-foreground">{seconds}</span>
      </div>
      <p className="mt-4 text-lg text-muted-foreground">{dateStr}</p>
    </div>
  )
}