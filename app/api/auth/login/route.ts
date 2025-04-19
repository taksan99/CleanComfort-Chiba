import { NextResponse } from "next/server"
import { createToken, validateCredentials } from "@/app/lib/auth-server"

export async function POST(request: Request) {
  try {
    console.log("Login attempt received") // デバッグログ
    const { username, password } = await request.json()
    console.log("Credentials received:", { username }) // デバッグログ - パスワードはログに出力しない

    const isValid = await validateCredentials(username, password)
    console.log("Credentials validation result:", isValid) // デバッグログ

    if (!isValid) {
      console.log("Invalid credentials for user:", username) // デバッグログ
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = await createToken({ username })
    console.log("Token created successfully for user:", username) // デバッグログ

    const response = NextResponse.json({ success: true })

    // Set auth token cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    })

    console.log("Login successful, cookies set") // デバッグログ
    return response
  } catch (error) {
    console.error("Login error:", error) // デバッグログ
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
