import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function POST() {
  try {
    // Create services_content table
    await sql`
      CREATE TABLE IF NOT EXISTS services_content (
        id SERIAL PRIMARY KEY,
        service_type VARCHAR(50) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        items JSONB,
        features JSONB,
        option_service TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Create value_propositions table
    await sql`
      CREATE TABLE IF NOT EXISTS value_propositions (
        id SERIAL PRIMARY KEY,
        position INTEGER UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        example TEXT,
        benefit TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Create strengths table
    await sql`
      CREATE TABLE IF NOT EXISTS strengths (
        id SERIAL PRIMARY KEY,
        position INTEGER UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Create seasonal_plans table
    await sql`
      CREATE TABLE IF NOT EXISTS seasonal_plans (
        id SERIAL PRIMARY KEY,
        season VARCHAR(20) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Create pricing_categories table
    await sql`
      CREATE TABLE IF NOT EXISTS pricing_categories (
        id SERIAL PRIMARY KEY,
        position INTEGER UNIQUE NOT NULL,
        category VARCHAR(255) NOT NULL,
        icon VARCHAR(50),
        color VARCHAR(100),
        text_color VARCHAR(50),
        border_color VARCHAR(50),
        items JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    // Create reviews table
    await sql`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        position INTEGER UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        age INTEGER,
        location VARCHAR(255),
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        service VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `

    return NextResponse.json({ success: true, message: "Content tables created successfully" })
  } catch (error) {
    console.error("Error creating content tables:", error)
    return NextResponse.json({ error: "Failed to create content tables" }, { status: 500 })
  }
}
