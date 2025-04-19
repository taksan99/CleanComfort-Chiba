"use client"

import { useState, useEffect, useRef } from "react"
import { getNetworkInfo, type NetworkQuality } from "@/utils/network"
import { getDeviceInfo, type DeviceCapabilities } from "@/utils/device"

interface AdaptiveImageOptions {
  src: string
  width: number
  height: number
  quality?: number
  priority?: boolean
  placeholder?: "blur" | "empty"
  blurDataURL?: string
  formats?: ("avif" | "webp" | "jpg" | "png")[]
}

interface AdaptiveImageResult {
  optimizedSrc: string
  srcSet: string
  blurDataURL?: string
  width: number
  height: number
  loading: "eager" | "lazy"
  decoding: "async" | "sync"
  fetchPriority: "high" | "auto" | "low"
  sizes: string
  onLoad?: () => void
}

export function useAdaptiveImage({
  src,
  width,
  height,
  quality = 75,
  priority = false,
  placeholder = "empty",
  blurDataURL,
  formats = ["avif", "webp", "jpg"],
}: AdaptiveImageOptions): AdaptiveImageResult {
  const [networkQuality, setNetworkQuality] = useState<NetworkQuality>("unknown")
  const [deviceCapabilities, setDeviceCapabilities] = useState<DeviceCapabilities | null>(null)
  const [optimizedSrc, setOptimizedSrc] = useState<string>(src)
  const [srcSet, setSrcSet] = useState<string>("")
  const [isVisible, setIsVisible] = useState<boolean>(priority)
  const imageRef = useRef<HTMLImageElement>(null)
  const [loadStartTime, setLoadStartTime] = useState<number>(0)
  const [error, setError] = useState<boolean>(false)

  // Detect network quality
  useEffect(() => {
    const detectNetwork = async () => {
      try {
        const network = await getNetworkInfo()
        setNetworkQuality(network.quality)
      } catch (e) {
        console.error("Network detection error:", e)
        setNetworkQuality("medium") // Fallback to medium quality
      }
    }

    detectNetwork()

    // Set up a listener for network changes
    const connection = (navigator as any).connection
    if (connection) {
      const updateNetworkInfo = () => detectNetwork()
      connection.addEventListener("change", updateNetworkInfo)
      return () => connection.removeEventListener("change", updateNetworkInfo)
    }
  }, [])

  // Detect device capabilities
  useEffect(() => {
    const detectDevice = async () => {
      try {
        const device = await getDeviceInfo()
        setDeviceCapabilities(device)
      } catch (e) {
        console.error("Device detection error:", e)
        // Fallback to reasonable defaults
        setDeviceCapabilities({
          pixelRatio: 1,
          screenWidth: 1920,
          screenHeight: 1080,
          isLowEndDevice: false,
          isLowMemoryDevice: false,
          supportsWebp: true,
          supportsAvif: false,
          isMobile: false,
        })
      }
    }

    detectDevice()
  }, [])

  // Generate optimized image URL based on network and device
  useEffect(() => {
    if (networkQuality !== "unknown" && deviceCapabilities) {
      try {
        // Adjust quality based on network conditions
        let adaptiveQuality = quality
        if (networkQuality === "slow") {
          adaptiveQuality = Math.min(quality, 60) // Lower quality for slow connections
        } else if (networkQuality === "fast") {
          adaptiveQuality = Math.min(quality, 85) // Higher quality for fast connections
        }

        // Determine best format based on device support
        let bestFormat = "jpg"
        if (deviceCapabilities.supportsAvif && formats.includes("avif")) {
          bestFormat = "avif"
        } else if (deviceCapabilities.supportsWebp && formats.includes("webp")) {
          bestFormat = "webp"
        }

        // Calculate responsive sizes based on device pixel ratio
        const dpr = deviceCapabilities.pixelRatio || 1
        const responsiveWidth = Math.round(width * dpr)

        // Use Next.js Image Optimization API instead of custom API
        // This avoids the file system issues on Vercel
        const optimizedUrl = `/_next/image?url=${encodeURIComponent(src)}&w=${responsiveWidth}&q=${adaptiveQuality}`
        setOptimizedSrc(optimizedUrl)

        // Generate srcSet for responsive images
        const widths = [0.5, 1, 1.5, 2].map((scale) => Math.round(width * scale))
        const srcSetArray = widths.map((w) => {
          const srcSetUrl = `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=${adaptiveQuality}`
          return `${srcSetUrl} ${w}w`
        })
        setSrcSet(srcSetArray.join(", "))
      } catch (e) {
        console.error("Error generating optimized image URL:", e)
        setError(true)
        // Fallback to original source
        setOptimizedSrc(src)
      }
    }
  }, [networkQuality, deviceCapabilities, src, width, height, quality, formats])

  // Set up intersection observer for visibility detection
  useEffect(() => {
    if (!priority && imageRef.current) {
      try {
        const observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              setIsVisible(true)
              setLoadStartTime(performance.now())
              observer.disconnect()
            }
          },
          {
            rootMargin: "200px", // Start loading when image is 200px from viewport
            threshold: 0.01,
          },
        )

        observer.observe(imageRef.current)
        return () => observer.disconnect()
      } catch (e) {
        console.error("Intersection observer error:", e)
        setIsVisible(true) // Fallback to always visible
      }
    }
  }, [priority])

  // Handle image load completion and report metrics
  const handleLoad = () => {
    if (loadStartTime > 0) {
      try {
        const loadTime = performance.now() - loadStartTime
        // Report to analytics or performance monitoring
        if (window.PerformanceObserver) {
          // Record LCP candidate
          const entry = {
            name: "adaptive-image-load",
            startTime: loadStartTime,
            duration: loadTime,
            entryType: "measure",
            element: imageRef.current,
          }

          // Store in performance timeline
          performance.mark("adaptive-image-end")
          performance.measure("adaptive-image-load", "adaptive-image-start", "adaptive-image-end")
        }
      } catch (e) {
        console.error("Performance measurement error:", e)
      }
    }
  }

  return {
    optimizedSrc: error ? src : optimizedSrc,
    srcSet: error ? "" : srcSet,
    blurDataURL: placeholder === "blur" ? blurDataURL : undefined,
    width,
    height,
    loading: priority ? "eager" : "lazy",
    decoding: "async",
    fetchPriority: priority ? "high" : "auto",
    sizes: `(max-width: 768px) 100vw, ${width}px`,
    onLoad: handleLoad,
  }
}
