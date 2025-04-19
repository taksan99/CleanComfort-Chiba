import type React from "react"

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "サービスの料金はどのように決まりますか？",
      answer: "料金は、クリーニングする面積や作業内容によって異なります。現地調査後に詳細なお見積りを提供いたします。",
    },
    {
      question: "予約からサービス提供までどのくらいかかりますか？",
      answer:
        "通常、24時間以内にサービスを提供できるよう努めています。ただし、繁忙期には多少お待たせする場合もございます。",
    },
    {
      question: "使用する洗剤は安全ですか？",
      answer:
        "はい、環境にやさしく、人体に無害な洗剤を使用しています。アレルギーをお持ちの方にも安心してご利用いただけます。",
    },
    {
      question: "キャンセルポリシーはどうなっていますか？",
      answer: "24時間前までのキャンセルは無料です。それ以降のキャンセルには、キャンセル料が発生する場合があります。",
    },
  ]

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8">よくある質問</h2>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ
