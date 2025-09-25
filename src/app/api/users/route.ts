import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Create admin client with service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Fetch all users using admin API
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()

    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    // Return filtered user data (only safe fields)
    const safeUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.email || 'Unknown User',
      created_at: user.created_at
    }))

    return NextResponse.json(safeUsers)
  } catch (error) {
    console.error('Server error fetching users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}