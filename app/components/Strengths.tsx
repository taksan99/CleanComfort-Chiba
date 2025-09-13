"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import AnimatedSection from "./AnimatedSection"
import { useImageUrls } from "@/app/hooks/useImageUrls"
import ErrorMessage from "./ErrorMessage"

interface StrengthItem {
  icon: string
  title: string
  description: string
}

const initialStrengths: StrengthItem[] = [
  {
    icon: "⚡",
    title: "最短翌日対応",
    description: "お急ぎのご依頼にも迅速に対応いたします",
  },
  {
    icon: "🕐",
    title: "365日対応",
    description: "年中無休でお客様のご要望にお応えします",
  },
  {
    icon: "👨‍🔧",
    title: "経験豊富なプロのスタッフ",
    description: "確かな技術と豊富な経験を持つスタッフが対応",
  },
  {
    icon: "🌱",
    title: "エコフレンドリーな洗剤使用",
    description: "環境に優しい洗剤で安心・安全なクリーニング",
  },
  {
    icon: "🏠",
    title: "地域密着で安心",
    description: "千葉県を中心とした地域密着型のサービス",
  },
]

export default function Strengths() {
  const [strengths, setStrengths] = useState<StrengthItem[]>(initialStrengths)
  const { imageUrls, isLoading, error } = useImageUrls()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/site-content?section=strengths")
        const data = await response.json()
        if (data && Array.isArray(data)) {
          setStrengths(data)
        }
      } catch (error) {
        console.error("Error fetching strengths:", error)
        // Fallback to localStorage
        const saved = localStorage.getItem("strengthsContent")
        if (saved) {
          setStrengths(JSON.parse(saved))
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

  const backgroundImage = imageUrls.strengthsBackgroundImage?.url || "/placeholder.svg"

  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat py-16"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-white bg-black bg-opacity-50 p-4 rounded-lg shadow-lg">
          私たちの強み
        </h2>
        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {strengths.map((strength, index) => (
              <Card key={index} className="bg-white bg-opacity-90 hover:bg-opacity-100 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{strength.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{strength.title}</h3>
                  <p className="text-gray-600">{strength.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
