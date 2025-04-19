import type React from "react"
import Link from "next/link"

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-primary">
            クリーンコンフォート千葉
          </Link>
          <div className="hidden md:flex space-x-4">
            <Link href="#services" className="hover:text-primary">
              サービス
            </Link>
            <Link href="#pricing" className="hover:text-primary">
              料金
            </Link>
            <Link href="#faq" className="hover:text-primary">
              よくある質問
            </Link>
            <Link href="#contact" className="hover:text-primary">
              お問い合わせ
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
