import React, { useState, useEffect } from 'react';
import './App.css';
import useAuth from './hooks/useAuth';

/**
 * Root application layout:
 * - Header: App title, theme toggle, and user actions (sign out)
 * - Sidebar: Placeholder for filters/navigation
 * - Main content is rendered by routes outside this component
 * Controls document-level data-theme for light/dark modes.
 */
// PUBLIC_INTERFACE
function AppLayout({ children }) {
  const { user, signOut } = useAuth();
  const [theme, setTheme] = useState(() => {
    // Respect prefers-color-scheme; allow manual override later
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="App app-shell">
      <header className="app-header">
        <div className="app-title">
          <span aria-hidden="true">🗂️</span>
          <span>Task Manager</span>
        </div>
        <div className="app-actions">
          {user ? (
            <>
              <span className="text-muted" style={{ marginRight: 8 }}>{user.email}</span>
              <button className="btn" onClick={signOut} title="Sign out">Sign out</button>
            </>
          ) : null}
          <button
            className="btn btn-primary"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title="Toggle theme"
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </header>

      <aside className="app-sidebar">
        <div className="sidebar-section">
          <div className="sidebar-title">Filters</div>
          <div className="surface" style={{ padding: '12px' }}>
            <p className="text-muted" style={{ margin: 0 }}>
              Sidebar placeholder for filters (status, priority, date).
            </p>
          </div>
        </div>
      </aside>

      {children}
    </div>
  );
}

// PUBLIC_INTERFACE
export default AppLayout;
