import { NextResponse } from "next/server"

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cleancomfort-chiba.com"
  const content = `# robots.txt for cleancomfort-chiba.com
User-agent: *
Allow: /

# Explicitly allow Bingbot
User-agent: bingbot
Allow: /

# Explicitly allow Msnbot
User-agent: msnbot
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml
`

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
