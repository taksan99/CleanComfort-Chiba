"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image, { type ImageProps } from "next/image"

interface ImageWithFallbackProps extends Omit<ImageProps, "src"> {
  src: string
  fallbackSrc: string
  onError?: () => void
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, fallbackSrc, alt, onError, ...rest }) => {
  const [imgSrc, setImgSrc] = useState(src)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setImgSrc(src)
  }, [src])

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth <= 768)
      const handleResize = () => setIsMobile(window.innerWidth <= 768)
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <Image
      {...rest}
      src={imgSrc || "/placeholder.svg"}
      alt={alt}
      onError={() => {
        setImgSrc(fallbackSrc)
        if (onError) onError()
      }}
    />
  )
}

export default ImageWithFallback
