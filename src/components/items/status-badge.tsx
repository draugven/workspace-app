import { Badge } from "@/components/ui/badge"
import type { Item } from "@/types"

interface StatusBadgeProps {
  status: Item['status']
}

const statusConfig = {
  'erhalten': {
    variant: 'default' as const,
    label: 'Erhalten',
    className: 'bg-green-100 text-green-800 border-green-200'
  },
  'in progress': {
    variant: 'secondary' as const,
    label: 'In Progress',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  'bestellt': {
    variant: 'outline' as const,
    label: 'Bestellt',
    className: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  'verloren': {
    variant: 'destructive' as const,
    label: 'Verloren',
    className: 'bg-red-100 text-red-800 border-red-200'
  },
  'klären': {
    variant: 'outline' as const,
    label: 'Klären',
    className: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  'reparatur benötigt': {
    variant: 'outline' as const,
    label: 'Reparatur',
    className: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  'anpassung benötigt': {
    variant: 'outline' as const,
    label: 'Anpassung',
    className: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  }
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig['klären']

  return (
    <Badge
      variant={config.variant}
      className={config.className}
    >
      {config.label}
    </Badge>
  )
}