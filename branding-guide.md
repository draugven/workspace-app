# Branding Guide

## Typefaces & Hierarchy

**Display / Logo Font**
- Montserrat — ExtraBold / Bold
- Usage: Logo, main headings, hero text

**UI / Body Font**
- Roboto — Regular, Medium, Bold
- Usage: body copy, UI elements, forms, buttons

Include the fonts either with import:
`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Roboto:wght@400;500;700&display=swap');`

or with link in `<head>` (decide which approach is better):
`<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">`

**Hierarchy Examples**

| Style          | Font        | Weight | Size Example | Usage                        |
|----------------|-------------|--------|--------------|------------------------------|
| **H1**         | Montserrat  | 800    | 48 px        | Primary page headings        |
| **H2**         | Montserrat  | 700    | 36 px        | Section headings             |
| **H3**         | Montserrat  | 600–700| 24 px        | Sub-sections                 |
| **Body**       | Roboto      | 400    | 16 px        | Paragraphs                   |
| **Button/Label** | Roboto    | 500–700| 14–16 px     | Buttons, labels              |
| **Caption**    | Roboto      | 400    | 12 px        | Metadata, small text         |

**remember to add fallback font-family**

## Colors

| Role                | Name             | HEX     | RGB              | Usage                                           |
|---------------------|------------------|---------|------------------|-------------------------------------------------|
| **Primary Text**    | Dark Gray        | #2C2C2E | (44, 44, 46)     | Main text, logo on light backgrounds            |
| **Primary Accent**  | Accent Red       | #E74746 | (231, 71, 70)    | Buttons, links, highlights, alerts              |
| **Neutral Light**   | Light Gray       | #F7F7F7 | (247, 247, 247)  | Page backgrounds, cards, surfaces               |
| **Secondary Text**  | Medium Gray      | #565656 | (86, 86, 86)     | Secondary text, captions, subheaders            |
| **Secondary Accent**| Gold Accent      | #CF9C2A | (207, 156, 42)   | Decorative / spotlight accent use only          |