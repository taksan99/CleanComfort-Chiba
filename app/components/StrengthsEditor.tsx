"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

interface StrengthItem {
  icon: string
  title: string
  description: string
}

const initialStrengths: StrengthItem[] = [
  {
    icon: "⚡",
    title: "最短翌日対応",
    description: "お急ぎのご依頼にも迅速に対応いたします",
  },
  {
    icon: "🕐",
    title: "365日対応",
    description: "年中無休でお客様のご要望にお応えします",
  },
  {
    icon: "👨‍🔧",
    title: "経験豊富なプロのスタッフ",
    description: "確かな技術と豊富な経験を持つスタッフが対応",
  },
  {
    icon: "🌱",
    title: "エコフレンドリーな洗剤使用",
    description: "環境に優しい洗剤で安心・安全なクリーニング",
  },
  {
    icon: "🏠",
    title: "地域密着で安心",
    description: "千葉県を中心とした地域密着型のサービス",
  },
]

export default function StrengthsEditor() {
  const [strengths, setStrengths] = useState<StrengthItem[]>(initialStrengths)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/site-content?section=strengths")
        const data = await response.json()
        if (data && Array.isArray(data)) {
          setStrengths(data)
        }
      } catch (error) {
        console.error("Error fetching strengths:", error)
        // Fallback to localStorage
        const saved = localStorage.getItem("strengthsContent")
        if (saved) {
          setStrengths(JSON.parse(saved))
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
          section: "strengths",
          content: strengths,
        }),
      })

      if (response.ok) {
        localStorage.setItem("strengthsContent", JSON.stringify(strengths))
        toast({
          title: "保存完了",
          description: "私たちの強みの内容が保存されました。",
        })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      console.error("Error saving strengths:", error)
      toast({
        title: "エラー",
        description: "保存に失敗しました。",
        variant: "destructive",
      })
    }
  }

  const updateStrength = (index: number, field: keyof StrengthItem, value: string) => {
    const newStrengths = [...strengths]
    newStrengths[index] = { ...newStrengths[index], [field]: value }
    setStrengths(newStrengths)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">私たちの強み</h3>
        <Button onClick={handleSave}>保存</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {strengths.map((strength, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>強み {index + 1}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">アイコン</label>
                <Input
                  value={strength.icon}
                  onChange={(e) => updateStrength(index, "icon", e.target.value)}
                  placeholder="⚡"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">タイトル</label>
                <Input
                  value={strength.title}
                  onChange={(e) => updateStrength(index, "title", e.target.value)}
                  placeholder="タイトルを入力"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">説明</label>
                <Textarea
                  value={strength.description}
                  onChange={(e) => updateStrength(index, "description", e.target.value)}
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
