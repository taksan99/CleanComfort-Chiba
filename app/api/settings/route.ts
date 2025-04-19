import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    const result = await sql`
      SELECT * FROM settings
      WHERE id = 1
    `
    return NextResponse.json(result.rows[0] || {})
  } catch (error) {
    console.error("Failed to fetch settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { gaId, googleVerification, bingVerification } = await request.json()

    await sql`
      INSERT INTO settings (id, ga_id, google_verification, bing_verification)
      VALUES (1, ${gaId}, ${googleVerification}, ${bingVerification})
      ON CONFLICT (id) DO UPDATE
      SET ga_id = ${gaId},
          google_verification = ${googleVerification},
          bing_verification = ${bingVerification}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to save settings:", error)
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 })
  }
}
