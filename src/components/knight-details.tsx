"use client"

import { useState } from "react"
import type { Knight, KnightProgress, Talent } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Sword, Brain, CommandIcon, Heart, Award, Plus } from 'lucide-react'
import { KnightProgressForm } from "@/components/knight-progress-form"
import { useKnightsStore } from "@/lib/store"

interface KnightDetailsProps {
  knight: Knight
}

export function KnightDetails({ knight }: KnightDetailsProps) {
  const [isAddingProgress, setIsAddingProgress] = useState(false)
  const { updateKnight } = useKnightsStore()
  
  const latestProgress = knight.andamento[knight.andamento.length - 1]
  
  const attributeIcons = {
    forza: <Sword className="h-5 w-5" />,
    intelletto: <Brain className="h-5 w-5" />,
    comando: <CommandIcon className="h-5 w-5" />,
    carisma: <Heart className="h-5 w-5" />,
  }
  
  const attributeColors = {
    forza: "text-red-500",
    intelletto: "text-blue-500",
    comando: "text-yellow-500",
    carisma: "text-green-500",
  }

  const handleAddProgress = (newProgress: KnightProgress) => {
    const updatedKnight = {
      ...knight,
      andamento: [...knight.andamento, newProgress]
    }
    updateKnight(updatedKnight)
    setIsAddingProgress(false)
  }

  return (
    <div className="space-y-6">
      {isAddingProgress ? (
        <Card>
          <CardHeader>
            <CardTitle>Add New Progress Entry</CardTitle>
            <CardDescription>Record the latest stats for {knight.nome}</CardDescription>
          </CardHeader>
          <CardContent>
            <KnightProgressForm 
              knight={knight}
              onSave={handleAddProgress}
              onCancel={() => setIsAddingProgress(false)}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Level & Rank</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-3xl font-bold">{latestProgress.livello}</p>
                    <p className="text-sm text-slate-400">Current Level</p>
                  </div>
                  <Badge className="text-lg px-3 py-1 bg-amber-500/20 text-amber-500 border-amber-500/50">
                    Rank {latestProgress.rango}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Power</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{latestProgress.potenza.toLocaleString()}</p>
                <p className="text-sm text-slate-400">Total Power</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Attributes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(latestProgress.attributi_totale).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <span className={attributeColors[key as keyof typeof attributeColors]}>
                          {attributeIcons[key as keyof typeof attributeIcons]}
                        </span>
                        <span className="capitalize">{key}</span>
                      </div>
                      <span className="font-medium">{value.toLocaleString()}</span>
                    </div>
                    <Progress value={(value / latestProgress.attributi_totali) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Talents</CardTitle>
              <Badge variant="outline">{latestProgress.talenti_totali} Total</Badge>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="grid grid-cols-5 mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="forza">Strength</TabsTrigger>
                  <TabsTrigger value="intelletto">Intellect</TabsTrigger>
                  <TabsTrigger value="comando">Command</TabsTrigger>
                  <TabsTrigger value="carisma">Charisma</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {latestProgress.talenti.map((talent) => (
                      <TalentCard key={talent.nome} talent={talent} />
                    ))}
                  </div>
                </TabsContent>
                
                {["forza", "intelletto", "comando", "carisma"].map((type) => (
                  <TabsContent key={type} value={type} className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {latestProgress.talenti
                        .filter((t) => t.genere === type)
                        .map((talent) => (
                          <TalentCard key={talent.nome} talent={talent} />
                        ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button onClick={() => setIsAddingProgress(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Progress Entry
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

function TalentCard({ talent }: { talent: Talent }) {
  const typeColors = {
    forza: "border-red-500/20 bg-red-500/10",
    intelletto: "border-blue-500/20 bg-blue-500/10",
    comando: "border-yellow-500/20 bg-yellow-500/10",
    carisma: "border-green-500/20 bg-green-500/10",
  }
  
  return (
    <div className={`p-3 rounded-md border ${typeColors[talent.genere as keyof typeof typeColors]}`}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{talent.nome}</h4>
          <p className="text-xs text-slate-400 capitalize">{talent.genere}</p>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-amber-400 font-bold">+{talent.buff}%</span>
        </div>
      </div>
      <div className="flex justify-between items-center mt-2">
        <div className="flex">
          {Array.from({ length: talent.stelle }).map((_, i) => (
            <Award key={`${talent.nome}-star-${i}`} className="h-4 w-4 text-amber-400" />
          ))}
          {Array.from({ length: 5 - talent.stelle }).map((_, i) => (
            <Award key={`${talent.nome}-empty-${i}`} className="h-4 w-4 text-slate-600" />
          ))}
        </div>
        <Badge variant="outline">Lvl {talent.livello}</Badge>
      </div>
    </div>
  )
}
