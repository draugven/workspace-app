const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = path.join(__dirname, '../seed data/Requisiten_Master.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV (simple parser for this specific format)
const lines = csvContent.split('\n');
const headers = lines[0].split(';');
const items = lines.slice(1).filter(line => line.trim()).map(line => {
  const values = line.split(';');
  return headers.reduce((obj, header, index) => {
    obj[header.trim()] = values[index] ? values[index].trim() : null;
    return obj;
  }, {});
});

// Generate SQL inserts
let sql = `-- Generated items from CSV data\n\n`;

// First, we need to get the category and character mapping
const categoryMapping = {
  'Taschen & Koffer': 'Taschen & Koffer',
  'Möbel': 'Möbel',
  'Floristik': 'Floristik',
  'Religiös': 'Religiös',
  'Accessoires': 'Accessoires',
  'Schreibgeräte': 'Schreibgeräte',
  'Papierwaren': 'Papierwaren',
  'Schmuck': 'Schmuck',
  'Diverse': 'Diverse',
  'Essen & Trinken': 'Essen & Trinken',
  'Waffen': 'Waffen',
  'Medizinisch': 'Medizinisch',
  'FX-Requisiten': 'FX-Requisiten',
  'Textilien': 'Textilien'
};

// Generate item inserts
items.forEach((item, index) => {
  const name = item.Requisit ? item.Requisit.replace(/'/g, "''") : `Item ${index + 1}`;
  const scene = item.Szene && item.Szene !== '' ? `'${item.Szene.replace(/'/g, "''")}'` : 'NULL';
  const status = item.Status || 'klären';
  const isConsumable = item.Consumable === 'Yes' ? 'true' : 'false';
  const needsClarification = item.Klären === 'Yes' ? 'true' : 'false';
  const neededForRehearsal = item.Probe === 'Yes' ? 'true' : 'false';
  const source = item.Quelle && item.Quelle !== '' ? `'${item.Quelle.replace(/'/g, "''")}'` : 'NULL';
  const notes = item.Notizen && item.Notizen !== '' ? `'${item.Notizen.replace(/'/g, "''")}'` : 'NULL';
  const category = item.Tag && categoryMapping[item.Tag] ? item.Tag : 'Diverse';

  // Determine if it's a prop or costume based on category and name
  const type = ['Schmuck', 'Accessoires', 'Textilien'].includes(category) &&
               (name.toLowerCase().includes('kostüm') || name.toLowerCase().includes('kleid') ||
                name.toLowerCase().includes('schleier') || name.toLowerCase().includes('schuhe'))
               ? 'costume' : 'prop';

  sql += `INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT '${name}', '${type}', ${scene}, '${status}', ${isConsumable}, ${needsClarification}, ${neededForRehearsal}, ${source}, ${notes},
       c.id, u.id
FROM categories c, users u
WHERE c.name = '${category}' AND u.full_name = 'Liza';\n\n`;

  // Add character relationships if specified
  if (item.Charakter && item.Charakter !== '') {
    const characters = item.Charakter.split(',').map(c => c.trim()).filter(c => c);
    characters.forEach(character => {
      sql += `INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = '${name}' AND c.name = '${character.replace(/'/g, "''")}';\n`;
    });
    sql += '\n';
  }
});

// Write the SQL file
fs.writeFileSync(path.join(__dirname, '../items-seed-data.sql'), sql);
console.log('Generated items-seed-data.sql successfully!');
console.log(`Processed ${items.length} items from CSV`);

// Also generate a summary report
const statusCounts = items.reduce((acc, item) => {
  const status = item.Status || 'klären';
  acc[status] = (acc[status] || 0) + 1;
  return acc;
}, {});

const categoryCounts = items.reduce((acc, item) => {
  const category = item.Tag || 'Diverse';
  acc[category] = (acc[category] || 0) + 1;
  return acc;
}, {});

console.log('\nStatus breakdown:');
Object.entries(statusCounts).forEach(([status, count]) => {
  console.log(`  ${status}: ${count}`);
});

console.log('\nCategory breakdown:');
Object.entries(categoryCounts).forEach(([category, count]) => {
  console.log(`  ${category}: ${count}`);
});