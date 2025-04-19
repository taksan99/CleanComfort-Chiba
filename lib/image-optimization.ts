/**
 * 画像URLを最適化するためのユーティリティ関数
 *
 * @param url 元の画像URL
 * @param width 希望する幅
 * @param quality 画像品質（1-100）
 * @returns 最適化された画像URL
 */
export function getOptimizedImageUrl(url: string, width = 1200, quality = 75): string {
  if (!url || url.includes("placeholder.svg")) {
    return url
  }

  // Next.jsの画像最適化APIを使用
  return `/_next/image?url=${encodeURIComponent(url)}&w=${width}&q=${quality}`
}

/**
 * 画像のプレースホルダーSVGを生成する
 *
 * @param width 幅
 * @param height 高さ
 * @param color 背景色
 * @returns Base64エンコードされたSVG
 */
export function generatePlaceholderSVG(width = 100, height = 100, color = "#222222"): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="${color}"/></svg>`
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`
}
