import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    // 基本的な接続テスト
    const connectionTest = await sql`SELECT NOW() as time`
    console.log("Database connection successful:", connectionTest.rows[0])

    // テーブル一覧の取得
    const tablesResult = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    const tables = tablesResult.rows.map((row) => row.table_name)
    console.log("Tables in database:", tables)

    // seo_settingsテーブルの構造を確認
    let seoSettingsColumns = []
    let seoSettingsExists = false

    if (tables.includes("seo_settings")) {
      seoSettingsExists = true
      const columnsResult = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'seo_settings'
        ORDER BY ordinal_position
      `
      seoSettingsColumns = columnsResult.rows
      console.log("SEO settings table structure:", seoSettingsColumns)
    }

    // 詳細な診断情報を返す
    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      time: connectionTest.rows[0].time,
      tables: tables,
      seo_settings: {
        exists: seoSettingsExists,
        columns: seoSettingsColumns,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    // 詳細なエラー情報を返す
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : "No stack trace available",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
