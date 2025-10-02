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
    <div className="space-y-4">
      {/* Title Section and Actions - desktop: same line, mobile: stacked */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        {/* Title Section */}
        <div className="flex-shrink-0">
          <h1 className="text-h3 text-foreground">{title}</h1>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 lg:flex-shrink-0">
          {onSearchChange && (
            <div className="relative flex-1 max-w-md">
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
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}