-- Generated items from CSV data

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Gladstone-Koffer', 'prop', '1', 'erhalten', false, false, true, 'Staatstheater', NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Taschen & Koffer' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Gladstone-Koffer' AND c.name = 'Jonathan Harker';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Sarg', 'prop', '5', 'klären', false, false, false, NULL, 'Mechanismus zum verschwinden?',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Möbel' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Sarg' AND c.name = 'Dracula';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Brautstrauß', 'prop', NULL, 'in progress', false, false, true, 'Gekauft', NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Floristik' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Brautstrauß' AND c.name = 'Lucy Westenra';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Silberne Phiole mit Weihwasser', 'prop', NULL, 'in progress', false, false, true, 'Staatstheater', NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Religiös' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Silberne Phiole mit Weihwasser' AND c.name = 'Lucy Westenra';
INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Silberne Phiole mit Weihwasser' AND c.name = 'Van Helsing';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Hochzeitsschleier', 'costume', NULL, 'in progress', false, false, true, NULL, NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Accessoires' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Hochzeitsschleier' AND c.name = 'Lucy Westenra';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Krücke', 'prop', NULL, 'erhalten', false, false, true, 'Staatstheater', NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Accessoires' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Krücke' AND c.name = 'Jonathan Harker';
INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Krücke' AND c.name = 'Mina Murray';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Feder und Tintenfass', 'prop', NULL, 'erhalten', false, false, true, 'Staatstheater', NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Schreibgeräte' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Feder und Tintenfass' AND c.name = 'Jonathan Harker';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Gerahmtes Foto von Mina Murray', 'prop', NULL, 'in progress', false, false, true, 'Produziert', 'für D für “je länger ich lebe”',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Papierwaren' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Gerahmtes Foto von Mina Murray' AND c.name = 'Dracula';
INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Gerahmtes Foto von Mina Murray' AND c.name = 'Jonathan Harker';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Schreibblock', 'prop', NULL, 'in progress', false, false, true, 'Produziert', NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Papierwaren' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Schreibblock' AND c.name = 'Jonathan Harker';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Kruzifix', 'prop', NULL, 'erhalten', false, false, true, 'Staatstheater', 'zum anziehen',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Schmuck' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Kruzifix' AND c.name = 'Jonathan Harker';
INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Kruzifix' AND c.name = 'Wirtin';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Dokumente', 'prop', NULL, 'in progress', false, false, true, 'Produziert', 'für Dracula',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Papierwaren' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Dokumente' AND c.name = 'Jonathan Harker';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Trauring', 'prop', NULL, 'erhalten', false, true, false, 'Staatstheater', 'Größe checken',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Schmuck' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Trauring' AND c.name = 'Jonathan Harker';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Kette mit Kreuz', 'prop', NULL, 'in progress', false, false, true, 'Staatstheater', 'leicht abreißbar',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Schmuck' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Kette mit Kreuz' AND c.name = 'Lucy Westenra';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Blumenanstecker', 'prop', NULL, 'in progress', false, false, false, 'Produziert', NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Floristik' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Blumenanstecker' AND c.name = 'Jonathan Harker';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Kleine Silberglocke', 'prop', NULL, 'erhalten', false, false, true, 'Staatstheater', NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Diverse' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Kleine Silberglocke' AND c.name = 'Arthur Holmwood';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Spazierstock', 'prop', NULL, 'erhalten', false, false, true, 'Staatstheater', NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Accessoires' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Spazierstock' AND c.name = 'Arthur Holmwood';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Zigarre', 'prop', NULL, 'verloren', true, false, true, 'Produziert', NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Essen & Trinken' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Zigarre' AND c.name = 'Quincey Morris';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Bowie-Messer', 'prop', NULL, 'in progress', false, false, false, 'Produziert', 'mit Hülle',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Waffen' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Bowie-Messer' AND c.name = 'Quincey Morris';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Telegramm aus Budapest', 'prop', NULL, 'in progress', false, false, true, 'Produziert', NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Papierwaren' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Telegramm aus Budapest' AND c.name = 'Mina Murray';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Medizinische Tasche', 'prop', NULL, 'erhalten', false, false, true, 'Staatstheater', 'mit Vampire Hunter Utensilien',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Taschen & Koffer' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Medizinische Tasche' AND c.name = 'Van Helsing';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Kruzifix', 'prop', NULL, 'erhalten', false, false, false, 'Staatstheater', 'zum anziehen',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Schmuck' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Kruzifix' AND c.name = 'Van Helsing';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Blumenanstecker', 'prop', NULL, 'in progress', false, false, false, 'Produziert', NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Floristik' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Blumenanstecker' AND c.name = 'Arthur Holmwood';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Winchester-Gewehr', 'prop', NULL, 'in progress', false, false, false, NULL, 'https://makerworld.com/en/models/408442?from=search#profileId-310399.',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Waffen' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Winchester-Gewehr' AND c.name = 'Quincey Morris';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Gerahmtes Foto von Jonathan', 'prop', NULL, 'in progress', false, false, true, 'Produziert', NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Papierwaren' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Gerahmtes Foto von Jonathan' AND c.name = 'Mina Murray';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Medizinische Instrumente', 'prop', NULL, 'klären', false, false, false, NULL, NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Medizinisch' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Medizinische Instrumente' AND c.name = 'Jack Seward';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Sarg', 'prop', NULL, 'klären', false, false, false, NULL, 'für die Friedhof / Gruft Szenen. Zweiteiliger Deckel',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Möbel' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Sarg' AND c.name = 'Lucy Westenra';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Gebetsbuch', 'prop', NULL, 'erhalten', false, false, true, 'Staatstheater', 'mit Kreuz auf dem Cover. 2 Optionen!',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Religiös' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Gebetsbuch' AND c.name = 'Van Helsing';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Kerzen', 'prop', NULL, 'bestellt', false, false, true, NULL, '"16-25 Kerzen. für ""eh du verloren bist"" (und Beerdigung?)"',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Diverse' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Kerzen' AND c.name = 'Ensemble';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Rose  / Verwelkte Rose', 'prop', NULL, 'erhalten', false, false, true, 'Staatstheater', NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Floristik' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Rose  / Verwelkte Rose' AND c.name = 'Dracula';
INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Rose  / Verwelkte Rose' AND c.name = 'Lucy Westenra';
INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Rose  / Verwelkte Rose' AND c.name = 'Mina Murray';
INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Rose  / Verwelkte Rose' AND c.name = 'Scenery';
INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Rose  / Verwelkte Rose' AND c.name = 'Wirtin';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Vampirzähne', 'prop', NULL, 'klären', true, false, false, NULL, NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Diverse' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Vampirzähne' AND c.name = 'Dracula';
INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Vampirzähne' AND c.name = 'Lucy Westenra';
INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Vampirzähne' AND c.name = 'Vampirellas';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Prop Kopf  (with wig and veil)', 'prop', NULL, 'klären', false, false, false, NULL, 'für die Szene im Gruft',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Diverse' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Prop Kopf  (with wig and veil)' AND c.name = 'Lucy Westenra';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Taschenuhr', 'prop', NULL, 'erhalten', false, false, true, 'Staatstheater', 'für Hypnose',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Accessoires' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Taschenuhr' AND c.name = 'Van Helsing';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Notizblock und Stift', 'prop', NULL, 'in progress', false, false, true, 'Produziert', NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Schreibgeräte' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Notizblock und Stift' AND c.name = 'Jack Seward';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Lange Seile', 'prop', NULL, 'klären', false, true, false, NULL, 'um Jonathan zu fesseln',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Diverse' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Lange Seile' AND c.name = 'Scenery';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Holzpflock', 'prop', NULL, 'klären', false, false, true, NULL, 'x 2-3',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Diverse' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Holzpflock' AND c.name = 'Arthur Holmwood';
INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Holzpflock' AND c.name = 'Jack Seward';
INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Holzpflock' AND c.name = 'Quincey Morris';
INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Holzpflock' AND c.name = 'Van Helsing';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Hostie', 'prop', NULL, 'erhalten', false, false, false, 'Produziert', NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Religiös' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Hostie' AND c.name = 'Van Helsing';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Knallkreuz', 'prop', NULL, 'klären', false, true, false, NULL, 'Vielleicht macht das Sven?',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'FX-Requisiten' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Knallkreuz' AND c.name = 'Van Helsing';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Kelch', 'prop', NULL, 'in progress', false, false, true, 'Produziert', 'für Trauungen oder für VH? https://www.printables.com/model/870116-magic-chalice-print-in-place-no-supports-fantasy-p.',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Religiös' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Kelch' AND c.name = 'Ensemble';
INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Kelch' AND c.name = 'Van Helsing';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Fackeln/Laternen', 'prop', NULL, 'in progress', false, false, true, 'Darsteller*in', NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Diverse' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Fackeln/Laternen' AND c.name = 'Arthur Holmwood';
INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Fackeln/Laternen' AND c.name = 'Jack Seward';
INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Fackeln/Laternen' AND c.name = 'Quincey Morris';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Taschentücher', 'prop', NULL, 'bestellt', false, false, true, NULL, NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Accessoires' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Taschentücher' AND c.name = 'Ensemble';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Weihrauch Fässchen', 'prop', NULL, 'bestellt', false, false, true, NULL, 'für den Priester',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Religiös' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Weihrauch Fässchen' AND c.name = 'Ensemble';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Lappen', 'prop', NULL, 'erhalten', false, false, true, NULL, NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Diverse' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Lappen' AND c.name = 'Wirtin';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Knoblauch, Lauchblümen', 'prop', NULL, 'in progress', false, false, true, 'Staatstheater', 'Lucys Schlafzimmer.',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Floristik' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Knoblauch, Lauchblümen' AND c.name = 'Scenery';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Messer', 'prop', NULL, 'erhalten', false, false, true, 'Produziert', NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Waffen' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Messer' AND c.name = 'Dracula';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT '5 Kreuze Insignien', 'prop', NULL, 'erhalten', false, false, true, NULL, 'unterschiedliche religiöse Gegenstände für Vampire Hunters',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Religiös' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = '5 Kreuze Insignien' AND c.name = 'Arthur Holmwood';
INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = '5 Kreuze Insignien' AND c.name = 'Jack Seward';
INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = '5 Kreuze Insignien' AND c.name = 'Jonathan Harker';
INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = '5 Kreuze Insignien' AND c.name = 'Quincey Morris';
INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = '5 Kreuze Insignien' AND c.name = 'Van Helsing';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Brautstrauß', 'prop', NULL, 'in progress', false, false, true, 'Staatstheater', NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Floristik' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Brautstrauß' AND c.name = 'Mina Murray';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Arztkoffer', 'prop', NULL, 'erhalten', false, false, true, 'Staatstheater', NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Taschen & Koffer' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Arztkoffer' AND c.name = 'Jack Seward';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Bettbezug', 'prop', NULL, 'klären', false, false, false, NULL, '"Lucys Bett. muss zum ""Käfig"" passen"',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Textilien' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Bettbezug' AND c.name = 'Scenery';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Weinflasche', 'prop', NULL, 'in progress', false, false, true, 'Produziert', 'Rotwein. Draculas Schloss',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Essen & Trinken' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Weinflasche' AND c.name = 'Scenery';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Teller, Besteck, Serviette', 'prop', NULL, 'klären', false, false, true, NULL, 'Draculas Schloss',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Essen & Trinken' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Teller, Besteck, Serviette' AND c.name = 'Scenery';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Schale', 'prop', NULL, 'erhalten', false, false, true, 'Darsteller*in', 'zum rasieren und waschen',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Diverse' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Schale' AND c.name = 'Jonathan Harker';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Prop Baby', 'prop', NULL, 'bestellt', false, false, true, NULL, '2 Tücher zum einwickeln, weil werden mit Blut getränkt. Um nicht auswaschen zu müssen.',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Diverse' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Prop Baby' AND c.name = 'Dracula';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Lakritz Spinnen an Faden', 'prop', NULL, 'bestellt', true, false, false, 'Gekauft', NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Essen & Trinken' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Lakritz Spinnen an Faden' AND c.name = 'Renfield';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Kunstblut', 'prop', NULL, 'klären', true, false, false, NULL, 'welche Arten? wo gebraucht? recherchieren und abstimmen',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'FX-Requisiten' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Kunstblut' AND c.name = 'Scenery';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Weinglas', 'prop', NULL, 'erhalten', false, false, true, 'Darsteller*in', 'Draculas Schloss',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Essen & Trinken' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Weinglas' AND c.name = 'Scenery';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Briefpapier', 'prop', NULL, 'in progress', false, false, true, 'Produziert', NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Papierwaren' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Briefpapier' AND c.name = 'Jonathan Harker';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Kleiner Tisch', 'prop', NULL, 'klären', false, false, true, NULL, 'Mina. Wirtin hat den Esstisch.',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Möbel' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Kleiner Tisch' AND c.name = 'Scenery';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Stühle (3)', 'prop', NULL, 'klären', false, false, true, NULL, NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Möbel' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Stühle (3)' AND c.name = 'Scenery';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Prop-Essen', 'prop', NULL, 'bestellt, in progress', true, false, true, NULL, 'am Tisch fixierbar. essbar, wonach man noch singen kann.',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Essen & Trinken' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Prop-Essen' AND c.name = 'Scenery';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Rasiermesser', 'prop', NULL, 'erhalten', false, false, true, 'Produziert', 'stumm / sicher',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Diverse' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Rasiermesser' AND c.name = 'Jonathan Harker';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Kerzenhalter', 'prop', NULL, 'erhalten', false, false, false, 'Darsteller*in', 'Draculas Schloss',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Diverse' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Kerzenhalter' AND c.name = 'Scenery';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Großes, schmuckloses Kruzifix', 'prop', NULL, 'erhalten', false, false, false, 'Produziert', 'Lucys Schlafzimmer',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Religiös' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Großes, schmuckloses Kruzifix' AND c.name = 'Scenery';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Rasierset', 'prop', NULL, 'erhalten', false, false, false, 'Darsteller*in', NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Diverse' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Rasierset' AND c.name = 'Jonathan Harker';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Morphium-Injektionsset', 'prop', NULL, 'in progress', false, false, true, NULL, NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Medizinisch' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Morphium-Injektionsset' AND c.name = 'Van Helsing';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Hochzeitsstäbchen', 'prop', NULL, 'bestellt, in progress', false, false, true, NULL, 'Stäbchen mit Bänder',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Diverse' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Hochzeitsstäbchen' AND c.name = 'Scenery';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Seil (als Aderpresse)', 'prop', NULL, 'bestellt', false, false, true, NULL, NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Textilien' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Seil (als Aderpresse)' AND c.name = 'Van Helsing';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Teppichtasche', 'prop', NULL, 'erhalten', false, false, true, 'Staatstheater', NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Taschen & Koffer' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Teppichtasche' AND c.name = 'Mina Murray';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Briefumschlag', 'prop', NULL, 'erhalten', false, false, true, 'Produziert', NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Papierwaren' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Briefumschlag' AND c.name = 'Jonathan Harker';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Teeservice', 'prop', NULL, 'klären', false, true, false, NULL, 'klären, wie viele. 2 vermutlich',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Essen & Trinken' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Teeservice' AND c.name = 'Scenery';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Portrait von Rosanne', 'prop', NULL, 'klären', false, false, true, NULL, NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Papierwaren' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Portrait von Rosanne' AND c.name = 'Van Helsing';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Schal', 'prop', NULL, 'bestellt', false, false, false, 'Gekauft', 'für die Mutter, darf mit Kunstblut beschmutzt werden',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Textilien' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Schal' AND c.name = 'Ensemble';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Handtuch', 'prop', NULL, 'in progress', false, false, true, NULL, 'zum rasieren',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Textilien' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Handtuch' AND c.name = 'Jonathan Harker';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Whiskeygläser und Karaffe', 'prop', NULL, 'erhalten', false, false, true, 'Darsteller*in', 'für Arthurs Salon',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Essen & Trinken' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Whiskeygläser und Karaffe' AND c.name = 'Scenery';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Rotes Tuch', 'prop', NULL, 'klären', false, false, false, NULL, 'als Symbol für Blut, Ripstop oder Satin, Größe TBD.',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Textilien' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Rotes Tuch' AND c.name = 'Scenery';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Himmelbett Vorhänge', 'prop', NULL, 'klären', false, false, false, NULL, 'Lucys Bett (Käfig). https://share.temu.com/FtQeY6OLEPA',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Textilien' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Himmelbett Vorhänge' AND c.name = 'Scenery';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Perlenkette mit Blut Perlen', 'prop', NULL, 'erhalten', false, false, false, 'Gekauft', NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Schmuck' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Perlenkette mit Blut Perlen' AND c.name = 'Lucy Westenra';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Revolver', 'prop', NULL, 'erhalten', false, false, true, 'Darsteller*in', NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Waffen' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Revolver' AND c.name = 'Arthur Holmwood';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Taschenuhr', 'prop', NULL, 'erhalten', false, false, false, NULL, NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Accessoires' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Taschenuhr' AND c.name = 'Arthur Holmwood';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Krawattennadel', 'prop', NULL, 'in progress', false, false, false, 'Produziert', NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Accessoires' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Krawattennadel' AND c.name = 'Arthur Holmwood';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'RIC Revolver', 'prop', NULL, 'erhalten', false, false, false, 'Darsteller*in', 'https://makerworld.com/en/models/417839?from=search#profileId-320292.',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Waffen' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'RIC Revolver' AND c.name = 'Jack Seward';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Flachmann', 'prop', NULL, 'in progress', false, false, true, NULL, NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Accessoires' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Flachmann' AND c.name = 'Jack Seward';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Taschenuhr', 'prop', NULL, 'erhalten', false, false, false, 'Staatstheater', NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Accessoires' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Taschenuhr' AND c.name = 'Jack Seward';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Drahtbrille', 'prop', NULL, 'erhalten', false, false, false, 'Darsteller*in', NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Accessoires' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Drahtbrille' AND c.name = 'Jack Seward';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Ohrhänger', 'prop', NULL, 'in progress', false, false, false, 'Produziert', 'Perle und Diamant',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Schmuck' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Ohrhänger' AND c.name = 'Lucy Westenra';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Ohrhänger', 'prop', NULL, 'in progress', false, false, false, 'Produziert', 'Silber und Rot',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Schmuck' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Ohrhänger' AND c.name = 'Mina Murray';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Deko Insekten', 'prop', NULL, 'in progress', false, false, false, 'Produziert', NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Diverse' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Deko Insekten' AND c.name = 'Renfield';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Dokumentmappe', 'prop', NULL, 'in progress', false, false, true, 'Produziert', 'für Dokumenten',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Schreibgeräte' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Dokumentmappe' AND c.name = 'Jonathan Harker';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Bolo Tie', 'prop', NULL, 'erhalten', false, false, false, NULL, NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Schmuck' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Bolo Tie' AND c.name = 'Quincey Morris';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Munitionsgürtel', 'prop', NULL, 'in progress', false, false, false, 'Produziert', NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Accessoires' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Munitionsgürtel' AND c.name = 'Quincey Morris';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Trauring', 'prop', NULL, 'erhalten', false, true, false, 'Staatstheater', 'Größe checken',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Schmuck' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Trauring' AND c.name = 'Arthur Holmwood';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Trauring', 'prop', NULL, 'erhalten', false, true, false, 'Staatstheater', 'Größe checken',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Schmuck' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Trauring' AND c.name = 'Lucy Westenra';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Trauring', 'prop', NULL, 'erhalten', false, true, false, 'Staatstheater', 'Größe checken',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Schmuck' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Trauring' AND c.name = 'Mina Murray';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Sofa oder Récamiere', 'prop', NULL, 'klären', false, false, true, NULL, NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Möbel' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Sofa oder Récamiere' AND c.name = 'Scenery';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Beistelltisch', 'prop', NULL, 'erhalten', false, false, false, 'Darsteller*in', 'am Sofa',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Möbel' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Beistelltisch' AND c.name = 'Scenery';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Servierwagen', 'prop', NULL, 'reparatur benötigt', false, false, true, 'Gekauft', NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Möbel' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Servierwagen' AND c.name = 'Scenery';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Esstisch', 'prop', NULL, 'klären', false, false, true, NULL, NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Möbel' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Esstisch' AND c.name = 'Scenery';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Bierbänke', 'prop', NULL, 'anpassung benötigt', false, false, true, NULL, 'verkleidet, mit Sitzkissen. für die Zugsequenz',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Möbel' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Bierbänke' AND c.name = 'Scenery';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Vögelkäfige', 'prop', NULL, 'klären', false, false, true, NULL, 'Renfield',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Möbel' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Vögelkäfige' AND c.name = 'Scenery';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Schatullen für Insekten', 'prop', NULL, 'erhalten', false, false, true, NULL, 'Renfield',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Möbel' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Schatullen für Insekten' AND c.name = 'Scenery';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Belly Dance Wings', 'prop', NULL, 'erhalten', false, false, true, NULL, 'für Draculas Verwandlung',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Accessoires' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Belly Dance Wings' AND c.name = 'Vampirellas';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Notizbuch', 'prop', NULL, 'in progress', false, false, true, 'Gekauft', 'Dick und gut benutzt. Wird referenziert in Szene 12.',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Papierwaren' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Notizbuch' AND c.name = 'Van Helsing';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Koffer (wie viele?)', 'prop', NULL, 'erhalten', false, true, true, 'Darsteller*in', 'eh du verloren bist, Minas Reise. Wird geklärt.',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Taschen & Koffer' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Koffer (wie viele?)' AND c.name = 'Ensemble';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Hochzeitsschleier', 'costume', NULL, 'in progress', false, false, false, NULL, NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Accessoires' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Hochzeitsschleier' AND c.name = 'Mina Murray';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Kreuz, groß', 'prop', NULL, 'erhalten', false, false, false, 'Staatstheater', 'für den Priester',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Religiös' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Kreuz, groß' AND c.name = 'Ensemble';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Vase für die Rose', 'prop', NULL, 'erhalten', false, false, true, 'Gekauft', 'Für die Rose',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Diverse' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Vase für die Rose' AND c.name = 'Scenery';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Glass Wasser bei Wirtin', 'prop', NULL, 'klären', false, false, true, NULL, NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Essen & Trinken' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Glass Wasser bei Wirtin' AND c.name = 'Wirtin';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Karte für die Reise', 'prop', NULL, 'klären', false, false, false, NULL, 'FEHLT NOCH!',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Papierwaren' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Karte für die Reise' AND c.name = 'Van Helsing';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Echtes Essen', 'prop', NULL, 'bestellt, in progress', true, false, false, NULL, 'am Tisch fixierbar. teilweise essbar, wonach man noch singen kann.',
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Essen & Trinken' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Echtes Essen' AND c.name = 'Scenery';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Schreibmachine', 'prop', NULL, 'in progress', false, false, true, 'Produziert', NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Papierwaren' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Schreibmachine' AND c.name = 'Mina Murray';

INSERT INTO items (name, type, scene, status, is_consumable, needs_clarification, needed_for_rehearsal, source, notes, category_id, created_by)
SELECT 'Sessel', 'prop', NULL, 'klären', false, false, false, NULL, NULL,
       c.id, u.id
FROM categories c, users u
WHERE c.name = 'Möbel' AND u.full_name = 'Liza';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Sessel' AND c.name = 'Scenery';

