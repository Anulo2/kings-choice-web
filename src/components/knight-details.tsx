"use client"

import { useState } from "react"
import type { Knight, KnightProgress, Talent } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Sword, Brain, CommandIcon, Heart, Award, Plus, User, Pencil } from 'lucide-react'
import { KnightProgressForm } from "@/components/knight-progress-form"
import { KnightProfileEdit } from "@/components/knight-profile-edit"
import { AttributeProficiencyIcon } from "@/components/attribute-proficiency-icon"
import { useKnightsStore } from "@/lib/store"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface KnightDetailsProps {
  knight: Knight
}

export function KnightDetails({ knight }: KnightDetailsProps) {
  const [isAddingProgress, setIsAddingProgress] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const { updateKnight } = useKnightsStore()
  
  const latestProgress = knight.andamento[knight.andamento.length - 1]
  
  const attributeIcons = {
    forza: <Sword className="h-5 w-5" />,
    intelletto: <Brain className="h-5 w-5" />,
    comando: <CommandIcon className="h-5 w-5" />,
    carisma: <Heart className="h-5 w-5" />,
  }
  
  const attributeColors = {
    forza: "text-chart-1",
    intelletto: "text-chart-2",
    comando: "text-chart-3",
    carisma: "text-chart-4",
  }

  const handleAddProgress = (newProgress: KnightProgress) => {
    const updatedKnight = {
      ...knight,
      andamento: [...knight.andamento, newProgress]
    }
    updateKnight(updatedKnight)
    setIsAddingProgress(false)
  }
  
  const handleSaveProfile = (profileData: { foto?: string; attributiProficienti: string[] }) => {
    const updatedKnight = {
      ...knight,
      foto: profileData.foto,
      attributiProficienti: profileData.attributiProficienti
    }
    updateKnight(updatedKnight)
    setIsEditingProfile(false)
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
      ) : isEditingProfile ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Knight Profile</CardTitle>
            <CardDescription>Update {knight.nome}'s image and proficient attributes</CardDescription>
          </CardHeader>
          <CardContent>
            <KnightProfileEdit 
              knight={knight}
              onSave={handleSaveProfile}
              onCancel={() => setIsEditingProfile(false)}
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
                    <p className="text-sm text-muted-foreground">Current Level</p>
                  </div>
                  <Badge className="text-lg px-3 py-1 bg-primary/20 text-primary border-primary/50">
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
                <p className="text-sm text-muted-foreground">Total Power</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Knight Profile</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsEditingProfile(true)}
                className="h-8 w-8 p-0"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-4 items-center">
              <div className="w-24 h-24 relative rounded-full overflow-hidden border-2 border-primary">
                {knight.foto ? (
                  <img 
                    src={knight.foto} 
                    alt={knight.nome} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <User className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center md:items-start">
                <h3 className="font-bold text-xl">{knight.nome}</h3>
                {knight.attributiProficienti?.length > 0 && (
                  <div className="flex items-center gap-3 mt-2">
                    <AttributeProficiencyIcon attributes={knight.attributiProficienti} size="md" />
                    <div className="flex flex-wrap gap-1">
                      {knight.attributiProficienti.map((attr) => (
                        <Badge key={attr} variant="outline" className={`${attributeColors[attr]} border-${attributeColors[attr].replace('text-', '')}/30`}>
                          <span className="flex items-center gap-1">
                            {attributeIcons[attr]}
                            <span className="capitalize">{attr}</span>
                          </span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Attributes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(latestProgress.attributi_totale).map(([key, value]) => {
                  const isProficient = knight.attributiProficienti?.includes(key);
                  return (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            attributeColors[key as keyof typeof attributeColors],
                            isProficient && "font-bold"
                          )}>
                            {attributeIcons[key as keyof typeof attributeIcons]}
                          </span>
                          <span className={cn(
                            "capitalize", 
                            isProficient && "font-semibold"
                          )}>
                            {key}{isProficient && " ★"}
                          </span>
                        </div>
                        <span className="font-medium">{value.toLocaleString()}</span>
                      </div>
                      <Progress 
                        value={(value / latestProgress.attributi_totali) * 100} 
                        className={cn(
                          "h-2",
                          isProficient && "bg-primary/20"
                        )} 
                      />
                    </div>
                  );
                })}
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
                
                <TabsContent value="forza" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {latestProgress.talenti
                      .filter((t) => t.genere === "forza")
                      .map((talent) => (
                        <TalentCard key={talent.nome} talent={talent} />
                      ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="intelletto" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {latestProgress.talenti
                      .filter((t) => t.genere === "intelletto")
                      .map((talent) => (
                        <TalentCard key={talent.nome} talent={talent} />
                      ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="comando" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {latestProgress.talenti
                      .filter((t) => t.genere === "comando")
                      .map((talent) => (
                        <TalentCard key={talent.nome} talent={talent} />
                      ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="carisma" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {latestProgress.talenti
                      .filter((t) => t.genere === "carisma")
                      .map((talent) => (
                        <TalentCard key={talent.nome} talent={talent} />
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button 
              variant="outline"
              onClick={() => setIsEditingProfile(true)}
              className="flex items-center gap-2"
            >
              <Pencil className="h-4 w-4" />
              Edit Profile
            </Button>
            <Button onClick={() => setIsAddingProgress(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Progress Entry
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

function TalentCard({ talent }: { talent: Talent }) {
  const typeColorMap = {
    forza: {
      bgGradient: "from-chart-1/20 to-chart-1/5",
      borderColor: "hsl(var(--chart-1) / 0.3)",
      textColor: "hsl(var(--chart-1))"
    },
    intelletto: {
      bgGradient: "from-chart-2/20 to-chart-2/5",
      borderColor: "hsl(var(--chart-2) / 0.3)",
      textColor: "hsl(var(--chart-2))"
    },
    comando: {
      bgGradient: "from-chart-3/20 to-chart-3/5",
      borderColor: "hsl(var(--chart-3) / 0.3)",
      textColor: "hsl(var(--chart-3))"
    },
    carisma: {
      bgGradient: "from-chart-4/20 to-chart-4/5",
      borderColor: "hsl(var(--chart-4) / 0.3)",
      textColor: "hsl(var(--chart-4))"
    },
    // Map English names to match the talent form options
    strength: {
      bgGradient: "from-chart-1/20 to-chart-1/5",
      borderColor: "hsl(var(--chart-1) / 0.3)",
      textColor: "hsl(var(--chart-1))"
    },
    intellect: {
      bgGradient: "from-chart-2/20 to-chart-2/5",
      borderColor: "hsl(var(--chart-2) / 0.3)",
      textColor: "hsl(var(--chart-2))"
    },
    command: {
      bgGradient: "from-chart-3/20 to-chart-3/5",
      borderColor: "hsl(var(--chart-3) / 0.3)",
      textColor: "hsl(var(--chart-3))"
    },
    charisma: {
      bgGradient: "from-chart-4/20 to-chart-4/5",
      borderColor: "hsl(var(--chart-4) / 0.3)",
      textColor: "hsl(var(--chart-4))"
    },
    // Fallback for "other" or any unrecognized type
    other: {
      bgGradient: "from-muted/20 to-muted/5",
      borderColor: "hsl(var(--muted) / 0.3)",
      textColor: "hsl(var(--muted-foreground))"
    }
  }
  
  // Get colors from map or use the "other" fallback if type doesn't exist
  const colors = typeColorMap[talent.genere as keyof typeof typeColorMap] || typeColorMap.other;
  
  return (
    <div 
      className={`p-3 rounded-md border bg-gradient-to-br ${colors.bgGradient} cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.01]`}
      style={{ borderColor: colors.borderColor }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{talent.nome}</h4>
          <p className="text-xs capitalize" style={{ color: colors.textColor }}>{talent.genere}</p>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-primary font-bold">+{talent.buff}%</span>
        </div>
      </div>
      <div className="flex justify-between items-center mt-2">
        <div className="flex">
          {Array.from({ length: talent.stelle }).map((_, i) => (
            <Award key={`${talent.nome}-star-${i}`} className="h-4 w-4 text-primary" />
          ))}
          {Array.from({ length: 5 - talent.stelle }).map((_, i) => (
            <Award key={`${talent.nome}-empty-${i}`} className="h-4 w-4 text-muted" />
          ))}
        </div>
        <Badge 
          variant="outline" 
          style={{ color: colors.textColor, borderColor: colors.borderColor }}
        >
          Lvl {talent.livello}
        </Badge>
      </div>
    </div>
  )
}
