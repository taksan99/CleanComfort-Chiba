"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Sparkles, Heart, Leaf } from "lucide-react"
import { useImageUrls } from "../hooks/useImageUrls"
import AnimatedSection from "./AnimatedSection"

// デフォルトデータ
const defaultValueProps = [
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

const icons = [Clock, Sparkles, Heart, Leaf]

export default function ValueProposition() {
  const { imageUrls } = useImageUrls()
  const [valueProps, setValueProps] = useState(defaultValueProps)

  useEffect(() => {
    const fetchValueProps = async () => {
      try {
        const response = await fetch("/api/content?section=valueProposition")
        const data = await response.json()
        if (data && Array.isArray(data)) {
          setValueProps(data)
        }
      } catch (error) {
        console.error("Error fetching value propositions:", error)
        // エラーの場合はlocalStorageから読み込み
        const savedValueProps = localStorage.getItem("valuePropositionContent")
        if (savedValueProps) {
          setValueProps(JSON.parse(savedValueProps))
        }
      }
    }

    fetchValueProps()
  }, [])

  return (
    <section
      id="value-proposition"
      className="py-20 relative overflow-hidden"
      style={{
        backgroundImage: `url(${imageUrls.valuePropositionBackgroundImage?.url || "/clean-home-background.jpg"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-blue-900/80"></div>
      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">4つの幸せな暮らし</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              クリーンコンフォート千葉が提供する価値で、あなたの生活がどう変わるかをご紹介します
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {valueProps.map((prop, index) => {
            const IconComponent = icons[index] || Clock
            return (
              <AnimatedSection key={index} delay={index * 0.2}>
                <Card className="h-full bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-blue-200">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{prop.title}</h3>
                        <p className="text-gray-600">{prop.description}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-semibold text-blue-800 mb-2">お客様の声</h4>
                        <p className="text-blue-700 text-sm italic">"{prop.example}"</p>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                        <h4 className="font-semibold text-green-800 mb-2">あなたへの価値</h4>
                        <p className="text-green-700 text-sm">{prop.benefit}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            )
          })}
        </div>
      </div>
    </section>
  )
}
