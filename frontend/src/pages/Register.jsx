import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TVARITA_BRANDMARK } from '../data/publicMockData';
import {
  ArrowLeft,
  ArrowRight,
  User,
  Sparkles,
  Building,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import '../styles/auth.css';

export default function Register() {
  const navigate = useNavigate();
  const { register, verifyOtp, sendOtp, getRoleDashboardRoute } = useAuth();

  const [step, setStep] = useState('form'); // 'form' | 'otp'
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    accountType: 'patron',
    agreeTerms: true,
  });

  const [otp, setOtp] = useState('');
  const [otpDemoCode, setOtpDemoCode] = useState(null);
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (error) setError(null);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.password) {
      setError('Please fill out all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const result = await register(formData);
      if (result.otp) {
        setOtpDemoCode(result.otp);
      }
      setSuccessMessage('Account created! Please verify your email with the 6-digit OTP.');
      setCooldown(60);
      setStep('otp');
    } catch (err) {
      setError(err.message || 'Registration failed. Please verify your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length < 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setError(null);
    setVerifying(true);

    try {
      await verifyOtp(formData.email, otp.trim(), 'registration');
      setSuccessMessage('✓ Email verified successfully! Opening your sanctuary dashboard...');

      setTimeout(() => {
        const targetRoute = getRoleDashboardRoute(formData.accountType);
        navigate(targetRoute);
      }, 1200);
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0 || resending) return;
    setError(null);
    setResending(true);

    try {
      const res = await sendOtp(formData.email, 'registration', formData.fullName);
      const newCode = res.data?.data?.otp || res.data?.otp;
      if (newCode) {
        setOtpDemoCode(newCode);
      }
      setCooldown(60);
      setSuccessMessage('A fresh verification OTP has been sent to your email.');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      setError(err.message || 'Failed to resend OTP. Please try again in a moment.');
    } finally {
      setResending(false);
    }
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

          {/* Error Alert */}
          {error && (
            <div
              className="mb-4 p-3 rounded-xl bg-error-container/80 border border-error/20 flex items-start gap-2.5 text-on-error-container text-xs animate-shake"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold block">Registration Notice</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div
              className="mb-4 p-3 rounded-xl bg-secondary-container/80 border border-secondary/20 flex items-start gap-2.5 text-on-secondary-container text-xs"
              role="status"
            >
              <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold block">Success</span>
                <span>{successMessage} Redirecting to your dashboard...</span>
              </div>
            </div>
          )}

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
                placeholder="Create a secure password (min 6 characters)"
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
              disabled={loading}
              className="auth-submit-btn flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering with MongoDB...</span>
                </>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
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
              When you join Tvarita, you are participating in a cooperative model that connects artisans directly with patrons and institutions.
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
