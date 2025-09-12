"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ValuePropositionItem {
  title: string
  description: string
  icon: string
}

export default function ValuePropositionEditor() {
  const [items, setItems] = useState<ValuePropositionItem[]>([
    { title: "清潔で快適な住環境", description: "プロの技術で隅々まで清潔に", icon: "✨" },
    { title: "時間の有効活用", description: "掃除の時間を大切な時間に", icon: "⏰" },
    { title: "健康的な生活空間", description: "アレルゲンや細菌を徹底除去", icon: "🌿" },
    { title: "心の安らぎ", description: "美しい空間で心もリフレッシュ", icon: "💆‍♀️" },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/content?section=valueProposition")
      const data = await response.json()
      if (data.content) {
        setItems(data.content)
      }
    } catch (error) {
      console.error("Error fetching content:", error)
    }
  }

  const handleItemChange = (index: number, field: keyof ValuePropositionItem, value: string) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const handleAddItem = () => {
    setItems([...items, { title: "", description: "", icon: "✨" }])
  }

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
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
          section: "valueProposition",
          content: items,
        }),
      })

      if (response.ok) {
        toast({
          title: "保存完了",
          description: "4つの幸せな暮らしの内容が正常に保存されました。",
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
      <Card>
        <CardHeader>
          <CardTitle>4つの幸せな暮らし</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="border p-4 rounded-lg space-y-2">
              <div className="flex space-x-2">
                <Input
                  value={item.icon}
                  onChange={(e) => handleItemChange(index, "icon", e.target.value)}
                  placeholder="アイコン"
                  className="w-20"
                />
                <Input
                  value={item.title}
                  onChange={(e) => handleItemChange(index, "title", e.target.value)}
                  placeholder="タイトル"
                  className="flex-1"
                />
                <Button variant="destructive" size="icon" onClick={() => handleRemoveItem(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                value={item.description}
                onChange={(e) => handleItemChange(index, "description", e.target.value)}
                placeholder="説明"
                rows={2}
              />
            </div>
          ))}
          <Button variant="outline" onClick={handleAddItem} className="w-full bg-transparent">
            <Plus className="h-4 w-4 mr-2" />
            項目を追加
          </Button>
        </CardContent>
      </Card>
      <Button onClick={handleSave} disabled={isLoading}>
        {isLoading ? "保存中..." : "保存"}
      </Button>
    </div>
  )
}
