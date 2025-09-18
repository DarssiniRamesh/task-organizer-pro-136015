import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

/**
 * AuthGuard protects routes under /app/* and redirects unauthenticated users to /auth/signin.
 */

// PUBLIC_INTERFACE
export default function AuthGuard() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '8vh' }}>
        <div className="surface" style={{ padding: '20px' }}>
          <p className="text-muted">Checking session…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    const redirectTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/auth/signin?redirectTo=${redirectTo}`} replace />;
  }

  return <Outlet />;
}
