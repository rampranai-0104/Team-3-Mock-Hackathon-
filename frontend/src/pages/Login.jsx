import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TVARITA_BRANDMARK } from '../data/publicMockData';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  User,
  Sparkles,
  Building,
  Lock,
  AlertCircle,
  Loader2,
  KeyRound,
} from 'lucide-react';
import '../styles/auth.css';

export default function Login() {
  const navigate = useNavigate();
  const { login, getRoleDashboardRoute } = useAuth();

  const [email, setEmail] = useState('patron@tvarita.org');
  const [password, setPassword] = useState('Tvarita@2026');
  const [selectedRole, setSelectedRole] = useState('patron');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const demoAccounts = {
    patron: { email: 'patron@tvarita.org', pass: 'Tvarita@2026', label: 'Patron' },
    artisan: { email: 'artist@tvarita.org', pass: 'Tvarita@2026', label: 'Artist' },
    institution: { email: 'institution@tvarita.org', pass: 'Tvarita@2026', label: 'Institution' },
    admin: { email: 'admin@tvarita.org', pass: 'Tvarita@2026', label: 'Admin' },
  };

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setError(null);
    if (demoAccounts[roleId]) {
      setEmail(demoAccounts[roleId].email);
      setPassword(demoAccounts[roleId].pass);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const targetEmail = email.trim();
    const targetPassword = password;

    if (!targetEmail || !targetPassword) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    try {
      const result = await login(targetEmail, targetPassword);
      const userRole = result.user?.role;
      const targetRoute = getRoleDashboardRoute(userRole || selectedRole);
      navigate(targetRoute);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-shell">
      <div className="auth-card-wrapper">
        {/* Form Side */}
        <div className="auth-form-side">
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-on-surface-variant hover:text-primary font-label-md text-xs mb-4 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>

            <div className="flex items-center gap-3">
              <img
                src={TVARITA_BRANDMARK}
                alt="Tvarita Brandmark"
                className="h-8 w-auto object-contain"
              />
              <span className="font-headline-sm text-2xl font-bold tracking-tight text-on-surface">
                TVARITA
              </span>
            </div>
            <h1 className="font-headline-md text-2xl font-semibold text-on-surface mt-4">
              Sign In to Your Space
            </h1>
            <p className="font-body-sm text-on-surface-variant mt-1">
              Select your role to access your dedicated cultural dashboard.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              className="mb-4 p-3 rounded-xl bg-error-container/80 border border-error/20 flex items-start gap-2.5 text-on-error-container text-xs animate-shake"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold block">Authentication Error</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* Quick Role Selector */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="auth-input-label">Select Your Role</label>
                <span className="text-[10px] text-primary font-semibold flex items-center gap-1">
                  <KeyRound className="w-3 h-3" /> Demo auto-filled
                </span>
              </div>
              <div className="auth-role-grid">
                {[
                  { id: 'patron', label: 'Patron', icon: User },
                  { id: 'artisan', label: 'Artist', icon: Sparkles },
                  { id: 'institution', label: 'Institution', icon: Building },
                  { id: 'admin', label: 'Admin', icon: ShieldCheck },
                ].map((r) => {
                  const Icon = r.icon;
                  const isSelected = selectedRole === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleRoleSelect(r.id)}
                      className={`auth-role-card ${isSelected ? 'selected' : ''}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-label-md text-xs">{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Email Field */}
            <div className="auth-input-group">
              <label className="auth-input-label" htmlFor="login-email">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@tvarita.org"
                className="auth-text-input"
              />
            </div>

            {/* Password Field */}
            <div className="auth-input-group">
              <div className="flex items-center justify-between">
                <label className="auth-input-label" htmlFor="login-password">
                  Password
                </label>
                <span className="font-label-md text-[11px] text-on-surface-variant">
                  Default: <code className="text-primary font-semibold">Tvarita@2026</code>
                </span>
              </div>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="auth-text-input"
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between my-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-body-sm">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-outline-variant text-primary focus:ring-primary"
                />
                <span>Remember this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="auth-submit-btn flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Enter {selectedRole === 'admin' ? 'Console' : 'Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Registration link */}
          <div className="mt-6 pt-5 border-t border-outline-variant/30 text-center font-body-sm text-on-surface-variant">
            <span>New to Tvarita? </span>
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Create an Account
            </Link>
          </div>
        </div>

        {/* Visual Editorial Side */}
        <div className="auth-visual-side">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-on-surface font-label-caps text-[10px] tracking-wider mb-6">
              <Lock className="w-3 h-3 text-primary" />
              <span>Traditional Arts Archive</span>
            </div>
            <h2 className="font-headline-md text-2xl font-bold text-on-surface leading-snug">
              "Connecting people with traditional Indian folk and tribal arts."
            </h2>
            <p className="font-body-sm text-on-surface-variant mt-3 leading-relaxed">
              Every access credential is authenticated against our live MongoDB cluster using secure, token-based session verification.
            </p>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-surface/80 backdrop-blur-sm border border-outline-variant/40 space-y-1">
            <span className="font-label-caps text-[9px] text-outline uppercase block">Active Gateway</span>
            <div className="flex items-center justify-between">
              <span className="font-label-md text-sm font-semibold text-on-surface capitalize">
                {selectedRole} Access Mode
              </span>
              <span className="font-label-caps text-[10px] text-secondary font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                Live API Ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
