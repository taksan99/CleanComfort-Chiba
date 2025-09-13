"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp } from "lucide-react"
import AnimatedSection from "./AnimatedSection"
import { useImageUrls } from "@/app/hooks/useImageUrls"
import ErrorMessage from "./ErrorMessage"

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
]

export default function FAQ() {
  const [faqs, setFaqs] = useState<FAQItem[]>(initialFAQs)
  const [openItems, setOpenItems] = useState<number[]>([])
  const { imageUrls, isLoading, error } = useImageUrls()

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
        const savedFAQs = localStorage.getItem("faqContent")
        if (savedFAQs) {
          setFaqs(JSON.parse(savedFAQs))
        }
      }
    }

    fetchData()
  }, [])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <ErrorMessage message={error.message} />
  }

  const backgroundImage = imageUrls.faqBackgroundImage?.url || "/placeholder.svg"

  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat py-16"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 bg-white bg-opacity-75 p-4 rounded-lg shadow-lg">
          よくある質問
        </h2>
        <AnimatedSection>
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="bg-white bg-opacity-90">
                <Collapsible>
                  <CollapsibleTrigger className="w-full" onClick={() => toggleItem(index)}>
                    <CardHeader className="hover:bg-gray-50 transition-colors">
                      <CardTitle className="flex justify-between items-center text-left">
                        <span style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)" }}>{faq.question}</span>
                        {openItems.includes(index) ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent>
                      <p
                        className="text-gray-700"
                        style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)", whiteSpace: "pre-wrap" }}
                      >
                        {faq.answer}
                      </p>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
