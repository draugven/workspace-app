-- Invitation-only authentication system
-- Run this in Supabase SQL Editor after disabling public signups

-- Create invitations table
CREATE TABLE IF NOT EXISTS invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  invited_at TIMESTAMP DEFAULT NOW(),
  accepted_at TIMESTAMP,
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '7 days'),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked'))
);

-- NO RLS (app-level security consistent with rest of application)
ALTER TABLE invitations DISABLE ROW LEVEL SECURITY;

-- Indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_invitations_token ON invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_email ON invitations(email);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON invitations(status) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_invitations_invited_by ON invitations(invited_by);

-- Comments for documentation
COMMENT ON TABLE invitations IS 'Stores invitation tokens for invite-only user registration';
COMMENT ON COLUMN invitations.token IS 'Cryptographically secure random token (64 hex characters)';
COMMENT ON COLUMN invitations.status IS 'Invitation status: pending, accepted, expired, or revoked';
COMMENT ON COLUMN invitations.expires_at IS 'Invitation expiry timestamp (default: 7 days from creation)';
