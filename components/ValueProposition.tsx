import type React from "react"

const ValueProposition: React.FC = () => {
  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8">なぜクリーンコンフォート千葉を選ぶのか</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">プロの技術</h3>
            <p>経験豊富なスタッフが、最新の技術と機材を使用して、徹底的にクリーニングします。</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">迅速な対応</h3>
            <p>24時間以内の対応を保証。急なご要望にも柔軟に対応いたします。</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">安心の料金</h3>
            <p>明確な料金体系で、追加料金の心配なし。お客様の予算に合わせたプランをご用意しています。</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ValueProposition
