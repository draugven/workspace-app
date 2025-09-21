import { Badge } from "@/components/ui/badge"
import type { Task } from "@/types"

interface PriorityBadgeProps {
  priority: Task['priority']
}

const priorityConfig = {
  'low': {
    variant: 'outline' as const,
    label: 'Niedrig',
    className: 'bg-gray-50 text-gray-700 border-gray-200'
  },
  'medium': {
    variant: 'secondary' as const,
    label: 'Mittel',
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200'
  },
  'high': {
    variant: 'default' as const,
    label: 'Hoch',
    className: 'bg-orange-50 text-orange-700 border-orange-200'
  },
  'urgent': {
    variant: 'destructive' as const,
    label: 'Dringend',
    className: 'bg-red-50 text-red-700 border-red-200'
  }
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority]

  return (
    <Badge
      variant={config.variant}
      className={config.className}
    >
      {config.label}
    </Badge>
  )
}