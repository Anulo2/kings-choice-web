"use client"

import { useRef, useState } from "react"
import { User, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  value?: string
  onChange?: (value: string) => void
  maxSizeMB?: number
  disabled?: boolean
}

export function ImageUpload({
  value,
  onChange,
  maxSizeMB = 2,
  disabled = false
}: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024 // Convert MB to bytes
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setError(null)
    
    if (!file) return
    
    // Check file size
    if (file.size > maxSizeBytes) {
      setError(`File size exceeds ${maxSizeMB}MB limit`)
      return
    }
    
    const reader = new FileReader()
    
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      onChange?.(dataUrl)
    }
    
    reader.onerror = () => {
      setError("Error reading file")
    }
    
    reader.readAsDataURL(file)
  }
  
  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  
  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />
      
      <div 
        onClick={handleClick}
        className={cn(
          "border-2 border-dashed rounded-full w-32 h-32 mx-auto overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {value ? (
          <div className="w-full h-full relative">
            <img 
              src={value} 
              alt="Uploaded image"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground p-4">
            <User className="h-12 w-12 mb-2" />
            <Upload className="h-5 w-5" />
            <p className="text-xs mt-1">Upload image</p>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-destructive text-xs text-center">{error}</p>
      )}
      
      {value && !disabled && (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange?.("")}
            className="h-auto text-xs py-1"
          >
            Remove
          </Button>
        </div>
      )}
    </div>
  )
}