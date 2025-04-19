"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, PiggyBank, HeartHandshake } from "lucide-react"
import AnimatedSection from "./AnimatedSection"
import { useMultipleImageCache } from "@/app/hooks/useMultipleImageCache"
import ErrorMessage from "./ErrorMessage"

const reasons = [
  {
    icon: <CheckCircle className="h-12 w-12 text-blue-500" />,
    title: "丁寧な作業",
    description: "プロの技術で隅々まで丁寧に清掃いたします。",
    color: "bg-blue-100",
  },
  {
    icon: <Clock className="h-12 w-12 text-green-500" />,
    title: "迅速な対応",
    description: "お客様のご要望に素早く対応いたします。",
    color: "bg-green-100",
  },
  {
    icon: <PiggyBank className="h-12 w-12 text-yellow-500" />,
    title: "安心の料金",
    description: "明確な料金体系で、追加料金の心配はありません。",
    color: "bg-yellow-100",
  },
  {
    icon: <HeartHandshake className="h-12 w-12 text-purple-500" />,
    title: "アフターフォロー",
    description: "作業後のフォローアップも万全です。",
    color: "bg-purple-100",
  },
]

export default function Reasons() {
  const imageSections = useMemo(() => ["reasonsBackgroundImage"], [])
  const { imageUrls, isLoading, error } = useMultipleImageCache(imageSections)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <ErrorMessage message="選ばれる理由の背景画像の読み込みに失敗しました" />
  }

  const backgroundImage = imageUrls.reasonsBackgroundImage || "/placeholder.svg"

  return (
    <section className="py-16 bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 bg-white bg-opacity-75 p-4 rounded-lg shadow-lg">
          選ばれる理由
        </h2>
        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {reasons.map((reason, index) => (
              <Card
                key={index}
                className={`${reason.color} hover:shadow-lg transition-shadow duration-300 bg-opacity-90`}
              >
                <CardHeader>
                  <div className="flex justify-center mb-4">{reason.icon}</div>
                  <CardTitle className="text-center" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)" }}>
                    {reason.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-600" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)" }}>
                    {reason.description}
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
