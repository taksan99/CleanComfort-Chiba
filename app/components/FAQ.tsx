"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import AnimatedSection from "./AnimatedSection"
import { useImageUrls } from "@/app/hooks/useImageUrls"
import ErrorMessage from "./ErrorMessage"

interface FAQItem {
  question: string
  answer: string
}

const defaultFAQs: FAQItem[] = [
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
]

export default function FAQ() {
  const [faqs, setFaqs] = useState<FAQItem[]>(defaultFAQs)
  const [activeId, setActiveId] = useState<string | null>(null)
  const { imageUrls, isLoading, error } = useImageUrls()

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/content?section=faq")
      const content = await response.json()
      if (content && Array.isArray(content)) {
        setFaqs(content)
      }
    } catch (error) {
      console.error("Error fetching FAQ:", error)
    }
  }

  const toggleFAQ = useCallback((id: string) => {
    setActiveId((prevId) => (prevId === id ? null : id))
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <ErrorMessage message="FAQ画像の読み込みに失敗しました" />
  }

  const backgroundImage = imageUrls.faqBackgroundImage?.url || "/placeholder.svg"

  return (
    <section
      id="faq"
      className="relative bg-cover bg-center bg-no-repeat py-16"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-white opacity-10"></div>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 bg-white bg-opacity-75 p-4 rounded-lg shadow-lg">
          よくある質問
        </h2>
        <AnimatedSection>
          <div className="w-full max-w-2xl mx-auto">
            {faqs.map((faq, index) => (
              <FAQItemComponent
                key={index}
                faq={faq}
                index={index}
                isActive={activeId === index.toString()}
                toggleFAQ={toggleFAQ}
              />
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

const FAQItemComponent = ({
  faq,
  index,
  isActive,
  toggleFAQ,
}: {
  faq: FAQItem
  index: number
  isActive: boolean
  toggleFAQ: (id: string) => void
}) => {
  return (
    <div className="mb-4 bg-white rounded-lg shadow-md overflow-hidden">
      <button
        className="w-full px-4 py-2 text-left font-semibold focus:outline-none hover:bg-gray-50 transition-colors duration-200"
        onClick={() => toggleFAQ(index.toString())}
      >
        {faq.question}
      </button>
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-4 py-2 bg-gray-50">{faq.answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
