import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { todoImporter } from '@/lib/import-todos'

export async function GET() {
  try {
    // Read the NEW markdown file from the seed data folder
    const filePath = path.join(process.cwd(), 'seed data', 'new_dracula_todos_with_tags.md')

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Todo file not found' },
        { status: 404 }
      )
    }

    const content = fs.readFileSync(filePath, 'utf-8')

    return new Response(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  } catch (error) {
    console.error('Failed to read todos file:', error)
    return NextResponse.json(
      { error: 'Failed to read todos file' },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
    console.log('Starting todo import via API...')

    // Read the NEW markdown file from the seed data folder
    const filePath = path.join(process.cwd(), 'seed data', 'new_dracula_todos_with_tags.md')

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Todo file not found' },
        { status: 404 }
      )
    }

    const content = fs.readFileSync(filePath, 'utf-8')
    console.log(`Read ${content.length} characters from markdown file`)

    // Import the todos
    const result = await todoImporter.importTodos(content)

    console.log(`Import completed: ${result.success} successful, ${result.failed} failed`)

    return NextResponse.json({
      success: result.success,
      failed: result.failed,
      errors: result.errors,
      message: `Successfully imported ${result.success} tasks, ${result.failed} failed`
    })
  } catch (error) {
    console.error('Failed to import todos:', error)
    return NextResponse.json(
      { error: 'Failed to import todos: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}