import React, { useState } from 'react';
import { TVARITA_BRANDMARK, HERITAGE_INDEX } from '../../data/publicMockData';
import { Check } from 'lucide-react';

export default function PublicFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-surface-container-low text-on-surface">
      <div className="container-max pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          {/* Col 1: Brand & Mission */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={TVARITA_BRANDMARK}
                alt="Tvarita Brandmark"
                className="h-8 w-auto object-contain"
              />
              <span className="font-headline-sm tracking-tight text-on-surface font-bold leading-none">
                TVARITA
              </span>
            </div>
            <p className="font-body-md text-on-surface-variant mb-5 max-w-sm leading-relaxed">
              An autonomous sanctuary and living archive stewarding Indian tribal and folk idioms. Anchored in generational provenance, fair remuneration, and direct artisan agency.
            </p>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
              <span className="font-label-md text-on-surface font-semibold">
                Artisan Support Fund: 88.4% Disbursed Directly
              </span>
            </div>
          </div>

          {/* Col 2: Geographical Heritage Index */}
          <div className="lg:col-span-3">
            <h3 className="font-label-caps text-outline mb-3">
              Geographical Heritage Index
            </h3>
            <ul className="space-y-2 font-body-sm text-on-surface-variant">
              {HERITAGE_INDEX.map((item, i) => (
                <li key={i} className="flex items-center justify-between pr-4">
                  <span className="hover:text-primary transition-colors cursor-pointer">
                    {item.name}
                  </span>
                  <span className="font-label-caps text-[10px] text-outline">
                    {item.gi}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Curatorial Navigation */}
          <div className="lg:col-span-2">
            <h3 className="font-label-caps text-outline mb-3">
              Curatorial Navigation
            </h3>
            <ul className="space-y-2 font-body-sm text-on-surface-variant">
              <li>
                <a href="#traditions" className="hover:text-primary transition-colors">
                  Ethical Lineage Maps
                </a>
              </li>
              <li>
                <a href="#master-artists" className="hover:text-primary transition-colors">
                  Living Master Registry
                </a>
              </li>
              <li>
                <a href="#terroir-map" className="hover:text-primary transition-colors">
                  Pigment & Natural Dye Lore
                </a>
              </li>
              <li>
                <a href="#workshops" className="hover:text-primary transition-colors">
                  Village Field Immersions
                </a>
              </li>
              <li>
                <a href="#marketplace" className="hover:text-primary transition-colors">
                  Museum Loan Programs
                </a>
              </li>
              <li>
                <a href="#marketplace" className="hover:text-primary transition-colors">
                  Corporate Art Stewardship
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Artisan Gazette Subscription */}
          <div className="lg:col-span-3">
            <h3 className="font-label-caps text-outline mb-3">
              Artisan Gazette
            </h3>
            <p className="font-body-sm text-on-surface-variant mb-3 leading-relaxed">
              Quarterly scholarly essays, monograph releases, and verified provenance dispatches.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <div className="flex items-center bg-surface-container-lowest rounded-full p-1 pl-3 shadow-sm border border-outline-variant/30">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full bg-transparent border-none outline-none font-body-sm text-on-surface placeholder:text-outline"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-primary text-on-primary font-label-md hover:bg-primary-container transition-colors shrink-0"
                >
                  {subscribed ? <Check className="w-4 h-4" /> : 'Subscribe'}
                </button>
              </div>
              <span className="font-label-caps text-[10px] text-outline px-1">
                Zero algorithmic spam. Peer-reviewed folklore research only.
              </span>
            </form>
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div className="pt-6 border-t border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-4 font-body-sm text-outline">
          <div>
            © 2024 Tvarita Living Indigenous Arts Foundation. Non-Profit Trust Registered under Section 12A.
          </div>
          <div className="flex flex-wrap items-center gap-4 font-label-md">
            <a href="#terms" className="hover:text-on-surface transition-colors">
              Provenance Standards
            </a>
            <a href="#terms" className="hover:text-on-surface transition-colors">
              Artisan Royalty Charter
            </a>
            <a href="#terms" className="hover:text-on-surface transition-colors">
              Ethical Acquisition Terms
            </a>
            <a href="#terms" className="hover:text-on-surface transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
