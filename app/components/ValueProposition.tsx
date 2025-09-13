"use client"

import { useState, useEffect } from "react"

interface ValueProp {
  title: string
  description: string
  icon: string
}

const initialValueProps: ValueProp[] = [
  {
    title: "清潔で快適な住環境",
    description: "プロの技術で隅々まで清掃し、健康的で快適な住空間を実現します。",
    icon: "🏠",
  },
  {
    title: "時間の有効活用",
    description: "清掃時間を節約し、ご家族との大切な時間や趣味の時間を増やせます。",
    icon: "⏰",
  },
  {
    title: "専門技術による安心",
    description: "経験豊富なプロが最適な方法で清掃し、安心してお任せいただけます。",
    icon: "🛡️",
  },
  {
    title: "健康的な生活環境",
    description: "アレルゲンや細菌を除去し、ご家族の健康をサポートします。",
    icon: "💚",
  },
]

export default function ValueProposition() {
  const [valueProps, setValueProps] = useState<ValueProp[]>(initialValueProps)

  useEffect(() => {
    const savedValueProps = localStorage.getItem("valuePropositionContent")
    if (savedValueProps) {
      try {
        const parsedValueProps = JSON.parse(savedValueProps)
        setValueProps(parsedValueProps)
      } catch (error) {
        console.error("Error parsing saved value propositions:", error)
      }
    }
  }, [])

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">4つの幸せな暮らし</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            私たちのサービスがもたらす、豊かで快適な生活をご体験ください。
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {valueProps.map((prop, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-4xl mb-4">{prop.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{prop.title}</h3>
              <p className="text-gray-600">{prop.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
