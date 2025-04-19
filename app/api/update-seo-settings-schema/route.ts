import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    // テーブルが存在するか確認
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'seo_settings'
      ) as exists
    `

    const tableExists = tableCheck.rows[0]?.exists
    console.log(`SEO settings table exists: ${tableExists}`)

    // テーブルが存在しない場合は作成
    if (!tableExists) {
      console.log("Creating seo_settings table with GTM body code field")
      await sql`
        CREATE TABLE seo_settings (
          id SERIAL PRIMARY KEY,
          google_tag_manager_id TEXT,
          google_analytics_id TEXT,
          google_search_console_verification TEXT,
          custom_head_tags TEXT,
          google_analytics_code TEXT,
          google_tag_manager_body_code TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `
      return NextResponse.json({ message: "SEO settings table created with GTM body code field" })
    }

    // カラムが存在するか確認
    const columnCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_name = 'seo_settings' AND column_name = 'google_tag_manager_body_code'
      ) as exists
    `

    const columnExists = columnCheck.rows[0]?.exists
    console.log(`GTM body code column exists: ${columnExists}`)

    // カラムが存在しない場合は追加
    if (!columnExists) {
      console.log("Adding google_tag_manager_body_code column to seo_settings table")
      await sql`
        ALTER TABLE seo_settings
        ADD COLUMN google_tag_manager_body_code TEXT
      `
      return NextResponse.json({ message: "Added google_tag_manager_body_code column to seo_settings table" })
    }

    return NextResponse.json({ message: "SEO settings schema is already up to date" })
  } catch (error) {
    console.error("Error updating SEO settings schema:", error)
    return NextResponse.json(
      {
        error: "Failed to update SEO settings schema",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
