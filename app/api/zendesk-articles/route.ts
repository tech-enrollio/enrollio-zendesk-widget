import { NextResponse } from "next/server"

// SECURITY NOTE: These credentials should be stored in environment variables in production
// Use Vercel Environment Variables for production deployment
const ZENDESK_EMAIL = "ryann@enrollio.ai/token"
const ZENDESK_API_TOKEN = "DYMNs0JdI9xQHy1qctGp59X76haVh0U8k6O8OVxP"
const CATEGORY_ID = "40588408019611"

export async function GET() {
  try {
    // Fetch articles from specific category
    const zendeskUrl = `https://enrollio-98596.zendesk.com/api/v2/help_center/categories/${CATEGORY_ID}/articles`

    // Create Basic Auth header
    const credentials = Buffer.from(`${ZENDESK_EMAIL}:${ZENDESK_API_TOKEN}`).toString("base64")

    const response = await fetch(zendeskUrl, {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch articles from Zendesk")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching Zendesk articles:", error)
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
}
