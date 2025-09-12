"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { StyledSection } from "./StyledSection"

interface ValuePropositionItem {
  title: string
  description: string
  icon: string
}

interface ValuePropositionData {
  title: string
  subtitle: string
  items: ValuePropositionItem[]
}

export default function ValueProposition() {
  const [data, setData] = useState<ValuePropositionData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/content?section=valueProposition")
        const result = await response.json()
        if (result.content) {
          setData(JSON.parse(result.content))
        } else {
          // Fallback default data
          setData({
            title: "4つの幸せな暮らしを実現",
            subtitle: "クリーンコンフォート千葉が提供する価値",
            items: [
              {
                title: "清潔で健康的な住環境",
                description: "プロの技術で徹底清掃し、家族の健康を守ります",
                icon: "🏠",
              },
              {
                title: "時間の有効活用",
                description: "清掃作業から解放され、大切な時間を有意義に過ごせます",
                icon: "⏰",
              },
              {
                title: "ストレスフリーな生活",
                description: "掃除の悩みから解放され、心地よい空間で過ごせます",
                icon: "😊",
              },
              {
                title: "専門的な仕上がり",
                description: "素人では難しい箇所も、プロの技術で美しく仕上げます",
                icon: "✨",
              },
            ],
          })
        }
      } catch (error) {
        console.error("Error fetching value proposition:", error)
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <StyledSection className="py-20" backgroundImage="valuePropositionBackgroundImage">
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
    <StyledSection className="py-20" backgroundImage="valuePropositionBackgroundImage">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">{data.title}</h2>
          <p className="text-xl text-gray-600">{data.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.items.map((item, index) => (
            <Card
              key={index}
              className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">{item.icon}</div>
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
