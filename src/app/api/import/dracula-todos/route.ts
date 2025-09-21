import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    // Read the markdown file from the seed data folder
    const filePath = path.join(process.cwd(), 'seed data', 'dracula_todos_with_tags.md')

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