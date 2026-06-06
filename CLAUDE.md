# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev     # Next.js dev server (localhost:3000)
npm run build   # Production build
npm run lint    # ESLint
```

Requires `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:5000`). No test runner is configured.

## Architecture

### Request Flow

All API calls go through `src/lib/api.js` — a single axios instance with `baseURL: '/api'` and `withCredentials: true`. Next.js rewrites `/api/*` → `${NEXT_PUBLIC_API_URL}/api/*` (see `next.config.mjs`), so the browser never hits the backend directly. Every resource has a named export (`authApi`, `productsApi`, `ordersApi`, etc.) — add new endpoints there, never create a second axios instance.

The interceptor silently refreshes the access token on any 401. `refreshFailed` flag prevents infinite retry loops — call `resetRefreshState()` after every successful login. `NO_REFRESH_URLS` lists endpoints that must never trigger a refresh attempt.

### Authentication & State

- Tokens live in httpOnly cookies only — never read them from JS.
- `useAuthStore` (Zustand, `src/store/index.js`) holds the current user. `AuthInit` component calls `init()` once at layout level.
- `useCartStore` is persisted to `localStorage` under key `levelup-cart` via Zustand `persist` middleware.
- `useSettingsStore` holds `deliveryPaused` / `deliveryNotice` fetched at startup by `SettingsInit`.

### i18n

- Config: `src/lib/i18n/index.js`. Translation files: `src/lib/i18n/en.js` and `src/lib/i18n/fr.js`.
- **Never add `LanguageDetector`** to the i18n init — it reads `localStorage` on the server and causes SSR/hydration mismatches.
- All pages that use translations must be `'use client'`. Use `useTranslation()` hook and `t('key')`.
- For arrays in translations (sections, FAQs, etc.) use `t('key', { returnObjects: true })`.
- Language is applied client-side only inside `I18nProvider` via `useEffect` after hydration.

### Page Conventions

- Every major route has a `loading.jsx` (skeleton) and `error.jsx` (error boundary).
- Server components are the default; add `'use client'` only when needed (hooks, event handlers, translations).
- Forms use **react-hook-form + zod** (`@hookform/resolvers`). Schema defined inline at the top of the page file.
- Notifications via `react-hot-toast`. The `<Toaster>` is in the root layout.

### Styling

- Tailwind CSS with CSS custom properties for theming (`var(--bg-secondary)`, `var(--text-primary)`, `var(--purple)`, etc.).
- Fonts via `next/font/google`: `--font-bebas` (display/headings), `--font-dm-sans` (body), `--font-jetbrains` (mono).
- Class shortcuts defined in `globals.css`: `card-glass`, `btn-primary`, `section-title`, `tag`, `text-gradient`, `grid-bg`.
- Theme switching via `next-themes` (`ThemeProvider attribute="class"`).
- Animations via `framer-motion`.

### Image Uploads

Admin-only. `uploadApi.image(file)` posts `multipart/form-data` to `/api/upload`, returns `{ url, publicId }`. Upload buttons open a hidden `<input type="file">` and call this directly — no drag-and-drop library.
