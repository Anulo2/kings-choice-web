"use client"

import { useKnightsStore } from "@/lib/store"
import { Button } from "./ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "./ui/dialog"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "./ui/dropdown-menu"
import { Download, Upload, Settings2, Info, AlertCircle } from "lucide-react"
import { useRef, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import type { Knight } from "@/lib/types"

export function DataManagement() {
  const { knights, loadKnights } = useKnightsStore()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const handleExportData = () => {
    try {
      // Create a JSON file with all knights data
      const dataToExport = { cavalieri: knights }
      const jsonString = JSON.stringify(dataToExport, null, 2)
      
      // Create a blob and download link
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      // Create a temporary download link
      const downloadLink = document.createElement('a')
      downloadLink.href = url
      downloadLink.download = `kings-choice-data-${new Date().toISOString().split('T')[0]}.json`
      
      // Trigger download and cleanup
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
      URL.revokeObjectURL(url)
      
      setError(null)
      setSuccess("Data exported successfully!")
    } catch (err) {
      setError("Failed to export data")
      setSuccess(null)
      console.error("Export error:", err)
    }
  }
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  
  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const importedData = JSON.parse(content)
        
        // Basic validation of imported data
        if (!importedData || !Array.isArray(importedData.cavalieri)) {
          throw new Error("Invalid data format")
        }
        
        // Type check imported data
        const isValidKnightData = (data: any): data is Knight[] => {
          return Array.isArray(data) && data.every(knight => 
            typeof knight === 'object' && 
            knight !== null &&
            typeof knight.nome === 'string' &&
            Array.isArray(knight.andamento)
          )
        }
        
        if (!isValidKnightData(importedData.cavalieri)) {
          throw new Error("Invalid knights data format")
        }
        
        // Import the data
        loadKnights(importedData.cavalieri)
        setError(null)
        setSuccess(`Successfully imported ${importedData.cavalieri.length} knights!`)
      } catch (err) {
        setError("Failed to import data: Invalid or corrupted file")
        setSuccess(null)
        console.error("Import error:", err)
      }
    }
    
    reader.onerror = () => {
      setError("Failed to read file")
      setSuccess(null)
    }
    
    reader.readAsText(file)
    
    // Reset file input
    if (event.target) {
      event.target.value = ''
    }
  }
  
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            className="h-8 w-8"
          >
            <Settings2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Data Management</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <Upload className="h-4 w-4 mr-2" />
              Import Data
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Data</DialogTitle>
          <DialogDescription>
            Import knights data from a JSON file. This will replace all your current data.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              Importing will replace all your current knights. Make sure to export your current data first if you want to keep it.
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-md">
            <Info className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-center text-muted-foreground mb-4">
              Click to select a JSON file with knights data
            </p>
            <Button
              onClick={handleImportClick}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Select File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert variant="success">
              <Info className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" type="button" className="w-full sm:w-auto">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}