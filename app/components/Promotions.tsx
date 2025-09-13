"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Repeat, Sparkles } from "lucide-react"
import AnimatedSection from "./AnimatedSection"
import { motion } from "framer-motion"
import { useImageUrls } from "@/app/hooks/useImageUrls"
import ErrorMessage from "./ErrorMessage"

const ShiningDiscount = ({ text }: { text: string }) => (
  <span className="inline-block text-5xl font-bold text-yellow-300 animate-pulse shadow-lg">{text}</span>
)

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

interface PromotionsData {
  campaignText: string
  promotions: PromotionCard[]
}

const defaultPromotions: PromotionsData = {
  campaignText: "最大50%OFF！　春のお掃除キャンペーン実施中！",
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
}

export default function Promotions() {
  const [promotionsData, setPromotionsData] = useState<PromotionsData>(defaultPromotions)
  const { imageUrls, isLoading, error } = useImageUrls()

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/content?section=promotions")
      const content = await response.json()
      if (content && typeof content === "object") {
        setPromotionsData(content)
      }
    } catch (error) {
      console.error("Error fetching promotions:", error)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <ErrorMessage message="プロモーションの背景画像の読み込みに失敗しました" />
  }

  const backgroundImage = imageUrls.promotionsBackgroundImage?.url || "/placeholder.svg"

  const currentDate = new Date().toISOString().split("T")[0]
  const activePromotions = promotionsData.promotions.filter(
    (promo) => promo.isActive && promo.startDate <= currentDate && promo.endDate >= currentDate,
  )

  // A/Bテストのためのバリアント選択
  const getVariant = (id: string) => {
    const storedVariant = localStorage.getItem(`promotion_variant_${id}`)
    if (storedVariant) {
      return storedVariant as "A" | "B"
    }
    const newVariant = Math.random() < 0.5 ? "A" : "B"
    localStorage.setItem(`promotion_variant_${id}`, newVariant)
    return newVariant
  }

  return (
    <section
      id="promotions"
      className="relative bg-cover bg-center bg-no-repeat py-16"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundAttachment: "fixed" }}
    >
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 bg-white bg-opacity-75 p-4 rounded-lg shadow-lg">
          お得な特典
        </h2>
        <AnimatedSection>
          <div className="flex flex-wrap justify-center gap-8 mx-4">
            {activePromotions.map((promotion, index) => {
              const variant = getVariant(promotion.id)
              const cardColor = index % 2 === 0 ? "from-blue-500 to-blue-700" : "from-green-500 to-green-700"
              return (
                <motion.div
                  key={promotion.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)]"
                >
                  <Card
                    className={`bg-gradient-to-br ${cardColor} text-white hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col justify-between`}
                  >
                    <CardHeader>
                      <CardTitle
                        className="flex items-center text-2xl"
                        style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
                      >
                        {index % 2 === 0 ? <Users className="h-8 w-8 mr-2" /> : <Repeat className="h-8 w-8 mr-2" />}
                        {promotion.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-between h-full">
                      <div>
                        <p className="text-lg mb-4" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.2)" }}>
                          {variant === "A" ? promotion.description : `${promotion.description}`}
                        </p>
                        <ShiningDiscount text={promotion.discount} />
                      </div>
                      {promotion.note && <p className="mt-4 text-sm">{promotion.note}</p>}
                      <p className="mt-2 text-sm">有効期限: {new Date(promotion.endDate).toLocaleDateString()}まで</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-gradient-to-r from-pink-400 via-pink-500 to-rose-500 text-white inline-block hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-4">
                <Sparkles className="h-6 w-6 inline-block mr-2" />
                <span className="text-lg font-semibold" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.2)" }}>
                  {promotionsData.campaignText}
                </span>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  )
}
