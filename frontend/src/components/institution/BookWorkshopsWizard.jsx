import React, { useState } from 'react';

export default function BookWorkshopsWizard({ initialForm = 'Warli', onInquirySubmitted }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedForm, setSelectedForm] = useState(initialForm);
  const [prevInitialForm, setPrevInitialForm] = useState(initialForm);
  const [selectedArchetype, setSelectedArchetype] = useState('Residency');
  const [deliveryFormat, setDeliveryFormat] = useState('On-Campus');
  const [cohortCount, setCohortCount] = useState(150);
  const [ageBracket, setAgeBracket] = useState('Grade 6-12 Modules');
  const [targetDateWindow, setTargetDateWindow] = useState('Autumn Cultural Term (Oct 2026)');
  
  // Step 3 Kits & Murals
  const [includeKits, setIncludeKits] = useState(true);
  const [includeMural, setIncludeMural] = useState(true);

  // Step 4 state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [inquiryId, setInquiryId] = useState('TVR-882');

  if (initialForm !== prevInitialForm) {
    setPrevInitialForm(initialForm);
    setSelectedForm(initialForm);
  }

  // Dynamic derivation of budget based on cohort and kits
  let csrBudget = 60000;
  if (includeKits) csrBudget += cohortCount * 480;
  if (includeMural) csrBudget += 35000;

  const directWages = Math.round(csrBudget * 0.884);
  const trustSplit = csrBudget - directWages;

  const handleLockInquiry = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedId = `#TVR-${Math.floor(800 + Math.random() * 100)}`;
      setInquiryId(generatedId);
      setIsSubmitting(false);
      setIsSubmitted(true);

      const newInquiry = {
        id: `req_${Date.now()}`,
        requestNumber: generatedId,
        title: `${cohortCount}-Student ${selectedForm} ${selectedArchetype}`,
        tradition: `${selectedForm} Master Tradition`,
        archetype: selectedArchetype === 'Residency' ? 'Guild Residency' : 'Executive Masterclass',
        cohortCount: Number(cohortCount),
        format: deliveryFormat,
        budgetTotal: `₹${csrBudget.toLocaleString('en-IN')}`,
        artisanWages: `₹${directWages.toLocaleString('en-IN')} (88.4%)`,
        status: 'In Tribal Council Review',
        submissionDate: 'Just Now',
        statusColor: 'text-primary bg-primary-fixed'
      };

      if (onInquirySubmitted) onInquirySubmitted(newInquiry);
    }, 1200);
  };

  return (
    <div id="booking-wizard" className="space-y-6">
      {/* Header & Step Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <span className="font-label-caps text-xs text-primary font-bold uppercase tracking-widest block mb-1">
            Section 2 • Bespoke Institutional Workflow
          </span>
          <h2 className="font-headline-md text-2xl lg:text-3xl font-bold text-on-surface">
            Institutional Booking &amp; Inquiry Wizard
          </h2>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Configure tailored cultural residencies, academic masterclasses, and CSR workshops with automated direct honorarium audits.
          </p>
        </div>

        {/* Step Indicator Badges */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-primary mr-1">Step {currentStep} of 4</span>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-7 h-2 rounded-full transition-all ${
                  currentStep >= step ? 'bg-primary' : 'bg-surface-container-high'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Banner */}
      {isSubmitted && (
        <div className="p-6 rounded-2xl bg-secondary-container/80 border border-secondary text-on-secondary-container animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary text-white flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[28px]">check_circle</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-surface-container-lowest text-on-surface text-xs font-bold font-label-caps">
                  INQUIRY REFERENCE {inquiryId}
                </span>
                <span className="text-xs font-semibold text-secondary">• Transmitted to Tribal Council</span>
              </div>
              <h3 className="font-headline-sm text-xl font-bold text-on-surface mt-1">
                Institutional Requisition Confirmed
              </h3>
              <p className="text-body-sm text-on-surface-variant mt-1">
                Your bespoke dossier for <strong>{selectedForm} {selectedArchetype}</strong> has been forwarded to the artisan guild council. You can track its live evaluation in <strong>Section 3: Requests</strong>.
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setCurrentStep(1);
                  }}
                  className="px-4 py-2 rounded-full bg-surface-container-lowest text-on-surface text-xs font-semibold shadow-xs"
                >
                  Configure Another Requisition
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WIZARD CARD CONTAINER */}
      {!isSubmitted && (
        <div className="bg-surface-container-low rounded-2xl p-6 lg:p-8 border border-outline-variant/30 shadow-sm space-y-6">
          {/* STEP 1: CULTURAL FORM & EXPERIENCE TYPE */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                  Step 1: Select Heritage Form &amp; Engagement Archetype
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Choose the indigenous art form and format best suited for your institutional cohort.
                </p>
              </div>

              {/* Tradition Buttons */}
              <div>
                <label className="block text-xs font-label-caps text-outline uppercase font-semibold mb-2">
                  Living Master Tradition
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'Warli', name: 'Warli Folk Painting', region: 'Maharashtra' },
                    { id: 'Gond', name: 'Gond Pardhan Art', region: 'Madhya Pradesh' },
                    { id: 'Mithila', name: 'Mithila / Madhubani', region: 'Bihar' },
                    { id: 'Pattachitra', name: 'Odisha Pattachitra', region: 'Odisha' }
                  ].map((trad) => (
                    <button
                      key={trad.id}
                      type="button"
                      onClick={() => setSelectedForm(trad.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        selectedForm === trad.id
                          ? 'bg-primary-fixed text-on-primary-fixed-variant border-primary shadow-xs font-semibold'
                          : 'bg-surface-container-lowest text-on-surface border-outline-variant/30 hover:bg-surface-container'
                      }`}
                    >
                      <span className="font-headline-sm text-sm font-bold block">{trad.name}</span>
                      <span className="text-[11px] text-outline mt-0.5 block">{trad.region}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Engagement Archetype */}
              <div>
                <label className="block text-xs font-label-caps text-outline uppercase font-semibold mb-2">
                  Engagement Archetype
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'Residency', title: 'Campus Cultural Residency', desc: '3 to 5-day collaborative student mural & masterclasses.' },
                    { id: 'Masterclass', title: 'Executive CSR Masterclass', desc: '1-day intensive leadership & ecological folklore retreat.' },
                    { id: 'Exhibition', title: 'Living Museum Pavilion', desc: 'Curated heritage exhibition with live master workstations.' }
                  ].map((arch) => (
                    <button
                      key={arch.id}
                      type="button"
                      onClick={() => setSelectedArchetype(arch.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        selectedArchetype === arch.id
                          ? 'bg-primary-fixed text-on-primary-fixed-variant border-primary shadow-xs'
                          : 'bg-surface-container-lowest text-on-surface border-outline-variant/30 hover:bg-surface-container'
                      }`}
                    >
                      <h4 className="font-title-lg text-sm font-bold">{arch.title}</h4>
                      <p className="text-[11px] text-on-surface-variant mt-1 leading-snug">{arch.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: FORMAT & COHORT LOGISTICS */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                  Step 2: Format &amp; Cohort Logistics
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Specify cohort dimensions, academic levels, and location parameters.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Delivery Format */}
                <div>
                  <label className="block text-xs font-label-caps text-outline uppercase font-semibold mb-2">
                    Delivery Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['On-Campus', 'Virtual Hybrid', 'Atelier Visit'].map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setDeliveryFormat(fmt)}
                        className={`py-3 px-2 rounded-xl border text-center text-xs font-semibold transition-all ${
                          deliveryFormat === fmt
                            ? 'bg-primary text-on-primary border-primary shadow-xs'
                            : 'bg-surface-container-lowest text-on-surface border-outline-variant/30'
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cohort Size */}
                <div>
                  <label className="block text-xs font-label-caps text-outline uppercase font-semibold mb-1">
                    Student / Participant Cohort Count: <span className="text-primary font-bold">{cohortCount}</span>
                  </label>
                  <input
                    type="range"
                    min={20}
                    max={500}
                    step={10}
                    value={cohortCount}
                    onChange={(e) => setCohortCount(Number(e.target.value))}
                    className="w-full accent-primary mt-2"
                  />
                  <div className="flex justify-between text-[10px] text-outline mt-1">
                    <span>20 Participants</span>
                    <span>250 Participants</span>
                    <span>500 Max Cohort</span>
                  </div>
                </div>

                {/* Age Bracket */}
                <div>
                  <label className="block text-xs font-label-caps text-outline uppercase font-semibold mb-1">
                    Target Academic / Institutional Bracket
                  </label>
                  <select
                    value={ageBracket}
                    onChange={(e) => setAgeBracket(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-container-lowest text-xs text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Grade 6-8 Middle School">Grade 6-8 Middle School</option>
                    <option value="Grade 9-12 Senior Secondary">Grade 9-12 Senior Secondary</option>
                    <option value="Undergraduate & University">Undergraduate & University</option>
                    <option value="Corporate Executive & CSR Teams">Corporate Executive & CSR Teams</option>
                  </select>
                </div>

                {/* Target Dates Window */}
                <div>
                  <label className="block text-xs font-label-caps text-outline uppercase font-semibold mb-1">
                    Preferred Engagement Window
                  </label>
                  <input
                    type="text"
                    value={targetDateWindow}
                    onChange={(e) => setTargetDateWindow(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-container-lowest text-xs text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: MATERIAL KITS & CSR BUDGET ALLOCATION SLIDER */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                  Step 3: Material Kit Procurement &amp; CSR Remuneration
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Configure raw natural pigments, student workbooks, and transparent artisan remuneration.
                </p>
              </div>

              {/* Provisions Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-start gap-3 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeKits}
                    onChange={(e) => setIncludeKits(e.target.checked)}
                    className="mt-1 rounded text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="text-xs font-bold text-on-surface block">Artisan Material Kit Provisioning</span>
                    <span className="text-[11px] text-outline block mt-0.5">
                      ₹480/student • Direct courier from forest atelier with bamboo pens and organic wash.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeMural}
                    onChange={(e) => setIncludeMural(e.target.checked)}
                    className="mt-1 rounded text-primary focus:ring-primary"
                  />
                  <div>
                    <span className="text-xs font-bold text-on-surface block">Permanent Campus Wall Mural Co-Creation</span>
                    <span className="text-[11px] text-outline block mt-0.5">
                      +₹35,000 • Permanent collaborative installation on institution campus wall.
                    </span>
                  </div>
                </label>
              </div>

              {/* Interactive CSR Remuneration Slider */}
              <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-label-caps text-outline uppercase font-semibold">Total CSR Disbursal Allocation</span>
                    <h4 className="font-headline-md text-2xl font-bold text-primary mt-0.5">
                      ₹{csrBudget.toLocaleString('en-IN')}
                    </h4>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold self-start sm:self-auto">
                    Audited 12A / 80G Compliant
                  </span>
                </div>

                <input
                  type="range"
                  min={50000}
                  max={400000}
                  step={5000}
                  value={csrBudget}
                  onChange={(e) => setCsrBudget(Number(e.target.value))}
                  className="w-full accent-primary"
                />

                {/* 88.4% Direct Artisan Wages Breakdown Box */}
                <div className="p-4 rounded-xl bg-surface-container-low grid grid-cols-1 sm:grid-cols-2 gap-4 border border-outline-variant/20">
                  <div>
                    <span className="text-[10px] font-label-caps text-outline uppercase font-semibold block">
                      Direct Artisan Remuneration (88.4%)
                    </span>
                    <span className="font-headline-sm text-lg font-bold text-on-surface">
                      ₹{directWages.toLocaleString('en-IN')}
                    </span>
                    <p className="text-[11px] text-secondary mt-0.5 font-medium">
                      Direct bank wire to tribal guild cooperative.
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-label-caps text-outline uppercase font-semibold block">
                      Raw Substrates &amp; Ledger Audit (11.6%)
                    </span>
                    <span className="font-headline-sm text-lg font-bold text-on-surface">
                      ₹{trustSplit.toLocaleString('en-IN')}
                    </span>
                    <p className="text-[11px] text-outline mt-0.5">
                      Logistics, freight & decentralized provenance token.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & LOCK INQUIRY */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                  Step 4: Review Requisition &amp; Lock Inquiry
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Confirm the institutional parameters before transmitting to the tribal council.
                </p>
              </div>

              {/* Summary Card */}
              <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                  <div>
                    <span className="text-[10px] font-label-caps text-outline uppercase font-semibold">Institutional Entity</span>
                    <h4 className="font-headline-sm text-base font-bold text-on-surface">The Heritage School &amp; Global Academy</h4>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-semibold">
                    Tier I Cultural Patron
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-outline block">Selected Form:</span>
                    <strong className="text-on-surface text-sm">{selectedForm} Tradition</strong>
                  </div>
                  <div>
                    <span className="text-outline block">Archetype:</span>
                    <strong className="text-on-surface text-sm">{selectedArchetype}</strong>
                  </div>
                  <div>
                    <span className="text-outline block">Cohort Count:</span>
                    <strong className="text-on-surface text-sm">{cohortCount} Students</strong>
                  </div>
                  <div>
                    <span className="text-outline block">Delivery Format:</span>
                    <strong className="text-on-surface text-sm">{deliveryFormat}</strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-low p-4 rounded-xl">
                  <div>
                    <span className="text-[10px] font-label-caps text-outline uppercase font-semibold block">Total Estimated CSR Disbursal</span>
                    <span className="font-headline-sm text-xl font-bold text-primary">
                      ₹{csrBudget.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-secondary font-medium block">
                      Direct Artisan Payout: ₹{directWages.toLocaleString('en-IN')} (88.4%)
                    </span>
                  </div>

                  <div className="text-xs text-outline sm:text-right">
                    <span>Window: {targetDateWindow}</span>
                    <br />
                    <span>Cohort Level: {ageBracket}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* WIZARD NAVIGATION CONTROLS */}
          <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-5 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>Back</span>
              </button>
            ) : (
              <div></div>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>Continue</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleLockInquiry}
                className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold shadow-md transition-all flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                    <span>Transmitting Requisition...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">lock</span>
                    <span>Lock &amp; Transmit Inquiry</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
