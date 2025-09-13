import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/app/components/Toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "クリーンコンフォート千葉 | 千葉県のハウスクリーニング・エアコン清掃・便利屋サービス",
  description:
    "千葉県全域でハウスクリーニング、エアコン清掃、便利屋サービスを提供。プロの技術で清潔で快適な空間を実現します。",
  keywords: "ハウスクリーニング,エアコン清掃,便利屋,千葉県,木更津市,君津市,富津市,袖ケ浦市",
  openGraph: {
    title: "クリーンコンフォート千葉 | 千葉県のハウスクリーニング・エアコン清掃・便利屋サービス",
    description:
      "千葉県全域でハウスクリーニング、エアコン清掃、便利屋サービスを提供。プロの技術で清潔で快適な空間を実現します。",
    url: "https://cleancomfort-chiba.vercel.app",
    siteName: "クリーンコンフォート千葉",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "クリーンコンフォート千葉",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "クリーンコンフォート千葉 | 千葉県のハウスクリーニング・エアコン清掃・便利屋サービス",
    description:
      "千葉県全域でハウスクリーニング、エアコン清掃、便利屋サービスを提供。プロの技術で清潔で快適な空間を実現します。",
    images: ["/twitter-card.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
