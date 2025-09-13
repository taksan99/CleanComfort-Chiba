const { sql } = require("@vercel/postgres")

async function initializeTables() {
  try {
    console.log("Creating content tables...")

    // Create the tables
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/create-content-tables`, {
      method: "POST",
    })

    const result = await response.json()

    if (result.success) {
      console.log("✅ Content tables created successfully")
    } else {
      console.error("❌ Failed to create content tables:", result.error)
    }
  } catch (error) {
    console.error("❌ Error initializing content tables:", error)
  }
}

initializeTables()
