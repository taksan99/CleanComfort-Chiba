"use client"

import { useState, useEffect, useCallback } from "react"

interface ImageUrlCache {
  urls: Record<string, string>
  timestamp: number
}

const CACHE_KEY = "image_urls_cache_v2"
const CACHE_DURATION = 1000 * 60 * 5 // 5分間キャッシュを保持

export function useImageUrls() {
  const [imageUrls, setImageUrls] = useState<Record<string, { url: string; fallbackUrl: string }>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchImageUrls = useCallback(async (forceRefresh = false) => {
    try {
      const response = await fetch(`/api/image-urls?t=${Date.now()}&forceRefresh=${forceRefresh}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: Record<string, { url: string; updated_at: string }> = await response.json()

      // URLを抽出し、タイムスタンプを追加
      const urls = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          {
            url: `${value.url}?t=${new Date(value.updated_at).getTime()}`,
            fallbackUrl: "/placeholder.svg",
          },
        ]),
      )

      setImageUrls(urls)

      // キャッシュを更新
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          urls,
          timestamp: new Date().toISOString(),
        }),
      )

      setError(null)
    } catch (err) {
      console.error("Error fetching image URLs:", err)
      setError(err instanceof Error ? err : new Error("Failed to fetch image URLs"))

      // エラー時にキャッシュデータを使用
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        try {
          const { urls }: ImageUrlCache = JSON.parse(cached)
          setImageUrls(urls)
        } catch (cacheError) {
          console.error("Error parsing cached data:", cacheError)
        }
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchImageUrls()
    const intervalId = setInterval(() => fetchImageUrls(true), CACHE_DURATION)
    return () => clearInterval(intervalId)
  }, [fetchImageUrls])

  const refreshImages = useCallback(async () => {
    setIsLoading(true)
    try {
      await fetchImageUrls(true)
    } catch (err) {
      console.error("Error refreshing images:", err)
      setError(err instanceof Error ? err : new Error("Failed to refresh images"))
    } finally {
      setIsLoading(false)
    }
  }, [fetchImageUrls])

  return { imageUrls, isLoading, error, refreshImages }
}
