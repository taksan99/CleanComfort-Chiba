"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, UserCheck, Leaf, Home } from "lucide-react"
import AnimatedSection from "./AnimatedSection"
import { useImageUrls } from "@/app/hooks/useImageUrls"
import ErrorMessage from "./ErrorMessage"

interface Strength {
  title: string
  description: string
  icon: any
  color: string
  iconColor: string
}

const strengths = [
  {
    title: "翌日対応、365日対応",
    description: "お急ぎの方も安心。年中無休でサービスを提供しています。",
    icon: Clock,
    color: "bg-blue-100 hover:bg-blue-200",
    iconColor: "text-blue-600",
  },
  {
    title: "経験豊富なプロのスタッフ",
    description: "熟練のスタッフが丁寧に作業いたします。",
    icon: UserCheck,
    color: "bg-green-100 hover:bg-green-200",
    iconColor: "text-green-600",
  },
  {
    title: "エコフレンドリーな洗剤使用",
    description: "環境と健康に配慮した安全な洗剤を使用しています。",
    icon: Leaf,
    color: "bg-yellow-100 hover:bg-yellow-200",
    iconColor: "text-yellow-600",
  },
  {
    title: "地域密着で安心",
    description: "千葉県の地域事情を熟知したスタッフが対応します。",
    icon: Home,
    color: "bg-purple-100 hover:bg-purple-200",
    iconColor: "text-purple-600",
  },
]

export default function Strengths() {
  const [localStrengths, setLocalStrengths] = useState<Strength[]>(strengths)
  const { imageUrls, isLoading, error } = useImageUrls()

  useEffect(() => {
    const savedStrengths = localStorage.getItem("strengthsContent")
    if (savedStrengths) {
      setLocalStrengths(JSON.parse(savedStrengths))
    }
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
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 bg-white bg-opacity-75 p-4 rounded-lg shadow-lg">
          私たちの強み
        </h2>
        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {strengths.map((strength, index) => (
              <Card
                key={index}
                className={`${strength.color} hover:shadow-lg transition-all duration-300 bg-opacity-90`}
              >
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <strength.icon className={`h-12 w-12 ${strength.iconColor}`} />
                  </div>
                  <CardTitle className="text-center" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)" }}>
                    {strength.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-600" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)" }}>
                    {strength.description}
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
