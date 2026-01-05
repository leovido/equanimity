---
name: Refactor to hooks components and Effect backend
overview: Refactor the Build a Life app to use custom hooks, reusable components, shared types/utilities, and a separate Effect TS backend service with Docker support. Focus on eliminating duplicated logic and improving error handling.
todos:
  - id: requirements-doc
    content: "Create REQUIREMENTS.md with coding standards: no duplicated logic, reusable components, shared types/utilities, exceptional error handling"
    status: pending
  - id: shared-types
    content: "Create shared types in lib/types/: entries.ts, storage.ts, api.ts, common.ts"
    status: pending
  - id: storage-interface
    content: Refactor storage to use interface pattern (StorageInterface, LocalStorageAdapter) in lib/storage/
    status: pending
    dependencies:
      - shared-types
  - id: storage-hooks
    content: "Create storage hooks: useLocalStorage.ts, useTodayEntry.ts, usePastEntries.ts, useStorageItem.ts"
    status: pending
    dependencies:
      - storage-interface
  - id: form-hooks
    content: "Create form hooks: useFormState.ts, useSaveState.ts"
    status: pending
    dependencies:
      - shared-types
  - id: feature-hooks
    content: "Create feature hooks: useEmotionalState.ts, useAuditAnalysis.ts, usePracticeTracking.ts"
    status: pending
    dependencies:
      - storage-hooks
      - form-hooks
  - id: base-ui-components
    content: "Create base UI components: Button.tsx, Card.tsx, FormField.tsx, TextareaField.tsx, PageHeader.tsx, LoadingSpinner.tsx, ErrorMessage.tsx, SuccessMessage.tsx"
    status: pending
    dependencies:
      - shared-types
  - id: feature-components
    content: "Create feature components: EmotionalStateSelector.tsx, ModeToggle.tsx, CategoryTags.tsx, SentimentDisplay.tsx, EntryList.tsx, PracticeChecklist.tsx"
    status: pending
    dependencies:
      - base-ui-components
  - id: refactor-inner-peace
    content: Refactor app/inner-peace/page.tsx to use hooks and reusable components
    status: pending
    dependencies:
      - storage-hooks
      - form-hooks
      - feature-hooks
      - base-ui-components
      - feature-components
  - id: refactor-nightly-audit
    content: Refactor app/nightly-audit/page.tsx to use hooks and reusable components
    status: pending
    dependencies:
      - storage-hooks
      - form-hooks
      - feature-hooks
      - base-ui-components
      - feature-components
  - id: refactor-stoic-mastery
    content: Refactor app/stoic-mastery/page.tsx to use hooks and reusable components
    status: pending
    dependencies:
      - storage-hooks
      - form-hooks
      - feature-hooks
      - base-ui-components
      - feature-components
  - id: backend-setup
    content: "Set up Effect TS backend service structure: package.json, tsconfig.json, src/index.ts"
    status: pending
  - id: backend-api
    content: "Implement backend API: routes.ts, handlers.ts, services/analysis.ts with Effect error handling"
    status: pending
    dependencies:
      - backend-setup
      - shared-types
  - id: docker-frontend
    content: Create Dockerfile for Next.js frontend
    status: pending
  - id: docker-backend
    content: Create backend/Dockerfile for Effect TS service
    status: pending
    dependencies:
      - backend-api
  - id: docker-compose
    content: Create docker-compose.yml with frontend, backend services, networks, and volumes
    status: pending
    dependencies:
      - docker-frontend
      - docker-backend
  - id: update-api-route
    content: Update app/api/analyze-audit/route.ts to proxy to Effect TS backend or remove if direct calls
    status: pending
    dependencies:
      - backend-api
  - id: error-handling
    content: Add error boundaries, error utilities (lib/utils/errors.ts), and consistent error handling throughout
    status: pending
    dependencies:
      - base-ui-components
---

# Refactoring Plan: Hooks, Components, and Effect TS Backend

## Overview

This plan refactors the Build a Life app to follow best practices: custom hooks for shared logic, reusable UI components, shared types/utilities, and a separate Effect TS backend service with Docker support.

## Architecture

