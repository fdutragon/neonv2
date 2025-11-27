# Design Document - Admin PWA

## Overview

Este documento descreve o design técnico para transformar a área administrativa da Neon Multimarcas em um Progressive Web App (PWA) completo. A solução aproveita a infraestrutura PWA já existente no projeto (vite-plugin-pwa, Workbox, hooks e componentes) e a estende especificamente para a área administrativa, garantindo instalação, funcionamento offline inteligente, cache otimizado e experiência nativa.

O design foca em três pilares principais:
1. **Instalabilidade**: Permitir que administradores instalem a área admin como app standalone
2. **Offline-First**: Cache inteligente de dados administrativos para trabalho offline
3. **Experiência Nativa**: Comportamento similar a apps nativos com notificações e atualizações

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser / OS                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Installed PWA (Standalone)                 │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │           Admin React Application                 │  │ │
│  │  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  │  │ │
│  │  │  │  Dashboard │  │  Vehicles  │  │   Login    │  │  │ │
│  │  │  └────────────┘  └────────────┘  └────────────┘  │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  │                          ↕                              │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │         Service Worker (Workbox)                  │  │ │
│  │  │  ┌─────────────┐  ┌──────────────┐               │  │ │
│  │  │  │ Cache API   │  │ IndexedDB    │               │  │ │
│  │  │  │ - Assets    │  │ - Auth State │               │  │ │
│  │  │  │ - API Data  │  │ - Vehicles   │               │  │ │
│  │  │  │ - Images    │  │ - Pending    │               │  │ │
│  │  │  └─────────────┘  └──────────────┘               │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                          ↕
              ┌───────────────────────┐
              │   Supabase Backend    │
              │  - Auth               │
              │  - PostgreSQL         │
              │  - Storage            │
              └───────────────────────┘
```

### Component Architecture


```
Admin PWA Components:
├── Core PWA Infrastructure (Existing)
│   ├── vite-plugin-pwa (Manifest + SW generation)
│   ├── Workbox (Cache strategies)
│   ├── usePWA hook (Install + Online status)
│   ├── InstallPWA component
│   ├── PWAUpdatePrompt component
│   └── OfflineIndicator component
│
├── Admin-Specific Enhancements (New)
│   ├── AdminPWAProvider (Context for admin PWA state)
│   ├── AdminOfflineSync (Background sync for admin operations)
│   ├── AdminCacheManager (Intelligent cache for admin data)
│   └── AdminInstallPrompt (Admin-specific install UI)
│
└── Integration Points
    ├── AdminLayout (Integrate PWA components)
    ├── Supabase Client (Offline-aware requests)
    └── App Store (Sync state management)
```

## Components and Interfaces

### 1. PWA Manifest Enhancement

**Purpose**: Extend existing manifest to support admin-specific configuration

**Interface**:
```typescript
// Extension to public/manifest.webmanifest
interface AdminManifestExtension {
  scope: '/admin' // Admin-specific scope
  shortcuts: AdminShortcut[] // Admin shortcuts
  categories: ['business', 'productivity']
}

interface AdminShortcut {
  name: string
  url: string
  description: string
  icons: Icon[]
}
```

**Behavior**:
- Manifest já existe, será estendido com shortcuts admin
- Shortcuts: Dashboard (/admin), Veículos (/admin/vehicles), Novo Veículo (/admin/vehicles/new)
- Mantém tema e cores existentes (#1E3A8A)

### 2. Service Worker Cache Strategy

**Purpose**: Implementar estratégias de cache específicas para área admin

**Interface**:
```typescript
interface CacheStrategy {
  urlPattern: RegExp
  handler: 'CacheFirst' | 'NetworkFirst' | 'StaleWhileRevalidate'
  options: CacheOptions
}

