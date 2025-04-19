"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Phone, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useImageUrls } from "../hooks/useImageUrls"
import ImageWithFallback from "./ImageWithFallback"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { imageUrls, refreshImages } = useImageUrls()
  const headerIconUrl = imageUrls.headerIcon?.url || "/placeholder.svg"
  const headerIconFallbackUrl = imageUrls.headerIcon?.fallbackUrl || "/placeholder.svg"
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    refreshImages()
  }, [refreshImages])

  const scrollToSection = (id: string) => {
    trackEvent(AnalyticsEvents.BUTTON_CLICK, {
      button_name: `header_nav_${id}`,
      section: "header",
    })

    if (pathname !== "/") {
      router.push(`/#${id}`)
    } else {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
    setIsMenuOpen(false)
  }

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 
        transition-all duration-300 
        ${isScrolled ? "bg-white shadow-md" : "bg-white bg-opacity-90"}
      `}
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          {/* ロゴ部分 */}
          <Link
            href="/"
            className="flex items-center"
            onClick={() => trackEvent(AnalyticsEvents.LINK_CLICK, { link_name: "logo" })}
          >
            <ImageWithFallback
              src={headerIconUrl || "/placeholder.svg"}
              fallbackSrc={headerIconFallbackUrl}
              alt="クリーンコンフォート千葉"
              width={40}
              height={40}
              className="mr-2"
              key={headerIconUrl}
            />
            <span className={`text-lg md:text-xl font-bold text-gray-800 drop-shadow-md`}>
              クリーンコンフォート千葉
            </span>
          </Link>

          {/* ハンバーガーメニューボタン（モバイル用） */}
          <button
            className="md:hidden"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen)
              trackEvent(AnalyticsEvents.BUTTON_CLICK, {
                button_name: isMenuOpen ? "close_mobile_menu" : "open_mobile_menu",
              })
            }}
            aria-label="メニューを開く"
          >
            {isMenuOpen ? <X className="h-6 w-6 text-gray-800" /> : <Menu className="h-6 w-6 text-gray-800" />}
          </button>

          {/* メインナビゲーション（デスクトップ用） */}
          <nav className="hidden md:flex items-center space-x-4">
            {[
              { id: "services", label: "サービス" },
              { id: "pricing-overview", label: "料金" },
              { id: "promotions", label: "キャンペーン" },
              { id: "faq", label: "よくある質問" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`
                  text-sm font-medium
                  text-gray-800 hover:text-white hover:bg-primary
                  transition-colors duration-200 ease-in-out
                  px-2 py-1 rounded-md drop-shadow-md
                `}
              >
                {item.label}
              </button>
            ))}
            <Button
              onClick={() => scrollToSection("contact-form")}
              variant={isScrolled ? "default" : "secondary"}
              className="text-sm font-medium drop-shadow-md"
            >
              お問い合わせ
            </Button>
          </nav>

          {/* 電話番号（デスクトップ用） */}
          <div className="hidden md:block text-right">
            <a
              href="tel:090-3888-4717"
              className={`text-xl font-bold flex items-center text-gray-800 hover:text-primary transition-colors drop-shadow-md`}
              onClick={() => trackEvent(AnalyticsEvents.BUTTON_CLICK, { button_name: "header_phone_call" })}
            >
              <Phone className="h-5 w-5 mr-1" />
              090-3888-4717
            </a>
            <p className="text-xs text-gray-600 drop-shadow-md">受付時間 9:00~21:00</p>
            <button
              onClick={() => scrollToSection("contact-form")}
              className="text-xs text-primary hover:text-primary-dark underline transition-colors drop-shadow-md"
            >
              繋がらない場合はこちら
            </button>
          </div>
        </div>

        {/* モバイルメニュー */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4">
            {[
              { id: "services", label: "サービス" },
              { id: "pricing-overview", label: "料金" },
              { id: "promotions", label: "キャンペーン" },
              { id: "faq", label: "よくある質問" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left py-2 px-4 text-gray-800 hover:bg-gray-200"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => scrollToSection("contact-form")}
              className="block w-full text-left py-2 px-4 text-gray-800 hover:bg-gray-200"
            >
              お問い合わせ
            </button>
            <a
              href="tel:090-3888-4717"
              className="block w-full text-left py-2 px-4 text-gray-800 hover:bg-gray-200"
              onClick={() => trackEvent(AnalyticsEvents.BUTTON_CLICK, { button_name: "mobile_phone_call" })}
            >
              <Phone className="inline-block h-4 w-4 mr-2" />
              090-3888-4717
            </a>
          </nav>
        )}
      </div>
    </header>
  )
}
