"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface FAQ {
  question: string
  answer: string
}

const initialFAQs: FAQ[] = [
  {
    question: "サービスエリアはどこまでですか？",
    answer:
      "千葉県内全域でサービスを提供しております。一部地域では出張費をいただく場合がございます。詳しくはお問い合わせください。",
  },
  {
    question: "見積もりは無料ですか？",
    answer: "はい、お見積もりは無料です。現地調査が必要な場合も、基本的に無料で対応いたします。",
  },
  {
    question: "作業時間はどのくらいかかりますか？",
    answer:
      "サービス内容やお部屋の状況により異なりますが、一般的なハウスクリーニングで2-4時間、エアコンクリーニングで1-2時間程度です。",
  },
  {
    question: "支払い方法は何がありますか？",
    answer: "現金、クレジットカード、銀行振込に対応しております。作業完了後のお支払いとなります。",
  },
  {
    question: "キャンセルはできますか？",
    answer:
      "作業日の前日までにご連絡いただければ、キャンセル料は発生いたしません。当日キャンセルの場合は、キャンセル料をいただく場合がございます。",
  },
]

export default function FAQEditor() {
  const [faqs, setFaqs] = useState<FAQ[]>(initialFAQs)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchFAQs()
  }, [])

  const fetchFAQs = async () => {
    try {
      const response = await fetch("/api/content?section=faq")
      const data = await response.json()
      if (data && Array.isArray(data)) {
        setFaqs(data)
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error)
    }
  }

  const handleChange = (index: number, field: keyof FAQ, value: string) => {
    const newFaqs = [...faqs]
    newFaqs[index] = { ...newFaqs[index], [field]: value }
    setFaqs(newFaqs)
  }

  const handleAdd = () => {
    setFaqs([...faqs, { question: "", answer: "" }])
  }

  const handleRemove = (index: number) => {
    const newFaqs = faqs.filter((_, i) => i !== index)
    setFaqs(newFaqs)
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
          section: "faq",
          content: faqs,
        }),
      })

      if (response.ok) {
        toast({
          title: "保存完了",
          description: "FAQ情報が正常に保存されました。",
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
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              FAQ {index + 1}
              <Button variant="destructive" size="sm" onClick={() => handleRemove(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block mb-2">質問</label>
              <Input
                value={faq.question}
                onChange={(e) => handleChange(index, "question", e.target.value)}
                placeholder="質問を入力してください"
              />
            </div>
            <div>
              <label className="block mb-2">回答</label>
              <Textarea
                value={faq.answer}
                onChange={(e) => handleChange(index, "answer", e.target.value)}
                placeholder="回答を入力してください"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex gap-2">
        <Button variant="outline" onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          FAQ を追加
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "保存中..." : "保存"}
        </Button>
      </div>
    </div>
  )
}
