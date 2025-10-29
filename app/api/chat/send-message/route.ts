import { NextRequest, NextResponse } from "next/server"

// SECURITY NOTE: These credentials should be stored in environment variables in production
const ZENDESK_EMAIL = "ryann@enrollio.ai/token"
const ZENDESK_API_TOKEN = "DYMNs0JdI9xQHy1qctGp59X76haVh0U8k6O8OVxP"
const ZENDESK_SUBDOMAIN = "enrollio-98596"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ticketId, message, requesterId } = body

    if (!ticketId || !message) {
      return NextResponse.json({ error: "Ticket ID and message are required" }, { status: 400 })
    }

    const zendeskUrl = `https://${ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/tickets/${ticketId}.json`

    const credentials = Buffer.from(`${ZENDESK_EMAIL}:${ZENDESK_API_TOKEN}`).toString("base64")

    const updateData = {
      ticket: {
        status: "open",
        comment: {
          body: message,
          public: true,
          author_id: requesterId, // Set the actual user as the author
        },
      },
    }

    const response = await fetch(zendeskUrl, {
      method: "PUT",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Zendesk API error:", errorData)
      throw new Error("Failed to send message")
    }

    const data = await response.json()
    return NextResponse.json({ success: true, ticket: data.ticket })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
