const { neon } = require("@neondatabase/serverless")

const sql = neon(process.env.DATABASE_URL)

async function initContentTables() {
  try {
    console.log("Creating content tables...")

    // Create services_content table
    await sql`
      CREATE TABLE IF NOT EXISTS services_content (
        id SERIAL PRIMARY KEY,
        service_type VARCHAR(50) NOT NULL UNIQUE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        items JSONB DEFAULT '[]',
        features JSONB DEFAULT '[]',
        option_service TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create value_propositions table
    await sql`
      CREATE TABLE IF NOT EXISTS value_propositions (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle TEXT,
        items JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create strengths table
    await sql`
      CREATE TABLE IF NOT EXISTS strengths (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle TEXT,
        items JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create seasonal_plans table
    await sql`
      CREATE TABLE IF NOT EXISTS seasonal_plans (
        id SERIAL PRIMARY KEY,
        season VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        items JSONB DEFAULT '[]',
        price VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create pricing_categories table
    await sql`
      CREATE TABLE IF NOT EXISTS pricing_categories (
        id SERIAL PRIMARY KEY,
        category_name VARCHAR(255) NOT NULL,
        description TEXT,
        items JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create content_reviews table
    await sql`
      CREATE TABLE IF NOT EXISTS content_reviews (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        service_type VARCHAR(100),
        date_posted DATE DEFAULT CURRENT_DATE,
        is_featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log("Content tables created successfully!")
  } catch (error) {
    console.error("Error creating content tables:", error)
    process.exit(1)
  }
}

initContentTables()
