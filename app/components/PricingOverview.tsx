"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Droplets, Wind, Wrench } from "lucide-react"

export interface PricingCategory {
  category: string
  icon: string
  color: string
  textColor: string
  borderColor: string
  items: { service: string; price: string }[]
}

const initialPricingData: PricingCategory[] = [
  {
    category: "掃除サービス",
    icon: "Droplet",
    color: "from-blue-500 to-cyan-400",
    textColor: "text-blue-700",
    borderColor: "border-blue-500",
    items: [
      { service: "水回り5点セット（浴室/キッチン/レンジフード/トイレ/洗面台）", price: "68,000円～" },
      { service: "浴室、キッチン、レンジフード", price: "20,000円～" },
      { service: "トイレ", price: "10,000円～" },
      { service: "ガラス・サッシクリーニング（3枚）", price: "10,000円～" },
      { service: "ベランダ", price: "6,000円～" },
    ],
  },
  {
    category: "エアコン掃除",
    icon: "Wind",
    color: "from-green-500 to-emerald-400",
    textColor: "text-green-700",
    borderColor: "border-green-500",
    items: [
      { service: "通常エアコンクリーニング", price: "12,000円～" },
      { service: "お掃除機能付きエアコン", price: "22,000円～" },
      { service: "ご家庭用埋込式エアコン", price: "25,000円～" },
      { service: "業務用4方向エアコン", price: "33,000円～" },
      { service: "室外機", price: "6,000円～" },
    ],
  },
  {
    category: "便利屋さんサービス",
    icon: "Wrench",
    color: "from-yellow-500 to-amber-400",
    textColor: "text-yellow-700",
    borderColor: "border-yellow-500",
    items: [
      { service: "害獣・害虫駆除", price: "10,000円～" },
      { service: "墓参り代行", price: "10,000円～" },
      { service: "ペットの世話（1回）", price: "3,000円～" },
      { service: "友達代行（1時間）", price: "5,000円～" },
      { service: "庭の手入れ", price: "8,000円～" },
      { service: "その他、どんなことでも！", price: "要相談" },
    ],
  },
]

export default function PricingOverview() {
  const [pricingData, setPricingData] = useState<PricingCategory[]>(initialPricingData)

  useEffect(() => {
    const savedPricingData = localStorage.getItem("pricingOverviewContent")
    if (savedPricingData) {
      try {
        const parsedPricingData = JSON.parse(savedPricingData)
        setPricingData(parsedPricingData)
      } catch (error) {
        console.error("Error parsing saved pricing data:", error)
      }
    }
  }, [])

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Droplet":
        return <Droplets className="w-8 h-8 text-blue-600" />
      case "Wind":
        return <Wind className="w-8 h-8 text-green-600" />
      case "Wrench":
        return <Wrench className="w-8 h-8 text-yellow-600" />
      default:
        return <Droplets className="w-8 h-8 text-blue-600" />
    }
  }

  return (
    <section id="pricing-overview" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">料金体系</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            明確で分かりやすい料金設定。お客様のニーズに合わせたプランをご用意しています。
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingData.map((category, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  {getIconComponent(category.icon)}
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between items-start p-3 rounded-lg hover:bg-gray-50">
                      <div className="flex-1 pr-2">
                        <span className="text-sm text-gray-700 leading-relaxed">{item.service}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-gray-800 whitespace-nowrap">{item.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Button className="w-full">詳細を見る</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            ※ 料金は作業内容や現場の状況により変動する場合があります。詳細はお気軽にお問い合わせください。
          </p>
          <Button size="lg" className="px-8">
            無料見積もりを依頼する
          </Button>
        </div>
      </div>
    </section>
  )
}