interface CacheOptions {
  cacheName: string
  expiration?: {
    maxEntries: number
    maxAgeSeconds: number
  }
  cacheableResponse?: {
    statuses: number[]
  }
}
```

**Cache Strategies**:
1. **Admin Assets** (CacheFirst):
   - Pattern: `/admin/**/*.{js,css,html}`
   - Cache: `admin-assets-cache`
   - Expiration: 30 days, 50 entries

2. **Admin API** (NetworkFirst):
   - Pattern: `supabase.co/rest/v1/vehicles*`
   - Cache: `admin-api-cache`
   - Expiration: 24 hours, 100 entries
   - Fallback to cache when offline

3. **Vehicle Images** (CacheFirst):
   - Pattern: `supabase.co/storage/v1/object/public/vehicle-images/*`
   - Cache: `admin-images-cache`
   - Expiration: 7 days, 200 entries

4. **Auth Requests** (NetworkOnly):
   - Pattern: `supabase.co/auth/*`
   - No cache (security)



### 3. AdminPWAProvider Component

**Purpose**: Gerenciar estado PWA específico da área administrativa

**Interface**:
```typescript
interface AdminPWAContextValue {
  isAdminInstalled: boolean
  canInstallAdmin: boolean
  installAdmin: () => Promise<boolean>
  isOnline: boolean
  hasPendingSync: boolean
  syncPendingOperations: () => Promise<void>
  cacheStatus: CacheStatus
}

interface CacheStatus {
  assetsReady: boolean
  dataReady: boolean
  lastSync: Date | null
  cacheSize: number
}

// Component
function AdminPWAProvider({ children }: { children: ReactNode }): JSX.Element
function useAdminPWA(): AdminPWAContextValue
```

**Behavior**:
- Extends usePWA hook with admin-specific logic
- Tracks admin route installation status
- Manages pending operations queue
- Monitors cache health
- Provides sync status

### 4. AdminOfflineSync Component

**Purpose**: Sincronizar operações administrativas realizadas offline

**Interface**:
```typescript
interface PendingOperation {
  id: string
  type: 'create' | 'update' | 'delete'
  entity: 'vehicle' | 'vehicle_image'
  data: any
  timestamp: Date
  retries: number
}

interface SyncResult {
  success: boolean
  syncedCount: number
  failedCount: number
  errors: SyncError[]
}

interface SyncError {
  operationId: string
  error: string
}

// Component
function AdminOfflineSync(): JSX.Element
```

**Behavior**:
- Monitors online/offline transitions
- Queues admin operations when offline (IndexedDB)
- Auto-syncs when connection restored
- Shows sync status UI
- Handles conflicts (last-write-wins)
- Retries failed operations (max 3 attempts)

### 5. AdminCacheManager

**Purpose**: Gerenciar cache inteligente de dados administrativos

**Interface**:
```typescript
interface CacheManager {
  preloadAdminData(): Promise<void>
  clearAdminCache(): Promise<void>
  getCacheSize(): Promise<number>
  getCachedVehicles(): Promise<VehicleWithImages[]>
  updateCachedVehicle(id: string, data: Partial<Vehicle>): Promise<void>
}

class AdminCacheManager implements CacheManager {
  private readonly CACHE_NAME = 'admin-data-v1'
  private readonly MAX_CACHE_SIZE = 50 * 1024 * 1024 // 50MB
  
  async preloadAdminData(): Promise<void>
  async clearAdminCache(): Promise<void>
  async getCacheSize(): Promise<number>
  async getCachedVehicles(): Promise<VehicleWithImages[]>
  async updateCachedVehicle(id: string, data: Partial<Vehicle>): Promise<void>
}
```

**Behavior**:
- Preloads critical admin data on first visit
- Implements LRU eviction when cache full
- Provides cache inspection utilities
- Optimistic updates for better UX
- Validates cache integrity



### 6. AdminInstallPrompt Component

**Purpose**: UI específica para promover instalação da área admin

**Interface**:
```typescript
interface AdminInstallPromptProps {
  position?: 'top' | 'bottom'
  autoShow?: boolean
  dismissible?: boolean
}

function AdminInstallPrompt(props: AdminInstallPromptProps): JSX.Element | null
```

**Behavior**:
- Shows only in admin routes (/admin/*)
- Detects if already installed
- Respects user dismissal (localStorage)
- Shows benefits specific to admin (offline access, quick launch)
- Integrates with existing InstallPWA component

### 7. Enhanced OfflineIndicator

**Purpose**: Indicador offline com informações específicas para admin

**Interface**:
```typescript
interface OfflineIndicatorProps {
  showSyncStatus?: boolean
  showCacheInfo?: boolean
}

function OfflineIndicator(props: OfflineIndicatorProps): JSX.Element | null
```

**Behavior**:
- Shows offline status (existing)
- Shows pending sync count when offline
- Shows last successful sync time
- Provides manual sync button
- Different styling for admin area

## Data Models

### 1. Cached Vehicle Data

```typescript
interface CachedVehicle extends VehicleWithImages {
  _cached: {
    timestamp: Date
    version: number
    dirty: boolean // Has local changes not synced
  }
}
```

### 2. Pending Operation Queue

```typescript
interface OperationQueue {
  operations: PendingOperation[]
  lastSync: Date | null
  syncInProgress: boolean
}

// Stored in IndexedDB
const DB_NAME = 'admin-pwa-db'
const STORE_NAME = 'pending-operations'
```

### 3. Cache Metadata

```typescript
interface CacheMetadata {
  version: string
  lastUpdate: Date
  entries: CacheEntry[]
  totalSize: number
}

interface CacheEntry {
  url: string
  size: number
  timestamp: Date
  hits: number
}
```

### 4. PWA Installation State

```typescript
interface PWAInstallState {
  isInstalled: boolean
  installDate: Date | null
  lastPromptDismissed: Date | null
  installSource: 'banner' | 'menu' | 'shortcut' | null
}

// Stored in localStorage
const STORAGE_KEY = 'admin-pwa-install-state'
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*



### Property 1: Install prompt visibility
*For any* compatible browser with beforeinstallprompt support, when an administrator accesses the admin area and the app is not installed, the install prompt component should be rendered and visible.
**Validates: Requirements 1.1**

### Property 2: Standalone mode detection
*For any* PWA launch, when the app is opened in standalone mode (display-mode: standalone), the system should correctly detect and report this state.
**Validates: Requirements 1.3, 6.1**

### Property 3: Asset caching after visit
*For any* admin page visit, after the page loads successfully, the application shell assets (HTML, CSS, JS) should be present in the service worker cache.
**Validates: Requirements 2.1**

### Property 4: Offline app shell loading
*For any* previously visited admin page, when accessed offline, the cached application shell should load successfully without network requests.
**Validates: Requirements 2.2**

### Property 5: Cached data accessibility offline
*For any* vehicle data that was previously loaded and cached, when accessed offline, the data should be retrievable and displayable from cache.
**Validates: Requirements 2.3**

### Property 6: Offline indicator display
*For any* network state change to offline, the offline indicator component should appear and remain visible until connection is restored.
**Validates: Requirements 2.4, 5.1**

### Property 7: Automatic sync on reconnection
*For any* pending operations queued while offline, when internet connection is restored, the system should automatically attempt to sync all pending operations.
**Validates: Requirements 2.5**

### Property 8: Cache-first asset serving
*For any* static asset request (CSS, JS, images), when the asset exists in cache, it should be served from cache without making a network request.
**Validates: Requirements 3.1**

### Property 9: Background update without disruption
*For any* service worker update, when a new version is available, it should install in the background without forcing an immediate reload of the current session.
**Validates: Requirements 3.3**

### Property 10: Update notification display
*For any* new service worker version detected, the update notification component should be rendered to inform the administrator.
**Validates: Requirements 3.4, 8.1**

### Property 11: Update reload on acceptance
*For any* update notification acceptance, when the administrator clicks to update, the new service worker should activate and the application should reload.
**Validates: Requirements 3.5, 8.2**

### Property 12: Online notification on reconnection
*For any* network state change from offline to online, a temporary online notification should be displayed to the administrator.
**Validates: Requirements 5.2**

### Property 13: Network operation blocking offline
*For any* network-dependent operation attempted while offline, the operation should be prevented and an informative error message should be displayed.
**Validates: Requirements 5.3**

### Property 14: Initial cache population
*For any* first-time service worker activation, essential resources (app shell, critical assets) should be added to the cache.
**Validates: Requirements 5.5**

### Property 15: Session state persistence
*For any* application state, when the PWA is moved to background and then brought back to foreground, the session state should remain unchanged.
**Validates: Requirements 6.3**

### Property 16: LRU cache eviction
*For any* cache that exceeds its configured size limit, the least recently used entries should be evicted first to maintain the size constraint.
**Validates: Requirements 7.4**

### Property 17: Skip waiting on user confirmation
*For any* new service worker version, when the user confirms the update, the new service worker should skip waiting and activate immediately.
**Validates: Requirements 7.5**

### Property 18: Deferred update on dismissal
*For any* update notification dismissal, when the administrator dismisses the notification, the update should be applied automatically on the next application launch.
**Validates: Requirements 8.3**

### Property 19: Update success confirmation
*For any* completed service worker update, after the application reloads with the new version, a success message should be displayed.
**Validates: Requirements 8.5**



## Error Handling

### 1. Installation Errors

**Scenarios**:
- User denies installation prompt
- Browser doesn't support PWA installation
- Installation fails due to manifest errors

**Handling**:
```typescript
async function handleInstall(): Promise<InstallResult> {
  try {
    if (!installPrompt) {
      return { success: false, error: 'INSTALL_NOT_AVAILABLE' }
    }
    
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    
    if (outcome === 'dismissed') {
      return { success: false, error: 'USER_DISMISSED' }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Installation error:', error)
    return { success: false, error: 'INSTALL_FAILED' }
  }
}
```

**User Feedback**:
- Silent failure for dismissal (user choice)
- Toast notification for technical errors
- Fallback: hide install prompt, allow retry later

### 2. Service Worker Errors

**Scenarios**:
- Service worker registration fails
- Service worker update fails
- Cache API unavailable

**Handling**:
```typescript
function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker not supported')
    return
  }
  
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('SW registered:', registration)
    })
    .catch(error => {
      console.error('SW registration failed:', error)
      // App continues to work without SW
    })
}
```

**User Feedback**:
- App continues to function without offline support
- Warning banner: "Offline mode unavailable"
- Retry button for SW registration

### 3. Cache Errors

**Scenarios**:
- Cache quota exceeded
- Cache API throws errors
- Corrupted cache data

**Handling**:
```typescript
async function safeCacheOperation<T>(
  operation: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      await clearOldCache()
      return await operation() // Retry once
    }
    console.error('Cache error:', error)
    return fallback
  }
}
```

**User Feedback**:
- Transparent to user when possible
- Notification if cache needs to be cleared
- Option to manually clear cache in settings

### 4. Sync Errors

**Scenarios**:
- Sync fails due to network timeout
- Sync fails due to server error (4xx, 5xx)
- Conflict during sync (data changed on server)

**Handling**:
```typescript
async function syncOperation(op: PendingOperation): Promise<SyncResult> {
  const MAX_RETRIES = 3
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const result = await executeOperation(op)
      return { success: true, data: result }
    } catch (error) {
      if (error.status === 409) {
        // Conflict: server data changed
        return { success: false, error: 'CONFLICT', requiresResolution: true }
      }
      
      if (error.status >= 500 && attempt < MAX_RETRIES - 1) {
        // Server error: retry with exponential backoff
        await delay(Math.pow(2, attempt) * 1000)
        continue
      }
      
      return { success: false, error: error.message }
    }
  }
  
  return { success: false, error: 'MAX_RETRIES_EXCEEDED' }
}
```

**User Feedback**:
- Progress indicator during sync
- List of failed operations with retry button
- Conflict resolution UI for data conflicts
- Option to discard failed operations

### 5. Offline Operation Errors

**Scenarios**:
- User attempts create/update/delete while offline
- Required data not in cache
- Form validation fails

**Handling**:
```typescript
async function handleOfflineOperation(
  operation: Operation
): Promise<OperationResult> {
  if (!navigator.onLine) {
    // Queue for later sync
    await queueOperation(operation)
    return {
      success: true,
      queued: true,
      message: 'Operação salva. Será sincronizada quando online.'
    }
  }
  
  // Execute immediately if online
  return await executeOperation(operation)
}
```

**User Feedback**:
- Clear indication that operation is queued
- Badge showing pending operations count
- Manual sync button
- Notification when sync completes



## Testing Strategy

### Unit Testing

**Framework**: Vitest + Testing Library

**Unit Test Coverage**:

1. **PWA Hook Tests** (`usePWA.test.ts`):
   - Test install prompt capture
   - Test online/offline detection
   - Test install function success/failure
   - Test installed state detection

2. **Component Tests**:
   - `InstallPWA.test.tsx`: Render conditions, install flow, dismissal
   - `PWAUpdatePrompt.test.tsx`: Update notification, acceptance, dismissal
   - `OfflineIndicator.test.tsx`: Visibility based on online state
   - `AdminPWAProvider.test.tsx`: Context value provision, state updates

3. **Cache Manager Tests** (`AdminCacheManager.test.ts`):
   - Cache operations (add, get, delete)
   - Cache size calculation
   - LRU eviction logic
   - Cache clearing

4. **Sync Manager Tests** (`AdminOfflineSync.test.ts`):
   - Operation queuing
   - Sync execution
   - Retry logic
   - Conflict handling

**Example Unit Test**:
```typescript
describe('usePWA', () => {
  it('should detect installed state in standalone mode', () => {
    // Mock matchMedia for standalone mode
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(display-mode: standalone)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
    
    const { result } = renderHook(() => usePWA())
    
    expect(result.current.isInstalled).toBe(true)
  })
})
```

### Property-Based Testing

**Framework**: fast-check (JavaScript property-based testing library)

**Configuration**: Each property test should run minimum 100 iterations

**Property Test Coverage**:

1. **Property 3: Asset caching after visit**
   - **Feature: admin-pwa, Property 3: Asset caching after visit**
   - Generate: Random admin URLs
   - Test: After visiting URL, verify assets in cache
   - Invariant: All visited pages have cached assets

2. **Property 5: Cached data accessibility offline**
   - **Feature: admin-pwa, Property 5: Cached data accessibility offline**
   - Generate: Random vehicle data
   - Test: Cache data, go offline, retrieve data
   - Invariant: Cached data === Retrieved data

3. **Property 7: Automatic sync on reconnection**
   - **Feature: admin-pwa, Property 7: Automatic sync on reconnection**
   - Generate: Random pending operations
   - Test: Queue operations, restore connection, verify sync
   - Invariant: All queued operations are attempted

4. **Property 16: LRU cache eviction**
   - **Feature: admin-pwa, Property 16: LRU cache eviction**
   - Generate: Random cache entries exceeding limit
   - Test: Add entries, verify oldest evicted
   - Invariant: Cache size <= limit AND oldest entries removed first

**Example Property Test**:
```typescript
import fc from 'fast-check'

describe('Property Tests', () => {
  /**
   * Feature: admin-pwa, Property 5: Cached data accessibility offline
   */
  it('cached vehicle data should be accessible offline', () => {
    fc.assert(
      fc.asyncProperty(
        fc.array(vehicleArbitrary(), { minLength: 1, maxLength: 10 }),
        async (vehicles) => {
          // Cache vehicles
          await cacheManager.cacheVehicles(vehicles)
          
          // Simulate offline
          mockOffline()
          
          // Retrieve from cache
          const cached = await cacheManager.getCachedVehicles()
          
          // Verify all vehicles are retrievable
          expect(cached).toHaveLength(vehicles.length)
          vehicles.forEach(vehicle => {
            expect(cached).toContainEqual(vehicle)
          })
        }
      ),
      { numRuns: 100 }
    )
  })
})
```

### Integration Testing

**Scope**: End-to-end PWA workflows

**Integration Test Scenarios**:

1. **Full Installation Flow**:
   - Visit admin area
   - Trigger install prompt
   - Install PWA
   - Verify standalone launch

2. **Offline-Online Cycle**:
   - Load admin with data
   - Go offline
   - Verify cached data accessible
   - Make changes offline
   - Go online
   - Verify sync completes

3. **Update Flow**:
   - Install PWA
   - Deploy new version
   - Verify update notification
   - Accept update
   - Verify new version loaded

**Tools**:
- Playwright for E2E testing
- Service Worker mock for offline simulation
- Cache API mock for cache testing

### Manual Testing Checklist

**Installation Testing**:
- [ ] Install on Chrome Desktop
- [ ] Install on Chrome Android
- [ ] Install on Safari iOS
- [ ] Install on Edge Desktop
- [ ] Verify app icon appears
- [ ] Verify standalone mode works

**Offline Testing**:
- [ ] Load admin area online
- [ ] Disconnect network
- [ ] Verify app loads from cache
- [ ] Verify cached data accessible
- [ ] Attempt create/update/delete
- [ ] Verify operations queued
- [ ] Reconnect network
- [ ] Verify sync completes

**Update Testing**:
- [ ] Install PWA
- [ ] Deploy new version
- [ ] Verify update notification appears
- [ ] Accept update
- [ ] Verify app reloads
- [ ] Verify new version active

**Cache Testing**:
- [ ] Clear browser cache
- [ ] Visit admin area
- [ ] Verify assets cached
- [ ] Check cache size
- [ ] Fill cache to limit
- [ ] Verify LRU eviction

## Implementation Notes

### 1. Vite PWA Configuration

The existing `vite.config.ts` already has PWA plugin configured. Extend it with admin-specific settings:

```typescript
VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    // Add admin shortcuts
    shortcuts: [
      {
        name: 'Dashboard Admin',
        url: '/admin',
        description: 'Acessar dashboard administrativo'
      },
      {
        name: 'Gerenciar Veículos',
        url: '/admin/vehicles',
        description: 'Gerenciar catálogo de veículos'
      }
    ]
  },
  workbox: {
    // Add admin-specific cache strategies
    runtimeCaching: [
      // Existing strategies...
      {
        urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\/vehicles/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'admin-api-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 // 24h
          }
        }
      }
    ]
  }
})
```

### 2. IndexedDB Schema

Use IndexedDB for persistent storage of pending operations:

```typescript
const DB_CONFIG = {
  name: 'admin-pwa-db',
  version: 1,
  stores: {
    pendingOperations: {
      keyPath: 'id',
      indexes: [
        { name: 'timestamp', keyPath: 'timestamp' },
        { name: 'type', keyPath: 'type' }
      ]
    }
  }
}
```

### 3. Service Worker Communication

Use postMessage for SW-App communication:

```typescript
// In app
navigator.serviceWorker.controller?.postMessage({
  type: 'CACHE_ADMIN_DATA',
  payload: vehicles
})

// In service worker
self.addEventListener('message', (event) => {
  if (event.data.type === 'CACHE_ADMIN_DATA') {
    cacheAdminData(event.data.payload)
  }
})
```

### 4. Performance Considerations

- Lazy load PWA components (only in admin routes)
- Debounce cache operations
- Use Web Workers for heavy sync operations
- Implement progressive cache warming
- Monitor cache size and evict proactively

### 5. Browser Compatibility

**Minimum Requirements**:
- Chrome 90+
- Edge 90+
- Safari 15+ (limited PWA support)
- Firefox 90+ (limited PWA support)

**Fallbacks**:
- Graceful degradation for unsupported browsers
- Feature detection before using PWA APIs
- Clear messaging about browser requirements

### 6. Security Considerations

- HTTPS required for Service Worker
- No caching of sensitive auth tokens
- Validate cached data integrity
- Implement cache versioning
- Clear cache on logout
- Encrypt sensitive data in IndexedDB

