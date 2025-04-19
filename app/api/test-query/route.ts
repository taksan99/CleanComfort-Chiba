import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const section = searchParams.get("section") || "testimonial1"

  try {
    const result = await sql`
      SELECT url, updated_at FROM image_urls
      WHERE section = ${section}
      ORDER BY updated_at DESC
      LIMIT 1
    `
    return NextResponse.json({ status: "OK", data: result.rows })
  } catch (error) {
    console.error("Query test failed:", error)
    return NextResponse.json({ status: "Error", error: JSON.stringify(error) }, { status: 500 })
  }
}
