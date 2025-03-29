"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { KnightsList } from "@/components/knights-list"
import { KnightDetails } from "@/components/knight-details"
import { KnightCharts } from "@/components/knight-charts"
import { KnightForm } from "@/components/knight-form"
import { Button } from "@/components/ui/button"
import { PlusCircle, ShieldIcon } from 'lucide-react'
import { useKnightsStore } from "@/lib/store"
import { cn } from "@/lib/utils"

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
      <div className="lg:col-span-1">
        <div className="bg-card rounded-lg border border-border/60 shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-transparent p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <ShieldIcon className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Knights</h2>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsAddingKnight(true)}
                className="flex items-center gap-1 border-primary/50 hover:bg-primary/10 cursor-pointer transition-all duration-200 hover:shadow-sm"
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
        </div>
      </div>
      
      <div className="lg:col-span-3">
        {isAddingKnight ? (
          <div className="bg-card rounded-lg border border-border/60 shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-6 w-1 bg-primary rounded" />
              <h2 className="text-xl font-bold">Add New Knight</h2>
            </div>
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
          <div className="bg-card rounded-lg border border-border/60 shadow-md overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b border-border">
                <div className="w-full px-6 pt-6">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="flex items-center justify-center p-2 h-10 w-10 rounded-full bg-primary/10">
                      <ShieldIcon className="h-5 w-5 text-primary" />
                    </span>
                    <h2 className="text-2xl font-bold">{selectedKnight.nome}</h2>
                  </div>
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="overview" className="cursor-pointer hover:bg-background/80">Overview</TabsTrigger>
                    <TabsTrigger value="details" className="cursor-pointer hover:bg-background/80">Details</TabsTrigger>
                    <TabsTrigger value="projections" className="cursor-pointer hover:bg-background/80">Projections</TabsTrigger>
                  </TabsList>
                </div>
              </div>
              
              <TabsContent value="overview" className="p-6">
                <KnightDetails knight={selectedKnight} />
              </TabsContent>
              
              <TabsContent value="details" className="p-6">
                <KnightCharts knight={selectedKnight} />
              </TabsContent>
              
              <TabsContent value="projections" className="p-6">
                <KnightCharts knight={selectedKnight} showProjections />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="bg-card rounded-lg border border-border/60 shadow-md p-6 flex items-center justify-center h-64">
            <div className="text-center">
              <ShieldIcon className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">Select a knight or add a new one to get started</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
