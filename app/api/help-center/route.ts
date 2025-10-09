import { NextRequest, NextResponse } from "next/server"

// SECURITY NOTE: These credentials should be stored in environment variables in production
// Use Vercel Environment Variables for production deployment
// Using a user email that is not expected to be removed ever is advised (e.g., admin email)
const ZENDESK_EMAIL = "ryann@enrollio.ai/token" // User email + /token suffix
const ZENDESK_API_TOKEN = "DYMNs0JdI9xQHy1qctGp59X76haVh0U8k6O8OVxP" // API token from Zendesk

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("query")

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
    }

    const zendeskUrl = `https://enrollio-98596.zendesk.com/api/v2/help_center/articles/search?query=${encodeURIComponent(query)}`

    // Create Basic Auth header
    const credentials = Buffer.from(`${ZENDESK_EMAIL}:${ZENDESK_API_TOKEN}`).toString("base64")

    const response = await fetch(zendeskUrl, {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch from Zendesk")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching help center articles:", error)
    return NextResponse.json({ error: "Failed to fetch help center articles" }, { status: 500 })
  }
}
