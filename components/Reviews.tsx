import type React from "react"
import Image from "next/image"

const Reviews: React.FC = () => {
  const reviews = [
    {
      name: "田中さん",
      comment: "迅速な対応と丁寧な作業に大満足です。エアコンがこんなにきれいになるなんて！",
      image: "/placeholder.svg?height=100&width=100",
    },
    { name: "佐藤さん", comment: "年末の大掃除をお願いしましたが、新築のような輝きを取り戻せ" },
    {
      name: "佐藤さん",
      comment: "年末の大掃除をお願いしましたが、新築のような輝きを取り戻せました。家族みんなで感動しています。",
    },
    {
      name: "鈴木さん",
      comment:
        "カーペットのシミが気になっていましたが、プロの技術で見事に除去していただきました。ありがとうございます！",
    },
  ]

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8">お客様の声</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <Image
                  src={review.image || "/placeholder.svg"}
                  alt={review.name}
                  width={50}
                  height={50}
                  className="rounded-full mr-4"
                />
                <h3 className="text-xl font-semibold">{eview.name}</h3>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Reviews
