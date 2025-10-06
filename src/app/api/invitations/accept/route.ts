import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing required environment variables')
      return NextResponse.json(
        { error: 'Server-Konfigurationsfehler' },
        { status: 500 }
      )
    }

    // Use service role key to create user
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { token, email, password, displayName } = await request.json()

    if (!token || !email || !password) {
      return NextResponse.json({ error: 'Fehlende Pflichtfelder' }, { status: 400 })
    }

    if (!displayName || !displayName.trim()) {
      return NextResponse.json({ error: 'Name ist erforderlich' }, { status: 400 })
    }

    // Verify invitation
    const { data: invitation, error: inviteError } = await (supabase as any)
      .from('invitations')
      .select()
      .eq('token', token)
      .eq('email', email)
      .eq('status', 'pending')
      .single()

    if (inviteError || !invitation) {
      return NextResponse.json({ error: 'Ungültige Einladung' }, { status: 400 })
    }

    // Check if expired
    if (new Date(invitation.expires_at) < new Date()) {
      await (supabase as any)
        .from('invitations')
        .update({ status: 'expired' })
        .eq('id', invitation.id)

      return NextResponse.json({ error: 'Einladung ist abgelaufen' }, { status: 400 })
    }

    // Create user account
    const { data: userData, error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm since they used valid invite
      user_metadata: {
        invited_by: invitation.invited_by,
        full_name: displayName.trim()
      }
    })

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        return NextResponse.json({ error: 'Benutzer existiert bereits' }, { status: 409 })
      }
      throw signUpError
    }

    // Create default user role
    const { error: roleError } = await (supabase as any)
      .from('user_roles')
      .insert({
        user_id: userData.user.id,
        role: 'user'
      })

    if (roleError) {
      console.error('Error creating user role:', roleError)
      // Continue even if role creation fails - user was created successfully
    }

    // Mark invitation as accepted
    await (supabase as any)
      .from('invitations')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString()
      })
      .eq('id', invitation.id)

    return NextResponse.json({ success: true, user: userData.user })

  } catch (error) {
    console.error('Error accepting invitation:', error)
    return NextResponse.json(
      { error: 'Fehler beim Akzeptieren der Einladung' },
      { status: 500 }
    )
  }
}
