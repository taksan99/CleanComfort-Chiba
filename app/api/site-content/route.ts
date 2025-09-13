import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get("section")

    if (!section) {
      return NextResponse.json({ error: "Section parameter is required" }, { status: 400 })
    }

    const result = await sql`
      SELECT content FROM site_content 
      WHERE section = ${section} 
      ORDER BY updated_at DESC 
      LIMIT 1
    `

    if (result.length === 0) {
      return NextResponse.json(null)
    }

    return NextResponse.json(result[0].content)
  } catch (error) {
    console.error("Error fetching site content:", error)
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { section, content } = await request.json()

    if (!section || !content) {
      return NextResponse.json({ error: "Section and content are required" }, { status: 400 })
    }

    // Check if record exists
    const existing = await sql`
      SELECT id FROM site_content WHERE section = ${section}
    `

    if (existing.length > 0) {
      // Update existing record
      await sql`
        UPDATE site_content 
        SET content = ${JSON.stringify(content)}, updated_at = NOW()
        WHERE section = ${section}
      `
    } else {
      // Insert new record
      await sql`
        INSERT INTO site_content (section, content, created_at, updated_at)
        VALUES (${section}, ${JSON.stringify(content)}, NOW(), NOW())
      `
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving site content:", error)
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 })
  }
}
