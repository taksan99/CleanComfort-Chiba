"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StyledSection } from "./StyledSection"

interface SeasonalPlan {
  season: string
  title: string
  description: string
  price: string
  features: string[]
  color: string
}

interface SeasonalPlansData {
  title: string
  subtitle: string
  plans: SeasonalPlan[]
}

export default function SeasonalPlans() {
  const [data, setData] = useState<SeasonalPlansData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/content?section=seasonalPlans")
        const result = await response.json()
        if (result.content) {
          setData(JSON.parse(result.content))
        } else {
          // Fallback default data
          setData({
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
          })
        }
      } catch (error) {
        console.error("Error fetching seasonal plans:", error)
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <StyledSection id="seasonal-plans" className="py-20" backgroundImage="seasonalPlansBackgroundImage">
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

  if (!data) {
    return null
  }

  return (
    <StyledSection id="seasonal-plans" className="py-20" backgroundImage="seasonalPlansBackgroundImage">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">{data.title}</h2>
          <p className="text-xl text-gray-600">{data.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.plans.map((plan, index) => (
            <Card
              key={index}
              className={`${plan.color} border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
            >
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{plan.season}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.title}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="text-2xl font-bold text-green-600">{plan.price}</div>
                </div>

                <div className="space-y-2 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-gray-700">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">詳細を見る</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </StyledSection>
  )
}
