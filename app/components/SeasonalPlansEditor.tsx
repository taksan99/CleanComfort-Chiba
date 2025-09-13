"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

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
    description: "新生活のスタートを清潔な環境でサポート",
    services: ["エアコンクリーニング", "水回り清掃", "窓・網戸清掃"],
    price: "特別価格 45,000円～",
  },
  {
    season: "夏",
    title: "夏の快適空間プラン",
    description: "暑い夏を快適に過ごすための徹底清掃",
    services: ["エアコン徹底清掃", "浴室・洗面所清掃", "ベランダ清掃"],
    price: "特別価格 38,000円～",
  },
  {
    season: "秋",
    title: "秋の大掃除プラン",
    description: "年末前の本格的な大掃除で一年の汚れをリセット",
    services: ["全室清掃", "キッチン徹底清掃", "窓ガラス・サッシ清掃"],
    price: "特別価格 55,000円～",
  },
  {
    season: "冬",
    title: "冬の年末大掃除プラン",
    description: "新年を迎える準備として、家全体を徹底的に清掃",
    services: ["水回り5点セット", "エアコンクリーニング", "ワックスがけ"],
    price: "特別価格 65,000円～",
  },
]

export default function SeasonalPlansEditor() {
  const [plans, setPlans] = useState<SeasonalPlan[]>(initialPlans)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/site-content?section=seasonalPlans")
        const data = await response.json()
        if (data && Array.isArray(data)) {
          setPlans(data)
        }
      } catch (error) {
        console.error("Error fetching seasonal plans:", error)
        // Fallback to localStorage
        const saved = localStorage.getItem("seasonalPlansContent")
        if (saved) {
          setPlans(JSON.parse(saved))
        }
      }
    }

    fetchData()
  }, [])

  const handleSave = async () => {
    try {
      const response = await fetch("/api/site-content", {
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
        localStorage.setItem("seasonalPlansContent", JSON.stringify(plans))
        toast({
          title: "保存完了",
          description: "季節別おすすめプランの内容が保存されました。",
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
    }
  }

  const updatePlan = (index: number, field: keyof SeasonalPlan, value: string | string[]) => {
    const newPlans = [...plans]
    newPlans[index] = { ...newPlans[index], [field]: value }
    setPlans(newPlans)
  }

  const updateService = (planIndex: number, serviceIndex: number, value: string) => {
    const newPlans = [...plans]
    const newServices = [...newPlans[planIndex].services]
    newServices[serviceIndex] = value
    newPlans[planIndex] = { ...newPlans[planIndex], services: newServices }
    setPlans(newPlans)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">季節別おすすめプラン</h3>
        <Button onClick={handleSave}>保存</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map((plan, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{plan.season}のプラン</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">タイトル</label>
                <Input
                  value={plan.title}
                  onChange={(e) => updatePlan(index, "title", e.target.value)}
                  placeholder="プランタイトル"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">説明</label>
                <Textarea
                  value={plan.description}
                  onChange={(e) => updatePlan(index, "description", e.target.value)}
                  placeholder="プランの説明"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">サービス内容</label>
                {plan.services.map((service, serviceIndex) => (
                  <Input
                    key={serviceIndex}
                    value={service}
                    onChange={(e) => updateService(index, serviceIndex, e.target.value)}
                    placeholder={`サービス ${serviceIndex + 1}`}
                    className="mb-2"
                  />
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">料金</label>
                <Input
                  value={plan.price}
                  onChange={(e) => updatePlan(index, "price", e.target.value)}
                  placeholder="料金を入力"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
