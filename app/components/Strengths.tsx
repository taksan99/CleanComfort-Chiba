"use client"

import { useState, useEffect } from "react"

interface Strength {
  title: string
  description: string
  icon: string
}

const initialStrengths: Strength[] = [
  {
    title: "豊富な経験と実績",
    description: "千葉県内で多数のお客様にご利用いただき、確かな技術と信頼を築いてきました。",
    icon: "🏆",
  },
  {
    title: "丁寧な作業",
    description: "お客様の大切なお住まいを扱う責任を持ち、細部まで丁寧に作業いたします。",
    icon: "✨",
  },
  {
    title: "適正価格",
    description: "高品質なサービスを適正な価格でご提供し、お客様にご満足いただいています。",
    icon: "💰",
  },
  {
    title: "アフターサポート",
    description: "作業後のフォローアップも充実。何かご不明な点があればお気軽にご相談ください。",
    icon: "🤝",
  },
]

export default function Strengths() {
  const [strengths, setStrengths] = useState<Strength[]>(initialStrengths)

  useEffect(() => {
    const savedStrengths = localStorage.getItem("strengthsContent")
    if (savedStrengths) {
      try {
        const parsedStrengths = JSON.parse(savedStrengths)
        setStrengths(parsedStrengths)
      } catch (error) {
        console.error("Error parsing saved strengths:", error)
      }
    }
  }, [])

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">私たちの強み</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">お客様に選ばれ続ける理由をご紹介します。</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {strengths.map((strength, index) => (
            <div key={index} className="text-center">
              <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">{strength.icon}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{strength.title}</h3>
              <p className="text-gray-600">{strength.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
