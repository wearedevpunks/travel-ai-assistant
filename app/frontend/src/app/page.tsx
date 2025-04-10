import { TravelPlanner } from "@/features/travel-planner"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen p-4 pb-8 font-[family-name:var(--font-geist-sans)]">
      <div className="flex-1 w-full max-w-6xl mx-auto">
        <TravelPlanner />
      </div>

      <footer className="mt-4 text-center text-sm text-gray-500"></footer>
    </div>
  )
}
