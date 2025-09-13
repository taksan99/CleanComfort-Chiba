"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface PricingItem {
  name: string
  price: string
  description: string
}

interface PricingCategory {
  name: string
  description: string
  items: PricingItem[]
}

const defaultCategories: PricingCategory[] = [
  {
    name: "ハウスクリーニング",
    description: "住宅の各部分を専門的にクリーニング",
    items: [
      { name: "水回り5点セット", price: "68,000円～", description: "洗面所・キッチン・浴室・トイレ・洗濯機周り" },
      { name: "キッチン", price: "20,000円～", description: "レンジフード・コンロ・シンク" },
      { name: "浴室", price: "20,000円～", description: "床・壁・天井・鏡・蛇口" },
      { name: "トイレ", price: "10,000円～", description: "便器・床・壁・換気扇" },
    ],
  },
  {
    name: "エアコンクリーニング",
    description: "エアコンの種類に応じた専門クリーニング",
    items: [
      { name: "通常エアコン", price: "12,000円～", description: "壁掛け型エアコン" },
      { name: "お掃除機能付き", price: "22,000円～", description: "自動お掃除機能付きエアコン" },
      { name: "業務用エアコン", price: "33,000円～", description: "4方向タイプ" },
    ],
  },
]

export default function PricingOverviewEditor() {
  const [categories, setCategories] = useState<PricingCategory[]>(defaultCategories)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/update-content?type=pricing")
        const result = await response.json()
        if (result.success && result.data.length > 0) {
          const dbCategories = result.data.map((cat: any) => ({
            name: cat.category_name,
            description: cat.description,
            items: cat.items,
          }))
          setCategories(dbCategories)
        }
      } catch (error) {
        console.error("Error fetching pricing data:", error)
        toast({
          title: "エラー",
          description: "料金データの読み込みに失敗しました。",
          variant: "destructive",
        })
      }
    }

    fetchData()
  }, [toast])

  const handleCategoryChange = (index: number, field: keyof Omit<PricingCategory, "items">, value: string) => {
    setCategories((prev) => prev.map((cat, i) => (i === index ? { ...cat, [field]: value } : cat)))
  }

  const handleItemChange = (categoryIndex: number, itemIndex: number, field: keyof PricingItem, value: string) => {
    setCategories((prev) =>
      prev.map((cat, i) =>
        i === categoryIndex
          ? {
              ...cat,
              items: cat.items.map((item, j) => (j === itemIndex ? { ...item, [field]: value } : item)),
            }
          : cat,
      ),
    )
  }

  const handleAddCategory = () => {
    setCategories((prev) => [...prev, { name: "", description: "", items: [] }])
  }

  const handleRemoveCategory = (index: number) => {
    setCategories((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAddItem = (categoryIndex: number) => {
    setCategories((prev) =>
      prev.map((cat, i) =>
        i === categoryIndex
          ? {
              ...cat,
              items: [...cat.items, { name: "", price: "", description: "" }],
            }
          : cat,
      ),
    )
  }

  const handleRemoveItem = (categoryIndex: number, itemIndex: number) => {
    setCategories((prev) =>
      prev.map((cat, i) =>
        i === categoryIndex
          ? {
              ...cat,
              items: cat.items.filter((_, j) => j !== itemIndex),
            }
          : cat,
      ),
    )
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/update-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "pricing",
          data: categories,
        }),
      })

      const result = await response.json()
      if (result.success) {
        toast({
          title: "保存完了",
          description: "料金設定が正常に保存されました。",
        })
      } else {
        throw new Error(result.error || "Save failed")
      }
    } catch (error) {
      console.error("Error saving pricing:", error)
      toast({
        title: "エラー",
        description: "料金設定の保存に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {categories.map((category, categoryIndex) => (
        <Card key={categoryIndex}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>カテゴリー {categoryIndex + 1}</CardTitle>
              <Button variant="destructive" size="sm" onClick={() => handleRemoveCategory(categoryIndex)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">カテゴリー名</label>
              <Input
                value={category.name}
                onChange={(e) => handleCategoryChange(categoryIndex, "name", e.target.value)}
                placeholder="カテゴリー名"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">説明</label>
              <Textarea
                value={category.description}
                onChange={(e) => handleCategoryChange(categoryIndex, "description", e.target.value)}
                placeholder="カテゴリーの説明"
                rows={2}
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">料金項目</label>
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="border p-3 rounded mb-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">項目 {itemIndex + 1}</span>
                    <Button variant="destructive" size="sm" onClick={() => handleRemoveItem(categoryIndex, itemIndex)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <Input
                      value={item.name}
                      onChange={(e) => handleItemChange(categoryIndex, itemIndex, "name", e.target.value)}
                      placeholder="サービス名"
                    />
                    <Input
                      value={item.price}
                      onChange={(e) => handleItemChange(categoryIndex, itemIndex, "price", e.target.value)}
                      placeholder="料金"
                    />
                    <Input
                      value={item.description}
                      onChange={(e) => handleItemChange(categoryIndex, itemIndex, "description", e.target.value)}
                      placeholder="説明"
                    />
                  </div>
                </div>
              ))}

              <Button variant="outline" onClick={() => handleAddItem(categoryIndex)} className="mt-2">
                <Plus className="h-4 w-4 mr-2" />
                項目を追加
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button variant="outline" onClick={handleAddCategory}>
        <Plus className="h-4 w-4 mr-2" />
        カテゴリーを追加
      </Button>

      <Button onClick={handleSave} disabled={isLoading}>
        {isLoading ? "保存中..." : "保存"}
      </Button>
    </div>
  )
}
