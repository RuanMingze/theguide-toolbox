import { NextRequest, NextResponse } from "next/server"
import { createGeoIPManager } from "geoip0"
import ipsbDriver from "geoip0/drivers/ipsb"
import cloudflareDriver from "geoip0/drivers/cloudflare"
import hybridDriver from "geoip0/drivers/hybrid"

export const runtime = "edge"

interface IpInfoResponse {
  ip: string
  city: string
  region: string
  country: string
  loc: string
  timezone: string
}

// 创建 GeoIP 管理器，使用混合驱动（自动故障转移）
const geoipManager = createGeoIPManager({
  driver: hybridDriver({
    drivers: [
      ipsbDriver(),
      cloudflareDriver(),
    ],
  }),
})

export async function GET(request: NextRequest) {
  try {
    // 获取客户端 IP
    const forwarded = request.headers.get("x-forwarded-for")
    const ip = forwarded 
      ? forwarded.split(",")[0].trim() 
      : request.headers.get("x-real-ip") || "unknown"

    // 如果是本地地址，直接返回默认位置
    if (ip === "localhost" || ip === "127.0.0.1" || ip === "::1") {
      return NextResponse.json({
        city: "Deqing",
        region: "Zhejiang",
        country: "CN",
        loc: "30.4424,120.0816",
        timezone: "Asia/Shanghai"
      })
    }

    // 使用 geoip0 获取位置信息
    const location = await geoipManager.lookup(ip)

    if (!location || !location.latitude || !location.longitude) {
      throw new Error("Invalid location data from geoip0")
    }

    // 构建响应数据
    const city = location.city || "Deqing"
    const region = location.region || ""
    const country = location.country || "CN"
    const loc = `${location.latitude},${location.longitude}`
    const timezone = location.timezone || "Asia/Shanghai"

    console.log("IP location from geoip0:", { ip, city, region, country, loc })

    return NextResponse.json({
      city,
      region,
      country,
      loc,
      timezone
    })

  } catch (error) {
    console.error("IP location fetch error:", error)
    
    // 任何错误都返回默认位置
    return NextResponse.json({
      city: "Deqing",
      region: "Zhejiang",
      country: "CN",
      loc: "30.4424,120.0816",
      timezone: "Asia/Shanghai"
    })
  }
}
