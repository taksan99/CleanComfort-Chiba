import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS seo_settings (
        id SERIAL PRIMARY KEY,
        google_tag_manager_id VARCHAR(255),
        google_analytics_id VARCHAR(255),
        google_search_console_verification TEXT,
        custom_head_tags TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    return NextResponse.json({ message: "SEO settings table created successfully" })
  } catch (error) {
    console.error("Error creating SEO settings table:", error)
    return NextResponse.json({ error: "Failed to create SEO settings table" }, { status: 500 })
  }
}
