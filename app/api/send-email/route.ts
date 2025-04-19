import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { z } from "zod"
import { rateLimit } from "@/lib/rate-limit"
import { headers } from "next/headers"

const ngWords = [
  "htt",
  "http",
  "https",
  "ttp",
  "ttps",
  "tp:",
  "tps:",
  "p:/",
  "ps:/",
  "://",
  "s://",
  "http://",
  "https://",
  "www.",
  "www",
  "w.",
  "com",
  "net",
  "org",
  "info",
  "biz",
  "co.jp",
  "casino",
  "gambling",
  "porn",
  "sex",
  "viagra",
  "cialis",
  "xxx",
  "adult",
  "loan",
  "credit",
  "mortgage",
  "debt",
  "payday",
  "weight loss",
  "diet pill",
  "slim",
  "burn fat",
  "earn money",
  "make money",
  "work from home",
  "income",
  "lottery",
  "winner",
  "prize",
  "congratulations",
  "bitcoin",
  "crypto",
  "investment",
  "stock market",
  "luxury",
  "replica",
  "brand",
  "discount",
  "free",
  "cheap",
  "sale",
  "discount",
  "offer",
  "limited time",
  "click here",
  "subscribe now",
  "buy now",
  "order now",
  "urgent",
  "important",
  "action required",
  "verify your account",
  "password",
  "login",
  "account",
  "bank",
  "viagra",
  "cialis",
  "levitra",
  "pharmacy",
  "dating",
  "single",
  "meet",
  "chat",
  "vpn",
  "proxy",
  "anonymous",
  "hide ip",
]

const formSchema = z.object({
  name: z.string().min(1, "名前は必須です").max(20, "名前は20文字以内で入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  phone: z.string().regex(/^[0-9-]{10,}$/, "有効な電話番号を入力してください"),
  subject: z.string().min(1, "件名は必須です").max(50, "件名は50文字以内で入力してください"),
  service: z.string().min(1, "サービスは必須です"),
  message: z
    .string()
    .min(1, "メッセージは必須です")
    .max(1000, "メッセージは1000文字以内で入力してください")
    .refine((value) => !ngWords.some((word) => value.toLowerCase().includes(word.toLowerCase())), {
      message: "メッセージに不適切な単語やURLが含まれています",
    }),
  honeypot: z.string().max(0, "スパム防止チェックに引っかかりました"),
})

const limiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 500,
})

export async function POST(req: Request) {
  console.log("Received email request")

  const headersList = headers()
  const ip = headersList.get("x-forwarded-for") ?? "unknown"

  try {
    await limiter.check(10, ip)
  } catch {
    console.log(`Rate limit exceeded for IP: ${ip}`)
    return NextResponse.json(
      { error: "レート制限を超えました。しばらく待ってから再試行してください。" },
      { status: 429 },
    )
  }

  try {
    const body = await req.json()
    const validatedData = formSchema.parse(body)

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    })

    const japaneseDateTime = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_FROM,
      subject: `新しいお問い合わせ: ${validatedData.subject}`,
      text: `
To: ${validatedData.email}
From: ${validatedData.name}
電話番号: ${validatedData.phone}
件名: ${validatedData.subject}
希望サービス: ${validatedData.service}

メッセージ:
${validatedData.message}

送信元IP: ${ip}
送信日時: ${japaneseDateTime}
      `,
      html: `
<html>
  <body>
    <p>To: ${validatedData.email}</p>
    <p>From: ${validatedData.name}</p>
    <p>電話番号: ${validatedData.phone}</p>
    <p>件名: ${validatedData.subject}</p>
    <p>希望サービス: ${validatedData.service}</p>
    <h3>メッセージ:</h3>
    <p>${validatedData.message.replace(/\n/g, "<br>")}</p>
    <p>送信元IP: ${ip}</p>
    <p>送信日時: ${japaneseDateTime}</p>
  </body>
</html>
      `,
      replyTo: validatedData.email,
    }

    await transporter.sendMail(mailOptions)

    console.log("Email sent successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending email:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "入力データが無効です", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "メールの送信に失敗しました" }, { status: 500 })
  }
}
