"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Calendar, Clock, Star } from "lucide-react"

interface SubscriptionPlan {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  isPopular?: boolean
}

const initialPlans: SubscriptionPlan[] = [
  {
    name: "ベーシックプラン",
    price: "月額 15,000円",
    period: "月1回",
    description: "基本的な清掃サービスを定期的に",
    features: [
      "月1回の定期清掃",
      "水回り清掃（キッチン・浴室・トイレ）",
      "掃除機がけ・拭き掃除",
      "ゴミ出し代行",
      "簡単な整理整頓",
    ],
  },
  {
    name: "スタンダードプラン",
    price: "月額 25,000円",
    period: "月2回",
    description: "より充実したサービスで快適な住環境を",
    features: [
      "月2回の定期清掃",
      "水回り清掃（キッチン・浴室・トイレ・洗面台）",
      "掃除機がけ・拭き掃除・窓拭き",
      "ゴミ出し代行",
      "整理整頓・ベッドメイキング",
      "エアコンフィルター清掃（月1回）",
    ],
    isPopular: true,
  },
  {
    name: "プレミアムプラン",
    price: "月額 40,000円",
    period: "週1回",
    description: "最高レベルの清掃とサポートサービス",
    features: [
      "週1回の定期清掃",
      "全室清掃（水回り・リビング・寝室）",
      "掃除機がけ・拭き掃除・窓拭き",
      "ゴミ出し代行・洗濯物の取り込み",
      "整理整頓・ベッドメイキング",
      "エアコンフィルター清掃（月2回）",
      "簡単な買い物代行",
      "植物の水やり",
    ],
  },
]

export default function Subscription() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(initialPlans)

  useEffect(() => {
    const savedPlans = localStorage.getItem("subscriptionContent")
    if (savedPlans) {
      try {
        const parsedPlans = JSON.parse(savedPlans)
        setPlans(parsedPlans)
      } catch (error) {
        console.error("Error parsing saved subscription plans:", error)
      }
    }
  }, [])

  return (
    <section id="subscription" className="py-20 bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">サブスクリプションサービス</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            定期的な清掃サービスで、いつでも清潔で快適な住環境を維持できます。
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                plan.isPopular ? "ring-2 ring-indigo-500 relative" : ""
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-indigo-500 text-white px-4 py-1">
                    <Star className="w-4 h-4 mr-1" />
                    人気No.1
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-indigo-600 mt-2">{plan.price}</div>
                <div className="flex items-center justify-center text-gray-600 mt-1">
                  <Clock className="w-4 h-4 mr-1" />
                  {plan.period}
                </div>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.isPopular ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-600 hover:bg-gray-700"
                  }`}
                >
                  プランを選択
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            ※ 初回ご利用時は現地調査が必要です。サービス内容は住環境に応じてカスタマイズ可能です。
          </p>
          <Button size="lg" variant="outline" className="px-8 bg-transparent">
            詳細なプラン比較を見る
          </Button>
        </div>
      </div>
    </section>
  )
}
