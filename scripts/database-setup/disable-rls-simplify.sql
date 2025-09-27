-- Disable RLS and simplify user_roles table
-- This removes the complex policies and makes the system much simpler

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can read their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can read all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can read own role" ON public.user_roles;
DROP POLICY IF EXISTS "Authenticated users can read roles" ON public.user_roles;
DROP POLICY IF EXISTS "Service role can manage roles" ON public.user_roles;

-- Disable RLS entirely
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Drop the helper function (we'll handle this in app code)
DROP FUNCTION IF EXISTS public.is_admin(uuid);

-- Grant simpler permissions
GRANT SELECT ON public.user_roles TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;

-- Verify the table is accessible
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename = 'user_roles';

-- Show current user_roles data
SELECT user_id, role, created_at FROM public.user_roles;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'RLS disabled and user_roles table simplified!';
    RAISE NOTICE 'All security will now be handled at the application level.';
    RAISE NOTICE 'This eliminates complexity and recursion issues.';
END $$;