import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"
import { handleApiError } from "../error-handler"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const forceRefresh = searchParams.get("forceRefresh") === "true"

    // キャッシュを無効化するヘッダーを設定
    const headers = {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    }

    // 全ての画像URLを一度に取得
    const result = await sql`
      SELECT section, url, updated_at 
      FROM image_urls 
      ORDER BY updated_at DESC
    `

    // セクション別に最新の画像URLをグループ化
    const imageUrls = result.rows.reduce(
      (acc, row) => {
        if (!acc[row.section] || new Date(acc[row.section].updated_at) < new Date(row.updated_at)) {
          acc[row.section] = {
            url: `${row.url}${forceRefresh ? `?t=${Date.now()}` : ""}`,
            updated_at: row.updated_at,
          }
        }
        return acc
      },
      {} as Record<string, { url: string; updated_at: string }>,
    )

    return NextResponse.json(imageUrls, { headers })
  } catch (error) {
    return handleApiError(error)
  }
}
