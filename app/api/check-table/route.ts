import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    const result = await sql`
      SELECT * FROM image_urls
    `
    return NextResponse.json({ status: "OK", data: result.rows })
  } catch (error) {
    console.error("Table check failed:", error)
    return NextResponse.json({ status: "Error", error: JSON.stringify(error) }, { status: 500 })
  }
}
