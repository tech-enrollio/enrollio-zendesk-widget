import { NextRequest, NextResponse } from "next/server"

// SECURITY NOTE: These credentials should be stored in environment variables in production
const ZENDESK_EMAIL = "ryann@enrollio.ai/token"
const ZENDESK_API_TOKEN = "DYMNs0JdI9xQHy1qctGp59X76haVh0U8k6O8OVxP"
const ZENDESK_SUBDOMAIN = "enrollio-98596"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Search for tickets by requester email
    const zendeskUrl = `https://${ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/search.json?query=type:ticket requester:${encodeURIComponent(email)} tags:chat_widget&sort_by=updated_at&sort_order=desc`

    const credentials = Buffer.from(`${ZENDESK_EMAIL}:${ZENDESK_API_TOKEN}`).toString("base64")

    const response = await fetch(zendeskUrl, {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Zendesk API error:", errorData)
      throw new Error("Failed to fetch tickets")
    }

    const data = await response.json()
    return NextResponse.json({ tickets: data.results || [] })
  } catch (error) {
    console.error("Error fetching user tickets:", error)
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 })
  }
}
