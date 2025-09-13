"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SeasonalPlan {
  season: string
  title: string
  description: string
}

const initialSeasonalPlans: SeasonalPlan[] = [
  {
    season: "春",
    title: "花粉対策セット",
    description: "エアコン＋換気扇クリーニング",
  },
  {
    season: "夏",
    title: "猛暑対策プラン",
    description: "エアコン全台クリーニング または 浴室クリーニング",
  },
  {
    season: "秋",
    title: "寒さ対策セット",
    description: "エアコン＋窓ガラスクリーニング",
  },
  {
    season: "冬",
    title: "大掃除応援パック",
    description: "エアコン＋リビングクリーニング（床清掃・ワックスがけ）",
  },
]

export default function SeasonalPlansEditor() {
  const [seasonalPlans, setSeasonalPlans] = useState<SeasonalPlan[]>(initialSeasonalPlans)

  useEffect(() => {
    const fetchSeasonalPlans = async () => {
      try {
        const response = await fetch("/api/content?section=seasonalPlans")
        const data = await response.json()
        if (data && Array.isArray(data)) {
          setSeasonalPlans(data)
        }
      } catch (error) {
        console.error("Error fetching seasonal plans:", error)
        const savedSeasonalPlans = localStorage.getItem("seasonalPlansContent")
        if (savedSeasonalPlans) {
          setSeasonalPlans(JSON.parse(savedSeasonalPlans))
        }
      }
    }

    fetchSeasonalPlans()
  }, [])

  const handleChange = (index: number, field: keyof SeasonalPlan, value: string) => {
    const newSeasonalPlans = [...seasonalPlans]
    newSeasonalPlans[index] = { ...newSeasonalPlans[index], [field]: value }
    setSeasonalPlans(newSeasonalPlans)
  }

  const handleSave = async () => {
    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section: "seasonalPlans",
          content: seasonalPlans,
        }),
      })

      if (response.ok) {
        localStorage.setItem("seasonalPlansContent", JSON.stringify(seasonalPlans))
        alert("季節別おすすめプランの内容が保存されました。")
      } else {
        throw new Error("Failed to save to database")
      }
    } catch (error) {
      console.error("Error saving seasonal plans:", error)
      localStorage.setItem("seasonalPlansContent", JSON.stringify(seasonalPlans))
      alert("季節別おすすめプランの内容が保存されました（ローカルのみ）。")
    }
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="spring">
        <TabsList>
          {seasonalPlans.map((plan) => (
            <TabsTrigger key={plan.season} value={plan.season}>
              {plan.season}のおすすめ
            </TabsTrigger>
          ))}
        </TabsList>
        {seasonalPlans.map((plan, index) => (
          <TabsContent key={plan.season} value={plan.season}>
            <Card>
              <CardHeader>
                <CardTitle>{plan.season}のおすすめプラン</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block mb-2">タイトル</label>
                  <Input
                    value={plan.title}
                    onChange={(e) => handleChange(index, "title", e.target.value)}
                    placeholder="タイトル"
                  />
                </div>
                <div>
                  <label className="block mb-2">説明</label>
                  <Textarea
                    value={plan.description}
                    onChange={(e) => handleChange(index, "description", e.target.value)}
                    placeholder="説明"
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
