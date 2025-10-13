import { NextRequest, NextResponse } from "next/server"

// SECURITY NOTE: These credentials should be stored in environment variables in production
const ZENDESK_EMAIL = "ryann@enrollio.ai/token"
const ZENDESK_API_TOKEN = "DYMNs0JdI9xQHy1qctGp59X76haVh0U8k6O8OVxP"
const ZENDESK_SUBDOMAIN = "enrollio-98596"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ticketId = searchParams.get("ticketId")

    if (!ticketId) {
      return NextResponse.json({ error: "Ticket ID is required" }, { status: 400 })
    }

    // Fetch comments with side-loaded users data
    const zendeskUrl = `https://${ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/tickets/${ticketId}/comments.json?include=users`

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
      throw new Error("Failed to fetch messages")
    }

    const data = await response.json()

    // Create a map of users for easy lookup
    const usersMap: Record<number, any> = {}
    if (data.users) {
      data.users.forEach((user: any) => {
        usersMap[user.id] = user
      })
    }

    // Enrich comments with user data
    const enrichedComments = data.comments.map((comment: any) => ({
      ...comment,
      user: usersMap[comment.author_id] || null,
    }))

    return NextResponse.json({ comments: enrichedComments })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}
