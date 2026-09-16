import React, { useState } from 'react';
import ArtworkDetailModal from './ArtworkDetailModal';
import { marketplaceProducts } from '../../data/mockData';

export default function Marketplace({ onAddToCart }) {
  const [selectedTradition, setSelectedTradition] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const traditions = ['All', 'Warli Folk Painting', 'Gond Pardhan Art', 'Mithila / Madhubani', 'Odisha Pattachitra'];

  const filteredProducts = marketplaceProducts.filter(item => {
    const matchesTradition = selectedTradition === 'All' || item.tradition === selectedTradition;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tradition.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTradition && matchesSearch;
  });

  const handleAddToCartWithToast = (product) => {
    onAddToCart(product);
    setToastMessage(`"${product.title}" added to your cart.`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div className="space-y-8 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-on-surface text-surface px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-outline-variant/30 animate-in slide-in-from-bottom-5 duration-300">
          <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <span className="font-label-caps text-xs text-primary font-bold uppercase tracking-widest block mb-1">
            Section 5 • Living Marketplace
          </span>
          <h2 className="font-headline-md text-2xl lg:text-3xl font-bold text-on-surface">
            Certified Original Artworks
          </h2>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Each piece is hand-signed by verified master artisans with non-fungible physical NFC provenance seals and 100% royalty transparency.
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
            placeholder="Search artworks, medium..."
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

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddToCart={handleAddToCartWithToast}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-on-surface-variant">
          <span className="material-symbols-outlined text-outline text-[40px] mb-2">search_off</span>
          <p className="font-headline-sm text-base">No artworks found matching your search</p>
          <button
            onClick={() => { setSelectedTradition('All'); setSearchQuery(''); }}
            className="mt-3 px-4 py-1.5 rounded-full bg-primary text-on-primary text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* CURATORIAL ADVISORY & CUSTOM PATRON COMMISSION CALLOUT */}
      <section className="rounded-2xl bg-surface-container-highest p-6 lg:p-8 border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[26px]">draw</span>
          </div>
          <div>
            <span className="text-[10px] font-label-caps text-primary uppercase font-bold tracking-wider block">
              Bespoke Patronage Service
            </span>
            <h3 className="font-headline-sm text-xl font-bold text-on-surface mt-0.5">
              Curatorial Advisory &bull; Patron Direct Commission
            </h3>
            <p className="text-body-sm text-on-surface-variant mt-1 max-w-xl">
              Seeking an ancestral heirloom canvas, sacred temple scroll, or site-specific architectural mural? Our curatorial council coordinates directly with hereditary guild elders with 100% escrow protection.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => alert("Curatorial Commission Inquiry Form opened for bespoke masterwork requisition.")}
          className="px-6 py-3 rounded-full bg-on-surface hover:bg-primary text-surface font-semibold text-xs transition-colors flex items-center gap-2 flex-shrink-0 shadow-md"
        >
          <span>Initiate Commission Dialogue</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </section>

      {/* Detail Modal */}
      {selectedProduct && (
        <ArtworkDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCartWithToast}
        />
      )}
    </div>
  );
}

function ProductCard({ product, onSelectProduct, onAddToCart }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="group bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div>
        {/* Product Image: completely omitted if fails or unavailable */}
        {product.image && !imageError && (
          <div className="h-56 w-full relative overflow-hidden bg-surface-container p-3 flex items-center justify-center">
            <img
              src={product.image}
              alt=""
              onError={() => setImageError(true)}
              className="w-full h-full object-cover rounded-xl shadow-xs group-hover:scale-105 transition-transform duration-500"
            />
            <span className="absolute top-4 left-4 px-2.5 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface text-[10px] font-label-caps font-bold">
              GI CERTIFIED
            </span>
            <span className="absolute bottom-4 left-4 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px]">
              {product.dimensions}
            </span>
          </div>
        )}

        {/* Product Info */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-label-caps text-outline uppercase font-semibold block">
              {product.tradition}
            </span>
            {(!product.image || imageError) && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-surface-container text-on-surface font-medium">
                {product.dimensions}
              </span>
            )}
          </div>

          <h3 className="font-headline-sm text-base font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
            {product.title}
          </h3>

          <p className="text-xs text-primary font-medium">
            By {product.artist}
          </p>

          <p className="text-[11px] text-on-surface-variant line-clamp-1">
            {product.medium}
          </p>

          {/* Direct-to-artisan assurance badge */}
          <div className="p-2 rounded-lg bg-secondary-container/40 text-[10px] text-on-secondary-container font-medium flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            <span className="truncate">100% Direct Escrow to Artisan</span>
          </div>
        </div>
      </div>

      {/* Price and Cart Button */}
      <div className="p-4 border-t border-outline-variant/20 bg-surface-container-low/40 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-label-caps text-outline uppercase block">Direct Price</span>
          <span className="font-headline-sm text-lg font-bold text-on-surface">
            {product.formattedPrice}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onSelectProduct(product)}
            className="p-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
            title="View Details"
          >
            <span className="material-symbols-outlined text-[16px]">visibility</span>
          </button>

          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className="px-3.5 py-2 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold shadow-xs transition-all flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[15px]">local_mall</span>
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
