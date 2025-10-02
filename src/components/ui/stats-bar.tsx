import { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'

interface StatItem {
  label: string | ReactNode
  value: number | string
  className?: string
}

interface StatsBadge {
  text: string
  className?: string
}

interface StatsBarProps {
  stats: StatItem[]
  badges?: StatsBadge[]
}

export function StatsBar({ stats, badges = [] }: StatsBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 py-2 px-3 bg-muted/30 rounded-lg">
      {/* Stats - single line on mobile with compact spacing, normal flex-wrap on desktop */}
      <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto sm:overflow-x-visible w-full sm:w-auto">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-1 sm:gap-2 whitespace-nowrap shrink-0">
            <span className="text-xs sm:text-sm font-medium">{stat.label}</span>
            <span className={`text-sm sm:text-lg font-semibold ${stat.className || ''}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {badges.length > 0 && (
        <>
          <div className="hidden sm:block h-4 w-px bg-border mx-2" />
          <div className="flex flex-wrap gap-1 sm:gap-2 w-full sm:w-auto">
            {badges.map((badge, index) => (
              <Badge
                key={index}
                variant="outline"
                className={`text-xs ${badge.className || ''}`}
              >
                {badge.text}
              </Badge>
            ))}
          </div>
        </>
      )}
    </div>
  )
}