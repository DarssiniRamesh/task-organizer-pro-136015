import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client initialization.
 * Reads configuration from environment variables.
 * 
 * Required ENV:
 * - REACT_APP_SUPABASE_URL
 * - REACT_APP_SUPABASE_KEY
 */

// PUBLIC_INTERFACE
export const getSupabaseClient = () => {
  /** Returns a singleton Supabase client instance. */
  if (!window.__supabase_client__) {
    const url = process.env.REACT_APP_SUPABASE_URL;
    const anonKey = process.env.REACT_APP_SUPABASE_KEY;

    if (!url || !anonKey) {
      // Provide a clear error to developers when envs are missing
      // Note: Do not log secrets or sensitive info.
      // PUBLIC_INTERFACE
      throw new Error(
        'Supabase configuration missing. Ensure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY are set in the environment.'
      );
    }

    window.__supabase_client__ = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }
  return window.__supabase_client__;
};

export default getSupabaseClient;
