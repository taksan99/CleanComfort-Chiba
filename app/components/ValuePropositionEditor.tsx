"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ValueProp {
  title: string
  description: string
  example: string
  benefit: string
  icon?: string
  color?: string
}

const initialValueProps: ValueProp[] = [
  {
    title: "最短翌日対応",
    description: "急な来客にも対応可能。緊急時、受付時間外や当日対応も可（要相談）",
    example: "金曜の夜、週末の来客が決定。土曜の朝一番で連絡すると、その日の午後には綺麗なお部屋に。",
    benefit: "急なご要望にも可能な限り対応し、あなたの「困った！」を解決します。",
    icon: "icon1",
    color: "color1",
  },
  {
    title: "プロの技術",
    description: "頑固な汚れも撃退、見違えるほどの清潔さを実現",
    example: "何年も落ちなかったキッチンの油汚れが、特殊な洗剤と技術であっという間にピカピカに。",
    benefit: "プロの技術で、諦めていた汚れも解消。新築のような清潔感が復活します。",
    icon: "icon2",
    color: "color2",
  },
  {
    title: "総合的なハウスケア、サブスク",
    description: "忙しい方向けに時間と労力を大幅節約",
    example: "仕事で忙しい共働き夫婦。帰宅するとベッドメイキングから洗濯物の片付けまで全て完了。",
    benefit: "家事の負担を軽減し、大切な人との時間や自分の趣味の時間を増やせます。",
    icon: "icon3",
    color: "color3",
  },
  {
    title: "アレルギー対策",
    description: "特殊洗剤使用で、家族の健康をサポート",
    example: "花粉症の息子さんの症状が、定期的な清掃とエアコンフィルターの徹底洗浄で軽減。",
    benefit: "アレルギー症状の緩和に貢献し、家族全員が快適に過ごせる空間を作ります。",
    icon: "icon4",
    color: "color4",
  },
]

export default function ValuePropositionEditor() {
  const [valueProps, setValueProps] = useState<ValueProp[]>(initialValueProps)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/site-content?section=valueProposition")
        const data = await response.json()
        if (data && Array.isArray(data)) {
          setValueProps(
            data.map((prop, index) => ({
              ...prop,
              icon: initialValueProps[index].icon,
              color: initialValueProps[index].color,
            })),
          )
        }
      } catch (error) {
        console.error("Error fetching value propositions:", error)
        // Fallback to localStorage
        const savedValueProps = localStorage.getItem("valuePropositionContent")
        if (savedValueProps) {
          setValueProps(JSON.parse(savedValueProps))
        }
      }
    }

    fetchData()
  }, [])

  const handleChange = (index: number, field: keyof ValueProp, value: string) => {
    const newValueProps = [...valueProps]
    newValueProps[index] = { ...newValueProps[index], [field]: value }
    setValueProps(newValueProps)
  }

  const handleSave = async () => {
    try {
      const response = await fetch("/api/site-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section: "valueProposition",
          content: valueProps,
        }),
      })

      if (response.ok) {
        // Also save to localStorage as backup
        localStorage.setItem("valuePropositionContent", JSON.stringify(valueProps))
        alert("4つの幸せな暮らしの内容が保存されました。")
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      console.error("Error saving value propositions:", error)
      alert("保存中にエラーが発生しました。")
    }
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="prop0">
        <TabsList>
          {valueProps.map((_, index) => (
            <TabsTrigger key={index} value={`prop${index}`}>
              {initialValueProps[index].title}
            </TabsTrigger>
          ))}
        </TabsList>
        {valueProps.map((prop, index) => (
          <TabsContent key={index} value={`prop${index}`}>
            <Card>
              <CardHeader>
                <CardTitle>{initialValueProps[index].title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block mb-2">タイトル</label>
                  <Input
                    value={prop.title}
                    onChange={(e) => handleChange(index, "title", e.target.value)}
                    placeholder="タイトル"
                  />
                </div>
                <div>
                  <label className="block mb-2">説明</label>
                  <Textarea
                    value={prop.description}
                    onChange={(e) => handleChange(index, "description", e.target.value)}
                    placeholder="説明"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block mb-2">お客様の声</label>
                  <Textarea
                    value={prop.example}
                    onChange={(e) => handleChange(index, "example", e.target.value)}
                    placeholder="お客様の声"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block mb-2">あなたへの価値</label>
                  <Textarea
                    value={prop.benefit}
                    onChange={(e) => handleChange(index, "benefit", e.target.value)}
                    placeholder="あなたへの価値"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      <Button onClick={handleSave}>保存</Button>
    </div>
  )
}
