# Task Manager Frontend (Soft Mono, Minimalist)

This React app provides an authenticated task manager UI backed by Supabase. It includes responsive design, accessibility (ARIA/keyboard), loading/empty/error states, and a minimalist Soft Mono theme with dark mode.

## Quick Start

1) Configure environment variables in a `.env` file at the project root:
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY
- Optional: REACT_APP_SITE_URL (used for sign up emailRedirectTo; fallback is window.location.origin)

2) Install and run:
- npm install
- npm start
- Open http://localhost:3000

3) Test and build:
- npm test
- npm run build

Note: Do not commit your .env file.

## Key Features

- Supabase Authentication (email/password) with session persistence and route protection
- Task CRUD (title, description, priority, status, due date)
- Filters (status, priority, due), search with debounce, and sorting
- Responsive layout (Header, Sidebar, Main). Sidebar collapses on smaller screens
- Dark mode via data-theme with system prefers-color-scheme support

## Accessibility and UX

- Landmarks: header (role="banner"), sidebar (role="complementary"), main (role="main")
- Skip link: “Skip to main content” to jump focus for keyboard users
- ARIA attributes:
  - Buttons/links labeled with aria-label where helpful
  - Forms with labelled inputs, inline validation (role="alert", aria-live="assertive")
  - Modals use role="dialog", aria-modal, labelledby/ describedby
- Keyboard support:
  - Escape closes modals
  - Focus moves to first field when modal opens
  - Focus-visible styling with high-contrast ring
- Loading/empty/error:
  - Skeleton placeholders for list loading
  - Friendly EmptyState with primary action
  - Inline errors and alert regions announced to assistive tech
  - Buttons report aria-busy when actions are in progress

## Project Structure

- src/styles/theme.css: Design tokens, layout grid, focus ring, responsive rules, skip link
- src/components/layout: Header (theme toggle, auth menu), Sidebar (quick filters)
- src/components/auth: SignIn, SignUp, AuthGuard (route protection)
- src/components/tasks: FilterBar, TaskList, TaskItem, TaskFormModal, EmptyState
- src/hooks: useAuth (Supabase auth), useTasks (CRUD, filters/sort/search)
- src/lib: supabaseClient

## Routes

- /auth/signin, /auth/signup
- Protected: /app/tasks

Query params for filters:
- status (todo|in_progress|done)
- priority (low|medium|high)
- due (overdue|today|week)
- q (search title)
- sort (due_date|priority|updated_at)

## Supabase

- Uses REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY (anon key)
- Email redirect (SignUp): REACT_APP_SITE_URL if provided, else window.location.origin
- See assets/supabase.md for details

## Design

- Theme: Soft Mono, minimalist
- Color tokens provide adequate contrast for text and focus rings
- Generous whitespace, subtle borders and elevation

## Notes

- Keep secrets out of logs
- RLS should protect tasks per-user server-side; UI scopes by user_id as well

For any issues with environment variables, ensure they are set before starting the app. See assets/supabase.md for specifics.
