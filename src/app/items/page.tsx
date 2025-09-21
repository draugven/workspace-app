import { ProtectedRoute } from '@/components/auth/protected-route'
import { Navigation } from '@/components/layout/navigation'
import { ItemsTable } from '@/components/items/items-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Item } from '@/types'

// Mock data for now - this will be replaced with actual Supabase queries
const mockItems: Item[] = [
  {
    id: '1',
    name: 'Gladstone-Koffer',
    type: 'prop',
    scene: '1',
    status: 'erhalten',
    is_consumable: false,
    needs_clarification: false,
    needed_for_rehearsal: true,
    source: 'Staatstheater',
    notes: '',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    category: { id: '1', name: 'Taschen & Koffer', type: 'both', created_at: '2024-01-01' },
    characters: [{ id: '1', name: 'Jonathan Harker', created_at: '2024-01-01' }]
  },
  {
    id: '2',
    name: 'Sarg',
    type: 'prop',
    scene: '5',
    status: 'klären',
    is_consumable: false,
    needs_clarification: true,
    needed_for_rehearsal: false,
    notes: 'Mechanismus zum verschwinden?',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    category: { id: '2', name: 'Möbel', type: 'prop', created_at: '2024-01-01' },
    characters: [{ id: '2', name: 'Dracula', created_at: '2024-01-01' }]
  },
  {
    id: '3',
    name: 'Brautstrauß',
    type: 'prop',
    status: 'in progress',
    is_consumable: false,
    needs_clarification: false,
    needed_for_rehearsal: true,
    source: 'Gekauft',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    category: { id: '3', name: 'Floristik', type: 'prop', created_at: '2024-01-01' },
    characters: [{ id: '3', name: 'Lucy Westenra', created_at: '2024-01-01' }]
  },
  {
    id: '4',
    name: 'Hochzeitsschleier',
    type: 'costume',
    status: 'in progress',
    is_consumable: false,
    needs_clarification: false,
    needed_for_rehearsal: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    category: { id: '4', name: 'Accessoires', type: 'both', created_at: '2024-01-01' },
    characters: [{ id: '3', name: 'Lucy Westenra', created_at: '2024-01-01' }]
  },
  {
    id: '5',
    name: 'Zigarre',
    type: 'prop',
    status: 'verloren',
    is_consumable: true,
    needs_clarification: false,
    needed_for_rehearsal: true,
    source: 'Produziert',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    category: { id: '5', name: 'Essen & Trinken', type: 'prop', created_at: '2024-01-01' },
    characters: [{ id: '4', name: 'Quincey Morris', created_at: '2024-01-01' }]
  }
]

export default function ItemsPage() {
  const totalItems = mockItems.length
  const propCount = mockItems.filter(item => item.type === 'prop').length
  const costumeCount = mockItems.filter(item => item.type === 'costume').length
  const statusCounts = mockItems.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <ProtectedRoute>
      <Navigation />
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Props & Kostüme</h1>
            <p className="text-muted-foreground">
              Verwalte Requisiten und Kostüme für die Produktion
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Gesamt</CardDescription>
              <CardTitle className="text-2xl">{totalItems}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Requisiten</CardDescription>
              <CardTitle className="text-2xl">{propCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Kostüme</CardDescription>
              <CardTitle className="text-2xl">{costumeCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Erhalten</CardDescription>
              <CardTitle className="text-2xl text-green-600">
                {statusCounts['erhalten'] || 0}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Status Übersicht</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center gap-2">
                  <Badge variant="outline" className="text-sm">
                    {status}: {count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Items Table */}
        <Card>
          <CardHeader>
            <CardTitle>Alle Items</CardTitle>
            <CardDescription>
              Klicke auf die Spaltenüberschriften zum Sortieren
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ItemsTable items={mockItems} />
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}