import React, { useState } from 'react';

export default function ArtistBioModal({ artist, onClose, isFollowing, onToggleFollow }) {
  const [imgError, setImgError] = useState(false);
  if (!artist) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header with image */}
        <div className="p-6 bg-surface-container-low border-b border-outline-variant/30 flex items-start gap-4">
          {!imgError && artist.avatar ? (
            <img 
              src={artist.avatar} 
              alt=""
              onError={() => setImgError(true)}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-primary/30 flex-shrink-0 shadow-sm"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center font-headline-sm text-2xl font-bold flex-shrink-0 ring-2 ring-primary/30 shadow-sm">
              {artist.name ? artist.name.charAt(0) : 'A'}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-label-caps font-bold">
                {artist.tradition}
              </span>
              <button 
                onClick={onClose}
                className="p-1 rounded-full text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <h2 className="font-headline-sm text-xl font-bold text-on-surface mt-1">
              {artist.name}
            </h2>
            <p className="text-xs text-outline">{artist.region} • {artist.clan}</p>
            <p className="text-xs text-primary font-semibold mt-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span>{artist.status}</span>
            </p>
          </div>
        </div>

        {/* Biography Body */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-xs font-label-caps text-outline uppercase tracking-wider font-bold mb-1">
              Lineage & Master Apprenticeship
            </h3>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              {artist.bio} With over {artist.experience} of unbroken dedicated studio practice, their works adhere strictly to the non-synthetic natural pigment formulations passed down across generations.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
            <span className="text-[10px] font-label-caps text-outline uppercase font-semibold block">Experience</span>
            <span className="font-headline-sm text-base font-bold text-on-surface">{artist.experience}</span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 px-6 border-t border-outline-variant/30 bg-surface-container-low flex justify-between items-center">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs text-on-surface-variant hover:bg-surface-container font-medium"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => onToggleFollow(artist.id)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all shadow-sm ${
              isFollowing
                ? 'bg-primary text-on-primary'
                : 'bg-on-surface text-surface hover:bg-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isFollowing ? 'check' : 'person_add'}
            </span>
            <span>{isFollowing ? 'Patronage Active' : 'Follow Master Artist'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
