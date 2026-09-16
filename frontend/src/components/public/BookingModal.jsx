import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function BookingModal({ workshop, onClose, onConfirmBooking }) {
  const { user } = useAuth();
  const [ticketCount, setTicketCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedPass, setConfirmedPass] = useState(null);

  if (!workshop) return null;

  const basePriceNum = parseInt(String(workshop.price).replace(/[^\d]/g, ''), 10) || 0;
  const totalAmount = basePriceNum * ticketCount;
  const maxSeats = typeof workshop.availableSeats === 'number' && workshop.availableSeats > 0
    ? Math.min(workshop.availableSeats, 5)
    : 5;

  const handleBooking = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Booking confirmation (bookingCode, status) comes back from the real
    // POST /bookings call in the parent handler; this local object just
    // carries what the user selected here for the confirmation screen.
    const bookedData = {
      ...workshop,
      ticketCount,
      totalPaid: `₹${totalAmount.toLocaleString('en-IN')}`,
    };

    setConfirmedPass(bookedData);
    setIsSubmitting(false);
    onConfirmBooking(bookedData);
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
                {confirmedPass ? 'Booking Submitted' : 'Reserve a Seat'}
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
          /* Confirmation Screen */
          <div className="p-6 text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[32px]">check_circle</span>
            </div>

            <div>
              <h3 className="font-headline-sm text-xl font-bold text-on-surface mt-2">
                Booking Confirmed!
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">
                Your booking has been added to <strong>My Activity &gt; My Bookings</strong>.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-container text-xs text-left space-y-1">
              <p><strong>Workshop:</strong> {confirmedPass.title}</p>
              <p><strong>Date &amp; Time:</strong> {confirmedPass.date} • {confirmedPass.time}</p>
              <p><strong>Instructor:</strong> {confirmedPass.instructor}</p>
              <p><strong>Seats Booked:</strong> {confirmedPass.ticketCount}</p>
              <p><strong>Total Paid:</strong> {confirmedPass.totalPaid}</p>
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
              <p className="text-xs text-primary font-medium mt-1">Instructor: {workshop.instructor}</p>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-xs text-on-surface-variant">
              Booking as <strong className="text-on-surface">{user?.name || 'you'}</strong>
              {user?.email ? ` (${user.email})` : ''}
            </div>

            <div className="space-y-3">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-[11px] font-label-caps text-outline uppercase font-semibold mb-1">
                    Seats
                  </label>
                  <select
                    value={ticketCount}
                    onChange={(e) => setTicketCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {Array.from({ length: maxSeats }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n} Seat{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-[11px] font-label-caps text-outline uppercase font-semibold mb-1">
                    Price Per Seat
                  </label>
                  <div className="px-3 py-2 rounded-lg bg-surface-container-low text-xs font-bold text-on-surface border border-outline-variant/20">
                    {workshop.price}
                  </div>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="pt-3 border-t border-outline-variant/20 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-label-caps text-outline uppercase font-semibold block">Total</span>
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
                    <span>Booking...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Booking</span>
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
