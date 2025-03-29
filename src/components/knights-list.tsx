import type { Knight } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Shield, Trash2 } from 'lucide-react'
import { Button } from "./ui/button"
import { useKnightsStore } from "@/lib/store"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "./ui/alert-dialog"
import { useEffect } from "react"

interface KnightsListProps {
  knights: Knight[]
  selectedKnightId: string | null
  onSelectKnight: (id: string) => void
}

export function KnightsList({ knights, selectedKnightId, onSelectKnight }: KnightsListProps) {
  const { deleteKnight } = useKnightsStore()

  // Debug logging to help identify selection issues
  useEffect(() => {
    console.log("Selected Knight ID:", selectedKnightId);
  }, [selectedKnightId]);

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
          <div key={knight.nome} className="group relative">
            <Button
              type="button"
              variant={isSelected ? "secondary" : "ghost"}
              className={cn(
                "flex w-full items-center gap-3 p-3 pr-10 rounded-md cursor-pointer transition-all duration-200 hover:scale-[1.01] justify-start text-left",
                isSelected
                  ? "bg-primary/15 border border-primary/25 shadow-sm"
                  : "hover:bg-accent/30 border border-transparent"
              )}
              onClick={() => {
                console.log("Clicked knight:", knight.nome);
                onSelectKnight(knight.nome);
              }}
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
              <div className="flex-1">
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

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 text-destructive cursor-pointer hover:text-destructive-foreground hover:bg-destructive hover:scale-105"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Knight</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {knight.nome}? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => deleteKnight(knight.nome)}
                    className="bg-destructive text-destructive-foreground cursor-pointer hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )
      })}
    </div>
  )
}
