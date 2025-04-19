export interface DeviceCapabilities {
  pixelRatio: number
  screenWidth: number
  screenHeight: number
  isLowEndDevice: boolean
  isLowMemoryDevice: boolean
  supportsWebp: boolean
  supportsAvif: boolean
  isMobile: boolean
  batteryLevel?: number
  batteryCharging?: boolean
}

// Cache device capabilities
let deviceCapabilitiesCache: DeviceCapabilities | null = null

export async function getDeviceInfo(): Promise<DeviceCapabilities> {
  if (deviceCapabilitiesCache) {
    return deviceCapabilitiesCache
  }

  const capabilities: DeviceCapabilities = {
    pixelRatio: typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
    screenWidth: typeof window !== "undefined" ? window.screen.width : 1920,
    screenHeight: typeof window !== "undefined" ? window.screen.height : 1080,
    isLowEndDevice: false,
    isLowMemoryDevice: false,
    supportsWebp: false,
    supportsAvif: false,
    isMobile: false,
  }

  // Detect mobile device
  if (typeof navigator !== "undefined") {
    capabilities.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  // Check for low-end device
  if (typeof navigator !== "undefined" && "hardwareConcurrency" in navigator) {
    capabilities.isLowEndDevice = (navigator as any).hardwareConcurrency <= 4
  }

  // Check for low memory device
  if (typeof navigator !== "undefined" && "deviceMemory" in navigator) {
    capabilities.isLowMemoryDevice = (navigator as any).deviceMemory <= 4
  }

  // Check for battery status
  if (typeof navigator !== "undefined" && "getBattery" in navigator) {
    try {
      const battery = await (navigator as any).getBattery()
      capabilities.batteryLevel = battery.level
      capabilities.batteryCharging = battery.charging

      // Add event listener for battery changes
      battery.addEventListener("levelchange", () => {
        if (deviceCapabilitiesCache) {
          deviceCapabilitiesCache.batteryLevel = battery.level
        }
      })

      battery.addEventListener("chargingchange", () => {
        if (deviceCapabilitiesCache) {
          deviceCapabilitiesCache.batteryCharging = battery.charging
        }
      })
    } catch (error) {
      console.error("Battery API error:", error)
    }
  }

  // Check WebP support
  if (typeof self !== "undefined") {
    const webpSupport = new Promise<boolean>((resolve) => {
      const webP = new Image()
      webP.onload = () => resolve(true)
      webP.onerror = () => resolve(false)
      webP.src = "data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA=="
    })

    capabilities.supportsWebp = await webpSupport
  }

  // Check AVIF support
  if (typeof self !== "undefined") {
    const avifSupport = new Promise<boolean>((resolve) => {
      const avif = new Image()
      avif.onload = () => resolve(true)
      avif.onerror = () => resolve(false)
      avif.src =
        "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A="
    })

    capabilities.supportsAvif = await avifSupport
  }

  // Cache the capabilities
  deviceCapabilitiesCache = capabilities
  return capabilities
}
