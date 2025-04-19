import { sql } from "@vercel/postgres"

export async function initializeDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS images (
        id SERIAL PRIMARY KEY,
        section VARCHAR(255) NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("Database initialized successfully")
  } catch (error) {
    console.error("Failed to initialize database:", error)
  }
}

export async function query(text: string, params?: any[]) {
  try {
    const result = await sql.query(text, params)
    return result
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}
