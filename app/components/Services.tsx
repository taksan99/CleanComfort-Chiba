"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Droplets, Wind, Wrench } from "lucide-react"
import { useImageUrls } from "../hooks/useImageUrls"

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
}

const initialServices: ServiceContent[] = [
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
  const [services, setServices] = useState<ServiceContent[]>(initialServices)

  useEffect(() => {
    const savedServices = localStorage.getItem("serviceContent")
    if (savedServices) {
      try {
        const parsedServices = JSON.parse(savedServices)
        setServices(parsedServices)
      } catch (error) {
        console.error("Error parsing saved services:", error)
      }
    }
  }, [])

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "water-5":
      case "kitchen":
      case "bathroom":
      case "toilet":
      case "glass-window":
      case "balcony":
      case "waxing":
        return <Droplets className="w-8 h-8 text-blue-600" />
      case "air-conditioner":
      case "air-conditioner-auto":
      case "air-conditioner-embedded":
      case "air-conditioner-industrial":
      case "air-conditioner-wide":
      case "air-conditioner-outdoor":
        return <Wind className="w-8 h-8 text-green-600" />
      default:
        return <Wrench className="w-8 h-8 text-yellow-600" />
    }
  }

  return (
    <section id="services" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">サービス内容</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            プロの技術と経験で、あなたの暮らしをより快適に。幅広いサービスでお客様のニーズにお応えします。
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  {getIconComponent(service.items[0].icon)}
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">{service.title}</CardTitle>
                <p className="text-gray-600 mt-2">{service.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">提供サービス</h4>
                    <div className="space-y-2">
                      {service.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
                          {getIconComponent(item.icon)}
                          <div>
                            <div className="font-medium text-gray-800">{item.name}</div>
                            <div className="text-sm text-gray-600">{item.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">サービスの特徴</h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-sm text-gray-600 flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {service.option && service.option !== "なし" && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">オプションサービス</h4>
                      <Badge variant="secondary" className="text-xs">
                        {service.option}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
