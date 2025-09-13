"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Star } from "lucide-react"
import AnimatedSection from "./AnimatedSection"
import { useImageUrls } from "@/app/hooks/useImageUrls"
import ErrorMessage from "./ErrorMessage"

interface SubscriptionPlan {
  name: string
  price: string
  description: string
  features: string[]
  limits: string
  color: string
  buttonColor: string
  ribbonColor: string
}

const defaultPlans: SubscriptionPlan[] = [
  {
    name: "ベーシック",
    price: "9,800",
    description: "月1回の基本清掃",
    features: [
      "リビング・キッチン清掃",
      "浴室・トイレ清掃",
      "掃除機がけ・拭き掃除",
      "洗濯1回分（乾燥・たたみ含む）",
      "ゴミ出し",
    ],
    limits: "40㎡までの物件対象。それ以上の物件は追加料金で対応可能。",
    color: "bg-blue-100",
    buttonColor: "bg-blue-500 hover:bg-blue-600",
    ribbonColor: "from-yellow-600 to-yellow-800",
  },
  {
    name: "スタンダード",
    price: "19,800",
    description: "月2回の総合清掃",
    features: [
      "ベーシックプランの全内容",
      "エアコンフィルター清掃",
      "冷蔵庫・電子レンジ清掃",
      "窓ガラス・網戸清掃",
      "洗濯2回分（乾燥・たたみ含む）",
      "布団干し",
    ],
    limits: "60㎡までの物件対象。それ以上の物件は追加料金で対応可能。",
    color: "bg-green-100",
    buttonColor: "bg-green-500 hover:bg-green-600",
    ribbonColor: "from-gray-400 to-gray-600",
  },
  {
    name: "プレミアム",
    price: "59,800",
    description: "月3回の徹底清掃＋家事代行",
    features: [
      "スタンダードプランの全内容",
      "クローゼット整理",
      "ベッドメイキング",
      "アイロンがけ",
      "買い物代行",
      "植物の水やり・ペットのお世話",
      "靴磨き",
    ],
    limits: "80㎡までの物件対象。それ以上の物件は追加料金で対応可能。",
    color: "bg-yellow-100",
    buttonColor: "bg-yellow-500 hover:bg-yellow-600",
    ribbonColor: "from-yellow-400 to-yellow-600",
  },
]

const PlanRibbon = ({ plan }: { plan: SubscriptionPlan }) => (
  <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-b-[50px] border-l-transparent border-b-red-500">
    <div className="absolute -top-[35px] -right-[35px] text-white text-xs font-bold transform rotate-45">
      {plan.name === "スタンダード" ? "人気" : plan.name === "プレミアム" ? "おすすめ" : ""}
    </div>
  </div>
)

export default function Subscription() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(defaultPlans)
  const { imageUrls, isLoading, error } = useImageUrls()

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/content?section=subscriptionPlans")
      const content = await response.json()
      if (content && Array.isArray(content)) {
        setPlans(content)
      }
    } catch (error) {
      console.error("Error fetching subscription plans:", error)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <ErrorMessage message={error.message} />
  }

  const backgroundImage = imageUrls.subscriptionBackgroundImage?.url || "/placeholder.svg"

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
          サブスクリプションプラン
        </h2>
        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`${plan.color} hover:shadow-xl transition-shadow duration-300 relative overflow-hidden bg-opacity-90`}
              >
                {(plan.name === "スタンダード" || plan.name === "プレミアム") && <PlanRibbon plan={plan} />}
                <CardHeader>
                  <CardTitle className="text-center text-2xl" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)" }}>
                    {plan.name}
                  </CardTitle>
                  <div className="text-center">
                    <span className="text-4xl font-bold" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)" }}>
                      ¥{plan.price}
                    </span>
                    <span className="text-lg text-gray-600">/月</span>
                  </div>
                  <p className="text-center text-gray-600" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)" }}>
                    {plan.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)" }}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-500 mb-4" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)" }}>
                    {plan.limits}
                  </p>
                  <Button className={`w-full ${plan.buttonColor} text-white`}>
                    {plan.name === "プレミアム" && <Star className="h-4 w-4 mr-2" />}
                    プランを選択
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
