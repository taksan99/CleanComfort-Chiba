import type React from "react"

const Promotions: React.FC = () => {
  return (
    <section className="py-12 bg-accent">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8 text-primary">今だけの特別オファー</h2>
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h3 className="text-2xl font-semibold mb-4">新規のお客様限定！</h3>
          <p className="text-xl mb-4">
            全てのサービス料金から<span className="text-primary font-bold">20% OFF</span>
          </p>
          <p className="mb-6">
            さらに、お友達紹介で<span className="text-primary font-bold">5,000円分のクーポン</span>プレゼント！
          </p>
          <button className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded">
            今すぐ予約する
          </button>
        </div>
      </div>
    </section>
  )
}

export default Promotions
