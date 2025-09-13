"use client"

import { useState, useEffect } from "react"

interface SubscriptionPlan {
  name: string
  price: string
  frequency: string
  services: string[]
  features: string[]
  popular?: boolean
}

const initialPlans: SubscriptionPlan[] = [
  {
    name: "ベーシックプラン",
    price: "月額 8,000円",
    frequency: "月1回",
    services: ["エアコンクリーニング（年2回）", "簡易清掃"],
    features: ["優先予約", "10%割引", "無料相談"],
  },
  {
    name: "スタンダードプラン",
    price: "月額 15,000円",
    frequency: "月2回",
    services: ["ハウスクリーニング", "水回り清掃", "エアコンクリーニング（年4回）"],
    features: ["優先予約", "15%割引", "無料相談", "緊急対応"],
    popular: true,
  },
  {
    name: "プレミアムプラン",
    price: "月額 25,000円",
    frequency: "週1回",
    services: ["フルハウスクリーニング", "水回り清掃", "便利屋サービス", "エアコンクリーニング（年6回）"],
    features: ["最優先予約", "20%割引", "24時間相談", "緊急対応", "専任スタッフ"],
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
    <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">サブスクリプションサービス</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            定期的なメンテナンスで、いつでも清潔で快適な住環境を維持できます。
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg p-8 shadow-lg relative ${plan.popular ? "ring-2 ring-blue-500" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">人気No.1</span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-blue-600 mb-1">{plan.price}</div>
                <p className="text-gray-600">{plan.frequency}</p>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">含まれるサービス</h4>
                <ul className="space-y-2">
                  {plan.services.map((service, serviceIndex) => (
                    <li key={serviceIndex} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {service}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-8">
                <h4 className="font-semibold text-gray-800 mb-3">特典</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
                  plan.popular
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                プランを選択
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-2">
            ※サブスクリプションサービスは、単発サービスを一度ご利用いただいた後にお申し込みいただけます。
          </p>
          <p className="text-gray-600">※契約期間の縛りはありません。いつでも解約可能です。</p>
        </div>
      </div>
    </section>
  )
}
