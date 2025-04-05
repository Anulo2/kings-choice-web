import { createFileRoute } from '@tanstack/react-router'

import { useEffect, useState } from "react"
import { KnightsDashboard } from "@/components/knights-dashboard"
import { useKnightsStore } from "@/lib/store"

export const Route = createFileRoute('/')({
  component: Home,
})

export default function Home() {
  const { knights, loadKnights } = useKnightsStore()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load knights from store or initialize with sample data from JSON file
    if ((!knights || knights.length === 0)) {
      setIsLoading(true)
      setError(null)
      
      // Use relative path to access the JSON in public folder
      fetch('./initial-data.json')
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to load initial data')
          }
          return response.json()
        })
        .then(data => {
          loadKnights(data.cavalieri)
          console.log("Initial knights data loaded from JSON")
        })
        .catch(err => {
          console.error("Error loading initial data:", err)
          setError("Failed to load initial data. Please try again later.")
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [knights, loadKnights])

  if (isLoading) {
    return <p className="text-center text-muted-foreground">Loading knights data...</p>
  }
  
  if (error) {
    return <p className="text-center text-destructive">{error}</p>
  }
  
  if (!knights) {
    return <p className="text-center text-muted-foreground">No knights data available</p>
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
