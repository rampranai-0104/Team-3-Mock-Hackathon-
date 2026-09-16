import React, { useState } from 'react';
import { institutionData } from '../../data/mockData';

export default function ProductBuying() {
  const [quantities, setQuantities] = useState({
    souv_mithila_desk: 50,
    souv_gond_coaster: 30,
    souv_dokra_paperweight: 100
  });

  const [rfqDossierModal, setRfqDossierModal] = useState(false);

  const handleQtyChange = (id, val) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, parseInt(val, 10) || 0)
    }));
  };

  const souvenirs = institutionData.bulkSouvenirs;

  // Calculate dynamic subtotal
  const rawSubtotal = souvenirs.reduce((acc, item) => {
    const qty = quantities[item.id] || 0;
    return acc + (item.unitPrice * qty);
  }, 0);

  // Total quantity count for volume discount
  const totalItemsCount = Object.values(quantities).reduce((a, b) => a + b, 0);
  const discountRate = totalItemsCount >= 100 ? 0.08 : totalItemsCount >= 50 ? 0.05 : 0;
  const discountAmount = Math.round(rawSubtotal * discountRate);
  const finalTotal = rawSubtotal - discountAmount;
  const directArtisanWages = Math.round(finalTotal * 0.884);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <span className="font-label-caps text-xs text-primary font-bold uppercase tracking-widest block mb-1">
            Section 5 • Institutional Procurement
          </span>
          <h2 className="font-headline-md text-2xl lg:text-3xl font-bold text-on-surface">
            Certified Bulk Corporate Gifting
          </h2>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Handcrafted desk artifacts and executive souvenirs direct from certified tribal craft cooperatives.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold">
            80G CSR Deductible
          </span>
        </div>
      </div>

      {/* Souvenirs Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {souvenirs.map((item) => {
          const qty = quantities[item.id] || 0;
          return (
            <div
              key={item.id}
              className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-48 w-full relative overflow-hidden bg-surface-container p-3 flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-xl shadow-xs"
                  />
                  <span className="absolute top-4 left-4 px-2.5 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface text-[10px] font-label-caps font-bold">
                    MOQ {item.moq} UNITS
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <span className="text-[10px] font-label-caps text-outline uppercase font-semibold block">
                    {item.tradition}
                  </span>
                  <h3 className="font-headline-sm text-base font-bold text-on-surface">
                    {item.title}
                  </h3>
                  <p className="text-body-sm text-on-surface-variant line-clamp-2">
                    {item.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-label-caps text-outline uppercase block">Unit Price</span>
                      <span className="font-headline-sm text-lg font-bold text-primary">
                        ₹{item.unitPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-label-caps text-outline uppercase block">Item Subtotal</span>
                      <span className="font-headline-sm text-sm font-bold text-on-surface">
                        ₹{(item.unitPrice * qty).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="p-4 px-5 border-t border-outline-variant/20 bg-surface-container-low/50 flex items-center justify-between">
                <span className="text-xs text-outline font-semibold">Bulk Requisition Qty</span>

                <div className="flex items-center gap-2 bg-surface-container px-2 py-1 rounded-full border border-outline-variant/30">
                  <button
                    type="button"
                    onClick={() => handleQtyChange(item.id, qty - 5)}
                    className="w-6 h-6 rounded-full bg-surface text-on-surface hover:bg-primary hover:text-white flex items-center justify-center text-xs font-bold transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={0}
                    value={qty}
                    onChange={(e) => handleQtyChange(item.id, e.target.value)}
                    className="w-12 text-center text-xs font-bold bg-transparent text-on-surface focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleQtyChange(item.id, qty + 5)}
                    className="w-6 h-6 rounded-full bg-surface text-on-surface hover:bg-primary hover:text-white flex items-center justify-center text-xs font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DYNAMIC BULK QUOTATION GENERATOR BAR */}
      <section className="rounded-2xl bg-surface-container-high p-6 lg:p-8 border border-outline-variant/30 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
          <div>
            <span className="text-[10px] font-label-caps text-primary uppercase font-bold tracking-wider block">
              Automated RFQ Calculator
            </span>
            <h3 className="font-headline-sm text-xl font-bold text-on-surface mt-0.5">
              Institutional Quotation Estimate ({totalItemsCount} Total Units)
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Includes custom cooperative provenance tags, gift docket sleeves, and direct guild honorariums.
            </p>
          </div>

          {discountRate > 0 && (
            <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold self-start lg:self-auto">
              {(discountRate * 100)}% Volume Institutional Rebate Applied
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
            <span className="text-[10px] font-label-caps text-outline uppercase font-semibold block">Total Estimated Quote</span>
            <span className="font-headline-sm text-2xl font-bold text-primary">
              ₹{finalTotal.toLocaleString('en-IN')}
            </span>
            {discountAmount > 0 && (
              <span className="text-[11px] text-secondary block mt-0.5">
                Saved ₹{discountAmount.toLocaleString('en-IN')} with bulk slab
              </span>
            )}
          </div>

          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
            <span className="text-[10px] font-label-caps text-outline uppercase font-semibold block">Direct Artisan Remuneration (88.4%)</span>
            <span className="font-headline-sm text-2xl font-bold text-on-surface">
              ₹{directArtisanWages.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-secondary font-medium block mt-0.5">
              Disbursed directly to tribal guilds
            </span>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex flex-col justify-between">
            <span className="text-[10px] font-label-caps text-outline uppercase font-semibold block">Tax &amp; Audit Exemption</span>
            <span className="text-xs font-bold text-on-surface mt-1">100% Eligible under Section 80G Cultural CSR</span>
            <span className="text-[10px] text-outline mt-1">Audited cooperative certificate enclosed</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs text-outline">Direct-to-cooperative certification and GST invoicing included.</span>
          
          <button
            type="button"
            onClick={() => setRfqDossierModal(true)}
            className="px-6 py-3 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
            <span>Generate Institutional RFQ Dossier</span>
          </button>
        </div>
      </section>

      {/* RFQ Dossier Modal */}
      {rfqDossierModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">fact_check</span>
                <div>
                  <h3 className="font-headline-sm text-lg font-bold text-on-surface">Institutional RFQ Dossier Prepared</h3>
                  <span className="text-xs text-outline">The Heritage School &amp; Global Academy</span>
                </div>
              </div>
              <button 
                onClick={() => setRfqDossierModal(false)}
                className="p-1 rounded-full text-outline hover:text-on-surface hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-surface-container-low space-y-1.5">
                <div className="flex justify-between">
                  <span>Mithila Desk Dockets ({quantities.souv_mithila_desk} units):</span>
                  <strong>₹{(1150 * (quantities.souv_mithila_desk || 0)).toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Gond Wooden Coaster Guild Boxes ({quantities.souv_gond_coaster} units):</span>
                  <strong>₹{(2850 * (quantities.souv_gond_coaster || 0)).toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Dokra Bell Metal Paperweights ({quantities.souv_dokra_paperweight} units):</span>
                  <strong>₹{(780 * (quantities.souv_dokra_paperweight || 0)).toLocaleString('en-IN')}</strong>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-secondary pt-1 border-t border-outline-variant/20">
                    <span>Volume Institutional Rebate:</span>
                    <strong>-₹{discountAmount.toLocaleString('en-IN')}</strong>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-primary pt-2 border-t border-outline-variant/30">
                  <span>Grand Total Requisition:</span>
                  <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-secondary-container/40 text-on-secondary-container space-y-1">
                <span className="font-bold block">Artisan Impact Statement:</span>
                <p className="text-[11px]">
                  ₹{directArtisanWages.toLocaleString('en-IN')} will be transferred directly to the artisan cooperative accounts across Madhubani, Patangarh, and Jharkhand upon purchase order release.
                </p>
              </div>
            </div>

            <div className="p-4 px-6 border-t border-outline-variant/30 bg-surface-container-low flex justify-between items-center">
              <span className="text-xs text-outline font-medium">Valid for 30 Business Days</span>
              <button
                type="button"
                onClick={() => {
                  alert(`Official Institutional RFQ Dossier downloaded for The Heritage School & Global Academy.\nProvisional Quote: ₹${finalTotal.toLocaleString('en-IN')}`);
                  setRfqDossierModal(false);
                }}
                className="px-5 py-2 rounded-full bg-primary text-on-primary text-xs font-semibold shadow-xs"
              >
                Download PDF Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
