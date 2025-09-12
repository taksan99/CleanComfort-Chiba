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
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Insert default content for each section
    const defaultContent = {
      valueProposition: [
        { title: "清潔で快適な住環境", description: "プロの技術で隅々まで清潔に", icon: "✨" },
        { title: "時間の有効活用", description: "掃除の時間を大切な時間に", icon: "⏰" },
        { title: "健康的な生活空間", description: "アレルゲンや細菌を徹底除去", icon: "🌿" },
        { title: "心の安らぎ", description: "美しい空間で心もリフレッシュ", icon: "💆‍♀️" },
      ],
      services: [
        {
          title: "ハウスクリーニング",
          description: "あなたの家を隅々まで美しく",
          items: [
            { name: "水回り5点セット", icon: "water-5", desc: "68,000円～ 洗面所・キッチン・浴室・トイレ・洗濯機周り" },
            { name: "キッチン", icon: "kitchen", desc: "20,000円～ レンジフード・コンロ・シンク" },
            {
              name: "浴室",
              icon: "bathroom",
              desc: "20,000円～ 床・壁・天井・鏡・蛇口（エプロン内部クリーニング+5,000円）",
            },
            { name: "トイレ", icon: "toilet", desc: "10,000円～ 便器・床・壁・換気扇" },
            { name: "ガラス・サッシ", icon: "glass-window", desc: "10,000円～ 窓3枚・網戸・サッシレール" },
            { name: "ベランダ", icon: "balcony", desc: "6,000円～ 床・手すり・排水口" },
            { name: "ワックスがけ", icon: "waxing", desc: "戸建て：5,000円～、アパート：4,000円～" },
          ],
          features: [
            "頑固な水垢や油汚れも徹底除去",
            "除菌・消臭効果で衛生的な空間に",
            "プロの道具と技術で普段手の届かない場所も",
          ],
          option: "なし",
        },
        {
          title: "エアコンクリーニング",
          description: "クリーンな空気で快適生活",
          items: [
            { name: "通常エアコン", icon: "air-conditioner", desc: "12,000円～ 壁掛け型" },
            { name: "お掃除機能付き", icon: "air-conditioner-auto", desc: "22,000円～ 自動お掃除機能付きエアコン" },
            { name: "埋込式エアコン", icon: "air-conditioner-embedded", desc: "25,000円～ ご家庭用天井埋込タイプ" },
            { name: "業務用エアコン", icon: "air-conditioner-industrial", desc: "33,000円～ 4方向タイプ" },
            { name: "ワイドエアコン", icon: "air-conditioner-wide", desc: "28,000円～ 横に広いタイプ（業務用など）" },
            { name: "室外機", icon: "air-conditioner-outdoor", desc: "6,000円～ 室外機のみのクリーニング" },
          ],
          features: [
            "独自の高圧洗浄技術でフィンも綺麗に",
            "アレル物質や花粉を99%以上除去",
            "消費電力を最大30%削減し、電気代を節約",
            "悪臭の原因となるカビやバクテリアを撃退",
          ],
          option: "抗菌コート：1,000円、防カビコート：1,000円",
        },
        {
          title: "便利屋サービス",
          description: "日常のお困りごとを解決（最低料金5,000円～）",
          items: [
            { name: "害獣・害虫駆除", icon: "pest-control", desc: "10,000円～ ネズミ、コウモリ、蜂の巣など" },
            { name: "墓参り代行", icon: "grave-visit", desc: "お墓の清掃・お供えなど" },
            { name: "ペットの世話", icon: "pet-care", desc: "餌やり・散歩・トイレ清掃など" },
            { name: "友達代行", icon: "friend-service", desc: "イベント参加・話し相手など" },
            { name: "庭の手入れ", icon: "gardening", desc: "草刈り・剪定・除草" },
            {
              name: "水道・トイレのつまり",
              icon: "plumbing-service",
              desc: "軽度：7,000円～、中程度～重度：30,000円～、夜間対応：50,000円～",
            },
            { name: "その他", icon: "other-service", desc: "日常のお困りごとをお気軽にご相談ください" },
          ],
          features: [
            "経験豊富なスタッフが迅速に対応",
            "幅広いサービスで様々なニーズに対応",
            "丁寧な作業と適正価格で安心",
            "緊急対応も可能（追加料金あり）",
          ],
          option: "電球交換など軽微なもの：500円～（お気軽にご相談ください）",
        },
      ],
      promotions: {
        promotions: [
          {
            id: "1",
            title: "紹介キャンペーン",
            description: "お知り合いをご紹介いただくと、次回のご利用時に",
            discount: "10% OFF",
            note: "※ 紹介されたお客様が実際にサービスをご利用された場合に適用されます。",
            startDate: "2023-01-01",
            endDate: "2025-12-31",
            isActive: true,
            variant: "A",
          },
          {
            id: "2",
            title: "リピーター特典",
            description: "年2回以上ご利用いただくと、2回目以降のご利用時に",
            discount: "5% OFF",
            startDate: "2023-01-01",
            endDate: "2025-12-31",
            isActive: true,
            variant: "A",
          },
        ],
        campaignText: "最大50%OFF！　春のお掃除キャンペーン実施中！",
      },
    }

    // Insert default content for each section
    for (const [section, content] of Object.entries(defaultContent)) {
      await sql`
        INSERT INTO site_content (section, content, updated_at)
        VALUES (${section}, ${JSON.stringify(content)}, NOW())
        ON CONFLICT (section)
        DO UPDATE SET content = ${JSON.stringify(content)}, updated_at = NOW()
      `
    }

    return NextResponse.json({
      success: true,
      message: "Content table initialized successfully with default data",
    })
  } catch (error) {
    console.error("Error initializing content table:", error)
    return NextResponse.json(
      { error: "Failed to initialize content table", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed. Use POST to initialize." }, { status: 405 })
}
