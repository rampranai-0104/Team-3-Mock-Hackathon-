import React from 'react';

export default function TraditionDetailModal({ tradition, onClose, onExploreWorkshops }) {
  if (!tradition) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Banner Image */}
        <div className="h-56 w-full relative overflow-hidden">
          <img 
            src={tradition.image} 
            alt={tradition.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white hover:bg-black/80 flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-1">
              {tradition.giCertified && (
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-label-caps font-bold">
                  {tradition.giTag} • AUTHENTIC
                </span>
              )}
              <span className="text-xs text-outline-variant">{tradition.region}</span>
            </div>
            <h2 className="font-headline-md text-2xl lg:text-3xl font-bold leading-tight">
              {tradition.name}
            </h2>
            <p className="text-xs text-primary-fixed italic mt-0.5">
              "{tradition.tagline}"
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
          <div>
            <h3 className="text-xs font-label-caps text-outline uppercase tracking-wider font-bold mb-1.5">
              Heritage Narrative & Provenance
            </h3>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              {tradition.description}
            </p>
          </div>

          {/* Sacred Motifs & Symbolism */}
          <div>
            <h3 className="text-xs font-label-caps text-outline uppercase tracking-wider font-bold mb-2">
              Sacred Motifs & Cosmological Elements
            </h3>
            <div className="flex flex-wrap gap-2">
              {tradition.motifs.map((motif, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1 rounded-lg bg-surface-container text-on-surface text-xs font-medium border border-outline-variant/30 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  <span>{motif}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Raw Mineral & Organic Materials */}
          <div>
            <h3 className="text-xs font-label-caps text-outline uppercase tracking-wider font-bold mb-2">
              Earth Pigments & Ancestral Substrates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {tradition.materials.map((mat, i) => (
                <div key={i} className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">nature</span>
                  <span className="text-xs text-on-surface font-medium">{mat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Artisan Reference */}
          <div className="p-4 rounded-xl bg-surface-container flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-sm">
                {tradition.leadArtisan[0]}
              </span>
              <div>
                <span className="text-[10px] font-label-caps text-outline uppercase font-semibold">Senior Custodian Practitioner</span>
                <h4 className="font-headline-sm text-sm font-bold text-on-surface">{tradition.leadArtisan}</h4>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-semibold">
              Active Guild Master
            </span>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 px-6 border-t border-outline-variant/30 bg-surface-container-low flex justify-between items-center">
          <span className="text-xs text-outline">Direct Escrow Provenance Protected</span>
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onExploreWorkshops) onExploreWorkshops(tradition);
            }}
            className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-container text-on-primary font-semibold text-xs transition-colors flex items-center gap-2 shadow-sm"
          >
            <span>View Related Workshops</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
