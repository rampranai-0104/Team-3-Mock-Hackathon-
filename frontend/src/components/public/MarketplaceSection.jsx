import React, { useEffect, useState } from 'react';
import { Handshake, ShoppingCart, ArrowRight } from 'lucide-react';
import publicService from '../../services/publicService';
import { formatINR } from '../../utils/formatters';

export default function MarketplaceSection({ onAddToCart }) {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await publicService.getProducts();
        const list = Array.isArray(res?.data) ? res.data : [];
        if (mounted) setArtworks(list.slice(0, 3));
      } catch (err) {
        if (mounted) setError(err.message || 'Unable to load the marketplace right now.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <section className="section-padding" id="marketplace">
      <div className="container-max">
        {/* Marketplace Header & Ethical Royalty Charter Callout */}
        <div className="p-6 md:p-8 rounded-2xl bg-surface-container-high mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Handshake className="w-5 h-5 text-primary" />
              <span className="font-label-caps text-primary">Sovereign Remuneration Model</span>
            </div>
            <h2 className="font-headline-lg text-on-surface">The Living Marketplace</h2>
            <p className="font-body-md text-on-surface-variant max-w-2xl">
              Acquire one-of-a-kind, registered original artworks directly from verified artisans.
            </p>
          </div>
        </div>

        {loading && (
          <p className="font-body-sm text-on-surface-variant">Loading curated originals…</p>
        )}

        {!loading && error && (
          <p className="font-body-sm" style={{ color: 'var(--color-error, #b3261e)' }}>{error}</p>
        )}

        {!loading && !error && artworks.length === 0 && (
          <p className="font-body-sm text-on-surface-variant">No published artworks yet — check back soon.</p>
        )}

        {/* Artwork Gallery Grid (3 Columns Museum Format) */}
        {!loading && !error && artworks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artworks.map((art) => {
              const image = art.images?.[0]?.url || art.media?.[0]?.url || '';
              const title = art.title || art.name;
              const artistName = art.artistId?.displayName || 'Verified Artisan';

              return (
                <div
                  key={art._id}
                  className="group bg-surface-container-low rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="p-4 pb-0">
                    {/* Passe-Partout Archival Mat Frame */}
                    <div className="p-3 bg-surface-container rounded-xl">
                      <div className="marketplace-card-image rounded-lg relative">
                        {image && (
                          <img
                            src={image}
                            alt={title}
                            className="shadow-inner group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        )}
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface font-label-caps text-[9px] font-semibold z-10">
                          {artistName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div>
                      <span className="font-label-caps text-[10px] text-outline block mb-1">
                        {art.artFormId?.name || art.category}
                      </span>
                      <h3 className="font-headline-sm text-title-lg text-on-surface group-hover:text-primary transition-colors">
                        {title}
                      </h3>
                      <p className="font-body-sm text-on-surface-variant mt-1">
                        Artist: {artistName}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="my-4 p-2.5 rounded-xl bg-surface-container flex items-center justify-between text-body-sm">
                      <span className="font-title-md text-on-surface font-bold">
                        {formatINR(art.price)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onAddToCart && onAddToCart({ ...art, title, artist: artistName, image })}
                      className="w-full py-3 rounded-full bg-on-surface text-surface hover:bg-primary font-label-md transition-colors flex items-center justify-center gap-2 add-cart-trigger"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Marketplace Bottom Curator Note */}
        <div className="mt-10 text-center">
          <a
            href="#marketplace"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-on-primary hover:bg-primary-container font-label-lg shadow-md transition-all"
          >
            <span>View All Curated Originals</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
