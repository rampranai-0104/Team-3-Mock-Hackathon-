import React, { useState } from 'react';

export default function MyActivity({
  followedArtists = [],
  onUnfollowArtist,
  bookings = [],
  orders = []
}) {
  const [activeActivityTab, setActiveActivityTab] = useState('followed'); // 'followed' | 'bookings' | 'orders'

  return (
    <div className="space-y-6">
      {/* Header & Sub-Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <span className="font-label-caps text-xs text-primary font-bold uppercase tracking-widest block mb-1">
            Section 4 • Personal Sanctuary
          </span>
          <h2 className="font-headline-md text-2xl lg:text-3xl font-bold text-on-surface">
            My Activity &amp; Stewardship
          </h2>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Manage followed master custodians, view your workshop bookings, and track your marketplace orders.
          </p>
        </div>

        {/* 3 Sub-Tabs from WhatsApp Image 1 */}
        <div className="inline-flex rounded-full bg-surface-container p-1 border border-outline-variant/30 self-start md:self-auto overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveActivityTab('followed')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeActivityTab === 'followed'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">groups</span>
            <span>Followed Artists ({followedArtists.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveActivityTab('bookings')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeActivityTab === 'bookings'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">confirmation_number</span>
            <span>My Bookings ({bookings.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveActivityTab('orders')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeActivityTab === 'orders'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>My Orders ({orders.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: FOLLOWED ARTISTS */}
      {activeActivityTab === 'followed' && (
        <div className="space-y-4">
          {followedArtists.length === 0 ? (
            <div className="text-center py-12 bg-surface-container-low rounded-2xl border border-outline-variant/20">
              <span className="material-symbols-outlined text-outline text-[40px] mb-2">person_off</span>
              <h3 className="font-headline-sm text-base font-bold text-on-surface">No Followed Artists Yet</h3>
              <p className="text-xs text-on-surface-variant mt-1">Visit "2. Explore Artists" to follow master practitioners and receive direct atelier updates.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {followedArtists.map((artist) => (
                <FollowedArtistCard
                  key={artist.id}
                  artist={artist}
                  onUnfollowArtist={onUnfollowArtist}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY BOOKINGS */}
      {activeActivityTab === 'bookings' && (
        <div className="space-y-6">
          {bookings.length === 0 ? (
            <div className="text-center py-12 bg-surface-container-low rounded-2xl border border-outline-variant/20">
              <span className="material-symbols-outlined text-outline text-[40px] mb-2">event_busy</span>
              <h3 className="font-headline-sm text-base font-bold text-on-surface">No Bookings Yet</h3>
              <p className="text-xs text-on-surface-variant mt-1">Book a workshop from "3. Upcoming Events" to see your pass here.</p>
            </div>
          ) : bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-surface-container-low rounded-2xl p-6 lg:p-8 border border-outline-variant/30 shadow-sm"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    <span className="font-label-caps text-xs text-secondary uppercase font-bold tracking-wider">
                      {booking.status === 'confirmed' ? 'Booking Confirmed' : booking.status}
                    </span>
                    {booking.passId && (
                      <span className="px-3 py-1 rounded-full bg-surface-container-lowest text-on-surface text-xs font-bold shadow-2xs">
                        Booking Code: {booking.passId}
                      </span>
                    )}
                  </div>

                  <h3 className="font-headline-md text-2xl font-bold text-on-surface">
                    {booking.title}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-on-surface-variant">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-primary">calendar_month</span>
                      <span>{booking.date} • {booking.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-primary">location_on</span>
                      <span>{booking.location}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex items-center gap-6 text-xs">
                    <div>
                      <span className="font-bold text-on-surface block">Seats</span>
                      <span className="text-on-surface-variant">{booking.seats}</span>
                    </div>
                    <div>
                      <span className="font-bold text-on-surface block">Amount Paid</span>
                      <span className="text-on-surface-variant">{booking.amount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: MY ORDERS */}
      {activeActivityTab === 'orders' && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-surface-container-low rounded-2xl border border-outline-variant/20">
              <span className="material-symbols-outlined text-outline text-[40px] mb-2">local_mall</span>
              <h3 className="font-headline-sm text-base font-bold text-on-surface">No Orders Yet</h3>
              <p className="text-xs text-on-surface-variant mt-1">Acquire an artwork from "5. Marketplace" to see your order here.</p>
            </div>
          ) : orders.map((order) => (
            <div
              key={order.id}
              className="bg-surface-container-low rounded-2xl p-6 lg:p-8 border border-outline-variant/30 shadow-sm"
            >
              {/* Top Order Ribbon */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-outline-variant/30">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-label-caps text-xs text-primary uppercase font-bold tracking-wider">
                    {order.status}
                  </span>
                  <span className="text-outline text-xs">•</span>
                  <span className="font-headline-sm text-sm font-bold text-on-surface">{order.orderNumber}</span>
                </div>
                <span className="text-xs text-outline">Ordered on {order.orderDate}</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Artwork Plinth */}
                <OrderArtworkPlinth order={order} />

                {/* Order Line Items */}
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <h4 className="font-headline-sm text-lg font-bold text-on-surface">
                      Order Items
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 text-xs">
                        <span className="text-on-surface font-medium">{item.title} × {item.quantity}</span>
                        <span className="text-on-surface-variant">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-between text-xs">
                    <span className="text-on-surface-variant">Subtotal: {order.subtotal} + Shipping: {order.shipping}</span>
                    <span className="font-bold text-on-surface">Total: {order.amount}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FollowedArtistCard({ artist, onUnfollowArtist }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-3">
          {artist.avatar && !imageError ? (
            <img
              src={artist.avatar}
              alt=""
              onError={() => setImageError(true)}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary/30 flex-shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg flex-shrink-0 ring-2 ring-primary/30">
              {artist.name ? artist.name[0] : 'A'}
            </div>
          )}
          <div className="min-w-0">
            <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-label-caps font-bold truncate inline-block">
              {artist.tradition}
            </span>
            <h4 className="font-headline-sm text-base font-bold text-on-surface truncate mt-0.5">
              {artist.name}
            </h4>
            <p className="text-[11px] text-outline truncate">{artist.region}</p>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-surface-container-low text-xs space-y-1 mb-3">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span>Current Status:</span>
            <span className="font-semibold text-primary">{artist.status}</span>
          </div>
          <div className="flex items-center justify-between text-outline text-[11px]">
            <span>Clan Lineage:</span>
            <span>{artist.clan}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-outline-variant/20">
        <button
          type="button"
          onClick={() => alert(`Commission inquiry dialogue opened with ${artist.name}'s cooperative coordinator.`)}
          className="flex-1 py-1.5 px-3 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors"
        >
          Inquire / Commission
        </button>
        <button
          type="button"
          onClick={() => onUnfollowArtist(artist.id)}
          className="py-1.5 px-3 rounded-full text-outline hover:text-error hover:bg-error/10 text-xs font-medium transition-colors"
          title="Unfollow"
        >
          Unfollow
        </button>
      </div>
    </div>
  );
}

function OrderArtworkPlinth({ order }) {
  const [imageError, setImageError] = useState(false);
  const firstItem = order.items?.[0];

  return (
    <div className="lg:col-span-5 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-sm text-center">
      <div className="p-3 bg-surface-container-high/40 rounded-xl border border-outline-variant/30 shadow-inner">
        {order.image && !imageError ? (
          <img
            src={order.image}
            alt=""
            onError={() => setImageError(true)}
            className="w-full h-64 object-cover rounded-lg shadow-md"
          />
        ) : (
          <div className="w-full h-64 rounded-lg bg-surface-container flex flex-col items-center justify-center text-outline gap-2">
            <span className="material-symbols-outlined text-[36px]">palette</span>
            <span className="text-xs font-medium">Acquired Heritage Piece</span>
          </div>
        )}
      </div>
      <h4 className="font-headline-sm text-base font-bold text-on-surface mt-3">
        {firstItem?.title || 'Order'}
      </h4>

      <div className="mt-3 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs">
        <span className="text-outline">Total Paid: <strong className="text-on-surface">{order.amount}</strong></span>
      </div>
    </div>
  );
}
