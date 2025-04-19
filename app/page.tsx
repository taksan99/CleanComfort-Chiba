import { sql } from "@vercel/postgres"
import Header from "@/app/components/Header"
import HeroSection from "@/app/components/HeroSection"
import ValueProposition from "@/app/components/ValueProposition"
import Strengths from "@/app/components/Strengths"
import Services from "@/app/components/Services"
import SeasonalPlans from "@/app/components/SeasonalPlans"
import PricingOverview from "@/app/components/PricingOverview"
import Reviews from "@/app/components/Reviews"
import TrustSignals from "@/app/components/TrustSignals"
import Promotions from "@/app/components/Promotions"
import Subscription from "@/app/components/Subscription"
import FAQ from "@/app/components/FAQ"
import UrgencyOffer from "@/app/components/UrgencyOffer"
import ContactForm from "@/app/components/ContactForm"
import Footer from "@/app/components/Footer"
import ScrollToSection from "@/app/components/ScrollToSection"

async function getImageUrls() {
  try {
    const result = await sql`
     SELECT section, url
     FROM image_urls
     WHERE id IN (
       SELECT MAX(id)
       FROM image_urls
       GROUP BY section
     )
   `
    return result.rows.reduce((acc, row) => {
      acc[row.section] = row.url
      return acc
    }, {})
  } catch (error) {
    console.error("Error fetching image URLs:", error)
    return {}
  }
}

async function getSettings() {
  try {
    const result = await sql`
     SELECT * FROM settings
     WHERE id = 1
   `
    return result.rows[0] || {}
  } catch (error) {
    console.error("Error fetching settings:", error)
    return {}
  }
}

export default async function Home() {
  const imageUrls = await getImageUrls()
  const settings = await getSettings()

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToSection />
      <Header />
      <main>
        <HeroSection />
        <ValueProposition />
        <Strengths />
        <Services />
        <SeasonalPlans />
        <PricingOverview />
        <Reviews />
        <TrustSignals />
        <Promotions />
        <Subscription />
        <FAQ />
        <UrgencyOffer />
        <ContactForm />
      </main>
      <Footer />
    </div>
  )
}

export const metadata = {
  title: "クリーンコンフォート千葉 | プロのハウスクリーニング・エアコン清掃・便利屋サービス",
  description:
    "千葉県全域対応のクリーンコンフォート千葉。最短翌日対応、プロの技術でハウスクリーニング、エアコン清掃、便利屋サービスを提供。",
}
