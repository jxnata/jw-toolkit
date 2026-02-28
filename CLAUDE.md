# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**LS Maps** is a React Native (Expo) app for managing territorial assignments for Jehovah's Witnesses congregations. It handles territory management, publisher assignments, and field service organization.

## Commands

```bash
pnpm start          # Start Expo dev server
pnpm run ios        # Run on iOS simulator
pnpm run android    # Run on Android emulator
pnpm run web        # Run web version
pnpm run lint       # Run ESLint
pnpm run lint-fix   # Fix linting issues
pnpm run format     # Format with Prettier
pnpm run ts:check   # TypeScript type checking
```

No test suite is configured in this project.

## Tech Stack

- **React Native + Expo** with **Expo Router** (file-based routing)
- **TypeScript** (strict mode, path alias `@/*` → `./src/*`)
- **NativeWind** (Tailwind CSS for React Native) — primary styling approach
- **InstantDB** — real-time backend database
- **TanStack Query** — data fetching and caching layer
- **MMKV** — local storage with query cache persistence
- **RevenueCat** — in-app subscriptions
- **React Hook Form** — form handling

## Architecture

### Data Flow

```
UI Pages/Components
  → Custom Hooks (src/hooks/)
  → TanStack Query (caching)
  → InstantDB Services (src/services/instantdb/)
  → InstantDB Backend (real-time sync)
```

### Key Directories

- `src/app/` — Expo Router pages. `(app)/` contains protected routes split into `admin/` and `publisher/` subdirectories by user role.
- `src/components/` — Reusable UI components
- `src/hooks/` — Custom hooks (each wraps a service + TanStack Query)
- `src/services/instantdb/` — Database service layer (one file per entity: maps, publishers, cities, etc.)
- `src/contexts/` — React Contexts: `session-provider` (auth), `theme-provider`, `location-provider`, `subscription-provider`
- `src/interfaces/` — TypeScript types; `schema.ts` defines the InstantDB schema
- `src/constants/env.ts` — All `EXPO_PUBLIC_*` environment variables
- `src/utils/` — Pure utility functions
- `instant.perms.ts` — InstantDB permission rules (admin/editor/publisher scopes)

### User Roles

- **Admin (level 1)**: Full access — manages cities, districts, maps, publishers
- **Editor (level 2)**: Limited admin access
- **Publisher (level 3)**: View and work assigned territories only

### Root Layout

`src/app/_layout.tsx` bootstraps the app: loads fonts, initializes RevenueCat, Google Sign-In, and wraps the tree with Session, Theme, Location, and Subscription providers plus TanStack QueryClient.

## Development Standards

### File & Code Conventions

- **Filenames**: always kebab-case (`map-details.tsx`, `use-assignment.ts`)
- **Styling**: always use NativeWind `className` prop — no inline styles
- **Dynamic colors**: use `useThemedColors()` hook when `className` is insufficient

### Design System

Custom Tailwind colors (see `tailwind.config.js`):

- `primary` — orange/brown (`#bb7424`)
- `success` — green (`#719453`)
- `danger` — red (`#bf616a`)
- `background`, `foreground`, `card`, `border` — CSS variables for light/dark theme

Font family: **Urbanist** (`font-regular`, `font-medium`, `font-semibold`, `font-bold`, `font-extrabold`, `font-black`). Icon font: **jw-icons**.

### Environment Variables

Copy `.env.example` to `.env` and fill in:

- `EXPO_PUBLIC_INSTANT_APP_ID` — InstantDB app ID
- `EXPO_PUBLIC_TOMTOM_API_KEY` — TomTom Maps API
- `EXPO_PUBLIC_ENCRYPT_STORAGE` — MMKV encryption key
- `EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY` / `EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY`
- `EXPO_PUBLIC_LIMIT_MAPS` / `EXPO_PUBLIC_LIMIT_PUBLISHERS` — freemium feature limits
- `GOOGLE_MAPS_API_KEY` — Android Google Maps
