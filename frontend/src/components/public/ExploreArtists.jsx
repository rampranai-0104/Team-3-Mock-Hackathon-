import React, { useState } from 'react';
import ArtistBioModal from './ArtistBioModal';

export default function ExploreArtists({ artists, followedArtistIds, onToggleFollow }) {
  const [selectedTradition, setSelectedTradition] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalArtist, setActiveModalArtist] = useState(null);

  const traditions = ['All', 'Warli Folk Tradition', 'Gond Pardhan Art', 'Mithila / Madhubani', 'Odisha Pattachitra', 'Sohrai & Khovar Murals'];

  const filteredArtists = artists.filter(artist => {
    const matchesTradition = selectedTradition === 'All' || artist.tradition === selectedTradition;
    const matchesSearch = 
      artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.tradition.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTradition && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <span className="font-label-caps text-xs text-primary font-bold uppercase tracking-widest block mb-1">
            Section 2 • Public Discovery
          </span>
          <h2 className="font-headline-md text-2xl lg:text-3xl font-bold text-on-surface">
            Meet the Master Custodians
          </h2>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Connect directly with verified hereditary practitioners. 100% of follower patronage and commission proceeds reach the artist.
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
            placeholder="Search master artists, clan..."
            className="w-full pl-9 pr-4 py-2 rounded-full bg-surface-container text-xs text-on-surface placeholder:text-outline border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Tradition Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {traditions.map((trad) => (
          <button
            key={trad}
            type="button"
            onClick={() => setSelectedTradition(trad)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedTradition === trad
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            {trad}
          </button>
        ))}
      </div>

      {/* Artists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtists.map((artist) => {
          const isFollowing = followedArtistIds.includes(artist.id);
          const currentFollowers = artist.followersCount + (isFollowing && !artist.isFollowing ? 1 : (!isFollowing && artist.isFollowing ? -1 : 0));

          return (
            <div
              key={artist.id}
              className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Artist Header */}
                <div className="flex items-start gap-3.5 mb-3">
                  <div className="relative flex-shrink-0">
                    <img
                      src={artist.avatar}
                      alt={artist.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-outline-variant/40"
                    />
                    <span 
                      className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-secondary border-2 border-surface-container-lowest flex items-center justify-center"
                      title={artist.status}
                    >
                      <span className="w-2 h-2 rounded-full bg-white"></span>
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-label-caps font-bold truncate inline-block max-w-full">
                      {artist.tradition}
                    </span>
                    <h3 className="font-headline-sm text-lg font-bold text-on-surface truncate mt-1">
                      {artist.name}
                    </h3>
                    <p className="text-[11px] text-outline truncate">{artist.region}</p>
                  </div>
                </div>

                {/* Status and Bio */}
                <div className="mb-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-primary font-medium mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                    <span>{artist.status}</span>
                  </div>
                  <p className="text-body-sm text-on-surface-variant line-clamp-2">
                    {artist.bio}
                  </p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-surface-container-low mb-4 text-center">
                  <div>
                    <span className="text-[10px] font-label-caps text-outline uppercase block">Experience</span>
                    <span className="text-xs font-bold text-on-surface">{artist.experience}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-label-caps text-outline uppercase block">Active Patrons</span>
                    <span className="text-xs font-bold text-primary">{currentFollowers.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setActiveModalArtist(artist)}
                  className="flex-1 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors"
                >
                  Guild Profile
                </button>

                <button
                  type="button"
                  onClick={() => onToggleFollow(artist.id)}
                  className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                    isFollowing
                      ? 'bg-primary text-on-primary'
                      : 'bg-on-surface text-surface hover:bg-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">
                    {isFollowing ? 'check' : 'person_add'}
                  </span>
                  <span>{isFollowing ? 'Following' : 'Follow'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredArtists.length === 0 && (
        <div className="text-center py-12 text-on-surface-variant">
          <span className="material-symbols-outlined text-outline text-[40px] mb-2">person_search</span>
          <p className="font-headline-sm text-base">No master artists found matching your criteria</p>
          <button
            onClick={() => { setSelectedTradition('All'); setSearchQuery(''); }}
            className="mt-3 px-4 py-1.5 rounded-full bg-primary text-on-primary text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Bio Modal */}
      {activeModalArtist && (
        <ArtistBioModal
          artist={activeModalArtist}
          isFollowing={followedArtistIds.includes(activeModalArtist.id)}
          onToggleFollow={onToggleFollow}
          onClose={() => setActiveModalArtist(null)}
        />
      )}
    </div>
  );
}
