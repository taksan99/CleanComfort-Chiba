"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Trash2 } from "lucide-react"

interface FAQItem {
  question: string
  answer: string
}

const initialFAQs: FAQItem[] = [
  {
    question: "サービスの対象エリアはどこまでですか？",
    answer:
      "千葉県全域で対応しております。ただし、一部地域では追加料金が発生する場合がございます。詳細はお問い合わせください。",
  },
  {
    question: "キャンセルポリシーはどうなっていますか？",
    answer:
      "予約日の3日前までのキャンセルは無料です。2日前から当日のキャンセルは、サービス料金の50%を頂戴しております。",
  },
]

export default function FAQEditor() {
  const [faqs, setFaqs] = useState<FAQItem[]>(initialFAQs)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/site-content?section=faq")
        const data = await response.json()
        if (data && Array.isArray(data)) {
          setFaqs(data)
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error)
        // Fallback to localStorage
        const saved = localStorage.getItem("faqContent")
        if (saved) {
          setFaqs(JSON.parse(saved))
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
          section: "faq",
          content: faqs,
        }),
      })

      if (response.ok) {
        localStorage.setItem("faqContent", JSON.stringify(faqs))
        toast({
          title: "保存完了",
          description: "FAQの内容が保存されました。",
        })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      console.error("Error saving FAQs:", error)
      toast({
        title: "エラー",
        description: "保存に失敗しました。",
        variant: "destructive",
      })
    }
  }

  const updateFAQ = (index: number, field: keyof FAQItem, value: string) => {
    const newFAQs = [...faqs]
    newFAQs[index] = { ...newFAQs[index], [field]: value }
    setFaqs(newFAQs)
  }

  const addFAQ = () => {
    setFaqs([...faqs, { question: "", answer: "" }])
  }

  const removeFAQ = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">FAQ管理</h3>
        <div className="space-x-2">
          <Button onClick={addFAQ} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            FAQ追加
          </Button>
          <Button onClick={handleSave}>保存</Button>
        </div>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>FAQ {index + 1}</CardTitle>
                <Button onClick={() => removeFAQ(index)} variant="outline" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">質問</label>
                <Input
                  value={faq.question}
                  onChange={(e) => updateFAQ(index, "question", e.target.value)}
                  placeholder="質問を入力"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">回答</label>
                <Textarea
                  value={faq.answer}
                  onChange={(e) => updateFAQ(index, "answer", e.target.value)}
                  placeholder="回答を入力"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
