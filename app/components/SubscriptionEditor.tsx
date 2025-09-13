"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

interface SubscriptionPlan {
  name: string
  price: string
  description: string
  features: string[]
  limits: string
  color: string
  buttonColor: string
  ribbonColor: string
}

const initialPlans: SubscriptionPlan[] = [
  {
    name: "ベーシック",
    price: "9,800",
    description: "月1回の基本清掃",
    features: [
      "リビング・キッチン清掃",
      "浴室・トイレ清掃",
      "掃除機がけ・拭き掃除",
      "洗濯1回分（乾燥・たたみ含む）",
      "ゴミ出し",
    ],
    limits: "40㎡までの物件対象。それ以上の物件は追加料金で対応可能。",
    color: "bg-blue-100",
    buttonColor: "bg-blue-500 hover:bg-blue-600",
    ribbonColor: "from-yellow-600 to-yellow-800",
  },
  {
    name: "スタンダード",
    price: "19,800",
    description: "月2回の総合清掃",
    features: [
      "ベーシックプランの全内容",
      "エアコンフィルター清掃",
      "冷蔵庫・電子レンジ清掃",
      "窓ガラス・網戸清掃",
      "洗濯2回分（乾燥・たたみ含む）",
      "布団干し",
    ],
    limits: "60㎡までの物件対象。それ以上の物件は追加料金で対応可能。",
    color: "bg-green-100",
    buttonColor: "bg-green-500 hover:bg-green-600",
    ribbonColor: "from-gray-400 to-gray-600",
  },
  {
    name: "プレミアム",
    price: "59,800",
    description: "月3回の徹底清掃＋家事代行",
    features: [
      "スタンダードプランの全内容",
      "クローゼット整理",
      "ベッドメイキング",
      "アイロンがけ",
      "買い物代行",
      "植物の水やり・ペットのお世話",
      "靴磨き",
    ],
    limits: "80㎡までの物件対象。それ以上の物件は追加料金で対応可能。",
    color: "bg-yellow-100",
    buttonColor: "bg-yellow-500 hover:bg-yellow-600",
    ribbonColor: "from-yellow-400 to-yellow-600",
  },
]

export default function SubscriptionEditor() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(initialPlans)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/content?section=subscriptionPlans")
      const content = await response.json()
      if (content && Array.isArray(content)) {
        setPlans(content)
      }
    } catch (error) {
      console.error("Error fetching subscription plans:", error)
    }
  }

  const handlePlanChange = (index: number, field: keyof SubscriptionPlan, value: string | string[]) => {
    const newPlans = [...plans]
    if (field === "features") {
      newPlans[index][field] = (value as string).split("\n").filter((feature) => feature.trim() !== "")
    } else {
      newPlans[index][field] = value as string
    }
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
          section: "subscriptionPlans",
          content: plans,
        }),
      })

      if (response.ok) {
        toast({
          title: "保存完了",
          description: "サブスクリプションプランが正常に保存されました。",
        })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      console.error("Error saving subscription plans:", error)
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
      <Tabs defaultValue="plan0">
        <TabsList>
          {plans.map((plan, index) => (
            <TabsTrigger key={index} value={`plan${index}`}>
              {plan.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {plans.map((plan, index) => (
          <TabsContent key={index} value={`plan${index}`}>
            <Card>
              <CardHeader>
                <CardTitle>{plan.name}プラン</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block mb-2">プラン名</label>
                  <Input
                    value={plan.name}
                    onChange={(e) => handlePlanChange(index, "name", e.target.value)}
                    placeholder="プラン名"
                  />
                </div>
                <div>
                  <label className="block mb-2">価格</label>
                  <Input
                    value={plan.price}
                    onChange={(e) => handlePlanChange(index, "price", e.target.value)}
                    placeholder="価格"
                  />
                </div>
                <div>
                  <label className="block mb-2">説明</label>
                  <Input
                    value={plan.description}
                    onChange={(e) => handlePlanChange(index, "description", e.target.value)}
                    placeholder="説明"
                  />
                </div>
                <div>
                  <label className="block mb-2">特徴（1行に1つずつ入力してください）</label>
                  <Textarea
                    value={plan.features.join("\n")}
                    onChange={(e) => handlePlanChange(index, "features", e.target.value)}
                    placeholder="特徴"
                    rows={5}
                  />
                </div>
                <div>
                  <label className="block mb-2">適用条件</label>
                  <Input
                    value={plan.limits}
                    onChange={(e) => handlePlanChange(index, "limits", e.target.value)}
                    placeholder="適用条件"
                  />
                </div>
                <div>
                  <label className="block mb-2">カードの色</label>
                  <Input
                    value={plan.color}
                    onChange={(e) => handlePlanChange(index, "color", e.target.value)}
                    placeholder="カードの色（Tailwind CSSクラス）"
                  />
                </div>
                <div>
                  <label className="block mb-2">ボタンの色</label>
                  <Input
                    value={plan.buttonColor}
                    onChange={(e) => handlePlanChange(index, "buttonColor", e.target.value)}
                    placeholder="ボタンの色（Tailwind CSSクラス）"
                  />
                </div>
                <div>
                  <label className="block mb-2">リボンの色</label>
                  <Input
                    value={plan.ribbonColor}
                    onChange={(e) => handlePlanChange(index, "ribbonColor", e.target.value)}
                    placeholder="リボンの色（Tailwind CSSクラス）"
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
