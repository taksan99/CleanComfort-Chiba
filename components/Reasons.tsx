import type React from "react"
import { ThumbsUp, Clock, Shield, Smile } from "lucide-react"

const Reasons: React.FC = () => {
  const reasons = [
    {
      icon: ThumbsUp,
      title: "高品質なサービス",
      description: "プロの技術と最新の機材で、徹底的にクリーニングします。",
    },
    { icon: Clock, title: "迅速な対応", description: "24時間以内の対応で、急なご要望にも柔軟に対応いたします。" },
    { icon: Shield, title: "安心の保証", description: "万が一の場合も、全額返金保証で安心してご利用いただけます。" },
    { icon: Smile, title: "お客様満足度No.1", description: "千葉県内で顧客満足度No.1を獲得しました。" },
  ]

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8">選ばれる理由</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => (
            <div key={index} className="text-center">
              <reason.icon className="mx-auto text-primary mb-4" size={48} />
              <h3 className="text-xl font-semibold mb-2">{reason.title}</h3>
              <p className="text-gray-600">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Reasons
