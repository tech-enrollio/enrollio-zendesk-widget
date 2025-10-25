import type React from "react"
import { Inter } from "next/font/google"
import "../globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
})

export default function WidgetLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-transparent">
      <body className={`font-sans ${inter.variable} bg-transparent`}>
        {children}
      </body>
    </html>
  )
}
