import type React from "react"
import Image from "next/image"

const HeroSection: React.FC = () => {
  return (
    <section className="relative h-screen flex items-center">
      <Image
        src="/placeholder.svg?height=1080&width=1920"
        alt="クリーンコンフォート千葉のヒーロー画像"
        layout="fill"
        objectFit="cover"
        quality={100}
      />
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="container mx-auto px-6 relative z-10 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">プロの技術であなたの家を快適空間に</h1>
        <p className="text-xl md:text-2xl mb-8">24時間以内に対応。エアコンクリーニングからハウスクリーニングまで。</p>
        <button className="bg-accent hover:bg-accent-dark text-primary font-bold py-2 px-4 rounded">
          お問い合わせ
        </button>
      </div>
    </section>
  )
}

export default HeroSection
