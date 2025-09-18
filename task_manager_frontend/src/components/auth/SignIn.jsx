import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './AuthCard.css';

// PUBLIC_INTERFACE
export default function SignIn() {
  /** Minimalist sign-in screen following Soft Mono styling. */
  const { signIn, error } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/app/tasks';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setSubmitting(true);
    const { error: signInError } = await signIn({ email, password });
    setSubmitting(false);
    if (signInError) {
      setLocalError(signInError.message || 'Unable to sign in');
      return;
    }
    navigate(redirectTo);
  };

  return (
    <div className="container" style={{ paddingTop: '8vh' }}>
      <div className="auth-card">
        <h2 className="auth-title"><span aria-hidden="true">🔐</span> Sign in</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="auth-input"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-invalid={!!localError}
            />
          </div>
          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="auth-input"
              placeholder="Your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              aria-invalid={!!localError}
            />
          </div>

          {(localError || error) && (
            <div role="alert" className="auth-error">
              {localError || error?.message}
            </div>
          )}

          <div className="auth-actions">
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
            <Link className="link" to={`/auth/signup?redirectTo=${encodeURIComponent(redirectTo)}`}>
              Create account
            </Link>
          </div>
        </form>

        <div className="auth-footer">
          <span className="text-muted">Use your email and password to sign in.</span>
        </div>
      </div>
    </div>
  );
}
