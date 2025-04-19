import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4">ありがとうございます！</h1>
        <p className="text-gray-600 mb-6">お問い合わせを受け付けました。できるだけ早くご連絡いたします。</p>
        <Link href="/">
          <Button>トップページに戻る</Button>
        </Link>
      </div>
    </div>
  )
}
