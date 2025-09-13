"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sun, Flower, Leaf, Snowflake } from "lucide-react"
import AnimatedSection from "./AnimatedSection"
import { useImageUrls } from "@/app/hooks/useImageUrls"
import ImageWithFallback from "./ImageWithFallback"
import ErrorMessage from "./ErrorMessage"

interface SeasonalPlan {
  title: string
  description: string
}

const defaultPlans = [
  {
    title: "花粉対策セット",
    description: "エアコン＋換気扇クリーニング",
  },
  {
    title: "猛暑対策プラン",
    description: "エアコン全台クリーニング または 浴室クリーニング",
  },
  {
    title: "寒さ対策セット",
    description: "エアコン＋窓ガラスクリーニング",
  },
  {
    title: "大掃除応援パック",
    description: "エアコン＋リビングクリーニング（床清掃・ワックスがけ）",
  },
]

const planConfig = [
  {
    season: "春",
    icon: Flower,
    color: "text-pink-500",
    ribbonColor: "bg-pink-500",
    imageKey: "springPlanImage",
  },
  {
    season: "夏",
    icon: Sun,
    color: "text-yellow-500",
    ribbonColor: "bg-yellow-500",
    imageKey: "summerPlanImage",
  },
  {
    season: "秋",
    icon: Leaf,
    color: "text-orange-500",
    ribbonColor: "bg-orange-500",
    imageKey: "autumnPlanImage",
  },
  {
    season: "冬",
    icon: Snowflake,
    color: "text-blue-500",
    ribbonColor: "bg-blue-500",
    imageKey: "winterPlanImage",
  },
]

const SeasonRibbon = ({ color }: { color: string }) => (
  <div className={`absolute top-0 right-0 w-16 h-16 ${color} overflow-hidden`}>
    <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-16 h-8 bg-white"></div>
  </div>
)

export default function SeasonalPlans() {
  const [plans, setPlans] = useState<SeasonalPlan[]>(defaultPlans)
  const { imageUrls, isLoading, error } = useImageUrls()

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/content?section=seasonalPlans")
      const content = await response.json()
      if (content && Array.isArray(content)) {
        setPlans(content)
      }
    } catch (error) {
      console.error("Error fetching seasonal plans:", error)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <ErrorMessage message={error.message} />
  }

  const backgroundImage = imageUrls.seasonalPlansBackgroundImage?.url || "/placeholder.svg"

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
          季節別おすすめプラン
        </h2>
        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => {
              const config = planConfig[index]
              const Icon = config.icon
              return (
                <Card key={index} className="h-full relative overflow-hidden bg-white bg-opacity-90">
                  <SeasonRibbon color={config.ribbonColor} />
                  <ImageWithFallback
                    src={imageUrls[config.imageKey]?.url || "/placeholder.svg"}
                    fallbackSrc="/placeholder.svg"
                    alt={`${config.season}のおすすめプラン`}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <CardHeader>
                    <div className={`${config.color} mb-4`}>
                      <Icon className="h-12 w-12" />
                    </div>
                    <CardTitle style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)" }}>{plan.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)" }}>{plan.description}</p>
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
