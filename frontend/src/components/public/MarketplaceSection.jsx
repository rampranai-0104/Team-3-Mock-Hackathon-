import React from 'react';
import { Handshake, ShoppingCart, ArrowRight } from 'lucide-react';
import { MARKETPLACE_ARTWORKS } from '../../data/publicMockData';

export default function MarketplaceSection({ onAddToCart }) {
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
              Acquire one-of-a-kind, registered original artworks directly from the artists. Every transaction provides verifiable on-chain certificates of tribal heritage.
            </p>
          </div>

          {/* Transparent Royalty Breakdown Card */}
          <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex items-center gap-6 shrink-0">
            <div className="flex flex-col">
              <span className="font-display-hero text-headline-sm font-bold text-primary leading-none">
                85%
              </span>
              <span className="font-label-caps text-[10px] text-outline mt-1">
                Direct to Artisan
              </span>
            </div>
            <div className="w-[1px] h-8 bg-outline-variant/40"></div>
            <div className="flex flex-col">
              <span className="font-display-hero text-headline-sm font-bold text-secondary leading-none">
                15%
              </span>
              <span className="font-label-caps text-[10px] text-outline mt-1">
                Cooperative Trust
              </span>
            </div>
          </div>
        </div>

        {/* Artwork Gallery Grid (3 Columns Museum Format) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MARKETPLACE_ARTWORKS.map((art) => (
            <div
              key={art.id}
              className="group bg-surface-container-low rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="p-4 pb-0">
                {/* Passe-Partout Archival Mat Frame */}
                <div className="p-3 bg-surface-container rounded-xl">
                  <div className="marketplace-card-image rounded-lg relative">
                    <img
                      src={art.image}
                      alt={art.title}
                      className="shadow-inner group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface font-label-caps text-[9px] font-semibold z-10">
                      {art.lineageBadge}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div>
                  <span className="font-label-caps text-[10px] text-outline block mb-1">
                    {art.subBadge}
                  </span>
                  <h3 className="font-headline-sm text-title-lg text-on-surface group-hover:text-primary transition-colors">
                    {art.title}
                  </h3>
                  <p className="font-body-sm text-on-surface-variant mt-1">
                    Artist: {art.artist}
                  </p>
                </div>

                {/* Price & Royalty Transparency Pill */}
                <div className="my-4 p-2.5 rounded-xl bg-surface-container flex items-center justify-between text-body-sm">
                  <div>
                    <span className="font-title-md text-on-surface font-bold">
                      {art.price}
                    </span>
                    <span className="text-outline font-label-md ml-1.5">
                      ({art.priceUsd})
                    </span>
                  </div>
                  <span className="font-label-caps text-[10px] text-secondary font-semibold bg-secondary-container px-2 py-0.5 rounded-full">
                    {art.artisanShare}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onAddToCart && onAddToCart(art)}
                  className="w-full py-3 rounded-full bg-on-surface text-surface hover:bg-primary font-label-md transition-colors flex items-center justify-center gap-2 add-cart-trigger"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Acquire With Verified Certificate</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Marketplace Bottom Curator Note */}
        <div className="mt-10 text-center">
          <a
            href="#marketplace"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-on-primary hover:bg-primary-container font-label-lg shadow-md transition-all"
          >
            <span>View All 184 Curated Originals</span>
            <ArrowRight className="w-5 h-5" />
          </a>
          <p className="font-body-sm text-outline mt-3">
            Museum-grade insured worldwide shipping • Custom hand-milled teak framing available
          </p>
        </div>
      </div>
    </section>
  );
}
