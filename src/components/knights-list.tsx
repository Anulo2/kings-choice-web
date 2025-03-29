import type { Knight } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Shield } from 'lucide-react'
import { Button } from "./ui/button"

interface KnightsListProps {
  knights: Knight[]
  selectedKnightId: string | null
  onSelectKnight: (id: string) => void
}

export function KnightsList({ knights, selectedKnightId, onSelectKnight }: KnightsListProps) {
  if (knights.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No knights added yet</p>
      </div>
    )
  }

  return (
    <div 
      className="space-y-2 max-h-[500px] overflow-y-auto pr-1"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'hsl(var(--primary) / 0.2) transparent',
      }}
    >
      {knights.map((knight) => {
        const latestProgress = knight.andamento[knight.andamento.length - 1]
        const isSelected = selectedKnightId === knight.nome;
        
        return (
          <Button
            key={knight.nome}
            className={cn(
              "flex w-full items-center gap-3 p-3 rounded-md cursor-pointer transition-all duration-200 hover:scale-[1.01]",
              isSelected
                ? "bg-primary/15 border border-primary/25 shadow-sm"
                : "hover:bg-accent/30 border border-transparent"
            )}
            onClick={() => onSelectKnight(knight.nome)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onSelectKnight(knight.nome)
              }
            }}
            tabIndex={0}
            aria-pressed={isSelected}
          >
            <div className={cn(
              "p-2 rounded-full transition-colors",
              isSelected ? "bg-primary/20" : "bg-accent/20"
            )}>
              <Shield className={cn(
                "h-5 w-5 transition-colors",
                isSelected ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <div>
              <h3 className="font-medium">{knight.nome}</h3>
              <div className="flex items-center gap-2 text-xs">
                <span className={cn(
                  "inline-flex items-center",
                  isSelected ? "text-primary" : "text-muted-foreground"
                )}>
                  Level {latestProgress.livello}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="inline-flex items-center text-muted-foreground">
                  Rank {latestProgress.rango}
                </span>
              </div>
            </div>
          </Button>
        )
      })}
    </div>
  )
}
