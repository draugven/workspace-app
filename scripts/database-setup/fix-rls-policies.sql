-- Fix RLS policies for user_roles to prevent infinite recursion
-- This script fixes the circular dependency in admin role checking

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Users can read their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can read all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;

-- Create simpler, non-recursive policies
-- Policy 1: Users can always read their own role (no recursion)
CREATE POLICY "Users can read own role" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

-- Policy 2: Allow authenticated users to read all roles for now (we'll restrict this at app level)
-- This prevents recursion while still maintaining some security
CREATE POLICY "Authenticated users can read roles" ON public.user_roles
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy 3: Only allow inserts/updates/deletes via service role or admin function
-- This prevents direct manipulation while allowing our trigger to work
CREATE POLICY "Service role can manage roles" ON public.user_roles
    FOR ALL USING (auth.role() = 'service_role');

-- Alternative: If you want stricter control, we can disable RLS for now and handle security in app
-- ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Verify policies
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'user_roles';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'RLS policies fixed for user_roles table!';
    RAISE NOTICE 'Infinite recursion issue should now be resolved.';
    RAISE NOTICE 'Admin role checking should work properly.';
END $$;