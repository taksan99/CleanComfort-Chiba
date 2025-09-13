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
        ORDER BY updated_at DESC
      `
      const contentMap = result.rows.reduce((acc, row) => {
        acc[row.section] = row.content
        return acc
      }, {})
      return NextResponse.json(contentMap)
    }
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { section, content } = await request.json()

    if (!section || !content) {
      return NextResponse.json({ error: "Section and content are required" }, { status: 400 })
    }

    await sql`
      INSERT INTO site_content (section, content, created_at, updated_at)
      VALUES (${section}, ${JSON.stringify(content)}, NOW(), NOW())
      ON CONFLICT (section) DO UPDATE
      SET content = ${JSON.stringify(content)}, updated_at = NOW()
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving content:", error)
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 })
  }
}
