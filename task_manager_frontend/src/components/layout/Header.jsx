import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

/**
 * Header component for the Soft Mono layout.
 * Shows app title, user info and sign-out, and a theme toggle passed from parent if provided.
 */

// PUBLIC_INTERFACE
export default function Header({ onToggleTheme, theme }) {
  /** Renders the top application header with title, theme toggle, and user actions. */
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/auth/signin');
    }
  };

  return (
    <header className="app-header" role="banner">
      <div className="app-title">
        <Link to="/app/tasks" style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }} aria-label="Go to Tasks">
          <span aria-hidden="true">🗂️</span>
          <span>Task Manager</span>
        </Link>
      </div>
      <div className="app-actions" role="group" aria-label="Header actions">
        {user ? (
          <>
            <span className="text-muted" style={{ marginRight: 8 }} aria-live="polite" aria-atomic="true">{user.email}</span>
            <button className="btn" onClick={handleSignOut} title="Sign out" type="button" aria-label="Sign out">
              Sign out
            </button>
          </>
        ) : (
          <Link className="btn" to="/auth/signin" aria-label="Sign in">Sign in</Link>
        )}
        <button
          className="btn btn-primary"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title="Toggle theme"
          type="button"
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
    </header>
  );
}
