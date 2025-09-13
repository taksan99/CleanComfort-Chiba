import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function POST(req: Request) {
  try {
    const { type, data } = await req.json()

    switch (type) {
      case "services":
        await saveServicesContent(data)
        break
      case "valuePropositions":
        await saveValuePropositions(data)
        break
      case "strengths":
        await saveStrengths(data)
        break
      case "seasonalPlans":
        await saveSeasonalPlans(data)
        break
      case "pricingOverview":
        await savePricingOverview(data)
        break
      case "reviews":
        await saveReviews(data)
        break
      default:
        throw new Error(`Unknown content type: ${type}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving content:", error)
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 })
  }
}

async function saveServicesContent(services: any[]) {
  const serviceTypes = ["houseCleaning", "airConCleaning", "handymanService"]

  for (let i = 0; i < services.length; i++) {
    const service = services[i]
    const serviceType = serviceTypes[i]

    await sql`
      INSERT INTO services_content (service_type, title, description, items, features, option_service)
      VALUES (${serviceType}, ${service.title}, ${service.description}, ${JSON.stringify(service.items)}, ${JSON.stringify(service.features)}, ${service.option})
      ON CONFLICT (service_type) DO UPDATE SET
        title = ${service.title},
        description = ${service.description},
        items = ${JSON.stringify(service.items)},
        features = ${JSON.stringify(service.features)},
        option_service = ${service.option},
        updated_at = NOW()
    `
  }
}

async function saveValuePropositions(valueProps: any[]) {
  for (let i = 0; i < valueProps.length; i++) {
    const prop = valueProps[i]

    await sql`
      INSERT INTO value_propositions (position, title, description, example, benefit)
      VALUES (${i}, ${prop.title}, ${prop.description}, ${prop.example}, ${prop.benefit})
      ON CONFLICT (position) DO UPDATE SET
        title = ${prop.title},
        description = ${prop.description},
        example = ${prop.example},
        benefit = ${prop.benefit},
        updated_at = NOW()
    `
  }
}

async function saveStrengths(strengths: any[]) {
  for (let i = 0; i < strengths.length; i++) {
    const strength = strengths[i]

    await sql`
      INSERT INTO strengths (position, title, description)
      VALUES (${i}, ${strength.title}, ${strength.description})
      ON CONFLICT (position) DO UPDATE SET
        title = ${strength.title},
        description = ${strength.description},
        updated_at = NOW()
    `
  }
}

async function saveSeasonalPlans(plans: any[]) {
  const seasons = ["春", "夏", "秋", "冬"]

  for (let i = 0; i < plans.length; i++) {
    const plan = plans[i]
    const season = seasons[i] || plan.season

    await sql`
      INSERT INTO seasonal_plans (season, title, description)
      VALUES (${season}, ${plan.title}, ${plan.description})
      ON CONFLICT (season) DO UPDATE SET
        title = ${plan.title},
        description = ${plan.description},
        updated_at = NOW()
    `
  }
}

async function savePricingOverview(categories: any[]) {
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i]

    await sql`
      INSERT INTO pricing_categories (position, category, icon, color, text_color, border_color, items)
      VALUES (${i}, ${category.category}, ${category.icon}, ${category.color}, ${category.textColor}, ${category.borderColor}, ${JSON.stringify(category.items)})
      ON CONFLICT (position) DO UPDATE SET
        category = ${category.category},
        icon = ${category.icon},
        color = ${category.color},
        text_color = ${category.textColor},
        border_color = ${category.borderColor},
        items = ${JSON.stringify(category.items)},
        updated_at = NOW()
    `
  }
}

async function saveReviews(reviews: any[]) {
  for (let i = 0; i < reviews.length; i++) {
    const review = reviews[i]

    await sql`
      INSERT INTO reviews (position, name, age, location, rating, comment, service)
      VALUES (${i}, ${review.name}, ${review.age}, ${review.location}, ${review.rating}, ${review.comment}, ${review.service})
      ON CONFLICT (position) DO UPDATE SET
        name = ${review.name},
        age = ${review.age},
        location = ${review.location},
        rating = ${review.rating},
        comment = ${review.comment},
        service = ${review.service},
        updated_at = NOW()
    `
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type")

    let result
    switch (type) {
      case "services":
        result = await sql`SELECT * FROM services_content ORDER BY service_type`
        break
      case "valuePropositions":
        result = await sql`SELECT * FROM value_propositions ORDER BY position`
        break
      case "strengths":
        result = await sql`SELECT * FROM strengths ORDER BY position`
        break
      case "seasonalPlans":
        result = await sql`SELECT * FROM seasonal_plans ORDER BY 
          CASE season 
            WHEN '春' THEN 1 
            WHEN '夏' THEN 2 
            WHEN '秋' THEN 3 
            WHEN '冬' THEN 4 
            ELSE 5 
          END`
        break
      case "pricingOverview":
        result = await sql`SELECT * FROM pricing_categories ORDER BY position`
        break
      case "reviews":
        result = await sql`SELECT * FROM reviews ORDER BY position`
        break
      default:
        throw new Error(`Unknown content type: ${type}`)
    }

    return NextResponse.json({ success: true, data: result.rows })
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}
