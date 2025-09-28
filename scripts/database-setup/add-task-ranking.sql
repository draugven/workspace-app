-- Add ranking field to tasks table for drag-and-drop ordering
-- This allows ranking within priority groups (Kanban) and within priority+status groups (Table)

-- Add the ranking column
ALTER TABLE tasks ADD COLUMN ranking INTEGER DEFAULT 0;

-- Create an index for better performance on ranking queries
CREATE INDEX idx_tasks_ranking ON tasks (priority, status, ranking);
CREATE INDEX idx_tasks_priority_ranking ON tasks (priority, ranking);

-- Initialize existing tasks with rankings based on their creation order within each priority group
-- This ensures existing tasks have proper rankings when the feature is deployed

-- Update rankings for urgent priority
WITH ranked_urgent AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as new_ranking
  FROM tasks
  WHERE priority = 'urgent'
)
UPDATE tasks
SET ranking = ranked_urgent.new_ranking
FROM ranked_urgent
WHERE tasks.id = ranked_urgent.id;

-- Update rankings for high priority
WITH ranked_high AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as new_ranking
  FROM tasks
  WHERE priority = 'high'
)
UPDATE tasks
SET ranking = ranked_high.new_ranking
FROM ranked_high
WHERE tasks.id = ranked_high.id;

-- Update rankings for medium priority
WITH ranked_medium AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as new_ranking
  FROM tasks
  WHERE priority = 'medium'
)
UPDATE tasks
SET ranking = ranked_medium.new_ranking
FROM ranked_medium
WHERE tasks.id = ranked_medium.id;

-- Update rankings for low priority
WITH ranked_low AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as new_ranking
  FROM tasks
  WHERE priority = 'low'
)
UPDATE tasks
SET ranking = ranked_low.new_ranking
FROM ranked_low
WHERE tasks.id = ranked_low.id;