export type NetworkQuality = "fast" | "medium" | "slow" | "unknown"

interface NetworkInfo {
  quality: NetworkQuality
  effectiveBandwidth?: number // in Mbps
  rtt?: number // Round-trip time in ms
  saveData: boolean
  connectionType?: string
}

export async function getNetworkInfo(): Promise<NetworkInfo> {
  // Default values
  const info: NetworkInfo = {
    quality: "unknown",
    saveData: false,
  }

  // Check if Network Information API is available
  const connection = (navigator as any).connection
  if (connection) {
    info.connectionType = connection.type
    info.effectiveBandwidth = connection.downlink // Mbps
    info.rtt = connection.rtt // ms
    info.saveData = !!connection.saveData

    // Determine quality based on connection properties
    if (connection.effectiveType) {
      switch (connection.effectiveType) {
        case "slow-2g":
        case "2g":
          info.quality = "slow"
          break
        case "3g":
          info.quality = "medium"
          break
        case "4g":
          info.quality = "fast"
          break
        default:
          info.quality = "unknown"
      }
    } else if (connection.downlink) {
      // Fallback to downlink speed if effectiveType is not available
      if (connection.downlink < 1) {
        info.quality = "slow"
      } else if (connection.downlink < 5) {
        info.quality = "medium"
      } else {
        info.quality = "fast"
      }
    }
  } else {
    // Fallback: Perform a small fetch to estimate network speed
    try {
      const startTime = performance.now()
      const response = await fetch("/api/network-test-pixel.png", {
        cache: "no-store",
        headers: { Purpose: "network-test" },
      })

      if (response.ok) {
        await response.arrayBuffer() // Read the response
        const endTime = performance.now()
        const duration = endTime - startTime

        // Simple heuristic based on time to download a small image
        if (duration < 100) {
          info.quality = "fast"
        } else if (duration < 300) {
          info.quality = "medium"
        } else {
          info.quality = "slow"
        }
      }
    } catch (error) {
      console.error("Network test failed:", error)
    }
  }

  return info
}

// Cache network quality to avoid frequent recalculations
let cachedNetworkQuality: NetworkQuality | null = null
let lastNetworkCheck = 0

export async function getNetworkQuality(): Promise<NetworkQuality> {
  const now = Date.now()

  // Only recalculate network quality every 30 seconds
  if (!cachedNetworkQuality || now - lastNetworkCheck > 30000) {
    const networkInfo = await getNetworkInfo()
    cachedNetworkQuality = networkInfo.quality
    lastNetworkCheck = now
  }

  return cachedNetworkQuality
}
