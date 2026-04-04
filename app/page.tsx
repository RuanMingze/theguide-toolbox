"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/components/auth-provider"
import { useSettings } from "@/hooks/use-settings"
import { useTranslation } from "@/hooks/use-translation"
import { TimeDisplay } from "@/components/time-display"
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
  ArrowRight,
  User,
  Heart,
  X
} from "lucide-react"
import Link from "next/link"
import { festivalTranslations } from "@/lib/translations"

// 中文节日数据库
const chineseFestivals: Record<string, { name: string; description: string }> = {
  // 公历节日
  "0-1": { name: "元旦", description: "元旦，即公历的 1 月 1 日，是世界多数国家通称的'新年'。元，谓'始'，凡数之始称为'元'；旦，谓'日'；'元旦'即'初始之日'的意思。" },
  "2-8": { name: "国际妇女节", description: "三八国际妇女节，全称'联合国妇女权益和国际和平日'，是为庆祝妇女在经济、政治和社会等领域做出的重要贡献和取得的巨大成就而设立的节日。" },
  "2-12": { name: "植树节", description: "植树节是按照法律规定宣传保护树木，并组织动员群众积极参加以植树造林为活动内容的节日。按时间长短可分为植树日、植树周和植树月，共称为国际植树节。" },
  "4-4": { name: "清明节", description: "清明节，又称踏青节、行清节、三月节、祭祖节等，节期在仲春与暮春之交。清明节源自上古时代的祖先信仰与春祭礼俗，兼具自然与人文两大内涵。" },
  "4-5": { name: "清明节", description: "清明节，又称踏青节、行清节、三月节、祭祖节等，节期在仲春与暮春之交。清明节源自上古时代的祖先信仰与春祭礼俗，兼具自然与人文两大内涵。" },
  "5-1": { name: "国际劳动节", description: "五一国际劳动节，是世界上 80 多个国家的全国性节日，定在每年的五月一日。它是全世界劳动人民共同拥有的节日，也是世界上大多数国家的劳动节。" },
  "5-4": { name: "青年节", description: "五四青年节源于中国 1919 年反帝爱国的'五四运动'，五四爱国运动是一次彻底的反对帝国主义和封建主义的爱国运动，也是中国新民主主义革命的开始。" },
  "5-12": { name: "国际护士节", description: "国际护士节是每年的 5 月 12 日，是为纪念现代护理学科的创始人弗洛伦斯·南丁格尔于 1912 年设立的节日。其基本宗旨是倡导、继承和弘扬南丁格尔不畏艰险、甘于奉献、救死扶伤、勇于献身的人道主义精神。" },
  "6-1": { name: "儿童节", description: "六一国际儿童节，又称儿童节，International Children's Day，是为了保障世界各国儿童的生存权、保健权和受教育权，抚养权，为了改善儿童的生活，为了反对虐杀儿童和毒害儿童而设立的节日。" },
  "7-1": { name: "建党节", description: "七一建党节，是中国共产党为纪念自己成立于 1921 年 7 月而设立的节日。1941 年，中共中央确定将 7 月 1 日作为中国共产党建党日。" },
  "8-1": { name: "建军节", description: "八一建军节，是中国人民解放军建军纪念日，每年的八月一日举行，由中国人民革命军事委员会设立，为纪念中国工农红军成立的节日。" },
  "9-10": { name: "教师节", description: "教师节，旨在肯定教师为教育事业所做的贡献。在中国近现代史上有多个日期曾作为教师节。其中 1985 年举行的六届全国人大常委会第九次会议同意了国务院关于建立教师节的议案，决定 1985 年的 9 月 10 日为第一个教师节。" },
  "10-1": { name: "国庆节", description: "国庆节是由一个国家制定的用来纪念国家本身的法定假日。中国国庆节特指中华人民共和国正式成立的纪念日 10 月 1 日。" },
  "11-25": { name: "国际消除对妇女的暴力日", description: "国际消除对妇女的暴力日，又被称作'国际反家庭暴力日'，日期为每年 11 月 25 日，由联合国于 1999 年设立。" },
  "12-25": { name: "圣诞节", description: "圣诞节又称耶诞节，译名为'基督弥撒'，西方传统节日，在每年 12 月 25 日。弥撒是教会的一种礼拜仪式。圣诞节是一个宗教节，因为把它当作耶稣的诞辰来庆祝，故名'耶诞节'。" },
}

