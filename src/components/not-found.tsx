import { Link } from '@tanstack/react-router'
import { SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
      <div className="flex items-center justify-center rounded-full bg-muted p-6">
        <SearchX className="h-10 w-10 text-primary" />
      </div>
      <div className="space-y-2">
        <h1 className="text-5xl font-extrabold tracking-tight">404</h1>
        <h2 className="text-xl font-semibold text-gray-900">
          Oops! Page not found
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
      </div>
      <Button asChild>
        <Link to="/dashboard">Back to Dashboard</Link>
      </Button>
    </div>
  )
}
