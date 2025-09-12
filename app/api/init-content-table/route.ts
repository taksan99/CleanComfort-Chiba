import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function POST() {
  try {
    // Create the site_content table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS site_content (
        id SERIAL PRIMARY KEY,
        section VARCHAR(255) UNIQUE NOT NULL,
        content JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    return NextResponse.json({ success: true, message: "Content table initialized successfully" })
  } catch (error) {
    console.error("Error initializing content table:", error)
    return NextResponse.json({ error: "Failed to initialize content table" }, { status: 500 })
  }
}
