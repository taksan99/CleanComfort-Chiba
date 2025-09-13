"use client"

import { useState, useEffect } from "react"

interface Promotion {
  title: string
  description: string
  discount: string
  conditions: string
  validUntil: string
}

const initialPromotions: Promotion[] = [
  {
    title: "初回利用特典",
    description: "初めてご利用のお客様限定の特別価格",
    discount: "20%OFF",
    conditions: "全サービス対象（一部除く）",
    validUntil: "期限なし",
  },
  {
    title: "セット割引",
    description: "複数サービスをまとめてご利用でお得",
    discount: "最大30%OFF",
    conditions: "2サービス以上同時利用",
    validUntil: "通年",
  },
  {
    title: "リピーター特典",
    description: "2回目以降のご利用でさらにお得",
    discount: "15%OFF",
    conditions: "前回利用から6ヶ月以内",
    validUntil: "通年",
  },
  {
    title: "季節限定キャンペーン",
    description: "季節に合わせた特別プラン",
    discount: "特別価格",
    conditions: "季節プラン限定",
    validUntil: "各季節末まで",
  },
]

export default function Promotions() {
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions)

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
  }, [])

  return (
    <section className="py-20 bg-gradient-to-br from-red-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">お得な特典</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            様々な特典をご用意して、お客様のご利用をお待ちしています。
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {promotions.map((promotion, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-center mb-4">
                <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {promotion.discount}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">{promotion.title}</h3>
              <p className="text-gray-600 mb-4">{promotion.description}</p>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-semibold text-gray-700">条件：</span>
                  <span className="text-gray-600">{promotion.conditions}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">有効期限：</span>
                  <span className="text-gray-600">{promotion.validUntil}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">※特典の併用はできません。詳細はお問い合わせください。</p>
        </div>
      </div>
    </section>
  )
}
