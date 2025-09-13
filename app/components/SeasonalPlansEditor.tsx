"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

interface SeasonalPlan {
  title: string
  description: string
  services: string[]
  price: string
  note: string
}

const initialPlans: SeasonalPlan[] = [
  {
    title: "春の新生活応援プラン",
    description: "新生活を気持ちよくスタートするための総合清掃プラン",
    services: [
      "水回り5点セット（浴室・キッチン・トイレ・洗面台・洗濯機周り）",
      "エアコンクリーニング（1台）",
      "窓ガラス・サッシ清掃",
      "ベランダ清掃",
    ],
    price: "通常価格 98,000円 → 特別価格 78,000円",
    note: "3月〜5月限定。引越し前後のお客様には追加割引あり。",
  },
  {
    title: "夏の快適空間プラン",
    description: "暑い夏を快適に過ごすためのエアコン重点清掃プラン",
    services: ["エアコンクリーニング（2台まで）", "浴室・洗面台清掃", "キッチン清掃", "害虫駆除（予防処理含む）"],
    price: "通常価格 54,000円 → 特別価格 44,000円",
    note: "6月〜8月限定。エアコン3台目以降は1台につき8,000円で追加可能。",
  },
  {
    title: "秋の大掃除準備プラン",
    description: "年末の大掃除に向けて、普段手の届かない場所を重点清掃",
    services: ["レンジフード・換気扇清掃", "窓ガラス・網戸・サッシ清掃", "浴室・トイレ清掃", "ワックスがけ（1部屋）"],
    price: "通常価格 46,000円 → 特別価格 38,000円",
    note: "9月〜11月限定。ワックスがけ追加部屋は1部屋につき3,000円。",
  },
  {
    title: "冬の年末大掃除プラン",
    description: "新年を迎える準備として、家全体を徹底的に清掃",
    services: [
      "水回り5点セット",
      "エアコンクリーニング（1台）",
      "窓ガラス・サッシ清掃",
      "ワックスがけ（2部屋まで）",
      "玄関・廊下清掃",
    ],
    price: "通常価格 108,000円 → 特別価格 88,000円",
    note: "12月〜2月限定。年末は予約が集中するため、お早めのご予約をお勧めします。",
  },
]

export default function SeasonalPlansEditor() {
  const [plans, setPlans] = useState<SeasonalPlan[]>(initialPlans)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/content?section=seasonalPlans")
      const data = await response.json()
      if (data && Array.isArray(data)) {
        setPlans(data)
      }
    } catch (error) {
      console.error("Error fetching seasonal plans:", error)
    }
  }

  const handleChange = (index: number, field: keyof SeasonalPlan, value: string | string[]) => {
    const newPlans = [...plans]
    newPlans[index] = { ...newPlans[index], [field]: value }
    setPlans(newPlans)
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section: "seasonalPlans",
          content: plans,
        }),
      })

      if (response.ok) {
        toast({
          title: "保存完了",
          description: "季節別おすすめプランの内容が正常に保存されました。",
        })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      console.error("Error saving seasonal plans:", error)
      toast({
        title: "エラー",
        description: "保存に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="spring">
        <TabsList>
          <TabsTrigger value="spring">春プラン</TabsTrigger>
          <TabsTrigger value="summer">夏プラン</TabsTrigger>
          <TabsTrigger value="autumn">秋プラン</TabsTrigger>
          <TabsTrigger value="winter">冬プラン</TabsTrigger>
        </TabsList>
        {plans.map((plan, index) => (
          <TabsContent key={index} value={["spring", "summer", "autumn", "winter"][index]}>
            <Card>
              <CardHeader>
                <CardTitle>{plan.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block mb-2">タイトル</label>
                  <Input
                    value={plan.title}
                    onChange={(e) => handleChange(index, "title", e.target.value)}
                    placeholder="プランタイトル"
                  />
                </div>
                <div>
                  <label className="block mb-2">説明</label>
                  <Textarea
                    value={plan.description}
                    onChange={(e) => handleChange(index, "description", e.target.value)}
                    placeholder="プランの説明"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block mb-2">サービス内容（各項目を改行で区切ってください）</label>
                  <Textarea
                    value={plan.services.join("\n")}
                    onChange={(e) => handleChange(index, "services", e.target.value.split("\n").filter(Boolean))}
                    placeholder="サービス内容"
                    rows={6}
                  />
                </div>
                <div>
                  <label className="block mb-2">料金</label>
                  <Input
                    value={plan.price}
                    onChange={(e) => handleChange(index, "price", e.target.value)}
                    placeholder="料金情報"
                  />
                </div>
                <div>
                  <label className="block mb-2">注意事項・備考</label>
                  <Textarea
                    value={plan.note}
                    onChange={(e) => handleChange(index, "note", e.target.value)}
                    placeholder="注意事項や備考"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      <Button onClick={handleSave} disabled={isLoading}>
        {isLoading ? "保存中..." : "保存"}
      </Button>
    </div>
  )
}
