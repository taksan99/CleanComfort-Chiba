import { NextResponse } from "next/server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { sql } from "@vercel/postgres"

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // ファイルをバッファに変換
    const buffer = await file.arrayBuffer()
    const fileName = `favicon/${Date.now()}-favicon.ico`

    // S3にアップロード
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        Body: Buffer.from(buffer),
        ContentType: file.type,
      }),
    )

    const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`

    // データベースにファビコンURLを保存
    try {
      // 既存のレコードがあるか確認
      const existingRecord = await sql`
        SELECT id FROM image_urls
        WHERE section = 'favicon'
        LIMIT 1
      `

      if (existingRecord.rows.length > 0) {
        // 既存のレコードがある場合は更新
        await sql`
          UPDATE image_urls 
          SET url = ${imageUrl}, updated_at = NOW()
          WHERE section = 'favicon'
        `
      } else {
        // 新規レコードの場合は挿入
        await sql`
          INSERT INTO image_urls (section, url)
          VALUES ('favicon', ${imageUrl})
        `
      }
    } catch (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to update database" }, { status: 500 })
    }

    return NextResponse.json({ success: true, url: imageUrl })
  } catch (error) {
    console.error("Error uploading favicon:", error)
    return NextResponse.json({ error: "Failed to upload favicon" }, { status: 500 })
  }
}
