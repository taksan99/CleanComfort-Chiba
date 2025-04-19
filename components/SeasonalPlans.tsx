import type React from "react"

const SeasonalPlans: React.FC = () => {
  const plans = [
    {
      name: "春の大掃除プラン",
      description: "新生活の始まりに！全館クリーニングで気持ちよく新年度をスタート",
      price: "20% OFF",
    },
    {
      name: "夏のエアコンケアプラン",
      description: "猛暑を快適に！エアコンクリーニングで電気代節約＆アレルギー対策",
      price: "15% OFF",
    },
    {
      name: "秋の結露対策プラン",
      description: "寒さ対策に！窓・壁のカビ予防クリーニングで健康的な冬を迎えよう",
      price: "10% OFF",
    },
    {
      name: "年末大掃除お任せプラン",
      description: "忙しい年末に！プロにお任せで新年を清々しく迎えましょう",
      price: "25% OFF",
    },
  ]

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8">季節のおすすめプラン</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <div key={index} className="bg-gray-100 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <p className="text-primary font-bold">{plan.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SeasonalPlans
