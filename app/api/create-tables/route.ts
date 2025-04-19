import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS image_urls (
        id SERIAL PRIMARY KEY,
        section VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    return NextResponse.json({ message: "Tables created successfully" })
  } catch (error) {
    console.error("Error creating tables:", error)
    return NextResponse.json({ error: "Failed to create tables" }, { status: 500 })
  }
}
