import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';

/**
 * Root application layout:
 * - Header: App title, theme toggle, and user actions (sign out)
 * - Sidebar: Filters/navigation (collapsible on small screens per CSS)
 * - Main content is rendered by routes outside this component
 * Controls document-level data-theme for light/dark modes.
 */
// PUBLIC_INTERFACE
function AppLayout({ children }) {
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
      <Header onToggleTheme={toggleTheme} theme={theme} />
      <Sidebar />
      {children}
    </div>
  );
}

// PUBLIC_INTERFACE
export default AppLayout;
