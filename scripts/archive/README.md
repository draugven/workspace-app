# Archived Scripts

This directory contains database scripts that are no longer actively used but preserved for historical reference.

## Archive Structure

### `cleanup-migration.sql`
**Archived:** 2025-09-25
**Reason:** One-time migration from custom `users` table to Supabase `auth.users` - already completed
**Risk:** Could cause data loss if run accidentally

### `legacy-seed-data/`
**Archived:** 2025-09-25
**Reason:** Incompatible with current schema (references custom `users` table instead of `auth.users`)
**Contents:**
- `seed-data.sql` - Core seed data with obsolete user management
- `items-seed-data.sql` - Dracula production items (large dataset)
- `tasks-seed-data.sql` - Dracula production tasks (large dataset)

## Still Active Scripts

The following data-import scripts remain active and compatible:

- `scripts/data-import/populate-task-tags.sql` - ✅ Adds categorized task tags
- `scripts/data-import/cleanup-tasks.sql` - ✅ Utility to clear task data
- `scripts/data-import/update-departments.sql` - ⚠️ Department consolidation (may be one-time use)

## Migration Notes

If you need the legacy seed data, you would need to:
1. Update all `users` references to `auth.users`
2. Remove `user_departments` relationships
3. Update user lookup queries to use Supabase Auth users
4. Handle user creation through Supabase Auth instead of SQL inserts