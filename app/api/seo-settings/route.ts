import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

// テーブルが存在するか確認する関数
async function checkTableExists() {
  try {
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'seo_settings'
      ) as exists
    `
    return result.rows[0]?.exists || false
  } catch (error) {
    console.error("Error checking if table exists:", error)
    throw error
  }
}

// テーブルを作成する関数
async function createTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS seo_settings (
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
    return true
  } catch (error) {
    console.error("Error creating table:", error)
    throw error
  }
}

// カラムが存在するか確認する関数
async function checkColumnExists(columnName: string) {
  try {
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.columns
        WHERE table_name = 'seo_settings' AND column_name = ${columnName}
      ) as exists
    `
    return result.rows[0]?.exists || false
  } catch (error) {
    console.error(`Error checking if column ${columnName} exists:`, error)
    throw error
  }
}

// カラムを追加する関数
async function addColumn(columnName: string) {
  try {
    await sql`
      ALTER TABLE seo_settings
      ADD COLUMN IF NOT EXISTS ${sql(columnName)} TEXT
    `
    return true
  } catch (error) {
    console.error(`Error adding column ${columnName}:`, error)
    throw error
  }
}

export async function GET() {
  try {
    console.log("SEO settings GET request received")

    // テーブルが存在するか確認
    const tableExists = await checkTableExists()
    console.log(`SEO settings table exists: ${tableExists}`)

    // テーブルが存在しない場合は作成
    if (!tableExists) {
      console.log("Creating seo_settings table")
      await createTable()
      console.log("SEO settings table created successfully")
    }

    // google_tag_manager_body_codeカラムが存在するか確認
    const columnExists = await checkColumnExists("google_tag_manager_body_code")
    console.log(`google_tag_manager_body_code column exists: ${columnExists}`)

    // カラムが存在しない場合は追加
    if (!columnExists) {
      console.log("Adding google_tag_manager_body_code column")
      await addColumn("google_tag_manager_body_code")
      console.log("google_tag_manager_body_code column added successfully")
    }

    // テーブルをクエリ
    console.log("Querying SEO settings")
    const result = await sql`
      SELECT * FROM seo_settings
      WHERE id = 1
    `

    console.log(`SEO settings query result: ${result.rows.length} rows`)

    // 結果を返す
    return NextResponse.json(result.rows[0] || {}, {
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("SEO settings GET error:", error)

    // JSONエラーレスポンスを返す
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

    // リクエストボディをパース
    let body
    try {
      body = await request.json()
      console.log("Request body parsed successfully")
    } catch (parseError) {
      console.error("Error parsing request body:", parseError)
      return NextResponse.json(
        {
          error: "Failed to parse request body",
          message: parseError instanceof Error ? parseError.message : String(parseError),
          timestamp: new Date().toISOString(),
        },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
    }

    // フィールドを抽出
    const {
      googleTagManagerId,
      googleAnalyticsId,
      googleSearchConsoleVerification,
      customHeadTags,
      googleAnalyticsCode,
      googleTagManagerBodyCode,
    } = body

    console.log("Extracted fields from request body")

    // テーブルが存在するか確認
    const tableExists = await checkTableExists()
    console.log(`SEO settings table exists: ${tableExists}`)

    // テーブルが存在しない場合は作成
    if (!tableExists) {
      console.log("Creating seo_settings table")
      await createTable()
      console.log("SEO settings table created successfully")
    }

    // google_tag_manager_body_codeカラムが存在するか確認
    const columnExists = await checkColumnExists("google_tag_manager_body_code")
    console.log(`google_tag_manager_body_code column exists: ${columnExists}`)

    // カラムが存在しない場合は追加
    if (!columnExists) {
      console.log("Adding google_tag_manager_body_code column")
      await addColumn("google_tag_manager_body_code")
      console.log("google_tag_manager_body_code column added successfully")
    }

    // レコードが存在するか確認
    const recordCheck = await sql`
      SELECT EXISTS (
        SELECT FROM seo_settings
        WHERE id = 1
      ) as exists
    `
    const recordExists = recordCheck.rows[0]?.exists
    console.log(`SEO settings record exists: ${recordExists}`)

    // 更新または挿入
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
          google_tag_manager_body_code = ${googleTagManagerBodyCode || ""},
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

    // 成功レスポンスを返す
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

    // JSONエラーレスポンスを返す
    return NextResponse.json(
      {
        error: "Failed to save SEO settings",
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : "No stack trace available",
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
