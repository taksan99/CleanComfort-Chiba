"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ThumbsUp, Calendar, Sparkles } from "lucide-react"
import AnimatedSection from "./AnimatedSection"
import { useImageUrls } from "@/app/hooks/useImageUrls"
import ErrorMessage from "./ErrorMessage"

interface TrustSignal {
  title: string
  description: string
  icon: any
  color: string
}

const defaultTrustSignals = [
  {
    title: "10年以上",
    description: "豊富な清掃実績",
    icon: Users,
    color: "bg-blue-100",
  },
  {
    title: "顧客満足度95%",
    description: "（2024年度自社調査）",
    icon: ThumbsUp,
    color: "bg-green-100",
  },
  {
    title: "365日対応",
    description: "年中無休でサービス提供",
    icon: Calendar,
    color: "bg-yellow-100",
  },
  {
    title: "プロの技術",
    description: "経験豊富なスタッフが対応",
    icon: Sparkles,
    color: "bg-purple-100",
  },
]

export default function TrustSignals() {
  const [signals, setSignals] = useState(defaultTrustSignals)
  const { imageUrls, isLoading, error } = useImageUrls()

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch("/api/content?section=trustSignals")
        if (response.ok) {
          const data = await response.json()
          if (data.content) {
            const updatedSignals = defaultTrustSignals.map((defaultSignal, index) => ({
              ...defaultSignal,
              title: data.content[index]?.title || defaultSignal.title,
              description: data.content[index]?.description || defaultSignal.description,
            }))
            setSignals(updatedSignals)
          }
        }
      } catch (error) {
        console.error("Error fetching trust signals content:", error)
        // フォールバック: localStorageから取得
        const savedSignals = localStorage.getItem("trustSignalsContent")
        if (savedSignals) {
          const parsedSignals = JSON.parse(savedSignals)
          const updatedSignals = defaultTrustSignals.map((defaultSignal, index) => ({
            ...defaultSignal,
            title: parsedSignals[index]?.title || defaultSignal.title,
            description: parsedSignals[index]?.description || defaultSignal.description,
          }))
          setSignals(updatedSignals)
        }
      }
    }
    fetchContent()
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
                  <div className="flex justify-center mb-4">
                    <signal.icon className="h-12 w-12 text-blue-500" />
                  </div>
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
