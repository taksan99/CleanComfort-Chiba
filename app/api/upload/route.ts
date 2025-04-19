import { NextResponse } from "next/server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { sql } from "@vercel/postgres"
import sharp from "sharp"

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
    const section = formData.get("section") as string

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // ファイルをバッファに変換
    const buffer = await file.arrayBuffer()
    const fileName = `${section}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`

    // WebP形式に変換（画像ファイルの場合のみ）
    let fileBuffer: Buffer
    let contentType: string

    if (file.type.startsWith("image/") && !file.type.includes("svg") && !file.name.endsWith(".ico")) {
      try {
        // 画像をWebPに変換
        fileBuffer = await sharp(Buffer.from(buffer)).webp({ quality: 85 }).toBuffer()
        contentType = "image/webp"

        // ファイル名の拡張子をwebpに変更
        const fileNameWithoutExt = fileName.substring(0, fileName.lastIndexOf("."))
        fileName = `${fileNameWithoutExt}.webp`
      } catch (error) {
        console.error("Error converting image to WebP:", error)
        // 変換に失敗した場合は元のバッファを使用
        fileBuffer = Buffer.from(buffer)
        contentType = file.type
      }
    } else {
      // 画像以外のファイルまたはSVGの場合は変換しない
      fileBuffer = Buffer.from(buffer)
      contentType = file.type
    }

    // S3にアップロード
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        Body: fileBuffer,
        ContentType: contentType,
      }),
    )

    const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`

    // データベースに画像URLを保存
    try {
      // 既存のレコードがあるか確認
      const existingRecord = await sql`
        SELECT id FROM image_urls
        WHERE section = ${section}
        LIMIT 1
      `

      if (existingRecord.rows.length > 0) {
        // 既存のレコードがある場合は更新
        await sql`
          UPDATE image_urls 
          SET url = ${imageUrl}, updated_at = NOW()
          WHERE section = ${section}
        `
      } else {
        // 新規レコードの場合は挿入
        await sql`
          INSERT INTO image_urls (section, url)
          VALUES (${section}, ${imageUrl})
        `
      }
    } catch (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to update database" }, { status: 500 })
    }

    return NextResponse.json({ success: true, url: imageUrl })
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}
