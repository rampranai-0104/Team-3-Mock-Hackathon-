import React, { useState } from 'react';
import { myArtworkOrders } from '../../data/mockData';

export default function MyActivity({ 
  followedArtists, 
  onUnfollowArtist, 
  bookings, 
  orders = myArtworkOrders 
}) {
  const [activeActivityTab, setActiveActivityTab] = useState('followed'); // 'followed' | 'bookings' | 'orders'
  const [activeQrPass, setActiveQrPass] = useState(null);

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
            Manage followed master custodians, view confirmed immersion passes, and inspect physical NFC provenance orders.
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
                <div
                  key={artist.id}
                  className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={artist.avatar}
                        alt={artist.name}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary/30 flex-shrink-0"
                      />
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
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY BOOKINGS */}
      {activeActivityTab === 'bookings' && (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-surface-container-low rounded-2xl p-6 lg:p-8 border border-outline-variant/30 shadow-sm"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    <span className="font-label-caps text-xs text-secondary uppercase font-bold tracking-wider">
                      Immersion Pass Confirmed
                    </span>
                    <span className="px-3 py-1 rounded-full bg-surface-container-lowest text-on-surface text-xs font-bold shadow-2xs">
                      Pass ID: #{booking.passId}
                    </span>
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

                  {/* Physical Prep-Kit Status Ribbon */}
                  <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex items-start sm:items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-[22px] flex-shrink-0">
                      local_shipping
                    </span>
                    <div className="text-xs">
                      <span className="font-bold text-on-surface">Artisan Material Prep-Kit: </span>
                      <span className="text-primary font-semibold">{booking.prepKitStatus}</span>
                      <p className="text-[11px] text-outline mt-0.5">{booking.kitDetails}</p>
                    </div>
                  </div>
                </div>

                {/* QR Code Pass Plinth */}
                <div className="flex flex-col items-center p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm self-center lg:self-auto min-w-[180px]">
                  <svg className="w-28 h-28 text-on-surface" viewBox="0 0 100 100" fill="currentColor">
                    <rect x="10" y="10" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4"/>
                    <rect x="17" y="17" width="11" height="11" fill="currentColor"/>
                    <rect x="65" y="10" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4"/>
                    <rect x="72" y="17" width="11" height="11" fill="currentColor"/>
                    <rect x="10" y="65" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="4"/>
                    <rect x="17" y="72" width="11" height="11" fill="currentColor"/>
                    <rect x="45" y="15" width="8" height="20" fill="currentColor"/>
                    <rect x="40" y="45" width="20" height="10" fill="currentColor"/>
                    <rect x="65" y="55" width="25" height="8" fill="currentColor"/>
                    <rect x="50" y="70" width="15" height="20" fill="currentColor"/>
                    <circle cx="50" cy="50" r="4" fill="#9f3c16"/>
                  </svg>
                  <span className="text-[10px] font-label-caps text-outline uppercase font-semibold mt-2">
                    TOKEN: #{booking.passId}
                  </span>
                  <button
                    type="button"
                    onClick={() => alert(`Digital Pass #${booking.passId} downloaded for offline verification.`)}
                    className="mt-2 text-xs text-primary font-semibold hover:underline"
                  >
                    Download Pass
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: MY ORDERS & 5-STAGE NFC PROVENANCE STEPPER */}
      {activeActivityTab === 'orders' && (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-surface-container-low rounded-2xl p-6 lg:p-8 border border-outline-variant/30 shadow-sm"
            >
              {/* Top Order Ribbon */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-outline-variant/30">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-label-caps text-xs text-primary uppercase font-bold tracking-wider">
                    Physical Artwork Provenance
                  </span>
                  <span className="text-outline text-xs">•</span>
                  <span className="font-headline-sm text-sm font-bold text-on-surface">{order.orderNumber}</span>
                </div>
                <span className="text-xs text-outline">Ordered on {order.orderDate}</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Artwork Passe-Partout Mat Plinth */}
                <div className="lg:col-span-5 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/30 shadow-sm text-center">
                  <div className="p-3 bg-surface-container-high/40 rounded-xl border border-outline-variant/30 shadow-inner">
                    <img
                      src={order.image}
                      alt={order.title}
                      className="w-full h-64 object-cover rounded-lg shadow-md"
                    />
                  </div>
                  <h4 className="font-headline-sm text-base font-bold text-on-surface mt-3">
                    {order.title}
                  </h4>
                  <p className="text-xs text-outline mt-0.5">{order.dimensions}</p>

                  <div className="mt-3 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                    <span className="text-outline">Paid: <strong className="text-on-surface">{order.amount}</strong></span>
                    <span className="text-secondary font-semibold">100% Escrow Disbursed</span>
                  </div>
                </div>

                {/* 5-Stage Vertical NFC Provenance Audit Tracker */}
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <h4 className="font-headline-sm text-lg font-bold text-on-surface">
                      Cryptographic Provenance Audit Trail
                    </h4>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Physical verification stages recorded on decentralized sovereign artisan ledger.
                    </p>
                  </div>

                  {/* Vertical Stepper */}
                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-outline-variant/40">
                    {order.stepper.map((stepNode) => {
                      const isCompleted = stepNode.status === 'completed';
                      const isInProgress = stepNode.status === 'in_progress';

                      return (
                        <div key={stepNode.step} className="relative flex items-start gap-3">
                          {/* Node Icon */}
                          <div
                            className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                              isCompleted
                                ? 'bg-secondary text-white'
                                : isInProgress
                                ? 'bg-primary text-white ring-4 ring-primary-fixed animate-pulse'
                                : 'bg-surface-container-high text-outline'
                            }`}
                          >
                            {isCompleted ? (
                              <span className="material-symbols-outlined text-[14px]">check</span>
                            ) : (
                              <span className="text-[10px] font-bold">{stepNode.step}</span>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h5 className={`text-xs font-bold ${isCompleted || isInProgress ? 'text-on-surface' : 'text-outline'}`}>
                                {stepNode.title}
                              </h5>
                              <span className="text-[10px] text-outline">{stepNode.date}</span>
                            </div>
                            <p className="text-[11px] text-on-surface-variant mt-0.5">
                              {stepNode.step === 1 && "Payment confirmed via Razorpay Sandbox & escrow locked."}
                              {stepNode.step === 2 && "Traditional cotton substrate stretched on teak frame & coated with sacred organic wash."}
                              {stepNode.step === 3 && `Authenticated with thumb impression & signature of Master ${order.artist}.`}
                              {stepNode.step === 4 && `Embedded tamper-proof physical NFC microchip: ${order.nfcProvenanceTag}.`}
                              {stepNode.step === 5 && "Insured transit via Cultural Courier with temperature & humidity control."}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Physical Token Badge */}
                  <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">nfc</span>
                      <div>
                        <span className="font-bold text-on-surface block">NFC Hardware Tag ID:</span>
                        <code className="text-primary text-[11px]">{order.nfcProvenanceTag}</code>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => alert(`Certificate of Authenticity for Order ${order.orderNumber}\nGI Tag: ${order.giTagNumber}\nMaster Artist: ${order.artist}\nEscrow Verification: 100% Complete`)}
                      className="px-3.5 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">verified_user</span>
                      <span>View Certificate</span>
                    </button>
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
