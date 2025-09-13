"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AnimatedSection from "./AnimatedSection"
import { Droplet, Wind, Wrench } from "lucide-react"
import ErrorMessage from "./ErrorMessage"
import { useImageUrls } from "@/app/hooks/useImageUrls"

export interface PricingCategory {
  category: string
  icon: "Droplet" | "Wind" | "Wrench"
  color: string
  textColor: string
  borderColor: string
  items: { service: string; price: string }[]
}

const iconMap = {
  Droplet: Droplet,
  Wind: Wind,
  Wrench: Wrench,
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
  const maxItems = Math.max(...pricingData.map((category) => category.items.length))

  const imageSections = useMemo(() => ["pricingOverviewBackgroundImage"], [])
  // const { imageUrls, isLoading, error } = useMultipleImageCache(imageSections)
  const { imageUrls, isLoading, error } = useImageUrls()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/site-content?section=pricingOverview")
        const data = await response.json()
        if (data && Array.isArray(data) && data.length > 0) {
          setPricingData(data)
        }
      } catch (error) {
        console.error("Error fetching pricing data:", error)
        // Fallback to localStorage
        const savedPricingData = localStorage.getItem("pricingOverviewContent")
        if (savedPricingData) {
          try {
            const parsedData = JSON.parse(savedPricingData)
            if (Array.isArray(parsedData) && parsedData.length > 0) {
              setPricingData(parsedData)
            }
          } catch (error) {
            console.error("Error parsing saved pricing data:", error)
          }
        }
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <ErrorMessage message={error.message} />
  }

  const backgroundImage = imageUrls.pricingOverviewBackgroundImage?.url || "/placeholder.svg"

  return (
    <section
      id="pricing-overview"
      className="relative bg-cover bg-center bg-no-repeat py-16"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-white opacity-20"></div>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 bg-white bg-opacity-75 p-4 rounded-lg shadow-lg">
          料金体系（基本サービス）
        </h2>
        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pricingData.map((category) => {
              const Icon = iconMap[category.icon]
              return (
                <Card
                  key={category.category}
                  className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white bg-opacity-90"
                >
                  <CardHeader className={`bg-gradient-to-r ${category.color} text-white`}>
                    <CardTitle
                      className="flex items-center justify-between"
                      style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)" }}
                    >
                      <span>{category.category}</span>
                      <Icon className="h-6 w-6" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-4" style={{ minHeight: `${maxItems * 2.5}rem` }}>
                      {category.items.map((item) => (
                        <li
                          key={item.service}
                          className={`flex justify-between items-center border-b ${category.borderColor} pb-2`}
                        >
                          <span
                            className={`${category.textColor} pl-4 border-l-4 ${category.borderColor}`}
                            style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)" }}
                          >
                            {item.service}
                          </span>
                          <span className="font-semibold" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)" }}>
                            {item.price}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </AnimatedSection>
        <div className="text-center mt-8">
          <p className="text-sm text-gray-800 bg-white bg-opacity-75 p-2 rounded-lg inline-block mx-auto">
            ※ 料金は目安です。詳細は無料見積もりをご利用ください。出張費が別途かかる場合があります。
          </p>
        </div>
      </div>
    </section>
  )
}
