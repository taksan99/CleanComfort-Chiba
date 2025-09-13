import type React from "react"
import { CheckCircle } from "lucide-react"

const Strengths: React.FC = () => {
  const strengths = [
    "プロの技術者による高品質なサービス",
    "24時間以内の迅速な対応",
    "環境にやさしい洗剤の使用",
    "丁寧な作業と細部へのこだわり",
    "充実したアフターサポート",
    "地域密着型のサービス提供",
  ]

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8">クリーンコンフォート千葉の強み</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {strengths.map((strength, index) => (
            <div key={index} className="flex items-center">
              <CheckCircle className="text-primary mr-2" />
              <p>{strength}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Strengths
