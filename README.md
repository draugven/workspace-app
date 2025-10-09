# Back2Stage - Theater Production Collaboration Tool

A Next.js web application for small theater production teams to manage props, costumes, tasks, and collaborative notes.

## Features

- **Requisiten Management**: Track props/costumes with sortable columns, advanced filtering (category, source, status, characters), character assignments, and category colors
- **Task Management**: Kanban board and table views with drag-and-drop, rich text descriptions, priority levels, tag system, and completed task filtering
- **Collaborative Notes**: Real-time rich text editing with Tiptap editor, version history tracking, and restore functionality
- **Admin System**: App-level security with admin-only deletion and management features
- **Dark Theme**: Complete dark mode support with manual theme toggle
- **Mobile Responsive**: Optimized UI with burger menu navigation and responsive layouts
- **Real-time Updates**: Live data synchronization across all users
- **Colorful Organization**: Character and category badges with thematic color assignments

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui components
- **Database**: Supabase (PostgreSQL, Auth, Storage, Real-time)
- **Rich Text**: Tiptap editor with SSR support
- **Tables**: TanStack Table v8
- **Drag & Drop**: @dnd-kit library
- **Command Menu**: cmdk (multi-select component)
- **Typography**: Lexend (headings), Roboto (body)
- **Deployment**: Docker + GitHub Actions + Kubernetes

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Setup

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd workspace-app
   npm install
   ```

2. **Set up Supabase**:
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Copy your project URL and keys
   - Copy `.env.local.example` to `.env.local` and update:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
     SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
     ```

3. **Initialize the database**:
   - In your Supabase SQL editor, run:
     - `scripts/database-setup/database-setup-complete.sql` (complete setup with seed data)
     - `scripts/database-setup/supabase-storage-setup.sql` (file storage configuration)
   - Assign admin role to your user:
     - Update user ID in `scripts/database-setup/assign-admin-role.sql`
     - Run the script in Supabase SQL editor

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── src/
│   ├── app/                    # Next.js 14 app directory
│   │   ├── page.tsx           # Dashboard
│   │   ├── props/             # Requisiten management
│   │   ├── tasks/             # Task management
│   │   ├── notes/             # Collaborative notes
│   │   └── api/               # API routes (users, admin endpoints)
│   ├── components/
│   │   ├── auth/              # Authentication components
│   │   ├── items/             # Requisiten components
│   │   ├── tasks/             # Task management components
│   │   ├── notes/             # Note components with Tiptap
│   │   ├── theme/             # Theme provider and toggle
│   │   ├── layout/            # Navigation, footer
│   │   └── ui/                # Shadcn/ui components
│   ├── lib/                   # Utilities and configurations
│   │   ├── supabase.ts        # Supabase client
│   │   ├── auth-utils.ts      # Server-side admin utilities
│   │   └── color-utils.ts     # Color utilities for badges
│   ├── hooks/                 # React hooks
│   │   ├── use-admin-check.tsx        # Client-side admin checking
│   │   ├── use-realtime-data.tsx      # Generic real-time hook
│   │   ├── use-realtime-items.tsx     # Real-time items hook
│   │   ├── use-realtime-tasks.tsx     # Real-time tasks hook
│   │   └── use-realtime-notes-v2.tsx  # Real-time notes hook
│   └── types/                 # TypeScript definitions
│       ├── database.ts        # Database schema types
│       └── index.ts           # Extended types with colors
├── docs/                      # Documentation
│   ├── lessons-learned/       # Postmortems and technical learnings
│   ├── CODE_ANALYSIS.md       # Code review findings
│   ├── PERFORMANCE_ANALYSIS.md    # Performance analysis
│   ├── TEST_COVERAGE.md       # Test coverage reports
│   ├── TESTING.md             # Testing guidelines
│   └── supabase-invite-only-implementation.md
├── scripts/
│   └── database-setup/        # SQL schema and setup scripts
├── docker/                    # Docker configuration
├── .github/workflows/         # GitHub Actions CI/CD
├── public/                    # Static assets (logos, favicons)
├── CLAUDE.md                  # Project instructions for AI
└── README.md
```

## Database Schema

The app uses Supabase (PostgreSQL) with the following main tables:

- `auth.users` - Supabase authentication (no custom users table)
- `user_roles` - Admin role system (app-level security, no RLS)
- `departments` - Theater production departments with colors
- `characters` - Characters in the production with colors
- `categories` - Item categories with thematic colors
- `items` - Props/costumes with status tracking, character relationships
- `tasks` - Task management with priority, status, ranking, rich descriptions
- `task_tags` - Categorized tags (Bereich, Typ)
- `notes` - Collaborative notes with real-time editing
- `note_versions` - Version history for notes
- `item_files` - File attachments for items

## Development

### Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript checks

**Always run lint, typecheck, and build after major changes.**

### Key Technical Solutions

- **Tiptap SSR**: Dynamic imports with mobile viewport fix (`scrollIntoView()` on focus)
- **Task Ranking**: INTEGER field with 1000-unit spacing for drag-and-drop
- **Multi-select**: cmdk/Command with grid layout (2-3 columns)
- **Admin System**: App-level security without RLS complexity
- **Real-time**: Generic hook with retry logic and automatic reconnection
- **Color System**: Hex → RGBA utilities for badges and backgrounds
- **Dark Theme**: Context + localStorage with logo switching
- **Mobile**: Responsive layouts, burger menu, editor viewport handling

See `CLAUDE.md` for complete technical documentation.

## Deployment

The app uses Docker + GitHub Actions for deployment:

1. **Docker**: Multi-stage build with environment variables
2. **GitHub Actions**: Automatic build and push to Docker Hub on every push to main
3. **Kubernetes**: Automatic deployment trigger via k8s manifest updates

**Deployment secrets required:**
- `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `TUM_DRAUG_K8S_PRIVATE_KEY`

## Current Version

**v0.12.4** - UI refinements and mobile improvements

Recent updates:
- **v0.12.4**: Moved Requisiten to /props route, improved table views, mobile editor viewport fix, dark mode badge improvements
- **v0.12.3**: Sortable columns and comprehensive filtering for items table
- **v0.12.2**: Multi-select component with grid layout for characters and tags
- **v0.12.1**: Completed tasks toggle filter
- **v0.12.0**: Version history tracking with snapshots and restore

## Contributing

This tool is specifically designed for the "Dracula the Musical" production at TUM but can be adapted for other theater productions.

## License

Private project for theater production use.
