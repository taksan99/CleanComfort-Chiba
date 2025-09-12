"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { StyledSection } from "./StyledSection"

interface ServiceItem {
  name: string
  icon: string
  desc: string
}

interface Service {
  title: string
  description: string
  items: ServiceItem[]
  features: string[]
  option: string
  bg: string
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/content?section=services")
        const data = await response.json()
        if (data.content) {
          setServices(JSON.parse(data.content))
        } else {
          // Fallback to default services if no data
          setServices([
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
          ])
        }
      } catch (error) {
        console.error("Error fetching services:", error)
        setServices([])
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  if (loading) {
    return (
      <StyledSection id="services" className="py-20" backgroundImage="servicesBackgroundImage">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </StyledSection>
    )
  }

  return (
    <StyledSection id="services" className="py-20" backgroundImage="servicesBackgroundImage">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">サービス内容</h2>
          <p className="text-xl text-gray-600">プロの技術で、あなたの暮らしを快適に</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className={`${service.bg} border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
            >
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>

                <div className="space-y-4 mb-6">
                  {service.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start space-x-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="font-semibold text-gray-800">{item.name}</div>
                        <div className="text-sm text-gray-600">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">特徴</h4>
                  <ul className="space-y-1">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-sm text-gray-600 flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {service.option !== "なし" && (
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-1">オプション</h4>
                    <p className="text-sm text-gray-600">{service.option}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </StyledSection>
  )
}
