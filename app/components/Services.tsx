"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import AnimatedSection from "./AnimatedSection"
import { motion } from "framer-motion"
import { useImageUrls } from "@/app/hooks/useImageUrls"
import ImageWithFallback from "./ImageWithFallback"
import ErrorMessage from "./ErrorMessage"
import * as LucideIcons from "lucide-react"

// アイコン名とLucideアイコンのマッピング
const iconMap: { [key: string]: keyof typeof LucideIcons } = {
  "water-5": "Droplet",
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

// サービスごとのアイコン色
const iconColors: { [key: string]: string } = {
  ハウスクリーニング: "#3b82f6", // blue-500
  エアコンクリーニング: "#10b981", // emerald-500
  便利屋サービス: "#f59e0b", // amber-500
}

interface ServiceItem {
  name: string
  icon: string
  desc: string
}

interface ServiceContent {
  title: string
  description: string
  items: ServiceItem[]
  features: string[]
  option: string
  bg: string
}

const initialServices: ServiceContent[] = [
  {
    title: "ハウスクリーニング",
    description: "あなたの家を隅々まで美しく",
    items: [
      { name: "水回り5点セット", icon: "water-5", desc: "68,000円～ 浴室/キッチン/レンジフード/トイレ/洗面台" },
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
    bg: "bg-blue-50",
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
    bg: "bg-green-50",
  },
  {
    title: "便利屋サービス",
    description: "日常のお困りごとを解決",
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
    bg: "bg-yellow-50",
  },
]

export default function Services() {
  const [services, setServices] = useState(initialServices)
  const { imageUrls, isLoading, error } = useImageUrls()

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/content?section=services")
      const data = await response.json()
      if (data.content) {
        // 初期データの構造を保持しながらコンテンツを更新
        const updatedServices = initialServices.map((initialService, index) => ({
          ...initialService,
          ...data.content[index],
        }))
        setServices(updatedServices)
      }
    } catch (error) {
      console.error("Error fetching content:", error)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <ErrorMessage message={error.message} />
  }

  const backgroundImage = imageUrls.servicesBackgroundImage?.url || "/placeholder.svg"

  return (
    <section
      id="services"
      className="relative bg-cover bg-center bg-no-repeat py-16"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundAttachment: "fixed" }}
    >
      <div className="absolute inset-0 bg-white opacity-20"></div>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 bg-white bg-opacity-75 p-4 rounded-lg shadow-lg">
          サービス内容
        </h2>
        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card className={`${initialServices[index].bg} overflow-hidden bg-opacity-90 h-full`}>
                  <ImageWithFallback
                    src={
                      index === 0
                        ? imageUrls.houseCleaningCard?.url
                        : index === 1
                          ? imageUrls.airConCleaningCard?.url
                          : index === 2
                            ? imageUrls.handymanCard?.url
                            : "/placeholder.svg"
                    }
                    fallbackSrc="/placeholder.svg"
                    alt={service.title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <CardHeader>
                    <CardTitle className="text-2xl" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)" }}>
                      {service.title}
                    </CardTitle>
                    <CardDescription
                      className="text-lg"
                      style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)", whiteSpace: "pre-wrap" }}
                    >
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold mb-2 text-lg" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)" }}>
                      提供サービス
                    </h4>
                    <ul className="space-y-2 mb-4">
                      {service.items.map((item, itemIndex) => {
                        const IconComponent =
                          LucideIcons[iconMap[item.icon] as keyof typeof LucideIcons] || LucideIcons.HelpCircle
                        return (
                          <li key={itemIndex} className="flex items-start">
                            <span className="text-2xl mr-2">
                              <IconComponent size={24} color={iconColors[service.title]} strokeWidth={2} />
                            </span>
                            <div>
                              <h5
                                className="font-semibold text-base"
                                style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)" }}
                              >
                                {item.name}
                              </h5>
                              <p
                                className="text-sm text-gray-600"
                                style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)", whiteSpace: "pre-wrap" }}
                              >
                                {item.desc}
                              </p>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                    <h4 className="font-semibold mb-2 text-lg" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)" }}>
                      サービスの特徴
                    </h4>
                    <ul className="list-disc list-inside space-y-1 mb-4">
                      {service.features.map((feature, index) => (
                        <li
                          key={index}
                          className="text-sm"
                          style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)", whiteSpace: "pre-wrap" }}
                        >
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <h4 className="font-semibold mb-2 text-lg" style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)" }}>
                      オプションサービス
                    </h4>
                    <p
                      className="text-sm text-gray-600"
                      style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)", whiteSpace: "pre-wrap" }}
                    >
                      {service.option}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
