"use client"

import { useState, useEffect, useMemo } from "react"

interface ImageCache {
  urls: Record<string, string>
  timestamp: number
}

const CACHE_DURATION = 1000 * 60 * 5 // 5 minutes cache duration
const MAX_RETRIES = 3
const INITIAL_RETRY_DELAY = 1000 // 1 second

export function useMultipleImageCache(initialSections: string[]) {
  const sections = useMemo(() => initialSections, [initialSections])
  const cacheKey = useMemo(() => `multiple_image_cache_${sections.join("_")}`, [sections])

  const [imageUrls, setImageUrls] = useState<Record<string, string | null>>(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        try {
          const { urls, timestamp }: ImageCache = JSON.parse(cached)
          if (Date.now() - timestamp < CACHE_DURATION) {
            return urls
          }
        } catch (error) {
          console.error("Error parsing cached data:", error)
        }
      }
    }
    return Object.fromEntries(sections.map((section) => [section, null]))
  })

  const [isLoading, setIsLoading] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchWithRetry = async (
      section: string,
      retryCount = 0,
    ): Promise<{ section: string; url: string | null; error?: string }> => {
      try {
        const response = await fetch(`/api/images?section=${section}&t=${Date.now()}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        if (data.error) {
          throw new Error(data.error)
        }
        if (!data.url) {
          return { section, url: null, error: `No URL returned from API for section: ${section}` }
        }
        return { section, url: `${data.url}?t=${Date.now()}` }
      } catch (error) {
        console.error(`Error fetching image for ${section}:`, error)
        if (retryCount < MAX_RETRIES) {
          const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount)
          await new Promise((resolve) => setTimeout(resolve, delay))
          return fetchWithRetry(section, retryCount + 1)
        }
        return { section, url: null, error: `Max retries reached for ${section}: ${error.message}` }
      }
    }

    const loadImages = async () => {
      setIsLoading(true)
      setErrors({})
      try {
        const responses = await Promise.all(sections.map((section) => fetchWithRetry(section)))
        const newUrls: Record<string, string | null> = {}
        const newErrors: Record<string, string> = {}

        responses.forEach(({ section, url, error }) => {
          newUrls[section] = url
          if (error) {
            newErrors[section] = error
          }
        })

        setImageUrls(newUrls)
        setErrors(newErrors)

        const cacheData: ImageCache = {
          urls: newUrls,
          timestamp: Date.now(),
        }
        localStorage.setItem(cacheKey, JSON.stringify(cacheData))
      } catch (error: any) {
        console.error("Images loading failed:", error)
        setErrors({ general: error.message || "Unknown error occurred" })
      } finally {
        setIsLoading(false)
      }
    }

    loadImages()

    const intervalId = setInterval(loadImages, CACHE_DURATION)

    return () => clearInterval(intervalId)
  }, [sections, cacheKey])

  return { imageUrls, isLoading, errors }
}
