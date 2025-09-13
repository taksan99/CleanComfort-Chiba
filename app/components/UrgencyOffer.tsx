"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import AnimatedSection from "./AnimatedSection"
import { useImageUrls } from "@/app/hooks/useImageUrls"
import ErrorMessage from "./ErrorMessage"
import type React from "react"

const ShiningText = ({ text }: { text: string }) => (
  <span className="inline-block text-5xl font-extrabold shine-effect">{text}</span>
)

const SpecialOfferButton = ({ children }: { children: React.ReactNode }) => (
  <div className="relative inline-block">
    <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
      <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-32 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
    </div>
    <div className="absolute bottom-0 left-0 w-16 h-16 overflow-hidden">
      <div className="absolute bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-32 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
    </div>
    {children}
  </div>
)

const scrollToContact = () => {
  const contactSection = document.getElementById("contact-form")
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: "smooth" })
  }
}

const COUNTDOWN_DURATION = 72 * 60 * 60 // 72 hours in seconds

interface UrgencyOfferContent {
  title: string
  offerText: string
  buttonText: string
  extendedMessage: string
}

const defaultContent: UrgencyOfferContent = {
  title: "期間限定特別オファー",
  offerText: "今すぐお申し込みの方、先着50名様に\nエアコンクリーニング10%OFF",
  buttonText: "特別オファーを受け取る",
  extendedMessage: "好評につき、特別オファーの期間を延長しました！",
}

export default function UrgencyOffer() {
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_DURATION)
  const [isExtended, setIsExtended] = useState(false)
  const [content, setContent] = useState<UrgencyOfferContent>(defaultContent)
  const { imageUrls, isLoading, error } = useImageUrls()

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch("/api/content?section=urgencyOffer")
        if (response.ok) {
          const data = await response.json()
          if (data.content) {
            setContent(data.content)
          }
        }
      } catch (error) {
        console.error("Error fetching urgency offer content:", error)
        // フォールバック: localStorageから取得
        const savedContent = localStorage.getItem("urgencyOfferContent")
        if (savedContent) {
          setContent(JSON.parse(savedContent))
        }
      }
    }
    fetchContent()
  }, [])

  useEffect(() => {
    const storedEndTime = localStorage.getItem("countdownEndTime")
    const now = Math.floor(Date.now() / 1000)

    if (storedEndTime) {
      const endTime = Number.parseInt(storedEndTime, 10)
      if (endTime > now) {
        setTimeLeft(endTime - now)
      } else {
        // カウントダウンが終了している場合、新しいカウントダウンを開始
        const newEndTime = now + COUNTDOWN_DURATION
        localStorage.setItem("countdownEndTime", newEndTime.toString())
        setTimeLeft(COUNTDOWN_DURATION)
        setIsExtended(true)
      }
    } else {
      // 初回訪問時
      const endTime = now + COUNTDOWN_DURATION
      localStorage.setItem("countdownEndTime", endTime.toString())
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          // カウントダウンが終了したら、新しいカウントダウンを開始
          const newEndTime = Math.floor(Date.now() / 1000) + COUNTDOWN_DURATION
          localStorage.setItem("countdownEndTime", newEndTime.toString())
          setIsExtended(true)
          return COUNTDOWN_DURATION
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = time % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <ErrorMessage message="緊急オファーの背景画像の読み込み中にエラーが発生しました" />
  }

  const imageUrl = imageUrls?.urgencyOfferBackgroundImage?.url

  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat py-16"
      style={{
        backgroundImage: `url(${imageUrl || "/placeholder.svg"})`,
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="container mx-auto px-4 text-center">
        <div className="bg-white bg-opacity-75 p-8 rounded-lg shadow-lg inline-block">
          <h2 className="text-4xl font-bold mb-6 bg-white bg-opacity-75 p-4 rounded-lg shadow-lg inline-block">
            <ShiningText text={content.title} />
          </h2>
          <style jsx global>{`
            @keyframes shine {
              0% {
                background-position: 0% 50%;
              }
              50% {
                background-position: 100% 50%;
              }
              100% {
                background-position: 0% 50%;
              }
            }
            .shine-effect {
              background: linear-gradient(to right, #ff6b6b, #feca57, #48dbfb, #ff9ff3);
              background-size: 300% 300%;
              animation: shine 4s ease-in-out infinite;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              color: transparent;
            }
          `}</style>
          <AnimatedSection>
            {isExtended && <p className="text-lg font-semibold text-green-600 mb-4">{content.extendedMessage}</p>}
            <div className="flex items-center justify-center mb-6">
              <Clock className="h-8 w-8 text-red-500 mr-2" />
              <p className="text-xl font-semibold">
                残り時間: <span className="text-red-500">{formatTime(timeLeft)}</span>
              </p>
            </div>
            <p className="text-lg mb-6">
              {content.offerText.split("\n").map((line, index) => (
                <span key={index}>
                  {line}
                  {index < content.offerText.split("\n").length - 1 && <br />}
                </span>
              ))}
            </p>
            <SpecialOfferButton>
              <Button
                size="lg"
                className="text-lg px-8 py-4 bg-red-600 hover:bg-red-700 text-white"
                onClick={scrollToContact}
              >
                {content.buttonText}
              </Button>
            </SpecialOfferButton>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
