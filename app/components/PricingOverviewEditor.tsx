"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { PricingCategory } from "./PricingOverview"

const initialPricingData: PricingCategory[] = [
  {
    category: "掃除サービス",
    icon: "Droplet",
    color: "from-blue-500 to-cyan-400",
    textColor: "text-blue-700",
    borderColor: "border-blue-500",
    items: [
      { service: "水回り5点セット（浴室/キッチン/レンジフード/トイレ/洗面台）", price: "68,000円～" },
      { service: "浴室、キッチン、レンジフード", price: "20,000円～" },
      { service: "トイレ", price: "10,000円～" },
      { service: "ガラス・サッシクリーニング（3枚）", price: "10,000円～" },
      { service: "ベランダ", price: "6,000円～" },
    ],
  },
  {
    category: "エアコン掃除",
    icon: "Wind",
    color: "from-green-500 to-emerald-400",
    textColor: "text-green-700",
    borderColor: "border-green-500",
    items: [
      { service: "通常エアコンクリーニング", price: "12,000円～" },
      { service: "お掃除機能付きエアコン", price: "22,000円～" },
      { service: "ご家庭用埋込式エアコン", price: "25,000円～" },
      { service: "業務用4方向エアコン", price: "33,000円～" },
      { service: "室外機", price: "6,000円～" },
    ],
  },
  {
    category: "便利屋さんサービス",
    icon: "Wrench",
    color: "from-yellow-500 to-amber-400",
    textColor: "text-yellow-700",
    borderColor: "border-yellow-500",
    items: [
      { service: "害獣・害虫駆除", price: "10,000円～" },
      { service: "墓参り代行", price: "10,000円～" },
      { service: "ペットの世話（1回）", price: "3,000円～" },
      { service: "友達代行（1時間）", price: "5,000円～" },
      { service: "庭の手入れ", price: "8,000円～" },
      { service: "その他、どんなことでも！", price: "要相談" },
    ],
  },
]

export default function PricingOverviewEditor() {
  const [pricingData, setPricingData] = useState<PricingCategory[]>(initialPricingData)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/content?section=pricingOverview")
      const data = await response.json()
      if (data.content) {
        setPricingData(data.content)
      }
    } catch (error) {
      console.error("Error fetching pricing content:", error)
      // Fallback to localStorage if API fails
      const savedPricingData = localStorage.getItem("pricingOverviewContent")
      if (savedPricingData) {
        setPricingData(JSON.parse(savedPricingData))
      }
    }
  }

  const handleCategoryChange = (index: number, field: keyof PricingCategory, value: string) => {
    const newPricingData = [...pricingData]
    newPricingData[index] = { ...newPricingData[index], [field]: value }
    setPricingData(newPricingData)
  }

  const handleItemChange = (categoryIndex: number, itemIndex: number, field: "service" | "price", value: string) => {
    const newPricingData = [...pricingData]
    newPricingData[categoryIndex].items[itemIndex] = {
      ...newPricingData[categoryIndex].items[itemIndex],
      [field]: value,
    }
    setPricingData(newPricingData)
  }

  const handleAddItem = (categoryIndex: number) => {
    const newPricingData = [...pricingData]
    newPricingData[categoryIndex].items.push({ service: "", price: "" })
    setPricingData(newPricingData)
  }

  const handleRemoveItem = (categoryIndex: number, itemIndex: number) => {
    const newPricingData = [...pricingData]
    newPricingData[categoryIndex].items.splice(itemIndex, 1)
    setPricingData(newPricingData)
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
          content: pricingData,
        }),
      })

      if (response.ok) {
        // Also save to localStorage as backup
        localStorage.setItem("pricingOverviewContent", JSON.stringify(pricingData))
        toast({
          title: "保存完了",
          description: "料金体系の内容が正常に保存されました。",
        })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      console.error("Error saving content:", error)
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
      <Tabs defaultValue="category0">
        <TabsList>
          {pricingData.map((category, index) => (
            <TabsTrigger key={index} value={`category${index}`}>
              {category.category}
            </TabsTrigger>
          ))}
        </TabsList>
        {pricingData.map((category, categoryIndex) => (
          <TabsContent key={categoryIndex} value={`category${categoryIndex}`}>
            <Card>
              <CardHeader>
                <CardTitle>{category.category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block mb-2">カテゴリー名</label>
                  <Input
                    value={category.category}
                    onChange={(e) => handleCategoryChange(categoryIndex, "category", e.target.value)}
                    placeholder="カテゴリー名"
                  />
                </div>
                <div>
                  <label className="block mb-2">サービス項目</label>
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex space-x-2 mb-2">
                      <Input
                        value={item.service}
                        onChange={(e) => handleItemChange(categoryIndex, itemIndex, "service", e.target.value)}
                        placeholder="サービス名"
                      />
                      <Input
                        value={item.price}
                        onChange={(e) => handleItemChange(categoryIndex, itemIndex, "price", e.target.value)}
                        placeholder="価格"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveItem(categoryIndex, itemIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={() => handleAddItem(categoryIndex)} className="mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    項目を追加
                  </Button>
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
