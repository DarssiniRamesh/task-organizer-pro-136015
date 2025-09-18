import { Outlet } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function AuthPage() {
  /** Wrapper for auth routes to allow shared layout or background if needed. */
  return (
    <div style={{ minHeight: '100vh', paddingBottom: '10vh' }}>
      <Outlet />
    </div>
  );
}
