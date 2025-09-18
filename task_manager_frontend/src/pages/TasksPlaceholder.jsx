import useAuth from '../hooks/useAuth';

// PUBLIC_INTERFACE
export default function TasksPlaceholder() {
  /**
   * Temporary protected page content to verify guard and signout.
   * Replace with full task list implementation in subsequent tasks.
   */
  const { user, signOut } = useAuth();

  return (
    <div className="app-main">
      <div className="placeholder-card">
        <h2>Tasks</h2>
        <p className="text-muted">Welcome {user?.email}. This is a protected route.</p>
        <div style={{ marginTop: 12 }}>
          <button className="btn" onClick={signOut}>Sign out</button>
        </div>
      </div>
    </div>
  );
}
