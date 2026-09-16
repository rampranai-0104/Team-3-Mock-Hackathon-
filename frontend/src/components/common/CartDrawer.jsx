import React, { useState } from 'react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  isCheckingOut = false,
  checkoutError = null,
}) {
  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface-container-lowest shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-space-lg border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[24px]">local_mall</span>
              <h2 className="font-headline-sm text-lg font-bold text-on-surface">Living Marketplace Cart</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-full text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-space-lg space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant">
                <span className="material-symbols-outlined text-outline text-[48px] mb-2">shopping_bag</span>
                <p className="font-headline-sm text-base">Your cart is currently empty</p>
                <p className="text-body-sm text-outline mt-1">Explore authentic artworks from our master practitioners.</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemoveItem={onRemoveItem}
                />
              ))
            )}
          </div>

          {/* Footer & Checkout summary */}
          {cartItems.length > 0 && (
            <div className="p-space-lg border-t border-outline-variant/30 bg-surface-container-low space-y-3">
              <div className="flex justify-between items-baseline pt-1">
                <span className="font-label-caps text-xs text-outline uppercase font-semibold">Subtotal</span>
                <span className="font-headline-md text-xl font-bold text-on-surface">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>

              {checkoutError && (
                <p className="text-xs text-error">{checkoutError}</p>
              )}

              <button
                type="button"
                disabled={isCheckingOut}
                onClick={() => onCheckout && onCheckout()}
                className="w-full py-3 px-4 rounded-full bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <span>{isCheckingOut ? 'Placing Order…' : 'Proceed to Checkout'}</span>
                {!isCheckingOut && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CartItemRow({ item, onUpdateQuantity, onRemoveItem }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div 
      className="p-3 rounded-xl bg-surface-container-low flex gap-3 border border-outline-variant/20"
    >
      {item.image && !imgError ? (
        <img 
          src={item.image} 
          alt="" 
          onError={() => setImgError(true)}
          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
        />
      ) : (
        <div className="w-20 h-20 rounded-lg bg-surface-container flex items-center justify-center text-outline flex-shrink-0">
          <span className="material-symbols-outlined text-[24px]">palette</span>
        </div>
      )}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h4 className="font-title-lg text-sm font-semibold text-on-surface line-clamp-1">{item.title}</h4>
            <button 
              onClick={() => onRemoveItem(item.id)}
              className="text-outline hover:text-error transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
            </button>
          </div>
          <p className="text-[11px] text-outline">{item.artist} • {item.tradition}</p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 bg-surface-container px-2 py-0.5 rounded-full text-xs">
            <button 
              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
              className="text-on-surface-variant hover:text-on-surface"
            >
              -
            </button>
            <span className="font-semibold px-1">{item.quantity}</span>
            <button 
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="text-on-surface-variant hover:text-on-surface"
            >
              +
            </button>
          </div>
          <span className="font-headline-sm text-sm font-bold text-primary">
            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
}
