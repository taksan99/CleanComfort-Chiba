import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { decrypt } from "./app/lib/auth-server"

export async function middleware(request: NextRequest) {
  // Check if the request is for the admin page
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const token = request.cookies.get("auth-token")

    if (!token) {
      const loginUrl = new URL("/login", request.url)
      return NextResponse.redirect(loginUrl)
    }

    try {
      const payload = await decrypt(token.value)
      if (!payload) {
        throw new Error("Invalid token")
      }
    } catch (error) {
      const loginUrl = new URL("/login", request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
