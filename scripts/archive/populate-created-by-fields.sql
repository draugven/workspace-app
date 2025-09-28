-- Script to populate created_by fields for existing tasks and notes
-- This assigns all existing records without a created_by value to a specified user

-- Instructions:
-- 1. Replace 'YOUR_USER_ID_HERE' with your actual auth.users ID
-- 2. You can find your user ID by logging into your app and checking the browser's developer tools
--    or by running: SELECT id, email FROM auth.users; in the Supabase SQL editor

-- STEP 1: Replace this with your actual user ID from auth.users
-- You can get this by running: SELECT id, email FROM auth.users LIMIT 5;
-- DO $$
-- DECLARE
--     target_user_id UUID := 'YOUR_USER_ID_HERE'; -- Replace with your actual user ID
-- BEGIN

-- For now, let's create a version that finds the user by email
-- Replace 'your-email@example.com' with your actual email
DO $$
DECLARE
    target_user_id UUID;
    target_email TEXT := 'elisabeth.naimark@gmail.com'; -- Replace with your actual email
    task_count INTEGER;
    note_count INTEGER;
BEGIN
    -- Try to find user by email
    SELECT id INTO target_user_id
    FROM auth.users
    WHERE email = target_email
    LIMIT 1;

    -- Check if user was found
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found. Please check the email or get your user ID from auth.users table.', target_email;
    END IF;

    RAISE NOTICE 'Found user ID: % for email: %', target_user_id, target_email;

    -- Update tasks without created_by
    UPDATE public.tasks
    SET created_by = target_user_id
    WHERE created_by IS NULL;

    GET DIAGNOSTICS task_count = ROW_COUNT;
    RAISE NOTICE 'Updated % tasks with created_by field', task_count;

    -- Update notes without created_by
    UPDATE public.notes
    SET created_by = target_user_id
    WHERE created_by IS NULL;

    GET DIAGNOSTICS note_count = ROW_COUNT;
    RAISE NOTICE 'Updated % notes with created_by field', note_count;

    RAISE NOTICE 'Script completed successfully!';
    RAISE NOTICE 'Total records updated: % tasks, % notes', task_count, note_count;

END $$;

-- Alternative version if you want to use a specific user ID instead:
-- Uncomment and modify the section below, comment out the section above

/*
DO $$
DECLARE
    target_user_id UUID := 'YOUR_USER_ID_HERE'; -- Replace with your actual user ID
    task_count INTEGER;
    note_count INTEGER;
BEGIN
    -- Validate that the user exists
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = target_user_id) THEN
        RAISE EXCEPTION 'User with ID % not found in auth.users table.', target_user_id;
    END IF;

    RAISE NOTICE 'Using user ID: %', target_user_id;

    -- Update tasks without created_by
    UPDATE public.tasks
    SET created_by = target_user_id
    WHERE created_by IS NULL;

    GET DIAGNOSTICS task_count = ROW_COUNT;
    RAISE NOTICE 'Updated % tasks with created_by field', task_count;

    -- Update notes without created_by
    UPDATE public.notes
    SET created_by = target_user_id
    WHERE created_by IS NULL;

    GET DIAGNOSTICS note_count = ROW_COUNT;
    RAISE NOTICE 'Updated % notes with created_by field', note_count;

    RAISE NOTICE 'Script completed successfully!';
    RAISE NOTICE 'Total records updated: % tasks, % notes', task_count, note_count;

END $$;
*/