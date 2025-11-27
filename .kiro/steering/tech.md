# Technology Stack

## Core Technologies
- **React 18** with TypeScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Supabase** - Backend-as-a-Service (auth, database, storage)
- **React Router v7** - Client-side routing
- **Zustand** - State management
- **Vitest** - Testing framework

## Key Libraries
- `@supabase/supabase-js` - Supabase client
- `lucide-react` - Icon library
- `clsx` + `tailwind-merge` - Conditional class utilities
- `vite-plugin-pwa` - PWA support with Workbox
- `@testing-library/react` - Component testing

## Build System
- **TypeScript**: ES2020 target, strict mode disabled
- **Module resolution**: Bundler mode with path aliases (`@/*` → `./src/*`)
- **Vite plugins**: React, PWA, tsconfig paths, trae-solo-badge

## Common Commands
```bash
# Development
npm run dev              # Start dev server

# Building
npm run build            # TypeScript check + production build
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run check            # TypeScript type checking (no emit)

# Testing
npm test                 # Run tests once
npm run test:watch       # Run tests in watch mode
npm run test:ui          # Open Vitest UI
```

## Environment Variables
Required in `.env`:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

## Database
- **PostgreSQL** via Supabase
- Migrations in `supabase/migrations/`
- Row Level Security (RLS) policies for access control
- Tables: `vehicles`, `vehicle_images`, `contact_interests`

## PWA Configuration
- Service worker with Workbox
- Runtime caching for Supabase and FIPE API
- Offline support with NetworkFirst/CacheFirst strategies
- Auto-update registration type
