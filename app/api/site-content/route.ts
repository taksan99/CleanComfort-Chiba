import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get("section")

    if (section) {
      const result = await sql`
        SELECT content FROM site_content 
        WHERE section = ${section}
        ORDER BY updated_at DESC
        LIMIT 1
      `
      return NextResponse.json(result.rows[0]?.content || null)
    } else {
      const result = await sql`
        SELECT section, content FROM site_content
        ORDER BY section, updated_at DESC
      `
      return NextResponse.json(result.rows)
    }
  } catch (error) {
    console.error("Failed to fetch site content:", error)
    return NextResponse.json({ error: "Failed to fetch site content" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { section, content } = await request.json()

    if (!section || !content) {
      return NextResponse.json({ error: "Section and content are required" }, { status: 400 })
    }

    // Check if record exists
    const existing = await sql`
      SELECT id FROM site_content WHERE section = ${section}
    `

    if (existing.rows.length > 0) {
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
    console.error("Failed to save site content:", error)
    return NextResponse.json({ error: "Failed to save site content" }, { status: 500 })
  }
}
