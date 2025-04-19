"use client"

import { useState, useEffect, useCallback } from "react"
import { Toaster } from "@/components/ui/toaster"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ImageUploader from "@/app/components/ImageUploader"
import ServiceContentEditor from "@/app/components/ServiceContentEditor"
import ValuePropositionEditor from "@/app/components/ValuePropositionEditor"
import StrengthsEditor from "@/app/components/StrengthsEditor"
import SeasonalPlansEditor from "@/app/components/SeasonalPlansEditor"
import PricingOverviewEditor from "@/app/components/PricingOverviewEditor"
import ReviewsEditor from "@/app/components/ReviewsEditor"
import PromotionsEditor from "@/app/components/PromotionsEditor"
import FAQEditor from "@/app/components/FAQEditor"
import { LogOut, Home, Image, Edit, DollarSign, Star, Gift, HelpCircle, Settings } from "lucide-react"
import { isAuthenticated, logout } from "@/app/lib/auth"
import SubscriptionEditor from "@/app/components/SubscriptionEditor"
import SettingsEditor from "@/app/components/SettingsEditor"
import SEOSettingsEditor from "@/app/components/SEOSettingsEditor"
import { useImageUrls } from "../hooks/useImageUrls"

const initialServices = [
  {
    title: "ハウスクリーニング",
    description: "あなたの家を隅々まで美しく",
    items: [
      { name: "水回り5点セット", icon: "🚰", desc: "68,000円～ 洗面所・キッチン・浴室・トイレ・洗濯機周り" },
      { name: "キッチン", icon: "🍳", desc: "20,000円～ レンジフード・コンロ・シンク" },
      { name: "浴室", icon: "🛁", desc: "20,000円～ 床・壁・天井・鏡・蛇口（エプロン内部クリーニング+5,000円）" },
      { name: "トイレ", icon: "🚽", desc: "10,000円～ 便器・床・壁・換気扇" },
      { name: "ガラス・サッシ", icon: "🪟", desc: "10,000円～ 窓3枚・網戸・サッシレール" },
      { name: "ベランダ", icon: "🏠", desc: "6,000円～ 床・手すり・排水口" },
      { name: "ワックスがけ", icon: "✨", desc: "戸建て：5,000円～、アパート：4,000円～" },
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
      { name: "通常エアコン", icon: "❄️", desc: "12,000円～ 壁掛け型" },
      { name: "お掃除機能付き", icon: "🤖", desc: "22,000円～ 自動お掃除機能付きエアコン" },
      { name: "埋込式エアコン", icon: "🏠", desc: "25,000円～ ご家庭用天井埋込タイプ" },
      { name: "業務用エアコン", icon: "🏢", desc: "33,000円～ 4方向タイプ" },
      { name: "ワイドエアコン", icon: "📏", desc: "28,000円～ 横に広いタイプ（業務用など）" },
      { name: "室外機", icon: "🌡️", desc: "6,000円～ 室外機のみのクリーニング" },
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
      { name: "害獣・害虫駆除", icon: "🐜", desc: "10,000円～ ネズミ、コウモリ、蜂の巣など" },
      { name: "墓参り代行", icon: "🪦", desc: "お墓の清掃・お供えなど" },
      { name: "ペットの世話", icon: "🐾", desc: "餌やり・散歩・トイレ清掃など" },
      { name: "友達代行", icon: "🤝", desc: "イベント参加・話し相手など" },
      { name: "庭の手入れ", icon: "🌳", desc: "草刈り・剪定・除草" },
      {
        name: "水道・トイレのつまり",
        icon: "🚽",
        desc: "軽度：7,000円～、中程度～重度：30,000円～、夜間対応：50,000円～",
      },
      { name: "その他", icon: "🌟", desc: "日常のお困りごとをお気軽にご相談ください" },
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

export default function AdminPage() {
  const { imageUrls, isLoading, error, refreshImages } = useImageUrls()
  const [heroImage, setHeroImage] = useState("/placeholder.svg")
  const [heroImages, setHeroImages] = useState<string[]>(Array(5).fill("/placeholder.svg"))
  const [valuePropositionImage, setValuePropositionImage] = useState("/placeholder.svg")
  const [strengthsImage, setStrengthsImage] = useState("/placeholder.svg")
  const [servicesImage, setServicesImage] = useState("/placeholder.svg")
  const [houseCleaningImage, setHouseCleaningImage] = useState("/placeholder.svg")
  const [airConCleaningImage, setAirConCleaningImage] = useState("/placeholder.svg")
  const [handymanImage, setHandymanImage] = useState("/placeholder.svg")
  const [seasonalPlansImage, setSeasonalPlansImage] = useState("/placeholder.svg")
  const [springPlanImage, setSpringPlanImage] = useState("/placeholder.svg")
  const [summerPlanImage, setSummerPlanImage] = useState("/placeholder.svg")
  const [autumnPlanImage, setAutumnPlanImage] = useState("/placeholder.svg")
  const [winterPlanImage, setWinterPlanImage] = useState("/placeholder.svg")
  const [pricingOverviewImage, setPricingOverviewImage] = useState("/placeholder.svg")
  const [reasonsImage, setReasonsImage] = useState("/placeholder.svg")
  const [reviewsImage, setReviewsImage] = useState("/placeholder.svg")
  const [reviewImages, setReviewImages] = useState(Array(6).fill("/placeholder.svg"))
  const [isUploading, setIsUploading] = useState(false)
  const [trustSignalsImage, setTrustSignalsImage] = useState("/placeholder.svg")
  const [promotionsImage, setPromotionsImage] = useState("/placeholder.svg")
  const [subscriptionImage, setSubscriptionImage] = useState("/placeholder.svg")
  const [faqImage, setFaqImage] = useState("/placeholder.svg")
  const [urgencyOfferImage, setUrgencyOfferImage] = useState("/placeholder.svg")
  const [contactFormImage, setContactFormImage] = useState("/placeholder.svg")
  const [logoIcon, setLogoIcon] = useState("/placeholder.svg")
  const [valuePropositionBackgroundImage, setValuePropositionBackgroundImage] = useState("/placeholder.svg")
  const [strengthsBackgroundImage, setStrengthsBackgroundImage] = useState("/placeholder.svg")
  const [servicesBackgroundImage, setServicesBackgroundImage] = useState("/placeholder.svg")
  const [seasonalPlansBackgroundImage, setSeasonalPlansBackgroundImage] = useState("/placeholder.svg")
  const [headerIcon, setHeaderIcon] = useState("/placeholder.svg")
  const [faviconIcon, setFaviconIcon] = useState("/favicon.ico")
  const [heroBackgroundImage, setHeroBackgroundImage] = useState("/placeholder.svg")
  const [pricingOverviewBackgroundImage, setPricingOverviewBackgroundImage] = useState("/placeholder.svg")
  const [reasonsBackgroundImage, setReasonsBackgroundImage] = useState("/placeholder.svg")
  const [reviewsBackgroundImage, setReviewsBackgroundImage] = useState("/placeholder.svg")
  const [trustSignalsBackgroundImage, setTrustSignalsBackgroundImage] = useState("/placeholder.svg")
  const [promotionsBackgroundImage, setPromotionsBackgroundImage] = useState("/placeholder.svg")
  const [subscriptionBackgroundImage, setSubscriptionBackgroundImage] = useState("/placeholder.svg")
  const [faqBackgroundImage, setFaqBackgroundImage] = useState("/placeholder.svg")
  const [urgencyOfferBackgroundImage, setUrgencyOfferBackgroundImage] = useState("/placeholder.svg")
  const [contactFormBackgroundImage, setContactFormBackgroundImage] = useState("/placeholder.svg")
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState("")
  const [googleSiteVerification, setGoogleSiteVerification] = useState("")
  const [bingVerification, setBingVerification] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // 認証状態をチェック
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }

    async function fetchImages() {
      try {
        const imagesToFetch = [
          { key: "heroImage", setter: setHeroImage },
          { key: "valuePropositionImage", setter: setValuePropositionImage },
          { key: "strengthsImage", setter: setStrengthsImage },
          { key: "servicesImage", setter: setServicesImage },
          { key: "houseCleaningCard", setter: setHouseCleaningImage },
          { key: "airConCleaningCard", setter: setAirConCleaningImage },
          { key: "handymanCard", setter: setHandymanImage },
          { key: "seasonalPlansImage", setter: setSeasonalPlansImage },
          { key: "springPlanImage", setter: setSpringPlanImage },
          { key: "summerPlanImage", setter: setSummerPlanImage },
          { key: "autumnPlanImage", setter: setAutumnPlanImage },
          { key: "winterPlanImage", setter: setWinterPlanImage },
          { key: "pricingOverviewImage", setter: setPricingOverviewImage },
          { key: "reasonsImage", setter: setReasonsImage },
          { key: "reviewsImage", setter: setReviewsImage },
          { key: "trustSignalsImage", setter: setTrustSignalsImage },
          { key: "promotionsImage", setter: setPromotionsImage },
          { key: "subscriptionImage", setter: setSubscriptionImage },
          { key: "faqImage", setter: setFaqImage },
          { key: "urgencyOfferImage", setter: setUrgencyOfferImage },
          { key: "contactFormImage", setter: setContactFormImage },
          { key: "logoIcon", setter: setLogoIcon },
          { key: "valuePropositionBackgroundImage", setter: setValuePropositionBackgroundImage },
          { key: "strengthsBackgroundImage", setter: setStrengthsBackgroundImage },
          { key: "servicesBackgroundImage", setter: setServicesBackgroundImage },
          { key: "seasonalPlansBackgroundImage", setter: setSeasonalPlansBackgroundImage },
          { key: "heroBackgroundImage", setter: setHeroBackgroundImage },
          { key: "pricingOverviewBackgroundImage", setter: setPricingOverviewImage },
          { key: "reasonsBackgroundImage", setter: setReasonsBackgroundImage },
          { key: "reviewsBackgroundImage", setter: setReviewsBackgroundImage },
          { key: "trustSignalsBackgroundImage", setter: setTrustSignalsBackgroundImage },
          { key: "promotionsBackgroundImage", setter: setPromotionsBackgroundImage },
          { key: "subscriptionBackgroundImage", setter: setSubscriptionBackgroundImage },
          { key: "faqBackgroundImage", setter: setFaqBackgroundImage },
          { key: "urgencyOfferBackgroundImage", setter: setUrgencyOfferBackgroundImage },
          { key: "contactFormBackgroundImage", setter: setContactFormBackgroundImage },
          { key: "ogImage", setter: () => {} },
          { key: "twitterCardImage", setter: () => {} },
        ]

        // 追加のヒーロー画像を取得
        for (let i = 1; i <= 5; i++) {
          imagesToFetch.push({
            key: `heroImage${i}`,
            setter: (url: string) => {
              setHeroImages((prev) => {
                const newImages = [...prev]
                newImages[i - 1] = url
                return newImages
              })
            },
          })
        }

        for (const image of imagesToFetch) {
          const response = await fetch(`/api/images?section=${image.key}`)
          const data = await response.json()
          if (data.url) {
            image.setter(data.url)
          }
        }
      } catch (error) {
        console.error("Error fetching images:", error)
      }
    }

    fetchImages()

    // Load saved images from localStorage
    const imagesToLoad = [
      // { key: "heroImage", setter: setHeroImage },
      // { key: "valuePropositionImage", setter: setValuePropositionImage },
      // { key: "strengthsImage", setter: setStrengthsImage },
      // { key: "servicesImage", setter: setServicesImage },
      // { key: "houseCleaningImage", setter: setHouseCleaningImage },
      // { key: "airConCleaningImage", setter: setAirConCleaningImage },
      // { key: "handymanImage", setter: setHandymanImage },
      // { key: "seasonalPlansImage", setter: setSeasonalPlansImage },
      // { key: "springPlanImage", setter: setSpringPlanImage },
      // { key: "summerPlanImage", setter: setSummerPlanImage },
      // { key: "autumnPlanImage", setter: setAutumnPlanImage },
      // { key: "winterPlanImage", setter: setWinterPlanImage },
      // { key: "pricingOverviewImage", setter: setPricingOverviewImage },
      // { key: "reasonsImage", setter: setReasonsImage },
      // { key: "reviewsImage", setter: setReviewsImage },
      // { key: "trustSignalsImage", setter: setTrustSignalsImage },
      // { key: "promotionsImage", setter: setPromotionsImage },
      // { key: "subscriptionImage", setter: setSubscriptionImage },
      // { key: "faqImage", setter: setFaqImage },
      // { key: "urgencyOfferImage", setter: setUrgencyOfferImage },
      // { key: "contactFormImage", setter: setContactFormImage },
      // { key: "logoIcon", setter: setLogoIcon },
    ]

    imagesToLoad.forEach(({ key, setter }) => {
      const savedImage = localStorage.getItem(key)
      if (savedImage) {
        setter(savedImage)
      }
    })

    const savedReviewImages = localStorage.getItem("reviewImages")
    if (savedReviewImages) {
      setReviewImages(JSON.parse(savedReviewImages))
    }

    // ヘッダーアイコンの取得を追加
    const fetchHeaderIcon = async () => {
      try {
        const response = await fetch("/api/images?section=headerIcon")
        const data = await response.json()
        if (data.url) {
          setHeaderIcon(data.url)
        }
      } catch (error) {
        console.error("Error fetching header icon:", error)
      }
    }

    fetchHeaderIcon()

    // アナリティクス設定を取得
    async function fetchSettings() {
      try {
        const response = await fetch("/api/settings")
        const data = await response.json()
        setGoogleAnalyticsId(data.google_analytics_id || "")
        setGoogleSiteVerification(data.google_site_verification || "")
        setBingVerification(data.bing_verification || "")
      } catch (error) {
        console.error("Error fetching settings:", error)
      }
    }

    fetchSettings()
  }, [router])

  const handleImageUpload = useCallback(
    async (file: File, section: string) => {
      setIsUploading(true)
      try {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("section", section)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        if (data.success) {
          toast({
            title: "画像アップロード成功",
            description: "画像が正常にアップロードされました。",
          })

          // 画像URLのキャッシュを更新
          await refreshImages()
        } else {
          throw new Error("Image upload failed")
        }
      } catch (error) {
        console.error("Error uploading image:", error)
        toast({
          title: "エラー",
          description: "画像のアップロードに失敗しました。",
          variant: "destructive",
        })
      } finally {
        setIsUploading(false)
      }
    },
    [refreshImages, toast],
  )

  const handleSave = () => {
    // Save all image states to localStorage
    localStorage.setItem("heroImage", heroImage)
    localStorage.setItem("heroImages", JSON.stringify(heroImages))
    localStorage.setItem("valuePropositionImage", valuePropositionImage)
    localStorage.setItem("strengthsImage", strengthsImage)
    localStorage.setItem("servicesImage", servicesImage)
    localStorage.setItem("houseCleaningImage", houseCleaningImage)
    localStorage.setItem("airConCleaningImage", airConCleaningImage)
    localStorage.setItem("handymanImage", handymanImage)
    localStorage.setItem("seasonalPlansImage", seasonalPlansImage)
    localStorage.setItem("springPlanImage", springPlanImage)
    localStorage.setItem("summerPlanImage", summerPlanImage)
    localStorage.setItem("autumnPlanImage", autumnPlanImage)
    localStorage.setItem("winterPlanImage", winterPlanImage)
    localStorage.setItem("pricingOverviewImage", pricingOverviewImage)
    localStorage.setItem("reasonsImage", reasonsImage)
    localStorage.setItem("reviewsImage", reviewsImage)
    localStorage.setItem("trustSignalsImage", trustSignalsImage)
    localStorage.setItem("promotionsImage", promotionsImage)
    localStorage.setItem("subscriptionImage", subscriptionImage)
    localStorage.setItem("faqImage", faqImage)
    localStorage.setItem("urgencyOfferImage", urgencyOfferImage)
    localStorage.setItem("contactFormImage", contactFormImage)
    localStorage.setItem("logoIcon", logoIcon)
    localStorage.setItem("reviewImages", JSON.stringify(reviewImages))
    localStorage.setItem("valuePropositionBackgroundImage", valuePropositionBackgroundImage)
    localStorage.setItem("strengthsBackgroundImage", strengthsBackgroundImage)
    localStorage.setItem("servicesBackgroundImage", servicesBackgroundImage)
    localStorage.setItem("seasonalPlansBackgroundImage", seasonalPlansBackgroundImage)
    localStorage.setItem("heroBackgroundImage", heroBackgroundImage)
    localStorage.setItem("pricingOverviewBackgroundImage", pricingOverviewBackgroundImage)
    localStorage.setItem("reasonsBackgroundImage", reasonsBackgroundImage)
    localStorage.setItem("reviewsBackgroundImage", reviewsBackgroundImage)
    localStorage.setItem("trustSignalsBackgroundImage", trustSignalsBackgroundImage)
    localStorage.setItem("promotionsBackgroundImage", promotionsBackgroundImage)
    localStorage.setItem("subscriptionBackgroundImage", subscriptionBackgroundImage)
    localStorage.setItem("faqBackgroundImage", faqBackgroundImage)
    localStorage.setItem("urgencyOfferBackgroundImage", urgencyOfferBackgroundImage)
    localStorage.setItem("contactFormBackgroundImage", contactFormBackgroundImage)
    toast({
      title: "保存完了",
      description: "変更が正常に保存されました。",
    })
  }

  const handleLogout = async () => {
    try {
      await logout()
      localStorage.removeItem("isAdmin")
      router.push("/")
      toast({
        title: "ログアウト",
        description: "管理者モードを終了しました。",
      })
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "エラー",
        description: "ログアウトに失敗しました。",
        variant: "destructive",
      })
    }
  }

  const handleSaveSettings = async () => {
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          googleAnalyticsId,
          googleSiteVerification,
          bingVerification,
        }),
      })

      if (response.ok) {
        toast({
          title: "設定保存完了",
          description: "アナリティクス設定が正常に保存されました。",
        })
      } else {
        throw new Error("Failed to save settings")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "エラー",
        description: "設定の保存に失敗しました。",
        variant: "destructive",
      })
    }
  }

  // 認証されていない場合は何も表示しない
  if (!isAuthenticated()) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster />
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md overflow-y-auto">
          <div className="p-4">
            <h2 className="text-2xl font-bold text-gray-800">管理画面</h2>
          </div>
          <nav className="mt-6">
            <a href="#dashboard" className="flex items-center px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-200">
              <Home className="w-5 h-5 mr-2" />
              ダッシュボード
            </a>
            <a href="#images" className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-200">
              <Image className="w-5 h-5 mr-2" />
              画像管理
            </a>
            <a href="#content" className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-200">
              <Edit className="w-5 h-5 mr-2" />
              コンテンツ編集
            </a>
            <a href="#pricing" className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-200">
              <DollarSign className="w-5 h-5 mr-2" />
              料金設定
            </a>
            <a href="#reviews" className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-200">
              <Star className="w-5 h-5 mr-2" />
              レビュー管理
            </a>
            <a href="#promotions" className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-200">
              <Gift className="w-5 h-5 mr-2" />
              プロモーション
            </a>
            <a href="#faq" className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-200">
              <HelpCircle className="w-5 h-5 mr-2" />
              FAQ管理
            </a>
            <a href="#settings" className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-200">
              <Settings className="w-5 h-5 mr-2" />
              設定
            </a>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-3xl font-medium text-gray-700">ダッシュボード</h3>
              <Button onClick={handleLogout} variant="outline" className="z-50">
                <LogOut className="w-4 h-4 mr-2" />
                ログアウト
              </Button>
            </div>

            <div className="mt-8">
              <Tabs defaultValue="dashboard" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="dashboard">ダッシュボード</TabsTrigger>
                  <TabsTrigger value="images">画像管理</TabsTrigger>
                  <TabsTrigger value="content">コンテンツ編集</TabsTrigger>
                  <TabsTrigger value="pricing">料金設定</TabsTrigger>
                  <TabsTrigger value="reviews">レビュー管理</TabsTrigger>
                  <TabsTrigger value="promotions">プロモーション</TabsTrigger>
                  <TabsTrigger value="faq">FAQ管理</TabsTrigger>
                  <TabsTrigger value="settings">設定</TabsTrigger>
                  <TabsTrigger value="header">ヘッダー設定</TabsTrigger>
                  <TabsTrigger value="analytics">アナリティクス</TabsTrigger>
                  <TabsTrigger value="seo">SEO設定</TabsTrigger>
                  <TabsTrigger value="meta-images">メタ画像</TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard">
                  <Card>
                    <CardHeader>
                      <CardTitle>ダッシュボード</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>ここにダッシュボードの内容を表示します。</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="images">
                  <Card>
                    <CardHeader>
                      <CardTitle>画像管理</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[600px]">
                        <Tabs defaultValue="hero" className="w-full">
                          <TabsList className="mb-4 flex flex-wrap">
                            <TabsTrigger value="hero">ヒーロー画像</TabsTrigger>
                            <TabsTrigger value="services">サービス画像</TabsTrigger>
                            <TabsTrigger value="seasonal">季節別プラン</TabsTrigger>
                            <TabsTrigger value="reviews">お客様の声</TabsTrigger>
                            <TabsTrigger value="backgrounds">背景画像</TabsTrigger>
                            <TabsTrigger value="other">その他</TabsTrigger>
                            <TabsTrigger value="favicon">Favicon</TabsTrigger>
                          </TabsList>

                          <TabsContent value="hero">
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold">ヒーロー画像（カルーセル用）</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[1, 2, 3, 4, 5].map((num) => (
                                  <div key={num} className="space-y-2">
                                    <ImageUploader
                                      onImageUpload={handleImageUpload}
                                      currentImage={imageUrls[`heroImage${num}`]?.url || "/placeholder.svg"}
                                      width={300}
                                      height={200}
                                      className="rounded-lg shadow-xl"
                                      isAdmin={true}
                                      section={`heroImage${num}`}
                                      sectionName={`ヒーロー画像 ${num} (カルーセル)`}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="services">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              <ImageUploader
                                onImageUpload={handleImageUpload}
                                currentImage={imageUrls.houseCleaningCard?.url || "/placeholder.svg"}
                                width={300}
                                height={200}
                                className="rounded-lg shadow-xl mb-4"
                                isAdmin={true}
                                section="houseCleaningCard"
                                sectionName="ハウスクリーニングカード画像"
                              />
                              <ImageUploader
                                onImageUpload={handleImageUpload}
                                currentImage={imageUrls.airConCleaningCard?.url || "/placeholder.svg"}
                                width={300}
                                height={200}
                                className="rounded-lg shadow-xl mb-4"
                                isAdmin={true}
                                section="airConCleaningCard"
                                sectionName="エアコンクリーニングカード画像"
                              />
                              <ImageUploader
                                onImageUpload={handleImageUpload}
                                currentImage={imageUrls.handymanCard?.url || "/placeholder.svg"}
                                width={300}
                                height={200}
                                className="rounded-lg shadow-xl mb-4"
                                isAdmin={true}
                                section="handymanCard"
                                sectionName="便利屋サービスカード画像"
                              />
                            </div>
                          </TabsContent>

                          <TabsContent value="seasonal">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <ImageUploader
                                onImageUpload={handleImageUpload}
                                currentImage={imageUrls.springPlanImage?.url || "/placeholder.svg"}
                                width={300}
                                height={200}
                                className="rounded-lg shadow-xl mb-4"
                                isAdmin={true}
                                section="springPlanImage"
                                sectionName="春のプラン画像"
                              />
                              <ImageUploader
                                onImageUpload={handleImageUpload}
                                currentImage={imageUrls.summerPlanImage?.url || "/placeholder.svg"}
                                width={300}
                                height={200}
                                className="rounded-lg shadow-xl mb-4"
                                isAdmin={true}
                                section="summerPlanImage"
                                sectionName="夏のプラン画像"
                              />
                              <ImageUploader
                                onImageUpload={handleImageUpload}
                                currentImage={imageUrls.autumnPlanImage?.url || "/placeholder.svg"}
                                width={300}
                                height={200}
                                className="rounded-lg shadow-xl mb-4"
                                isAdmin={true}
                                section="autumnPlanImage"
                                sectionName="秋のプラン画像"
                              />
                              <ImageUploader
                                onImageUpload={handleImageUpload}
                                currentImage={imageUrls.winterPlanImage?.url || "/placeholder.svg"}
                                width={300}
                                height={200}
                                className="rounded-lg shadow-xl mb-4"
                                isAdmin={true}
                                section="winterPlanImage"
                                sectionName="冬のプラン画像"
                              />
                            </div>
                          </TabsContent>

                          <TabsContent value="reviews">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {Array(6)
                                .fill(0)
                                .map((_, index) => (
                                  <ImageUploader
                                    key={`review${index}`}
                                    onImageUpload={handleImageUpload}
                                    currentImage={imageUrls[`review${index}`]?.url || "/placeholder.svg"}
                                    width={100}
                                    height={100}
                                    className="rounded-full shadow-xl mb-4"
                                    isAdmin={true}
                                    section={`review${index}`}
                                    sectionName={`お客様の声 ${index + 1} のプロフィール画像`}
                                  />
                                ))}
                            </div>
                          </TabsContent>

                          <TabsContent value="backgrounds">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <ImageUploader
                                onImageUpload={handleImageUpload}
                                currentImage={imageUrls.heroBackgroundImage?.url || "/placeholder.svg"}
                                width={600}
                                height={400}
                                className="rounded-lg shadow-xl mb-4"
                                isAdmin={true}
                                section="heroBackgroundImage"
                                sectionName="ヒーローセクション背景画像"
                              />
                              <ImageUploader
                                onImageUpload={handleImageUpload}
                                currentImage={imageUrls.valuePropositionBackgroundImage?.url || "/placeholder.svg"}
                                width={600}
                                height={400}
                                className="rounded-lg shadow-xl mb-4"
                                isAdmin={true}
                                section="valuePropositionBackgroundImage"
                                sectionName="4つの幸せな暮らしセクション背景画像"
                              />
                              <ImageUploader
                                onImageUpload={handleImageUpload}
                                currentImage={imageUrls.strengthsBackgroundImage?.url || "/placeholder.svg"}
                                width={600}
                                height={400}
                                className="rounded-lg shadow-xl mb-4"
                                isAdmin={true}
                                section="strengthsBackgroundImage"
                                sectionName="私たちの強みセクション背景画像"
                              />
                              <ImageUploader
                                onImageUpload={handleImageUpload}
                                currentImage={imageUrls.servicesBackgroundImage?.url || "/placeholder.svg"}
                                width={600}
                                height={400}
                                className="rounded-lg shadow-xl mb-4"
                                isAdmin={true}
                                section="servicesBackgroundImage"
                                sectionName="サービス内容セクション背景画像"
                              />
                              <ImageUploader
                                onImageUpload={handleImageUpload}
                                currentImage={imageUrls.seasonalPlansBackgroundImage?.url || "/placeholder.svg"}
                                width={600}
                                height={400}
                                className="rounded-lg shadow-xl mb-4"
                                isAdmin={true}
                                section="seasonalPlansBackgroundImage"
                                sectionName="季節別おすすめプランセクション背景画像"
                              />
                              <ImageUploader
                                onImageUpload={handleImageUpload}
                                currentImage={imageUrls.pricingOverviewBackgroundImage?.url || "/placeholder.svg"}
                                width={600}
                                height={400}
                                className="rounded-lg shadow-xl mb-4"
                                isAdmin={true}
                                section="pricingOverviewBackgroundImage"
                                sectionName="料金体系セクション背景画像"
                              />
                              <ImageUploader
                                onImageUpload={handleImageUpload}
                                currentImage={imageUrls.reasonsBackgroundImage?.url || "/placeholder.svg"}
                                width={600}
                                height={400}
                                className="rounded-lg shadow-xl mb-4"
                                isAdmin={true}
                                section="reasonsBackgroundImage"
                                sectionName="選ばれる理由セクション背景画像"
                              />
                              <ImageUploader
                                onImageUpload={handleImageUpload}
                                currentImage={imageUrls.reviewsBackgroundImage?.url || "/placeholder.svg"}
                                width={600}
                                height={400}
                                className="rounded-lg shadow-xl mb-4"
                                isAdmin={true}
                                section="reviewsBackgroundImage"
                                sectionName="お客様の声セクション背景画像"
                              />
                              <ImageUploader
                                onImageUpload={handleImageUpload}
                                currentImage={imageUrls.trustSignalsBackgroundImage?.url || "/placeholder.svg"}
                                width={600}
                                height={400}
                                className="rounded-lg shadow-xl mb-4"
                                isAdmin={true}
                                section="trustSignalsBackgroundImage"
                                sectionName="実績と信頼セクション背景画像"
                              />
                              <ImageUploader
                                onImageUpload={handleImageUpload}
                                currentImage={imageUrls.promotionsBackgroundImage?.url || "/placeholder.svg"}
                                width={600}
                                height={400}
                                className="rounded-lg shadow-xl mb-4"
                                isAdmin={true}
                                section="promotionsBackgroundImage"
                                sectionName="お得な特典セクション背景画像"
                              />
                              <ImageUploader
                                onImageUpload={handleImageUpload}
                                currentImage={imageUrls.subscriptionBackgroundImage?.url || "/placeholder.svg"}
                                width={600}
                                height={400}
                                className="rounded-lg shadow-xl mb-4"
                                isAdmin={true}
                                section="subscriptionBackgroundImage"
                                sectionName="サブスクリプションセクション背景画像"
                              />
                              <ImageUploader
                                onImageUpload={handleImageUpload}
                                currentImage={imageUrls.faqBackgroundImage?.url || "/placeholder.svg"}
                                width={600}
                                height={400}
                                className="rounded-lg shadow-xl mb-4"
                                isAdmin={true}
                                section="faqBackgroundImage"
                                sectionName="よくある質問セクション背景画像"
                              />
                              <ImageUploader
                                onImageUpload={handleImageUpload}
                                currentImage={imageUrls.urgencyOfferBackgroundImage?.url || "/placeholder.svg"}
                                width={600}
                                height={400}
                                className="rounded-lg shadow-xl mb-4"
                                isAdmin={true}
                                section="urgencyOfferBackgroundImage"
                                sectionName="期間限定特別オファーセクション背景画像"
                              />
                              <ImageUploader
                                onImageUpload={handleImageUpload}
                                currentImage={imageUrls.contactFormBackgroundImage?.url || "/placeholder.svg"}
                                width={600}
                                height={400}
                                className="rounded-lg shadow-xl mb-4"
                                isAdmin={true}
                                section="contactFormBackgroundImage"
                                sectionName="お問い合わせフォームセクション背景画像"
                              />
                            </div>
                          </TabsContent>

                          <TabsContent value="other">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <ImageUploader
                                onImageUpload={handleImageUpload}
                                currentImage={imageUrls.logoIcon?.url || "/placeholder.svg"}
                                width={100}
                                height={100}
                                className="rounded-lg shadow-xl mb-4"
                                isAdmin={true}
                                section="logoIcon"
                                sectionName="ロゴアイコン"
                              />
                              <ImageUploader
                                onImageUpload={handleImageUpload}
                                currentImage={imageUrls.headerIcon?.url || "/placeholder.svg"}
                                width={100}
                                height={100}
                                className="rounded-lg shadow-xl mb-4"
                                isAdmin={true}
                                section="headerIcon"
                                sectionName="ヘッダーアイコン"
                              />
                              <ImageUploader
                                onImageUpload={handleImageUpload}
                                currentImage={imageUrls.urgencyOfferImage?.url || "/placeholder.svg"}
                                width={600}
                                height={400}
                                className="rounded-lg shadow-xl mb-4"
                                isAdmin={true}
                                section="urgencyOfferImage"
                                sectionName="期間限定特別オファー画像"
                              />
                            </div>
                          </TabsContent>

                          <TabsContent value="favicon">
                            <ImageUploader
                              onImageUpload={handleImageUpload}
                              currentImage={imageUrls.faviconIcon?.url || "/favicon.ico"}
                              width={32}
                              height={32}
                              className="rounded-lg shadow-xl mb-4"
                              isAdmin={true}
                              section="faviconIcon"
                              sectionName="ファビコン（ブラウザタブに表示されるアイコン）"
                              acceptedFileTypes=".ico"
                            />
                          </TabsContent>
                        </Tabs>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="content">
                  <Card>
                    <CardHeader>
                      <CardTitle>コンテンツ編集</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[600px]">
                        <Tabs defaultValue="services" className="w-full">
                          <TabsList className="mb-4">
                            <TabsTrigger value="services">サービス内容</TabsTrigger>
                            <TabsTrigger value="valueProposition">4つの幸せな暮らし</TabsTrigger>
                            <TabsTrigger value="strengths">私たちの強み</TabsTrigger>
                            <TabsTrigger value="seasonalPlans">季節別おすすめプラン</TabsTrigger>
                            <TabsTrigger value="reviews">お客様の声</TabsTrigger>
                          </TabsList>

                          <TabsContent value="services">
                            <ServiceContentEditor initialServices={initialServices} />
                          </TabsContent>

                          <TabsContent value="valueProposition">
                            <ValuePropositionEditor />
                          </TabsContent>

                          <TabsContent value="strengths">
                            <StrengthsEditor />
                          </TabsContent>

                          <TabsContent value="seasonalPlans">
                            <SeasonalPlansEditor />
                          </TabsContent>

                          <TabsContent value="reviews">
                            <ReviewsEditor />
                          </TabsContent>
                        </Tabs>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="pricing">
                  <Card>
                    <CardHeader>
                      <CardTitle>料金設定</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="pricing-overview">
                        <TabsList>
                          <TabsTrigger value="pricing-overview">料金概要</TabsTrigger>
                          <TabsTrigger value="subscription">サブスクリプション</TabsTrigger>
                        </TabsList>
                        <TabsContent value="pricing-overview">
                          <PricingOverviewEditor />
                        </TabsContent>
                        <TabsContent value="subscription">
                          <SubscriptionEditor />
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews">
                  <Card>
                    <CardHeader>
                      <CardTitle>レビュー管理</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ReviewsEditor />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="promotions">
                  <Card>
                    <CardHeader>
                      <CardTitle>プロモーション</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PromotionsEditor />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="faq">
                  <Card>
                    <CardHeader>
                      <CardTitle>FAQ管理</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FAQEditor />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle>設定</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SettingsEditor />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="header">
                  <Card>
                    <CardHeader>
                      <CardTitle>ヘッダー設定</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <h3 className="text-lg font-semibold mb-2">ヘッダーアイコン</h3>
                      <ImageUploader
                        onImageUpload={handleImageUpload}
                        currentImage={headerIcon}
                        width={100}
                        height={100}
                        className="rounded-lg shadow-xl mb-4"
                        isAdmin={true}
                        section="headerIcon"
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="analytics">
                  <Card>
                    <CardHeader>
                      <CardTitle>アナリティクス設定</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                          <Input
                            id="googleAnalyticsId"
                            value={googleAnalyticsId}
                            onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                            placeholder="G-XXXXXXXXXX"
                          />
                        </div>
                        <div>
                          <Label htmlFor="googleSiteVerification">Google Site Verification</Label>
                          <Input
                            id="googleSiteVerification"
                            value={googleSiteVerification}
                            onChange={(e) => setGoogleSiteVerification(e.target.value)}
                            placeholder="Google Search Console verification code"
                          />
                        </div>
                        <div>
                          <Label htmlFor="bingVerification">Bing Verification</Label>
                          <Input
                            id="bingVerification"
                            value={bingVerification}
                            onChange={(e) => setBingVerification(e.target.value)}
                            placeholder="Bing Webmaster Tools verification code"
                          />
                        </div>
                        <Button onClick={handleSaveSettings}>設定を保存</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="seo">
                  <Card>
                    <CardHeader>
                      <CardTitle>SEO設定</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SEOSettingsEditor />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="meta-images">
                  <Card>
                    <CardHeader>
                      <CardTitle>メタ画像管理</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">OGP画像</h3>
                          <ImageUploader
                            onImageUpload={handleImageUpload}
                            currentImage={imageUrls.ogImage?.url || "/placeholder.svg"}
                            width={1200}
                            height={630}
                            className="rounded-lg shadow-xl mb-4"
                            isAdmin={true}
                            section="ogImage"
                            sectionName="OGP画像"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Twitter Card画像</h3>
                          <ImageUploader
                            onImageUpload={handleImageUpload}
                            currentImage={imageUrls.twitterCardImage?.url || "/placeholder.svg"}
                            width={1200}
                            height={600}
                            className="rounded-lg shadow-xl mb-4"
                            isAdmin={true}
                            section="twitterCardImage"
                            sectionName="Twitter Card画像"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="mt-8">
              <Button onClick={handleSave}>変更を保存</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
