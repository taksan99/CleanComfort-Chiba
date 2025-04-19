import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"
import { handleApiError } from "../error-handler"

export async function GET() {
  try {
    const result = await sql`SELECT NOW()`
    return NextResponse.json({ success: true, time: result.rows[0].now })
  } catch (error) {
    console.error("Database connection test failed:", error)
    return handleApiError(error)
  }
}
