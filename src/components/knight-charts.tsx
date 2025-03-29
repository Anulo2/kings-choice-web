"use client"

import { useMemo } from "react"
import type { Knight } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, Bar, BarChart, Line, LineChart, XAxis, YAxis } from "recharts"
import { calculateProjections } from "@/lib/projections"

interface KnightChartsProps {
  knight: Knight
  showProjections?: boolean
}

export function KnightCharts({ knight, showProjections = false }: KnightChartsProps) {
  const chartData = useMemo(() => {
    return knight.andamento.map((progress, index) => ({
      name: `Entry ${index + 1}`,
      level: progress.livello,
      power: progress.potenza,
      forza: progress.attributi_totale.forza,
      intelletto: progress.attributi_totale.intelletto,
      comando: progress.attributi_totale.comando,
      carisma: progress.attributi_totale.carisma,
      totalAttributes: progress.attributi_totali,
    }))
  }, [knight])
  
  const projectionData = useMemo(() => {
    if (!showProjections) return []
    return calculateProjections(knight, 10)
  }, [knight, showProjections])
  
  const combinedData = [...chartData, ...projectionData]
  
  const attributeConfig = {
    forza: {
      label: "Strength",
      theme: {
        light: "hsl(var(--chart-1))",
        dark: "hsl(var(--chart-1))",
      },
    },
    intelletto: {
      label: "Intellect",
      theme: {
        light: "hsl(var(--chart-2))",
        dark: "hsl(var(--chart-2))",
      },
    },
    comando: {
      label: "Command",
      theme: {
        light: "hsl(var(--chart-3))",
        dark: "hsl(var(--chart-3))",
      },
    },
    carisma: {
      label: "Charisma",
      theme: {
        light: "hsl(var(--chart-4))",
        dark: "hsl(var(--chart-4))",
      },
    },
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="attributes">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="attributes">Attributes</TabsTrigger>
          <TabsTrigger value="power">Power</TabsTrigger>
          <TabsTrigger value="level">Level</TabsTrigger>
        </TabsList>
        
        <TabsContent value="attributes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Attributes Evolution</CardTitle>
              <CardDescription>
                {showProjections 
                  ? "Historical data and future projections of attributes" 
                  : "Historical evolution of attributes"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer config={attributeConfig}>
                  <LineChart data={combinedData}>
                    <XAxis 
                      dataKey="name" 
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                    />
                    <YAxis 
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="forza" 
                      stroke="var(--color-forza)" 
                      strokeWidth={2}
                      dot={!showProjections}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="intelletto" 
                      stroke="var(--color-intelletto)" 
                      strokeWidth={2}
                      dot={!showProjections}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="comando" 
                      stroke="var(--color-comando)" 
                      strokeWidth={2}
                      dot={!showProjections}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="carisma" 
                      stroke="var(--color-carisma)" 
                      strokeWidth={2}
                      dot={!showProjections}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Attributes Distribution</CardTitle>
              <CardDescription>
                Current distribution of attributes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer config={attributeConfig}>
                  <BarChart data={[knight.andamento[knight.andamento.length - 1]]}>
                    <XAxis dataKey="name" hide />
                    <YAxis hide />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="forza" fill="var(--color-forza)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="intelletto" fill="var(--color-intelletto)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="comando" fill="var(--color-comando)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="carisma" fill="var(--color-carisma)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="power" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Power Evolution</CardTitle>
              <CardDescription>
                {showProjections 
                  ? "Historical data and future projections of power" 
                  : "Historical evolution of power"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer config={{}}>
                  <AreaChart data={combinedData}>
                    <XAxis 
                      dataKey="name" 
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                    />
                    <YAxis 
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area 
                      type="monotone" 
                      dataKey="power" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary)/0.2)" 
                      strokeWidth={2}
                      dot={!showProjections}
                      activeDot={{ r: 6 }}
                    />
                  </AreaChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="level" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Level Progression</CardTitle>
              <CardDescription>
                {showProjections 
                  ? "Historical data and future projections of level" 
                  : "Historical evolution of level"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer config={{}}>
                  <LineChart data={combinedData}>
                    <XAxis 
                      dataKey="name" 
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                    />
                    <YAxis 
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="level" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={!showProjections}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
