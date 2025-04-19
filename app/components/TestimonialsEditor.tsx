"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2 } from "lucide-react"
import ImageUploader from "@/app/components/ImageUploader"
import { useImageUrls } from "../hooks/useImageUrls"

interface Testimonial {
  name: string
  age: number
  occupation: string
  comment: string
  rating: number
}

const initialTestimonials: Testimonial[] = [
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

export default function TestimonialsEditor() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials)
  const [isUploading, setIsUploading] = useState(false)
  const { imageUrls, refreshImages } = useImageUrls()

  useEffect(() => {
    const savedTestimonials = localStorage.getItem("testimonialsContent")
    if (savedTestimonials) {
      setTestimonials(JSON.parse(savedTestimonials))
    }
  }, [])

  const handleChange = (index: number, field: keyof Testimonial, value: string | number) => {
    const newTestimonials = [...testimonials]
    newTestimonials[index] = { ...newTestimonials[index], [field]: value }
    setTestimonials(newTestimonials)
  }

  const handleAddTestimonial = () => {
    setTestimonials([...testimonials, { name: "", age: 0, occupation: "", comment: "", rating: 5 }])
  }

  const handleRemoveTestimonial = (index: number) => {
    const newTestimonials = [...testimonials]
    newTestimonials.splice(index, 1)
    setTestimonials(newTestimonials)
  }

  const handleSave = () => {
    localStorage.setItem("testimonialsContent", JSON.stringify(testimonials))
    alert("お客様の声の内容が保存されました。")
  }

  const handleImageUpload = useCallback(
    async (file: File, index: number) => {
      setIsUploading(true)
      try {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("isAdmin", "true")
        formData.append("section", `testimonial${index}`)

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
          await refreshImages() // awaitを追加
        } else {
          throw new Error("Image upload failed")
        }
      } catch (error) {
        console.error("Error uploading image:", error)
        alert("画像のアップロードに失敗しました。")
      } finally {
        setIsUploading(false)
      }
    },
    [refreshImages],
  )

  return (
    <div className="space-y-4">
      <Tabs defaultValue="testimonial0">
        <TabsList className="flex flex-wrap">
          {testimonials.map((_, index) => (
            <TabsTrigger key={index} value={`testimonial${index}`}>
              お客様 {index + 1}
            </TabsTrigger>
          ))}
        </TabsList>
        {testimonials.map((testimonial, index) => (
          <TabsContent key={index} value={`testimonial${index}`}>
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>お客様 {index + 1} の声</span>
                  <Button variant="destructive" size="sm" onClick={() => handleRemoveTestimonial(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block mb-2">お客様の画像</label>
                  <ImageUploader
                    onImageUpload={(file) => handleImageUpload(file, index)}
                    currentImage={imageUrls[`testimonial${index}`] || "/placeholder.svg"}
                    width={100}
                    height={100}
                    className="rounded-full shadow-xl mb-4"
                    isAdmin={true}
                    isUploading={isUploading}
                    section={`testimonial${index}`}
                  />
                </div>
                <div>
                  <label className="block mb-2">お名前</label>
                  <Input
                    value={testimonial.name}
                    onChange={(e) => handleChange(index, "name", e.target.value)}
                    placeholder="お名前"
                  />
                </div>
                <div>
                  <label className="block mb-2">年齢</label>
                  <Input
                    type="number"
                    value={testimonial.age}
                    onChange={(e) => handleChange(index, "age", Number.parseInt(e.target.value))}
                    placeholder="年齢"
                  />
                </div>
                <div>
                  <label className="block mb-2">職業</label>
                  <Input
                    value={testimonial.occupation}
                    onChange={(e) => handleChange(index, "occupation", e.target.value)}
                    placeholder="職業"
                  />
                </div>
                <div>
                  <label className="block mb-2">コメント</label>
                  <Textarea
                    value={testimonial.comment}
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
                    value={testimonial.rating}
                    onChange={(e) => handleChange(index, "rating", Number.parseInt(e.target.value))}
                    placeholder="評価"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      <Button onClick={handleAddTestimonial} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        新しいお客様の声を追加
      </Button>
      <Button onClick={handleSave}>保存</Button>
    </div>
  )
}
