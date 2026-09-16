import React, { useEffect, useState } from 'react';
import publicService from '../../services/publicService';

function mapArtFormToTheme(raw) {
  return {
    id: raw._id,
    name: raw.name,
    region: raw.regions?.[0] || 'India',
    target: 'Schools, Colleges & Corporate Teams',
    pedagogyFocus: raw.history || raw.techniques?.join(', ') || '',
    quote: raw.description || 'A living heritage tradition preserved by generations of hereditary practitioners.',
    image: raw.image?.url || raw.media?.[0]?.url || '',
    materialsKit: raw.materials?.length ? raw.materials.join(', ') : '',
  };
}

export default function InstExploreArtForms({ onSelectForWorkshop }) {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await publicService.getArtForms();
        const list = Array.isArray(res?.data) ? res.data : [];
        if (mounted) setThemes(list.map(mapArtFormToTheme));
      } catch (err) {
        if (mounted) setError(err.message || 'Unable to load cultural learning programs right now.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <span className="font-label-caps text-xs text-primary font-bold uppercase tracking-widest block mb-1">
            SECTION 1 • CULTURAL LEARNING
          </span>
          <h2 className="font-headline-md text-2xl lg:text-3xl font-bold text-on-surface">
            Explore Cultural Learning Programs
          </h2>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Discover indigenous art experiences designed for schools, colleges, organizations, and corporate cultural initiatives.
          </p>
        </div>
      </div>

      {loading && (
        <div className="text-center py-12 text-on-surface-variant">
          <p className="font-headline-sm text-base">Loading cultural learning programs…</p>
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-12 text-error">
          <p className="font-headline-sm text-base">{error}</p>
        </div>
      )}

      {!loading && !error && themes.length === 0 && (
        <div className="text-center py-12 text-on-surface-variant">
          <p className="font-headline-sm text-base">No published art traditions yet — check back soon.</p>
        </div>
      )}

      {/* Grid of Institutional Art Offerings */}
      {!loading && !error && themes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {themes.map((theme) => (
            <InstThemeCard
              key={theme.id}
              theme={theme}
              onSelectForWorkshop={onSelectForWorkshop}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function InstThemeCard({ theme, onSelectForWorkshop }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full"
    >
      <div className="flex-1 flex flex-col">
        {theme.image && !imageError && (
          <div className="h-48 w-full relative overflow-hidden bg-surface-container shrink-0">
            <img
              src={theme.image}
              alt={theme.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
            <span
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                padding: '3px 10px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: '#1a1817',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                zIndex: 5,
              }}
            >
              {theme.region}
            </span>
            <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-primary text-on-primary text-[10px] font-bold shadow-xs z-10">
              {theme.target}
            </span>
          </div>
        )}

        <div className="p-6 space-y-3 flex-1 flex flex-col">
          {(!theme.image || imageError) && (
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface text-[10px] font-label-caps font-bold">
                {theme.region}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-primary text-on-primary text-[10px] font-bold shadow-xs">
                {theme.target}
              </span>
            </div>
          )}

          <h3 className="font-headline-sm text-xl font-bold text-on-surface">
            {theme.name}
          </h3>

          {theme.pedagogyFocus && (
            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-xs">
              <strong className="text-on-surface">Background: </strong>
              <span className="text-on-surface-variant">{theme.pedagogyFocus}</span>
            </div>
          )}

          <p className="text-body-sm text-on-surface-variant italic">
            "{theme.quote}"
          </p>

          {theme.materialsKit && (
            <div className="text-xs text-outline mt-auto">
              <strong>Materials:</strong> {theme.materialsKit}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 px-6 border-t border-outline-variant/20 bg-surface-container-low/40 flex items-center justify-between mt-auto">
        <span className="text-xs text-outline font-semibold">Institutional Pack</span>
        <button
          type="button"
          onClick={() => onSelectForWorkshop(theme.name.split(' ')[0])}
          className="px-4 py-2 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
        >
          <span>Book This Tradition</span>
          <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
