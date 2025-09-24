import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the markdown file
const todoPath = join(__dirname, '../seed data/new_dracula_todos_with_tags.md');
const todoContent = readFileSync(todoPath, 'utf-8');

console.log('Starting todo import...');
console.log(`Markdown file size: ${todoContent.length} characters`);

// Import the todoImporter - we'll use fetch to call the API endpoint
const response = await fetch('http://localhost:3003/api/import/dracula-todos', {
  method: 'POST',
});

if (!response.ok) {
  console.error('Import failed:', response.status, response.statusText);
  const error = await response.text();
  console.error('Error details:', error);
  process.exit(1);
}

const result = await response.json();
console.log('\n✅ Import completed successfully!');
console.log(`📊 Results: ${result.success} tasks imported, ${result.failed} failed`);

if (result.errors && result.errors.length > 0) {
  console.log('\n❌ Errors encountered:');
  result.errors.forEach((error, index) => {
    console.log(`  ${index + 1}. ${error}`);
  });
}