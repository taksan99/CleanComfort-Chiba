import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET(request: Request) {
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

    if (result.rows.length === 0) {
      return NextResponse.json({ content: null })
    }

    return NextResponse.json({ content: JSON.parse(result.rows[0].content) })
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { section, content } = await request.json()

    if (!section || !content) {
      return NextResponse.json({ error: "Section and content are required" }, { status: 400 })
    }

    // Insert or update content
    await sql`
      INSERT INTO site_content (section, content, updated_at)
      VALUES (${section}, ${JSON.stringify(content)}, NOW())
      ON CONFLICT (section) 
      DO UPDATE SET 
        content = ${JSON.stringify(content)},
        updated_at = NOW()
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving content:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
