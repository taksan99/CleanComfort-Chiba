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

interface ValuePropositionData {
  title: string
  subtitle: string
  items: ValuePropositionItem[]
}

const defaultData: ValuePropositionData = {
  title: "4つの幸せな暮らし",
  subtitle: "私たちのサービスで実現する理想の生活",
  items: [
    {
      title: "清潔で快適な住環境",
      description: "プロの技術で隅々まで清潔に。毎日を気持ちよく過ごせる空間を提供します。",
      icon: "Home",
    },
    {
      title: "時間の有効活用",
      description: "掃除の時間を家族や趣味の時間に。あなたの大切な時間を取り戻します。",
      icon: "Clock",
    },
    {
      title: "健康的な生活",
      description: "アレルゲンやカビを除去し、家族の健康を守る清潔な環境を作ります。",
      icon: "Heart",
    },
    {
      title: "安心のサポート",
      description: "経験豊富なスタッフが丁寧に対応。アフターサービスも充実しています。",
      icon: "Shield",
    },
  ],
}

export default function ValuePropositionEditor() {
  const [data, setData] = useState<ValuePropositionData>(defaultData)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/update-content?type=valueProposition")
        const result = await response.json()
        if (result.success && result.data.length > 0) {
          const dbData = result.data[0]
          setData({
            title: dbData.title,
            subtitle: dbData.subtitle,
            items: dbData.items,
          })
        }
      } catch (error) {
        console.error("Error fetching value proposition data:", error)
        toast({
          title: "エラー",
          description: "データの読み込みに失敗しました。",
          variant: "destructive",
        })
      }
    }

    fetchData()
  }, [toast])

  const handleTitleChange = (value: string) => {
    setData((prev) => ({ ...prev, title: value }))
  }

  const handleSubtitleChange = (value: string) => {
    setData((prev) => ({ ...prev, subtitle: value }))
  }

  const handleItemChange = (index: number, field: keyof ValuePropositionItem, value: string) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

  const handleAddItem = () => {
    setData((prev) => ({
      ...prev,
      items: [...prev.items, { title: "", description: "", icon: "Star" }],
    }))
  }

  const handleRemoveItem = (index: number) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
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
          type: "valueProposition",
          data: data,
        }),
      })

      const result = await response.json()
      if (result.success) {
        toast({
          title: "保存完了",
          description: "4つの幸せな暮らしの内容が正常に保存されました。",
        })
      } else {
        throw new Error(result.error || "Save failed")
      }
    } catch (error) {
      console.error("Error saving value proposition:", error)
      toast({
        title: "エラー",
        description: "データの保存に失敗しました。",
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
          <CardTitle>4つの幸せな暮らし編集</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">タイトル</label>
            <Input
              value={data.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="セクションのタイトル"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">サブタイトル</label>
            <Input
              value={data.subtitle}
              onChange={(e) => handleSubtitleChange(e.target.value)}
              placeholder="セクションのサブタイトル"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">項目</label>
            {data.items.map((item, index) => (
              <div key={index} className="border p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">項目 {index + 1}</h4>
                  <Button variant="destructive" size="sm" onClick={() => handleRemoveItem(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Input
                    value={item.title}
                    onChange={(e) => handleItemChange(index, "title", e.target.value)}
                    placeholder="項目のタイトル"
                  />
                  <Textarea
                    value={item.description}
                    onChange={(e) => handleItemChange(index, "description", e.target.value)}
                    placeholder="項目の説明"
                    rows={3}
                  />
                  <Input
                    value={item.icon}
                    onChange={(e) => handleItemChange(index, "icon", e.target.value)}
                    placeholder="アイコン名 (Lucide React)"
                  />
                </div>
              </div>
            ))}

            <Button variant="outline" onClick={handleAddItem} className="mt-2 bg-transparent">
              <Plus className="h-4 w-4 mr-2" />
              項目を追加
            </Button>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={isLoading}>
        {isLoading ? "保存中..." : "保存"}
      </Button>
    </div>
  )
}
