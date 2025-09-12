import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function POST() {
  try {
    // Create the site_content table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS site_content (
        id SERIAL PRIMARY KEY,
        section VARCHAR(255) UNIQUE NOT NULL,
        content JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Insert default content if table is empty
    const existingContent = await sql`SELECT COUNT(*) FROM site_content`
    const count = existingContent.rows[0].count

    if (count === 0) {
      // Insert default content for all sections
      const defaultSections = [
        {
          section: "hero",
          content: {
            title: "プロの清掃で快適な空間を",
            subtitle: "千葉県全域対応の清掃サービス",
            description: "経験豊富なスタッフが、お客様のご要望に合わせて丁寧に清掃いたします。",
          },
        },
        {
          section: "services",
          content: {
            title: "サービス内容",
            services: [
              {
                title: "ハウスクリーニング",
                description: "一般住宅の清掃サービス",
                price: "15,000円〜",
              },
              {
                title: "オフィス清掃",
                description: "事務所・店舗の清掃サービス",
                price: "20,000円〜",
              },
              {
                title: "エアコンクリーニング",
                description: "エアコンの分解清掃",
                price: "8,000円〜",
              },
            ],
          },
        },
        {
          section: "promotions",
          content: {
            title: "キャンペーン情報",
            promotions: [
              {
                title: "初回限定割引",
                description: "初回ご利用のお客様は20%OFF",
                discount: "20%",
                isActive: true,
              },
            ],
          },
        },
      ]

      for (const section of defaultSections) {
        await sql`
          INSERT INTO site_content (section, content)
          VALUES (${section.section}, ${JSON.stringify(section.content)})
          ON CONFLICT (section) DO NOTHING
        `
      }
    }

    return NextResponse.json({
      success: true,
      message: "Content table initialized successfully",
      recordCount: count,
    })
  } catch (error) {
    console.error("Error initializing content table:", error)
    return NextResponse.json(
      {
        error: "Failed to initialize content table",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json(
    {
      error: "Method not allowed. Use POST to initialize the table.",
    },
    { status: 405 },
  )
}
