import { ReactNode } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface PageHeaderProps {
  title: string
  description: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  actions?: ReactNode
}

export function PageHeader({
  title,
  description,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Suchen...',
  actions
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="flex items-center gap-4">
        {onSearchChange && (
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}