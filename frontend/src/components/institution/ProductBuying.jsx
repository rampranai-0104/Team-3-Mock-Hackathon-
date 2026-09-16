import React, { useEffect, useState } from 'react';
import publicService from '../../services/publicService';
import institutionService from '../../services/institutionService';

function mapProductToSouvenir(raw) {
  return {
    id: raw._id,
    title: raw.title || raw.name || 'Handcrafted Artifact',
    tradition: raw.artFormId?.name || 'Traditional Craft',
    unitPrice: Number(raw.price) || 0,
    image: raw.images?.[0]?.url || raw.media?.[0]?.url || '',
    description: raw.description || 'A handcrafted piece from a verified artisan.',
  };
}

export default function ProductBuying() {
  const [souvenirs, setSouvenirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [shippingAddress, setShippingAddress] = useState(null);

  const [rfqDossierModal, setRfqDossierModal] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [orderConfirmation, setOrderConfirmation] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await publicService.getProducts();
        const list = Array.isArray(res?.data) ? res.data : [];
        const mapped = list.map(mapProductToSouvenir);
        if (mounted) {
          setSouvenirs(mapped);
          const initialQty = {};
          mapped.forEach((item) => { initialQty[item.id] = 0; });
          setQuantities(initialQty);
        }
      } catch (err) {
        if (mounted) setError(err.message || 'Unable to load the procurement catalog right now.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Use the institution's real on-file address for shipping, if set.
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await institutionService.getProfile();
        if (mounted) setShippingAddress(res?.data?.address || null);
      } catch (err) {
        console.info('No institution address on file yet:', err.message);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleQtyChange = (id, val) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, parseInt(val, 10) || 0)
    }));
  };

  // Calculate dynamic subtotal
  const rawSubtotal = souvenirs.reduce((acc, item) => {
    const qty = quantities[item.id] || 0;
    return acc + (item.unitPrice * qty);
  }, 0);

  // Total quantity count for volume discount
  const totalItemsCount = Object.values(quantities).reduce((a, b) => a + b, 0);
  const discountRate = totalItemsCount >= 100 ? 0.08 : totalItemsCount >= 50 ? 0.05 : 0;
  const discountAmount = Math.round(rawSubtotal * discountRate);
  const finalTotal = rawSubtotal - discountAmount;

  const handleCreateBulkOrder = async () => {
    setIsSubmittingOrder(true);
    setOrderError(null);
    try {
      const activeItems = souvenirs
        .filter(item => (quantities[item.id] || 0) > 0)
        .map(item => ({
          productId: item.id,
          title: item.title,
          price: item.unitPrice,
          quantity: quantities[item.id],
          image: item.image
        }));

      if (activeItems.length === 0) {
        setOrderError('Add at least one item before placing the order.');
        return;
      }

      const res = await institutionService.createOrder({
        items: activeItems,
        shippingAddress: shippingAddress || {},
      });
      const orderNum = res?.data?.orderNumber || 'Pending';
      setOrderConfirmation(orderNum);
    } catch (err) {
      setOrderError(err.message || 'Order placement failed. Please try again.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <span className="font-label-caps text-xs text-primary font-bold uppercase tracking-widest block mb-1">
            Section 5 • Institutional Procurement
          </span>
          <h2 className="font-headline-md text-2xl lg:text-3xl font-bold text-on-surface">
            Bulk Corporate Gifting
          </h2>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Handcrafted artifacts and executive souvenirs direct from verified artisans, for bulk institutional orders.
          </p>
        </div>
      </div>

      {loading && (
        <div className="text-center py-12 text-on-surface-variant">
          <p className="font-headline-sm text-base">Loading procurement catalog…</p>
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-12 text-error">
          <p className="font-headline-sm text-base">{error}</p>
        </div>
      )}

      {!loading && !error && souvenirs.length === 0 && (
        <div className="text-center py-12 text-on-surface-variant">
          <p className="font-headline-sm text-base">No published products available for bulk procurement yet.</p>
        </div>
      )}

      {!loading && !error && souvenirs.length > 0 && (
        <>
          {/* Souvenirs Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {souvenirs.map((item) => {
              const qty = quantities[item.id] || 0;
              return (
                <SouvenirCard
                  key={item.id}
                  item={item}
                  qty={qty}
                  onQtyChange={handleQtyChange}
                />
              );
            })}
          </div>

          {/* BULK QUOTATION SUMMARY — real quantities × real prices, with a client-side volume discount */}
          <section className="rounded-2xl bg-surface-container-high p-6 lg:p-8 border border-outline-variant/30 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
              <div>
                <span className="text-[10px] font-label-caps text-primary uppercase font-bold tracking-wider block">
                  Bulk Quotation
                </span>
                <h3 className="font-headline-sm text-xl font-bold text-on-surface mt-0.5">
                  Institutional Quotation Estimate ({totalItemsCount} Total Units)
                </h3>
              </div>

              {discountRate > 0 && (
                <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold self-start lg:self-auto">
                  {(discountRate * 100)}% Volume Discount Applied
                </span>
              )}
            </div>

            <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 max-w-xs">
              <span className="text-[10px] font-label-caps text-outline uppercase font-semibold block">Total Estimated Quote</span>
              <span className="font-headline-sm text-2xl font-bold text-primary">
                ₹{finalTotal.toLocaleString('en-IN')}
              </span>
              {discountAmount > 0 && (
                <span className="text-[11px] text-secondary block mt-0.5">
                  Saved ₹{discountAmount.toLocaleString('en-IN')} with bulk slab
                </span>
              )}
            </div>

            {/* Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <button
                type="button"
                disabled={totalItemsCount === 0}
                onClick={() => { setOrderConfirmation(null); setOrderError(null); setRfqDossierModal(true); }}
                className="px-6 py-3 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_cart_checkout</span>
                <span>Review & Place Order</span>
              </button>
            </div>
          </section>
        </>
      )}

      {/* Order Review Modal */}
      {rfqDossierModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">fact_check</span>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface">Review Bulk Order</h3>
              </div>
              <button
                onClick={() => setRfqDossierModal(false)}
                className="p-1 rounded-full text-outline hover:text-on-surface hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {orderConfirmation ? (
                <div className="p-3.5 rounded-xl bg-secondary-container/60 text-on-secondary-container space-y-1">
                  <p className="font-bold text-sm">Order #{orderConfirmation} Placed</p>
                  <p>Your institutional purchase order has been recorded.</p>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-surface-container-low space-y-1.5">
                  {souvenirs.filter((item) => (quantities[item.id] || 0) > 0).map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.title} ({quantities[item.id]} units):</span>
                      <strong>₹{(item.unitPrice * quantities[item.id]).toLocaleString('en-IN')}</strong>
                    </div>
                  ))}
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-secondary pt-1 border-t border-outline-variant/20">
                      <span>Volume Discount:</span>
                      <strong>-₹{discountAmount.toLocaleString('en-IN')}</strong>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-primary pt-2 border-t border-outline-variant/30">
                    <span>Grand Total:</span>
                    <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}

              {orderError && (
                <p className="text-error text-[11px]">{orderError}</p>
              )}
            </div>

            <div className="p-4 px-6 border-t border-outline-variant/30 bg-surface-container-low flex justify-end items-center">
              <button
                type="button"
                disabled={isSubmittingOrder || !!orderConfirmation}
                onClick={handleCreateBulkOrder}
                className="px-5 py-2 rounded-full bg-primary text-on-primary text-xs font-semibold shadow-xs disabled:opacity-60"
              >
                {isSubmittingOrder ? 'Placing Order…' : orderConfirmation ? 'Order Placed' : 'Confirm Purchase Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SouvenirCard({ item, qty, onQtyChange }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div>
        {item.image && !imageError && (
          <div className="h-48 w-full relative overflow-hidden bg-surface-container p-3 flex items-center justify-center">
            <img
              src={item.image}
              alt=""
              onError={() => setImageError(true)}
              className="w-full h-full object-cover rounded-xl shadow-xs"
            />
          </div>
        )}

        <div className="p-5 space-y-2">
          <span className="text-[10px] font-label-caps text-outline uppercase font-semibold block">
            {item.tradition}
          </span>

          <h3 className="font-headline-sm text-base font-bold text-on-surface">
            {item.title}
          </h3>
          <p className="text-body-sm text-on-surface-variant line-clamp-2">
            {item.description}
          </p>

          <div className="pt-2 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-label-caps text-outline uppercase block">Unit Price</span>
              <span className="font-headline-sm text-lg font-bold text-primary">
                ₹{item.unitPrice.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-label-caps text-outline uppercase block">Item Subtotal</span>
              <span className="font-headline-sm text-sm font-bold text-on-surface">
                ₹{(item.unitPrice * qty).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quantity Stepper */}
      <div className="p-4 px-5 border-t border-outline-variant/20 bg-surface-container-low/50 flex items-center justify-between">
        <span className="text-xs text-outline font-semibold">Bulk Requisition Qty</span>

        <div className="flex items-center gap-2 bg-surface-container px-2 py-1 rounded-full border border-outline-variant/30">
          <button
            type="button"
            onClick={() => onQtyChange(item.id, qty - 5)}
            className="w-6 h-6 rounded-full bg-surface text-on-surface hover:bg-primary hover:text-white flex items-center justify-center text-xs font-bold transition-colors"
          >
            -
          </button>
          <input
            type="number"
            min={0}
            value={qty}
            onChange={(e) => onQtyChange(item.id, e.target.value)}
            className="w-12 text-center text-xs font-bold bg-transparent text-on-surface focus:outline-none"
          />
          <button
            type="button"
            onClick={() => onQtyChange(item.id, qty + 5)}
            className="w-6 h-6 rounded-full bg-surface text-on-surface hover:bg-primary hover:text-white flex items-center justify-center text-xs font-bold transition-colors"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
