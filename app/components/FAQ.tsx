"use client"

import { useState, useEffect } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

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
    question: "料金体系はどうなっていますか？",
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

export default function FAQ() {
  const [faqs, setFaqs] = useState<FAQItem[]>(initialFAQs)

  useEffect(() => {
    const savedFAQs = localStorage.getItem("faqContent")
    if (savedFAQs) {
      try {
        const parsedFAQs = JSON.parse(savedFAQs)
        setFaqs(parsedFAQs)
      } catch (error) {
        console.error("Error parsing saved FAQs:", error)
      }
    }
  }, [])

  return (
    <section id="faq" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">よくある質問</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">お客様からよくいただくご質問にお答えします。</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg shadow-sm">
                <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                  <span className="font-semibold text-gray-800">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
