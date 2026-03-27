"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  Wind,
  Droplets,
  Thermometer,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Compass,
  Wrench,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

// 时间组件
function TimeDisplay() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

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

// 日历组件
function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const today = new Date()

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const days = []
  for (let i = 0; i < firstDayWeekday; i++) {
    days.push(<div key={`empty-${i}`} className="h-8 w-8" />)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = 
      day === today.getDate() && 
      month === today.getMonth() && 
      year === today.getFullYear()
    
    days.push(
      <div
        key={day}
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors ${
          isToday
            ? "bg-primary font-semibold text-primary-foreground"
            : "text-foreground hover:bg-secondary"
        }`}
      >
        {day}
      </div>
    )
  }

  const monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
  const weekdayNames = ["日", "一", "二", "三", "四", "五", "六"]

  return (
    <div className="rounded-2xl bg-card p-6 shadow-sm border border-border">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          {year}年 {monthNames[month]}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={prevMonth}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextMonth}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mb-2 grid grid-cols-7 gap-1">
        {weekdayNames.map((day) => (
          <div key={day} className="flex h-8 w-8 items-center justify-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">{days}</div>
    </div>
  )
}

// 天气组件
function Weather() {
  const [isMounted, setIsMounted] = useState(false)
  const [location, setLocation] = useState<string | null>(null)
  const [weather, setWeather] = useState({
    temp: 22,
    condition: "晴",
    humidity: 65,
    wind: 12,
    location: "加载中...",
    high: 26,
    low: 18,
    forecast: [
      { day: "明天", temp: 24, condition: "多云" },
      { day: "后天", temp: 21, condition: "小雨" },
      { day: "周四", temp: 19, condition: "阴" },
    ],
    loading: true,
    error: null
  })

  useEffect(() => {
    setIsMounted(true)
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation(`${latitude},${longitude}`)
        },
        (error) => {
          console.error("Geolocation error:", error)
          setLocation("Beijing")
        }
      )
    } else {
      setLocation("Beijing")
    }
  }, [])

  useEffect(() => {
    if (!location) return
    
    const fetchWeather = async () => {
      try {
        const res = await fetch(`/api/weather?location=${encodeURIComponent(location)}`)
        if (!res.ok) {
          throw new Error("Failed to fetch weather data")
        }

        const data = await res.json()

        const weatherConditionMap: Record<string, string> = {
          Clear: "晴",
          Clouds: "多云",
          Rain: "小雨",
          Drizzle: "小雨",
          Thunderstorm: "雷暴",
          Snow: "雪",
          Mist: "雾",
          Fog: "雾"
        }

        const condition = weatherConditionMap[data.current.weather] || "多云"

        const forecast = data.forecast.slice(0, 3).map((item: any, index: number) => {
          const days = ["今天", "明天", "后天", "大后天", "第五天"]
          return {
            day: days[index] || "未知",
            temp: item.temp,
            condition: weatherConditionMap[item.weather] || "多云"
          }
        })

        setWeather({
          temp: data.current.temp,
          condition,
          humidity: data.current.humidity,
          wind: data.current.wind,
          location: data.location,
          high: data.current.high,
          low: data.current.low,
          forecast,
          loading: false,
          error: null
        })
      } catch (error) {
        console.error("Weather fetch error:", error)
        setWeather(prev => ({
          ...prev,
          loading: false,
          error: "天气数据加载失败"
        }))
      }
    }

    fetchWeather()
  }, [location])

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "晴": return <Sun className="h-12 w-12 text-amber-400" />
      case "多云": return <Cloud className="h-12 w-12 text-gray-400" />
      case "小雨": return <CloudRain className="h-12 w-12 text-blue-400" />
      case "雪": return <CloudSnow className="h-12 w-12 text-blue-200" />
      default: return <Cloud className="h-12 w-12 text-gray-400" />
    }
  }

  const getSmallWeatherIcon = (condition: string) => {
    switch (condition) {
      case "晴": return <Sun className="h-5 w-5 text-amber-400" />
      case "多云": return <Cloud className="h-5 w-5 text-gray-400" />
      case "小雨": return <CloudRain className="h-5 w-5 text-blue-400" />
      case "雪": return <CloudSnow className="h-5 w-5 text-blue-200" />
      default: return <Cloud className="h-5 w-5 text-gray-400" />
    }
  }

  if (!isMounted || !location) {
    return (
      <div className="rounded-2xl bg-card p-6 shadow-sm border border-border">
        <div className="text-center text-muted-foreground">正在获取位置...</div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-card p-6 shadow-sm border border-border">
      <div className="mb-4 flex items-center gap-2 text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <span className="text-sm">{weather.location}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {getWeatherIcon(weather.condition)}
          <div>
            <div className="text-4xl font-light text-foreground">{weather.temp}°</div>
            <div className="text-sm text-muted-foreground">{weather.condition}</div>
          </div>
        </div>
        <div className="text-right text-sm text-muted-foreground">
          <div>最高 {weather.high}°</div>
          <div>最低 {weather.low}°</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <Droplets className="h-4 w-4 text-blue-400" />
          <div>
            <div className="text-xs text-muted-foreground">湿度</div>
            <div className="text-sm font-medium text-foreground">{weather.humidity}%</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="h-4 w-4 text-accent" />
          <div>
            <div className="text-xs text-muted-foreground">风速</div>
            <div className="text-sm font-medium text-foreground">{weather.wind} km/h</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Thermometer className="h-4 w-4 text-red-400" />
          <div>
            <div className="text-xs text-muted-foreground">体感</div>
            <div className="text-sm font-medium text-foreground">{weather.temp + 1}°</div>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-border pt-4">
        <h4 className="mb-3 text-sm font-medium text-foreground">未来天气</h4>
        <div className="flex justify-between">
          {weather.forecast.map((day, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              <span className="text-xs text-muted-foreground">{day.day}</span>
              {getSmallWeatherIcon(day.condition)}
              <span className="text-sm font-medium text-foreground">{day.temp}°</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// 快捷入口卡片
function QuickAccessCard({ 
  href, 
  icon: Icon, 
  title, 
  description, 
  gradient 
}: { 
  href: string
  icon: React.ElementType
  title: string
  description: string
  gradient: string
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl bg-card p-6 shadow-sm border border-border transition-all hover:shadow-md hover:border-primary/50"
    >
      <div className={`absolute inset-0 opacity-5 ${gradient}`} />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${gradient}`}>
            <Icon className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
      </div>
    </Link>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            欢迎使用 <span className="text-primary">TheGuide</span> 工具箱
          </h1>
          <p className="mt-2 text-muted-foreground">
            您的一站式效率工具与网站导航平台
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Time Display - Full Width on Mobile, 2 cols on Desktop */}
          <div className="lg:col-span-2">
            <TimeDisplay />
          </div>

          {/* Calendar */}
          <div className="lg:row-span-2">
            <Calendar />
          </div>

          {/* Weather */}
          <div className="lg:col-span-2">
            <Weather />
          </div>
        </div>

        {/* Quick Access */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <QuickAccessCard
            href="/guide"
            icon={Compass}
            title="网站导航"
            description="精选50+优质网站，快速访问"
            gradient="bg-primary"
          />
          <QuickAccessCard
            href="/tools"
            icon={Wrench}
            title="实用工具"
            description="30+在线工具，提升效率"
            gradient="bg-accent"
          />
        </div>
      </main>
    </div>
  )
}
