# Task Manager Frontend (Soft Mono, Minimalist)

This is a React 18 single-page application that provides an authenticated task manager UI backed by Supabase. It implements responsive design, accessibility (ARIA and keyboard support), loading/empty/error states, and a minimalist “Soft Mono” theme with dark mode. The app protects routes, syncs filters to the URL, and uses Supabase for authentication and data persistence.

## Project Overview

The application enables users to sign up, sign in, and manage personal tasks. Each task supports title, description, status, priority, and an optional due date. Users can filter, sort, and search tasks. A clean, minimalist layout is provided with a header, sidebar, and main content area, and a theme toggle controls light/dark modes with CSS custom properties.

Core capabilities:
- Supabase Auth (email/password) with session persistence and route protection
- Task CRUD with inline status updates and a modal for create/edit
- Filters (status, priority, due), search with debounce, and sorting
- URL query parameter synchronization for filters and deep-link edit by task id
- Responsive Soft Mono UI with dark mode

## Architecture Summary

- UI and Routing:
  - React Router v6; routes defined in src/index.js
  - Layout scaffold in src/App.js (AppLayout) with Header and Sidebar
  - Protected routes via AuthGuard (src/components/auth/AuthGuard.jsx) that redirect unauthenticated users to /auth/signin

- State and Data:
  - Auth context provider (src/hooks/useAuth.js) exposes session, user, loading, signIn, signUp, signOut
  - Tasks hook (src/hooks/useTasks.js) encapsulates list, create, update, and delete logic with server-side filters
  - Supabase client singleton (src/lib/supabaseClient.js) reads environment variables and initializes the SDK

- Pages and Components:
  - AuthPage wraps auth routes; SignIn and SignUp pages provide forms with validation and ARIA feedback
  - TasksPage composes FilterBar, TaskList, TaskItem, and TaskFormModal, and keeps filters in sync with the URL
  - Header shows app title, user email, sign out, and theme toggle; Sidebar provides quick filter shortcuts

- Styling and Theme:
  - Soft Mono theme tokens and layout rules in src/styles/theme.css
  - Tasks-specific styles in src/components/tasks/tasks.css
  - Dark mode toggled by data-theme attribute on the document element (set by AppLayout)

## Environment Variables

Create a .env file in the frontend project root (task_manager_frontend):

- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY
- Optional: REACT_APP_SITE_URL (used for sign-up emailRedirectTo; fallback is window.location.origin)

Do not commit your .env file. These variables are consumed by src/lib/supabaseClient.js and src/hooks/useAuth.js.

## Run Instructions

- Development:
  - npm install
  - npm start
  - Open http://localhost:3000

- Tests:
  - npm test

- Production build:
  - npm run build

If environment variables are missing, the app will throw a clear error when initializing the Supabase client.

## Component and Code Organization

- src/index.js: Entrypoint, router configuration, and AuthProvider setup
- src/App.js: AppLayout (Header, Sidebar, Main) and theme toggle wiring
- src/components/layout/Header.jsx: Title, user email, sign out, theme toggle
- src/components/layout/Sidebar.jsx: Navigation and “Quick filters” that update URL params
- src/components/auth/AuthGuard.jsx: Route protection for /app/*
- src/components/auth/SignIn.jsx and SignUp.jsx: Auth forms with validation and ARIA messages
- src/components/tasks/FilterBar.jsx: Controlled filters with debounced search and responsive grid
- src/components/tasks/TaskList.jsx and TaskItem.jsx: Task list, inline status control, edit/delete actions
- src/components/tasks/TaskFormModal.jsx: Accessible modal with validation and keyboard support
- src/pages/AuthPage.jsx and src/pages/TasksPage.jsx: Page containers
- src/hooks/useAuth.js: Supabase auth context and actions
- src/hooks/useTasks.js: CRUD operations, server-side filters, and sorting
- src/lib/supabaseClient.js: Supabase client initialization
- src/styles/theme.css: Design tokens, layout scaffolding, focus ring, and responsive rules
- src/components/tasks/tasks.css: Task badges, form controls, modal, and skeletons

## Soft Mono Design Tokens

Defined in src/styles/theme.css:
- primary: #6B7280
- secondary: #9CA3AF
- success: #10B981
- error: #EF4444
- background: #F9FAFB
- surface: #FFFFFF
- text: #111827

Additional tokens and scales:
- Spacing: --space-{1..10}, radii: --radius-sm|md|lg
- Typography scale: --text-xs..--text-3xl, font families for sans and mono
- Layout: --header-height, --sidebar-width
- Focus: --focus-ring for high-visibility outlines
- Dark theme variants are applied under :root[data-theme="dark"]

## Accessibility and Responsiveness

Accessibility:
- Semantic regions: header role="banner", sidebar role="complementary", main role="main"
- Skip link to jump to main content for keyboard users
- Forms provide labelled inputs, inline validation, and aria-live="assertive" for error regions
- Modals use role="dialog", aria-modal, labelledby, and Escape to close
- Focus-visible outlines use the theme’s focus ring for contrast
- Interactive controls use aria-labels and aria-busy during mutations

Responsiveness:
- CSS grid layout collapses the sidebar below 960px and adjusts paddings below 640px
- FilterBar reflows from 5 columns to 2 columns, then to a single column on smaller viewports
- Task form modal and lists adapt fluidly to smaller screens

## Supabase Integration

- Uses REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY (anon/public) to initialize a client
- Authentication: signInWithPassword, signUp with optional emailRedirectTo, signOut
- Session is persisted and refreshed by the Supabase client; AuthProvider listens for state changes
- Database access is performed in useTasks with server-side filters and ownership checks (user_id)
- See assets/supabase.md for additional notes and table expectations

## Handoff Notes

- The app expects a Supabase project with a “tasks” table that includes at least:
  - id (uuid), user_id (uuid), title (text), description (text), priority (text/enum), status (text/enum), due_date (timestamp/date), created_at, updated_at
- Ensure Row-Level Security (RLS) policies restrict reads/writes to rows where user_id matches the authenticated user
- The frontend never uses a service role key; only the public anon key is required via REACT_APP_SUPABASE_KEY
- For email confirmation flows, configure REACT_APP_SITE_URL if using custom redirects
- When extending features (e.g., tags, additional filters), update useTasks and FilterBar to keep query param sync intact
- Keep design tokens centralized in theme.css; prefer CSS variables for theming over ad-hoc colors
- Follow existing ARIA patterns and responsive layout rules when adding new components

## Troubleshooting

- If you see “Supabase configuration missing…”, verify .env contains REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY
- If authentication redirects loop, check that AuthGuard is wrapped only around protected routes and that session is established
- For RLS errors, confirm your Supabase policies and that user_id is being set on insert/update

## License

Internal project. See repository-level license if provided.
