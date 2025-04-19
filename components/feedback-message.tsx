"use client"

import { useState, useEffect } from "react"

interface FeedbackMessageProps {
  message: string
  type: "success" | "error"
  duration?: number
}

export default function FeedbackMessage({ message, type, duration = 2000 }: FeedbackMessageProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  if (!isVisible) return null

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500"

  return (
    <div
      className={`fixed top-4 right-4 ${bgColor} text-white px-4 py-2 rounded-md shadow-md transition-opacity duration-300`}
    >
      {message}
    </div>
  )
}
