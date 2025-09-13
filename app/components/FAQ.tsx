"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import AnimatedSection from "./AnimatedSection"
import { useImageUrls } from "@/app/hooks/useImageUrls"
import ErrorMessage from "./ErrorMessage"

interface FAQItem {
  id: string
  question: string
  answer: string
}

const defaultFAQs: FAQItem[] = [
  {
    id: "1",
    question: "サービスの対象エリアはどこまでですか？",
    answer:
      "千葉県全域で対応しております。ただし、一部地域では追加料金が発生する場合がございます。詳細はお問い合わせください。",
  },
  {
    id: "2",
    question: "サービスの対象エリアと出張費はどうなっていますか？",
    answer:
      "千葉県木更津市を中心に対応しております。出張費は移動距離に応じて異なります。木更津市、君津市、富津市、袖ケ浦市等、近傍は+1,000円、市原市、茂原市、大網白里市、東金市は+2,000円となります。車での移動に1時間以上を要する地域では、通常+2,000円の出張費をいただいております。詳細はお問い合わせください。",
  },
  {
    id: "3",
    question: "キャンセルポリシーはどうなっていますか？",
    answer:
      "予約日の3日前までのキャンセルは無料です。2日前から当日のキャンセルは、サービス料金の50%を頂戴しております。",
  },
  {
    id: "4",
    question: "サブスクリプションプランの解約はいつでも可能ですか？",
    answer: "はい。いつでも解約可能です。ただし、解約の申し出から次回のサービス提供日までに7日以上の期間が必要です。",
  },
  {
    id: "5",
    question: "清掃中に家具や備品を破損した場合はどうなりますか？",
    answer:
      "当社は損害賠償保険に加入しております。万が一、当社の過失により破損が発生した場合は、適切に対応させていただきます。",
  },
  {
    id: "6",
    question: "清掃スタッフの身元は保証されていますか？",
    answer:
      "はい。全スタッフの身元確認を行っており、研修も徹底しています。また、貴重品等は事前にお客様ご自身で管理をお願いしております。",
  },
  {
    id: "7",
    question: "料金体系はどうなっていますか？",
    answer:
      "各サービスには基本料金が設定されています。例えば、水回り5点セットは68,000円～、通常エアコンクリーニングは12,000円～となっています。ただし、作業の難易度や追加オプションによって料金が変動する場合があります。詳細な料金はお気軽にお問い合わせください。",
  },
  {
    id: "8",
    question: "現地での確認や調査は必要ですか？",
    answer:
      "はい。すべてのサービスにおいて、現地での確認・調査が必要です。これにより正確な見積もりと適切なサービス提供が可能となります。",
  },
  {
    id: "9",
    question: "エアコンクリーニングの保証について教えてください。",
    answer:
      "10年以上前のエアコンについては、すでにメーカーの製造が終了しており、パーツが入手できない場合があるため、保証外となる可能性があります。ご了承ください。",
  },
  {
    id: "10",
    question: "高所作業の場合、追加料金はかかりますか？",
    answer:
      "はい。3m以上の高所作業の場合、+2,000円の追加料金がかかります。高所作業の例としては、浴室、窓ガラスクリーニング、シャンデリアなどが挙げられます。",
  },
  {
    id: "11",
    question: "サブスクリプションサービスはいつから利用できますか？",
    answer:
      "サブスクリプションサービスは、エアコンクリーニング、ハウスクリーニング、便利屋サービスのいずれかを最低一度ご利用いただいた後にご利用いただけます。初回からのご利用はお問い合わせください（初回利用の場合、現地調査を必須とさせていただきます）。",
  },
  {
    id: "12",
    question: "浴室クリーニングの当日対応は可能ですか？",
    answer:
      "当日対応は可能ですが、作業員が不足している場合、サービスの全作業を当日中に完了できない可能性があります。その際は、翌日以降に作業を継続することがございますので、ご了承ください。",
  },
]

export default function FAQ() {
  const [faqs, setFaqs] = useState(defaultFAQs)
  const [activeId, setActiveId] = useState<string | null>(null)
  const { imageUrls, isLoading, error } = useImageUrls()

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch("/api/content?section=faq")
        if (response.ok) {
          const data = await response.json()
          if (data.content) {
            setFaqs(data.content)
          }
        }
      } catch (error) {
        console.error("Error fetching FAQ content:", error)
        // フォールバック: localStorageから取得
        const savedFAQs = localStorage.getItem("faqContent")
        if (savedFAQs) {
          setFaqs(JSON.parse(savedFAQs))
        }
      }
    }
    fetchContent()
  }, [])

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
            {faqs.map((faq) => (
              <FAQItem key={faq.id} faq={faq} isActive={activeId === faq.id} toggleFAQ={toggleFAQ} />
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

const FAQItem = ({
  faq,
  isActive,
  toggleFAQ,
}: {
  faq: FAQItem
  isActive: boolean
  toggleFAQ: (id: string) => void
}) => {
  return (
    <div className="mb-4 bg-white rounded-lg shadow-md overflow-hidden">
      <button
        className="w-full px-4 py-2 text-left font-semibold focus:outline-none hover:bg-gray-50 transition-colors duration-200"
        onClick={() => toggleFAQ(faq.id)}
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
