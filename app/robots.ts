import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://theguide.ruanmgjx.dpdns.org'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/callback/',
        '/githubcallback/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
