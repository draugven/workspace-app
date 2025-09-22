import { supabase } from './supabase'
import type { Task } from '@/types'

interface TodoItem {
  content: string
  tags: string[]
  section: string
  subsection?: string
  completed: boolean
}

// Tag to property mapping
const TAG_MAPPINGS = {
  // People assignments
  people: {
    '#liza': 'liza',
    '#tanja': 'tanja',
    '#werner-d': 'werner-d',
    '#werner-k': 'werner-k',
    '#elisa': 'elisa'
  },

  // Departments
  departments: {
    '#kostüme': 'Kostüme',
    '#props': 'Requisiten',
    '#technik': 'Technik',
    '#administrative': 'Administrative',
    '#maske': 'Maske',
    '#licht': 'Licht',
    '#audio': 'Audio',
    '#av': 'Audio/Video'
  },

  // Priority mapping
  priority: {
    '#dringend': 'urgent',
    '#wichtig': 'high',
    default: 'medium'
  },

  // Status - all start as not_started but could be inferred
  status: {
    completed: 'done',
    default: 'not_started'
  }
}

export class TodoImporter {
  private parseMarkdownTodos(content: string): TodoItem[] {
    const lines = content.split('\n')
    const todos: TodoItem[] = []
    let currentSection = ''
    let currentSubsection = ''

    for (const line of lines) {
      const trimmed = line.trim()

      // Skip empty lines and metadata
      if (!trimmed || trimmed.startsWith('*') || trimmed.startsWith('**TAG') || trimmed === '---') {
        continue
      }

      // Main section headers (##)
      if (trimmed.startsWith('## ')) {
        currentSection = trimmed.replace('## ', '').trim()
        currentSubsection = ''
        continue
      }

      // Subsection headers (###)
      if (trimmed.startsWith('### ')) {
        currentSubsection = trimmed.replace('### ', '').trim()
        continue
      }

      // Todo items (- [ ] or - [x])
      if (trimmed.startsWith('- [')) {
        const completed = trimmed.startsWith('- [x]')
        const todoText = trimmed.replace(/^- \[[x ]\]\s*/, '')

        // Extract tags (everything after backticks)
        const tagMatch = todoText.match(/`([^`]+)`$/)
        const tags = tagMatch
          ? tagMatch[1].split(' ').filter(tag => tag.startsWith('#'))
          : []

        // Clean content (remove tags)
        const content = todoText.replace(/\s*`[^`]+`$/, '').trim()

        todos.push({
          content,
          tags,
          section: currentSection,
          subsection: currentSubsection,
          completed
        })
      }
    }

