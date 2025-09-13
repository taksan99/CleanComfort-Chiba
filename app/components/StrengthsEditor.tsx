"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

interface Strength {
  title: string
  description: string
  details: string
}

const initialStrengths: Strength[] = [
  {
    title: "地域密着型サービス",
    description: "千葉県内での豊富な実績と地域に根ざしたサービス",
    details: "千葉県内で10年以上の実績を持ち、地域の特性を熟知したスタッフが対応します。",
  },
  {
    title: "プロフェッショナルな技術",
    description: "専門的な技術と最新の機材で確実な清掃を実現",
    details: "業界最新の清掃技術と機材を使用し、プロの技術で徹底的に清掃いたします。",
  },
  {
    title: "安心の保険加入",
    description: "万が一の事故に備えた損害保険に加入済み",
    details: "作業中の万が一の事故に備え、損害保険に加入しているので安心してご利用いただけます。",
  },
  {
    title: "柔軟な対応力",
    description: "お客様のご要望に合わせた柔軟なサービス提供",
    details: "お客様一人ひとりのニーズに合わせて、柔軟にサービス内容をカスタマイズいたします。",
  },
]

export default function StrengthsEditor() {
  const [strengths, setStrengths] = useState<Strength[]>(initialStrengths)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchStrengths()
  }, [])

  const fetchStrengths = async () => {
    try {
      const response = await fetch("/api/content?section=strengths")
      const data = await response.json()
      if (data && Array.isArray(data)) {
        setStrengths(data)
      }
    } catch (error) {
      console.error("Error fetching strengths:", error)
    }
  }

  const handleChange = (index: number, field: keyof Strength, value: string) => {
    const newStrengths = [...strengths]
    newStrengths[index] = { ...newStrengths[index], [field]: value }
    setStrengths(newStrengths)
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
          section: "strengths",
          content: strengths,
        }),
      })

      if (response.ok) {
        toast({
          title: "保存完了",
          description: "私たちの強みの内容が正常に保存されました。",
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
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="strength0">
        <TabsList>
          {strengths.map((_, index) => (
            <TabsTrigger key={index} value={`strength${index}`}>
              強み {index + 1}
            </TabsTrigger>
          ))}
        </TabsList>
        {strengths.map((strength, index) => (
          <TabsContent key={index} value={`strength${index}`}>
            <Card>
              <CardHeader>
                <CardTitle>強み {index + 1}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block mb-2">タイトル</label>
                  <Input
                    value={strength.title}
                    onChange={(e) => handleChange(index, "title", e.target.value)}
                    placeholder="タイトル"
                  />
                </div>
                <div>
                  <label className="block mb-2">説明</label>
                  <Textarea
                    value={strength.description}
                    onChange={(e) => handleChange(index, "description", e.target.value)}
                    placeholder="説明"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block mb-2">詳細</label>
                  <Textarea
                    value={strength.details}
                    onChange={(e) => handleChange(index, "details", e.target.value)}
                    placeholder="詳細"
                    rows={4}
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
