"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

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
    bg: "bg-yellow-50",
  },
]

export default function ServiceContentEditor({
  initialServices: propInitialServices,
}: { initialServices?: ServiceContent[] }) {
  const [services, setServices] = useState<ServiceContent[]>(propInitialServices || initialServices)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

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
      console.error("Error fetching content:", error)
    }
  }

  const handleServiceChange = (
    serviceIndex: number,
    field: keyof ServiceContent,
    value: string | ServiceItem[] | string[],
  ) => {
    const newServices = [...services]
    newServices[serviceIndex] = { ...newServices[serviceIndex], [field]: value }
    setServices(newServices)
  }

  const handleItemChange = (serviceIndex: number, itemIndex: number, field: keyof ServiceItem, value: string) => {
    const newServices = [...services]
    const newItems = [...newServices[serviceIndex].items]
    newItems[itemIndex] = { ...newItems[itemIndex], [field]: value }
    newServices[serviceIndex] = { ...newServices[serviceIndex], items: newItems }
    setServices(newServices)
  }

  const handleFeatureChange = (serviceIndex: number, featureIndex: number, value: string) => {
    const newServices = [...services]
    const newFeatures = [...newServices[serviceIndex].features]
    newFeatures[featureIndex] = value
    newServices[serviceIndex] = { ...newServices[serviceIndex], features: newFeatures }
    setServices(newServices)
  }

  const handleAddItem = (serviceIndex: number) => {
    const newServices = [...services]
    const newItems = [...newServices[serviceIndex].items, { name: "", icon: "", desc: "" }]
    newServices[serviceIndex] = { ...newServices[serviceIndex], items: newItems }
    setServices(newServices)
  }

  const handleRemoveItem = (serviceIndex: number, itemIndex: number) => {
    const newServices = [...services]
    const newItems = newServices[serviceIndex].items.filter((_, i) => i !== itemIndex)
    newServices[serviceIndex] = { ...newServices[serviceIndex], items: newItems }
    setServices(newServices)
  }

  const handleAddFeature = (serviceIndex: number) => {
    const newServices = [...services]
    const newFeatures = [...newServices[serviceIndex].features, ""]
    newServices[serviceIndex] = { ...newServices[serviceIndex], features: newFeatures }
    setServices(newServices)
  }

  const handleRemoveFeature = (serviceIndex: number, featureIndex: number) => {
    const newServices = [...services]
    const newFeatures = newServices[serviceIndex].features.filter((_, i) => i !== featureIndex)
    newServices[serviceIndex] = { ...newServices[serviceIndex], features: newFeatures }
    setServices(newServices)
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section: "services",
          content: services,
        }),
      })

      if (response.ok) {
        toast({
          title: "保存完了",
          description: "サービス内容が正常に保存されました。",
        })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      console.error("Error saving content:", error)
      toast({
        title: "エラー",
        description: "保存に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="service0">
        <TabsList>
          {services.map((service, index) => (
            <TabsTrigger key={index} value={`service${index}`}>
              {service.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {services.map((service, serviceIndex) => (
          <TabsContent key={serviceIndex} value={`service${serviceIndex}`}>
            <Card>
              <CardHeader>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block mb-2">タイトル</label>
                  <Input
                    value={service.title}
                    onChange={(e) => handleServiceChange(serviceIndex, "title", e.target.value)}
                    placeholder="サービスタイトル"
                  />
                </div>
                <div>
                  <label className="block mb-2">説明</label>
                  <Textarea
                    value={service.description}
                    onChange={(e) => handleServiceChange(serviceIndex, "description", e.target.value)}
                    placeholder="サービス説明"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block mb-2">提供サービス</label>
                  {service.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="border p-4 rounded-lg space-y-2 mb-2">
                      <div className="flex space-x-2">
                        <Input
                          value={item.name}
                          onChange={(e) => handleItemChange(serviceIndex, itemIndex, "name", e.target.value)}
                          placeholder="サービス名"
                          className="flex-1"
                        />
                        <Input
                          value={item.icon}
                          onChange={(e) => handleItemChange(serviceIndex, itemIndex, "icon", e.target.value)}
                          placeholder="アイコン"
                          className="w-32"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleRemoveItem(serviceIndex, itemIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Textarea
                        value={item.desc}
                        onChange={(e) => handleItemChange(serviceIndex, itemIndex, "desc", e.target.value)}
                        placeholder="サービス詳細"
                        rows={2}
                      />
                    </div>
                  ))}
                  <Button variant="outline" onClick={() => handleAddItem(serviceIndex)} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    サービス項目を追加
                  </Button>
                </div>
                <div>
                  <label className="block mb-2">サービスの特徴</label>
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex space-x-2 mb-2">
                      <Input
                        value={feature}
                        onChange={(e) => handleFeatureChange(serviceIndex, featureIndex, e.target.value)}
                        placeholder="特徴"
                        className="flex-1"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveFeature(serviceIndex, featureIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={() => handleAddFeature(serviceIndex)} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    特徴を追加
                  </Button>
                </div>
                <div>
                  <label className="block mb-2">オプションサービス</label>
                  <Textarea
                    value={service.option}
                    onChange={(e) => handleServiceChange(serviceIndex, "option", e.target.value)}
                    placeholder="オプションサービス"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      <Button onClick={handleSave} disabled={isLoading}>
        {isLoading ? "保存中..." : "保存"}
      </Button>
    </div>
  )
}
