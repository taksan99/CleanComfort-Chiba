"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ThumbsUp, Calendar, Sparkles } from "lucide-react"
import AnimatedSection from "./AnimatedSection"
import { useImageUrls } from "@/app/hooks/useImageUrls"
import ErrorMessage from "./ErrorMessage"

const trustSignals = [
  {
    icon: <Users className="h-12 w-12 text-blue-500" />,
    title: "10年以上",
    description: "豊富な清掃実績",
    color: "bg-blue-100",
  },
  {
    icon: <ThumbsUp className="h-12 w-12 text-green-500" />,
    title: "顧客満足度95%",
    description: "（2024年度自社調査）",
    color: "bg-green-100",
  },
  {
    icon: <Calendar className="h-12 w-12 text-yellow-500" />,
    title: "365日対応",
    description: "年中無休でサービス提供",
    color: "bg-yellow-100",
  },
  {
    icon: <Sparkles className="h-12 w-12 text-purple-500" />,
    title: "プロの技術",
    description: "経験豊富なスタッフが対応",
    color: "bg-purple-100",
  },
]

export default function TrustSignals() {
  const [signals, setSignals] = useState(trustSignals)

  const imageSections = useMemo(() => ["trustSignalsBackgroundImage"], [])
  const { imageUrls, isLoading, error } = useImageUrls()

  useEffect(() => {
    const savedSignals = localStorage.getItem("trustSignalsContent")
    if (savedSignals) {
      setSignals(JSON.parse(savedSignals))
    }
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <ErrorMessage message="信頼のシグナルの背景画像の読み込みに失敗しました" />
  }

  const backgroundImage = imageUrls.trustSignalsBackgroundImage?.url || "/placeholder.svg"

  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat py-16"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-white opacity-10"></div>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 bg-white bg-opacity-75 p-4 rounded-lg shadow-lg">
          実績と信頼
        </h2>
        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {signals.map((signal, index) => (
              <Card
                key={index}
                className={`${signal.color} hover:shadow-lg transition-shadow duration-300 bg-opacity-90`}
              >
                <CardHeader>
                  <div className="flex justify-center mb-4">{signal.icon}</div>
                  <CardTitle className="text-center" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)" }}>
                    {signal.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-600" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)" }}>
                    {signal.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
