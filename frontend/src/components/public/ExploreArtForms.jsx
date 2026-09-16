import React, { useState } from 'react';
import { artForms } from '../../data/mockData';
import TraditionDetailModal from './TraditionDetailModal';

export default function ExploreArtForms({ onNavigateToWorkshops }) {
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalTradition, setActiveModalTradition] = useState(null);

  const regions = ['All', 'Western India', 'Central India', 'Eastern India'];

  const filteredArtForms = artForms.filter(item => {
    const matchesRegion = 
      selectedRegion === 'All' || 
      (selectedRegion === 'Western India' && item.region.includes('Maharashtra')) ||
      (selectedRegion === 'Central India' && item.region.includes('Madhya Pradesh')) ||
      (selectedRegion === 'Eastern India' && (item.region.includes('Bihar') || item.region.includes('Odisha') || item.region.includes('Jharkhand')));
    
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRegion && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <span className="font-label-caps text-xs text-primary font-bold uppercase tracking-widest block mb-1">
            SECTION 1 • CULTURAL DISCOVERY
          </span>
          <h2 className="font-headline-md text-2xl lg:text-3xl font-bold text-on-surface">
            Discover Living Art Traditions
          </h2>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Explore India's living folk and indigenous art traditions, their stories, techniques, and communities.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search traditions, motifs..."
            className="w-full pl-9 pr-4 py-2 rounded-full bg-surface-container text-xs text-on-surface placeholder:text-outline border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Region Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {regions.map((region) => (
          <button
            key={region}
            type="button"
            onClick={() => setSelectedRegion(region)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedRegion === region
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            {region}
          </button>
        ))}
      </div>

      {/* Grid of Tradition Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtForms.map((tradition) => (
          <TraditionCard
            key={tradition.id}
            tradition={tradition}
            onSelectDetails={(trad) => setActiveModalTradition(trad)}
          />
        ))}
      </div>

      {filteredArtForms.length === 0 && (
        <div className="text-center py-12 text-on-surface-variant">
          <span className="material-symbols-outlined text-outline text-[40px] mb-2">search_off</span>
          <p className="font-headline-sm text-base">No traditions found matching your criteria</p>
          <button
            onClick={() => { setSelectedRegion('All'); setSearchQuery(''); }}
            className="mt-3 px-4 py-1.5 rounded-full bg-primary text-on-primary text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {activeModalTradition && (
        <TraditionDetailModal
          tradition={activeModalTradition}
          onClose={() => setActiveModalTradition(null)}
          onExploreWorkshops={(trad) => {
            if (onNavigateToWorkshops) onNavigateToWorkshops(trad);
          }}
        />
      )}
    </div>
  );
}

function TraditionCard({ tradition, onSelectDetails }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="group bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div>
        {/* Card Image: completely omitted if image fails or is unavailable */}
        {tradition.image && !imageError && (
          <div className="h-48 w-full relative overflow-hidden bg-surface-container">
            <img
              src={tradition.image}
              alt=""
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            {tradition.giCertified && (
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-surface-container-lowest/95 backdrop-blur-sm text-on-surface text-[10px] font-label-caps font-bold shadow-xs">
                GI TAG AUTHENTIC
              </span>
            )}

            <span className="absolute bottom-3 left-3 text-xs text-white/90 font-medium">
              {tradition.region}
            </span>
          </div>
        )}

        {/* Card Content */}
        <div className="p-5 space-y-3">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] font-label-caps text-outline uppercase font-semibold block">
                {tradition.category}
              </span>
              {(!tradition.image || imageError) && (
                <span className="text-xs text-on-surface-variant font-medium">
                  {tradition.region}
                </span>
              )}
            </div>

            {(!tradition.image || imageError) && tradition.giCertified && (
              <div className="mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-label-caps font-bold">
                  GI TAG AUTHENTIC
                </span>
              </div>
            )}

            <h3 className="font-headline-sm text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
              {tradition.name}
            </h3>
            <p className="text-xs text-primary font-medium italic mt-0.5">
              "{tradition.tagline}"
            </p>
          </div>

          <p className="text-body-sm text-on-surface-variant line-clamp-2">
            {tradition.description}
          </p>

          {/* Motifs preview */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tradition.motifs.slice(0, 3).map((motif, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-surface-container-low text-[11px] text-on-surface-variant border border-outline-variant/20"
              >
                {motif}
              </span>
            ))}
            {tradition.motifs.length > 3 && (
              <span className="px-1.5 py-0.5 text-[11px] text-outline">
                +{tradition.motifs.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-4 px-5 border-t border-outline-variant/20 bg-surface-container-low/50 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[9px] font-label-caps text-outline uppercase font-semibold">Lead Practitioner</span>
          <span className="text-xs font-bold text-on-surface">{tradition.leadArtisan}</span>
        </div>

        <button
          type="button"
          onClick={() => onSelectDetails(tradition)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container text-on-surface hover:bg-primary hover:text-on-primary transition-all text-xs font-semibold shadow-xs"
        >
          <span>Details</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
