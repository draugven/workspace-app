import { Badge } from "@/components/ui/badge"
import type { Task } from "@/types"

interface TaskStatusBadgeProps {
  status: Task['status']
}

const statusConfig = {
  'not_started': {
    variant: 'outline' as const,
    label: 'Nicht begonnen',
    className: 'bg-gray-100 text-gray-800 border-gray-200'
  },
  'in_progress': {
    variant: 'default' as const,
    label: 'In Bearbeitung',
    className: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  'done': {
    variant: 'default' as const,
    label: 'Erledigt',
    className: 'bg-green-100 text-green-800 border-green-200'
  },
  'blocked': {
    variant: 'destructive' as const,
    label: 'Blockiert',
    className: 'bg-red-100 text-red-800 border-red-200'
  }
}

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <Badge
      variant={config.variant}
      className={config.className}
    >
      {config.label}
    </Badge>
  )
}