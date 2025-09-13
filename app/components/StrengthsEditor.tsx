"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Strength {
  title: string
  description: string
}

const initialStrengths: Strength[] = [
  {
    title: "翌日対応、365日対応",
    description: "お急ぎの方も安心。年中無休でサービスを提供しています。",
  },
  {
    title: "経験豊富なプロのスタッフ",
    description: "熟練のスタッフが丁寧に作業いたします。",
  },
  {
    title: "エコフレンドリーな洗剤使用",
    description: "環境と健康に配慮した安全な洗剤を使用しています。",
  },
  {
    title: "地域密着で安心",
    description: "千葉県の地域事情を熟知したスタッフが対応します。",
  },
]

export default function StrengthsEditor() {
  const [strengths, setStrengths] = useState<Strength[]>(initialStrengths)

  useEffect(() => {
    const fetchStrengths = async () => {
      try {
        const response = await fetch("/api/content?section=strengths")
        const data = await response.json()
        if (data && Array.isArray(data)) {
          setStrengths(data)
        }
      } catch (error) {
        console.error("Error fetching strengths:", error)
        const savedStrengths = localStorage.getItem("strengthsContent")
        if (savedStrengths) {
          setStrengths(JSON.parse(savedStrengths))
        }
      }
    }

    fetchStrengths()
  }, [])

  const handleChange = (index: number, field: keyof Strength, value: string) => {
    const newStrengths = [...strengths]
    newStrengths[index] = { ...newStrengths[index], [field]: value }
    setStrengths(newStrengths)
  }

  const handleSave = async () => {
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
        localStorage.setItem("strengthsContent", JSON.stringify(strengths))
        alert("私たちの強みの内容が保存されました。")
      } else {
        throw new Error("Failed to save to database")
      }
    } catch (error) {
      console.error("Error saving strengths:", error)
      localStorage.setItem("strengthsContent", JSON.stringify(strengths))
      alert("私たちの強みの内容が保存されました（ローカルのみ）。")
    }
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="strength0">
        <TabsList>
          {strengths.map((_, index) => (
            <TabsTrigger key={index} value={`strength${index}`}>
              {strengths[index].title}
            </TabsTrigger>
          ))}
        </TabsList>
        {strengths.map((strength, index) => (
          <TabsContent key={index} value={`strength${index}`}>
            <Card>
              <CardHeader>
                <CardTitle>{strengths[index].title}</CardTitle>
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
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      <Button onClick={handleSave}>保存</Button>
    </div>
  )
}
