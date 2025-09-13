"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Users, Leaf, MapPin } from "lucide-react"

interface Strength {
  title: string
  description: string
}

const initialStrengths: Strength[] = [
  {
    title: "翌日対応、365日対応",
    description: "お急ぎの方も安心。年中無休でサービスを提供しています。",
  },
  {
    title: "経験豊富なプロのスタッフ",
    description: "熟練のスタッフが丁寧に作業いたします。",
  },
  {
    title: "エコフレンドリーな洗剤使用",
    description: "環境と健康に配慮した安全な洗剤を使用しています。",
  },
  {
    title: "地域密着で安心",
    description: "千葉県の地域事情を熟知したスタッフが対応します。",
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

  const icons = [Clock, Users, Leaf, MapPin]

  return (
    <section id="strengths" className="py-20 bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">私たちの強み</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            クリーンコンフォート千葉が選ばれる理由をご紹介します。
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {strengths.map((strength, index) => {
            const IconComponent = icons[index]
            return (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{strength.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{strength.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
