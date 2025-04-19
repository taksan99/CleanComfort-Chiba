"use client"
import { useState, useEffect } from "react"
import Image, { type ImageProps } from "next/image"

interface CustomImageProps extends Omit<ImageProps, "alt"> {
  alt?: string
}

export default function CustomImage({ src, alt, ...props }: CustomImageProps) {
  const [imageAlt, setImageAlt] = useState(alt || "")
  const [imageTitle, setImageTitle] = useState("")

  useEffect(() => {
    async function fetchImageMetadata() {
      try {
        const response = await fetch(src as string, { method: "HEAD" })
        const altText = response.headers.get("X-Alt-Text")
        const title = response.headers.get("X-Title")

        if (altText) setImageAlt(altText)
        if (title) setImageTitle(title)
      } catch (error) {
        console.error("Error fetching image metadata:", error)
      }
    }

    if (!alt) {
      fetchImageMetadata()
    }
  }, [src, alt])

  return <Image src={src || "/placeholder.svg"} alt={imageAlt} title={imageTitle} {...props} />
}
