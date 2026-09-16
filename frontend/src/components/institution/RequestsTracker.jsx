import React, { useState } from 'react';

export default function RequestsTracker({ requests }) {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredRequests = requests.filter(req => {
    if (statusFilter === 'All') return true;
    return req.status.toLowerCase().includes(statusFilter.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <span className="font-label-caps text-xs text-primary font-bold uppercase tracking-widest block mb-1">
            Section 3 • Governance &amp; Tracking
          </span>
          <h2 className="font-headline-md text-2xl lg:text-3xl font-bold text-on-surface">
            Institutional Requests &amp; Inquiries
          </h2>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Review status workflows for submitted cultural residencies, masterclasses, and corporate CSR allocations.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          {['All', 'Review', 'Approved', 'Delivered'].map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setStatusFilter(filter)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                statusFilter === filter
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {filter === 'Review' ? 'In Review' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((req) => (
          <div
            key={req.id}
            className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/30 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
          >
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-headline-sm text-xs font-bold text-on-surface px-2.5 py-0.5 rounded-md bg-surface-container-lowest border border-outline-variant/30">
                  {req.requestNumber}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-label-caps font-bold ${
                  req.status.includes('Approved') 
                    ? 'bg-secondary-container text-on-secondary-container' 
                    : req.status.includes('Review') 
                    ? 'bg-primary-fixed text-on-primary-fixed-variant' 
                    : 'bg-surface-container-highest text-on-surface'
                }`}>
                  {req.status}
                </span>
                <span className="text-xs text-outline font-medium">Submitted {req.submissionDate}</span>
              </div>

              <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                {req.title}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-on-surface-variant pt-1">
                <div>
                  <span className="text-outline block text-[10px] uppercase font-semibold">Tradition</span>
                  <span className="font-medium text-on-surface">{req.tradition}</span>
                </div>
                <div>
                  <span className="text-outline block text-[10px] uppercase font-semibold">Format</span>
                  <span className="font-medium text-on-surface">{req.format}</span>
                </div>
                <div>
                  <span className="text-outline block text-[10px] uppercase font-semibold">Cohort Dimension</span>
                  <span className="font-medium text-on-surface">{req.cohortCount} Participants</span>
                </div>
                <div>
                  <span className="text-outline block text-[10px] uppercase font-semibold">Direct Artisan Honorarium</span>
                  <span className="font-bold text-primary">{req.artisanWages}</span>
                </div>
              </div>
            </div>

            {/* Budget & Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-end gap-3 self-stretch lg:self-auto border-t lg:border-t-0 pt-3 lg:pt-0 border-outline-variant/20">
              <div className="text-right">
                <span className="text-[10px] font-label-caps text-outline uppercase block">Approved CSR Budget</span>
                <span className="font-headline-sm text-xl font-bold text-on-surface">{req.budgetTotal}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRequest(req)}
                  className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">description</span>
                  <span>View Dossier</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert(`Official signed requisition certificate for ${req.requestNumber} downloaded.`)}
                  className="p-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs"
                  title="Download Requisition PDF"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredRequests.length === 0 && (
          <div className="text-center py-12 text-on-surface-variant bg-surface-container-low rounded-2xl border border-outline-variant/20">
            <span className="material-symbols-outlined text-outline text-[40px] mb-2">assignment_late</span>
            <p className="font-headline-sm text-base">No institutional requests found</p>
          </div>
        )}
      </div>

      {/* Dossier Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">verified</span>
                <div>
                  <h3 className="font-headline-sm text-lg font-bold text-on-surface">Institutional Request Dossier</h3>
                  <span className="text-xs text-outline">{selectedRequest.requestNumber}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedRequest(null)}
                className="p-1 rounded-full text-outline hover:text-on-surface hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-surface-container-low space-y-1">
                <p><strong>Organization:</strong> The Heritage School &amp; Global Academy</p>
                <p><strong>Status:</strong> <span className="font-bold text-primary">{selectedRequest.status}</span></p>
                <p><strong>Engagement:</strong> {selectedRequest.title}</p>
                <p><strong>Format &amp; Venue:</strong> {selectedRequest.format}</p>
              </div>

              <div className="p-3 rounded-xl bg-secondary-container/40 text-on-secondary-container space-y-1">
                <p className="font-bold text-sm">Escrow Allocation Breakdown:</p>
                <p>• Total CSR Commitment: {selectedRequest.budgetTotal}</p>
                <p>• 88.4% Direct Artisan Wire Remuneration: {selectedRequest.artisanWages}</p>
                <p>• 11.6% Decentralized Provenance Audit &amp; Substrates</p>
              </div>

              <p className="text-on-surface-variant text-[11px] leading-relaxed">
                This dossier is governed by Tvarita Arts Collective's 100% direct-to-artisan sovereign code. All funds are disbursed under 12A/80G certified audit trails.
              </p>
            </div>

            <div className="p-4 px-6 border-t border-outline-variant/30 bg-surface-container-low flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-semibold"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
