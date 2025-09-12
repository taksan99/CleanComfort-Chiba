import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function POST() {
  try {
    // Create site_content table
    await sql`
      CREATE TABLE IF NOT EXISTS site_content (
        id SERIAL PRIMARY KEY,
        section VARCHAR(255) UNIQUE NOT NULL,
        content JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    return NextResponse.json({ success: true, message: "Content table created successfully" })
  } catch (error) {
    console.error("Error creating content table:", error)
    return NextResponse.json({ error: "Failed to create content table" }, { status: 500 })
  }
}