// 中文农历节日
const chineseLunarFestivals: Record<string, { name: string; description: string }> = {
  "1-1": { name: "春节", description: "春节，即农历新年，是一年之岁首、传统意义上的年节。俗称新春、新年、新岁、岁旦、年禧、大年等，口头上又称度岁、庆岁、过年、过大年。春节历史悠久，由上古时代岁首祈年祭祀演变而来。" },
  "1-15": { name: "元宵节", description: "元宵节，又称上元节、小正月、元夕或灯节，为每年农历正月十五日，是中国春节年俗中最后一个重要节令。元宵节是中国与汉字文化圈地区以及海外华人的传统节日之一。" },
  "5-5": { name: "端午节", description: "端午节，又称端阳节、龙舟节、重午节、龙节、正阳节、天中节等，节期在农历五月初五，是中国民间的传统节日。端午节源自天象崇拜，由上古时代祭龙演变而来。" },
  "7-7": { name: "七夕节", description: "七夕节，又名乞巧节、七巧节、七姐诞、七娘生、七娘会、七姐节、牛公牛婆日等别称，发源于西汉，东亚的一个传统节日，日期是农历七月初七。" },
  "8-15": { name: "中秋节", description: "中秋节，又称月夕、秋节、仲秋节、八月节、八月会、追月节、玩月节、拜月节、女儿节或团圆节，是流行于中国众多民族与东亚诸国中的传统文化节日，时在农历八月十五。" },
  "9-9": { name: "重阳节", description: "重阳节，为每年的农历九月初九日，是中华民族的传统节日。《易经》中把'九'定为阳数，九月九日，两九相重，故曰'重阳'；因日与月皆逢九，故又称为'重九'。" },
  "12-8": { name: "腊八节", description: "腊八节，即每年农历十二月初八，又称为'法宝节''佛成道节''成道会'等。本为佛教纪念释迦牟尼佛成道之节日，后逐渐也成为民间节日。" },
  "12-30": { name: "除夕", description: "除夕，为岁末的最后一天夜晚。岁末的最后一天称为'岁除'，意为旧岁至此而除，另换新岁。除，即去除之意；夕，指夜晚。'除夕'是岁除之夜的意思，又称大年夜、除夕夜、除夜等，时值年尾的最后一个晚上。" },
}

// 简单的农历转换（近似算法）
function getLunarDate(date: Date): { month: number; day: number } {
  // 这里使用一个简化的农历计算
  // 实际项目中应该使用更精确的农历库
  const baseDate = new Date(1900, 0, 31) // 1900 年 1 月 31 日是农历正月初一
  const diff = date.getTime() - baseDate.getTime()
  const lunarDays = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  // 简化处理，只计算月和日
  let remainingDays = lunarDays
  let year = 1900
  let month = 1
  let day = 1
  
  while (remainingDays > 0) {
    const daysInYear = getLunarDaysInYear(year)
    if (remainingDays >= daysInYear) {
      remainingDays -= daysInYear
      year++
    } else {
      break
    }
  }
  
  while (remainingDays > 0) {
    const daysInMonth = getLunarDaysInMonth(year, month)
    if (remainingDays >= daysInMonth) {
      remainingDays -= daysInMonth
      month++
    } else {
      day = remainingDays + 1
      break
    }
  }
  
  return { month, day }
}

function getLunarDaysInYear(year: number): number {
  // 简化：农历一年大约 354 或 384 天（闰年）
  return 354 + (year % 3 === 0 ? 30 : 0)
}

