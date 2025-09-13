"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"

interface Promotion {
  id: string
  title: string
  description: string
  discount: string
  startDate: string
  endDate: string
  isActive: boolean
  note?: string
  variant: "A" | "B"
}

interface PromotionsData {
  campaignText: string
  promotions: Promotion[]
}

const initialPromotions: PromotionsData = {
  campaignText: "最大50%OFF！　春のお掃除キャンペーン実施中！",
  promotions: [
    {
      id: "1",
      title: "紹介キャンペーン",
      description: "お知り合いをご紹介いただくと、次回のご利用時に",
      discount: "10% OFF",
      startDate: "2023-01-01",
      endDate: "2025-12-31",
      isActive: true,
      note: "※ 紹介されたお客様が実際にサービスをご利用された場合に適用されます。",
      variant: "A",
    },
    {
      id: "2",
      title: "リピーター特典",
      description: "年2回以上ご利用いただくと、2回目以降のご利用時に",
      discount: "5% OFF",
      startDate: "2023-01-01",
      endDate: "2025-12-31",
      isActive: true,
      variant: "A",
    },
  ],
}

export default function PromotionsEditor() {
  const [promotionsData, setPromotionsData] = useState<PromotionsData>(initialPromotions)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchPromotions()
  }, [])

  const fetchPromotions = async () => {
    try {
      const response = await fetch("/api/content?section=promotions")
      const data = await response.json()
      if (data) {
        setPromotionsData(data)
      }
    } catch (error) {
      console.error("Error fetching promotions:", error)
    }
  }

  const handleCampaignTextChange = (value: string) => {
    setPromotionsData({ ...promotionsData, campaignText: value })
  }

  const handlePromotionChange = (index: number, field: keyof Promotion, value: any) => {
    const newPromotions = [...promotionsData.promotions]
    newPromotions[index] = { ...newPromotions[index], [field]: value }
    setPromotionsData({ ...promotionsData, promotions: newPromotions })
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
          section: "promotions",
          content: promotionsData,
        }),
      })

      if (response.ok) {
        toast({
          title: "保存完了",
          description: "プロモーション情報が正常に保存されました。",
        })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      console.error("Error saving promotions:", error)
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
          <CardTitle>キャンペーンテキスト</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={promotionsData.campaignText}
            onChange={(e) => handleCampaignTextChange(e.target.value)}
            placeholder="キャンペーンテキスト"
            rows={2}
          />
        </CardContent>
      </Card>

      {promotionsData.promotions.map((promotion, index) => (
        <Card key={promotion.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {promotion.title}
              <Switch
                checked={promotion.isActive}
                onCheckedChange={(checked) => handlePromotionChange(index, "isActive", checked)}
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block mb-2">タイトル</label>
              <Input
                value={promotion.title}
                onChange={(e) => handlePromotionChange(index, "title", e.target.value)}
                placeholder="プロモーションタイトル"
              />
            </div>
            <div>
              <label className="block mb-2">説明</label>
              <Textarea
                value={promotion.description}
                onChange={(e) => handlePromotionChange(index, "description", e.target.value)}
                placeholder="プロモーションの説明"
                rows={3}
              />
            </div>
            <div>
              <label className="block mb-2">割引内容</label>
              <Input
                value={promotion.discount}
                onChange={(e) => handlePromotionChange(index, "discount", e.target.value)}
                placeholder="割引内容（例：10% OFF）"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">開始日</label>
                <Input
                  type="date"
                  value={promotion.startDate}
                  onChange={(e) => handlePromotionChange(index, "startDate", e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2">終了日</label>
                <Input
                  type="date"
                  value={promotion.endDate}
                  onChange={(e) => handlePromotionChange(index, "endDate", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block mb-2">注意事項</label>
              <Textarea
                value={promotion.note || ""}
                onChange={(e) => handlePromotionChange(index, "note", e.target.value)}
                placeholder="注意事項や条件"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button onClick={handleSave} disabled={isLoading}>
        {isLoading ? "保存中..." : "保存"}
      </Button>
    </div>
  )
}
