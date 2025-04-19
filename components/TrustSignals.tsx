import type React from "react"
import Image from "next/image"

const TrustSignals: React.FC = () => {
  const trustSignals = [
    { name: "千葉県公認クリーニング事業者", image: "/placeholder.svg?height=100&width=100" },
    { name: "エアコンクリーニング協会会員", image: "/placeholder.svg?height=100&width=100" },
    { name: "環境に優しい洗剤使用認定", image: "/placeholder.svg?height=100&width=100" },
    { name: "顧客満足度No.1 (2022年度)", image: "/placeholder.svg?height=100&width=100" },
  ]

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8">信頼の証</h2>
        <div className="flex flex-wrap justify-center items-center gap-8">
          {trustSignals.map((signal, index) => (
            <div key={index} className="text-center">
              <Image
                src={signal.image || "/placeholder.svg"}
                alt={signal.name}
                width={100}
                height={100}
                className="mb-2"
              />
              <p className="text-sm">{signal.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustSignals
