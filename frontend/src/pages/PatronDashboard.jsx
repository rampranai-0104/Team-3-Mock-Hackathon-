import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TVARITA_BRANDMARK } from '../data/publicMockData';
import { ArrowLeft, LogOut, Compass } from 'lucide-react';
import '../styles/auth.css';

export default function PatronDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('tvarita_user');
    navigate('/login');
  };

  return (
    <div className="placeholder-shell">
      <div className="placeholder-card">
        {/* Tvarita Logo & Name */}
        <div className="flex items-center gap-3">
          <img
            src={TVARITA_BRANDMARK}
            alt="Tvarita Brandmark"
            className="h-10 w-auto object-contain"
          />
          <div className="flex flex-col text-left">
            <span className="font-headline-sm text-2xl font-bold tracking-tight text-on-surface">
              TVARITA
            </span>
            <span className="font-label-caps text-[10px] text-outline tracking-widest uppercase">
              Living Indigenous Arts
            </span>
          </div>
        </div>

        {/* Visual Badge Icon */}
        <div className="w-16 h-16 rounded-full bg-secondary-container text-secondary flex items-center justify-center mt-2">
          <Compass className="w-8 h-8" />
        </div>

        {/* Titles & Message */}
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-md text-xs">
            Temporary Workspace
          </span>
          <h1 className="font-headline-md text-2xl lg:text-3xl font-bold text-on-surface">
            Patron Dashboard
          </h1>
          <p className="font-body-md text-on-surface-variant max-w-sm mx-auto leading-relaxed">
            Your personalized cultural discovery space is coming soon.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full py-3 px-5 rounded-full bg-primary text-on-primary font-label-md hover:bg-primary-container transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-3 px-5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
