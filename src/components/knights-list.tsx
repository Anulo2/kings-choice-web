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
      <div className="text-center py-8 text-slate-400">
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
                ? "bg-slate-700"
                : "hover:bg-slate-700/50"
            )}
            onClick={() => onSelectKnight(knight.nome)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onSelectKnight(knight.nome)
              }
            }}
          >
            <div className="bg-slate-700 p-2 rounded-full">
              <Shield className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h3 className="font-medium">{knight.nome}</h3>
              <p className="text-xs text-slate-400">
                Level {latestProgress.livello} • Rank {latestProgress.rango}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
