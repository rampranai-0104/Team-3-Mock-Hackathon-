import React, { useEffect, useState } from 'react';
import ArtworkDetailModal from './ArtworkDetailModal';
import publicService from '../../services/publicService';
import { formatINR } from '../../utils/formatters';

function mapProduct(raw) {
  const title = raw.title || raw.name || 'Handcrafted Artwork';
  const price = Number(raw.price) || 0;
  return {
    id: raw._id,
    title,
    tradition: raw.artFormId?.name || 'Traditional Craft',
    artist: raw.artistId?.displayName || 'Verified Artisan',
    price,
    priceNumber: price,
    formattedPrice: formatINR(price),
    medium: raw.category || 'Mixed Media',
    inStock: raw.stock ?? 0,
    image: raw.images?.[0]?.url || raw.media?.[0]?.url || '',
  };
}

export default function Marketplace({ onAddToCart }) {
  const [selectedTradition, setSelectedTradition] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await publicService.getProducts();
        const list = Array.isArray(res?.data) ? res.data : [];
        if (mounted) setProducts(list.map(mapProduct));
      } catch (err) {
        if (mounted) setError(err.message || 'Unable to load the marketplace right now.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const traditions = ['All', ...Array.from(new Set(products.map((p) => p.tradition)))];

  const filteredProducts = products.filter(item => {
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
            Original Artworks
          </h2>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Browse original artworks from verified master artisans.
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

      {loading && (
        <div className="text-center py-12 text-on-surface-variant">
          <p className="font-headline-sm text-base">Loading marketplace…</p>
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-12 text-error">
          <p className="font-headline-sm text-base">{error}</p>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && (
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
      )}

      {!loading && !error && filteredProducts.length === 0 && (
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
          </div>
        )}

        {/* Product Info */}
        <div className="p-4 space-y-2">
          <span className="text-[10px] font-label-caps text-outline uppercase font-semibold block">
            {product.tradition}
          </span>

          <h3 className="font-headline-sm text-base font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
            {product.title}
          </h3>

          <p className="text-xs text-primary font-medium">
            By {product.artist}
          </p>

          <p className="text-[11px] text-on-surface-variant line-clamp-1">
            {product.medium}
          </p>
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
