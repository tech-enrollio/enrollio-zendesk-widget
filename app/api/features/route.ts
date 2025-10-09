import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("https://feedback.enrollio.ai/api/features", {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch features")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching features:", error)
    return NextResponse.json({ error: "Failed to fetch features" }, { status: 500 })
  }
}
