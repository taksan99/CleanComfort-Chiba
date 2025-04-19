"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Shield, Phone } from "lucide-react"
import AnimatedSection from "./AnimatedSection"
import { z } from "zod"
import { useImageUrls } from "../hooks/useImageUrls"
import type React from "react"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

const ngWords = [
  "http://",
  "https://",
  "htt",
  "ttp",
  "tp:",
  "p:/",
  "://",
  "www.",
  "w.",
  "com",
  "net",
  "org",
  "info",
  "biz",
  "co.jp",
  "casino",
  "gambling",
  "porn",
  "sex",
  "viagra",
  "cialis",
  "xxx",
  "adult",
  "loan",
  "credit",
  "mortgage",
  "debt",
  "payday",
  "weight loss",
  "diet pill",
  "slim",
  "burn fat",
  "earn money",
  "make money",
  "work from home",
  "income",
  "lottery",
  "winner",
  "prize",
  "congratulations",
  "bitcoin",
  "crypto",
  "investment",
  "stock market",
  "luxury",
  "replica",
  "brand",
  "discount",
  "free",
  "cheap",
  "sale",
  "discount",
  "offer",
  "limited time",
  "click here",
  "subscribe now",
  "buy now",
  "order now",
  "urgent",
  "important",
  "action required",
  "verify your account",
  "password",
  "login",
  "account",
  "bank",
  "viagra",
  "cialis",
  "levitra",
  "pharmacy",
  "dating",
  "single",
  "meet",
  "chat",
  "vpn",
  "proxy",
  "anonymous",
  "hide ip",
]