```javascript
build-a-life/
├── app/                          # Next.js frontend
│   ├── api/                      # API routes (may proxy to backend)
│   └── [pages]/                  # Refactored pages using hooks/components
├── components/                   # Reusable UI components
│   ├── ui/                       # Base components (Button, Card, FormField, etc.)
│   └── features/                 # Feature-specific components
├── hooks/                        # Custom React hooks
├── lib/                          # Shared utilities and types
│   ├── types/                    # Shared TypeScript types
│   ├── storage/                  # Storage interface and implementation
│   └── utils/                    # Utility functions
├── backend/                      # Effect TS service
│   ├── src/
│   │   ├── services/             # Business logic
│   │   ├── api/                  # HTTP handlers
│   │   └── models/               # Data models
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml            # Local development setup
├── Dockerfile                    # Frontend Dockerfile
└── REQUIREMENTS.md               # Project requirements document
```



## Implementation Steps

### Phase 1: Requirements and Foundation

**1.1 Create Requirements Document** (`REQUIREMENTS.md`)

- Document coding standards
- No duplicated logic
- Use reusable components
- Shared types and utilities
- Exceptional error handling
- Storage interface for easy migration

**1.2 Create Shared Types** (`lib/types/`)

- `entries.ts` - Entry types (PeaceEntry, AuditEntry, MasteryEntry)
- `storage.ts` - Storage interface types
- `api.ts` - API request/response types
- `common.ts` - Common types (modes, states, etc.)

**1.3 Refactor Storage with Interface** (`lib/storage/`)

- Create `StorageInterface` type for abstraction
- Implement `LocalStorageAdapter` implementing the interface
- Update existing storage functions to use adapter
- This allows easy migration to database later

### Phase 2: Custom Hooks

**2.1 Storage Hooks** (`hooks/`)

- `useLocalStorage.ts` - Generic localStorage hook with error handling
- `useTodayEntry.ts` - Hook for loading/saving today's entries
- `usePastEntries.ts` - Hook for loading past entries (last N days)
- `useStorageItem.ts` - Generic storage item hook

**2.2 Form Hooks** (`hooks/`)

- `useFormState.ts` - Generic form state management
- `useSaveState.ts` - Save state with loading/error/success states
- `useAutoSave.ts` - Optional auto-save functionality

**2.3 Feature-Specific Hooks** (`hooks/`)

- `useEmotionalState.ts` - Emotional state selection logic
- `useAuditAnalysis.ts` - Audit analysis API integration
- `usePracticeTracking.ts` - Practice completion tracking

### Phase 3: Reusable Components

**3.1 Base UI Components** (`components/ui/`)

- `Button.tsx` - Reusable button with variants
- `Card.tsx` - Card container component
- `FormField.tsx` - Label + input wrapper
- `TextareaField.tsx` - Textarea with consistent styling
- `PageHeader.tsx` - Page header with title, quote, description
- `LoadingSpinner.tsx` - Loading indicator
- `ErrorMessage.tsx` - Error display component
- `SuccessMessage.tsx` - Success feedback component

**3.2 Feature Components** (`components/features/`)

- `EmotionalStateSelector.tsx` - Emotional state button grid
- `ModeToggle.tsx` - Personal/Work toggle
- `CategoryTags.tsx` - Category tag display
- `SentimentDisplay.tsx` - Sentiment analysis visualization
- `EntryList.tsx` - Past entries list display
- `PracticeChecklist.tsx` - Practice completion checklist

### Phase 4: Refactor Pages

**4.1 Refactor Inner Peace Page** (`app/inner-peace/page.tsx`)

- Use `useTodayEntry`, `useEmotionalState` hooks
- Replace inline components with reusable ones
- Use `FormField`, `TextareaField`, `Button`, `Card`
- Extract `EmotionalStateSelector` component

**4.2 Refactor Nightly Audit Page** (`app/nightly-audit/page.tsx`)

- Use `useTodayEntry`, `usePastEntries`, `useAuditAnalysis` hooks
- Use `ModeToggle`, `CategoryTags`, `SentimentDisplay` components
- Replace duplicated form fields with `TextareaField`
- Use `EntryList` for past entries

**4.3 Refactor Stoic Mastery Page** (`app/stoic-mastery/page.tsx`)

- Use `useTodayEntry`, `usePastEntries`, `usePracticeTracking` hooks
- Use `PracticeChecklist` component
- Replace duplicated form fields with `TextareaField`

