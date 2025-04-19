import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useImageUrls } from "../hooks/useImageUrls"
import ImageWithFallback from "./ImageWithFallback"

export default function SimpleHeader() {
  const { imageUrls } = useImageUrls()
  const headerIconUrl = imageUrls.headerIcon?.url || "/placeholder.svg"
  const headerIconFallbackUrl = imageUrls.headerIcon?.fallbackUrl || "/placeholder.svg"

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <ImageWithFallback
              src={headerIconUrl || "/placeholder.svg"}
              fallbackSrc={headerIconFallbackUrl}
              alt="クリーンコンフォート千葉"
              width={40}
              height={40}
              className="mr-2"
            />
            <span className="text-lg md:text-xl font-bold text-gray-800">クリーンコンフォート千葉</span>
          </Link>
          <Link href="/" className="flex items-center text-primary hover:text-primary-dark transition-colors">
            <ArrowLeft className="h-5 w-5 mr-1" />
            <span>トップページに戻る</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
