-- Generated items from CSV data

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Arztkoffer', 'prop', NULL, 'erhalten', false, true, true, 'Staatstheater', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Taschen & Koffer';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Arztkoffer' AND c.name = 'Jack Seward'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Becher bei Wirtin', 'prop', NULL, 'erhalten', false, true, false, 'Spende', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Essen & Trinken';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Becher bei Wirtin' AND c.name = 'Wirtin'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Beistelltisch', 'prop', NULL, 'erhalten', false, true, false, 'Ausleihe', 'am Sofa',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Möbel';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Beistelltisch' AND c.name = 'Scenery'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Belly Dance Wings', 'prop', NULL, 'erhalten', false, true, false, 'Gekauft', 'für Draculas Verwandlung',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Accessoires';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Belly Dance Wings' AND c.name = 'Vampirellas'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Bettbezug', 'prop', NULL, 'fehlt', false, true, false, 'Gekauft', 'Lucys Bett. muss zum "Käfig" passen',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Textilien';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Bettbezug' AND c.name = 'Scenery'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Bierbänke', 'prop', NULL, 'reparatur', false, true, false, 'Ausleihe', 'verkleidet, mit Sitzkissen. für die Zugsequenz',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Möbel';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Bierbänke' AND c.name = 'Scenery'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Blumenanstecker', 'prop', NULL, 'erhalten', false, true, false, 'Produziert', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Floristik';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Blumenanstecker' AND c.name = 'Jonathan Harker'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Blumenanstecker', 'prop', NULL, 'erhalten', false, true, false, 'Produziert', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Floristik';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Blumenanstecker' AND c.name = 'Arthur Holmwood'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Bolo Tie', 'prop', NULL, 'erhalten', false, true, false, 'Gekauft', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Schmuck';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Bolo Tie' AND c.name = 'Quincey Morris'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Bowie-Messer', 'prop', NULL, 'erhalten', false, true, false, 'Produziert', 'mit Hülle',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Waffen';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Bowie-Messer' AND c.name = 'Quincey Morris'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Brautstrauß', 'prop', NULL, 'erhalten', false, true, true, 'Staatstheater', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Floristik';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Brautstrauß' AND c.name = 'Mina Murray'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Brautstrauß', 'prop', NULL, 'erhalten', false, true, false, 'Gekauft', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Floristik';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Brautstrauß' AND c.name = 'Lucy Westenra'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Deckchen, Servierwagen', 'prop', NULL, 'erhalten', false, true, false, 'Spende', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Textilien';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Deckchen, Servierwagen' AND c.name = 'Scenery'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Decke, runder Tisch', 'prop', NULL, 'erhalten', false, true, false, 'Ausleihe', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Textilien';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Decke, runder Tisch' AND c.name = 'Wirtin'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Deko Insekten', 'prop', NULL, 'erhalten', false, true, false, 'Produziert', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Diverse';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Deko Insekten' AND c.name = 'Renfield'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Dokumentmappe', 'prop', NULL, 'erhalten', false, true, false, 'Produziert', 'Inhalt: Briefpapier und Briefumschlag, Dokumente, Schreibblock',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Papierwaren';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Dokumentmappe' AND c.name = 'Jonathan Harker'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Drahtbrille', 'prop', NULL, 'erhalten', false, true, false, 'Ausleihe', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Accessoires';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Drahtbrille' AND c.name = 'Jack Seward'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Echtes Essen', 'prop', NULL, 'fehlt', true, true, false, 'Gekauft', 'am Tisch fixierbar. teilweise essbar, wonach man noch singen kann.',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Essen & Trinken';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Echtes Essen' AND c.name = 'Scenery'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Esstisch', 'prop', NULL, 'erhalten', false, true, false, 'Staatstheater', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Möbel';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Esstisch' AND c.name = 'Scenery'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Feder und Tintenfass', 'prop', NULL, 'erhalten', false, false, true, 'Staatstheater', 'wird nicht benutzt',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Schreibgeräte';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Feder und Tintenfass' AND c.name = 'Jonathan Harker'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Federmäppchen aus Holz', 'prop', NULL, 'erhalten', false, true, false, 'Produziert', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Schreibgeräte';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Federmäppchen aus Holz' AND c.name = 'Jonathan Harker'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Flachmann', 'prop', NULL, 'erhalten', false, true, false, 'Ausleihe', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Accessoires';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Flachmann' AND c.name = 'Jack Seward'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Foto von Jonathan', 'prop', NULL, 'erhalten', false, true, false, 'Produziert', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Papierwaren';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Foto von Jonathan' AND c.name = 'Mina Murray'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Foto von Mina Murray', 'prop', NULL, 'erhalten', false, true, false, 'Produziert', 'für D für “je länger ich lebe”',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Papierwaren';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Foto von Mina Murray' AND c.name = 'Dracula'
ON CONFLICT DO NOTHING;
INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Foto von Mina Murray' AND c.name = 'Jonathan Harker'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Foto von Rosanne', 'prop', NULL, 'erhalten', false, true, false, 'Produziert', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Papierwaren';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Foto von Rosanne' AND c.name = 'Van Helsing'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Gebetsbuch', 'prop', NULL, 'erhalten', false, true, true, 'Staatstheater', 'mit Kreuz auf dem Cover',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Religiös';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Gebetsbuch' AND c.name = 'Scenery'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Gebetsbuch', 'prop', NULL, 'erhalten', false, true, true, 'Staatstheater', 'mit Kreuz auf dem Cover',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Religiös';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Gebetsbuch' AND c.name = 'Van Helsing'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Gladstone-Koffer', 'prop', NULL, 'erhalten', false, true, true, 'Staatstheater', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Taschen & Koffer';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Gladstone-Koffer' AND c.name = 'Jonathan Harker'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Handtuch', 'prop', NULL, 'erhalten', false, true, false, 'Gekauft', 'zum rasieren',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Textilien';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Handtuch' AND c.name = 'Jonathan Harker'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Himmelbett Vorhänge', 'prop', NULL, 'erhalten', false, true, false, 'Gekauft', 'Lucys Bett (Käfig). https://share.temu.com/FtQeY6OLEPA',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Textilien';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Himmelbett Vorhänge' AND c.name = 'Scenery'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Hochzeitsschleier', 'prop', NULL, 'erhalten', false, true, false, 'Produziert', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Accessoires';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Hochzeitsschleier' AND c.name = 'Mina Murray'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Hochzeitsschleier', 'prop', NULL, 'erhalten', false, true, false, 'Produziert', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Accessoires';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Hochzeitsschleier' AND c.name = 'Lucy Westenra'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Holzpflock, 2', 'prop', NULL, 'erhalten', false, true, false, 'Produziert', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Diverse';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Holzpflock, 2' AND c.name = 'Jack Seward'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Hostie', 'prop', NULL, 'erhalten', false, false, false, 'Produziert', 'wird nicht benutzt',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Religiös';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Hostie' AND c.name = 'Van Helsing'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Karaffe bei Wirtin', 'prop', NULL, 'erhalten', false, true, false, 'Spende', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Essen & Trinken';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Karaffe bei Wirtin' AND c.name = 'Wirtin'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Karte für die Reise', 'prop', NULL, 'erhalten', false, true, false, 'Ausleihe', 'von Nils',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Papierwaren';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Karte für die Reise' AND c.name = 'Van Helsing'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Kelch', 'prop', NULL, 'erhalten', false, true, false, 'Produziert', 'für Trauungen',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Religiös';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Kelch' AND c.name = 'Ensemble'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Kerzen', 'prop', NULL, 'erhalten', false, true, false, 'Gekauft', '16-25 Kerzen. für "eh du verloren bist"',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Diverse';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Kerzen' AND c.name = 'Ensemble'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Kerzenhalter', 'prop', NULL, 'erhalten', false, true, false, 'Ausleihe', 'Draculas Schloss',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Diverse';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Kerzenhalter' AND c.name = 'Dracula'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Kette mit Kreuz', 'prop', NULL, 'erhalten', false, true, true, 'Staatstheater', 'mit magnet',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Schmuck';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Kette mit Kreuz' AND c.name = 'Lucy Westenra'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Kleine Silberglocke', 'prop', NULL, 'erhalten', false, true, true, 'Staatstheater', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Diverse';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Kleine Silberglocke' AND c.name = 'Arthur Holmwood'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Knoblauchkränze', 'prop', NULL, 'erhalten', false, true, true, 'Staatstheater', 'Lucys Schlafzimmer.',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Floristik';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Knoblauchkränze' AND c.name = 'Scenery'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Koffer (wie viele?)', 'prop', NULL, 'erhalten', false, true, false, 'Ausleihe', 'eh du verloren bist, Minas Reise. Wird geklärt.',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Taschen & Koffer';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Koffer (wie viele?)' AND c.name = 'Ensemble'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Kreuz, groß', 'prop', NULL, 'erhalten', false, true, true, 'Staatstheater', 'für den Priester',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Religiös';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Kreuz, groß' AND c.name = 'Ensemble'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Krücke', 'prop', NULL, 'erhalten', false, true, false, 'Staatstheater', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Accessoires';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Krücke' AND c.name = 'Jonathan Harker'
ON CONFLICT DO NOTHING;
INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Krücke' AND c.name = 'Mina Murray'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Kruzifix', 'prop', NULL, 'erhalten', false, true, true, 'Staatstheater', 'zum anziehen',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Schmuck';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Kruzifix' AND c.name = 'Jonathan Harker'
ON CONFLICT DO NOTHING;
INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Kruzifix' AND c.name = 'Wirtin'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Kruzifix', 'prop', NULL, 'erhalten', false, true, true, 'Staatstheater', 'zum anziehen',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Schmuck';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Kruzifix' AND c.name = 'Van Helsing'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Kruzifix, 3D Druck', 'prop', NULL, 'erhalten', false, true, false, 'Produziert', 'Lucys Salon, VH bei “Zu Ende”',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Religiös';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Kruzifix, 3D Druck' AND c.name = 'Scenery'
ON CONFLICT DO NOTHING;
INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Kruzifix, 3D Druck' AND c.name = 'Van Helsing'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Kunstblut', 'prop', NULL, 'fehlt', true, true, false, 'Gekauft', 'welche Arten? wo gebraucht? recherchieren und abstimmen',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'FX-Requisiten';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Kunstblut' AND c.name = 'Scenery'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Lappen', 'prop', NULL, 'erhalten', false, true, false, 'Spende', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Diverse';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Lappen' AND c.name = 'Wirtin'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Laternen, 3', 'prop', NULL, 'erhalten', false, true, false, 'Ausleihe', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Diverse';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Laternen, 3' AND c.name = 'Arthur Holmwood'
ON CONFLICT DO NOTHING;
INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Laternen, 3' AND c.name = 'Jack Seward'
ON CONFLICT DO NOTHING;
INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Laternen, 3' AND c.name = 'Quincey Morris'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Medizinische Instrumente', 'prop', NULL, 'erhalten', false, true, false, 'Produziert', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Medizinisch';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Medizinische Instrumente' AND c.name = 'Jack Seward'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Medizinische Tasche', 'prop', NULL, 'erhalten', false, true, true, 'Staatstheater', 'mit Vampire Hunter Utensilien',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Taschen & Koffer';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Medizinische Tasche' AND c.name = 'Van Helsing'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Messer', 'prop', NULL, 'erhalten', false, true, false, 'Produziert', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Waffen';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Messer' AND c.name = 'Dracula'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Morphium-Injektionsset', 'prop', NULL, 'erhalten', false, true, false, 'Produziert', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Medizinisch';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Morphium-Injektionsset' AND c.name = 'Van Helsing'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Munitionsgürtel', 'prop', NULL, 'reparatur', false, true, false, 'Produziert', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Accessoires';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Munitionsgürtel' AND c.name = 'Quincey Morris'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Notizblock und Stift', 'prop', NULL, 'erhalten', false, true, false, 'Produziert', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Schreibgeräte';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Notizblock und Stift' AND c.name = 'Jonathan Harker'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Notizblock und Stift', 'prop', NULL, 'erhalten', false, true, false, 'Produziert', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Schreibgeräte';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Notizblock und Stift' AND c.name = 'Jack Seward'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Notizbuch', 'prop', NULL, 'klären', false, true, false, 'Gekauft', 'Dick und gut benutzt. Wird referenziert in Szene 12.',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Papierwaren';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Notizbuch' AND c.name = 'Van Helsing'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Ohrhänger', 'prop', NULL, 'erhalten', false, true, false, 'Produziert', 'Silber und Rot',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Schmuck';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Ohrhänger' AND c.name = 'Mina Murray'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Ohrhänger', 'prop', NULL, 'erhalten', false, true, false, 'Produziert', 'Perle und Diamant',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Schmuck';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Ohrhänger' AND c.name = 'Lucy Westenra'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Perlenkette mit Blut Perlen', 'prop', NULL, 'erhalten', false, true, false, 'Gekauft', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Schmuck';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Perlenkette mit Blut Perlen' AND c.name = 'Lucy Westenra'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Phiole mit Weihwasser', 'prop', NULL, 'erhalten', false, true, false, 'Produziert', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Religiös';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Phiole mit Weihwasser' AND c.name = 'Lucy Westenra'
ON CONFLICT DO NOTHING;
INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Phiole mit Weihwasser' AND c.name = 'Van Helsing'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Phiole mit Weihwasser', 'prop', NULL, 'erhalten', false, false, true, 'Staatstheater', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Religiös';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Phiole mit Weihwasser' AND c.name = 'Lucy Westenra'
ON CONFLICT DO NOTHING;
INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Phiole mit Weihwasser' AND c.name = 'Van Helsing'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Prop Baby', 'prop', NULL, 'erhalten', false, true, false, 'Gekauft', '2 Tücher zum einwickeln, weil werden mit Blut getränkt. Um nicht auswaschen zu müssen.',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Diverse';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Prop Baby' AND c.name = 'Dracula'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Prop Kopf', 'prop', NULL, 'erhalten', false, true, false, 'Ausleihe', 'für die Szene im Gruft',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Diverse';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Prop Kopf' AND c.name = 'Lucy Westenra'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Prop-Essen', 'prop', NULL, 'reparatur', true, true, false, 'Produziert', 'am Tisch fixierbar. essbar, wonach man noch singen kann.',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Essen & Trinken';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Prop-Essen' AND c.name = 'Scenery'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Rasiermesser', 'prop', NULL, 'erhalten', false, true, false, 'Produziert', 'stumm / sicher',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Diverse';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Rasiermesser' AND c.name = 'Jonathan Harker'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Revolver', 'prop', NULL, 'erhalten', false, true, false, 'Ausleihe', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Waffen';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Revolver' AND c.name = 'Arthur Holmwood'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Rose, rot-schwarz', 'prop', NULL, 'erhalten', false, true, true, 'Staatstheater', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Floristik';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Rose, rot-schwarz' AND c.name = 'Dracula'
ON CONFLICT DO NOTHING;
INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Rose, rot-schwarz' AND c.name = 'Lucy Westenra'
ON CONFLICT DO NOTHING;
INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Rose, rot-schwarz' AND c.name = 'Mina Murray'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Rose, verwelkt', 'prop', NULL, 'erhalten', false, true, true, 'Staatstheater', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Floristik';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Rose, verwelkt' AND c.name = 'Dracula'
ON CONFLICT DO NOTHING;
INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Rose, verwelkt' AND c.name = 'Scenery'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Rose, weiß', 'prop', NULL, 'erhalten', false, true, true, 'Staatstheater', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Floristik';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Rose, weiß' AND c.name = 'Scenery'
ON CONFLICT DO NOTHING;
INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Rose, weiß' AND c.name = 'Wirtin'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Rosenblüten', 'prop', NULL, 'erhalten', false, true, false, 'Gekauft', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Floristik';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Rosenblüten' AND c.name = 'Scenery'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Runder Tisch', 'prop', NULL, 'erhalten', false, true, false, 'Staatstheater', 'Mina. Wirtin hat den Esstisch.',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Möbel';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Runder Tisch' AND c.name = 'Scenery'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Sarg', 'prop', NULL, 'klären', false, true, false, 'Spende', 'Sarggesteck nachmachen?',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Möbel';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Sarg' AND c.name = 'Dracula'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Schal', 'prop', NULL, 'klären', false, true, false, 'Gekauft', 'für die Mutter, darf mit Kunstblut beschmutzt werden',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Textilien';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Schal' AND c.name = 'Ensemble'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Schale', 'prop', NULL, 'erhalten', false, true, false, 'Ausleihe', 'zum rasieren und waschen',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Diverse';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Schale' AND c.name = 'Jonathan Harker'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Schatullen für Insekten', 'prop', NULL, 'erhalten', false, true, false, 'Produziert', 'Renfield',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Möbel';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Schatullen für Insekten' AND c.name = 'Scenery'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Schreibmachine', 'prop', NULL, 'erhalten', false, true, false, 'Ausleihe', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Papierwaren';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Schreibmachine' AND c.name = 'Mina Murray'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Schulstuhl', 'prop', NULL, 'erhalten', false, true, false, 'Ausleihe', 'Renfield, Reprise',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Möbel';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Schulstuhl' AND c.name = 'Scenery'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Seil (als Aderpresse)', 'prop', NULL, 'erhalten', false, true, false, 'Gekauft', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Textilien';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Seil (als Aderpresse)' AND c.name = 'Van Helsing'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Servierwagen', 'prop', NULL, 'reparatur', false, true, false, 'Gekauft', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Möbel';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Servierwagen' AND c.name = 'Scenery'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Sessel', 'prop', NULL, 'erhalten', false, true, false, 'Ausleihe', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Möbel';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Sessel' AND c.name = 'Scenery'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Sofa', 'prop', NULL, 'erhalten', false, true, false, 'Staatstheater', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Möbel';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Sofa' AND c.name = 'Scenery'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Spazierstock', 'prop', NULL, 'erhalten', false, true, false, 'Staatstheater', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Accessoires';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Spazierstock' AND c.name = 'Arthur Holmwood'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Stühle (3)', 'prop', NULL, 'erhalten', false, true, false, 'Staatstheater', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Möbel';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Stühle (3)' AND c.name = 'Scenery'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Taschentücher', 'prop', NULL, 'erhalten', false, true, false, 'Gekauft', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Accessoires';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Taschentücher' AND c.name = 'Ensemble'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Taschenuhr', 'prop', NULL, 'erhalten', false, true, false, 'Ausleihe', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Accessoires';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Taschenuhr' AND c.name = 'Arthur Holmwood'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Taschenuhr', 'prop', NULL, 'erhalten', false, true, false, 'Staatstheater', 'für Hypnose',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Accessoires';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Taschenuhr' AND c.name = 'Van Helsing'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Taschenuhr', 'prop', NULL, 'erhalten', false, true, false, 'Staatstheater', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Accessoires';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Taschenuhr' AND c.name = 'Jack Seward'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Teeservice', 'prop', NULL, 'erhalten', false, true, false, 'Gekauft', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Essen & Trinken';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Teeservice' AND c.name = 'Scenery'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Telegramm aus Budapest', 'prop', NULL, 'erhalten', false, true, false, 'Produziert', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Papierwaren';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Telegramm aus Budapest' AND c.name = 'Mina Murray'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Teppichtasche', 'prop', NULL, 'erhalten', false, true, false, 'Staatstheater', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Taschen & Koffer';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Teppichtasche' AND c.name = 'Mina Murray'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Trauring', 'prop', NULL, 'erhalten', false, true, false, 'Staatstheater', 'Größe checken',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Schmuck';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Trauring' AND c.name = 'Mina Murray'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Trauring', 'prop', NULL, 'erhalten', false, true, false, 'Staatstheater', 'Größe checken',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Schmuck';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Trauring' AND c.name = 'Jonathan Harker'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Trauring', 'prop', NULL, 'erhalten', false, true, false, 'Staatstheater', 'Größe checken',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Schmuck';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Trauring' AND c.name = 'Arthur Holmwood'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Trauring', 'prop', NULL, 'erhalten', false, true, false, 'Staatstheater', 'Größe checken',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Schmuck';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Trauring' AND c.name = 'Lucy Westenra'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Vase für die Rose', 'prop', NULL, 'erhalten', false, true, false, 'Gekauft', 'Für die Rose',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Diverse';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Vase für die Rose' AND c.name = 'Scenery'
ON CONFLICT DO NOTHING;
INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Vase für die Rose' AND c.name = 'Wirtin'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Vögelkäfige', 'prop', NULL, 'erhalten', false, true, false, 'Staatstheater', 'Renfield',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Möbel';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Vögelkäfige' AND c.name = 'Scenery'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Weihrauch Fässchen', 'prop', NULL, 'erhalten', false, true, false, 'Gekauft', 'für den Priester',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Religiös';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Weihrauch Fässchen' AND c.name = 'Ensemble'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Weinflasche', 'prop', NULL, 'fehlt', true, true, false, 'Produziert', 'Rotwein. Draculas Schloss',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Essen & Trinken';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Weinflasche' AND c.name = 'Scenery'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Weinkelch', 'prop', NULL, 'erhalten', false, true, false, 'Ausleihe', 'Draculas Schloss',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Essen & Trinken';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Weinkelch' AND c.name = 'Scenery'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Whiskeykaraffe und 2 Gläser', 'prop', NULL, 'erhalten', false, true, false, 'Ausleihe', 'für Arthurs Salon',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Essen & Trinken';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Whiskeykaraffe und 2 Gläser' AND c.name = 'Scenery'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Winchester-Gewehr', 'prop', NULL, 'erhalten', false, true, false, 'Produziert', NULL,
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Waffen';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Winchester-Gewehr' AND c.name = 'Quincey Morris'
ON CONFLICT DO NOTHING;

INSERT INTO items (name, type, scene, status, is_consumable, is_used, is_changeable, source, notes, category_id, created_by)
SELECT 'Zigarre', 'prop', NULL, 'fehlt', true, true, false, 'Produziert', 'FEHLT!!!',
       c.id, '900f55da-5f72-432b-b42f-c206fe2c758a'
FROM categories c
WHERE c.name = 'Essen & Trinken';

INSERT INTO item_characters (item_id, character_id)
SELECT i.id, c.id
FROM items i, characters c
WHERE i.name = 'Zigarre' AND c.name = 'Quincey Morris'
ON CONFLICT DO NOTHING;

