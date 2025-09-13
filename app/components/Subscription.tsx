"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Check } from "lucide-react"
import AnimatedSection from "./AnimatedSection"
import { useImageUrls } from "@/app/hooks/useImageUrls"

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

const PlanRibbon = ({ color }: { color: string }) => (
  <>
    <div className={`absolute top-0 right-0 w-16 h-16 overflow-hidden`}>
      <div
        className={`absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-32 h-8 bg-gradient-to-r ${color}`}
      ></div>
    </div>
    <div className={`absolute bottom-0 left-0 w-16 h-16 overflow-hidden`}>
      <div
        className={`absolute bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-32 h-8 bg-gradient-to-r ${color}`}
      ></div>
    </div>
  </>
)

export default function Subscription() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(defaultPlans)
  const { imageUrls, isLoading, error } = useImageUrls()

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch("/api/content?section=subscription")
        if (response.ok) {
          const data = await response.json()
          if (data.content) {
            setPlans(data.content)
          }
        }
      } catch (error) {
        console.error("Error fetching subscription content:", error)
        // フォールバック: localStorageから取得
        const savedPlans = localStorage.getItem("subscriptionPlans")
        if (savedPlans) {
          setPlans(JSON.parse(savedPlans))
        }
      }
    }
    fetchContent()
  }, [])

  if (isLoading) {
    return <div className="text-center py-16">Loading...</div>
  }

  if (error) {
    console.error("Error loading image:", error)
    // エラーが発生した場合でもコンポーネントを表示
  }

  const backgroundImage = imageUrls.subscriptionBackgroundImage?.url || "/placeholder.svg"

  return (
    <section className="py-16 bg-cover bg-center relative" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 bg-white bg-opacity-75 p-4 rounded-lg shadow-lg">
          サブスクリプションサービス
        </h2>
        <div className="text-center mb-12">
          <p className="text-gray-600 bg-white bg-opacity-75 p-2 rounded-lg inline-block mx-auto">
            定期的なお掃除と家事代行で、いつでも快適な暮らしを
          </p>
        </div>
        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {plans.map((plan) => (
              <div key={plan.name} className="transform hover:scale-105 transition-transform duration-300">
                <Card
                  className={`${plan.color} overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 relative p-4 bg-opacity-90`}
                >
                  <PlanRibbon color={plan.ribbonColor} />
                  <CardHeader>
                    <CardTitle style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)" }}>{plan.name}</CardTitle>
                    <CardDescription style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)" }}>
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p
                      className="text-4xl font-bold mb-4 text-gray-800"
                      style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)" }}
                    >
                      ¥{plan.price}
                      <span className="text-base font-normal">/月</span>
                    </p>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                          <span style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)" }}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 text-sm text-gray-600">
                      <p style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)" }}>
                        <strong>適用条件:</strong> {plan.limits}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </AnimatedSection>
        <div className="text-center mt-8">
          <p className="text-sm text-gray-800 bg-white bg-opacity-75 p-2 rounded-lg inline-block mx-auto">
            ※ サービス内容や頻度は、お客様のご要望に応じてカスタマイズ可能です。詳細はお問い合わせください。
            エアコンクリーニング、ハウスクリーニング、便利屋サービスのいずれかを1回以上ご利用後、
            またはサブスクリプション開始前の現地調査後にご利用いただけます。
          </p>
        </div>
      </div>
    </section>
  )
}
