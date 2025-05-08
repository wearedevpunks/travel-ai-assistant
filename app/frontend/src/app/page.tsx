import { TravelPlanner } from "@/features/travel-planner"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)] pt-20">
      <div className="flex-1 w-full max-w-6xl mx-auto p-4 pb-8">
        <TravelPlanner />
      </div>
    </div>
  )
}
