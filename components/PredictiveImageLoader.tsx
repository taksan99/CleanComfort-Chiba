"use client"

import { useEffect, useRef } from "react"
import { prefetchImages } from "@/utils/serviceWorker"

interface PredictiveImageLoaderProps {
  imageSets: {
    id: string
    urls: string[]
    probability: number
  }[]
  maxPrefetch?: number
  enabled?: boolean
}

export default function PredictiveImageLoader({
  imageSets,
  maxPrefetch = 5,
  enabled = true,
}: PredictiveImageLoaderProps) {
  const prefetchedRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!enabled) return

    // Sort image sets by probability (highest first)
    const sortedSets = [...imageSets].sort((a, b) => b.probability - a.probability)

    // Select top N sets based on maxPrefetch
    const topSets = sortedSets.slice(0, maxPrefetch)

    // Collect URLs to prefetch, avoiding duplicates
    const urlsToPrefetch: string[] = []

    for (const set of topSets) {
      for (const url of set.urls) {
        if (!prefetchedRef.current.has(url)) {
          urlsToPrefetch.push(url)
          prefetchedRef.current.add(url)
        }
      }
    }

    // Prefetch the selected images
    if (urlsToPrefetch.length > 0) {
      prefetchImages(urlsToPrefetch)
    }
  }, [imageSets, maxPrefetch, enabled])

  // This component doesn't render anything
  return null
}
