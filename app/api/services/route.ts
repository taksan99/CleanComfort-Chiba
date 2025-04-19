import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM services`
    return NextResponse.json(rows)
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
