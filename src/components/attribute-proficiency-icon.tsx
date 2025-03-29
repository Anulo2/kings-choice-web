"use client"

import { cn } from "@/lib/utils"
import { Sword, Brain, CommandIcon, Heart } from "lucide-react"

type AttributeType = "forza" | "intelletto" | "comando" | "carisma"

interface AttributeProficiencyIconProps {
  attributes: AttributeType[]
  size?: "sm" | "md" | "lg"
  className?: string
}

export function AttributeProficiencyIcon({ 
  attributes, 
  size = "md", 
  className 
}: AttributeProficiencyIconProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  }
  
  const attributeIcons = {
    forza: <Sword className={sizeClasses[size]} />,
    intelletto: <Brain className={sizeClasses[size]} />,
    comando: <CommandIcon className={sizeClasses[size]} />,
    carisma: <Heart className={sizeClasses[size]} />
  }
  
  const attributeColors = {
    forza: "text-chart-1",
    intelletto: "text-chart-2",
    comando: "text-chart-3",
    carisma: "text-chart-4"
  }
  
  const uniqueAttributes = [...new Set(attributes)]
  
  // If no attributes or empty array, return empty
  if (!uniqueAttributes.length) {
    return null
  }
  
  // Special case: All 4 attributes - create diamond icon
  if (uniqueAttributes.length === 4) {
    return (
      <div className={cn("relative", className)} style={{ width: sizeClasses[size].split(" ")[1], height: sizeClasses[size].split(" ")[1] }}>
        {/* Diamond shape divided into 4 quadrants */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
          {/* Top left - Strength */}
          <div className="overflow-hidden flex items-end justify-end border-r border-background">
            <Sword className={cn(sizeClasses[size], attributeColors.forza, "transform translate-x-1/4 translate-y-1/4 scale-75")} />
          </div>
          
          {/* Top right - Intellect */}
          <div className="overflow-hidden flex items-end justify-start border-l border-background">
            <Brain className={cn(sizeClasses[size], attributeColors.intelletto, "transform -translate-x-1/4 translate-y-1/4 scale-75")} />
          </div>
          
          {/* Bottom left - Command */}
          <div className="overflow-hidden flex items-start justify-end border-r border-background">
            <CommandIcon className={cn(sizeClasses[size], attributeColors.comando, "transform translate-x-1/4 -translate-y-1/4 scale-75")} />
          </div>
          
          {/* Bottom right - Charisma */}
          <div className="overflow-hidden flex items-start justify-start border-l border-background">
            <Heart className={cn(sizeClasses[size], attributeColors.carisma, "transform -translate-x-1/4 -translate-y-1/4 scale-75")} />
          </div>
        </div>
      </div>
    )
  }
  
  // For 1-3 attributes, display them in a row
  return (
    <div className={cn("flex items-center", className)}>
      {uniqueAttributes.map((attr) => (
        <div 
          key={attr} 
          className={cn("flex items-center justify-center rounded-full", attributeColors[attr])}
        >
          {attributeIcons[attr]}
        </div>
      ))}
    </div>
  )
}