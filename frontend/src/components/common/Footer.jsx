import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-low text-on-surface border-t border-outline-variant/30 mt-space-xl">
      <div className="max-w-7xl mx-auto px-gutter-mobile lg:px-margin py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & UNESCO statement */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined text-[18px]">palette</span>
              </div>
              <span className="font-headline-sm text-lg font-bold tracking-tight text-on-surface">
                TVARITA ARTS COLLECTIVE
              </span>
            </div>
            <p className="text-body-sm text-on-surface-variant max-w-md leading-relaxed">
              Preserving and digitizing endangered Indian tribal and folk art forms through sovereign master artist compensation, direct GI-tagged provenance, and transformative educational & corporate CSR engagements.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-semibold">
                UNESCO ICH Preservation Partner
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-semibold">
                100% Direct Escrow
              </span>
            </div>
          </div>

          {/* Col 2: Indigenous Lineages */}
          <div>
            <h4 className="font-headline-sm text-sm font-semibold mb-3 text-on-surface uppercase tracking-wider">
              Living Lineages
            </h4>
            <ul className="space-y-1.5 text-body-sm text-on-surface-variant">
              <li>Warli Sacred Geometry (Maharashtra)</li>
              <li>Gond Pardhan Art (Madhya Pradesh)</li>
              <li>Mithila / Madhubani (Bihar)</li>
              <li>Odisha Pattachitra (Odisha)</li>
              <li>Sohrai & Khovar (Jharkhand)</li>
            </ul>
          </div>

          {/* Col 3: Institutional & CSR */}
          <div>
            <h4 className="font-headline-sm text-sm font-semibold mb-3 text-on-surface uppercase tracking-wider">
              Institutional CSR
            </h4>
            <ul className="space-y-1.5 text-body-sm text-on-surface-variant">
              <li>12A & 80G Certified Disbursals</li>
              <li>School Cultural Residencies</li>
              <li>Corporate Guild Gifting</li>
              <li>Audited Provenance NFC Seals</li>
              <li>Smart Escrow Ledger</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-outline">
          <p>© 2026 Tvarita Arts Collective. All rights reserved. Sovereign Artisan Rights Protected.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-primary transition-colors">Provenance Ledger</a>
            <a href="#" className="hover:text-primary transition-colors">GI Verification</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Patronage</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
