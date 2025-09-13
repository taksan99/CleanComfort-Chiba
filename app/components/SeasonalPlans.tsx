"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Flower, Sun, Leaf, Snowflake } from "lucide-react"
import { useImageUrls } from "../hooks/useImageUrls"

interface SeasonalPlan {
  season: string
  title: string
  description: string
}

const initialSeasonalPlans: SeasonalPlan[] = [
  {
    season: "春",
    title: "花粉対策セット",
    description: "エアコン＋換気扇クリーニング",
  },
  {
    season: "夏",
    title: "猛暑対策プラン",
    description: "エアコン全台クリーニング または 浴室クリーニング",
  },
  {
    season: "秋",
    title: "寒さ対策セット",
    description: "エアコン＋窓ガラスクリーニング",
  },
  {
    season: "冬",
    title: "大掃除応援パック",
    description: "エアコン＋リビングクリーニング（床清掃・ワックスがけ）",
  },
]

export default function SeasonalPlans() {
  const { imageUrls } = useImageUrls()
  const [seasonalPlans, setSeasonalPlans] = useState<SeasonalPlan[]>(initialSeasonalPlans)

  useEffect(() => {
    const savedSeasonalPlans = localStorage.getItem("seasonalPlansContent")
    if (savedSeasonalPlans) {
      try {
        const parsedSeasonalPlans = JSON.parse(savedSeasonalPlans)
        setSeasonalPlans(parsedSeasonalPlans)
      } catch (error) {
        console.error("Error parsing saved seasonal plans:", error)
      }
    }
  }, [])

  const seasonIcons = {
    春: Flower,
    夏: Sun,
    秋: Leaf,
    冬: Snowflake,
  }

  const seasonColors = {
    春: "from-pink-500 to-rose-400",
    夏: "from-yellow-500 to-orange-400",
    秋: "from-orange-500 to-red-400",
    冬: "from-blue-500 to-cyan-400",
  }

  return (
    <section id="seasonal-plans" className="py-20 bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">季節別おすすめプラン</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            季節に合わせた最適なクリーニングプランをご提案します。
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {seasonalPlans.map((plan, index) => {
            const IconComponent = seasonIcons[plan.season as keyof typeof seasonIcons] || Flower
            const colorClass = seasonColors[plan.season as keyof typeof seasonColors] || "from-gray-500 to-gray-400"

            return (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800">{plan.season}のおすすめ</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">{plan.title}</h3>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">{plan.description}</p>
                  <Button className="w-full">詳細を見る</Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
