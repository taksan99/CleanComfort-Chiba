"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import AnimatedSection from "./AnimatedSection"
import { useImageUrls } from "@/app/hooks/useImageUrls"
import ErrorMessage from "./ErrorMessage"

interface ValuePropositionItem {
  icon: string
  title: string
  description: string
}

const initialItems: ValuePropositionItem[] = [
  {
    icon: "✨",
    title: "清潔で快適な住環境",
    description: "プロの技術で隅々まで清潔に",
  },
  {
    icon: "⏰",
    title: "時間の有効活用",
    description: "掃除の時間を大切な時間に",
  },
  {
    icon: "🌿",
    title: "健康的な生活空間",
    description: "アレルゲンや細菌を徹底除去",
  },
  {
    icon: "💆‍♀️",
    title: "心の安らぎ",
    description: "美しい空間で心もリフレッシュ",
  },
]

export default function ValueProposition() {
  const [items, setItems] = useState<ValuePropositionItem[]>(initialItems)
  const { imageUrls, isLoading, error } = useImageUrls()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/site-content?section=valueProposition")
        const data = await response.json()
        if (data && Array.isArray(data)) {
          setItems(data)
        }
      } catch (error) {
        console.error("Error fetching value proposition:", error)
        // Fallback to localStorage
        const saved = localStorage.getItem("valuePropositionContent")
        if (saved) {
          setItems(JSON.parse(saved))
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

  const backgroundImage = imageUrls.valuePropositionBackgroundImage?.url || "/placeholder.svg"

  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat py-16"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-white bg-black bg-opacity-50 p-4 rounded-lg shadow-lg">
          4つの幸せな暮らし
        </h2>
        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map((item, index) => (
              <Card key={index} className="bg-white bg-opacity-90 hover:bg-opacity-100 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
