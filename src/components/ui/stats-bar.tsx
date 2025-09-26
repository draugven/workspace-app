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
    <div className="flex flex-wrap items-center gap-4 py-2 px-3 bg-muted/30 rounded-lg">
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-sm font-medium">{stat.label}</span>
          <span className={`text-lg font-semibold ${stat.className || ''}`}>
            {stat.value}
          </span>
        </div>
      ))}

      {badges.length > 0 && (
        <>
          <div className="h-4 w-px bg-border mx-2" />
          <div className="flex flex-wrap gap-2">
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