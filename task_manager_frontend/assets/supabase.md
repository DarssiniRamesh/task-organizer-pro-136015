# Supabase Integration

This frontend uses Supabase for authentication (email/password) and database access for the tasks feature.

## Environment Variables

Create a `.env` file in the project root with:

REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_KEY=your_supabase_anon_key
# Optional, used for signUp emailRedirectTo. Fallback: window.location.origin
REACT_APP_SITE_URL=https://localhost:3000

Do not commit your .env file.

## Auth Behavior

- Session persistence is enabled; the app restores session on reload.
- Auth state changes are monitored via `supabase.auth.onAuthStateChange`.
- Provided forms:
  - /auth/signin
  - /auth/signup
- Protected routes under `/app/*` are guarded by `AuthGuard`, which redirects to `/auth/signin?redirectTo=...` when unauthenticated.
- `emailRedirectTo` for sign-up uses `REACT_APP_SITE_URL` if present, otherwise `window.location.origin`.

## Tasks Data Access

- The `tasks` table is used with the following expected columns:
  - id (uuid), user_id (uuid), title (text), description (text), priority (text/enum), status (text/enum),
    due_date (timestamp or date, nullable), tags (array/json, nullable), created_at (timestamp), updated_at (timestamp).
- Row-Level Security (RLS) must ensure users can access only their own rows.
- CRUD is implemented in `src/hooks/useTasks.js` and enforces `user_id = currentUser.id` in queries in addition to RLS.

### Server-side Filters supported by useTasks
- status: all|todo|in_progress|done
- priority: all|low|medium|high
- due: all|overdue|today|week
- q: search string (applies ilike on title)
- sort: updated_at|due_date|priority

### Example usage
See `src/pages/TasksPage.jsx` for a minimal example integrating the hook with UI.

## Files

- src/lib/supabaseClient.js: Initializes Supabase client singleton.
- src/hooks/useAuth.js: AuthProvider and useAuth hook for session and auth actions.
- src/hooks/useTasks.js: Task CRUD and listing with filters.
- src/components/auth/SignIn.jsx: Sign in form.
- src/components/auth/SignUp.jsx: Sign up form.
- src/components/auth/AuthGuard.jsx: Protects routes.
- src/pages/AuthPage.jsx: Wrapper for auth routes.
- src/pages/TasksPage.jsx: Minimal page to exercise the tasks hook.

## Security Notes

- Use only the public anon key (REACT_APP_SUPABASE_KEY).
- Do not log or expose sensitive information in UI or console.
- Ensure Supabase RLS policies are configured to restrict data access to the authenticated user.

