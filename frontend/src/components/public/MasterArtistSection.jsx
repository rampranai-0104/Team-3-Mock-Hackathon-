import React, { useEffect, useState } from 'react';
import { Play, Pause, Heart, Check } from 'lucide-react';
import publicService from '../../services/publicService';

export default function MasterArtistSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await publicService.getArtists();
        const list = Array.isArray(res?.data) ? res.data : [];
        // Spotlight the most experienced verified custodian
        const spotlight = [...list].sort((a, b) => (b.experience || 0) - (a.experience || 0))[0] || null;
        if (mounted) setArtist(spotlight);
      } catch (err) {
        if (mounted) setError(err.message || 'Unable to load master artist spotlight.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <section className="section-padding bg-surface-container-high" id="master-artists">
        <div className="container-max">
          <p className="font-body-sm text-on-surface-variant">Loading master artist spotlight…</p>
        </div>
      </section>
    );
  }

  if (error || !artist) {
    return (
      <section className="section-padding bg-surface-container-high" id="master-artists">
        <div className="container-max">
          <p className="font-body-sm text-on-surface-variant">
            {error || 'No verified master artists published yet — check back soon.'}
          </p>
        </div>
      </section>
    );
  }

  const location = [artist.location?.city, artist.location?.state].filter(Boolean).join(', ') || 'India';
  const studioImage = artist.profileImage || artist.media?.[0]?.url;
  const macroDetailImage = artist.media?.[1]?.url || artist.media?.[0]?.url || studioImage;

  return (
    <section className="section-padding bg-surface-container-high" id="master-artists">
      <div className="container-max">
        {/* Curatorial overline */}
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-[1px] bg-primary"></span>
          <span className="font-label-caps text-primary">Living Master Registry • Spotlight</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Audio Snippet & Bio Focus */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant font-label-md">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span>Verified Master Custodian • {artist.artFormIds?.[0]?.name || 'Living Tradition'}</span>
            </div>

            <h2 className="font-headline-lg text-on-surface">
              {artist.displayName}
            </h2>

            <p className="font-body-lg text-on-surface-variant leading-relaxed">
              {artist.bio || 'A hereditary custodian preserving ancestral techniques and passing them to the next generation of practitioners.'}
            </p>

            {/* Interactive Audio Narrative Snippet Player (illustrative, no backing audio asset in this data model) */}
            <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex items-center gap-4">
              <button
                type="button"
                aria-label="Play Artisan Oral History Snippet"
                onClick={() => setIsPlaying(!isPlaying)}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-105 shrink-0 ${
                  isPlaying ? 'bg-secondary' : 'bg-primary'
                }`}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-body-sm mb-1.5">
                  <span className="font-title-md text-on-surface truncate">
                    Field Recording: Oral Craft Narrative
                  </span>
                </div>

                {/* Audio Waveform Visualization Indicator */}
                <div className={`flex items-center gap-1 h-5 ${isPlaying ? 'audio-playing' : ''}`}>
                  {[12, 20, 8, 16, 20, 12, 16, 8, 20, 14, 6, 16, 18, 10].map((h, i) => (
                    <span
                      key={i}
                      className="audio-bar"
                      style={{
                        height: `${h}px`,
                        opacity: isPlaying ? 1 : 0.45,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Studio Metrics & Direct Connect */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-xl bg-surface-container">
                <span className="font-label-caps text-outline block">Studio Location</span>
                <span className="font-title-md text-on-surface mt-1 block">
                  {location}
                </span>
                <span className="font-body-sm text-on-surface-variant">
                  {artist.languages?.join(', ') || 'Guild Collective'}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-surface-container">
                <span className="font-label-caps text-outline block">Practice Experience</span>
                <span className="font-title-md text-on-surface mt-1 block">
                  {artist.experience || 0} Years
                </span>
                <span className="font-body-sm text-secondary font-semibold">
                  {artist.availability?.isAvailable === false ? 'Fully Booked' : 'Open for Engagements'}
                </span>
              </div>
            </div>

            {/* Artist Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                type="button"
                onClick={() => setIsFollowing(!isFollowing)}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-label-md transition-colors ${
                  isFollowing
                    ? 'bg-primary text-on-primary'
                    : 'bg-on-surface text-surface hover:bg-primary'
                }`}
              >
                {isFollowing ? <Check className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
                <span>{isFollowing ? 'Patronage Active' : 'Follow Artist Patronage'}</span>
              </button>

              <a
                href="#traditions"
                className="font-label-md text-on-surface hover:text-primary transition-colors underline underline-offset-4"
              >
                View Complete Monograph →
              </a>
            </div>
          </div>

          {/* Right: Dual Artwork & Studio Composition */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-7 master-artist-image rounded-2xl shadow-lg bg-surface-container">
              {studioImage && (
                <img
                  src={studioImage}
                  alt={`${artist.displayName} in studio`}
                  loading="lazy"
                />
              )}
            </div>
            <div className="sm:col-span-5 flex flex-col gap-4">
              <div className="master-artist-secondary-image rounded-2xl shadow-md bg-surface-container">
                {macroDetailImage && (
                  <img
                    src={macroDetailImage}
                    alt={`Archival detail from ${artist.displayName}'s work`}
                    loading="lazy"
                  />
                )}
              </div>
              <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-title-md text-on-surface">{artist.displayName}</h4>
                  <p className="font-body-sm text-on-surface-variant mt-1.5 leading-relaxed">
                    {artist.bio || 'A verified master artisan on the Tvarita platform.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
