"use client"

import { Facebook, Instagram, Twitter } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type React from "react"

export default function Footer() {
  const router = useRouter()

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    } else {
      router.push(`/#${id}`)
    }
  }

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-4">クリーンコンフォート千葉</h3>
            <p className="mb-4">あなたの暮らしに、さわやかな快適を</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary" aria-label="Facebook">
                <Facebook />
              </a>
              <a href="#" className="hover:text-primary" aria-label="Instagram">
                <Instagram />
              </a>
              <a href="#" className="hover:text-primary" aria-label="Twitter">
                <Twitter />
              </a>
            </div>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-4">リンク</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-primary" onClick={scrollToTop}>
                  ホーム
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-primary" onClick={(e) => handleScroll(e, "services")}>
                  サービス
                </a>
              </li>
              <li>
                <a
                  href="#pricing-overview"
                  className="hover:text-primary"
                  onClick={(e) => handleScroll(e, "pricing-overview")}
                >
                  料金
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-primary" onClick={(e) => handleScroll(e, "faq")}>
                  よくある質問
                </a>
              </li>
              <li>
                <a href="#contact-form" className="hover:text-primary" onClick={(e) => handleScroll(e, "contact-form")}>
                  お問い合わせ
                </a>
              </li>
              <li>
                <Link href="/company" className="hover:text-primary">
                  会社概要
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-primary">
                  プライバシーポリシー
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h4 className="text-lg font-semibold mb-4">お問い合わせ</h4>
            <p>〒298-0135</p>
            <p>千葉県いすみ市作田556</p>
            <p>
              電話:{" "}
              <a href="tel:090-3888-4717" className="hover:text-primary">
                090-3888-4717
              </a>
            </p>
            <p className="text-sm">（代表者直通）</p>
            <p className="text-sm mt-2">
              繋がらない場合は<br />
              JI-TECH<br />
              <a href="tel:0475-36-3257" className="underline hover:text-primary">
                0475-36-3257
              </a></p>
            <p className="text-sm">
            和煌<br />
              <a href="tel:090-2306-4702" className="underline hover:text-primary">
                （担当：和田）090-2306-4702
              </a><br />
              <a href="tel:080-6505-0685" className="underline hover:text-primary">
                （担当：山本）080-6505-0685
              </a>
            </p>
            <p className="text-sm">
            菅和<br />
              <a href="tel:090-4413-6307" className="underline hover:text-primary">
                （担当：土屋）090-4413-6307
              </a>
            </p>
            <p>メール: info@cleancomfort-chiba.com</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p>&copy; 2025 クリーンコンフォート千葉. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
