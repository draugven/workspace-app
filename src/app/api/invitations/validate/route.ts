import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient()
    const token = request.nextUrl.searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Token fehlt' }, { status: 400 })
    }

    const { data: invitation, error } = await (supabase as any)
      .from('invitations')
      .select('email, status, expires_at')
      .eq('token', token)
      .single()

    if (error || !invitation) {
      return NextResponse.json({ valid: false, error: 'Ungültige Einladung' }, { status: 400 })
    }

    if (invitation.status !== 'pending') {
      return NextResponse.json({ valid: false, error: 'Diese Einladung wurde bereits verwendet' }, { status: 400 })
    }

    if (new Date(invitation.expires_at) < new Date()) {
      // Mark as expired
      await (supabase as any)
        .from('invitations')
        .update({ status: 'expired' })
        .eq('token', token)

      return NextResponse.json({ valid: false, error: 'Diese Einladung ist abgelaufen' }, { status: 400 })
    }

    return NextResponse.json({ valid: true, email: invitation.email })

  } catch (error) {
    console.error('Error validating invitation:', error)
    return NextResponse.json({ valid: false, error: 'Fehler beim Validieren der Einladung' }, { status: 500 })
  }
}
