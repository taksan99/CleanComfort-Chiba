import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cleancomfort-chiba.com"

  let dynamicPages = []
  try {
    const result = await db.query("SELECT id FROM services")
    dynamicPages = result.rows.map((row) => `/services/${row.id}`)
  } catch (error) {
    console.error("Error fetching dynamic pages:", error)
  }

  const staticPages = [
    "",
    "/company",
    "/privacy-policy",
    "/basic-price-list",
    "/thank-you",
    "/contact",
    "/service-area",
  ]

  const urls = [...staticPages.map((page) => `${baseUrl}${page}`), ...dynamicPages.map((page) => `${baseUrl}${page}`)]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  })
}
