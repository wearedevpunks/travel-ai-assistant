import { TravelPlanner } from "@/features/travel-planner"
import { Title } from "@/components/atoms/Title"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen p-4 pb-8 font-[family-name:var(--font-geist-sans)]">
      <header className="py-4 mb-4 border-b">
        <Title variant="h1" className="text-center">
          Devpunks Travel Assistant
        </Title>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto">
        <TravelPlanner />
      </main>

      <footer className="mt-4 text-center text-sm text-gray-500"></footer>
    </div>
  )
}