const formSchema = z.object({
  name: z.string().min(1, "名前は必須です").max(20, "名前は20文字以内で入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  phone: z.string().regex(/^[0-9-]{10,}$/, "有効な電話番号を入力してください"),
  subject: z.string().min(1, "件名は必須です").max(50, "件名は50文字以内で入力してください"),
  service: z.string().min(1, "サービスは必須です"),
  message: z
    .string()
    .min(1, "メッセージは必須です")
    .max(1000, "メッセージは1000文字以内で入力してください")
    .refine((value) => !ngWords.some((word) => value.toLowerCase().includes(word.toLowerCase())), {
      message: "メッセージに不適切な単語やURLが含まれています",
    }),
  honeypot: z.string().max(0, "スパム防止チェックに引っかかりました"),
})

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    service: "",
    message: "",
    honeypot: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [characterCount, setCharacterCount] = useState(0)
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const { imageUrls, isLoading, error } = useImageUrls()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    setCharacterCount(formData.message.length)
  }, [formData.message])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setIsSubmitting(true)

    try {
      formSchema.parse(formData)

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "サーバーエラーが発生しました")
      }

      // Google Analyticsにフォーム送信イベントを記録
      trackEvent(AnalyticsEvents.CONTACT_FORM_SUBMIT, {
        service_type: formData.service,
        form_name: "contact_form",
      })

      router.push("/thank-you")
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.flatten().fieldErrors)
      } else {
        setErrorMessage(error instanceof Error ? error.message : "メッセージの送信に失敗しました")
        setIsErrorDialogOpen(true)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))

    // リアルタイムバリデーション
    try {
      formSchema.pick({ [id]: true }).parse({ [id]: value })
      setErrors((prev) => ({ ...prev, [id]: "" }))
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [id]: error.errors[0].message }))
      }
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    console.error("Error loading contact form image:", error)
  }

  const imageUrl = imageUrls.contactFormBackgroundImage?.url

  return (
    <section
      id="contact-form"
      className="relative bg-cover bg-center bg-no-repeat py-16"
      style={{
        backgroundImage: `url(${imageUrl || "/placeholder.svg"})`,
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <Toaster />
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">無料見積もり依頼</h2>
          <div className="text-center mb-4">
            <p className="text-lg text-gray-700">お急ぎの方は、お電話でも受け付けております。</p>
          </div>
          <div className="text-center mb-8">
            <a
              href="tel:090-3888-4717"
              className="inline-flex items-center justify-center font-bold text-3xl text-blue-600 hover:text-blue-700 transition-colors duration-300"
              onClick={() => trackEvent(AnalyticsEvents.BUTTON_CLICK, { button_name: "phone_call" })}
            >
              <Phone className="h-8 w-8 mr-2" />
              090-3888-4717
            </a>
            <p className="text-sm text-gray-600 mt-2">（受付時間: 9:00~21:00）</p>
            <p className="text-sm text-gray-600">代表者直通</p>
            <p className="text-sm text-gray-600 mt-2">
              繋がらない場合は
              <a
                href="tel:0475-36-3257"
                className="underline hover:text-blue-600"
                onClick={() => trackEvent(AnalyticsEvents.BUTTON_CLICK, { button_name: "alternative_phone_call_1" })}
              >
                JI-TECH 0475-36-3257
              </a>
              または
            </p>
            <p className="text-sm text-gray-600">
              菅和（担当：土屋）
              <a
                href="tel:090-4413-6307"
                className="underline hover:text-blue-600"
                onClick={() => trackEvent(AnalyticsEvents.BUTTON_CLICK, { button_name: "alternative_phone_call_2" })}
              >
                090-4413-6307
              </a>
            </p>
            <p className="text-sm text-gray-600">
              和煌（担当：和田）
              <a
                href="tel:090-2306-4702"
                className="underline hover:text-blue-600"
                onClick={() => trackEvent(AnalyticsEvents.BUTTON_CLICK, { button_name: "alternative_phone_call_3" })}
              >
                090-2306-4702
              </a>
            </p>
          </div>
          <AnimatedSection>
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2 font-medium text-gray-700">
                  お名前 (必須)
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="山田 太郎"
                  required
                  className="w-full bg-white bg-opacity-90"
                  maxLength={20}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 font-medium text-gray-700">
                  メールアドレス (必須)
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@example.com"
                  required
                  className="w-full bg-white bg-opacity-90"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block mb-2 font-medium text-gray-700">
                  電話番号 (必須)
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="090-1234-5678"
                  required
                  className="w-full bg-white bg-opacity-90"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label htmlFor="subject" className="block mb-2 font-medium text-gray-700">
                  件名 (必須)
                </label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="お問い合わせ内容の要約"
                  required
                  className="w-full bg-white bg-opacity-90"
                  maxLength={50}
                />
                {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
              </div>
              <div>
                <label htmlFor="service" className="block mb-2 font-medium text-gray-700">
                  ご希望のサービス (必須)
                </label>
                <Input
                  id="service"
                  value={formData.service}
                  onChange={handleChange}
                  placeholder="エアコンクリーニング、水回り掃除など"
                  required
                  className="w-full bg-white bg-opacity-90"
                />
                {errors.service && <p className="text-red-500 text-sm mt-1">{errors.service}</p>}
              </div>
              <div>
                <label htmlFor="message" className="block mb-2 font-medium text-gray-700">
                  ご要望・ご質問 (必須)
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="できるだけ詳細にお書きください。URLの入力はご遠慮ください。"
                  rows={5}
                  className="w-full bg-white bg-opacity-90"
                  maxLength={1000}
                  required
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                <p className="text-sm text-gray-500 mt-1">{characterCount}/1000文字 (URLを含めることはできません)</p>
              </div>
              <input
                type="text"
                id="honeypot"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
              />
              <Button
                type="submit"
                className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting}
                onClick={() => trackEvent(AnalyticsEvents.BUTTON_CLICK, { button_name: "submit_inquiry" })}
              >
                {isSubmitting ? "送信中..." : "無料見積もりを依頼する"}
              </Button>
            </form>
          </AnimatedSection>
          <div className="mt-8 text-center flex items-center justify-center text-gray-700">
            <Shield className="h-5 w-5 mr-2" />
            <p>安心保証付き！　見積もり後のキャンセルも可能です</p>
          </div>
        </div>
      </div>
      <Dialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>エラー</DialogTitle>
            <DialogDescription>{errorMessage}</DialogDescription>
          </DialogHeader>
          <DialogClose asChild>
            <Button variant="outline">閉じる</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </section>
  )
}
