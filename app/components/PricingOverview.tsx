"use client"

import { useState, useEffect } from "react"

interface PricingItem {
  category: string
  services: {
    name: string
    price: string
    description: string
  }[]
}

const initialPricing: PricingItem[] = [
  {
    category: "エアコンクリーニング",
    services: [
      {
        name: "通常エアコン",
        price: "12,000円～",
        description: "壁掛けタイプの一般的なエアコン",
      },
      {
        name: "お掃除機能付きエアコン",
        price: "18,000円～",
        description: "自動清掃機能付きエアコン",
      },
      {
        name: "業務用エアコン",
        price: "25,000円～",
        description: "天井埋込み型・業務用エアコン",
      },
    ],
  },
  {
    category: "ハウスクリーニング",
    services: [
      {
        name: "1R・1K",
        price: "15,000円～",
        description: "ワンルーム・1Kのお部屋",
      },
      {
        name: "1DK・1LDK",
        price: "20,000円～",
        description: "1DK・1LDKのお部屋",
      },
      {
        name: "2LDK以上",
        price: "30,000円～",
        description: "2LDK以上のお部屋",
      },
    ],
  },
  {
    category: "水回りクリーニング",
    services: [
      {
        name: "キッチン",
        price: "15,000円～",
        description: "シンク・コンロ・換気扇込み",
      },
      {
        name: "浴室",
        price: "18,000円～",
        description: "浴槽・壁面・床・天井",
      },
      {
        name: "水回り5点セット",
        price: "68,000円～",
        description: "キッチン・浴室・トイレ・洗面台・洗濯機",
      },
    ],
  },
]

export default function PricingOverview() {
  const [pricing, setPricing] = useState<PricingItem[]>(initialPricing)

  useEffect(() => {
    const savedPricing = localStorage.getItem("pricingOverviewContent")
    if (savedPricing) {
      try {
        const parsedPricing = JSON.parse(savedPricing)
        setPricing(parsedPricing)
      } catch (error) {
        console.error("Error parsing saved pricing:", error)
      }
    }
  }, [])

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">料金体系</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            明確で分かりやすい料金設定で、安心してご利用いただけます。
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {pricing.map((category, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">{category.category}</h3>
              <div className="space-y-4">
                {category.services.map((service, serviceIndex) => (
                  <div key={serviceIndex} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">{service.name}</h4>
                      <span className="text-blue-600 font-bold">{service.price}</span>
                    </div>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">※料金は作業内容・汚れの程度により変動する場合があります。</p>
          <p className="text-gray-600">詳細な料金については、現地調査後にお見積もりをご提示いたします。</p>
        </div>
      </div>
    </section>
  )
}
