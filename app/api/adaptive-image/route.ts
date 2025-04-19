import { type NextRequest, NextResponse } from "next/server"
import { createHash } from "crypto"
import fs from "fs"
import path from "path"
import { promisify } from "util"

const mkdir = promisify(fs.mkdir)
const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)
const stat = promisify(fs.stat)

// Vercelのサーバーレス環境では /tmp ディレクトリを使用
const CACHE_DIR = "/tmp/image-cache"

// キャッシュディレクトリの存在確認
async function ensureCacheDir() {
  try {
    await stat(CACHE_DIR)
  } catch (e) {
    try {
      await mkdir(CACHE_DIR, { recursive: true })
    } catch (err) {
      console.error("Failed to create cache directory:", err)
      // キャッシュディレクトリの作成に失敗しても続行
    }
  }
}

// 画像リクエストのキャッシュキー生成
function getCacheKey(url: string, width: number, quality: number, format: string): string {
  const hash = createHash("md5").update(`${url}|${width}|${quality}|${format}`).digest("hex")
  return path.join(CACHE_DIR, `${hash}.${format}`)
}

export async function GET(req: NextRequest) {
  // パラメータの抽出
  const url = req.nextUrl.searchParams.get("url")
  const width = req.nextUrl.searchParams.get("width")
  const quality = req.nextUrl.searchParams.get("quality")
  const format = req.nextUrl.searchParams.get("format")

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 })
  }

  // パラメータの検証
  const imageWidth = Number.parseInt(width || "800")
  const imageQuality = Number.parseInt(quality || "75")
  const imageFormat = format || "webp"

  // フォーマットの検証
  if (!["webp", "avif", "jpg", "png"].includes(imageFormat)) {
    return NextResponse.json({ error: "Invalid format" }, { status: 400 })
  }

  try {
    // キャッシュを無効化し、Next.jsの組み込み画像最適化を使用
    const nextImageUrl = `/_next/image?url=${encodeURIComponent(url)}&w=${imageWidth}&q=${imageQuality}`
    return NextResponse.redirect(new URL(nextImageUrl, req.url))
  } catch (error) {
    console.error("Image processing error:", error)
    return NextResponse.json({ error: "Image processing failed" }, { status: 500 })
  }
}
