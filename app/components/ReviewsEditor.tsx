"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2 } from "lucide-react"
import ImageUploader from "@/app/components/ImageUploader"
import { useImageUrls } from "../hooks/useImageUrls"

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

export default function ReviewsEditor() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [isUploading, setIsUploading] = useState(false)
  const { imageUrls, refreshImages } = useImageUrls()

  useEffect(() => {
    // データベースから取得を試行
    const fetchContent = async () => {
      try {
        const response = await fetch("/api/content?section=testimonials")
        if (response.ok) {
          const data = await response.json()
          if (data.content) {
            setReviews(data.content)
            return
          }
        }
      } catch (error) {
        console.error("Error fetching testimonials content:", error)
      }

      // フォールバック: localStorageから取得
      const savedReviews = localStorage.getItem("testimonialsContent")
      if (savedReviews) {
        setReviews(JSON.parse(savedReviews))
      }
    }
    fetchContent()
  }, [])

  const handleChange = (index: number, field: keyof Review, value: string | number) => {
    const newReviews = [...reviews]
    newReviews[index] = { ...newReviews[index], [field]: value }
    setReviews(newReviews)
  }

  const handleAddReview = () => {
    setReviews([...reviews, { name: "", age: 0, occupation: "", comment: "", rating: 5 }])
  }

  const handleRemoveReview = (index: number) => {
    const newReviews = [...reviews]
    newReviews.splice(index, 1)
    setReviews(newReviews)
  }

  const handleSave = async () => {
    try {
      // データベースに保存
      const response = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section: "testimonials",
          content: reviews,
        }),
      })

      if (response.ok) {
        alert("お客様の声の内容がデータベースに保存されました。")
      } else {
        throw new Error("Database save failed")
      }
    } catch (error) {
      console.error("Error saving to database:", error)
      // フォールバック: localStorageに保存
      localStorage.setItem("testimonialsContent", JSON.stringify(reviews))
      alert("お客様の声の内容がローカルに保存されました。")
    }
  }

  const handleImageUpload = async (file: File, index: number) => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("isAdmin", "true")
      formData.append("section", `review${index}`)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (data.success) {
        alert("画像が正常にアップロードされました。")
        await refreshImages() // 画像URLを更新
      } else {
        throw new Error("Image upload failed")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("画像のアップロードに失敗しました。")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="review0">
        <TabsList className="flex flex-wrap">
          {reviews.map((_, index) => (
            <TabsTrigger key={index} value={`review${index}`}>
              お客様 {index + 1}
            </TabsTrigger>
          ))}
        </TabsList>
        {reviews.map((review, index) => (
          <TabsContent key={index} value={`review${index}`}>
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>お客様 {index + 1} の声</span>
                  <Button variant="destructive" size="sm" onClick={() => handleRemoveReview(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block mb-2">お客様の画像</label>
                  <ImageUploader
                    onImageUpload={(file) => handleImageUpload(file, index)}
                    currentImage={imageUrls[`review${index}`]?.url || "/placeholder.svg"}
                    width={100}
                    height={100}
                    className="rounded-full shadow-xl mb-4"
                    isAdmin={true}
                    isUploading={isUploading}
                    section={`review${index}`}
                    sectionName={`お客様の声 ${index + 1} のプロフィール画像`}
                  />
                </div>
                <div>
                  <label className="block mb-2">お名前</label>
                  <Input
                    value={review.name}
                    onChange={(e) => handleChange(index, "name", e.target.value)}
                    placeholder="お名前"
                  />
                </div>
                <div>
                  <label className="block mb-2">年齢</label>
                  <Input
                    type="number"
                    value={review.age}
                    onChange={(e) => handleChange(index, "age", Number.parseInt(e.target.value))}
                    placeholder="年齢"
                  />
                </div>
                <div>
                  <label className="block mb-2">職業</label>
                  <Input
                    value={review.occupation}
                    onChange={(e) => handleChange(index, "occupation", e.target.value)}
                    placeholder="職業"
                  />
                </div>
                <div>
                  <label className="block mb-2">コメント</label>
                  <Textarea
                    value={review.comment}
                    onChange={(e) => handleChange(index, "comment", e.target.value)}
                    placeholder="コメント"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block mb-2">評価（1-5）</label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={review.rating}
                    onChange={(e) => handleChange(index, "rating", Number.parseInt(e.target.value))}
                    placeholder="評価"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      <Button onClick={handleAddReview} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        新しいお客様の声を追加
      </Button>
      <Button onClick={handleSave}>保存</Button>
    </div>
  )
}
