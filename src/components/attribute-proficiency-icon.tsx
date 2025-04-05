"use client"

import { cn } from "@/lib/utils"
import { Sword, BookOpen, Handshake, Flag, SquareAsterisk } from "lucide-react"

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
    intelletto: <BookOpen className={sizeClasses[size]} />,
    comando: <Handshake className={sizeClasses[size]} />,
    carisma: <Flag className={sizeClasses[size]} />
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
  
  // Special case: All 4 attributes - use square-asterisk icon
  if (uniqueAttributes.length === 4) {
    return (
      <div className={cn("relative flex items-center justify-center", className)}>
        <SquareAsterisk className={cn(
          sizeClasses[size], 
          "text-primary font-bold",
          className
        )} />
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