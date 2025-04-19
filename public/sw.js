// Service Worker for advanced image caching

const CACHE_NAME = "adaptive-image-cache-v1"
const IMAGE_CACHE_NAME = "adaptive-image-data-v1"

// Assets to precache
const PRECACHE_ASSETS = ["/", "/index.html", "/styles.css", "/main.js"]

// Install event - precache critical assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting()),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  const currentCaches = [CACHE_NAME, IMAGE_CACHE_NAME]
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName))
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            return caches.delete(cacheToDelete)
          }),
        )
      })
      .then(() => self.clients.claim()),
  )
})

// Helper function to determine if a request is for an image
function isImageRequest(request) {
  const url = new URL(request.url)

  // Check if it's our adaptive image API
  if (url.pathname.startsWith("/api/adaptive-image")) {
    return true
  }

  // Check file extension for common image formats
  if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)) {
    return true
  }

  // Check content-type header if available
  const acceptHeader = request.headers.get("Accept")
  if (acceptHeader && acceptHeader.includes("image/")) {
    return true
  }

  return false
}

// Helper to get network info from client
async function getNetworkInfo() {
  const clients = await self.clients.matchAll()
  if (clients.length > 0) {
    try {
      // Try to get network info from client
      const response = await clients[0].postMessage({
        type: "GET_NETWORK_INFO",
      })
      return response.networkInfo
    } catch (e) {
      return null
    }
  }
  return null
}

// Fetch event - implement stale-while-revalidate for images
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  // Special handling for image requests
  if (isImageRequest(event.request)) {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          // Clone the request because it's a one-time use stream
          const fetchPromise = fetch(event.request.clone())
            .then((networkResponse) => {
              // If we got a valid response, cache it
              if (networkResponse.ok) {
                // Clone the response because it's a one-time use stream
                cache.put(event.request, networkResponse.clone())
              }
              return networkResponse
            })
            .catch((error) => {
              console.error("Fetch failed:", error)
              // If network fetch fails and we have a cached response, use it
              if (cachedResponse) {
                return cachedResponse
              }
              throw error
            })

          // Return cached response immediately if available, otherwise wait for fetch
          return cachedResponse || fetchPromise
        })
      }),
    )
  } else {
    // For non-image requests, use network-first strategy
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)))
  }
})

// Listen for messages from clients
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }

  // Handle prefetch requests
  if (event.data && event.data.type === "PREFETCH_IMAGES") {
    const imagesToPrefetch = event.data.urls
    if (Array.isArray(imagesToPrefetch) && imagesToPrefetch.length > 0) {
      event.waitUntil(
        caches.open(IMAGE_CACHE_NAME).then((cache) => {
          return Promise.all(
            imagesToPrefetch.map((imageUrl) => {
              return fetch(imageUrl)
                .then((response) => {
                  if (response.ok) {
                    return cache.put(imageUrl, response)
                  }
                })
                .catch((error) => {
                  console.error("Prefetch failed for:", imageUrl, error)
                })
            }),
          )
        }),
      )
    }
  }

  // Handle network quality updates
  if (event.data && event.data.type === "UPDATE_NETWORK_QUALITY") {
    // Store network quality information for adaptive serving
    self.__networkQuality = event.data.quality
  }
})

// Background sync for failed image requests
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-images") {
    event.waitUntil(syncImages())
  }
})

// Function to sync failed image requests
async function syncImages() {
  try {
    const failedRequests = await getFailedImageRequests()

    await Promise.all(
      failedRequests.map(async (request) => {
        try {
          const response = await fetch(request)
          if (response.ok) {
            const cache = await caches.open(IMAGE_CACHE_NAME)
            await cache.put(request, response)
            await removeFailedRequest(request)
          }
        } catch (error) {
          console.error("Failed to sync image:", request, error)
        }
      }),
    )
  } catch (error) {
    console.error("Image sync failed:", error)
  }
}

// IndexedDB functions for tracking failed requests
const DB_NAME = "adaptive-image-store"
const STORE_NAME = "failed-requests"

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      db.createObjectStore(STORE_NAME, { keyPath: "url" })
    }
  })
}

async function getFailedImageRequests() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly")
    const store = transaction.objectStore(STORE_NAME)
    const request = store.getAll()

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result.map((item) => item.url))
  })
}

async function removeFailedRequest(url) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite")
    const store = transaction.objectStore(STORE_NAME)
    const request = store.delete(url)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}
