"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import AnimatedSection from "@/app/components/AnimatedSection"
import { useImageUrls } from "@/app/hooks/useImageUrls"
import { Star } from "lucide-react"

interface Review {
  name: string
  age: number
  occupation: string
  comment: string
  rating: number
}

const defaultReviews: Review[] = [
  {
    name: "佐藤 美咲",
    age: 25,
    occupation: "会社員",
    comment:
      "エアコンがピカピカになって、空気がすごく綺麗になりました！　アレルギーも軽減して、快適に過ごせています。気さくな人でよかった。毎年お願いしたいです！",
    rating: 5,
  },
  {
    name: "田中 健太",
    age: 42,
    occupation: "自営業",
    comment:
      "水回りの掃除をお願いしました。見違えるほどキレイになって大満足です。特にキッチンの油汚れが落ちたのがよかった。老齢の両親のちょっとした世話までしてくれて、嬉しかったです。",
    rating: 5,
  },
  {
    name: "鈴木 優子",
    age: 29,
    occupation: "主婦",
    comment:
      "急な来客の前日に依頼したのに、迅速な対応をしていただき本当に助かりました。仕上がりも素晴らしく、友人にも褒められました。",
    rating: 5,
  },
  {
    name: "佐伯 真一",
    age: 56,
    occupation: "会社役員",
    comment:
      "両親の墓参り代行をお願いしました。丁寧に清掃しお花も供えていただき、素晴らしかったです。遠方に住んでいる身としては心強いサービスですね。",
    rating: 5,
  },
  {
    name: "中村 瑠璃子",
    age: 33,
    occupation: "フリーランス",
    comment:
      "突然のネズミ発生で困っていましたが、すぐに対応してくださいました。駆除だけでなく、予防対策まで丁寧に説明していただき、安心して生活できるようになりました。",
    rating: 5,
  },
  {
    name: "小林 浩一郎",
    age: 31,
    occupation: "会社員",
    comment:
      "思い切って友達代行、カラオケに同伴してもらいました。とても楽しくストレス発散できました！　普段一人で行くのは気が引けていたので、良い経験になりました！",
    rating: 5,
  },
]

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>(defaultReviews)
  const [isLoading, setIsLoading] = useState(true)
  const { imageUrls } = useImageUrls()

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/content?section=reviews")
      const data = await response.json()

      if (data && Array.isArray(data) && data.length > 0) {
        setReviews(data)
      } else {
        setReviews(defaultReviews)
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
      setReviews(defaultReviews)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading...</div>
        </div>
      </section>
    )
  }

  const backgroundImage = imageUrls.reviewsBackgroundImage?.url || "/placeholder.svg"

  return (
    <section
      className="relative py-16 bg-gray-50"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-white bg-opacity-90"></div>
      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">お客様の声</h2>
            <p className="text-xl text-gray-600">実際にご利用いただいたお客様からの嬉しいお声をご紹介します</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={imageUrls[`review${index || "/placeholder.svg"}`]?.url || "/placeholder.svg"}
                      alt={review.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{review.name}</h3>
                      <p className="text-gray-600">
                        {review.age}歳 / {review.occupation}
                      </p>
                    </div>
                  </div>

                  <div className="flex mb-4">
                    {[...Array(review.rating)].map((_, starIndex) => (
                      <Star key={starIndex} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  <p className="text-gray-700 leading-relaxed italic">"{review.comment}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
