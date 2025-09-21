# Theater Production Collaboration Tool

A Next.js web application for small theater production teams to manage props, costumes, tasks, and collaborative notes.

## Features

- **Props & Costumes Management**: Track items with customizable properties, status tracking, and character assignments
- **Task Management**: Multi-status workflow (Not Started → In Progress → Done/Blocked) with department grouping and assignments
- **Collaborative Notes**: Rich text editing with conflict warnings and version history
- **Real-time Collaboration**: Live updates for concurrent editing
- **Mobile Responsive**: Optimized for theater venue use

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime
- **Rich Text**: Tiptap editor
- **Tables**: TanStack Table

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Setup

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd theater-production-app
   npm install
   ```

2. **Set up Supabase**:
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Update `.env.local`:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
     SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
     ```

3. **Initialize the database**:
   - In your Supabase SQL editor, run:
     - `database-schema.sql` (creates tables)
     - `seed-data.sql` (creates departments, users, etc.)
     - `items-seed-data.sql` (imports props/costumes data)
     - `tasks-seed-data.sql` (imports tasks data)

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   - Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── src/
│   ├── app/                 # Next.js 14 app directory
│   ├── components/          # React components
│   │   └── ui/             # Shadcn/ui components
│   ├── lib/                # Utilities and configurations
│   └── types/              # TypeScript type definitions
├── scripts/                # Data processing scripts
├── seed data/             # Original CSV and markdown files
├── *.sql                  # Database schema and seed files
└── README.md
```

## Database Schema

The app uses a PostgreSQL database with the following main tables:

- `users` - User authentication and profiles
- `departments` - Theater production departments
- `characters` - Characters in the production
- `categories` - Item categories (props/costumes)
- `items` - Props and costumes with status tracking
- `tasks` - Task management with workflow states
- `notes` - Collaborative notes with version history

## Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript checks

### Data Import

The project includes scripts to parse existing CSV and markdown data:

- `scripts/parse-csv-data.js` - Converts props CSV to SQL inserts
- `scripts/parse-todos.js` - Converts todo markdown to task SQL inserts

## Deployment

The app is designed to deploy easily on Vercel with Supabase as the backend:

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

## Contributing

This tool is specifically designed for the "Dracula the Musical" production but can be adapted for other theater productions by:

1. Updating the character list in `seed-data.sql`
2. Modifying department structures as needed
3. Adjusting item categories and statuses
4. Customizing task workflows

## License

Private project for theater production use.