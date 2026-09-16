import React, { useState } from 'react';

export default function BookingModal({ workshop, onClose, onConfirmBooking }) {
  const [attendeeName, setAttendeeName] = useState('Aarav Mehta');
  const [attendeeEmail, setAttendeeEmail] = useState('aarav.mehta@heritage.org');
  const [ticketCount, setTicketCount] = useState(1);
  const [includePrepKit, setIncludePrepKit] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedPass, setConfirmedPass] = useState(null);

  if (!workshop) return null;

  const basePriceNum = parseInt(workshop.price.replace(/[^\d]/g, ''), 10) || 1850;
  const kitPrice = includePrepKit ? 480 : 0;
  const totalAmount = (basePriceNum + kitPrice) * ticketCount;

  const handleBooking = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newPassId = `${workshop.tradition.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const bookedData = {
        ...workshop,
        passId: newPassId,
        confirmed: true,
        attendeeName,
        ticketCount,
        totalPaid: `₹${totalAmount.toLocaleString('en-IN')}`,
        prepKitStatus: includePrepKit 
          ? 'Artisan Guild Packing Kit in Atelier' 
          : 'Digital-Only Access Selected'
      };

      setConfirmedPass(bookedData);
      setIsSubmitting(false);
      onConfirmBooking(bookedData);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary text-[24px]">confirmation_number</span>
            <div>
              <h2 className="font-headline-sm text-lg font-bold text-on-surface">
                {confirmedPass ? 'Immersion Pass Issued' : 'Reserve Immersion Pass'}
              </h2>
              <span className="text-xs text-outline">{workshop.tradition}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {confirmedPass ? (
          /* Confirmation Pass Screen with QR Code */
          <div className="p-6 text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[32px]">check_circle</span>
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-label-caps font-bold">
                PASS ID #{confirmedPass.passId}
              </span>
              <h3 className="font-headline-sm text-xl font-bold text-on-surface mt-2">
                Booking Confirmed!
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">
                Your pass has been added to <strong>My Activity &gt; My Bookings</strong>.
              </p>
            </div>

            {/* QR Code Plinth */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 inline-block shadow-inner">
              <svg className="w-32 h-32 mx-auto text-on-surface" viewBox="0 0 100 100" fill="currentColor">
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
              <span className="text-[10px] font-label-caps text-outline block mt-2">AUTHENTICATED GUILD TOKEN</span>
            </div>

            <div className="p-3 rounded-xl bg-surface-container text-xs text-left space-y-1">
              <p><strong>Workshop:</strong> {confirmedPass.title}</p>
              <p><strong>Date & Time:</strong> {confirmedPass.date} • {confirmedPass.time}</p>
              <p><strong>Lead Master:</strong> {confirmedPass.instructor}</p>
              <p><strong>Material Kit:</strong> {confirmedPass.prepKitStatus}</p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-full bg-primary text-on-primary text-xs font-semibold shadow-sm hover:bg-primary-container transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleBooking} className="p-6 space-y-4">
            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
              <h3 className="font-headline-sm text-sm font-bold text-on-surface">{workshop.title}</h3>
              <p className="text-xs text-outline mt-0.5">{workshop.date} • {workshop.time}</p>
              <p className="text-xs text-primary font-medium mt-1">Instructor: {workshop.instructor} ({workshop.instructorRole})</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-label-caps text-outline uppercase font-semibold mb-1">
                  Patron Name
                </label>
                <input
                  type="text"
                  required
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-label-caps text-outline uppercase font-semibold mb-1">
                  Email Address for Pass Credentials
                </label>
                <input
                  type="email"
                  required
                  value={attendeeEmail}
                  onChange={(e) => setAttendeeEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-[11px] font-label-caps text-outline uppercase font-semibold mb-1">
                    Passes (Seats)
                  </label>
                  <select
                    value={ticketCount}
                    onChange={(e) => setTicketCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value={1}>1 Seat (Individual)</option>
                    <option value={2}>2 Seats (Duo)</option>
                    <option value={3}>3 Seats (Family)</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-[11px] font-label-caps text-outline uppercase font-semibold mb-1">
                    Base Pass Fee
                  </label>
                  <div className="px-3 py-2 rounded-lg bg-surface-container-low text-xs font-bold text-on-surface border border-outline-variant/20">
                    {workshop.price} / person
                  </div>
                </div>
              </div>

              {/* Prep Kit Checkbox */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includePrepKit}
                  onChange={(e) => setIncludePrepKit(e.target.checked)}
                  className="mt-0.5 rounded text-primary focus:ring-primary"
                />
                <div className="text-xs">
                  <span className="font-semibold text-on-surface block">Courier Ancestral Artisan Material Kit (+₹480)</span>
                  <span className="text-outline text-[11px] block mt-0.5">
                    Includes {workshop.kitDetails}. Shipped directly from the artisan's forest atelier.
                  </span>
                </div>
              </label>
            </div>

            {/* Price Summary */}
            <div className="pt-3 border-t border-outline-variant/20 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-label-caps text-outline uppercase font-semibold block">Total Direct Escrow Remuneration</span>
                <span className="font-headline-sm text-lg font-bold text-primary">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                    <span>Issuing Pass...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm &amp; Issue Pass</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
