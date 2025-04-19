import type React from "react"

const Subscription: React.FC = () => {
  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8">お得な情報をお届けします</h2>
        <div className="max-w-md mx-auto">
          <p className="text-center mb-4">
            最新のキャンペーン情報やお掃除のコツなど、役立つ情報をメールでお届けします。
          </p>
          <form className="flex flex-col md:flex-row gap-4">
            <input
              type="email"
              placeholder="メールアドレスを入力"
              className="flex-grow px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-md"
            >
              登録する
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Subscription
