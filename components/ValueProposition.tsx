"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AnimatedSection from "@/app/components/AnimatedSection"
import { useImageUrls } from "@/app/hooks/useImageUrls"
import ErrorMessage from "@/app/components/ErrorMessage"

interface ValueProp {
  title: string
  description: string
  example: string
  benefit: string
}

const defaultValueProps: ValueProp[] = [
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
  const [valueProps, setValueProps] = useState<ValueProp[]>(defaultValueProps)
  const [isLoading, setIsLoading] = useState(true)
  const { imageUrls, error } = useImageUrls()

  useEffect(() => {
    fetchValueProps()
  }, [])

  const fetchValueProps = async () => {
    try {
      const response = await fetch("/api/content?section=valueProposition")
      const data = await response.json()

      if (data && Array.isArray(data) && data.length > 0) {
        setValueProps(data)
      } else {
        // データベースにデータがない場合はデフォルトを使用
        setValueProps(defaultValueProps)
      }
    } catch (error) {
      console.error("Error fetching value propositions:", error)
      // エラーの場合もデフォルトを使用
      setValueProps(defaultValueProps)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading...</div>
        </div>
      </section>
    )
  }

  if (error) {
    return <ErrorMessage message={error.message} />
  }

  const backgroundImage = imageUrls.valuePropositionBackgroundImage?.url || "/placeholder.svg"

  return (
    <section
      className="relative py-16 bg-gradient-to-br from-blue-50 to-indigo-100"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-white bg-opacity-80"></div>
      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              クリーンコンフォート千葉が約束する
              <br />
              <span className="text-blue-600">４つの幸せな暮らし</span>
            </h2>
            <p className="text-xl text-gray-600">お客様の生活をより豊かで快適にするための、私たちの約束です</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {valueProps.map((prop, index) => (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold text-blue-600 flex items-center">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold mr-3">
                      {index + 1}
                    </span>
                    {prop.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 text-lg leading-relaxed">{prop.description}</p>

                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                    <h4 className="font-semibold text-blue-800 mb-2">💬 お客様の声</h4>
                    <p className="text-blue-700 italic">"{prop.example}"</p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                    <h4 className="font-semibold text-green-800 mb-2">✨ あなたへの価値</h4>
                    <p className="text-green-700 font-medium">{prop.benefit}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
