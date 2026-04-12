import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

export async function GET(request: NextRequest) {
  try {
    // 获取客户端 IP 地址
    const forwarded = request.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown"
    
    console.log("IP location request from:", ip)
    
    // 使用多个 IP 定位 API（服务端调用没有 CORS 限制）
    const apiEndpoints = [
      {
        name: 'ipwhois.app',
        url: 'https://ipwhois.app/json/',
        parse: (data: any) => ({
          lat: data.latitude,
          lon: data.longitude,
          success: data.success === true
        })
      },
      {
        name: 'ipapi.co',
        url: 'https://ipapi.co/json/',
        parse: (data: any) => ({
          lat: data.latitude,
          lon: data.longitude,
          success: !data.error
        })
      },
      {
        name: 'ip-api.com',
        url: 'http://ip-api.com/json/?lang=zh-CN',
        parse: (data: any) => ({
          lat: data.lat,
          lon: data.lon,
          success: data.status === 'success'
        })
      },
      {
        name: 'ip.useragentinfo.com',
        url: 'https://ip.useragentinfo.com/json',
        parse: (data: any) => ({
          lat: data.lat || 39.9042,
          lon: data.lng || 116.4074,
          success: data.code === 200
        })
      },
      {
        name: 'api.vore.top',
        url: 'https://api.vore.top/api/IPdata',
        parse: (data: any) => {
          const lat = data.ipdata?.lat || 39.9042
          const lon = data.ipdata?.lng || 116.4074
          return { lat, lon, success: data.code === 200 }
        }
      }
    ]
    
    // 依次尝试各个 API
    for (const api of apiEndpoints) {
      try {
        console.log(`Trying ${api.name}...`)
        const res = await fetch(api.url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        })
        
        if (!res.ok) {
          console.warn(`${api.name} failed with status ${res.status}`)
          continue
        }
        
        const data = await res.json()
        const result = api.parse(data)
        
        if (result.success && result.lat && result.lon) {
          console.log(`Location from ${api.name}: ${result.lat},${result.lon}`)
          return NextResponse.json({
            success: true,
            latitude: result.lat,
            longitude: result.lon,
            source: api.name
          })
        } else {
          console.warn(`${api.name} returned invalid data:`, data)
        }
      } catch (error) {
        console.warn(`${api.name} error:`, error)
        // 继续尝试下一个 API
      }
    }
    
    // 所有 API 都失败
    console.warn("All IP location APIs failed")
    return NextResponse.json({
      success: false,
      error: "All location APIs failed",
      latitude: 39.9042,
      longitude: 116.4074
    })
    
  } catch (error) {
    console.error("IP location API error:", error)
    return NextResponse.json({
      success: false,
      error: "Internal server error",
      latitude: 39.9042,
      longitude: 116.4074
    }, { status: 500 })
  }
}
