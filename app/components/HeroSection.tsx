"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { useImageUrls } from "@/app/hooks/useImageUrls"
import Image from "next/image"
import ErrorMessage from "./ErrorMessage"
import { useRouter } from "next/navigation"
import { trackEvent, AnalyticsEvents } from "@/lib/analytics"

const ShiningText = ({ text }: { text: string }) => (
  <span className="inline-block text-white font-extrabold text-shadow-lg">{text}</span>
)

export default function HeroSection() {
  const { imageUrls, isLoading, error } = useImageUrls()
  const router = useRouter()
  const [heroImages, setHeroImages] = useState<string[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [nextSlide, setNextSlide] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const images: string[] = []
    for (let i = 1; i <= 5; i++) {
      if (imageUrls[`heroImage${i}`]?.url) {
        images.push(imageUrls[`heroImage${i}`].url)
      }
    }
    if (images.length > 0) {
      setHeroImages(images)
    }
  }, [imageUrls])

  useEffect(() => {
    if (heroImages.length > 1) {
      const intervalId = setInterval(() => {
        setIsTransitioning(true)
        setTimeout(() => {
          setCurrentSlide((prev) => (prev + 1) % heroImages.length)
          setNextSlide((prev) => (prev + 1) % heroImages.length)
          setIsTransitioning(false)
        }, 1000) // トランジション時間
      }, 5000) // 5秒ごとに切り替え

      return () => clearInterval(intervalId)
    }
  }, [heroImages.length])

  const scrollToContact = useCallback(() => {
    trackEvent(AnalyticsEvents.BUTTON_CLICK, {
      button_name: "hero_contact_button",
      section: "hero",
    })

    const contactSection = document.getElementById("contact-form")
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  const scrollToPromotions = useCallback(() => {
    trackEvent(AnalyticsEvents.BUTTON_CLICK, {
      button_name: "hero_promotions_button",
      section: "hero",
    })

    const promotionsSection = document.getElementById("promotions")
    if (promotionsSection) {
      promotionsSection.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <ErrorMessage message={error.message} />
  }

  return (
    <section className="relative min-h-screen overflow-hidden pt-16 md:pt-0">
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
            index === currentSlide
              ? isTransitioning
                ? "opacity-0"
                : "opacity-100"
              : index === nextSlide
                ? isTransitioning
                  ? "opacity-100"
                  : "opacity-0"
                : "opacity-0"
          }`}
        >
          <Image
            src={image || "/placeholder.svg"}
            alt={`クリーンコンフォート千葉 スライド ${index + 1}`}
            fill
            sizes="100vw"
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            quality={75}
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzIyMjIyMiIvPjwvc3ZnPg=="
            style={{ objectFit: "cover" }}
            className="transition-opacity duration-1000"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-black opacity-50" />

      <div className="relative z-10 container mx-auto px-4 h-screen flex flex-col justify-center">
        <div className="flex flex-col md:flex-row items-center mt-16 md:mt-0">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 hero-text text-white">
              <ShiningText text="家族の笑顔が増える" />
              <br />
              <ShiningText text="心地よい我が家へ" />
            </h1>
            <p className="text-xl mb-6 text-white text-shadow-sm">
              忙しい毎日でも、清潔で快適な住まいを。
              <br />
              プロの技で、あなたの大切な時間を取り戻します。
            </p>
            <div className="flex flex-col space-y-4 md:w-3/4">
              <Button
                size="lg"
                className="text-lg px-8 py-4 w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800"
                onClick={scrollToPromotions}
              >
                期間限定キャンペーン実施中！
              </Button>
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4 w-full" onClick={scrollToContact}>
                今すぐ無料見積もりを依頼する
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 relative h-[300px] md:h-[400px] w-full">
            {heroImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide
                    ? isTransitioning
                      ? "opacity-0"
                      : "opacity-100"
                    : index === nextSlide
                      ? isTransitioning
                        ? "opacity-100"
                        : "opacity-0"
                      : "opacity-0"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`クリーンコンフォート千葉 スライド ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                  quality={75}
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzIyMjIyMiIvPjwvc3ZnPg=="
                  style={{ objectFit: "cover" }}
                  className="rounded-lg shadow-xl"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${index === currentSlide ? "bg-white" : "bg-white bg-opacity-50"}`}
            onClick={() => {
              trackEvent(AnalyticsEvents.BUTTON_CLICK, {
                button_name: "hero_slide_indicator",
                slide_number: index.toString(),
              })

              setIsTransitioning(true)
              setTimeout(() => {
                setCurrentSlide(index)
                setNextSlide((index + 1) % heroImages.length)
                setIsTransitioning(false)
              }, 1000)
            }}
          />
        ))}
      </div>
    </section>
  )
}
