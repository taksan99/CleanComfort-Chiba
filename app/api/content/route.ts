import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get("section")

    if (section) {
      // 特定のセクションのデータを取得
      const result = await sql`
        SELECT content FROM site_content 
        WHERE section = ${section}
        ORDER BY updated_at DESC 
        LIMIT 1
      `
      return NextResponse.json(result.rows[0]?.content || null)
    } else {
      // すべてのセクションのデータを取得
      const result = await sql`
        SELECT section, content FROM site_content
        ORDER BY section, updated_at DESC
      `

      // セクションごとに最新のデータのみを返す
      const contentMap: { [key: string]: any } = {}
      result.rows.forEach((row) => {
        if (!contentMap[row.section]) {
          contentMap[row.section] = row.content
        }
      })

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

    // 既存のレコードがあるかチェック
    const existingResult = await sql`
      SELECT id FROM site_content 
      WHERE section = ${section}
    `

    if (existingResult.rows.length > 0) {
      // 更新
      await sql`
        UPDATE site_content 
        SET content = ${JSON.stringify(content)}, updated_at = CURRENT_TIMESTAMP
        WHERE section = ${section}
      `
    } else {
      // 新規作成
      await sql`
        INSERT INTO site_content (section, content)
        VALUES (${section}, ${JSON.stringify(content)})
      `
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving content:", error)
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 })
  }
}
