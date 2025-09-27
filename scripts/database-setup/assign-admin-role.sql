-- Assign admin role to specific user
-- Run this script in Supabase SQL Editor to assign admin role

-- Replace this UUID with the target user's UID if different
-- Current target: 900f55da-5f72-432b-b42f-c206fe2c758a

INSERT INTO public.user_roles (user_id, role)
VALUES ('900f55da-5f72-432b-b42f-c206fe2c758a', 'admin')
ON CONFLICT (user_id)
DO UPDATE SET
  role = 'admin',
  created_at = NOW();

-- Verify the assignment
SELECT
  ur.user_id,
  ur.role,
  ur.created_at,
  u.email
FROM public.user_roles ur
JOIN auth.users u ON ur.user_id = u.id
WHERE ur.user_id = '900f55da-5f72-432b-b42f-c206fe2c758a';

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Admin role assigned successfully to user: 900f55da-5f72-432b-b42f-c206fe2c758a';
  RAISE NOTICE 'The user now has admin permissions and can delete items, tasks, and notes.';
END $$;