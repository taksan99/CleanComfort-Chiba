"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { useInView } from "react-intersection-observer"

interface AdaptiveImageProps {
  src: string
  alt: string
  width: number
  height: number
  quality?: number
  priority?: boolean
  className?: string
  placeholder?: "blur" | "empty"
  blurDataURL?: string
  onLoad?: () => void
  preload?: boolean
  fetchPriority?: "high" | "auto" | "low"
}

export default function AdaptiveImage({
  src,
  alt,
  width,
  height,
  quality = 75,
  priority = false,
  className = "",
  placeholder = "empty",
  blurDataURL,
  onLoad,
  preload = false,
  fetchPriority,
}: AdaptiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "200px 0px",
  })

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true)
    if (onLoad) onLoad()
  }

  // Handle image error
  const handleError = () => {
    setIsError(true)
    console.error(`Failed to load image: ${src}`)
  }

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {/* Skeleton placeholder */}
      {!isLoaded && !isError && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}

      {/* Actual image */}
      {(inView || priority) && (
        <Image
          ref={imageRef}
          src={src || "/placeholder.svg"}
          alt={alt}
          width={width}
          height={height}
          quality={quality}
          priority={priority}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* Error fallback */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
          <span>Image failed to load</span>
        </div>
      )}
    </div>
  )
}
