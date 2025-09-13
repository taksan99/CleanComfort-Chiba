"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Star, Clock, Shield } from "lucide-react"
import AnimatedSection from "./AnimatedSection"
import { useImageUrls } from "@/app/hooks/useImageUrls"
import ErrorMessage from "./ErrorMessage"

interface ValueProp {
  title: string
  description: string
  icon: React.ElementType
  color: string
  example: string
  benefit: string
}

const initialValueProps: ValueProp[] = [
  {
    title: "最短翌日対応",
    description: "急な来客にも対応可能。緊急時、受付時間外や当日対応も可（要相談）",
    icon: Clock,
    color: "bg-blue-500",
    example: "金曜の夜、週末の来客が決定。土曜の朝一番で連絡すると、その日の午後には綺麗なお部屋に。",
    benefit: "急なご要望にも可能な限り対応し、あなたの「困った！」を解決します。",
  },
  {
    title: "プロの技術",
    description: "頑固な汚れも撃退、見違えるほどの清潔さを実現",
    icon: Star,
    color: "bg-green-500",
    example: "何年も落ちなかったキッチンの油汚れが、特殊な洗剤と技術であっという間にピカピカに。",
    benefit: "プロの技術で、諦めていた汚れも解消。新築のような清潔感が復活します。",
  },
  {
    title: "総合的なハウスケア、サブスク",
    description: "忙しい方向けに時間と労力を大幅節約",
    icon: Shield,
    color: "bg-yellow-500",
    example: "仕事で忙しい共働き夫婦。帰宅するとベッドメイキングから洗濯物の片付けまで全て完了。",
    benefit: "家事の負担を軽減し、大切な人との時間や自分の趣味の時間を増やせます。",
  },
  {
    title: "アレルギー対策",
    description: "特殊洗剤使用で、家族の健康をサポート",
    icon: CheckCircle,
    color: "bg-purple-500",
    example: "花粉症の息子さんの症状が、定期的な清掃とエアコンフィルターの徹底洗浄で軽減。",
    benefit: "アレルギー症状の緩和に貢献し、家族全員が快適に過ごせる空間を作ります。",
  },
]

const textShadowStyle = {
  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
}

export default function ValueProposition() {
  const [valueProps, setValueProps] = useState<ValueProp[]>(initialValueProps)
  const { imageUrls, isLoading, error } = useImageUrls()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/site-content?section=valueProposition")
        const data = await response.json()
        if (data && Array.isArray(data)) {
          const mappedValueProps = data.map((prop, index) => ({
            ...prop,
            icon: initialValueProps[index]?.icon || initialValueProps[0].icon,
            color: initialValueProps[index]?.color || initialValueProps[0].color,
          }))
          setValueProps(mappedValueProps)
        }
      } catch (error) {
        console.error("Error fetching value propositions:", error)
        // Fallback to localStorage
        const savedValueProps = localStorage.getItem("valuePropositionContent")
        if (savedValueProps) {
          const parsedValueProps = JSON.parse(savedValueProps) as ValueProp[]
          setValueProps(
            parsedValueProps.map((prop, index) => ({
              ...prop,
              icon: initialValueProps[index].icon,
              color: initialValueProps[index].color,
            })),
          )
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
    <div
      className="relative bg-cover bg-center bg-no-repeat min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 bg-white bg-opacity-75 p-4 rounded-lg shadow-lg">
          クリーンコンフォート千葉が約束する
          <br />
          <span className="text-blue-600 text-shadow">4つの幸せな暮らし</span>
        </h2>
        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {valueProps.map((prop, index) => (
              <Card
                key={index}
                className={`overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white bg-opacity-90`}
              >
                <CardHeader className={`${prop.color} text-white`}>
                  <CardTitle className="flex items-center">
                    <prop.icon className="h-6 w-6 mr-2" />
                    {prop.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-gray-600 mb-4" style={textShadowStyle}>
                    {prop.description}
                  </p>
                  <h4 className="font-semibold mb-2" style={textShadowStyle}>
                    お客様の声：
                  </h4>
                  <p className="text-sm text-gray-700 mb-4 italic" style={textShadowStyle}>
                    "{prop.example}"
                  </p>
                  <h4 className="font-semibold mb-2" style={textShadowStyle}>
                    あなたへの価値：
                  </h4>
                  <p className="text-sm text-gray-700" style={textShadowStyle}>
                    {prop.benefit}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
