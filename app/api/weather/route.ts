import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const locationParam = searchParams.get("location")
    
    let city = "Beijing"
    let lat: string | null = null
    let lon: string | null = null

    if (locationParam) {
      if (locationParam.includes(",")) {
        const [latVal, lonVal] = locationParam.split(",")
        lat = latVal
        lon = lonVal
      } else {
        city = locationParam
      }
    }

    let currentWeatherUrl: string
    let forecastUrl: string

    if (lat && lon) {
      currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=zh_cn`
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=zh_cn`
    } else {
      currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=zh_cn`
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=zh_cn`
    }

    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentWeatherUrl),
      fetch(forecastUrl)
    ])

    if (!currentRes.ok) {
      console.error("OpenWeather API current weather error:", currentRes.status, currentRes.statusText)
      return NextResponse.json(
        { error: `Weather API error: ${currentRes.status}` },
        { status: currentRes.status }
      )
    }

    if (!forecastRes.ok) {
      console.error("OpenWeather API forecast error:", forecastRes.status, forecastRes.statusText)
      return NextResponse.json(
        { error: `Weather API error: ${forecastRes.status}` },
        { status: forecastRes.status }
      )
    }

    const currentData = await currentRes.json()
    const forecastData = await forecastRes.json()

    console.log("Weather data fetched successfully for:", currentData.name)

    const dailyForecasts: any[] = []
    const seenDates = new Set<string>()

    for (const item of forecastData.list) {
      const date = new Date(item.dt * 1000).toISOString().split("T")[0]
      if (!seenDates.has(date)) {
        seenDates.add(date)
        dailyForecasts.push(item)
      }
      if (dailyForecasts.length >= 5) break
    }

    const forecast = dailyForecasts.map((item) => ({
      temp: Math.round(item.main.temp),
      weather: item.weather[0].main,
      high: Math.round(item.main.temp_max),
      low: Math.round(item.main.temp_min)
    }))

    return NextResponse.json({
      location: currentData.name || city,
      current: {
        temp: Math.round(currentData.main.temp),
        weather: currentData.weather[0].main,
        humidity: currentData.main.humidity,
        wind: Math.round(currentData.wind.speed * 3.6),
        high: Math.round(currentData.main.temp_max),
        low: Math.round(currentData.main.temp_min)
      },
      forecast
    })
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    )
  }
}
