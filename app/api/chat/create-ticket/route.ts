import { NextRequest, NextResponse } from "next/server"

// SECURITY NOTE: These credentials should be stored in environment variables in production
// Use Vercel Environment Variables for production deployment
// Using a user email that is not expected to be removed ever is advised (e.g., admin email)
const ZENDESK_EMAIL = "ryann@enrollio.ai/token" // User email + /token suffix
const ZENDESK_API_TOKEN = "DYMNs0JdI9xQHy1qctGp59X76haVh0U8k6O8OVxP" // API token from Zendesk
const ZENDESK_SUBDOMAIN = "enrollio-98596"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      )
    }

    const zendeskUrl = `https://${ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/tickets.json`

    // Create Basic Auth header
    const credentials = Buffer.from(`${ZENDESK_EMAIL}:${ZENDESK_API_TOKEN}`).toString("base64")

    const ticketData = {
      ticket: {
        subject: `Conversation with ${name}`,
        type: "task",
        status: "new",
        via_id: 75, // native_messaging - makes ticket appear as "Via Messaging"
        comment: {
          body: message,
          public: true,
        },
        requester: {
          name: name,
          email: email,
        },
        tags: ["chat_widget", "support"],
      },
    }

    const response = await fetch(zendeskUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticketData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Zendesk API error:", errorData)
      throw new Error("Failed to create ticket")
    }

    const data = await response.json()
    return NextResponse.json({
      ticketId: data.ticket.id,
      requesterId: data.ticket.requester_id,
      ticket: data.ticket,
    })
  } catch (error) {
    console.error("Error creating ticket:", error)
    return NextResponse.json({ error: "Failed to create support ticket" }, { status: 500 })
  }
}
