import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url")
  const width = req.nextUrl.searchParams.get("w") || "1920"
  const quality = req.nextUrl.searchParams.get("q") || "75"

  if (!url) {
    return new NextResponse("Missing URL parameter", { status: 400 })
  }

  const optimizedImageUrl = `/_next/image?url=${encodeURIComponent(url)}&w=${width}&q=${quality}`

  return NextResponse.redirect(new URL(optimizedImageUrl, req.url))
}
