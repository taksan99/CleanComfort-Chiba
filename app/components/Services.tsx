"use client"

import { useState, useEffect } from "react"

interface Service {
  title: string
  description: string
  price: string
  features: string[]
}

const initialServices: Service[] = [
  {
    title: "エアコンクリーニング",
    description: "プロの技術でエアコンを徹底洗浄。カビや汚れを除去し、清潔な空気を取り戻します。",
    price: "12,000円～",
    features: ["内部洗浄", "フィルター清掃", "抗菌コート", "動作確認"],
  },
  {
    title: "ハウスクリーニング",
    description: "お家全体を隅々まで清掃。忙しい方に代わって、プロが丁寧にお掃除いたします。",
    price: "15,000円～",
    features: ["全室清掃", "水回り清掃", "窓ガラス清掃", "床ワックス"],
  },
  {
    title: "水回りクリーニング",
    description: "キッチン、浴室、トイレなど水回りを専門的に清掃。頑固な汚れもスッキリ。",
    price: "68,000円～",
    features: ["キッチン清掃", "浴室清掃", "トイレ清掃", "洗面台清掃", "排水管清掃"],
  },
  {
    title: "便利屋サービス",
    description: "日常の困りごとを解決。家具移動から簡単な修理まで、何でもお任せください。",
    price: "3,000円～",
    features: ["家具移動", "電球交換", "簡単修理", "組み立て作業"],
  },
]

export default function Services() {
  const [services, setServices] = useState<Service[]>(initialServices)

  useEffect(() => {
    const savedServices = localStorage.getItem("serviceContent")
    if (savedServices) {
      try {
        const parsedServices = JSON.parse(savedServices)
        setServices(parsedServices)
      } catch (error) {
        console.error("Error parsing saved services:", error)
      }
    }
  }, [])

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">サービス内容</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            プロの技術と丁寧なサービスで、お客様の快適な暮らしをサポートします。
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="text-2xl font-bold text-blue-600 mb-4">{service.price}</div>
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
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
          ))}
        </div>
      </div>
    </section>
  )
}
