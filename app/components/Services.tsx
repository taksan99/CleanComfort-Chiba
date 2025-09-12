"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AnimatedSection from "./AnimatedSection"
import { useImageUrls } from "../hooks/useImageUrls"
import * as LucideIcons from "lucide-react"
import { HelpCircle } from "lucide-react"

interface ServiceContent {
  title: string
  description: string
  items: { name: string; icon: string; desc: string }[]
  features: string[]
  option: string
}

const iconMap: { [key: string]: keyof typeof LucideIcons } = {
  "water-5": "Droplets",
  kitchen: "Utensils",
  bathroom: "Bath",
  toilet: "Toilet",
  "glass-window": "Maximize",
  balcony: "Home",
  waxing: "Sparkles",
  "air-conditioner": "Wind",
  "air-conditioner-auto": "Cog",
  "air-conditioner-embedded": "SquareAsterisk",
  "air-conditioner-industrial": "Factory",
  "air-conditioner-wide": "ArrowLeftRight",
  "air-conditioner-outdoor": "CloudSun",
  "pest-control": "Bug",
  "grave-visit": "Flower2",
  "pet-care": "Paw",
  "friend-service": "Users",
  gardening: "Scissors",
  "plumbing-service": "Wrench",
  "other-service": "MoreHorizontal",
}

const defaultServices: ServiceContent[] = [
  {
    title: "ハウスクリーニング",
    description: "あなたの家を隅々まで美しく",
    items: [
      { name: "水回り5点セット", icon: "water-5", desc: "68,000円～ 洗面所・キッチン・浴室・トイレ・洗濯機周り" },
      { name: "キッチン", icon: "kitchen", desc: "20,000円～ レンジフード・コンロ・シンク" },
      { name: "浴室", icon: "bathroom", desc: "20,000円～ 床・壁・天井・鏡・蛇口（エプロン内部クリーニング+5,000円）" },
      { name: "トイレ", icon: "toilet", desc: "10,000円～ 便器・床・壁・換気扇" },
      { name: "ガラス・サッシ", icon: "glass-window", desc: "10,000円～ 窓3枚・網戸・サッシレール" },
      { name: "ベランダ", icon: "balcony", desc: "6,000円～ 床・手すり・排水口" },
      { name: "ワックスがけ", icon: "waxing", desc: "戸建て：5,000円～、アパート：4,000円～" },
    ],
    features: [
      "頑固な水垢や油汚れも徹底除去",
      "除菌・消臭効果で衛生的な空間に",
      "プロの道具と技術で普段手の届かない場所も",
    ],
    option: "なし",
  },
  {
    title: "エアコンクリーニング",
    description: "クリーンな空気で快適生活",
    items: [
      { name: "通常エアコン", icon: "air-conditioner", desc: "12,000円～ 壁掛け型" },
      { name: "お掃除機能付き", icon: "air-conditioner-auto", desc: "22,000円～ 自動お掃除機能付きエアコン" },
      { name: "埋込式エアコン", icon: "air-conditioner-embedded", desc: "25,000円～ ご家庭用天井埋込タイプ" },
      { name: "業務用エアコン", icon: "air-conditioner-industrial", desc: "33,000円～ 4方向タイプ" },
      { name: "ワイドエアコン", icon: "air-conditioner-wide", desc: "28,000円～ 横に広いタイプ（業務用など）" },
      { name: "室外機", icon: "air-conditioner-outdoor", desc: "6,000円～ 室外機のみのクリーニング" },
    ],
    features: [
      "独自の高圧洗浄技術でフィンも綺麗に",
      "アレル物質や花粉を99%以上除去",
      "消費電力を最大30%削減し、電気代を節約",
      "悪臭の原因となるカビやバクテリアを撃退",
    ],
    option: "抗菌コート：1,000円、防カビコート：1,000円",
  },
  {
    title: "便利屋サービス",
    description: "日常のお困りごとを解決（最低料金5,000円～）",
    items: [
      { name: "害獣・害虫駆除", icon: "pest-control", desc: "10,000円～ ネズミ、コウモリ、蜂の巣など" },
      { name: "墓参り代行", icon: "grave-visit", desc: "お墓の清掃・お供えなど" },
      { name: "ペットの世話", icon: "pet-care", desc: "餌やり・散歩・トイレ清掃など" },
      { name: "友達代行", icon: "friend-service", desc: "イベント参加・話し相手など" },
      { name: "庭の手入れ", icon: "gardening", desc: "草刈り・剪定・除草" },
      {
        name: "水道・トイレのつまり",
        icon: "plumbing-service",
        desc: "軽度：7,000円～、中程度～重度：30,000円～、夜間対応：50,000円～",
      },
      { name: "その他", icon: "other-service", desc: "日常のお困りごとをお気軽にご相談ください" },
    ],
    features: [
      "経験豊富なスタッフが迅速に対応",
      "幅広いサービスで様々なニーズに対応",
      "丁寧な作業と適正価格で安心",
      "緊急対応も可能（追加料金あり）",
    ],
    option: "電球交換など軽微なもの：500円～（お気軽にご相談ください）",
  },
]

export default function Services() {
  const [services, setServices] = useState<ServiceContent[]>(defaultServices)
  const { imageUrls, isLoading, error } = useImageUrls()

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/content?section=services")
      const data = await response.json()
      if (data.content) {
        setServices(data.content)
      }
    } catch (error) {
      console.error("Error fetching services content:", error)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    console.error("Error loading services images:", error)
  }

  const serviceImages = [
    imageUrls.houseCleaningCard?.url || "/placeholder.svg",
    imageUrls.airConCleaningCard?.url || "/placeholder.svg",
    imageUrls.handymanCard?.url || "/placeholder.svg",
  ]

  const backgroundImage = imageUrls.servicesBackgroundImage?.url

  return (
    <section
      id="services"
      className="relative bg-cover bg-center bg-no-repeat py-16"
      style={{
        backgroundImage: `url(${backgroundImage || "/placeholder.svg"})`,
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection>
          <h2 className="text-4xl font-bold text-center mb-12 text-white">サービス内容</h2>
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = LucideIcons[iconMap[service.items[0]?.icon] as keyof typeof LucideIcons] || HelpCircle
            return (
              <AnimatedSection key={index}>
                <Card className="h-full bg-white bg-opacity-95 hover:bg-opacity-100 transition-all duration-300 transform hover:scale-105">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 relative">
                      <img
                        src={serviceImages[index] || "/placeholder.svg"}
                        alt={service.title}
                        className="w-full h-48 object-cover rounded-lg shadow-xl"
                      />
                    </div>
                    <CardTitle className="text-2xl text-blue-600">{service.title}</CardTitle>
                    <p className="text-gray-600">{service.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2 text-gray-800">提供サービス</h4>
                        <div className="space-y-2">
                          {service.items.map((item, itemIndex) => {
                            const ItemIcon = LucideIcons[iconMap[item.icon] as keyof typeof LucideIcons] || HelpCircle
                            return (
                              <div key={itemIndex} className="flex items-start space-x-2">
                                <ItemIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <span className="font-medium text-gray-800">{item.name}</span>
                                  <p className="text-sm text-gray-600">{item.desc}</p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-gray-800">サービスの特徴</h4>
                        <div className="flex flex-wrap gap-1">
                          {service.features.map((feature, featureIndex) => (
                            <Badge key={featureIndex} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {service.option && service.option !== "なし" && (
                        <div>
                          <h4 className="font-semibold mb-2 text-gray-800">オプション</h4>
                          <p className="text-sm text-gray-600">{service.option}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            )
          })}
        </div>
      </div>
    </section>
  )
}
