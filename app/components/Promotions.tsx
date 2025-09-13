"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Gift, Users } from "lucide-react"

interface PromotionCard {
  id: string
  title: string
  description: string
  discount: string
  note?: string
  startDate: string
  endDate: string
  isActive: boolean
  variant: "A" | "B"
}

const initialPromotions: PromotionCard[] = [
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
]

export default function Promotions() {
  const [promotions, setPromotions] = useState<PromotionCard[]>(initialPromotions)
  const [campaignText, setCampaignText] = useState("最大50%OFF！　春のお掃除キャンペーン実施中！")

  useEffect(() => {
    const savedPromotions = localStorage.getItem("promotionsContent")
    if (savedPromotions) {
      try {
        const parsedPromotions = JSON.parse(savedPromotions)
        setPromotions(parsedPromotions)
      } catch (error) {
        console.error("Error parsing saved promotions:", error)
      }
    }

    const savedCampaignText = localStorage.getItem("promotionsCampaignText")
    if (savedCampaignText) {
      setCampaignText(savedCampaignText)
    }
  }, [])

  // アクティブなプロモーションのみを表示
  const activePromotions = promotions.filter((promotion) => promotion.isActive)

  return (
    <section id="promotions" className="py-20 bg-gradient-to-br from-red-50 to-pink-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">お得な特典</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            お客様への感謝を込めて、様々な特典をご用意しています。
          </p>

          {campaignText && (
            <div className="mt-8 p-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg shadow-lg">
              <p className="text-lg font-bold">{campaignText}</p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {activePromotions.map((promotion, index) => (
            <Card
              key={promotion.id}
              className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                  {promotion.title.includes("紹介") ? (
                    <Users className="w-8 h-8 text-white" />
                  ) : (
                    <Gift className="w-8 h-8 text-white" />
                  )}
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">{promotion.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">{promotion.description}</p>
                <Badge variant="destructive" className="text-2xl font-bold py-2 px-4 mb-4">
                  {promotion.discount}
                </Badge>
                {promotion.note && <p className="text-sm text-gray-500 mb-6">{promotion.note}</p>}
                <Button className="w-full">詳細を見る</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
