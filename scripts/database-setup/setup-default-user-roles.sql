-- Setup default user roles for existing and new users
-- This script handles role assignment for all users

-- First, assign "user" role to all existing users who don't have a role yet
-- (excluding the admin user)
INSERT INTO public.user_roles (user_id, role)
SELECT
    u.id,
    'user'
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.user_id IS NULL -- Users without any role
  AND u.id != '900f55da-5f72-432b-b42f-c206fe2c758a'; -- Exclude the admin user

-- Create a trigger function to automatically assign "user" role to new signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Insert default "user" role for new user
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');

    RETURN NEW;
END;
$$;

-- Create trigger to run the function when new user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Verify the setup
DO $$
DECLARE
    total_users INTEGER;
    users_with_roles INTEGER;
    users_without_roles INTEGER;
BEGIN
    -- Count total users
    SELECT COUNT(*) INTO total_users FROM auth.users;

    -- Count users with roles
    SELECT COUNT(*) INTO users_with_roles FROM public.user_roles;

    -- Calculate users without roles
    users_without_roles := total_users - users_with_roles;

    RAISE NOTICE 'User role setup summary:';
    RAISE NOTICE '- Total users in database: %', total_users;
    RAISE NOTICE '- Users with assigned roles: %', users_with_roles;
    RAISE NOTICE '- Users without roles: %', users_without_roles;

    IF users_without_roles = 0 THEN
        RAISE NOTICE '✅ All users now have assigned roles!';
    ELSE
        RAISE NOTICE '⚠️  Some users still lack roles. Check for conflicts.';
    END IF;

    RAISE NOTICE 'Auto-assignment trigger created for new signups.';
END $$;