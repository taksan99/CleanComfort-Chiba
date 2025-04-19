import type React from "react"

const UrgencyOffer: React.FC = () => {
  return (
    <section className="py-12 bg-primary text-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">今すぐ予約で10%オフ！</h2>
        <p className="text-xl mb-6">このオファーは限定50名様まで。お早めにご予約ください。</p>
        <button className="bg-accent hover:bg-accent-dark text-primary font-bold py-2 px-6 rounded-full text-lg">
          今すぐ予約する
        </button>
      </div>
    </section>
  )
}

export default UrgencyOffer
