export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered with scope:", registration.scope)

          // Set up communication channel with the service worker
          setupServiceWorkerMessaging(registration)
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error)
        })
    })
  }
}

function setupServiceWorkerMessaging(registration: ServiceWorkerRegistration) {
  // Send network information to the service worker
  if ("connection" in navigator) {
    const connection = (navigator as any).connection

    // Initial network quality update
    updateNetworkQuality(registration, connection)

    // Listen for network changes
    connection.addEventListener("change", () => {
      updateNetworkQuality(registration, connection)
    })
  }

  // Listen for messages from the service worker
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data && event.data.type === "GET_NETWORK_INFO") {
      // Respond with network information
      const networkInfo = getNetworkInfo()
      event.ports[0].postMessage({ networkInfo })
    }
  })
}

function updateNetworkQuality(registration: ServiceWorkerRegistration, connection: any) {
  let quality = "unknown"

  if (connection) {
    if (connection.effectiveType) {
      switch (connection.effectiveType) {
        case "slow-2g":
        case "2g":
          quality = "slow"
          break
        case "3g":
          quality = "medium"
          break
        case "4g":
          quality = "fast"
          break
      }
    } else if (connection.downlink) {
      if (connection.downlink < 1) {
        quality = "slow"
      } else if (connection.downlink < 5) {
        quality = "medium"
      } else {
        quality = "fast"
      }
    }
  }

  // Send network quality to service worker
  if (registration.active) {
    registration.active.postMessage({
      type: "UPDATE_NETWORK_QUALITY",
      quality,
    })
  }
}

function getNetworkInfo() {
  const connection = (navigator as any).connection
  if (!connection) return { quality: "unknown" }

  return {
    effectiveType: connection.effectiveType,
    downlink: connection.downlink,
    rtt: connection.rtt,
    saveData: connection.saveData,
  }
}

// Function to prefetch images
export function prefetchImages(urls: string[]) {
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "PREFETCH_IMAGES",
      urls,
    })
  } else {
    // Fallback if service worker is not available
    urls.forEach((url) => {
      const link = document.createElement("link")
      link.rel = "prefetch"
      link.href = url
      link.as = "image"
      document.head.appendChild(link)
    })
  }
}
