import type { Knight } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Shield } from 'lucide-react'

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
    <div className="space-y-2">
      {knights.map((knight) => {
        const latestProgress = knight.andamento[knight.andamento.length - 1]
        
        return (
          <div
            key={knight.nome}
            className={cn(
              "flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors",
              selectedKnightId === knight.nome
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent/50"
            )}
            onClick={() => onSelectKnight(knight.nome)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onSelectKnight(knight.nome)
              }
            }}
          >
            <div className="bg-accent p-2 rounded-full">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{knight.nome}</h3>
              <p className="text-xs text-muted-foreground">
                Level {latestProgress.livello} • Rank {latestProgress.rango}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
