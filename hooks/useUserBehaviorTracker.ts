"use client"

import { useState, useEffect, useRef } from "react"

interface UserBehavior {
  scrollDepth: number
  dwellTime: Record<string, number>
  clickedElements: string[]
  hoverElements: string[]
  viewportWidth: number
  viewportHeight: number
  deviceOrientation: "portrait" | "landscape"
  sessionDuration: number
}

export function useUserBehaviorTracker() {
  const [behavior, setBehavior] = useState<UserBehavior>({
    scrollDepth: 0,
    dwellTime: {},
    clickedElements: [],
    hoverElements: [],
    viewportWidth: typeof window !== "undefined" ? window.innerWidth : 0,
    viewportHeight: typeof window !== "undefined" ? window.innerHeight : 0,
    deviceOrientation:
      typeof window !== "undefined" && window.innerHeight > window.innerWidth ? "portrait" : "landscape",
    sessionDuration: 0,
  })

  const sessionStartRef = useRef<number>(Date.now())
  const visibleSectionsRef = useRef<Record<string, number>>({})

  // Track scroll depth
  useEffect(() => {
    if (typeof window === "undefined") return

    let maxScrollDepth = 0

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = document.documentElement.clientHeight

      // Calculate scroll depth as percentage
      const currentScrollDepth = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100)

      if (currentScrollDepth > maxScrollDepth) {
        maxScrollDepth = currentScrollDepth
        setBehavior((prev) => ({ ...prev, scrollDepth: maxScrollDepth }))
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Track viewport size and orientation
  useEffect(() => {
    if (typeof window === "undefined") return

    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const orientation = height > width ? "portrait" : "landscape"

      setBehavior((prev) => ({
        ...prev,
        viewportWidth: width,
        viewportHeight: height,
        deviceOrientation: orientation,
      }))
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Track session duration
  useEffect(() => {
    if (typeof window === "undefined") return

    const interval = setInterval(() => {
      const duration = Math.floor((Date.now() - sessionStartRef.current) / 1000)
      setBehavior((prev) => ({ ...prev, sessionDuration: duration }))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Track clicks
  useEffect(() => {
    if (typeof window === "undefined") return

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target) return

      // Get element identifier (id, class, or tag)
      const elementId =
        target.id ||
        (target.className && typeof target.className === "string" ? target.className : "") ||
        target.tagName

      if (elementId) {
        setBehavior((prev) => ({
          ...prev,
          clickedElements: [...prev.clickedElements, elementId],
        }))
      }
    }

    window.addEventListener("click", handleClick)
    return () => window.removeEventListener("click", handleClick)
  }, [])

  // Track hover
  useEffect(() => {
    if (typeof window === "undefined") return

    const handleMouseover = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target) return

      // Get element identifier (id, class, or tag)
      const elementId =
        target.id ||
        (target.className && typeof target.className === "string" ? target.className : "") ||
        target.tagName

      if (elementId) {
        setBehavior((prev) => ({
          ...prev,
          hoverElements: [...prev.hoverElements, elementId],
        }))
      }
    }

    // Use event delegation to reduce listeners
    document.addEventListener("mouseover", handleMouseover)
    return () => document.removeEventListener("mouseover", handleMouseover)
  }, [])

  // Track dwell time on sections
  useEffect(() => {
    if (typeof window === "undefined") return

    // Find all sections with IDs
    const sections = document.querySelectorAll("[id]")

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id

          if (entry.isIntersecting) {
            // Section came into view, start timing
            visibleSectionsRef.current[id] = Date.now()
          } else if (visibleSectionsRef.current[id]) {
            // Section went out of view, calculate dwell time
            const startTime = visibleSectionsRef.current[id]
            const endTime = Date.now()
            const dwellTime = Math.floor((endTime - startTime) / 1000)

            // Update dwell time for this section
            setBehavior((prev) => ({
              ...prev,
              dwellTime: {
                ...prev.dwellTime,
                [id]: (prev.dwellTime[id] || 0) + dwellTime,
              },
            }))

            // Remove from tracking
            delete visibleSectionsRef.current[id]
          }
        })
      },
      { threshold: 0.5 },
    )

    // Observe all sections
    sections.forEach((section) => {
      observer.observe(section)
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return behavior
}
