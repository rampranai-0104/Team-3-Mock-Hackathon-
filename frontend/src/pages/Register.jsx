import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TVARITA_BRANDMARK } from '../data/publicMockData';
import { ArrowLeft, ArrowRight, User, Sparkles, Building, CheckCircle2 } from 'lucide-react';
import '../styles/auth.css';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    accountType: 'patron',
    agreeTerms: true,
  });

  const roleRoutes = {
    patron: '/dashboard/patron',
    artisan: '/dashboard/artisan',
    institution: '/dashboard/institution',
  };

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const userPayload = {
      name: formData.fullName || 'Tvarita Member',
      email: formData.email,
      phone: formData.phone,
      role: formData.accountType,
      registeredAt: new Date().toISOString(),
    };
    localStorage.setItem('tvarita_user', JSON.stringify(userPayload));

    const targetRoute = roleRoutes[formData.accountType] || '/';
    navigate(targetRoute);
  };

  return (
    <div className="auth-page-shell">
      <div className="auth-card-wrapper">
        {/* Form Side */}
        <div className="auth-form-side">
          <div className="mb-5">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-on-surface-variant hover:text-primary font-label-md text-xs mb-3 transition-colors"
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
            <h1 className="font-headline-md text-2xl font-semibold text-on-surface mt-3">
              Join the Living Archive
            </h1>
            <p className="font-body-sm text-on-surface-variant mt-1">
              Select your membership tier to begin ethical engagement.
            </p>
          </div>

          <form onSubmit={handleRegister}>
            {/* Account Type Selector */}
            <div className="mb-4">
              <label className="auth-input-label block mb-2">Account Type</label>
              <div className="account-type-grid">
                {[
                  {
                    id: 'patron',
                    title: 'Patron',
                    sub: 'Art Collector & Learner',
                    icon: User,
                  },
                  {
                    id: 'artisan',
                    title: 'Artist',
                    sub: 'Master Custodian',
                    icon: Sparkles,
                  },
                  {
                    id: 'institution',
                    title: 'Institution',
                    sub: 'Museum or University',
                    icon: Building,
                  },
                ].map((tier) => {
                  const Icon = tier.icon;
                  const isSelected = formData.accountType === tier.id;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => handleChange('accountType', tier.id)}
                      className={`account-type-card ${isSelected ? 'selected' : ''}`}
                    >
                      <Icon className="w-5 h-5 text-primary" />
                      <span className="font-title-md text-xs font-bold">{tier.title}</span>
                      <span className="font-label-caps text-[9px] text-outline line-clamp-1">
                        {tier.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Full Name */}
            <div className="auth-input-group">
              <label className="auth-input-label" htmlFor="reg-name">
                Full Name
              </label>
              <input
                id="reg-name"
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="e.g. Radhika Sharma"
                className="auth-text-input"
              />
            </div>

            {/* Email */}
            <div className="auth-input-group">
              <label className="auth-input-label" htmlFor="reg-email">
                Email Address
              </label>
              <input
                id="reg-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="you@domain.com"
                className="auth-text-input"
              />
            </div>

            {/* Phone */}
            <div className="auth-input-group">
              <label className="auth-input-label" htmlFor="reg-phone">
                Phone Number
              </label>
              <input
                id="reg-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+91 98765 43210"
                className="auth-text-input"
              />
            </div>

            {/* Password */}
            <div className="auth-input-group">
              <label className="auth-input-label" htmlFor="reg-password">
                Password
              </label>
              <input
                id="reg-password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Create a secure password"
                className="auth-text-input"
              />
            </div>

            {/* Terms checkbox */}
            <div className="my-4 text-xs">
              <label className="flex items-start gap-2 cursor-pointer font-body-sm text-on-surface-variant">
                <input
                  type="checkbox"
                  required
                  checked={formData.agreeTerms}
                  onChange={(e) => handleChange('agreeTerms', e.target.checked)}
                  className="rounded border-outline-variant text-primary focus:ring-primary mt-0.5"
                />
                <span>
                  I agree to the Tvarita Ethical Provenance Charter & Community Guidelines
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="auth-submit-btn"
            >
              <span>Complete Registration</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-outline-variant/30 text-center font-body-sm text-on-surface-variant">
            <span>Already registered? </span>
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>

        {/* Visual Editorial Side */}
        <div className="auth-visual-side">
          <div>
            <span className="font-label-caps text-primary text-[10px] tracking-widest uppercase block mb-2">
              Ethical Heritage Charter
            </span>
            <h2 className="font-headline-md text-2xl font-bold text-on-surface leading-snug">
              Direct Agency & Sovereign Royalties
            </h2>
            <p className="font-body-sm text-on-surface-variant mt-3 leading-relaxed">
              When you join Tvarita, you are participating in a sovereign cooperative model where 85% of artwork acquisitions go straight to the artisan hands.
            </p>

            <div className="space-y-3 mt-6">
              {[
                'GI-certified tribal provenance certificates',
                'Zero predatory middleman commission model',
                'Unesco Intangible Cultural Heritage partner',
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-on-surface">
                  <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-surface/80 border border-outline-variant/40">
            <span className="font-label-caps text-[9px] text-outline uppercase block">Community Metric</span>
            <span className="font-title-md font-bold text-on-surface">142 Indigenous Communities</span>
            <span className="font-body-sm text-xs text-on-surface-variant block mt-0.5">Across 18 forest and rural climes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
