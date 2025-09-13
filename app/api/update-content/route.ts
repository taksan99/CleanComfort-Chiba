import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()

  // ここでデータベースやファイルシステムにデータを保存する処理を実装します
  // 例: await saveToDatabase(body);

  return NextResponse.json({ success: true })
}
