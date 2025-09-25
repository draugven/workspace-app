-- Clean up and standardize departments table
-- Keep only the 5 departments that map to "Bereich" tags from the new todo structure

-- First, let's see what departments currently exist
SELECT 'BEFORE CLEANUP:' as status;
SELECT id, name, description, color FROM departments ORDER BY name;

-- Step 1: Create a temporary mapping to consolidate departments
-- We'll keep one department for each target name and merge the others

-- For each target department, find the "best" existing department to keep
-- and update any tasks that reference departments we're going to delete

-- Create a backup of task assignments before we start
CREATE TEMP TABLE task_dept_backup AS
SELECT t.id as task_id, department_id, d.name as dept_name
FROM tasks t
LEFT JOIN departments d ON t.department_id = d.id;

-- Kostüme consolidation
DO $$
DECLARE
    keeper_id UUID;
    to_delete_ids UUID[];
BEGIN
    -- Find the best department to keep (prefer exact match, then first alphabetically)
    SELECT id INTO keeper_id
    FROM departments
    WHERE name IN ('Kostüme', 'Costumes', 'kostüme', 'Kostüm', 'costume')
    ORDER BY (CASE WHEN name = 'Kostüme' THEN 1 ELSE 2 END), name
    LIMIT 1;

    -- Get IDs of departments to delete
    SELECT ARRAY_AGG(id) INTO to_delete_ids
    FROM departments
    WHERE name IN ('Costumes', 'kostüme', 'Kostüm', 'costume')
    AND id != keeper_id;

    -- Update tasks to point to the keeper department
    IF to_delete_ids IS NOT NULL THEN
        UPDATE tasks SET department_id = keeper_id
        WHERE department_id = ANY(to_delete_ids);

        -- Delete the redundant departments
        DELETE FROM departments WHERE id = ANY(to_delete_ids);
    END IF;

    -- Update the keeper department with correct values
    UPDATE departments SET
        name = 'Kostüme',
        description = 'Kostüme Abteilung',
        color = '#ec4899'
    WHERE id = keeper_id;
END $$;

-- Requisiten consolidation
DO $$
DECLARE
    keeper_id UUID;
    to_delete_ids UUID[];
BEGIN
    SELECT id INTO keeper_id
    FROM departments
    WHERE name IN ('Requisiten', 'Props', 'props', 'Requisite', 'prop')
    ORDER BY (CASE WHEN name = 'Requisiten' THEN 1 ELSE 2 END), name
    LIMIT 1;

    SELECT ARRAY_AGG(id) INTO to_delete_ids
    FROM departments
    WHERE name IN ('Props', 'props', 'Requisite', 'prop')
    AND id != COALESCE(keeper_id, '00000000-0000-0000-0000-000000000000'::UUID);

    IF to_delete_ids IS NOT NULL THEN
        UPDATE tasks SET department_id = keeper_id
        WHERE department_id = ANY(to_delete_ids);
        DELETE FROM departments WHERE id = ANY(to_delete_ids);
    END IF;

    IF keeper_id IS NOT NULL THEN
        UPDATE departments SET
            name = 'Requisiten',
            description = 'Requisiten Abteilung',
            color = '#8b5cf6'
        WHERE id = keeper_id;
    END IF;
END $$;

-- Technik consolidation
DO $$
DECLARE
    keeper_id UUID;
    to_delete_ids UUID[];
BEGIN
    SELECT id INTO keeper_id
    FROM departments
    WHERE name IN ('Technik', 'Tech', 'technik', 'Technical', 'Technology')
    ORDER BY (CASE WHEN name = 'Technik' THEN 1 ELSE 2 END), name
    LIMIT 1;

    SELECT ARRAY_AGG(id) INTO to_delete_ids
    FROM departments
    WHERE name IN ('Tech', 'technik', 'Technical', 'Technology')
    AND id != COALESCE(keeper_id, '00000000-0000-0000-0000-000000000000'::UUID);

    IF to_delete_ids IS NOT NULL THEN
        UPDATE tasks SET department_id = keeper_id
        WHERE department_id = ANY(to_delete_ids);
        DELETE FROM departments WHERE id = ANY(to_delete_ids);
    END IF;

    IF keeper_id IS NOT NULL THEN
        UPDATE departments SET
            name = 'Technik',
            description = 'Technik Abteilung',
            color = '#10b981'
        WHERE id = keeper_id;
    END IF;
