import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TVARITA_BRANDMARK } from '../data/publicMockData';
import { ArrowLeft, ArrowRight, ShieldCheck, User, Sparkles, Building, Lock } from 'lucide-react';
import '../styles/auth.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('patron');
  const [rememberMe, setRememberMe] = useState(true);

  const roleRoutes = {
    patron: '/dashboard/patron',
    artisan: '/dashboard/artisan',
    institution: '/dashboard/institution',
    admin: '/dashboard/admin',
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const userPayload = {
      email: email || `${selectedRole}@tvarita.org`,
      role: selectedRole,
      loginAt: new Date().toISOString(),
    };
    localStorage.setItem('tvarita_user', JSON.stringify(userPayload));

    // Route to appropriate dashboard
    const targetRoute = roleRoutes[selectedRole] || '/';
    navigate(targetRoute);
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
              <span>Back to Sanctuary</span>
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

          <form onSubmit={handleLogin}>
            {/* Quick Role Selector */}
            <div className="mb-4">
              <label className="auth-input-label block mb-2">Select Your Role</label>
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
                      onClick={() => setSelectedRole(r.id)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={`${selectedRole}@tvarita.org`}
                className="auth-text-input"
              />
            </div>

            {/* Password Field */}
            <div className="auth-input-group">
              <div className="flex items-center justify-between">
                <label className="auth-input-label" htmlFor="login-password">
                  Password
                </label>
                <a href="#reset" className="font-label-md text-xs text-primary hover:underline">
                  Forgot?
                </a>
              </div>
              <input
                id="login-password"
                type="password"
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
              className="auth-submit-btn"
            >
              <span>Enter {selectedRole === 'admin' ? 'Console' : 'Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Registration link */}
          <div className="mt-6 pt-5 border-t border-outline-variant/30 text-center font-body-sm text-on-surface-variant">
            <span>New custodian or collector? </span>
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
              <span>Sovereign Tribal Archive</span>
            </div>
            <h2 className="font-headline-md text-2xl font-bold text-on-surface leading-snug">
              "Honoring the lineage of indigenous wisdom through fair cultural stewardship."
            </h2>
            <p className="font-body-sm text-on-surface-variant mt-3 leading-relaxed">
              Every access credential is tethered to verified ethical royalty transparency and direct artisan agency.
            </p>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-surface/80 backdrop-blur-sm border border-outline-variant/40 space-y-1">
            <span className="font-label-caps text-[9px] text-outline uppercase block">Active Gateway</span>
            <div className="flex items-center justify-between">
              <span className="font-label-md text-sm font-semibold text-on-surface capitalize">
                {selectedRole} Access Mode
              </span>
              <span className="font-label-caps text-[10px] text-secondary font-bold">Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
