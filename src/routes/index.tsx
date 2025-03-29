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
    return <p className="text-center text-muted-foreground">Loading knights...</p>
  }

  return (
    <>
      <div className="flex flex-col items-center mb-8 relative">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full blur-sm" />
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Knights Evolution <span className="text-primary">Tracker</span>
        </h1>
        <div className="mt-2 h-1 w-20 bg-gradient-to-r from-chart-1 via-chart-4 to-chart-2" />
      </div>
      
      {knights && knights.length > 0 ? (
        <KnightsDashboard />
      ) : (
        <p className="text-center text-muted-foreground">Loading knights...</p>
      )}
    </>
  )
}
