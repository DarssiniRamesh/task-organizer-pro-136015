# Supabase Integration

This frontend uses Supabase for authentication (email/password) and future database access.

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

## Files

- src/lib/supabaseClient.js: Initializes Supabase client singleton.
- src/hooks/useAuth.js: AuthProvider and useAuth hook for session and auth actions.
- src/components/auth/SignIn.jsx: Sign in form.
- src/components/auth/SignUp.jsx: Sign up form.
- src/components/auth/AuthGuard.jsx: Protects routes.
- src/pages/AuthPage.jsx: Wrapper for auth routes.

## Security Notes

- Use only the public anon key (REACT_APP_SUPABASE_KEY).
- Do not log or expose sensitive information in UI or console.
- Ensure Supabase RLS policies are configured to restrict data access to the authenticated user.

