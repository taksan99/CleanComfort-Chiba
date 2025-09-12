"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { StyledSection } from "./StyledSection"

interface StrengthItem {
  title: string
  description: string
  icon: string
}

interface StrengthsData {
  title: string
  subtitle: string
  items: StrengthItem[]
}

export default function Strengths() {
  const [data, setData] = useState<StrengthsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/content?section=strengths")
        const result = await response.json()
        if (result.content) {
          setData(JSON.parse(result.content))
        } else {
          // Fallback default data
          setData({
            title: "私たちの強み",
            subtitle: "選ばれ続ける理由",
            items: [
              {
                title: "千葉県全域対応",
                description: "千葉県内どこでも迅速にお伺いします",
                icon: "🌍",
              },
              {
                title: "最短翌日対応",
                description: "急なご依頼にも柔軟に対応いたします",
                icon: "⚡",
              },
              {
                title: "エコフレンドリー洗剤",
                description: "環境と人体に優しい洗剤を使用",
                icon: "🌱",
              },
              {
                title: "明確な料金体系",
                description: "追加料金なしの安心価格設定",
                icon: "💰",
              },
              {
                title: "プロの技術力",
                description: "経験豊富なスタッフによる高品質サービス",
                icon: "👨‍🔧",
              },
              {
                title: "アフターフォロー",
                description: "サービス後のフォローアップも万全",
                icon: "📞",
              },
            ],
          })
        }
      } catch (error) {
        console.error("Error fetching strengths:", error)
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <StyledSection className="py-20" backgroundImage="strengthsBackgroundImage">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </StyledSection>
    )
  }

  if (!data) {
    return null
  }

  return (
    <StyledSection className="py-20" backgroundImage="strengthsBackgroundImage">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">{data.title}</h2>
          <p className="text-xl text-gray-600">{data.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.items.map((item, index) => (
            <Card
              key={index}
              className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </StyledSection>
  )
}
