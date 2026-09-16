import React from 'react';

export default function ArtworkDetailModal({ product, onClose, onAddToCart }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image & Mat */}
          <div className="p-6 bg-surface-container-low flex flex-col items-center justify-center border-r border-outline-variant/20">
            <div className="p-3 bg-surface-container-high/40 rounded-xl border border-outline-variant/30 shadow-inner">
              <img 
                src={product.image} 
                alt={product.title}
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            </div>
            <span className="text-[10px] font-label-caps text-outline uppercase font-semibold mt-3">
              Certified Master Guildpiece
            </span>
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-label-caps font-bold">
                  {product.tradition}
                </span>
                <button 
                  onClick={onClose}
                  className="p-1 rounded-full text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <h3 className="font-headline-sm text-xl font-bold text-on-surface">
                {product.title}
              </h3>
              <p className="text-xs text-primary font-semibold mt-0.5">Master: {product.artist}</p>

              <div className="space-y-2 mt-4 text-xs text-on-surface-variant">
                <p><strong>Medium:</strong> {product.medium}</p>
                <p><strong>Dimensions:</strong> {product.dimensions}</p>
                <p><strong>GI Authentication:</strong> Certified Intangible Cultural Heritage Registry</p>
                <p><strong>Stock Availability:</strong> {product.inStock} original signed pieces</p>
              </div>

              {/* Direct Royalty Pledge */}
              <div className="mt-4 p-3 rounded-xl bg-primary-fixed/30 border border-primary/20 text-xs text-on-primary-fixed-variant">
                <div className="flex items-center gap-1.5 font-bold mb-0.5 text-primary">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>100% Direct-to-Artisan Escrow</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {product.royaltyPledge}
                </p>
              </div>
            </div>

            <div className="pt-5 border-t border-outline-variant/20 flex items-center justify-between mt-4">
              <div>
                <span className="text-[10px] font-label-caps text-outline uppercase block">Price</span>
                <span className="font-headline-sm text-2xl font-bold text-primary">
                  {product.formattedPrice}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">local_mall</span>
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
