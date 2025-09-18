import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './AuthCard.css';

// PUBLIC_INTERFACE
export default function SignUp() {
  /** Minimalist sign-up screen following Soft Mono styling. */
  const { signUp, error } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/app/tasks';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    if (password !== confirm) {
      setLocalError('Passwords do not match');
      return;
    }
    setSubmitting(true);
    const { error: signUpError } = await signUp({ email, password });
    setSubmitting(false);
    if (signUpError) {
      setLocalError(signUpError.message || 'Unable to sign up');
      return;
    }
    // Depending on Supabase email confirmation settings, user may need to verify email.
    navigate(redirectTo);
  };

  return (
    <div className="container" style={{ paddingTop: '8vh' }}>
      <div className="auth-card">
        <h2 className="auth-title"><span aria-hidden="true">✍️</span> Create account</h2>
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
              placeholder="Create a password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              aria-invalid={!!localError}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="confirm">Confirm password</label>
            <input
              id="confirm"
              type="password"
              className="auth-input"
              placeholder="Repeat your password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
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
              {submitting ? 'Creating…' : 'Create account'}
            </button>
            <Link className="link" to={`/auth/signin?redirectTo=${encodeURIComponent(redirectTo)}`}>
              Already have an account?
            </Link>
          </div>
        </form>

        <div className="auth-footer">
          <span className="text-muted">You may need to verify your email depending on project settings.</span>
        </div>
      </div>
    </div>
  );
}
