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
    const defaultContent = [
      {
        section: "services",
        content: JSON.stringify([
          {
            title: "ハウスクリーニング",
            description: "あなたの家を隅々まで美しく",
            items: [
              { name: "水回り5点セット", icon: "🚰", desc: "68,000円～ 洗面所・キッチン・浴室・トイレ・洗濯機周り" },
              { name: "キッチン", icon: "🍳", desc: "20,000円～ レンジフード・コンロ・シンク" },
              {
                name: "浴室",
                icon: "🛁",
                desc: "20,000円～ 床・壁・天井・鏡・蛇口（エプロン内部クリーニング+5,000円）",
              },
              { name: "トイレ", icon: "🚽", desc: "10,000円～ 便器・床・壁・換気扇" },
              { name: "ガラス・サッシ", icon: "🪟", desc: "10,000円～ 窓3枚・網戸・サッシレール" },
              { name: "ベランダ", icon: "🏠", desc: "6,000円～ 床・手すり・排水口" },
              { name: "ワックスがけ", icon: "✨", desc: "戸建て：5,000円～、アパート：4,000円～" },
            ],
            features: [
              "頑固な水垢や油汚れも徹底除去",
              "除菌・消臭効果で衛生的な空間に",
              "プロの道具と技術で普段手の届かない場所も",
            ],
            option: "なし",
            bg: "bg-blue-50",
          },
          {
            title: "エアコンクリーニング",
            description: "クリーンな空気で快適生活",
            items: [
              { name: "通常エアコン", icon: "❄️", desc: "12,000円～ 壁掛け型" },
              { name: "お掃除機能付き", icon: "🤖", desc: "22,000円～ 自動お掃除機能付きエアコン" },
              { name: "埋込式エアコン", icon: "🏠", desc: "25,000円～ ご家庭用天井埋込タイプ" },
              { name: "業務用エアコン", icon: "🏢", desc: "33,000円～ 4方向タイプ" },
              { name: "ワイドエアコン", icon: "📏", desc: "28,000円～ 横に広いタイプ（業務用など）" },
              { name: "室外機", icon: "🌡️", desc: "6,000円～ 室外機のみのクリーニング" },
            ],
            features: [
              "独自の高圧洗浄技術でフィンも綺麗に",
              "アレル物質や花粉を99%以上除去",
              "消費電力を最大30%削減し、電気代を節約",
              "悪臭の原因となるカビやバクテリアを撃退",
            ],
            option: "抗菌コート：1,000円、防カビコート：1,000円",
            bg: "bg-green-50",
          },
          {
            title: "便利屋サービス",
            description: "日常のお困りごとを解決（最低料金5,000円～）",
            items: [
              { name: "害獣・害虫駆除", icon: "🐜", desc: "10,000円～ ネズミ、コウモリ、蜂の巣など" },
              { name: "墓参り代行", icon: "🪦", desc: "お墓の清掃・お供えなど" },
              { name: "ペットの世話", icon: "🐾", desc: "餌やり・散歩・トイレ清掃など" },
              { name: "友達代行", icon: "🤝", desc: "イベント参加・話し相手など" },
              { name: "庭の手入れ", icon: "🌳", desc: "草刈り・剪定・除草" },
              {
                name: "水道・トイレのつまり",
                icon: "🚽",
                desc: "軽度：7,000円～、中程度～重度：30,000円～、夜間対応：50,000円～",
              },
              { name: "その他", icon: "🌟", desc: "日常のお困りごとをお気軽にご相談ください" },
            ],
            features: [
              "経験豊富なスタッフが迅速に対応",
              "幅広いサービスで様々なニーズに対応",
              "丁寧な作業と適正価格で安心",
              "緊急対応も可能（追加料金あり）",
            ],
            option: "電球交換など軽微なもの：500円～（お気軽にご相談ください）",
            bg: "bg-yellow-50",
          },
        ]),
      },
      {
        section: "valueProposition",
        content: JSON.stringify({
          title: "4つの幸せな暮らしを実現",
          subtitle: "クリーンコンフォート千葉が提供する価値",
          items: [
            {
              title: "清潔で健康的な住環境",
              description: "プロの技術で徹底清掃し、家族の健康を守ります",
              icon: "🏠",
            },
            {
              title: "時間の有効活用",
              description: "清掃作業から解放され、大切な時間を有意義に過ごせます",
              icon: "⏰",
            },
            {
              title: "ストレスフリーな生活",
              description: "掃除の悩みから解放され、心地よい空間で過ごせます",
              icon: "😊",
            },
            {
              title: "専門的な仕上がり",
              description: "素人では難しい箇所も、プロの技術で美しく仕上げます",
              icon: "✨",
            },
          ],
        }),
      },
      {
        section: "strengths",
        content: JSON.stringify({
          title: "私たちの強み",
          subtitle: "選ばれ続ける理由",
          items: [
            {
              title: "千葉県全域対応",
              description: "千葉県内どこでも迅速にお伺いします",
              icon: "🌍",
            },
            {
              title: "最短翌日対応",
              description: "急なご依頼にも柔軟に対応いたします",
              icon: "⚡",
            },
            {
              title: "エコフレンドリー洗剤",
              description: "環境と人体に優しい洗剤を使用",
              icon: "🌱",
            },
            {
              title: "明確な料金体系",
              description: "追加料金なしの安心価格設定",
              icon: "💰",
            },
            {
              title: "プロの技術力",
              description: "経験豊富なスタッフによる高品質サービス",
              icon: "👨‍🔧",
            },
            {
              title: "アフターフォロー",
              description: "サービス後のフォローアップも万全",
              icon: "📞",
            },
          ],
        }),
      },
      {
        section: "seasonalPlans",
        content: JSON.stringify({
          title: "季節別おすすめプラン",
          subtitle: "季節に合わせた特別プラン",
          plans: [
            {
              season: "春",
              title: "春の大掃除プラン",
              description: "新生活スタートに向けた徹底清掃",
              price: "特別価格 28,000円〜",
              features: ["エアコン清掃", "窓・網戸清掃", "ベランダ清掃"],
              color: "bg-pink-50",
            },
            {
              season: "夏",
              title: "夏快適プラン",
              description: "エアコン・水回りで涼しく清潔に",
              price: "特別価格 32,000円〜",
              features: ["エアコン徹底清掃", "浴室・洗面所清掃", "キッチン清掃"],
              color: "bg-blue-50",
            },
            {
              season: "秋",
              title: "秋のメンテナンスプラン",
              description: "夏の疲れをリフレッシュ",
              price: "特別価格 30,000円〜",
              features: ["ハウス全体清掃", "エアコンお手入れ", "換気扇清掃"],
              color: "bg-orange-50",
            },
            {
              season: "冬",
              title: "年末大掃除プラン",
              description: "新年を気持ちよく迎える準備",
              price: "特別価格 35,000円〜",
              features: ["家全体徹底清掃", "レンジフード清掃", "窓ガラス清掃"],
              color: "bg-gray-50",
            },
          ],
        }),
      },
    ]

    for (const item of defaultContent) {
      await sql`
        INSERT INTO site_content (section, content, updated_at)
        VALUES (${item.section}, ${item.content}, NOW())
        ON CONFLICT (section) DO NOTHING
      `
    }

    return NextResponse.json({
      success: true,
      message: "データベーステーブルが正常に初期化されました",
    })
  } catch (error) {
    console.error("Database initialization error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Check if table exists and return status
    const result = await sql`
      SELECT COUNT(*) as count FROM site_content
    `

    return NextResponse.json({
      success: true,
      tableExists: true,
      recordCount: result.rows[0].count,
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      tableExists: false,
      error: error.message,
    })
  }
}
