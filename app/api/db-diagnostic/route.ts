import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    // Simple query to test database connection
    const result = await sql`SELECT NOW() as time`

    // Return success with database time
    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      time: result.rows[0].time,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    // Return detailed error information
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
