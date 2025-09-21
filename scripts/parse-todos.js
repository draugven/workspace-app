const fs = require('fs');
const path = require('path');

// Read the markdown file
const todoPath = path.join(__dirname, '../seed data/dracula_todos_with_tags.md');
const todoContent = fs.readFileSync(todoPath, 'utf-8');

// Parse todos (extract checkbox items with tags)
const todoRegex = /- \[ \] (.+?) `(.+?)`/g;
const todos = [];
let match;

while ((match = todoRegex.exec(todoContent)) !== null) {
  const title = match[1].trim();
  const tags = match[2].split(' ').filter(tag => tag.startsWith('#')).map(tag => tag.substring(1));

  // Extract person assigned (first tag that's a person name)
  const personTags = ['liza', 'tanja', 'werner-d', 'werner-k', 'elisa'];
  const assignedTo = tags.find(tag => personTags.includes(tag));

  // Extract department from tags
  const departmentTags = ['kostüme', 'props', 'technik', 'administrative'];
  const department = tags.find(tag => departmentTags.includes(tag));

  // Determine priority
  const priority = tags.includes('dringend') ? 'urgent' :
                   tags.includes('neu-besetzt') ? 'high' : 'medium';

  todos.push({
    title,
    tags,
    assignedTo,
    department,
    priority
  });
}

console.log(`Parsed ${todos.length} todos from markdown`);

// Generate SQL
let sql = `-- Generated tasks from todo markdown\n\n`;

todos.slice(0, 50).forEach((todo, index) => { // Limit to first 50 for now
  const title = todo.title.replace(/'/g, "''");
  const departmentClause = todo.department ? `d.name = '${getDepartmentName(todo.department)}'` : `d.name = 'Administrative'`;
  const assignedClause = todo.assignedTo ? `u.full_name = '${getPersonName(todo.assignedTo)}'` : `u.full_name = 'Liza'`;

  sql += `INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT '${title}', 'not_started', '${todo.priority}', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE ${departmentClause} AND ${assignedClause} AND creator.full_name = 'Liza';\n\n`;

  // Add tags for this task
  todo.tags.forEach(tag => {
    if (tag !== todo.assignedTo && tag !== todo.department) {
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
    'kostüme': 'Costumes',
    'props': 'Props',
    'technik': 'Tech',
    'administrative': 'Administrative'
  };
  return mapping[tag] || 'Administrative';
}

function getPersonName(tag) {
  const mapping = {
    'liza': 'Liza',
    'tanja': 'Tanja',
    'werner-d': 'Werner D.',
    'werner-k': 'Werner K.',
    'elisa': 'Elisa'
  };
  return mapping[tag] || 'Liza';
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

const assigneeCounts = todos.reduce((acc, todo) => {
  const person = getPersonName(todo.assignedTo || 'liza');
  acc[person] = (acc[person] || 0) + 1;
  return acc;
}, {});

console.log('\nDepartment distribution:');
Object.entries(departmentCounts).forEach(([dept, count]) => {
  console.log(`  ${dept}: ${count}`);
});

console.log('\nAssignee distribution:');
Object.entries(assigneeCounts).forEach(([person, count]) => {
  console.log(`  ${person}: ${count}`);
});