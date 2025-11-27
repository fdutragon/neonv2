# Project Structure

## Directory Organization

```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin-specific components
│   ├── Layout.tsx      # Public layout wrapper
│   └── [PWA components] # PWA-related UI
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
│   ├── supabase.ts     # Supabase client + types
│   ├── brazilianVehicles.ts  # Brazilian vehicle data
│   ├── externalVehicles.ts   # External vehicle generation
│   └── utils.ts        # Helper functions
├── pages/              # Route components
│   ├── admin/          # Admin pages (Dashboard, Login, Vehicles, VehicleForm)
│   ├── Home.tsx        # Homepage with featured vehicles
│   ├── VehicleSearch.tsx  # Search with filters
│   └── VehicleDetail.tsx  # Vehicle detail page
├── stores/             # Zustand state management
│   └── appStore.ts     # Main application store
├── test/               # Test configuration
├── App.tsx             # Root component with routing
└── main.tsx            # Application entry point

public/                 # Static assets
supabase/migrations/    # Database migrations
```

## Routing Structure
- `/` - Public homepage
- `/search` - Vehicle search page
- `/vehicle/:id` - Vehicle detail page
- `/admin/login` - Admin authentication
- `/admin` - Admin dashboard
- `/admin/vehicles` - Vehicle management
- `/admin/vehicles/new` - Add vehicle
- `/admin/vehicles/edit/:id` - Edit vehicle

## Code Organization Patterns

### Components
- Functional components with TypeScript
- Default exports for page components
- Named exports for reusable components
- Admin components in `components/admin/` subdirectory

### State Management
- Zustand store in `stores/appStore.ts`
- Centralized vehicle data fetching
- Authentication state management
- Loading and error states

### Styling
- Tailwind CSS utility classes
- Dark mode support via `class` strategy
- Responsive design (mobile-first approach)
- Premium color scheme: black, white, metallic gray, blue (#1E3A8A), gold (#D4AF37)

### Type Definitions
- TypeScript interfaces in `lib/supabase.ts`
- Main types: `Vehicle`, `VehicleImage`, `ContactInterest`, `VehicleWithImages`
- Specifications stored as JSONB with flexible schema

### Path Aliases
- `@/*` resolves to `src/*`
- Use absolute imports for cleaner code

## Testing
- Test files colocated with components (`.test.tsx`)
- Vitest + Testing Library setup
- Test configuration in `src/test/setup.ts`