### Phase 5: Effect TS Backend Service

**5.1 Backend Setup** (`backend/`)

- Initialize Effect TS project structure
- Set up `package.json` with Effect dependencies
- Create `tsconfig.json` for backend
- Set up HTTP server with Effect

**5.2 API Implementation** (`backend/src/`)

- `api/routes.ts` - Route definitions
- `api/handlers.ts` - Request handlers
- `services/analysis.ts` - Analysis service (migrate from Next.js API route)
- `models/audit.ts` - Audit data models
- Error handling with Effect's error types

**5.3 Environment Configuration**

- `.env.example` for backend
- Configuration management with Effect Config

### Phase 6: Docker Setup

**6.1 Frontend Dockerfile** (`Dockerfile`)

- Multi-stage build for Next.js
- Production optimizations

**6.2 Backend Dockerfile** (`backend/Dockerfile`)

- Node.js base image
- Effect TS service setup

**6.3 Docker Compose** (`docker-compose.yml`)

- Frontend service (Next.js)
- Backend service (Effect TS)
- Network configuration
- Environment variable management
- Volume mounts for development

**6.4 Update Next.js API Route** (`app/api/analyze-audit/route.ts`)

- Proxy requests to Effect TS backend service
- Or remove if frontend calls backend directly

### Phase 7: Error Handling & Polish

**7.1 Error Boundaries**

- Create error boundary component
- Wrap pages with error boundaries

**7.2 Error Handling Utilities**

- `lib/utils/errors.ts` - Error handling utilities
- Consistent error message formatting
- Error logging

**7.3 Testing & Validation**

- Validate all hooks work correctly
- Test component reusability
- Verify Docker setup works
- Test error scenarios

## Key Files to Create/Modify

### New Files

- `REQUIREMENTS.md` - Project requirements
- `lib/types/entries.ts` - Entry type definitions
- `lib/types/storage.ts` - Storage interface types
- `lib/types/api.ts` - API types
- `lib/storage/interface.ts` - Storage interface
- `lib/storage/localStorage.ts` - LocalStorage implementation
- `hooks/useLocalStorage.ts`
- `hooks/useTodayEntry.ts`
- `hooks/usePastEntries.ts`
- `hooks/useFormState.ts`
- `hooks/useSaveState.ts`
- `hooks/useEmotionalState.ts`
- `hooks/useAuditAnalysis.ts`
- `hooks/usePracticeTracking.ts`
- `components/ui/Button.tsx`
- `components/ui/Card.tsx`
- `components/ui/FormField.tsx`
- `components/ui/TextareaField.tsx`
- `components/ui/PageHeader.tsx`
- `components/features/EmotionalStateSelector.tsx`
- `components/features/ModeToggle.tsx`
- `components/features/CategoryTags.tsx`
- `components/features/SentimentDisplay.tsx`
- `components/features/EntryList.tsx`
- `components/features/PracticeChecklist.tsx`
- `backend/src/index.ts` - Backend entry point
- `backend/src/api/routes.ts`
- `backend/src/api/handlers.ts`
- `backend/src/services/analysis.ts`
- `backend/package.json`
- `backend/tsconfig.json`
- `backend/Dockerfile`
- `Dockerfile` (frontend)
- `docker-compose.yml`

### Modified Files

- `app/inner-peace/page.tsx` - Refactor to use hooks/components
- `app/nightly-audit/page.tsx` - Refactor to use hooks/components
- `app/stoic-mastery/page.tsx` - Refactor to use hooks/components
- `app/api/analyze-audit/route.ts` - Update to proxy to backend or remove
- `lib/storage.ts` - Refactor to use interface pattern

## Technical Decisions

1. **Storage Interface**: Abstract storage behind interface for easy database migration
2. **Effect TS Backend**: Separate service on different port, communicates via HTTP
3. **Component Structure**: Base UI components in `ui/`, feature components in `features/`
4. **Error Handling**: Use Effect's error types in backend, React error boundaries in frontend
5. **Type Safety**: Shared types ensure consistency between frontend and backend
6. **Docker**: Full stack containerization with Docker Compose for local development

## Success Criteria

- No duplicated logic across pages
- All form fields use reusable components
- All storage operations use hooks
- Backend service runs independently
- Docker Compose starts entire stack