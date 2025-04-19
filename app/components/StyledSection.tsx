import type React from "react"
import { cn } from "@/lib/utils"

interface StyledSectionProps {
  children: React.ReactNode
  className?: string
  gradient?: string
}

export function StyledSection({ children, className, gradient = "from-white to-gray-50" }: StyledSectionProps) {
  return (
    <section className={cn("py-16 bg-gradient-to-b border-t border-b border-gray-200", gradient, className)}>
      {children}
    </section>
  )
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 relative inline-block">
      {children}
      <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
    </h2>
  )
}
