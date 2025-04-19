"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
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
import FAQ from "@/app/components/FAQ"
import UrgencyOffer from "@/app/components/UrgencyOffer"
import ContactForm from "@/app/components/ContactForm"
import Footer from "@/app/components/Footer"

type HomeProps = {
  imageUrls: Record<string, string>
  settings: Record<string, any>
}

export default function Home({ imageUrls, settings }: HomeProps) {
  const searchParams = useSearchParams()
  const section = searchParams.get("section")

  useEffect(() => {
    if (section) {
      const element = document.getElementById(section)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }, [section])

  return (
    <div className="flex flex-col min-h-screen">
      <Header settings={settings} />
      <main>
        <HeroSection imageUrl={imageUrls.heroImage} />
        <ValueProposition imageUrl={imageUrls.valuePropositionImage} />
        <Strengths imageUrl={imageUrls.strengthsImage} />
        <Services imageUrl={imageUrls.servicesImage} />
        <SeasonalPlans imageUrl={imageUrls.seasonalPlansImage} />
        <PricingOverview imageUrl={imageUrls.pricingOverviewImage} />
        <Reviews imageUrl={imageUrls.reviewsImage} />
        <TrustSignals imageUrl={imageUrls.trustSignalsImage} />
        <Promotions imageUrl={imageUrls.promotionsImage} />
        <FAQ imageUrl={imageUrls.faqImage} />
        <UrgencyOffer imageUrl={imageUrls.urgencyOfferImage} />
        <ContactForm imageUrl={imageUrls.contactFormImage} />
      </main>
      <Footer />
    </div>
  )
}
