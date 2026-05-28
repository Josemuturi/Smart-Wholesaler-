/**
 * Login.jsx — BIT3208 Week 3: Full Login with Validation & API
 * -------------------------------------------------------------
 * Builds on the static layout from Week 2 by adding:
 *   ✅ React state for email, password, error, loading, showPassword
 *   ✅ Client-side validation (empty field check)
 *   ✅ Password show/hide toggle
 *   ✅ API call via api.post('/auth/login', ...) from api.js
 *   ✅ JWT token storage + redirect to /dashboard on success
 *   ✅ Error banner display on failed login
 *   ✅ Loading spinner on the submit button
 *
 * Week 4 will add the Dashboard and Product Catalog pages.
 * Week 5 will wire the login to the real FastAPI + SQLite backend.
 */

import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { api, setToken } from '../utils/api';
import './Login.css';

const Login = () => {
  // ── Form field state ─────────────────────────────────────────────────────
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  // ── UI state ─────────────────────────────────────────────────────────────
  const [error, setError]               = useState('');
  const [isLoading, setIsLoading]       = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate  = useNavigate();
  const location  = useLocation();

  // After login, go back to the page the user was trying to reach (or dashboard)
  const intendedDestination = location.state?.from?.pathname || '/dashboard';

  // ── Form submission handler ───────────────────────────────────────────────
  /**
   * Week 3 Concept: Form validation + async API call
   * Equivalent PHP pattern:
   *   if (empty($_POST['email'])) { $error = "Email required"; }
   *   $result = mysqli_query($conn, "SELECT ...WHERE email = ?");
   */
  const handleSubmit = async (e) => {
    e.preventDefault();   // prevent browser default page reload
    setError('');          // clear previous errors

    // ── Client-side validation ──
    if (!email) {
      setError('Please enter your business email.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    // ── API call ──
    setIsLoading(true);
    try {
      /**
       * POST http://localhost:8004/auth/login
       * Body:     { email: string, password: string }
       * Response: { access_token: string, token_type: "bearer", user: {...} }
       *
       * Week 5 wires this to the real FastAPI backend.
       * For now (mock mode), AuthContext intercepts this call.
       */
      const data = await api.post('/auth/login', { email, password });

      // Store JWT in localStorage so future requests include it
      setToken(data.access_token);

      // Redirect to dashboard (or intended page)
      navigate(intendedDestination, { replace: true });

    } catch (err) {
      // Show the FastAPI error message (e.g. "Invalid email or password.")
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Password toggle ───────────────────────────────────────────────────────
  /**
   * Week 3 Concept: Controlled input + state toggle
   * Switches the input type between "password" and "text"
   */
  const togglePasswordVisibility = () => setShowPassword((v) => !v);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="login-page">
      {/* Decorative blobs */}
      <div className="login-blob login-blob--1" aria-hidden="true" />
      <div className="login-blob login-blob--2" aria-hidden="true" />

      <div className="login-card">
        {/* Brand */}
        <div className="login-brand">
          <div className="login-brand__logo" aria-hidden="true">SW</div>
          <h1 className="login-brand__name">Smart Wholesaler</h1>
          <p className="login-brand__tagline">B2B Wholesale Supply Portal</p>
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <h2 className="login-form__heading">Sign In</h2>
          <p className="login-form__subheading">Access your wholesale account</p>

          {/* Error banner — shown conditionally when error state is set */}
          {error && (
            <div className="login-error" role="alert">
              <span className="login-error__icon">⚠</span>
              {error}
            </div>
          )}

          {/* Email field */}
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">
              Business Email
            </label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={isLoading}
              required
            />
          </div>

          {/* Password field with show/hide toggle */}
          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="login-password" className="form-label">
                Password
              </label>
              <Link to="/forgot-password" className="form-link">
                Forgot password?
              </Link>
            </div>
            <div className="form-input-wrapper">
              {/* type switches between "password" and "text" based on state */}
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input form-input--has-icon"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={isLoading}
                required
              />
              {/* Password visibility toggle */}
              <button
                type="button"
                className="form-input__toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {/* Submit — shows spinner while loading */}
          <button
            id="login-submit-btn"
            type="submit"
            className={`btn btn--primary btn--full ${isLoading ? 'btn--loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Signing In…' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <p className="login-footer">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="form-link">Request Access</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
