"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"
import AnimatedSection from "./AnimatedSection"
import { useImageUrls } from "@/app/hooks/useImageUrls"
import ImageWithFallback from "./ImageWithFallback"
import ErrorMessage from "./ErrorMessage"

interface Testimonial {
  name: string
  age: number
  occupation: string
  comment: string
  rating: number
}

const defaultTestimonials: Testimonial[] = [
  {
    name: "佐藤 美咲",
    age: 35,
    occupation: "会社員",
    comment:
      "エアコンがピカピカになって、空気がとても綺麗になりました。アレルギー症状も軽減され、快適に過ごせています。毎年お願いしたいです！",
    rating: 5,
  },
  {
    name: "田中 健太",
    age: 42,
    occupation: "自営業",
    comment:
      "水回りの掃除をお願いしましたが、見違えるほどキレイになって大満足です。特に、キッチンの油汚れが完全に落ちたのには驚きました。",
    rating: 5,
  },
  {
    name: "鈴木 優子",
    age: 28,
    occupation: "主婦",
    comment:
      "急な来客の前日に依頼しましたが、迅速に対応していただき助かりました。仕上がりも素晴らしく、友人にも褒められました。",
    rating: 5,
  },
  {
    name: "山田 太郎",
    age: 55,
    occupation: "会社役員",
    comment:
      "両親の墓参り代行をお願いしました。丁寧にお墓を清掃し、お花も供えていただき、本当に助かりました。遠方に住んでいる身としては、とても心強いサービスです。",
    rating: 5,
  },
  {
    name: "中村 花子",
    age: 32,
    occupation: "フリーランス",
    comment:
      "突然のゴキブリ発生で困っていましたが、すぐに対応してくださいました。害虫駆除だけでなく、予防対策まで丁寧に説明していただき、安心して生活できるようになりました。",
    rating: 5,
  },
  {
    name: "小林 健太",
    age: 45,
    occupation: "会社員",
    comment:
      "友達代行でカラオケに同伴してもらいました。楽しく歌を歌い、ストレス発散できました。普段一人で行くのは気が引けていたので、とても良い経験になりました。",
    rating: 5,
  },
]

export default function Reviews() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials)
  const { imageUrls, isLoading, error } = useImageUrls()

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch("/api/content?section=testimonials")
        if (response.ok) {
          const data = await response.json()
          if (data.content) {
            setTestimonials(data.content)
          }
        }
      } catch (error) {
        console.error("Error fetching testimonials content:", error)
        // フォールバック: localStorageから取得
        const savedTestimonials = localStorage.getItem("testimonialsContent")
        if (savedTestimonials) {
          setTestimonials(JSON.parse(savedTestimonials))
        }
      }
    }
    fetchContent()
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <ErrorMessage message={error.message} />
  }

  const backgroundImage = imageUrls.reviewsBackgroundImage?.url || "/placeholder.svg"

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
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white bg-opacity-90 hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <ImageWithFallback
                      src={imageUrls[`testimonial${index || "/placeholder.svg"}`]?.url || "/placeholder.svg"}
                      fallbackSrc="/placeholder.svg"
                      alt={testimonial.name}
                      width={60}
                      height={60}
                      className="rounded-full shadow-xl"
                    />
                    <div>
                      <CardTitle className="text-lg" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)" }}>
                        {testimonial.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        {testimonial.age}歳 / {testimonial.occupation}
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)" }}>
                    {testimonial.comment}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
