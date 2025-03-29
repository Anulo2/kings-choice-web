import { Link } from '@tanstack/react-router'
import { ThemeToggle } from '@/components/theme-toggle'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ShieldIcon } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-gradient-to-r from-card via-card/95 to-card border-b border-border shadow-sm">
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        <div className="flex items-center gap-2">
          <ShieldIcon className="h-6 w-6 text-primary" />
          <Link to="/" className="font-bold text-lg text-card-foreground">
            King's Choice Web
          </Link>
        </div>
        <nav className="flex items-center gap-4">
          <Link
            to="/"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "hidden md:flex"
            )}
          >
            Dashboard
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
