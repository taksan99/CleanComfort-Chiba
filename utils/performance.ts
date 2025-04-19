// パフォーマンス最適化のためのユーティリティ関数

/**
 * コンポーネントのレンダリングを遅延させる
 * @param callback 実行する関数
 * @param delay 遅延時間（ミリ秒）
 */
export function deferRender(callback: () => void, delay = 0): void {
  if (typeof window !== "undefined") {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        setTimeout(callback, delay)
      })
    } else {
      setTimeout(callback, delay)
    }
  }
}

/**
 * 要素が表示されているかどうかを確認する
 * @param element 確認する要素
 * @returns 要素が表示されているかどうか
 */
export function isElementVisible(element: HTMLElement): boolean {
  if (!element) return false

  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

/**
 * 画像の遅延読み込みを行う
 * @param imageElement 画像要素
 * @param src 画像のURL
 */
export function lazyLoadImage(imageElement: HTMLImageElement, src: string): void {
  if (!imageElement) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          imageElement.src = src
          observer.disconnect()
        }
      })
    },
    { rootMargin: "200px" },
  )

  observer.observe(imageElement)
}

/**
 * パフォーマンスマークを記録する
 * @param markName マーク名
 */
export function recordPerformanceMark(markName: string): void {
  if (typeof performance !== "undefined" && performance.mark) {
    performance.mark(markName)
  }
}

/**
 * パフォーマンス計測を行う
 * @param startMark 開始マーク名
 * @param endMark 終了マーク名
 * @param measureName 計測名
 */
export function measurePerformance(startMark: string, endMark: string, measureName: string): void {
  if (typeof performance !== "undefined" && performance.measure) {
    try {
      performance.measure(measureName, startMark, endMark)
      const measures = performance.getEntriesByName(measureName)
      if (measures.length > 0) {
        console.log(`${measureName}: ${measures[0].duration.toFixed(2)}ms`)
      }
    } catch (e) {
      console.error("Performance measurement error:", e)
    }
  }
}
