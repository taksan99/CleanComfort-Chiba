import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    // データベースから最新のファビコンURLを取得
    const result = await sql`
      SELECT url FROM image_urls
      WHERE section = 'favicon'
      ORDER BY updated_at DESC
      LIMIT 1
    `

    const faviconUrl = result.rows[0]?.url

    if (faviconUrl) {
      // S3のファビコンURLにリダイレクト
      return NextResponse.redirect(faviconUrl)
    } else {
      // デフォルトのファビコンが見つからない場合は404を返す
      return new NextResponse(null, { status: 404 })
    }
  } catch (error) {
    console.error("Error fetching favicon:", error)
    return new NextResponse(null, { status: 500 })
  }
}
