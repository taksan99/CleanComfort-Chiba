"use client"

import { useState, useEffect } from "react"
import { useImageUrls } from "./useImageUrls"
import { getOptimizedImageUrl } from "@/lib/image-optimization"

export function useOptimizedImages(sections: string[], options = { width: 1200, quality: 75 }) {
  const { imageUrls, isLoading, error, refreshImages } = useImageUrls()
  const [optimizedUrls, setOptimizedUrls] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isLoading && !error) {
      const optimized: Record<string, string> = {}

      sections.forEach((section) => {
        if (imageUrls[section]?.url) {
          optimized[section] = getOptimizedImageUrl(imageUrls[section].url, options.width, options.quality)
        }
      })

      setOptimizedUrls(optimized)
    }
  }, [imageUrls, isLoading, error, sections, options.width, options.quality])

  return {
    optimizedUrls,
    isLoading,
    error,
    refreshImages,
  }
}
