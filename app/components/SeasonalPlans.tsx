"use client"

import { useState, useEffect } from "react"

interface SeasonalPlan {
  season: string
  title: string
  description: string
  services: string[]
  price: string
}

const initialPlans: SeasonalPlan[] = [
  {
    season: "春",
    title: "春の新生活応援プラン",
    description: "新生活のスタートに最適な清掃サービスをお得なセットでご提供",
    services: ["エアコンクリーニング", "ハウスクリーニング", "窓ガラス清掃"],
    price: "25,000円～",
  },
  {
    season: "夏",
    title: "夏の快適生活プラン",
    description: "暑い夏を快適に過ごすためのエアコン重点清掃プラン",
    services: ["エアコン徹底洗浄", "水回りクリーニング", "カビ対策"],
    price: "30,000円～",
  },
  {
    season: "秋",
    title: "秋の大掃除プラン",
    description: "年末前の準備として、お家全体をしっかりと清掃",
    services: ["全室清掃", "換気扇清掃", "床ワックス"],
    price: "35,000円～",
  },
  {
    season: "冬",
    title: "冬の年末大掃除プラン",
    description: "新年を気持ちよく迎えるための徹底清掃サービス",
    services: ["大掃除フルセット", "水回り5点セット", "エアコンクリーニング"],
    price: "50,000円～",
  },
]

export default function SeasonalPlans() {
  const [plans, setPlans] = useState<SeasonalPlan[]>(initialPlans)

  useEffect(() => {
    const savedPlans = localStorage.getItem("seasonalPlansContent")
    if (savedPlans) {
      try {
        const parsedPlans = JSON.parse(savedPlans)
        setPlans(parsedPlans)
      } catch (error) {
        console.error("Error parsing saved seasonal plans:", error)
      }
    }
  }, [])

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">季節別おすすめプラン</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">季節に合わせた最適な清掃プランをご用意しています。</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <div key={index} className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="text-center mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {plan.season}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{plan.title}</h3>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <div className="text-2xl font-bold text-blue-600 mb-4">{plan.price}</div>
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
          ))}
        </div>
      </div>
    </section>
  )
}
