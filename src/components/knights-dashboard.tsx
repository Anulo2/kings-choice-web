"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { KnightsList } from "@/components/knights-list"
import { KnightDetails } from "@/components/knight-details"
import { KnightCharts } from "@/components/knight-charts"
import { KnightForm } from "@/components/knight-form"
import { Button } from "@/components/ui/button"
import { PlusCircle } from 'lucide-react'
import { useKnightsStore } from "@/lib/store"

export function KnightsDashboard() {
  const { knights } = useKnightsStore()
  const [selectedKnightId, setSelectedKnightId] = useState<string | null>(
    knights.length > 0 ? knights[0].nome : null
  )
  const [activeTab, setActiveTab] = useState("overview")
  const [isAddingKnight, setIsAddingKnight] = useState(false)

  const selectedKnight = knights.find(knight => knight.nome === selectedKnightId) || null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1 bg-slate-800 rounded-lg p-4 h-fit">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Knights</h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsAddingKnight(true)}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add</span>
          </Button>
        </div>
        <KnightsList 
          knights={knights} 
          selectedKnightId={selectedKnightId}
          onSelectKnight={setSelectedKnightId}
        />
      </div>
      
      <div className="lg:col-span-3">
        {isAddingKnight ? (
          <div className="bg-slate-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Add New Knight</h2>
            <KnightForm 
              onCancel={() => setIsAddingKnight(false)}
              onComplete={() => {
                setIsAddingKnight(false)
                if (knights.length > 0) {
                  setSelectedKnightId(knights[knights.length - 1].nome)
                }
              }}
            />
          </div>
        ) : selectedKnight ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="projections">Projections</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-0">
              <div className="bg-slate-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6">{selectedKnight.nome}</h2>
                <KnightDetails knight={selectedKnight} />
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="mt-0">
              <div className="bg-slate-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6">{selectedKnight.nome} - Evolution</h2>
                <KnightCharts knight={selectedKnight} />
              </div>
            </TabsContent>
            
            <TabsContent value="projections" className="mt-0">
              <div className="bg-slate-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6">{selectedKnight.nome} - Projections</h2>
                <KnightCharts knight={selectedKnight} showProjections />
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="bg-slate-800 rounded-lg p-6 flex items-center justify-center h-64">
            <p className="text-slate-400">Select a knight or add a new one to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}
