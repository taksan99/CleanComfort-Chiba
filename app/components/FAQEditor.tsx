"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
    question: "サービスの対象エリアと出張費はどうなっていますか？",
    answer:
      "千葉県木更津市を中心に対応しております。出張費は移動距離に応じて異なります。木更津市、君津市、富津市、袖ケ浦市等、近傍は+1,000円、市原市、茂原市、大網白里市、東金市は+2,000円となります。車での移動に1時間以上を要する地域では、通常+2,000円の出張費をいただいております。詳細はお問い合わせください。",
  },
  {
    question: "キャンセルポリシーはどうなっていますか？",
    answer:
      "予約日の3日前までのキャンセルは無料です。2日前から当日のキャンセルは、サービス料金の50%を頂戴しております。",
  },
  {
    question: "サブスクリプションプランの解約はいつでも可能ですか？",
    answer: "はい、いつでも解約可能です。ただし、解約の申し出から次回のサービス提供日までに7日以上の期間が必要です。",
  },
  {
    question: "清掃中に家具や備品を破損した場合はどうなりますか？",
    answer:
      "当社は損害賠償保険に加入しております。万が一、当社の過失により破損が発生した場合は、適切に対応させていただきます。",
  },
  {
    question: "清掃スタッフの身元は保証されていますか？",
    answer:
      "はい、全スタッフの身元確認を行っており、研修も徹底しています。また、貴重品等は事前にお客様ご自身で管理をお願いしております。",
  },
  {
    question: "金体系はどうなっていますか？",
    answer:
      "各サービスには基本料金が設定されています。例えば、水回り5点セットは68,000円～、通常エアコンクリーニングは12,000円～となっています。ただし、作業の難易度や追加オプションによって料金が変動する場合があります。詳細な料金はお気軽にお問い合わせください。",
  },
  {
    question: "現地での確認や調査は必要ですか？",
    answer:
      "はい。すべてのサービスにおいて、現地での確認・調査が必要です。正確な見積もりと適切なサービス提供が可能となります。",
  },
  {
    question: "エアコンクリーニングの保証について教えてください。",
    answer:
      "10年以上前のエアコンについては、すでにメーカーの製造が終了しており、パーツが入手できない場合があるため、保証外となる可能性があります。ご了承ください。",
  },
  {
    question: "高所作業の場合、追加料金はかかりますか？",
    answer:
      "はい。3m以上の高所作業の場合、+2,000円の追加料金がかかります。高所作業の例としては、浴室、窓ガラスクリーニング、シャンデリアなどが挙げられます。",
  },
  {
    question: "サブスクリプションサービスはいつから利用できますか？",
    answer:
      "サブスクリプションサービスは、エアコンクリーニング、ハウスクリーニング、便利屋サービスのいずれかを最低一度ご利用いただいた後にご利用いただけます。初回からのご利用はお問い合わせください（初回利用の場合、現地調査を必須とさせていただきます）。",
  },
  {
    question: "浴室クリーニングの当日対応は可能ですか？",
    answer:
      "当日対応は可能ですが、作業員が不足している場合、サービスの全作業を当日中に完了できない可能性があります。その際は、翌日以降に作業を継続することがございますので、ご了承ください。",
  },
]

export default function FAQEditor() {
  const [faqs, setFaqs] = useState<FAQItem[]>(initialFAQs)

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch("/api/content?section=faq")
        const data = await response.json()
        if (data && Array.isArray(data)) {
          setFaqs(data)
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error)
        const savedFAQs = localStorage.getItem("faqContent")
        if (savedFAQs) {
          setFaqs(JSON.parse(savedFAQs))
        }
      }
    }

    fetchFAQs()
  }, [])

  const handleChange = (index: number, field: keyof FAQItem, value: string) => {
    const newFAQs = [...faqs]
    newFAQs[index] = { ...newFAQs[index], [field]: value }
    setFaqs(newFAQs)
  }

  const handleAddFAQ = () => {
    setFaqs([...faqs, { question: "", answer: "" }])
  }

  const handleDeleteFAQ = (index: number) => {
    const newFAQs = [...faqs]
    newFAQs.splice(index, 1)
    setFaqs(newFAQs)
  }

  const handleSave = async () => {
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
        localStorage.setItem("faqContent", JSON.stringify(faqs))
        alert("よくある質問の内容が保存されました。")
      } else {
        throw new Error("Failed to save to database")
      }
    } catch (error) {
      console.error("Error saving FAQs:", error)
      localStorage.setItem("faqContent", JSON.stringify(faqs))
      alert("よくある質問の内容が保存されました（ローカルのみ）。")
    }
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="faq0">
        <TabsList>
          {faqs.map((_, index) => (
            <TabsTrigger key={index} value={`faq${index}`}>
              質問 {index + 1}
            </TabsTrigger>
          ))}
        </TabsList>
        {faqs.map((faq, index) => (
          <TabsContent key={index} value={`faq${index}`}>
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>質問 {index + 1}</span>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteFAQ(index)}>
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
          </TabsContent>
        ))}
      </Tabs>
      <Button onClick={handleAddFAQ} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        新しい質問を追加
      </Button>
      <Button onClick={handleSave}>保存</Button>
    </div>
  )
}
