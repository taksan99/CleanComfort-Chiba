"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import AnimatedSection from "./AnimatedSection"
import { useImageUrls } from "../hooks/useImageUrls"

interface ValuePropositionItem {
  title: string
  description: string
  icon: string
}

const defaultItems: ValuePropositionItem[] = [
  { title: "清潔で快適な住環境", description: "プロの技術で隅々まで清潔に", icon: "✨" },
  { title: "時間の有効活用", description: "掃除の時間を大切な時間に", icon: "⏰" },
  { title: "健康的な生活空間", description: "アレルゲンや細菌を徹底除去", icon: "🌿" },
  { title: "心の安らぎ", description: "美しい空間で心もリフレッシュ", icon: "💆‍♀️" },
]

export default function ValueProposition() {
  const [items, setItems] = useState<ValuePropositionItem[]>(defaultItems)
  const { imageUrls, isLoading, error } = useImageUrls()

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/content?section=valueProposition")
      const data = await response.json()
      if (data.content) {
        setItems(data.content)
      }
    } catch (error) {
      console.error("Error fetching value proposition content:", error)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    console.error("Error loading value proposition images:", error)
  }

  const backgroundImage = imageUrls.valuePropositionBackgroundImage?.url

  return (
    <section
      id="value-proposition"
      className="relative bg-cover bg-center bg-no-repeat py-16"
      style={{
        backgroundImage: `url(${backgroundImage || "/placeholder.svg"})`,
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection>
          <h2 className="text-4xl font-bold text-center mb-12 text-white">4つの幸せな暮らし</h2>
        </AnimatedSection>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, index) => (
            <AnimatedSection key={index}>
              <Card className="text-center h-full bg-white bg-opacity-95 hover:bg-opacity-100 transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
