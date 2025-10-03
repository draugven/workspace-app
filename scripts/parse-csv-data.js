const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = path.join(__dirname, '../seed data/Requisiten_Master_latest.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV properly handling quoted fields
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i += 2;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      result.push(current.trim());
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }

  result.push(current.trim());
  return result;
}

const lines = csvContent.split('\n').filter(line => line.trim());
const headers = parseCSVLine(lines[0]).map(h => h.replace(/^\uFEFF/, '').trim()); // Remove BOM
const items = lines.slice(1).map(line => {
  const values = parseCSVLine(line);
  return headers.reduce((obj, header, index) => {
    obj[header] = values[index] && values[index] !== '' ? values[index] : null;
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
  const scene = item['Seite(n)'] && item['Seite(n)'] !== '' ? `'${item['Seite(n)'].replace(/'/g, "''")}'` : 'NULL';
  const status = item.Status || 'in progress';
  const isConsumable = item.C === 'Yes' ? 'true' : 'false';
  const isUsed = item.Benutzt === 'Yes' ? 'true' : 'false';
  const isChangeable = item['Änderbar'] === 'Yes' ? 'true' : 'false';
  const source = item.Quelle && item.Quelle !== '' ? `'${item.Quelle.replace(/'/g, "''")}'` : 'NULL';
  const notes = item.Notizen && item.Notizen !== '' ? `'${item.Notizen.replace(/'/g, "''")}'` : 'NULL';
  const category = item.Tag && categoryMapping[item.Tag] ? item.Tag : 'Diverse';

  // All items are props by default (no costume differentiation needed)
  const type = 'prop';

  sql += `INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT '${name}', '${type}', ${scene}, '${status}', ${isConsumable}, ${isUsed}, ${isChangeable}, ${source}, ${notes},
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = '${category}';\n\n`;

  // Add character relationships if specified
  if (item.Charakter && item.Charakter !== '') {
    const characters = item.Charakter.split(',').map(c => c.trim()).filter(c => c);
    characters.forEach(character => {
      sql += `INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = '${name}' AND c.name = '${character.replace(/'/g, "''")}'
ON CONFLICT DO NOTHING;\n`;
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