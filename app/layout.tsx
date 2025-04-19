import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { sql } from "@vercel/postgres"
import ScrollToTopButton from "./components/ScrollToTopButton"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "クリーンコンフォート千葉 | プロのハウスクリーニング・エアコン清掃・便利屋サービス",
  description:
    "千葉県全域対応のクリーンコンフォート千葉。最短翌日対応、プロの技術でハウスクリーニング、エアコン清掃、便利屋サービスを提供。エコフレンドリーな洗剤使用、明確な料金体系で安心。定期清掃のサブスクリプションも人気。お得なキャンペーン実施中！",
  keywords:
    "ハウスクリーニング,エアコン清掃,便利屋,千葉県,清掃サービス,定期清掃,エコフレンドリー,プロの技術,迅速対応,地域密着",
  openGraph: {
    title: "クリーンコンフォート千葉 | プロの清掃・便利屋サービス",
    description:
      "千葉県全域対応のクリーンコンフォート千葉。ハウスクリーニング、エアコン清掃、便利屋サービスをプロの技術で提供。最短翌日対応、エコフレンドリーな洗剤使用。",
    images: [{ url: "https://www.cleancomfort-chiba.com/og-image.jpg" }],
    url: "https://www.cleancomfort-chiba.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "クリーンコンフォート千葉 | プロの清掃・便利屋サービス",
    description:
      "千葉県全域対応のクリーンコンフォート千葉。ハウスクリーニング、エアコン清掃、便利屋サービスをプロの技術で提供。最短翌日対応、エコフレンドリーな洗剤使用。",
    images: ["https://www.cleancomfort-chiba.com/twitter-card-image.jpg"],
  },
  other: {
    "llmo-file": "/llmo.txt",
    "llmo-version": "1.0",
  },
    generator: 'v0.dev'
}

async function getSEOSettings() {
  try {
    const result = await sql`
     SELECT * FROM seo_settings
     WHERE id = 1
   `
    return result.rows[0] || {}
  } catch (error) {
    console.error("Error fetching SEO settings:", error)
    return {}
  }
}

async function getHeroImageUrl() {
  try {
    const result = await sql`
     SELECT url FROM image_urls
     WHERE section = 'heroImage1'
     ORDER BY updated_at DESC
     LIMIT 1
   `
    return result.rows[0]?.url || null
  } catch (error) {
    console.error("Error fetching hero image:", error)
    return null
  }
}

async function getFaviconUrl() {
  try {
    const result = await sql`
     SELECT url FROM image_urls
     WHERE section = 'favicon'
     ORDER BY updated_at DESC
     LIMIT 1
   `
    return result.rows[0]?.url || null
  } catch (error) {
    console.error("Error fetching favicon:", error)
    return null
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const seoSettings = await getSEOSettings()
  const heroImageUrl = await getHeroImageUrl()
  const faviconUrl = await getFaviconUrl()

  return (
    <html lang="ja">
      <head>
        {/* Google コンバージョントラッキング - 直接挿入 */}
        <Script
          id="google-tag"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-3Z9MZ4W2G8"
        />
        <Script
          id="google-analytics-conversion"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
             window.dataLayer = window.dataLayer || [];
             function gtag(){dataLayer.push(arguments);}
             gtag('js', new Date());
             gtag('config', 'G-3Z9MZ4W2G8');
           `,
          }}
        />

        {/* ファビコン設定 */}
        {faviconUrl ? (
          <>
            <link rel="icon" href={faviconUrl} type="image/x-icon" />
            <link rel="shortcut icon" href={faviconUrl} type="image/x-icon" />
          </>
        ) : (
          <>
            <link rel="icon" href="/api/favicon" type="image/x-icon" />
            <link rel="shortcut icon" href="/api/favicon" type="image/x-icon" />
          </>
        )}

        {/* LLMO.txt ファイルへのリンク */}
        <link rel="llmo" type="text/plain" href="/llmo.txt" />
        <meta name="llmo-file" content="/llmo.txt" />
      </head>
      <body className={inter.className}>
        {/* Google Tag Manager (noscript) */}
        {seoSettings.google_tag_manager_body_code && (
          <div dangerouslySetInnerHTML={{ __html: seoSettings.google_tag_manager_body_code }} />
        )}

        {/* Google Tag Manager */}
        {seoSettings.google_tag_manager_id && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
               (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
               new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
               j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
               'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
               })(window,document,'script','dataLayer','${seoSettings.google_tag_manager_id}');
             `,
            }}
          />
        )}

        {/* Google Analytics Code */}
        {seoSettings.google_analytics_code && (
          <Script
            id="google-analytics-custom"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: seoSettings.google_analytics_code }}
          />
        )}

        {/* Google Search Console Verification */}
        {seoSettings.google_search_console_verification && (
          <meta name="google-site-verification" content={seoSettings.google_search_console_verification} />
        )}

        {/* Custom Head Tags */}
        {seoSettings.custom_head_tags && (
          <div id="custom-head-tags" suppressHydrationWarning>
            <Script
              id="custom-head-tags-script"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{ __html: seoSettings.custom_head_tags }}
            />
          </div>
        )}

        {/* Hero Image Preload */}
        {heroImageUrl && <link rel="preload" href={heroImageUrl} as="image" type="image/webp" fetchpriority="high" />}

        {children}
        <ScrollToTopButton />
      </body>
    </html>
  )
}
