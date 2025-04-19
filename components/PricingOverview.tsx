import type React from "react"

const PricingOverview: React.FC = () => {
  const prices = [
    { service: "エアコンクリーニング（家庭用）", price: "¥8,000〜" },
    { service: "ハウスクリーニング（1LDK）", price: "¥30,000〜" },
    { service: "カーペットクリーニング（6畳）", price: "¥12,000〜" },
    { service: "水回りセット（キッチン・浴室・トイレ）", price: "¥25,000〜" },
  ]

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8">料金概要</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-primary text-white">
                <th className="py-2 px-4 text-left">サービス</th>
                <th className="py-2 px-4 text-right">料金（税抜）</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="py-2 px-4">{item.service}</td>
                  <td className="py-2 px-4 text-right">{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-center text-gray-600">※料金は目安です。詳細は現地調査後にお見積りいたします。</p>
      </div>
    </section>
  )
}

export default PricingOverview
