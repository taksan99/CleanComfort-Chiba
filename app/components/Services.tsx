"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChevronRight,
  Droplets,
  Utensils,
  Bath,
  Tablet as Toilet,
  Maximize,
  Home,
  Sparkles,
  Wind,
  Cog,
  SquareAsterisk,
  Factory,
  ArrowLeftRight,
  CloudSun,
  Bug,
  Flower2,
  Play as Paw,
  Users,
  Scissors,
  Wrench,
  MoreHorizontal,
} from "lucide-react"
import { useImageUrls } from "../hooks/useImageUrls"
import AnimatedSection from "./AnimatedSection"

// アイコンマッピング
const iconMap = {
  "water-5": Droplets,
  kitchen: Utensils,
  bathroom: Bath,
  toilet: Toilet,
  "glass-window": Maximize,
  balcony: Home,
  waxing: Sparkles,
  "air-conditioner": Wind,
  "air-conditioner-auto": Cog,
  "air-conditioner-embedded": SquareAsterisk,
  "air-conditioner-industrial": Factory,
  "air-conditioner-wide": ArrowLeftRight,
  "air-conditioner-outdoor": CloudSun,
  "pest-control": Bug,
  "grave-visit": Flower2,
  "pet-care": Paw,
  "friend-service": Users,
  gardening: Scissors,
  "plumbing-service": Wrench,
  "other-service": MoreHorizontal,
}

// デフォルトサービスデータ
const defaultServices = [
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
  const { imageUrls } = useImageUrls()
  const [services, setServices] = useState(defaultServices)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/content?section=services")
        const data = await response.json()
        if (data && Array.isArray(data)) {
          setServices(data)
        }
      } catch (error) {
        console.error("Error fetching services:", error)
        // エラーの場合はlocalStorageから読み込み
        const savedServices = localStorage.getItem("serviceContent")
        if (savedServices) {
          setServices(JSON.parse(savedServices))
        }
      }
    }

    fetchServices()
  }, [])

  const serviceImages = [
    imageUrls.houseCleaningCard?.url || "/house-cleaning-service.png",
    imageUrls.airConCleaningCard?.url || "/air-conditioner-cleaning.png",
    imageUrls.handymanCard?.url || "/handyman-service.png",
  ]

  return (
    <section
      id="services"
      className="py-20 relative overflow-hidden"
      style={{
        backgroundImage: `url(${imageUrls.servicesBackgroundImage?.url || "/cleaning-service-background.jpg"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-white/90"></div>
      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">サービス内容</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              プロの技術と経験で、あなたの暮らしをより快適に。幅広いサービスでお客様のニーズにお応えします。
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.items[0]?.icon as keyof typeof iconMap] || Droplets

            return (
              <AnimatedSection key={index} delay={index * 0.2}>
                <Card className="h-full hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/95 backdrop-blur-sm border-2 border-blue-100">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={serviceImages[index] || "/placeholder.svg"}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <IconComponent className="w-8 h-8 mb-2" />
                      <h3 className="text-2xl font-bold">{service.title}</h3>
                      <p className="text-sm opacity-90">{service.description}</p>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="space-y-4 mb-6">
                      <h4 className="font-semibold text-lg text-gray-800 border-b border-gray-200 pb-2">
                        提供サービス
                      </h4>
                      <div className="space-y-3">
                        {service.items.map((item, itemIndex) => {
                          const ItemIcon = iconMap[item.icon as keyof typeof iconMap] || MoreHorizontal
                          return (
                            <div
                              key={itemIndex}
                              className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors"
                            >
                              <ItemIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="font-medium text-gray-800">{item.name}</div>
                                <div className="text-sm text-gray-600 mt-1">{item.desc}</div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <h4 className="font-semibold text-lg text-gray-800 border-b border-gray-200 pb-2">
                        サービスの特徴
                      </h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start space-x-2">
                            <ChevronRight className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {service.option && service.option !== "なし" && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-lg text-gray-800 border-b border-gray-200 pb-2 mb-3">
                          オプションサービス
                        </h4>
                        <Badge variant="secondary" className="text-sm">
                          {service.option}
                        </Badge>
                      </div>
                    )}

                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
                      詳細を見る
                    </Button>
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
