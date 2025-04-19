import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    const result = await sql`SELECT NOW()`
    console.log("Database connection successful:", result.rows[0])
    return NextResponse.json({ status: "OK", time: result.rows[0].now })
  } catch (error) {
    console.error("Database health check failed:", error)
    return NextResponse.json({ status: "Error", error: JSON.stringify(error) }, { status: 500 })
  }
}
