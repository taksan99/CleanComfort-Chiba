"use client"

import { useState, useEffect } from "react"

interface ImageCache {
  url: string
  timestamp: number
}

const CACHE_DURATION = 1000 * 60 * 5 // 5分間キャッシュを保持

export function useImageCache(section: string) {
  const [imageUrl, setImageUrl] = useState<string>("/placeholder.svg")
  const cacheKey = `image_cache_${section}`

  useEffect(() => {
    const loadImage = async () => {
      try {
        // セッションストレージからキャッシュを確認
        const cached = sessionStorage.getItem(cacheKey)
        if (cached) {
          const { url, timestamp }: ImageCache = JSON.parse(cached)
          if (Date.now() - timestamp < CACHE_DURATION) {
            setImageUrl(url)
            return
          }
        }

        // キャッシュが無いか期限切れの場合、新しい画像URLを取得
        const response = await fetch(`/api/images?section=${section}`)
        const data = await response.json()

        if (data.url) {
          setImageUrl(data.url)
          // キャッシュを更新
          const cacheData: ImageCache = {
            url: data.url,
            timestamp: Date.now(),
          }
          sessionStorage.setItem(cacheKey, JSON.stringify(cacheData))
        }
      } catch (error) {
        // エラー時は静かに失敗
        console.debug("Image loading failed:", error)
      }
    }

    loadImage()
  }, [section, cacheKey])

  return imageUrl
}
