import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { apiInitialize } from "@/api"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "TravelPlan AI - Your Intelligent Travel Assistant",
  description:
    "Plan your perfect trip with AI assistance. Create personalized travel itineraries, discover destinations, and organize your adventures with ease.",
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/favicon.png" }],
    apple: [{ url: "/favicon.png" }],
  },
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "TravelPlan AI - Your Intelligent Travel Assistant",
    description:
      "Plan your perfect trip with AI assistance. Create personalized travel itineraries, discover destinations, and organize your adventures with ease.",
    type: "website",
    images: [{ url: "/favicon.png" }],
  },
  twitter: {
    card: "summary",
    title: "TravelPlan AI - Your Intelligent Travel Assistant",
    description:
      "Plan your perfect trip with AI assistance. Create personalized travel itineraries, discover destinations, and organize your adventures with ease.",
    images: [{ url: "/favicon.png" }],
  },
  keywords: [
    "travel",
    "AI",
    "itinerary",
    "vacation planner",
    "trip planner",
    "travel assistant",
    "holiday planner",
  ],
  themeColor: "#4F46E5",
}

apiInitialize()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
