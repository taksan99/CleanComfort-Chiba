"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PromotionCard {
  id: string
  title: string
  description: string
  discount: string
  note?: string
  startDate: string
  endDate: string
  isActive: boolean
  variant: "A" | "B"
}

const initialPromotions: PromotionCard[] = [
  {
    id: "1",
    title: "紹介キャンペーン",
    description: "お知り合いをご紹介いただくと、次回のご利用時に",
    discount: "10% OFF",
    note: "※ 紹介されたお客様が実際にサービスをご利用された場合に適用されます。",
    startDate: "2023-01-01",
    endDate: "2025-12-31",
    isActive: true,
    variant: "A",
  },
  {
    id: "2",
    title: "リピーター特典",
    description: "年2回以上ご利用いただくと、2回目以降のご利用時",
    discount: "5% OFF",
    startDate: "2023-01-01",
    endDate: "2025-12-31",
    isActive: true,
    variant: "A",
  },
]

export default function PromotionsEditor() {
  const [promotions, setPromotions] = useState<PromotionCard[]>(initialPromotions)
  const [campaignText, setCampaignText] = useState("最大50%OFF！　春のお掃除キャンペーン実施中！")

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch("/api/content?section=promotions")
        const data = await response.json()
        if (data && data.promotions && data.campaignText) {
          setPromotions(data.promotions)
          setCampaignText(data.campaignText)
        }
      } catch (error) {
        console.error("Error fetching promotions:", error)
        const savedPromotions = localStorage.getItem("promotionsContent")
        if (savedPromotions) {
          setPromotions(JSON.parse(savedPromotions))
        }

        const savedCampaignText = localStorage.getItem("promotionsCampaignText")
        if (savedCampaignText) {
          setCampaignText(savedCampaignText)
        }
      }
    }

    fetchPromotions()
  }, [])

  const handlePromotionChange = (index: number, field: keyof PromotionCard, value: string | boolean) => {
    const newPromotions = [...promotions]
    newPromotions[index] = { ...newPromotions[index], [field]: value }
    setPromotions(newPromotions)
  }

  const handleAddPromotion = () => {
    const newPromotion: PromotionCard = {
      id: Date.now().toString(),
      title: "新しいプロモーション",
      description: "プロモーションの説明",
      discount: "10% OFF",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      isActive: true,
      variant: "A",
    }
    setPromotions([...promotions, newPromotion])
  }

  const handleDeletePromotion = (index: number) => {
    const newPromotions = [...promotions]
    newPromotions.splice(index, 1)
    setPromotions(newPromotions)
  }

  const handleSave = async () => {
    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section: "promotions",
          content: {
            promotions: promotions,
            campaignText: campaignText,
          },
        }),
      })

      if (response.ok) {
        localStorage.setItem("promotionsContent", JSON.stringify(promotions))
        localStorage.setItem("promotionsCampaignText", campaignText)
        alert("お得な特典の内容が保存されました。")
      } else {
        throw new Error("Failed to save to database")
      }
    } catch (error) {
      console.error("Error saving promotions:", error)
      localStorage.setItem("promotionsContent", JSON.stringify(promotions))
      localStorage.setItem("promotionsCampaignText", campaignText)
      alert("お得な特典の内容が保存されました（ローカルのみ）。")
    }
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="promotions">
        <TabsList>
          <TabsTrigger value="promotions">プロモーション</TabsTrigger>
          <TabsTrigger value="campaign">キャンペーン告知</TabsTrigger>
          <TabsTrigger value="abtest">A/Bテスト設定</TabsTrigger>
        </TabsList>
        <TabsContent value="promotions">
          {promotions.map((promotion, index) => (
            <Card key={promotion.id} className="mb-4">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{promotion.title}</span>
                  <Button variant="destructive" size="sm" onClick={() => handleDeletePromotion(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={`title-${index}`}>タイトル</Label>
                  <Input
                    id={`title-${index}`}
                    value={promotion.title}
                    onChange={(e) => handlePromotionChange(index, "title", e.target.value)}
                    placeholder="タイトル"
                  />
                </div>
                <div>
                  <Label htmlFor={`description-${index}`}>説明</Label>
                  <Textarea
                    id={`description-${index}`}
                    value={promotion.description}
                    onChange={(e) => handlePromotionChange(index, "description", e.target.value)}
                    placeholder="説明"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor={`discount-${index}`}>割引率</Label>
                  <Input
                    id={`discount-${index}`}
                    value={promotion.discount}
                    onChange={(e) => handlePromotionChange(index, "discount", e.target.value)}
                    placeholder="割引率"
                  />
                </div>
                <div>
                  <Label htmlFor={`note-${index}`}>注釈</Label>
                  <Textarea
                    id={`note-${index}`}
                    value={promotion.note || ""}
                    onChange={(e) => handlePromotionChange(index, "note", e.target.value)}
                    placeholder="注釈"
                    rows={2}
                  />
                </div>
                <div className="flex space-x-4">
                  <div>
                    <Label htmlFor={`startDate-${index}`}>開始日</Label>
                    <Input
                      id={`startDate-${index}`}
                      type="date"
                      value={promotion.startDate}
                      onChange={(e) => handlePromotionChange(index, "startDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`endDate-${index}`}>終了日</Label>
                    <Input
                      id={`endDate-${index}`}
                      type="date"
                      value={promotion.endDate}
                      onChange={(e) => handlePromotionChange(index, "endDate", e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`isActive-${index}`}
                    checked={promotion.isActive}
                    onCheckedChange={(checked) => handlePromotionChange(index, "isActive", checked)}
                  />
                  <Label htmlFor={`isActive-${index}`}>アクティブ</Label>
                </div>
                <div>
                  <Label htmlFor={`variant-${index}`}>A/Bテストバリアント</Label>
                  <Select
                    value={promotion.variant}
                    onValueChange={(value) => handlePromotionChange(index, "variant", value)}
                  >
                    <SelectTrigger id={`variant-${index}`}>
                      <SelectValue placeholder="バリアントを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">バリアントA</SelectItem>
                      <SelectItem value="B">バリアントB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button onClick={handleAddPromotion} className="w-full">
            <PlusCircle className="h-4 w-4 mr-2" />
            新しいプロモーションを追加
          </Button>
        </TabsContent>
        <TabsContent value="campaign">
          <Card>
            <CardHeader>
              <CardTitle>キャンペーン告知</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="campaignText">キャンペーンテキスト</Label>
                <Textarea
                  id="campaignText"
                  value={campaignText}
                  onChange={(e) => setCampaignText(e.target.value)}
                  placeholder="キャンペーンテキスト"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="abtest">
          <Card>
            <CardHeader>
              <CardTitle>A/Bテスト設定</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">A/Bテストを開始するには、以下の手順に従ってください：</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>プロモーションタブで、テストしたいプロモーションを選択します。</li>
                <li>選択したプロモーションの「A/Bテストバリアント」でAとBを設定します。</li>
                <li>バリアントAとBで異なる説明文や割引率を設定します。</li>
                <li>設定が完了したら、「変更を保存」ボタンをクリックします。</li>
                <li>これで、ユーザーにランダムでバリアントAまたはBが表示されます。</li>
              </ol>
              <p className="mt-4">
                テスト結果の分析は別途行う必要があります。各バリアントのパフォーマンスを追跡し、効果を測定してください。
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Button onClick={handleSave}>保存</Button>
    </div>
  )
}