function getLunarDaysInMonth(year: number, month: number): number {
  // 简化：农历月份 29 或 30 天
  return 29 + ((year + month) % 2)
}

// 日历组件
function Calendar({ lang }: { lang: string }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [hoveredDay, setHoveredDay] = useState<number | null>(null)
  const today = new Date()

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const getFestival = (day: number) => {
    const solarKey = `${month}-${day}`
    const date = new Date(year, month, day)
    const lunar = getLunarDate(date)
    const lunarKey = `lunar-${lunar.month}-${lunar.day}`
    
    // 根据语言选择节日数据库
    if (lang === 'en') {
      // 使用英文翻译
      if (festivalTranslations[solarKey]) {
        return festivalTranslations[solarKey]
      }
      if (festivalTranslations[lunarKey]) {
        return festivalTranslations[lunarKey]
      }
    } else {
      // 使用中文
      if (chineseFestivals[solarKey]) {
        return chineseFestivals[solarKey]
      }
      if (chineseLunarFestivals[lunarKey]) {
        return chineseLunarFestivals[lunarKey]
      }
    }
    
    return null
  }

  const days = []
  for (let i = 0; i < firstDayWeekday; i++) {
    days.push(<div key={`empty-${i}`} className="h-8 w-8" />)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = 
      day === today.getDate() && 
      month === today.getMonth() && 
      year === today.getFullYear()
    
    const festival = getFestival(day)
    const isHovered = hoveredDay === day
    
    days.push(
      <div
        key={day}
        onMouseEnter={() => setHoveredDay(day)}
        onMouseLeave={() => setHoveredDay(null)}
        className={`relative flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors cursor-pointer ${
          isToday
            ? "bg-primary font-semibold text-primary-foreground"
            : "text-foreground hover:bg-secondary"
        } ${isHovered ? "bg-secondary ring-2 ring-primary" : ""}`}
      >
        {day}
        {festival && !isHovered && (
          <div className="absolute top-0 right-0 h-2 w-2 translate-x-1/4 -translate-y-1/4 rounded-full bg-primary" />
        )}
      </div>
    )
  }

  const monthNames = lang === 'en' 
    ? ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    : ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
  const weekdayNames = lang === 'en'
    ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    : ["日", "一", "二", "三", "四", "五", "六"]

  const hoveredFestival = hoveredDay ? getFestival(hoveredDay) : null

  return (
    <div className="rounded-2xl bg-card p-6 shadow-sm border border-border">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          {year}{lang === 'en' ? ', ' : '年'}{monthNames[month]}
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
      {hoveredFestival && (
        <div className="mt-4 rounded-lg bg-secondary p-4">
          <h4 className="font-semibold text-primary">{hoveredFestival.name}</h4>
          <p className="mt-1 text-sm text-muted-foreground">{hoveredFestival.description}</p>
        </div>
      )}
    </div>
  )
}

