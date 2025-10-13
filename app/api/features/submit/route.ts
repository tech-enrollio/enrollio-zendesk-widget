import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Log the request for debugging
    console.log("Proxying feature request to feedback API")
    console.log("Payload:", body)

    const response = await fetch("https://feedback.enrollio.ai/api/boards/crm/features", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Feedback API error:", response.status, errorText)
      return NextResponse.json(
        { error: "Failed to submit feature request", details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log("Feature request submitted successfully:", data)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error proxying feature request:", error)
    return NextResponse.json(
      { error: "Failed to submit feature request" },
      { status: 500 }
    )
  }
}
