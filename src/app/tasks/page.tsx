'use client'

import { useState } from 'react'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Navigation } from '@/components/layout/navigation'
import { TaskBoard } from '@/components/tasks/task-board'
import { TasksTable } from '@/components/tasks/tasks-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Task, Department, User, TaskTag } from '@/types'

// Mock data for now - this will be replaced with actual Supabase queries
const mockDepartments: Department[] = [
  { id: '1', name: 'Kostüme', description: 'Costume design and wardrobe', color: '#ec4899', created_at: '2024-01-01' },
  { id: '2', name: 'Requisiten', description: 'Props management', color: '#8b5cf6', created_at: '2024-01-01' },
  { id: '3', name: 'Technik', description: 'Technical production', color: '#10b981', created_at: '2024-01-01' },
  { id: '4', name: 'Administrative', description: 'Production admin', color: '#6b7280', created_at: '2024-01-01' }
]

const mockUsers: User[] = [
  { id: '1', email: 'liza@theater.com', full_name: 'Liza', created_at: '2024-01-01' },
  { id: '2', email: 'tanja@theater.com', full_name: 'Tanja', created_at: '2024-01-01' },
  { id: '3', email: 'werner.d@theater.com', full_name: 'Werner D.', created_at: '2024-01-01' }
]

const mockTags: TaskTag[] = [
  { id: '1', name: 'neu-besetzt', color: '#f97316', created_at: '2024-01-01' },
  { id: '2', name: 'dringend', color: '#ef4444', created_at: '2024-01-01' },
  { id: '3', name: 'reparatur', color: '#ef4444', created_at: '2024-01-01' },
  { id: '4', name: 'bestellung', color: '#3b82f6', created_at: '2024-01-01' }
]

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Vampire Kostüm für Toska',
    description: 'Neues Kostüm für neu besetzte Rolle erstellen',
    status: 'not_started',
    priority: 'high',
    due_date: '2024-12-15',
    department_id: '1',
    assigned_to: '1',
    created_by: '1',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    department: mockDepartments[0],
    assignee: mockUsers[0],
    tags: [mockTags[0], mockTags[1]]
  },
  {
    id: '2',
    title: 'Servierwagen Griff reparieren',
    description: 'Griff am Servierwagen ist kaputt und muss repariert werden',
    status: 'in_progress',
    priority: 'medium',
    due_date: '2024-12-10',
    department_id: '2',
    assigned_to: '1',
    created_by: '1',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    department: mockDepartments[1],
    assignee: mockUsers[0],
    tags: [mockTags[2]]
  },
  {
    id: '3',
    title: 'Video Wall vorprogrammieren',
    description: 'Beide Video Walls für die Aufführung programmieren',
    status: 'not_started',
    priority: 'urgent',
    due_date: '2024-12-20',
    department_id: '3',
    assigned_to: '3',
    created_by: '1',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    department: mockDepartments[2],
    assignee: mockUsers[2]
  },
  {
    id: '4',
    title: 'Inventur abschließen',
    description: 'Vollständige Inventur aller Kostüme und Requisiten',
    status: 'done',
    priority: 'medium',
    department_id: '4',
    assigned_to: '1',
    created_by: '1',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    department: mockDepartments[3],
    assignee: mockUsers[0]
  },
  {
    id: '5',
    title: 'Batterien für Kerzen bestellen',
    description: 'LED Kerzen brauchen neue Batterien',
    status: 'blocked',
    priority: 'low',
    due_date: '2024-12-12',
    department_id: '2',
    assigned_to: '2',
    created_by: '1',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    department: mockDepartments[1],
    assignee: mockUsers[1],
    tags: [mockTags[3]]
  }
]

export default function TasksPage() {
  const [viewMode, setViewMode] = useState<'board' | 'table'>('board')

  const totalTasks = mockTasks.length
  const statusCounts = mockTasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const priorityCounts = mockTasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <ProtectedRoute>
      <Navigation />
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Aufgaben</h1>
            <p className="text-muted-foreground">
              Verwalte Aufgaben nach Abteilungen und Status
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'board' ? 'default' : 'outline'}
              onClick={() => setViewMode('board')}
            >
              Kanban Board
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              onClick={() => setViewMode('table')}
            >
              Tabelle
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Gesamt</CardDescription>
              <CardTitle className="text-2xl">{totalTasks}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Zu erledigen</CardDescription>
              <CardTitle className="text-2xl text-gray-600">
                {statusCounts['not_started'] || 0}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>In Bearbeitung</CardDescription>
              <CardTitle className="text-2xl text-blue-600">
                {statusCounts['in_progress'] || 0}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Erledigt</CardDescription>
              <CardTitle className="text-2xl text-green-600">
                {statusCounts['done'] || 0}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Blockiert</CardDescription>
              <CardTitle className="text-2xl text-red-600">
                {statusCounts['blocked'] || 0}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Priority Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Prioritäten Übersicht</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(priorityCounts).map(([priority, count]) => (
                <Badge
                  key={priority}
                  variant="outline"
                  className={
                    priority === 'urgent' ? 'border-red-200 text-red-700' :
                    priority === 'high' ? 'border-orange-200 text-orange-700' :
                    priority === 'medium' ? 'border-yellow-200 text-yellow-700' :
                    'border-gray-200 text-gray-700'
                  }
                >
                  {priority === 'urgent' ? 'Dringend' :
                   priority === 'high' ? 'Hoch' :
                   priority === 'medium' ? 'Mittel' : 'Niedrig'}: {count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Task View */}
        {viewMode === 'board' ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Kanban Board</h2>
            <TaskBoard tasks={mockTasks} />
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Alle Aufgaben</CardTitle>
              <CardDescription>
                Klicke auf die Spaltenüberschriften zum Sortieren
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TasksTable tasks={mockTasks} />
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  )
}