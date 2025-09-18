import { Outlet } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function AuthPage() {
  /** Wrapper for auth routes to allow shared layout or background if needed. */
  return (
    <div className="app-main" style={{ paddingTop: '6vh', paddingBottom: '10vh' }}>
      <Outlet />
    </div>
  );
}
