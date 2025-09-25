-- Generated tasks from todo markdown

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Vampire Kostüm für Toska', 'not_started', 'high', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Costumes' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Vampire Kostüm für Toska' AND tag.name = 'neu-besetzt';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Vampire Kostüm für Toska' AND tag.name = 'toska';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Vampire Kostüm für Johanna', 'not_started', 'high', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Costumes' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Vampire Kostüm für Johanna' AND tag.name = 'neu-besetzt';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Vampire Kostüm für Johanna' AND tag.name = 'johanna';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Tarnung für Johanna (das blaue Kleid hinten?)', 'not_started', 'high', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Costumes' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Tarnung für Johanna (das blaue Kleid hinten?)' AND tag.name = 'neu-besetzt';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Tarnung für Johanna (das blaue Kleid hinten?)' AND tag.name = 'johanna';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Tarnung für Toska', 'not_started', 'high', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Costumes' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Tarnung für Toska' AND tag.name = 'neu-besetzt';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Tarnung für Toska' AND tag.name = 'toska';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Anproben für Toska und Johanna (Tanja organisiert)', 'not_started', 'high', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Costumes' AND u.full_name = 'Tanja' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Anproben für Toska und Johanna (Tanja organisiert)' AND tag.name = 'anprobe';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Anproben für Toska und Johanna (Tanja organisiert)' AND tag.name = 'neu-besetzt';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Neue Kostüme: Bitten, selbst Schuhe und Safety Shorts zu besorgen', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Costumes' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Neue Kostüme: Bitten, selbst Schuhe und Safety Shorts zu besorgen' AND tag.name = 'kommunikation';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Neue Kostüme: Bitten, selbst Schuhe und Safety Shorts zu besorgen' AND tag.name = 'organisation';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Herausfinden wer Annas 3 kleine Rollen übernimmt', 'not_started', 'high', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Administrative' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Herausfinden wer Annas 3 kleine Rollen übernimmt' AND tag.name = 'organisation';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Herausfinden wer Annas 3 kleine Rollen übernimmt' AND tag.name = 'casting';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Herausfinden wer Annas 3 kleine Rollen übernimmt' AND tag.name = 'neu-besetzt';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Klären ob neue Kostüme nötig oder Annas Kostüme verwendbar', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Costumes' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Klären ob neue Kostüme nötig oder Annas Kostüme verwendbar' AND tag.name = 'organisation';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Anna Kleid Reißverschluss reparieren (ausgeliehen, muss zurück)', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Costumes' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Anna Kleid Reißverschluss reparieren (ausgeliehen, muss zurück)' AND tag.name = 'reparatur';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Inventur abschließen', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Administrative' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Inventur abschließen' AND tag.name = 'kostüme';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Inventur abschließen' AND tag.name = 'dokumentation';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Anfragen, wer noch Kostüme zuhause hat; ob gewaschen oder nicht; checken und anprobieren - ob Reparatur oder Anpassung notwendig', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Costumes' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Anfragen, wer noch Kostüme zuhause hat; ob gewaschen oder nicht; checken und anprobieren - ob Reparatur oder Anpassung notwendig' AND tag.name = 'kommunikation';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Anfragen, wer noch Kostüme zuhause hat; ob gewaschen oder nicht; checken und anprobieren - ob Reparatur oder Anpassung notwendig' AND tag.name = 'organisation';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Hat Martin noch das Kostüm?', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Costumes' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Hat Martin noch das Kostüm?' AND tag.name = 'kommunikation';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Hat Martin noch das Kostüm?' AND tag.name = 'organisation';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Nach Anproben das unbenutzte Kleidung zurück zum Staatstheater bringen und wenn noch notwendig nach fehlender Kleidung suchen', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Costumes' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Nach Anproben das unbenutzte Kleidung zurück zum Staatstheater bringen und wenn noch notwendig nach fehlender Kleidung suchen' AND tag.name = 'transport';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Nach Anproben das unbenutzte Kleidung zurück zum Staatstheater bringen und wenn noch notwendig nach fehlender Kleidung suchen' AND tag.name = 'organisation';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Neue rote Akzente für Main Vampires', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Costumes' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Neue rote Akzente für Main Vampires' AND tag.name = 'anpassung';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Neues Kleid für Elisa', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Costumes' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Neues Kleid für Elisa' AND tag.name = 'elisa';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Polina Schuhe', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Costumes' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Polina Schuhe' AND tag.name = 'schuhe';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Servierwagen - Griff reparieren', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Props' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Servierwagen - Griff reparieren' AND tag.name = 'reparatur';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Servierwagen - Griff reparieren' AND tag.name = 'handwerk';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Anna Kleid Reißverschluss (so dass man abgeben kann)', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Costumes' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Anna Kleid Reißverschluss (so dass man abgeben kann)' AND tag.name = 'reparatur';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Quincy Gürtel und Messerscheide reparieren', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Costumes' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Quincy Gürtel und Messerscheide reparieren' AND tag.name = 'reparatur';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Quincy Gürtel und Messerscheide reparieren' AND tag.name = 'props';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Sofa Saumband ankleben', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Props' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Sofa Saumband ankleben' AND tag.name = 'reparatur';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Sofa Saumband ankleben' AND tag.name = 'handwerk';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Entscheiden welche Perücke für Lucy: Option 1: Ihre Lace-Front (braucht Perückenkleber) Option 2: Die alte versuchen zu retten/umzustylen', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Administrative' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Entscheiden welche Perücke für Lucy: Option 1: Ihre Lace-Front (braucht Perückenkleber) Option 2: Die alte versuchen zu retten/umzustylen' AND tag.name = 'maske';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Entscheiden welche Perücke für Lucy: Option 1: Ihre Lace-Front (braucht Perückenkleber) Option 2: Die alte versuchen zu retten/umzustylen' AND tag.name = 'perücken';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Entscheiden welche Perücke für Lucy: Option 1: Ihre Lace-Front (braucht Perückenkleber) Option 2: Die alte versuchen zu retten/umzustylen' AND tag.name = 'entscheidung';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Je nach Entscheidung: Perückenkleber besorgen oder Perücke reparieren', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Administrative' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Je nach Entscheidung: Perückenkleber besorgen oder Perücke reparieren' AND tag.name = 'maske';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Je nach Entscheidung: Perückenkleber besorgen oder Perücke reparieren' AND tag.name = 'perücken';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Je nach Entscheidung: Perückenkleber besorgen oder Perücke reparieren' AND tag.name = 'bestellung';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Je nach Entscheidung: Perückenkleber besorgen oder Perücke reparieren' AND tag.name = 'handwerk';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Neue Perücke (allgemein)', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Administrative' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Neue Perücke (allgemein)' AND tag.name = 'maske';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Neue Perücke (allgemein)' AND tag.name = 'perücken';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Neue Perücke (allgemein)' AND tag.name = 'bestellung';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Mina Perücke anpassen', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Administrative' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Mina Perücke anpassen' AND tag.name = 'maske';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Mina Perücke anpassen' AND tag.name = 'perücken';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Mina Perücke anpassen' AND tag.name = 'anpassung';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Maskenbildner früh rekrutieren (nicht last-minute)', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Administrative' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Maskenbildner früh rekrutieren (nicht last-minute)' AND tag.name = 'personal';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Maskenbildner früh rekrutieren (nicht last-minute)' AND tag.name = 'maske';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Maskenbildner früh rekrutieren (nicht last-minute)' AND tag.name = 'organisation';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Maske "Aufseher" für Perücken organisieren', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Administrative' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Maske "Aufseher" für Perücken organisieren' AND tag.name = 'personal';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Maske "Aufseher" für Perücken organisieren' AND tag.name = 'maske';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Maske "Aufseher" für Perücken organisieren' AND tag.name = 'organisation';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Requisitenliste aufräumen', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Props' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Requisitenliste aufräumen' AND tag.name = 'dokumentation';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Requisitenliste aufräumen' AND tag.name = 'organisation';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Requisiten den Bühnenseiten zuordnen (Tanja Aufgabe)', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Props' AND u.full_name = 'Tanja' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Requisiten den Bühnenseiten zuordnen (Tanja Aufgabe)' AND tag.name = 'organisation';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Requisiten den Bühnenseiten zuordnen (Tanja Aufgabe)' AND tag.name = 'planung';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT '2 Menschen für Requisiten organisieren (sortieren vor und nach Shows)', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Props' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = '2 Menschen für Requisiten organisieren (sortieren vor und nach Shows)' AND tag.name = 'personal';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = '2 Menschen für Requisiten organisieren (sortieren vor und nach Shows)' AND tag.name = 'organisation';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Spaten in die Liste aufnehmen', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Props' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Spaten in die Liste aufnehmen' AND tag.name = 'dokumentation';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Das Messer für Finale', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Props' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Das Messer für Finale' AND tag.name = 'bestellung';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Wein (Karaffe?)', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Props' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Wein (Karaffe?)' AND tag.name = 'bestellung';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Batterien für die Kerzen', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Props' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Batterien für die Kerzen' AND tag.name = 'bestellung';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Batterien für die Kerzen' AND tag.name = 'technik';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'D. Messer', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Props' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'D. Messer' AND tag.name = 'bestellung';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Mannequin-Kopf unten "gory" machen (frisch abgehackt-Look)', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Props' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Mannequin-Kopf unten "gory" machen (frisch abgehackt-Look)' AND tag.name = 'spezialeffekte';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Mannequin-Kopf unten "gory" machen (frisch abgehackt-Look)' AND tag.name = 'handwerk';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Benötigt: Latex, Füllmaterial, Farbe', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Props' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Benötigt: Latex, Füllmaterial, Farbe' AND tag.name = 'spezialeffekte';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Benötigt: Latex, Füllmaterial, Farbe' AND tag.name = 'bestellung';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Himmelbett-Projekt: Umbau optimieren', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Props' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Himmelbett-Projekt: Umbau optimieren' AND tag.name = 'handwerk';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Himmelbett-Projekt: Umbau optimieren' AND tag.name = 'bühnenaufbau';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Himmelbett-Projekt: Bett Basis stabilisieren', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Props' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Himmelbett-Projekt: Bett Basis stabilisieren' AND tag.name = 'handwerk';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Himmelbett-Projekt: Bett Basis stabilisieren' AND tag.name = 'bühnenaufbau';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Himmelbett-Projekt: Bettbezug - größer, nicht nur Spannbetttuch, bis zum Boden', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Props' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Himmelbett-Projekt: Bettbezug - größer, nicht nur Spannbetttuch, bis zum Boden' AND tag.name = 'kostüme';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Himmelbett-Projekt: Bettbezug - größer, nicht nur Spannbetttuch, bis zum Boden' AND tag.name = 'handwerk';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Himmelbett-Projekt: Gesamte Bett-Lösung finalisieren', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Props' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Himmelbett-Projekt: Gesamte Bett-Lösung finalisieren' AND tag.name = 'handwerk';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Himmelbett-Projekt: Gesamte Bett-Lösung finalisieren' AND tag.name = 'bühnenaufbau';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Käfig-Projekt: Optimieren und Lösung finalisieren', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Props' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Käfig-Projekt: Optimieren und Lösung finalisieren' AND tag.name = 'handwerk';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Käfig-Projekt: Optimieren und Lösung finalisieren' AND tag.name = 'bühnenaufbau';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Käfig-Projekt: Optionen prüfen: cardboard tubes? Foldable mechanism?', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Props' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Käfig-Projekt: Optionen prüfen: cardboard tubes? Foldable mechanism?' AND tag.name = 'handwerk';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Käfig-Projekt: Optionen prüfen: cardboard tubes? Foldable mechanism?' AND tag.name = 'recherche';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Bänke-Projekt: Bezug für die Bänke', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Props' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Bänke-Projekt: Bezug für die Bänke' AND tag.name = 'kostüme';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Bänke-Projekt: Bezug für die Bänke' AND tag.name = 'handwerk';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Bänke-Projekt: Besser verkleiden', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Props' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Bänke-Projekt: Besser verkleiden' AND tag.name = 'handwerk';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Bänke-Projekt: Besser verkleiden' AND tag.name = 'bühnenaufbau';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Platte mit Essen - Stuff ankleben', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Props' AND u.full_name = 'Liza' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Platte mit Essen - Stuff ankleben' AND tag.name = 'handwerk';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Video Wall vorprogrammieren', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Tech' AND u.full_name = 'Werner K.' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Video Wall vorprogrammieren' AND tag.name = 'av';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Video Wall vorprogrammieren' AND tag.name = 'programmierung';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Beide Video Walls benutzen', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Tech' AND u.full_name = 'Werner K.' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Beide Video Walls benutzen' AND tag.name = 'av';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Beide Video Walls benutzen' AND tag.name = 'planung';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Bilder für die Wall optimieren (was ist mit der neuen Wall?)', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Tech' AND u.full_name = 'Werner K.' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Bilder für die Wall optimieren (was ist mit der neuen Wall?)' AND tag.name = 'av';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Bilder für die Wall optimieren (was ist mit der neuen Wall?)' AND tag.name = 'content';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Fledermäuse anstatt double bei "Zu Ende": Schwarm attackiert nach vorne, sammelt sich in D Form ("Ich bin noch lange nicht tot")', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Tech' AND u.full_name = 'Werner K.' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Fledermäuse anstatt double bei "Zu Ende": Schwarm attackiert nach vorne, sammelt sich in D Form ("Ich bin noch lange nicht tot")' AND tag.name = 'av';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Fledermäuse anstatt double bei "Zu Ende": Schwarm attackiert nach vorne, sammelt sich in D Form ("Ich bin noch lange nicht tot")' AND tag.name = 'spezialeffekte';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Fledermäuse anstatt double bei "Zu Ende": Schwarm attackiert nach vorne, sammelt sich in D Form ("Ich bin noch lange nicht tot")' AND tag.name = 'content';

INSERT INTO tasks (title, status, priority, department_id, assigned_to, created_by)
SELECT 'Licht vorprogrammieren', 'not_started', 'medium', d.id, u.id, creator.id
FROM departments d, users u, users creator
WHERE d.name = 'Tech' AND u.full_name = 'Werner D.' AND creator.full_name = 'Liza';

INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Licht vorprogrammieren' AND tag.name = 'licht';
INSERT INTO task_tag_assignments (task_id, tag_id)
SELECT t.id, tag.id
FROM tasks t, task_tags tag
WHERE t.title = 'Licht vorprogrammieren' AND tag.name = 'programmierung';

