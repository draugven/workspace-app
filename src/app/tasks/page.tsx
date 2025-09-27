'use client'

import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Navigation } from '@/components/layout/navigation'
import { TaskBoard } from '@/components/tasks/task-board'
import { TasksTable } from '@/components/tasks/tasks-table'
import { TaskAddDialog } from '@/components/tasks/task-add-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/ui/page-header'
import { StatsBar } from '@/components/ui/stats-bar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Combobox } from '@/components/ui/combobox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { supabase } from '@/lib/supabase'
import { RefreshCw, Plus, Users, Filter, X, Search, ChevronDown, ChevronUp } from 'lucide-react'
import type { Task, Department, TaskTag, User } from '@/types'

// All data is now loaded from Supabase - no mock data needed

export default function TasksPage() {
  const [viewMode, setViewMode] = useState<'board' | 'table'>('board')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null)
  const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null)
  const [filtersExpanded, setFiltersExpanded] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [tags, setTags] = useState<TaskTag[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      // Get current user for privacy filtering
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Load all data in parallel
      const [tasksResponse, departmentsResponse, tagsResponse, usersResponse] = await Promise.all([
        supabase
          .from('tasks')
          .select(`
            *,
            department:departments(*),
            tags:task_tag_assignments(tag:task_tags(*))
          `)
          .or(`is_private.eq.false,and(is_private.eq.true,created_by.eq.${user.id})`)
          .order('updated_at', { ascending: false }),

        supabase
          .from('departments')
          .select('*')
          .order('name'),

        supabase
          .from('task_tags')
          .select('*')
          .order('name'),

        // Fetch all users from our API route
        fetch('/api/users').then(res => res.json())
      ])

      if (tasksResponse.error) throw tasksResponse.error
      if (departmentsResponse.error) throw departmentsResponse.error
      if (tagsResponse.error) throw tagsResponse.error

      // Handle users response (it's already JSON from fetch)
      if (usersResponse.error) {
        console.warn('Could not fetch users:', usersResponse.error)
        setUsers([])
      } else {
        setUsers(usersResponse)
      }

      // Transform tasks data to match our interface
      const transformedTasks: Task[] = (tasksResponse.data || []).map(task => ({
        ...task,
        tags: task.tags?.map((tt: any) => tt.tag) || []
      }))

      setTasks(transformedTasks)
      setDepartments(departmentsResponse.data || [])
      setTags(tagsResponse.data || [])

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleTaskUpdate = async (updatedTask: Task) => {
    try {
      // Update task basic properties
      const { error: taskError } = await supabase
        .from('tasks')
        .update({
          title: updatedTask.title,
          description: updatedTask.description,
          status: updatedTask.status,
          priority: updatedTask.priority,
          due_date: updatedTask.due_date,
          department_id: updatedTask.department_id,
          assigned_to: updatedTask.assigned_to
        })
        .eq('id', updatedTask.id)

      if (taskError) throw taskError

      // Handle tag assignments if tags are provided
      if (updatedTask.tags !== undefined) {
        // First, delete existing tag assignments
        const { error: deleteError } = await supabase
          .from('task_tag_assignments')
          .delete()
          .eq('task_id', updatedTask.id)

        if (deleteError) throw deleteError

        // Then, create new tag assignments
        if (updatedTask.tags.length > 0) {
          const tagAssignments = updatedTask.tags.map(tag => ({
            task_id: updatedTask.id,
            tag_id: tag.id
          }))

          const { error: insertError } = await supabase
            .from('task_tag_assignments')
            .insert(tagAssignments)

          if (insertError) throw insertError
        }
      }

      // Reload tasks to get updated data
      await loadData()
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const handleTaskStatusChange = async (taskId: string, newStatus: Task['status']) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId)

      if (error) throw error

      // Update local state immediately for better UX
      setTasks(prev => prev.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      ))
    } catch (error) {
      console.error('Failed to update task status:', error)
    }
  }

  const handleTaskCreate = async (newTaskData: Partial<Task>) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Create the task with assignee
      const { data: createdTask, error: taskError } = await supabase
        .from('tasks')
        .insert({
          title: newTaskData.title,
          description: newTaskData.description,
          status: newTaskData.status || 'not_started',
          priority: newTaskData.priority || 'medium',
          department_id: newTaskData.department_id,
          due_date: newTaskData.due_date,
          created_by: user.id,
          assigned_to: newTaskData.assigned_to
        })
        .select()
        .single()

      if (taskError) throw taskError

      // Handle tag assignments if tags are provided
      if (newTaskData.tags && newTaskData.tags.length > 0) {
        const tagAssignments = newTaskData.tags.map(tag => ({
          task_id: createdTask.id,
          tag_id: tag.id
        }))

        const { error: tagError } = await supabase
          .from('task_tag_assignments')
          .insert(tagAssignments)

        if (tagError) throw tagError
      }

      // Reload tasks to get updated data with relations
      await loadData()
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  // Check if any filters are active (for smart expand/collapse)
  const hasActiveFilters = searchTerm || selectedDepartment || selectedStatus || selectedPriority || selectedTags.length > 0 || selectedAssignee

  // Auto-expand filters when filters become active
  useEffect(() => {
    if (hasActiveFilters && !filtersExpanded) {
      setFiltersExpanded(true)
    }
  }, [hasActiveFilters, filtersExpanded])

  // Filter tasks based on search term, department, tags, status, priority, and assignee
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchTerm === '' ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.tags && task.tags.some(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase())))
    const matchesDepartment = !selectedDepartment || task.department_id === selectedDepartment
    const matchesTags = selectedTags.length === 0 ||
      (task.tags && task.tags.some(tag => selectedTags.includes(tag.id)))
    const matchesStatus = !selectedStatus || task.status === selectedStatus
    const matchesPriority = !selectedPriority || task.priority === selectedPriority
    const matchesAssignee = !selectedAssignee ||
      (selectedAssignee === 'unassigned' ? !task.assigned_to : task.assigned_to === selectedAssignee)
    return matchesSearch && matchesDepartment && matchesTags && matchesStatus && matchesPriority && matchesAssignee
  })

  const totalTasks = tasks.length
  const statusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const priorityCounts = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <ProtectedRoute>
      <Navigation />
      <div className="container mx-auto py-4 space-y-4">
        <PageHeader
          title="Aufgaben"
          description="Verwalte Aufgaben nach Abteilungen und Status"
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Suche in Titel, Beschreibung oder Tags..."
          actions={
            <>
              {!filtersExpanded && (
                <Button
                  variant="outline"
                  onClick={() => setFiltersExpanded(true)}
                  className="gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filter
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-1">
                      {[selectedDepartment && 'Abteilung', selectedStatus && 'Status',
                        selectedPriority && 'Priorität', selectedTags.length && 'Tags', selectedAssignee && 'Zugewiesen']
                        .filter(Boolean).length}
                    </Badge>
                  )}
                </Button>
              )}
              <Button
                onClick={() => setAddDialogOpen(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Neue Aufgabe
              </Button>
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
            </>
          }
        />

        <StatsBar
          stats={[
            { label: 'Gesamt:', value: totalTasks },
            { label: 'Zu erledigen:', value: statusCounts['not_started'] || 0, className: 'text-gray-600' },
            { label: 'In Bearbeitung:', value: statusCounts['in_progress'] || 0, className: 'text-blue-600' },
            { label: 'Erledigt:', value: statusCounts['done'] || 0, className: 'text-green-600' },
            { label: 'Blockiert:', value: statusCounts['blocked'] || 0, className: 'text-red-600' }
          ]}
          badges={Object.entries(priorityCounts).map(([priority, count]) => ({
            text: `${priority === 'urgent' ? 'Dringend' :
                   priority === 'high' ? 'Hoch' :
                   priority === 'medium' ? 'Mittel' : 'Niedrig'}: ${count}`,
            className: priority === 'urgent' ? 'border-red-200 text-red-700' :
                      priority === 'high' ? 'border-orange-200 text-orange-700' :
                      priority === 'medium' ? 'border-yellow-200 text-yellow-700' :
                      'border-gray-200 text-gray-700'
          }))}
        />

        {/* Filter Controls - only show when expanded */}
        {filtersExpanded && (
          <Card>
            <CardHeader>
              <CardTitle
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setFiltersExpanded(!filtersExpanded)}
              >
                <div className="flex items-center gap-2 text-lg">
                  <Filter className="h-5 w-5" />
                  Filter
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-2">
                      {[selectedDepartment && 'Abteilung', selectedStatus && 'Status',
                        selectedPriority && 'Priorität', selectedTags.length && 'Tags', selectedAssignee && 'Zugewiesen']
                        .filter(Boolean).length} aktiv
                    </Badge>
                  )}
                </div>
                <ChevronUp className="h-5 w-5" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {/* Department Filter */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">Abteilung</label>
                  <Combobox
                    options={[
                      { value: "all", label: "Alle Abteilungen" },
                      ...departments.map(dept => ({ value: dept.id, label: dept.name }))
                    ]}
                    value={selectedDepartment || 'all'}
                    onValueChange={(value) => setSelectedDepartment(value === 'all' ? null : value)}
                    placeholder="Alle Abteilungen"
                    searchPlaceholder="Abteilung suchen..."
                    emptyText="Keine Abteilung gefunden."
                  />
                </div>

                {/* Status Filter */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={selectedStatus || ''}
                    onValueChange={(value) => setSelectedStatus(value === 'all' ? null : value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Alle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Status</SelectItem>
                      <SelectItem value="not_started">Zu erledigen</SelectItem>
                      <SelectItem value="in_progress">In Bearbeitung</SelectItem>
                      <SelectItem value="done">Erledigt</SelectItem>
                      <SelectItem value="blocked">Blockiert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority Filter */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">Priorität</label>
                  <Select
                    value={selectedPriority || ''}
                    onValueChange={(value) => setSelectedPriority(value === 'all' ? null : value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Alle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle</SelectItem>
                      <SelectItem value="urgent">Dringend</SelectItem>
                      <SelectItem value="high">Hoch</SelectItem>
                      <SelectItem value="medium">Mittel</SelectItem>
                      <SelectItem value="low">Niedrig</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tags Filter */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">Tags</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-between w-full"
                      >
                        {selectedTags.length > 0
                          ? `${selectedTags.length} Tags`
                          : 'Tags'
                        }
                        <Filter className="ml-2 h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-3">
                      <div className="space-y-2">
                        {tags.map((tag) => (
                          <div key={tag.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`tag-${tag.id}`}
                              checked={selectedTags.includes(tag.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedTags([...selectedTags, tag.id])
                                } else {
                                  setSelectedTags(selectedTags.filter(id => id !== tag.id))
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                            <label
                              htmlFor={`tag-${tag.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              <Badge
                                variant="outline"
                                style={{ borderColor: tag.color, color: tag.color }}
                              >
                                {tag.name}
                              </Badge>
                            </label>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Assignee Filter */}
                <div className="space-y-1">
                  <label className="text-sm font-medium">Zugewiesen</label>
                  <Combobox
                    options={[
                      { value: "all", label: "Alle" },
                      { value: "unassigned", label: "Unassigned" },
                      ...users.map(user => ({ value: user.id, label: user.full_name }))
                    ]}
                    value={selectedAssignee || 'all'}
                    onValueChange={(value) => setSelectedAssignee(value === 'all' ? null : value)}
                    placeholder="Alle"
                    searchPlaceholder="Person suchen..."
                    emptyText="Keine Person gefunden."
                  />
                </div>
              </div>

              {/* Active Filters and Clear Button */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Aktive Filter:</span>

                  {searchTerm && (
                    <Badge variant="secondary" className="gap-1">
                      Suche: {searchTerm}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setSearchTerm('')}
                      />
                    </Badge>
                  )}

                  {selectedDepartment && (
                    <Badge variant="secondary" className="gap-1">
                      {departments.find(d => d.id === selectedDepartment)?.name}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setSelectedDepartment(null)}
                      />
                    </Badge>
                  )}

                  {selectedStatus && (
                    <Badge variant="secondary" className="gap-1">
                      {selectedStatus === 'not_started' ? 'Zu erledigen' :
                       selectedStatus === 'in_progress' ? 'In Bearbeitung' :
                       selectedStatus === 'done' ? 'Erledigt' :
                       selectedStatus === 'blocked' ? 'Blockiert' : selectedStatus}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setSelectedStatus(null)}
                      />
                    </Badge>
                  )}

                  {selectedPriority && (
                    <Badge variant="secondary" className="gap-1">
                      {selectedPriority === 'urgent' ? 'Dringend' :
                       selectedPriority === 'high' ? 'Hoch' :
                       selectedPriority === 'medium' ? 'Mittel' :
                       selectedPriority === 'low' ? 'Niedrig' : selectedPriority}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setSelectedPriority(null)}
                      />
                    </Badge>
                  )}

                  {selectedTags.map(tagId => {
                    const tag = tags.find(t => t.id === tagId)
                    return tag ? (
                      <Badge key={tagId} variant="secondary" className="gap-1">
                        {tag.name}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setSelectedTags(selectedTags.filter(id => id !== tagId))}
                        />
                      </Badge>
                    ) : null
                  })}

                  {selectedAssignee && (
                    <Badge variant="secondary" className="gap-1">
                      {selectedAssignee === 'unassigned'
                        ? 'Nicht zugewiesen'
                        : users.find(u => u.id === selectedAssignee)?.full_name || 'Unbekannt'}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setSelectedAssignee(null)}
                      />
                    </Badge>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedDepartment(null)
                      setSelectedStatus(null)
                      setSelectedPriority(null)
                      setSelectedTags([])
                      setSelectedAssignee(null)
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Alle Filter löschen
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Active Filters Summary (shown when collapsed) */}
        {!filtersExpanded && hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 py-1">
            <span className="text-sm text-muted-foreground">Aktive Filter:</span>
            {searchTerm && (
              <Badge variant="secondary" className="gap-1">
                Suche: {searchTerm}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSearchTerm('')}
                />
              </Badge>
            )}
            {selectedDepartment && (
              <Badge variant="secondary" className="gap-1">
                {departments.find(d => d.id === selectedDepartment)?.name}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedDepartment(null)}
                />
              </Badge>
            )}
            {selectedStatus && (
              <Badge variant="secondary" className="gap-1">
                {selectedStatus === 'not_started' ? 'Zu erledigen' :
                 selectedStatus === 'in_progress' ? 'In Bearbeitung' :
                 selectedStatus === 'done' ? 'Erledigt' :
                 selectedStatus === 'blocked' ? 'Blockiert' : selectedStatus}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedStatus(null)}
                />
              </Badge>
            )}
            {selectedPriority && (
              <Badge variant="secondary" className="gap-1">
                {selectedPriority === 'urgent' ? 'Dringend' :
                 selectedPriority === 'high' ? 'Hoch' :
                 selectedPriority === 'medium' ? 'Mittel' :
                 selectedPriority === 'low' ? 'Niedrig' : selectedPriority}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedPriority(null)}
                />
              </Badge>
            )}
            {selectedTags.map(tagId => {
              const tag = tags.find(t => t.id === tagId)
              return tag ? (
                <Badge key={tagId} variant="secondary" className="gap-1">
                  {tag.name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedTags(selectedTags.filter(id => id !== tagId))}
                  />
                </Badge>
              ) : null
            })}
            {selectedAssignee && (
              <Badge variant="secondary" className="gap-1">
                {selectedAssignee === 'unassigned'
                  ? 'Nicht zugewiesen'
                  : users.find(u => u.id === selectedAssignee)?.full_name || 'Unbekannt'}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedAssignee(null)}
                />
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('')
                setSelectedDepartment(null)
                setSelectedStatus(null)
                setSelectedPriority(null)
                setSelectedTags([])
                setSelectedAssignee(null)
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              Alle löschen
            </Button>
          </div>
        )}

        {/* Loading and Error States */}
        {loading && (
          <Card>
            <CardContent className="py-6 text-center">
              <div className="text-muted-foreground">Tasks werden geladen...</div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="py-6 text-center">
              <div className="text-red-800 mb-2">{error}</div>
              <Button
                variant="outline"
                onClick={loadData}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Erneut versuchen
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Task View */}
        {!loading && !error && (
          <>
            {tasks.length === 0 ? (
              <Card>
                <CardContent className="py-6 text-center">
                  <div className="text-muted-foreground">
                    Noch keine Tasks vorhanden. Nutze die Import-Funktion um Tasks zu erstellen!
                  </div>
                </CardContent>
              </Card>
            ) : filteredTasks.length === 0 ? (
              <Card>
                <CardContent className="py-6 text-center">
                  <div className="text-muted-foreground">
                    {searchTerm || selectedDepartment || selectedStatus || selectedPriority || selectedTags.length > 0 || selectedAssignee
                      ? 'Keine Tasks entsprechen den aktuellen Filtern.'
                      : 'Noch keine Tasks vorhanden. Nutze die Import-Funktion um Tasks zu erstellen!'
                    }
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {viewMode === 'board' ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Kanban Board</h2>
                      <span className="text-sm text-muted-foreground">
                        {filteredTasks.length} von {totalTasks} Tasks
                      </span>
                    </div>
                    <TaskBoard
                      tasks={filteredTasks}
                      onTaskStatusChange={handleTaskStatusChange}
                      onTaskUpdate={handleTaskUpdate}
                      departments={departments}
                      tags={tags}
                      users={users}
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Alle Aufgaben</h2>
                      <span className="text-sm text-muted-foreground">
                        {filteredTasks.length} Tasks
                      </span>
                    </div>
                    <TasksTable
                      tasks={filteredTasks}
                      onTaskUpdate={handleTaskUpdate}
                      departments={departments}
                      tags={tags}
                      users={users}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Add Task Dialog */}
        <TaskAddDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          onSave={handleTaskCreate}
          departments={departments}
          tags={tags}
          users={users}
        />
      </div>
    </ProtectedRoute>
  )
}