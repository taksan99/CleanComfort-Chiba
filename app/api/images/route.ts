import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get("section")

    let query = sql`SELECT * FROM image_urls ORDER BY updated_at DESC`
    if (section) {
      query = sql`
        SELECT * FROM image_urls 
        WHERE section = ${section} 
        ORDER BY updated_at DESC 
        LIMIT 1
      `
    }

    const result = await query
    console.log("Fetched image URLs:", result.rows) // デバッグログ

    if (section) {
      return NextResponse.json(result.rows[0] || { url: null })
    } else {
      return NextResponse.json(result.rows)
    }
  } catch (error) {
    console.error("Error fetching images:", error)
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 })
  }
}
