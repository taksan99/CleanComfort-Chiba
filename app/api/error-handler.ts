import { NextResponse } from "next/server"

export function handleApiError(error: unknown) {
  console.error("Detailed API Error:", error)

  let errorMessage = "内部サーバーエラーが発生しました。しばらくしてからもう一度お試しください。"
  let statusCode = 500

  if (error instanceof Error) {
    errorMessage = `Error: ${error.message}\nStack: ${error.stack}`
    if ("code" in error && typeof error.code === "string") {
      // This is likely a database error
      if (error.code === "ECONNREFUSED") {
        errorMessage = "データベースに接続できません。"
        statusCode = 503 // Service Unavailable
      } else if (error.code === "42P01") {
        errorMessage = "テーブルが存在しません。データベースのセットアップを確認してください。"
        statusCode = 500
      }
    }
  } else {
    errorMessage = `Unknown error: ${JSON.stringify(error)}`
  }

  return NextResponse.json({ error: errorMessage }, { status: statusCode })
}
