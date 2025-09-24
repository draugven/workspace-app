const fs = require('fs');
const path = require('path');

// Read the new markdown file
const todoPath = path.join(__dirname, '../seed data/new_dracula_todos_with_tags.md');
const todoContent = fs.readFileSync(todoPath, 'utf-8');

// Parse todos (extract checkbox items with tags)
const todoRegex = /- \[ \] (.+?) `(.+?)`/g;
const todos = [];
let match;

while ((match = todoRegex.exec(todoContent)) !== null) {
  const title = match[1].trim();
  const tags = match[2].split(' ').filter(tag => tag.startsWith('#')).map(tag => tag.substring(1));

  // Extract department from tags (Bereich category)
  const departmentTags = ['kostüme', 'props', 'technik', 'administrative', 'av'];
  const department = tags.find(tag => departmentTags.includes(tag));

  // All tasks have medium priority in new structure
  const priority = 'medium';

  todos.push({
    title,
    tags,
    department,
    priority
  });
}

console.log(`Parsed ${todos.length} todos from markdown`);

// Generate SQL
let sql = `-- Generated tasks from todo markdown\n\n`;

todos.forEach((todo, index) => {
  const title = todo.title.replace(/'/g, "''");
  const departmentClause = todo.department ? `d.name = '${getDepartmentName(todo.department)}'` : `d.name = 'Administrative'`;

  sql += `INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT '${title}', 'not_started', '${todo.priority}', d.id, null, auth.uid()
FROM departments d
WHERE ${departmentClause};\n\n`;

  // Add tags for this task
  todo.tags.forEach(tag => {
    if (tag !== todo.department) { // Don't add department tag as separate tag
      sql += `INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = '${title}' AND tag.name = '${tag}';\n`;
    }
  });
  sql += '\n';
});

function getDepartmentName(tag) {
  const mapping = {
    'kostüme': 'Kostüme',
    'props': 'Requisiten',
    'technik': 'Technik',
    'administrative': 'Administrative',
    'av': 'Audio/Video'
  };
  return mapping[tag] || 'Administrative';
}

// Write the SQL file
fs.writeFileSync(path.join(__dirname, '../tasks-seed-data.sql'), sql);
console.log('Generated tasks-seed-data.sql successfully!');

// Generate summary
const departmentCounts = todos.reduce((acc, todo) => {
  const dept = getDepartmentName(todo.department || 'administrative');
  acc[dept] = (acc[dept] || 0) + 1;
  return acc;
}, {});

const tagCounts = todos.reduce((acc, todo) => {
  todo.tags.forEach(tag => {
    if (tag !== todo.department) { // Don't count department tags
      acc[tag] = (acc[tag] || 0) + 1;
    }
  });
  return acc;
}, {});

console.log('\nDepartment distribution:');
Object.entries(departmentCounts).forEach(([dept, count]) => {
  console.log(`  ${dept}: ${count}`);
});

console.log('\nTop tags:');
Object.entries(tagCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .forEach(([tag, count]) => {
    console.log(`  #${tag}: ${count}`);
  });