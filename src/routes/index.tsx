import { createFileRoute } from '@tanstack/react-router'

import { useEffect } from "react"
import { KnightsDashboard } from "@/components/knights-dashboard"
import { useKnightsStore } from "@/lib/store"
import { initialData } from "@/lib/initial-data"

export const Route = createFileRoute('/')({
  component: Home,
})



export default function Home() {
  const { knights, loadKnights } = useKnightsStore()

  useEffect(() => {
    // Load knights from store or initialize with sample data
    if ((!knights || knights.length === 0)) {
      loadKnights(initialData.cavalieri)
      console.log("Loading initial knights data")
    }
  }, [knights, loadKnights])

  if (!knights) {
    return <p className="text-center text-slate-400">Loading knights...</p>
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Knights Evolution Tracker</h1>
        {knights && knights.length > 0 ? (
          <KnightsDashboard />
        ) : (
          <p className="text-center text-slate-400">Loading knights...</p>
        )}
      </div>
    </main>
  )
}
