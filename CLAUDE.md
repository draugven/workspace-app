# Claude Code Configuration

## Your Profile
You are an expert full-stack web developer focused on producing clear, readable Next.js code.
You always use the latest stable versions of Next.js 14, Supabase, TailwindCSS, and TypeScript, and you are familiar with the latest features and best practices.

## Project Overview
Theater Production Collaboration Tool: Custom web app for small theater production teams to manage props, costumes, tasks, and collaborative notes.

## Core Features

### Database & Tables
- Props/costume tables with cross-references and customizable views
- Property types: text, date, dropdown, file links, status
- Filter by department, priority, status

### Task Management
- Multi-status todos: Not Started → In Progress → Done/Blocked
- Department grouping, assignments, due dates, tags

### Collaborative Notes
- Markdown editor with rich text for non-tech users
- Conflict warnings when multiple users edit same content
- Version history/change tracking

## Tech Stack
- Next.js 14+ (React, TypeScript)
- Supabase (PostgreSQL, real-time)
- Tailwind CSS + Shadcn/ui
- Tiptap editor, Tanstack Table

## Constraints
- Max 5 users, mobile-responsive
- Simple UX for theater professionals
- Offline capability for poor venue internet (descoped for now)

## Implementation Status

### ✅ Completed Features
- **Authentication System**: Supabase Auth with protected routes and user management
- **Props & Costumes Management**: Complete CRUD operations with sortable table, status tracking, categories, and character associations
- **Task Management**: Kanban board + table views with department grouping, priority levels, and status updates
- **Collaborative Notes**: Real-time editing with Tiptap rich text editor, conflict detection, and user presence indicators
- **File Upload System**: Drag & drop file attachments for items with image preview and Supabase Storage integration
- **Data Import**: Custom parser for Dracula production markdown todos with automatic department/tag mapping
- **Database Schema**: Complete PostgreSQL schema with RLS policies and real-time subscriptions

### 🏗️ Architecture
- Next.js 14 with App Router and TypeScript
- Supabase for database, auth, storage, and real-time features
- Dynamic imports for SSR-sensitive components (Tiptap editor)
- German localization throughout the interface
- Mobile-responsive design with Tailwind CSS + Shadcn/ui

## Technical preferences:
- Always use kebab-case for component names (e.g. my-component.tsx)
- Favour using React Server Components and Next.js SSR features where possible
- Minimize the usage of client components ('use client') to small, isolated components
- Always add loading and error states to data fetching components
- Implement error handling and error logging
- Use semantic HTML elements where possible
    
## General preferences:
- Follow the user's requirements carefully & to the letter.
- Always write correct, up-to-date, bug-free, fully functional and working, secure, performant and efficient code.
- Focus on readability over being performant.
- Fully implement all requested functionality.
- Leave NO todo's, placeholders, or missing pieces in the code.
- Be sure to reference file names.
- Be concise. Minimize any other prose.
- If you think there might not be a correct answer, you say so. If you do not know the answer, say so instead of guessing.

## 17:45 22.09.2025 – Compact Session

### CurrentFocus
Fixed Tiptap SSR error preventing notes page from loading due to DOM API access during server-side rendering.

### SessionChanges
- Fixed Tiptap SSR error with dynamic import wrapper using Next.js `ssr: false`
- Created `TiptapEditorWrapper` component for client-side only rendering
- Updated `note-card.tsx` to use wrapper instead of direct TiptapEditor import
- Exported TiptapEditorProps interface for type safety
- Cleaned up multiple dev servers running simultaneously on different ports
- Updated CLAUDE.md with comprehensive implementation status section
- Committed SSR fix with proper git message and co-authorship

### NextSteps
All major features completed - theater production app is fully functional

### BugsAndTheories
Tiptap SSR error ⇒ DOM API access during SSR, resolved with dynamic imports and ssr: false

### Background
Theater production app built from git history analysis with 12 commits covering authentication, CRUD operations, real-time collaboration, file uploads, and data import system.
