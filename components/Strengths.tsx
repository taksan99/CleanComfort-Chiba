"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AnimatedSection from "@/app/components/AnimatedSection"
import { useImageUrls } from "@/app/hooks/useImageUrls"
import { CheckCircle, Clock, Users, Leaf, MapPin } from "lucide-react"

interface Strength {
  title: string
  description: string
}

const defaultStrengths: Strength[] = [
  {
    title: "翌日対応、365日対応",
    description: "お急ぎの方も安心。年中無休でサービスを提供しています。",
  },
  {
    title: "経験豊富なプロのスタッフ",
    description: "熟練のスタッフが丁寧に作業いたします。",
  },
  {
    title: "エコフレンドリーな洗剤使用",
    description: "環境と健康に配慮した安全な洗剤を使用しています。",
  },
  {
    title: "地域密着で安心",
    description: "千葉県の地域事情を熟知したスタッフが対応します。",
  },
]

const icons = [Clock, Users, Leaf, MapPin]

export default function Strengths() {
  const [strengths, setStrengths] = useState<Strength[]>(defaultStrengths)
  const [isLoading, setIsLoading] = useState(true)
  const { imageUrls } = useImageUrls()

  useEffect(() => {
    fetchStrengths()
  }, [])

  const fetchStrengths = async () => {
    try {
      const response = await fetch("/api/content?section=strengths")
      const data = await response.json()

      if (data && Array.isArray(data) && data.length > 0) {
        setStrengths(data)
      } else {
        setStrengths(defaultStrengths)
      }
    } catch (error) {
      console.error("Error fetching strengths:", error)
      setStrengths(defaultStrengths)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading...</div>
        </div>
      </section>
    )
  }

  const backgroundImage = imageUrls.strengthsBackgroundImage?.url || "/placeholder.svg"

  return (
    <section
      className="relative py-16 bg-gray-50"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-white bg-opacity-90"></div>
      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">私たちの強み</h2>
            <p className="text-xl text-gray-600">お客様に選ばれ続ける理由があります</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {strengths.map((strength, index) => {
              const IconComponent = icons[index] || CheckCircle
              return (
                <Card
                  key={index}
                  className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-800">{strength.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center leading-relaxed">{strength.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
