# Todo Import Process - New Structure

This document outlines the process to import the updated Dracula todo structure into the task management system.

## Files Updated

1. **`scripts/cleanup-tasks.sql`** - Cleans all existing task data
2. **`scripts/populate-task-tags.sql`** - Populates task_tags with categorized tags
3. **`src/lib/import-todos.ts`** - Refactored for new structure (no person assignments)
4. **`scripts/parse-todos.js`** - Updated to parse new markdown format

## Import Process

### Step 1: Clean existing data
```bash
# Execute the cleanup script in your database
psql -d your_database -f scripts/cleanup-tasks.sql
```

### Step 2: Add tag categories and populate tags
```bash
# This adds the 'category' column and populates all tags
psql -d your_database -f scripts/populate-task-tags.sql
```

### Step 3: Import todos (choose one method)

#### Method A: Using the TypeScript importer (Recommended)
```typescript
// In your app or via API call
import { todoImporter } from '@/lib/import-todos'
import fs from 'fs'

const todoContent = fs.readFileSync('seed data/new_dracula_todos_with_tags.md', 'utf-8')
const result = await todoImporter.importTodos(todoContent)
console.log(`Imported: ${result.success} tasks, ${result.failed} failed`)
```

#### Method B: Using the Node.js script (generates SQL)
```bash
cd scripts
node parse-todos.js
# This creates tasks-seed-data.sql
psql -d your_database -f ../tasks-seed-data.sql
```

## Changes in New Structure

### Removed
- ❌ Person assignments (`#liza`, `#tanja`, etc.)
- ❌ Priority tags (`#dringend`, `#wichtig`)
- ❌ Character tags

### Maintained
- ✅ **Bereich** (Domain) tags: `#kostüme`, `#props`, `#technik`, `#administrative`, `#av`
- ✅ **Typ** (Type) tags: `#bestellung`, `#reparatur`, `#finanzen`, `#dokumentation`, `#kommunikation`, etc.
- ✅ Section/subsection structure for task descriptions

### New Features
- ✅ Tag categories (`Bereich` vs `Typ`) stored in database
- ✅ All tasks have medium priority by default
- ✅ Tasks created by authenticated user
- ✅ No assignments (assigned_to = null)

## Tag Categories

### **Bereich** (Domain/Area) - 5 tags
- `kostüme` (Costumes) - Pink
- `props` (Props/Requisiten) - Purple
- `technik` (Tech) - Green
- `administrative` (Administrative) - Gray
- `av` (Audio/Video) - Blue

### **Typ** (Type) - 13 tags
- `bestellung` (Orders) - Green
- `reparatur` (Repairs) - Orange
- `finanzen` (Finance) - Teal
- `dokumentation` (Documentation) - Slate
- `kommunikation` (Communication) - Blue
- `sfx` (Special Effects) - Red
- `marketing` (Marketing) - Red
- `bühnenaufbau` (Stage Construction) - Lime
- `neu` (New) - Cyan
- `content` (Content) - Purple
- `perücken` (Wigs) - Amber
- `schule` (School) - Indigo
- `location` (Location) - Cyan

## Verification

After import, verify with:
```sql
-- Check tag categories
SELECT category, COUNT(*) as count, array_agg(name ORDER BY name) as tags
FROM task_tags
WHERE category IS NOT NULL
GROUP BY category;

-- Check task distribution
SELECT d.name as department, COUNT(*) as task_count
FROM tasks t
JOIN departments d ON t.department_id = d.id
GROUP BY d.name;

-- Check most common tags
SELECT tt.name, tt.category, COUNT(*) as usage_count
FROM task_tags tt
JOIN task_tag_assignments tta ON tt.id = tta.tag_id
GROUP BY tt.id, tt.name, tt.category
ORDER BY usage_count DESC;
```