END $$;

-- Administrative consolidation
DO $$
DECLARE
    keeper_id UUID;
    to_delete_ids UUID[];
BEGIN
    SELECT id INTO keeper_id
    FROM departments
    WHERE name IN ('Administrative', 'Admin', 'administration', 'administrative')
    ORDER BY (CASE WHEN name = 'Administrative' THEN 1 ELSE 2 END), name
    LIMIT 1;

    SELECT ARRAY_AGG(id) INTO to_delete_ids
    FROM departments
    WHERE name IN ('Admin', 'administration')
    AND id != COALESCE(keeper_id, '00000000-0000-0000-0000-000000000000'::UUID);

    IF to_delete_ids IS NOT NULL THEN
        UPDATE tasks SET department_id = keeper_id
        WHERE department_id = ANY(to_delete_ids);
        DELETE FROM departments WHERE id = ANY(to_delete_ids);
    END IF;

    IF keeper_id IS NOT NULL THEN
        UPDATE departments SET
            name = 'Administrative',
            description = 'Administrative Abteilung',
            color = '#6b7280'
        WHERE id = keeper_id;
    END IF;
END $$;

-- Audio/Video consolidation
DO $$
DECLARE
    keeper_id UUID;
    to_delete_ids UUID[];
BEGIN
    SELECT id INTO keeper_id
    FROM departments
    WHERE name IN ('Audio/Video', 'AV', 'av', 'Audio-Video', 'Audio Video', 'AudioVideo')
    ORDER BY (CASE WHEN name = 'Audio/Video' THEN 1 ELSE 2 END), name
    LIMIT 1;

    SELECT ARRAY_AGG(id) INTO to_delete_ids
    FROM departments
    WHERE name IN ('AV', 'av', 'Audio-Video', 'Audio Video', 'AudioVideo')
    AND id != COALESCE(keeper_id, '00000000-0000-0000-0000-000000000000'::UUID);

    IF to_delete_ids IS NOT NULL THEN
        UPDATE tasks SET department_id = keeper_id
        WHERE department_id = ANY(to_delete_ids);
        DELETE FROM departments WHERE id = ANY(to_delete_ids);
    END IF;

    IF keeper_id IS NOT NULL THEN
        UPDATE departments SET
            name = 'Audio/Video',
            description = 'Audio/Video Abteilung',
            color = '#3b82f6'
        WHERE id = keeper_id;
    END IF;
END $$;

-- Step 2: Create any missing departments
INSERT INTO departments (name, description, color)
SELECT 'Kostüme', 'Kostüme Abteilung', '#ec4899'
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Kostüme');

INSERT INTO departments (name, description, color)
SELECT 'Requisiten', 'Requisiten Abteilung', '#8b5cf6'
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Requisiten');

INSERT INTO departments (name, description, color)
SELECT 'Technik', 'Technik Abteilung', '#10b981'
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Technik');

INSERT INTO departments (name, description, color)
SELECT 'Administrative', 'Administrative Abteilung', '#6b7280'
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Administrative');

INSERT INTO departments (name, description, color)
SELECT 'Audio/Video', 'Audio/Video Abteilung', '#3b82f6'
WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Audio/Video');

-- Step 3: Delete all departments that are NOT in our approved list
-- This will clean up any remaining old/incorrect departments
DELETE FROM departments
WHERE name NOT IN ('Kostüme', 'Requisiten', 'Technik', 'Administrative', 'Audio/Video');

-- Step 4: Verify the final result - should show exactly 5 departments
SELECT 'AFTER CLEANUP:' as status;
SELECT id, name, description, color FROM departments ORDER BY name;

-- Step 5: Show count to confirm
SELECT 'TOTAL DEPARTMENTS:' as status, COUNT(*) as count FROM departments;