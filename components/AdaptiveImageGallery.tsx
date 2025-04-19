"use client"

import { useState, useEffect } from "react"
import AdaptiveImage from "./AdaptiveImage"
import PredictiveImageLoader from "./PredictiveImageLoader"
import { useUserBehaviorTracker } from "@/hooks/useUserBehaviorTracker"
import { getNetworkQuality } from "@/utils/network"

interface GalleryImage {
  id: string
  src: string
  alt: string
  width: number
  height: number
}

interface AdaptiveImageGalleryProps {
  images: GalleryImage[]
  className?: string
}

export default function AdaptiveImageGallery({ images, className = "" }: AdaptiveImageGalleryProps) {
  const [visibleImages, setVisibleImages] = useState<GalleryImage[]>([])
  const [networkQuality, setNetworkQuality] = useState<string>("unknown")
  const userBehavior = useUserBehaviorTracker()

  // Determine how many images to show based on network quality and device
  useEffect(() => {
    const determineVisibleImages = async () => {
      const quality = await getNetworkQuality()
      setNetworkQuality(quality)

      // Determine batch size based on network quality
      let batchSize = 4 // Default

      if (quality === "slow") {
        batchSize = 2
      } else if (quality === "medium") {
        batchSize = 4
      } else if (quality === "fast") {
        batchSize = 8
      }

      // Show initial batch
      setVisibleImages(images.slice(0, batchSize))
    }

    determineVisibleImages()
  }, [images])

  // Load more images as user scrolls
  useEffect(() => {
    if (userBehavior.scrollDepth > 50 && visibleImages.length < images.length) {
      // User has scrolled past 50%, load more images
      const additionalImages = Math.min(
        4, // Load 4 more images
        images.length - visibleImages.length, // But don't exceed total
      )

      if (additionalImages > 0) {
        setVisibleImages(images.slice(0, visibleImages.length + additionalImages))
      }
    }
  }, [userBehavior.scrollDepth, visibleImages.length, images])

  // Prepare image sets for predictive loading
  const imageSetsForPrediction = images
    .filter((img) => !visibleImages.includes(img))
    .map((img) => ({
      id: img.id,
      urls: [img.src],
      // Calculate probability based on user behavior
      probability: calculateProbability(img, userBehavior),
    }))

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {visibleImages.map((image, index) => (
        <AdaptiveImage
          key={image.id}
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          priority={index < 2} // Prioritize first two images
          className="w-full h-auto rounded-lg"
        />
      ))}

      {/* Predictive loader for images not yet visible */}
      <PredictiveImageLoader
        imageSets={imageSetsForPrediction}
        maxPrefetch={networkQuality === "slow" ? 2 : networkQuality === "medium" ? 4 : 6}
        enabled={visibleImages.length < images.length}
      />
    </div>
  )
}

// Helper function to calculate probability based on user behavior
function calculateProbability(image: GalleryImage, behavior: ReturnType<typeof useUserBehaviorTracker>): number {
  // Start with base probability
  let probability = 0.5

  // Adjust based on scroll depth
  if (behavior.scrollDepth > 75) {
    probability += 0.3 // User is scrolling a lot, likely to see more images
  } else if (behavior.scrollDepth < 25) {
    probability -= 0.2 // User hasn't scrolled much, less likely to see more
  }

  // Adjust based on session duration
  if (behavior.sessionDuration > 60) {
    probability += 0.1 // User has been on the page for over a minute
  }

  // Adjust based on device orientation
  if (behavior.deviceOrientation === "landscape") {
    probability += 0.1 // Landscape mode is better for viewing images
  }

  // Ensure probability is between 0 and 1
  return Math.max(0, Math.min(1, probability))
}
