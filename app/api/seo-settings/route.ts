import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET() {
  try {
    console.log("SEO settings GET request received")

    // Simple query to check if table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'seo_settings'
      ) as exists
    `

    const tableExists = tableCheck.rows[0]?.exists
    console.log(`SEO settings table exists: ${tableExists}`)

    // If table doesn't exist, create it
    if (!tableExists) {
      console.log("Creating seo_settings table")
      await sql`
        CREATE TABLE seo_settings (
          id SERIAL PRIMARY KEY,
          google_tag_manager_id TEXT,
          google_analytics_id TEXT,
          google_search_console_verification TEXT,
          custom_head_tags TEXT,
          google_analytics_code TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `
      console.log("SEO settings table created successfully")
    }

    // Query the table
    console.log("Querying SEO settings")
    const result = await sql`
      SELECT * FROM seo_settings
      WHERE id = 1
    `

    console.log(`SEO settings query result: ${result.rows.length} rows`)

    // Return the result
    return NextResponse.json(result.rows[0] || {}, {
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("SEO settings GET error:", error)

    // Return a JSON error response
    return NextResponse.json(
      {
        error: "Failed to fetch SEO settings",
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

export async function POST(request: Request) {
  try {
    console.log("SEO settings POST request received")

    // Parse the request body
    const body = await request.json()
    console.log("Request body parsed successfully")

    // Extract fields
    const {
      googleTagManagerId,
      googleAnalyticsId,
      googleSearchConsoleVerification,
      customHeadTags,
      googleAnalyticsCode,
      googleTagManagerBodyCode, // 新しいフィールドを追加
    } = body

    // Check if table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'seo_settings'
      ) as exists
    `

    const tableExists = tableCheck.rows[0]?.exists
    console.log(`SEO settings table exists: ${tableExists}`)

    // If table doesn't exist, create it
    if (!tableExists) {
      console.log("Creating seo_settings table")
      await sql`
        CREATE TABLE seo_settings (
          id SERIAL PRIMARY KEY,
          google_tag_manager_id TEXT,
          google_analytics_id TEXT,
          google_search_console_verification TEXT,
          custom_head_tags TEXT,
          google_analytics_code TEXT,
          google_tag_manager_body_code TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `
      console.log("SEO settings table created successfully")
    }

    // Check if record exists
    const recordCheck = await sql`
      SELECT EXISTS (
        SELECT FROM seo_settings
        WHERE id = 1
      ) as exists
    `

    const recordExists = recordCheck.rows[0]?.exists
    console.log(`SEO settings record exists: ${recordExists}`)

    // Update or insert
    if (recordExists) {
      console.log("Updating existing SEO settings record")
      await sql`
        UPDATE seo_settings
        SET 
          google_tag_manager_id = ${googleTagManagerId || ""},
          google_analytics_id = ${googleAnalyticsId || ""},
          google_search_console_verification = ${googleSearchConsoleVerification || ""},
          custom_head_tags = ${customHeadTags || ""},
          google_analytics_code = ${googleAnalyticsCode || ""},
          google_tag_manager_body_code = ${googleTagManagerBodyCode || ""}, // 新しいフィールドを追加
          updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
      `
    } else {
      console.log("Inserting new SEO settings record")
      await sql`
        INSERT INTO seo_settings (
          id,
          google_tag_manager_id,
          google_analytics_id,
          google_search_console_verification,
          custom_head_tags,
          google_analytics_code,
          google_tag_manager_body_code
        ) VALUES (
          1,
          ${googleTagManagerId || ""},
          ${googleAnalyticsId || ""},
          ${googleSearchConsoleVerification || ""},
          ${customHeadTags || ""},
          ${googleAnalyticsCode || ""},
          ${googleTagManagerBodyCode || ""}
        )
      `
    }

    console.log("SEO settings saved successfully")

    // Return success
    return NextResponse.json(
      {
        success: true,
        message: "SEO settings saved successfully",
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("SEO settings POST error:", error)

    // Return a JSON error response
    return NextResponse.json(
      {
        error: "Failed to save SEO settings",
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}
