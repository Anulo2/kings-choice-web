import { Link } from '@tanstack/react-router'
import { ThemeToggle } from '@/components/theme-toggle'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ShieldIcon } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-10 p-2 flex gap-2 bg-card text-card-foreground border-b border-border justify-between">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShieldIcon className="h-5 w-5 text-primary" />
          <Link to="/" className="font-bold text-lg">
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
