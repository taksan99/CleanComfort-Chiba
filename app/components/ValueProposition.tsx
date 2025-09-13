"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Award, Users, Shield } from "lucide-react"

interface ValueProp {
  title: string
  description: string
  example: string
  benefit: string
}

const initialValueProps: ValueProp[] = [
  {
    title: "最短翌日対応",
    description: "急な来客にも対応可能。緊急時、受付時間外や当日対応も可（要相談）",
    example: "金曜の夜、週末の来客が決定。土曜の朝一番で連絡すると、その日の午後には綺麗なお部屋に。",
    benefit: "急なご要望にも可能な限り対応し、あなたの「困った！」を解決します。",
  },
  {
    title: "プロの技術",
    description: "頑固な汚れも撃退、見違えるほどの清潔さを実現",
    example: "何年も落ちなかったキッチンの油汚れが、特殊な洗剤と技術であっという間にピカピカに。",
    benefit: "プロの技術で、諦めていた汚れも解消。新築のような清潔感が復活します。",
  },
  {
    title: "総合的なハウスケア、サブスク",
    description: "忙しい方向けに時間と労力を大幅節約",
    example: "仕事で忙しい共働き夫婦。帰宅するとベッドメイキングから洗濯物の片付けまで全て完了。",
    benefit: "家事の負担を軽減し、大切な人との時間や自分の趣味の時間を増やせます。",
  },
  {
    title: "アレルギー対策",
    description: "特殊洗剤使用で、家族の健康をサポート",
    example: "花粉症の息子さんの症状が、定期的な清掃とエアコンフィルターの徹底洗浄で軽減。",
    benefit: "アレルギー症状の緩和に貢献し、家族全員が快適に過ごせる空間を作ります。",
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

  const icons = [Clock, Award, Users, Shield]

  return (
    <section id="value-proposition" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">4つの幸せな暮らし</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            クリーンコンフォート千葉が提供する価値で、あなたの生活がどのように変わるかをご紹介します。
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {valueProps.map((prop, index) => {
            const IconComponent = icons[index]
            return (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{prop.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{prop.description}</p>

                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold text-blue-800 mb-2">お客様の声</h4>
                    <p className="text-blue-700 text-sm italic">"{prop.example}"</p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">あなたへの価値</h4>
                    <p className="text-green-700 text-sm">{prop.benefit}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
