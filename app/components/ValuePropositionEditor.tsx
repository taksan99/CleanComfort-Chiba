"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

interface ValuePropositionItem {
  icon: string
  title: string
  description: string
}

const initialItems: ValuePropositionItem[] = [
  {
    icon: "✨",
    title: "清潔で快適な住環境",
    description: "プロの技術で隅々まで清潔に",
  },
  {
    icon: "⏰",
    title: "時間の有効活用",
    description: "掃除の時間を大切な時間に",
  },
  {
    icon: "🌿",
    title: "健康的な生活空間",
    description: "アレルゲンや細菌を徹底除去",
  },
  {
    icon: "💆‍♀️",
    title: "心の安らぎ",
    description: "美しい空間で心もリフレッシュ",
  },
]

export default function ValuePropositionEditor() {
  const [items, setItems] = useState<ValuePropositionItem[]>(initialItems)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/site-content?section=valueProposition")
        const data = await response.json()
        if (data && Array.isArray(data)) {
          setItems(data)
        }
      } catch (error) {
        console.error("Error fetching value proposition:", error)
        // Fallback to localStorage
        const saved = localStorage.getItem("valuePropositionContent")
        if (saved) {
          setItems(JSON.parse(saved))
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
          section: "valueProposition",
          content: items,
        }),
      })

      if (response.ok) {
        // Also save to localStorage as backup
        localStorage.setItem("valuePropositionContent", JSON.stringify(items))
        toast({
          title: "保存完了",
          description: "4つの幸せな暮らしの内容が保存されました。",
        })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      console.error("Error saving value proposition:", error)
      toast({
        title: "エラー",
        description: "保存に失敗しました。",
        variant: "destructive",
      })
    }
  }

  const updateItem = (index: number, field: keyof ValuePropositionItem, value: string) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">4つの幸せな暮らし</h3>
        <Button onClick={handleSave}>保存</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>項目 {index + 1}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">アイコン</label>
                <Input value={item.icon} onChange={(e) => updateItem(index, "icon", e.target.value)} placeholder="✨" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">タイトル</label>
                <Input
                  value={item.title}
                  onChange={(e) => updateItem(index, "title", e.target.value)}
                  placeholder="タイトルを入力"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">説明</label>
                <Textarea
                  value={item.description}
                  onChange={(e) => updateItem(index, "description", e.target.value)}
                  placeholder="説明を入力"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
