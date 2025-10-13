import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Map "Class Registration" to "REGISTRATION" as required by the API
    const mappedBody = {
      ...body,
      productArea: body.productArea === "Class Registration" ? "REGISTRATION" : body.productArea,
    }

    // Log the request for debugging
    console.log("Proxying feature request to feedback API")
    console.log("Original payload:", body)
    console.log("Mapped payload:", mappedBody)

    const response = await fetch("https://feedback.enrollio.ai/api/boards/crm/features", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mappedBody),
    })

    if (!response.ok) {
      let errorDetails
      try {
        // Try to parse JSON error response
        errorDetails = await response.json()
        console.error("Feedback API error:", response.status, errorDetails)
      } catch {
        // If not JSON, get text
        errorDetails = await response.text()
        console.error("Feedback API error:", response.status, errorDetails)
      }

      return NextResponse.json(
        {
          error: "Failed to submit feature request",
          details: errorDetails,
          status: response.status
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log("Feature request submitted successfully:", data)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error proxying feature request:", error)
    return NextResponse.json(
      { error: "Failed to submit feature request", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
