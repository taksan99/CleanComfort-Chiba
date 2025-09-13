"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

interface PricingOverview {
  title: string
  description: string
  features: string[]
  note: string
}

const initialPricing: PricingOverview = {
  title: "明確で安心な料金体系",
  description: "お客様に安心してご利用いただけるよう、明確な料金設定を心がけています。",
  features: [
    "事前見積もり無料",
    "追加料金は事前にご相談",
    "作業内容に応じた適正価格",
    "各種割引制度あり",
    "支払い方法は現金・クレジットカード・銀行振込に対応",
  ],
  note: "料金は作業内容・お部屋の状況により変動する場合があります。詳細はお気軽にお問い合わせください。",
}

export default function PricingOverviewEditor() {
  const [pricing, setPricing] = useState<PricingOverview>(initialPricing)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchPricing()
  }, [])

  const fetchPricing = async () => {
    try {
      const response = await fetch("/api/content?section=pricingOverview")
      const data = await response.json()
      if (data) {
        setPricing(data)
      }
    } catch (error) {
      console.error("Error fetching pricing overview:", error)
    }
  }

  const handleChange = (field: keyof PricingOverview, value: string | string[]) => {
    setPricing({ ...pricing, [field]: value })
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
          section: "pricingOverview",
          content: pricing,
        }),
      })

      if (response.ok) {
        toast({
          title: "保存完了",
          description: "料金体系の内容が正常に保存されました。",
        })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      console.error("Error saving pricing overview:", error)
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
      <Card>
        <CardHeader>
          <CardTitle>料金体系</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block mb-2">タイトル</label>
            <Input
              value={pricing.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="タイトル"
            />
          </div>
          <div>
            <label className="block mb-2">説明</label>
            <Textarea
              value={pricing.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="説明"
              rows={3}
            />
          </div>
          <div>
            <label className="block mb-2">特徴（各項目を改行で区切ってください）</label>
            <Textarea
              value={pricing.features.join("\n")}
              onChange={(e) => handleChange("features", e.target.value.split("\n").filter(Boolean))}
              placeholder="特徴"
              rows={6}
            />
          </div>
          <div>
            <label className="block mb-2">注意事項・備考</label>
            <Textarea
              value={pricing.note}
              onChange={(e) => handleChange("note", e.target.value)}
              placeholder="注意事項や備考"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
      <Button onClick={handleSave} disabled={isLoading}>
        {isLoading ? "保存中..." : "保存"}
      </Button>
    </div>
  )
}
