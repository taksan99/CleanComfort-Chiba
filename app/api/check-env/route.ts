import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    DATABASE_URL: process.env.DATABASE_URL ? "Set" : "Not set",
    POSTGRES_URL: process.env.POSTGRES_URL ? "Set" : "Not set",
    POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL ? "Set" : "Not set",
    POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING ? "Set" : "Not set",
    POSTGRES_USER: process.env.POSTGRES_USER ? "Set" : "Not set",
    POSTGRES_HOST: process.env.POSTGRES_HOST ? "Set" : "Not set",
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD ? "Set" : "Not set",
    POSTGRES_DATABASE: process.env.POSTGRES_DATABASE ? "Set" : "Not set",
  })
}