    return todos
  }

  private async getOrCreateDepartment(name: string): Promise<string> {
    // First try to find existing department
    const { data: existing } = await supabase
      .from('departments')
      .select('id')
      .eq('name', name)
      .limit(1)

    if (existing && existing.length > 0) {
      return existing[0].id
    }

    // Create new department with default color
    const colors = {
      'Kostüme': '#ec4899',
      'Requisiten': '#8b5cf6',
      'Technik': '#10b981',
      'Administrative': '#6b7280',
      'Maske': '#f59e0b',
      'Licht': '#3b82f6',
      'Audio': '#06b6d4',
      'Audio/Video': '#8b5cf6'
    }

    const { data: newDept, error } = await supabase
      .from('departments')
      .insert({
        name,
        description: `${name} Abteilung`,
        color: colors[name as keyof typeof colors] || '#6b7280'
      })
      .select('id')
      .single()

    if (error) {
      console.error('Failed to create department:', error)
      throw error
    }

    return newDept.id
  }

  private async getOrCreateUser(email: string, name: string): Promise<string> {
    // Map personas to actual users (you might need to adjust these)
    const userMapping = {
      'liza': { email: 'liza@theater.com', name: 'Liza' },
      'tanja': { email: 'tanja@theater.com', name: 'Tanja' },
      'werner-d': { email: 'werner.d@theater.com', name: 'Werner D.' },
      'werner-k': { email: 'werner.k@theater.com', name: 'Werner K.' },
      'elisa': { email: 'elisa@theater.com', name: 'Elisa' }
    }

    const userData = userMapping[name as keyof typeof userMapping]
    if (!userData) return '' // Return empty if no mapping found

    // Check if user exists (this would normally be handled by auth)
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', userData.email)
      .limit(1)

    if (existing && existing.length > 0) {
      return existing[0].id
    }

    // For demo purposes, create placeholder users
    // In production, these would be created through proper auth flow
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        email: userData.email,
        full_name: userData.name,
        password_hash: 'placeholder' // This would be properly hashed
      })
      .select('id')
      .single()

    if (error) {
      console.log('User creation skipped (likely exists):', userData.email)
      return '' // Return empty if user creation fails
    }

    return newUser.id
  }

  private async getOrCreateTag(name: string): Promise<string> {
    const cleanName = name.replace('#', '')

    const { data: existing } = await supabase
      .from('task_tags')
      .select('id')
      .eq('name', cleanName)
      .limit(1)

    if (existing && existing.length > 0) {
      return existing[0].id
    }

    // Tag color mapping
    const tagColors = {
      'dringend': '#ef4444',
      'wichtig': '#f97316',
      'neu-besetzt': '#8b5cf6',
      'organisation': '#06b6d4',
      'bestellung': '#10b981',
      'reparatur': '#f59e0b',
      'handwerk': '#84cc16',
      'kommunikation': '#3b82f6',
      'planung': '#6366f1',
      'dokumentation': '#64748b',
      'finanzen': '#059669',
      'transport': '#0891b2',
      'aufführung': '#dc2626',
      'casting': '#7c3aed',
      'spezialeffekte': '#be123c'
    }

    const { data: newTag, error } = await supabase
      .from('task_tags')
      .insert({
        name: cleanName,
        color: tagColors[cleanName as keyof typeof tagColors] || '#6b7280'
      })
      .select('id')
      .single()

    if (error) {
      console.error('Failed to create tag:', cleanName, error)
      return ''
    }

    return newTag.id
  }

  private mapTodoToTask(todo: TodoItem): Partial<Task> {
    // Determine department from tags
    let departmentName = 'Administrative' // default
    for (const tag of todo.tags) {
      if (TAG_MAPPINGS.departments[tag]) {
        departmentName = TAG_MAPPINGS.departments[tag as keyof typeof TAG_MAPPINGS.departments]
        break
      }
    }

    // Determine priority
    let priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
    for (const tag of todo.tags) {
      if (TAG_MAPPINGS.priority[tag]) {
        priority = TAG_MAPPINGS.priority[tag as keyof typeof TAG_MAPPINGS.priority] as any
        break
      }
    }

    // Determine assigned person
    let assignedPerson = ''
    for (const tag of todo.tags) {
      if (TAG_MAPPINGS.people[tag]) {
        assignedPerson = TAG_MAPPINGS.people[tag as keyof typeof TAG_MAPPINGS.people]
        break
      }
    }

    // Create description with section context
    let description = ''
    if (todo.section && todo.subsection) {
      description = `${todo.section} > ${todo.subsection}`
    } else if (todo.section) {
      description = todo.section
    }

    return {
      title: todo.content,
      description,
      status: todo.completed ? 'done' : 'not_started',
      priority,
      department_name: departmentName,
      assigned_person: assignedPerson,
      tags: todo.tags
    }
  }

  async importTodos(markdownContent: string): Promise<{
    success: number;
    failed: number;
    errors: string[];
  }> {
    console.log('Starting todo import...')

    const todos = this.parseMarkdownTodos(markdownContent)
    console.log(`Parsed ${todos.length} todos from markdown`)

    let success = 0
    let failed = 0
    const errors: string[] = []

    for (const todo of todos) {
      try {
        const task = this.mapTodoToTask(todo)

        // Get or create department
        const departmentId = await this.getOrCreateDepartment(task.department_name!)

        // Check if task already exists to prevent duplicates
        const { data: existingTask } = await supabase
          .from('tasks')
          .select('id')
          .eq('title', task.title)
          .limit(1)

        if (existingTask && existingTask.length > 0) {
          console.log(`Task "${task.title}" already exists, skipping...`)
          success++
          continue
        }

        // Get assigned user ID if person tag exists
        let assignedUserId = null
        if (task.assigned_person) {
          assignedUserId = await this.getOrCreateUser('', task.assigned_person)
        }

        // Create the task
        const { data: newTask, error: taskError } = await supabase
          .from('tasks')
          .insert({
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            department_id: departmentId,
            assigned_to: assignedUserId || null,
            created_by: assignedUserId || null
          })
          .select('id')
          .single()

        if (taskError) {
          throw taskError
        }

        // Create tags and link them to the task
        for (const tagName of task.tags!) {
          try {
            const tagId = await this.getOrCreateTag(tagName)
            if (tagId) {
              await supabase
                .from('task_tag_assignments')
                .insert({
                  task_id: newTask.id,
                  tag_id: tagId
                })
            }
          } catch (tagError) {
            console.warn(`Failed to create tag ${tagName}:`, tagError)
          }
        }

        success++

      } catch (error) {
        failed++
        const errorMsg = `Failed to import: "${todo.content.substring(0, 50)}...": ${error}`
        errors.push(errorMsg)
        console.error(errorMsg)
      }
    }

    console.log(`Import completed: ${success} successful, ${failed} failed`)
    return { success, failed, errors }
  }
}

export const todoImporter = new TodoImporter()