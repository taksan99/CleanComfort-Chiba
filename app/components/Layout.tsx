"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import Header from "./Header"

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === "/" && window.location.hash) {
      const id = window.location.hash.substring(1)
      const element = document.getElementById(id)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" })
        }, 0)
      }
    }
  }, [pathname])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl"></div>
      </div>
      <Header />
      <div className="relative z-10">{children}</div>
      <style jsx global>{`
        section[id] {
          scroll-margin-top: 80px;
        }
      `}</style>
    </div>
  )
}