// 天气组件
function Weather({ lang }: { lang: string }) {
  const [isMounted, setIsMounted] = useState(false)
  const [location, setLocation] = useState<string | null>(null)
  const [weatherLang, setWeatherLang] = useState(lang)
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
    error: null as string | null
  })

  useEffect(() => {
    // 从 Cookie 读取语言设置
    const cookieLang = document.cookie
      .split('; ')
      .find(row => row.startsWith('NEXT_LOCALE='))
      ?.split('=')[1]
    if (cookieLang) {
      setWeatherLang(cookieLang)
    }
  }, [])

  useEffect(() => {
    setIsMounted(true)
    
    // 设置超时，防止地理位置获取卡住
    const timeoutId = setTimeout(() => {
      console.warn("Geolocation timeout, using default location")
      setLocation("Deqing")
    }, 5000) // 5 秒超时
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId)
          const { latitude, longitude } = position.coords
          setLocation(`${latitude},${longitude}`)
        },
        (error) => {
          clearTimeout(timeoutId)
          console.error("Geolocation error:", error)
          setLocation("Beijing")
        },
        {
          timeout: 4000,
          maximumAge: 300000 // 5 分钟内的缓存位置可以使用
        }
      )
    } else {
      clearTimeout(timeoutId)
      setLocation("Beijing")
    }
    
    // 清理函数
    return () => clearTimeout(timeoutId)
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

        const weatherConditionMapEn: Record<string, string> = {
          Clear: "Sunny",
          Clouds: "Cloudy",
          Rain: "Rainy",
          Drizzle: "Drizzly",
          Thunderstorm: "Stormy",
          Snow: "Snowy",
          Mist: "Misty",
          Fog: "Foggy"
        }

        const condition = weatherLang === 'en' 
          ? (weatherConditionMapEn[data.current.weather] || "Cloudy")
          : (weatherConditionMap[data.current.weather] || "多云")

        const forecast = data.forecast.slice(0, 3).map((item: any, index: number) => {
          const days = weatherLang === 'en'
            ? ["Today", "Tomorrow", "Day after", "Day 4", "Day 5"]
            : ["今天", "明天", "后天", "大后天", "第五天"]
          return {
            day: days[index] || (weatherLang === 'en' ? "Unknown" : "未知"),
            temp: item.temp,
            condition: weatherLang === 'en'
              ? (weatherConditionMapEn[item.weather] || "Cloudy")
              : (weatherConditionMap[item.weather] || "多云")
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
          error: weatherLang === 'en' ? "Failed to load weather" : "天气数据加载失败" as string | null
        }))
      }
    }

    fetchWeather()
  }, [location, weatherLang])

  const getWeatherIcon = (condition: string | null | undefined) => {
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

  if (!isMounted) {
    return (
      <div className="rounded-2xl bg-card p-6 shadow-sm border border-border">
        <div className="text-center text-muted-foreground">
          {lang === 'en' ? 'Getting location...' : '正在获取位置...'}
        </div>
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
          <div>{lang === 'en' ? 'High' : '最高'} {weather.high}°</div>
          <div>{lang === 'en' ? 'Low' : '最低'} {weather.low}°</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <Droplets className="h-4 w-4 text-blue-400" />
          <div>
            <div className="text-xs text-muted-foreground">{lang === 'en' ? 'Humidity' : '湿度'}</div>
            <div className="text-sm font-medium text-foreground">{weather.humidity}%</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="h-4 w-4 text-accent" />
          <div>
            <div className="text-xs text-muted-foreground">{lang === 'en' ? 'Wind' : '风速'}</div>
            <div className="text-sm font-medium text-foreground">{weather.wind} km/h</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Thermometer className="h-4 w-4 text-red-400" />
          <div>
            <div className="text-xs text-muted-foreground">{lang === 'en' ? 'Feels like' : '体感'}</div>
            <div className="text-sm font-medium text-foreground">{weather.temp + 1}°</div>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-border pt-4">
        <h4 className="mb-3 text-sm font-medium text-foreground">
          {lang === 'en' ? 'Forecast' : '未来天气'}
        </h4>
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
  const { user, isAuthenticated, isLoading } = useAuth()
  const [glassColor, setGlassColor] = useState<string>('255, 255, 255')
  const [glassOpacity, setGlassOpacity] = useState<number>(10)
  const [todayFestival, setTodayFestival] = useState<{name: string; description: string} | null>(null)
  const [showNotification, setShowNotification] = useState(false)
  const [greeting, setGreeting] = useState<string>('欢迎回来')
  
  // 翻译 Hook
  const { lang, t, loading: translationLoading } = useTranslation()
  
  // 应用全局设置
  useSettings()

  useEffect(() => {
    // 加载设置
    const savedSettings = localStorage.getItem('theguide-settings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setGlassColor(settings.glassColor || '255, 255, 255')
      setGlassOpacity(settings.glassOpacity || 10)
    }
  }, [])

  useEffect(() => {
    // 根据时间段设置问候语
    const hour = new Date().getHours()
    let greetingText = '欢迎回来'
    
    if (hour >= 5 && hour < 9) {
      greetingText = '早上好'
    } else if (hour >= 9 && hour < 12) {
      greetingText = '上午好'
    } else if (hour >= 12 && hour < 14) {
      greetingText = '中午好'
    } else if (hour >= 14 && hour < 18) {
      greetingText = '下午好'
    } else if (hour >= 18 && hour < 22) {
      greetingText = '晚上好'
    } else {
      greetingText = '夜深了'
    }
    
    setGreeting(greetingText)
  }, [])

  useEffect(() => {
    // 检查今天是否有节日
    const today = new Date()
    const month = today.getMonth()
    const day = today.getDate()
    const solarKey = `${month}-${day}`
    const lunar = getLunarDate(today)
    const lunarKey = `lunar-${lunar.month}-${lunar.day}`
    
    // 根据语言选择节日数据库
    if (lang === 'en') {
      if (festivalTranslations[solarKey]) {
        setTodayFestival(festivalTranslations[solarKey])
        setShowNotification(true)
        return
      }
      if (festivalTranslations[lunarKey]) {
        setTodayFestival(festivalTranslations[lunarKey])
        setShowNotification(true)
      }
    } else {
      if (chineseFestivals[solarKey]) {
        setTodayFestival(chineseFestivals[solarKey])
        setShowNotification(true)
        return
      }
      if (chineseLunarFestivals[lunarKey]) {
        setTodayFestival(chineseLunarFestivals[lunarKey])
        setShowNotification(true)
      }
    }
  }, [lang])

  const closeNotification = () => {
    setShowNotification(false)
  }

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />
      
      {/* 节日通知条 */}
      {showNotification && todayFestival && (
        <div className="fixed right-4 top-4 z-50 max-w-sm animate-in slide-in-from-right fade-in duration-300">
          <div className="rounded-lg bg-primary p-4 text-primary-foreground shadow-lg">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h4 className="font-semibold">
                  {todayFestival.name}{lang === 'en' ? ' is here!' : '到了！'}
                </h4>
                <p className="mt-1 text-sm opacity-90">
                  {lang === 'en' ? 'Happy holiday!' : '节日快乐！'}
                </p>
              </div>
              <button
                onClick={closeNotification}
                className="rounded p-1 text-primary-foreground hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          {!isLoading && isAuthenticated && user ? (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="h-12 w-12 rounded-full border-2 border-primary"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                    <User className="h-6 w-6 text-primary-foreground" />
                  </div>
                )}
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {t(greeting)}，<span className="text-primary">{user.name}</span>
                </h1>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t('欢迎使用')} <span className="text-primary">TheGuide</span> {t('工具箱')}
              </h1>
            </div>
          )}
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Time Display - Full Width on Mobile, 2 cols on Desktop */}
          <div className="lg:col-span-2">
            <TimeDisplay />
          </div>

          {/* Calendar */}
          <div className="lg:row-span-2">
            <Calendar lang={lang} />
          </div>

          {/* Weather */}
          <div className="lg:col-span-2">
            <Weather lang={lang} />
          </div>
        </div>

        {/* Quick Access */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickAccessCard
            href="/guide"
            icon={Compass}
            title={t('网站导航')}
            description={t('精选 100+ 优质网站，快速访问')}
            gradient="bg-primary"
          />
          <QuickAccessCard
            href="/tools"
            icon={Wrench}
            title={t('实用工具')}
            description={t('30+ 在线工具，提升效率')}
            gradient="bg-accent"
          />
          <QuickAccessCard
            href="/favorites"
            icon={Heart}
            title={t('我的收藏')}
            description={t('快速访问收藏的工具和网站')}
            gradient="bg-red-500"
          />
        </div>
      </main>
    </div>
  )
}
