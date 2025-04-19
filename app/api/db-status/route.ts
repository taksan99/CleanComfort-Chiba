import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    // 基本的な接続テスト
    const connectionTest = await sql`SELECT 1 as connection_test`

    // テーブルの存在確認
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'image_urls'
      ) as table_exists
    `

    // レコード数の確認
    const recordCount = await sql`
      SELECT COUNT(*) as count FROM image_urls
    `

    return NextResponse.json({
      status: "ok",
      connection: "successful",
      tableExists: tableCheck.rows[0].table_exists,
      recordCount: recordCount.rows[0].count,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Database status check failed:", error)
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
