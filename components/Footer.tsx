import type React from "react"
import Link from "next/link"

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-2">クリーンコンフォート千葉</h3>
            <p>プロの技術であなたの家を快適空間に</p>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-2">クイックリンク</h4>
            <ul>
              <li>
                <Link href="#services" className="hover:text-accent">
                  サービス
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-accent">
                  料金
                </Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-accent">
                  よくある質問
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-accent">
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-2">お問い合わせ</h4>
            <p>電話: 043-XXX-XXXX</p>
            <p>メール: info@cleancomfort-chiba.com</p>
            <p>住所: 千葉県千葉市中央区XX-XX</p>
          </div>
          <div className="w-full md:w-1/4">
            <h4 className="text-lg font-semibold mb-2">フォローする</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-accent">
                Facebook
              </a>
              <a href="#" className="hover:text-accent">
                Twitter
              </a>
              <a href="#" className="hover:text-accent">
                Instagram
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p>&copy; 2023 クリーンコンフォート千葉. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
