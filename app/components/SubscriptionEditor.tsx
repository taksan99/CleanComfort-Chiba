"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2 } from "lucide-react"

interface SubscriptionPlan {
  name: string
  price: string
  description: string
  features: string[]
  popular?: boolean
}

const initialPlans: SubscriptionPlan[] = [
  {
    name: "ベーシック",
    price: "月額 15,000円",
    description: "基本的なハウスケアサービス",
    features: ["月1回のハウスクリーニング", "エアコンクリーニング（年2回）", "24時間サポート"],
  },
  {
    name: "スタンダード",
    price: "月額 25,000円",
    description: "充実したハウスケアサービス",
    features: [
      "月2回のハウスクリーニング",
      "エアコンクリーニング（年4回）",
      "便利屋サービス（月1回）",
      "24時間サポート",
      "優先対応",
    ],
    popular: true,
  },
  {
    name: "プレミアム",
    price: "月額 40,000円",
    description: "最高級のハウスケアサービス",
    features: [
      "週1回のハウスクリーニング",
      "エアコンクリーニング（年6回）",
      "便利屋サービス（月2回）",
      "24時間サポート",
      "最優先対応",
      "専任スタッフ",
    ],
  },
]

export default function SubscriptionEditor() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(initialPlans)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/site-content?section=subscription")
        const data = await response.json()
        if (data && Array.isArray(data)) {
          setPlans(data)
        }
      } catch (error) {
        console.error("Error fetching subscription plans:", error)
        // Fallback to localStorage
        const savedPlans = localStorage.getItem("subscriptionContent")
        if (savedPlans) {
          setPlans(JSON.parse(savedPlans))
        }
      }
    }

    fetchData()
  }, [])

  const handlePlanChange = (index: number, field: keyof SubscriptionPlan, value: string | boolean) => {
    const newPlans = [...plans]
    newPlans[index] = { ...newPlans[index], [field]: value }
    setPlans(newPlans)
  }

  const handleFeatureChange = (planIndex: number, featureIndex: number, value: string) => {
    const newPlans = [...plans]
    newPlans[planIndex].features[featureIndex] = value
    setPlans(newPlans)
  }

  const handleAddFeature = (planIndex: number) => {
    const newPlans = [...plans]
    newPlans[planIndex].features.push("")
    setPlans(newPlans)
  }

  const handleRemoveFeature = (planIndex: number, featureIndex: number) => {
    const newPlans = [...plans]
    newPlans[planIndex].features.splice(featureIndex, 1)
    setPlans(newPlans)
  }

  const handleSave = async () => {
    try {
      const response = await fetch("/api/site-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section: "subscription",
          content: plans,
        }),
      })

      if (response.ok) {
        localStorage.setItem("subscriptionContent", JSON.stringify(plans))
        alert("サブスクリプションプランの内容が保存されました。")
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      console.error("Error saving subscription plans:", error)
      alert("保存中にエラーが発生しました。")
    }
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="plan0">
        <TabsList>
          {plans.map((_, index) => (
            <TabsTrigger key={index} value={`plan${index}`}>
              {initialPlans[index]?.name || `プラン ${index + 1}`}
            </TabsTrigger>
          ))}
        </TabsList>
        {plans.map((plan, planIndex) => (
          <TabsContent key={planIndex} value={`plan${planIndex}`}>
            <Card>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block mb-2">プラン名</label>
                  <Input
                    value={plan.name}
                    onChange={(e) => handlePlanChange(planIndex, "name", e.target.value)}
                    placeholder="プラン名"
                  />
                </div>
                <div>
                  <label className="block mb-2">価格</label>
                  <Input
                    value={plan.price}
                    onChange={(e) => handlePlanChange(planIndex, "price", e.target.value)}
                    placeholder="価格"
                  />
                </div>
                <div>
                  <label className="block mb-2">説明</label>
                  <Textarea
                    value={plan.description}
                    onChange={(e) => handlePlanChange(planIndex, "description", e.target.value)}
                    placeholder="説明"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block mb-2">特徴</label>
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex space-x-2 mb-2">
                      <Input
                        value={feature}
                        onChange={(e) => handleFeatureChange(planIndex, featureIndex, e.target.value)}
                        placeholder="特徴"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveFeature(planIndex, featureIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={() => handleAddFeature(planIndex)} className="mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    特徴を追加
                  </Button>
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
