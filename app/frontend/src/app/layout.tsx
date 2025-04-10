import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { apiInitialize } from "@/api"
import { travelPlannerRandomTheme } from "@/api/backend"

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

async function getTheme() {
  try {
    const { data } = await travelPlannerRandomTheme()
    console.log("Custom theme fetched", data)

    if (!data) {
      throw new Error("No theme data received")
    }

    return data
  } catch (error) {
    console.error("Failed to fetch theme:", error)
    return { primaryColor: "#4F46E5", claim: "Explore the world with us!" }
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const theme = await getTheme()

  return (
    <html lang="en">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
          :root {
            --primary-color: ${theme.primaryColor};
          }
        `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={
          {
            "--primary-color": theme.primaryColor,
          } as React.CSSProperties
        }
      >
        <header className="py-4 px-6 border-b border-gray-200">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-primary">TravelPlan AI</h1>
            <p className="text-sm italic">{theme.claim}</p>
          </div>
        </header>
        <main className="max-w-7xl mx-auto p-6">{children}</main>
      </body>
    </html>
  )
}
