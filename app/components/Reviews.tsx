"use client"

import { useState, useEffect } from "react"

interface Review {
  name: string
  location: string
  service: string
  rating: number
  comment: string
}

const initialReviews: Review[] = [
  {
    name: "田中様",
    location: "木更津市",
    service: "エアコンクリーニング",
    rating: 5,
    comment: "エアコンがとても綺麗になり、風も清潔になりました。作業も丁寧で満足です。",
  },
  {
    name: "佐藤様",
    location: "君津市",
    service: "ハウスクリーニング",
    rating: 5,
    comment: "忙しくて掃除ができずにいましたが、プロの技術で家全体がピカピカになりました。",
  },
  {
    name: "山田様",
    location: "富津市",
    service: "水回りクリーニング",
    rating: 5,
    comment: "キッチンとお風呂の頑固な汚れが完全に取れて驚きました。また利用したいです。",
  },
  {
    name: "鈴木様",
    location: "袖ケ浦市",
    service: "便利屋サービス",
    rating: 5,
    comment: "家具の移動から電球交換まで、何でも対応してくれて助かりました。",
  },
]

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)

  useEffect(() => {
    const savedReviews = localStorage.getItem("reviewsContent")
    if (savedReviews) {
      try {
        const parsedReviews = JSON.parse(savedReviews)
        setReviews(parsedReviews)
      } catch (error) {
        console.error("Error parsing saved reviews:", error)
      }
    }
  }, [])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${index < rating ? "text-yellow-400" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">お客様の声</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            実際にご利用いただいたお客様からの嬉しいお声をご紹介します。
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reviews.map((review, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="flex">{renderStars(review.rating)}</div>
              </div>
              <p className="text-gray-600 mb-4 italic">"{review.comment}"</p>
              <div className="border-t pt-4">
                <p className="font-semibold text-gray-800">{review.name}</p>
                <p className="text-sm text-gray-600">{review.location}</p>
                <p className="text-sm text-blue-600">{review.service}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
