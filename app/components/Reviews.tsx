"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"
import AnimatedSection from "./AnimatedSection"
import { useImageUrls } from "@/app/hooks/useImageUrls"
import ImageWithFallback from "./ImageWithFallback"
import ErrorMessage from "./ErrorMessage"

interface Review {
  name: string
  age: number
  occupation: string
  comment: string
  rating: number
}

const initialReviews: Review[] = [
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
  const [reviews, setReviews] = useState(initialReviews)
  const imageSections = useMemo(
    () => [
      "reviewsBackgroundImage",
      ...Array(6)
        .fill(0)
        .map((_, i) => `review${i}`),
    ],
    [],
  )
  const { imageUrls, isLoading, error } = useImageUrls()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/site-content?section=reviews")
        const data = await response.json()
        if (data && Array.isArray(data)) {
          setReviews(data)
        }
      } catch (error) {
        console.error("Error fetching reviews:", error)
        // Fallback to localStorage
        const savedReviews = localStorage.getItem("reviewsContent")
        if (savedReviews) {
          setReviews(JSON.parse(savedReviews))
        }
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <ErrorMessage message={error.message} />
  }

  // Safely access the reviewsImage URL or use a fallback
  const backgroundImage = imageUrls?.reviewsBackgroundImage?.url || "/placeholder.svg"

  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat py-16"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 bg-white bg-opacity-75 p-4 rounded-lg shadow-lg">
          お客様の声
        </h2>
        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, index) => {
              // Safely access the review image URL or use a fallback
              const reviewImageUrl = imageUrls?.[`review${index}`]?.url || "/placeholder.svg"
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300 bg-white bg-opacity-90">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <ImageWithFallback
                        src={reviewImageUrl || "/placeholder.svg"}
                        fallbackSrc="/placeholder.svg"
                        alt={review.name}
                        width={64}
                        height={64}
                        className="rounded-full border-2 border-white shadow-md"
                      />
                      <div>
                        <CardTitle style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)" }}>{review.name}</CardTitle>
                        <p className="text-sm text-gray-600" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)" }}>
                          {review.age}歳 {review.occupation}
                        </p>
                      </div>
                    </div>
                    <div className="flex mt-2">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 italic" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)" }}>
                      "{review.comment}"
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
