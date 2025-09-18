import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import getSupabaseClient from '../lib/supabaseClient';

/**
 * AuthContext provides Supabase session and auth actions to the app.
 * It listens to auth state changes to persist session and exposes loading/error states.
 */

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /**
   * Provides:
   * - session: Supabase session or null
   * - user: session.user convenience
   * - loading: initial and transitional loading states
   * - error: last error from auth actions
   * - signIn, signUp, signOut: auth methods
   * - refreshSession: reloads current session from client
   */
  const supabase = getSupabaseClient();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    // Fetch current session on mount
    supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) return;
      if (error) {
        // Do not leak sensitive info
        setAuthError(new Error('Failed to get session'));
      }
      setSession(data?.session ?? null);
      setLoading(false);
    });

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [supabase]);

  const signIn = useCallback(
    async ({ email, password }) => {
      setAuthError(null);
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setAuthError(new Error(error.message || 'Sign in failed'));
        return { error };
      }
      setSession(data?.session ?? null);
      return { data };
    },
    [supabase]
  );

  const signUp = useCallback(
    async ({ email, password }) => {
      setAuthError(null);
      const siteUrl = process.env.REACT_APP_SITE_URL; // optional; see supabase.md docs
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: siteUrl || window.location.origin,
        },
      });
      if (error) {
        setAuthError(new Error(error.message || 'Sign up failed'));
        return { error };
      }
      setSession(data?.session ?? null);
      return { data };
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    setAuthError(null);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setAuthError(new Error(error.message || 'Sign out failed'));
      return { error };
    }
    setSession(null);
    return {};
  }, [supabase]);

  const refreshSession = useCallback(async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      setAuthError(new Error('Failed to refresh session'));
    }
    setSession(data?.session ?? null);
  }, [supabase]);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      error: authError,
      signIn,
      signUp,
      signOut,
      refreshSession,
    }),
    [session, loading, authError, signIn, signUp, signOut, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth context */
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

export default useAuth;
