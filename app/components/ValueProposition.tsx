"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AnimatedSection from "./AnimatedSection"
import { useImageUrls } from "@/app/hooks/useImageUrls"
import ErrorMessage from "./ErrorMessage"

interface ValuePropositionData {
  title: string
  subtitle: string
  description: string
}

const defaultData: ValuePropositionData = {
  title: "千葉県で信頼のハウスクリーニング・エアコン清掃・便利屋サービス",
  subtitle: "プロの技術で、あなたの大切な空間を清潔で快適に",
  description:
    "クリーンコンフォート千葉は、千葉県全域でハウスクリーニング、エアコン清掃、便利屋サービスを提供しています。経験豊富なプロのスタッフが、最新の技術と環境に優しい洗剤を使用して、お客様の大切な空間を清潔で快適にいたします。",
}

export default function ValueProposition() {
  const [data, setData] = useState<ValuePropositionData>(defaultData)
  const { imageUrls, isLoading, error } = useImageUrls()

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/content?section=valueProposition")
      const content = await response.json()
      if (content && typeof content === "object") {
        setData(content)
      }
    } catch (error) {
      console.error("Error fetching value proposition:", error)
    }
  }

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
        <AnimatedSection>
          <Card className="bg-white bg-opacity-90 shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center text-gray-800">{data.title}</CardTitle>
              <p className="text-xl text-center text-gray-600 mt-4">{data.subtitle}</p>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700 leading-relaxed text-center">{data.description}</p>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </section>
  )
}
