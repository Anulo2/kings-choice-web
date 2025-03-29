"use client"

import { Moon, Sun, Monitor } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="border-primary/20 cursor-pointer hover:bg-primary/10"
          style={{ background: 'transparent', transition: 'all 300ms' }}
        >
          <Sun 
            className="h-[1.2rem] w-[1.2rem]" 
            style={{
              transform: theme === 'dark' ? 'rotate(-90deg) scale(0)' : 'rotate(0) scale(1)',
              transition: 'all 300ms'
            }} 
          />
          <Moon 
            className="absolute h-[1.2rem] w-[1.2rem]" 
            style={{
              transform: theme === 'dark' ? 'rotate(0) scale(1)' : 'rotate(90deg) scale(0)',
              transition: 'all 300ms'
            }}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
          <Sun className="h-4 w-4 mr-2" style={{ color: 'hsl(var(--chart-5))' }} /> Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
          <Moon className="h-4 w-4 mr-2" style={{ color: 'hsl(var(--chart-1))' }} /> Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
          <Monitor className="h-4 w-4 mr-2" style={{ color: 'hsl(var(--chart-3))' }} /> System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
