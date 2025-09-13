import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json()

    switch (type) {
      case "services":
        // Handle services content update
        const serviceTypes = ["houseCleaning", "airConCleaning", "handymanService"]

        for (let i = 0; i < data.length && i < serviceTypes.length; i++) {
          const service = data[i]
          const serviceType = serviceTypes[i]

          await sql`
            INSERT INTO services_content (
              service_type, title, description, items, features, option_service, updated_at
            ) VALUES (
              ${serviceType}, 
              ${service.title}, 
              ${service.description}, 
              ${JSON.stringify(service.items)}, 
              ${JSON.stringify(service.features)}, 
              ${service.option}, 
              CURRENT_TIMESTAMP
            )
            ON CONFLICT (service_type) 
            DO UPDATE SET 
              title = EXCLUDED.title,
              description = EXCLUDED.description,
              items = EXCLUDED.items,
              features = EXCLUDED.features,
              option_service = EXCLUDED.option_service,
              updated_at = CURRENT_TIMESTAMP
          `
        }
        break

      case "valueProposition":
        await sql`
          INSERT INTO value_propositions (title, subtitle, items, updated_at)
          VALUES (${data.title}, ${data.subtitle}, ${JSON.stringify(data.items)}, CURRENT_TIMESTAMP)
          ON CONFLICT (id) 
          DO UPDATE SET 
            title = EXCLUDED.title,
            subtitle = EXCLUDED.subtitle,
            items = EXCLUDED.items,
            updated_at = CURRENT_TIMESTAMP
          WHERE value_propositions.id = 1
        `
        break

      case "strengths":
        await sql`
          INSERT INTO strengths (title, subtitle, items, updated_at)
          VALUES (${data.title}, ${data.subtitle}, ${JSON.stringify(data.items)}, CURRENT_TIMESTAMP)
          ON CONFLICT (id) 
          DO UPDATE SET 
            title = EXCLUDED.title,
            subtitle = EXCLUDED.subtitle,
            items = EXCLUDED.items,
            updated_at = CURRENT_TIMESTAMP
          WHERE strengths.id = 1
        `
        break

      case "seasonalPlans":
        // Clear existing seasonal plans and insert new ones
        await sql`DELETE FROM seasonal_plans`

        for (const plan of data) {
          await sql`
            INSERT INTO seasonal_plans (season, title, description, items, price)
            VALUES (${plan.season}, ${plan.title}, ${plan.description}, ${JSON.stringify(plan.items)}, ${plan.price})
          `
        }
        break

      case "pricing":
        // Clear existing pricing categories and insert new ones
        await sql`DELETE FROM pricing_categories`

        for (const category of data) {
          await sql`
            INSERT INTO pricing_categories (category_name, description, items)
            VALUES (${category.name}, ${category.description}, ${JSON.stringify(category.items)})
          `
        }
        break

      case "reviews":
        // Clear existing content reviews and insert new ones
        await sql`DELETE FROM content_reviews`

        for (const review of data) {
          await sql`
            INSERT INTO content_reviews (customer_name, rating, comment, service_type, is_featured)
            VALUES (${review.name}, ${review.rating}, ${review.comment}, ${review.service}, ${review.featured || false})
          `
        }
        break

      default:
        return NextResponse.json(
          {
            success: false,
            error: "Invalid content type",
          },
          { status: 400 },
        )
    }

    return NextResponse.json({
      success: true,
      message: `${type} content updated successfully`,
    })
  } catch (error) {
    console.error("Error updating content:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update content",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    let data
    switch (type) {
      case "services":
        data = await sql`SELECT * FROM services_content ORDER BY service_type`
        break
      case "valueProposition":
        data = await sql`SELECT * FROM value_propositions LIMIT 1`
        break
      case "strengths":
        data = await sql`SELECT * FROM strengths LIMIT 1`
        break
      case "seasonalPlans":
        data = await sql`SELECT * FROM seasonal_plans ORDER BY id`
        break
      case "pricing":
        data = await sql`SELECT * FROM pricing_categories ORDER BY id`
        break
      case "reviews":
        data = await sql`SELECT * FROM content_reviews ORDER BY created_at DESC`
        break
      default:
        return NextResponse.json(
          {
            success: false,
            error: "Invalid content type",
          },
          { status: 400 },
        )
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch content",
      },
      { status: 500 },
    )
  }
}
