import React, { useEffect, useState } from 'react';
import { ArrowRight, Calendar, MapPin, UserCheck, Home } from 'lucide-react';
import publicService from '../../services/publicService';
import { formatINR, formatDate } from '../../utils/formatters';

export default function WorkshopsSection({ onReserve }) {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await publicService.getEvents();
        const list = Array.isArray(res?.data) ? res.data : [];
        if (mounted) setWorkshops(list.slice(0, 2));
      } catch (err) {
        if (mounted) setError(err.message || 'Unable to load workshops right now.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <section className="section-padding bg-surface-container-low" id="workshops">
      <div className="container-max">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-6 h-[1px] bg-primary"></span>
              <span className="font-label-caps text-primary">Masterclass Immersion</span>
            </div>
            <h2 className="font-headline-lg text-on-surface">
              Learn Directly from Lineage Custodians
            </h2>
            <p className="font-body-md text-on-surface-variant">
              Intimate, limited-capacity village retreats and hybrid masterclasses. Hand-gather raw earth pigments, prepare traditional binders, and learn sacred geometric composition.
            </p>
          </div>

          <a
            href="#workshops"
            className="inline-flex items-center gap-1.5 text-primary hover:text-primary-container font-label-lg transition-colors group self-start md:self-auto"
          >
            <span>View Seasonal Calendar</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {loading && (
          <p className="font-body-sm text-on-surface-variant">Loading upcoming workshops…</p>
        )}

        {!loading && error && (
          <p className="font-body-sm" style={{ color: 'var(--color-error, #b3261e)' }}>{error}</p>
        )}

        {!loading && !error && workshops.length === 0 && (
          <p className="font-body-sm text-on-surface-variant">No published workshops at the moment — check back soon.</p>
        )}

        {/* Workshops Grid */}
        {!loading && !error && workshops.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {workshops.map((workshop, idx) => {
              const image = workshop.image?.url || workshop.media?.[0]?.url || '';
              const format = workshop.location?.isOnline ? 'Virtual Format' : 'On-Campus / Atelier';
              const type = workshop.type
                ? `${workshop.type.charAt(0).toUpperCase()}${workshop.type.slice(1)} Session`
                : 'Guild Session';
              const seatsLeft = typeof workshop.availableSeats === 'number'
                ? `${workshop.availableSeats} Seats Left`
                : 'Seats Open';
              const location = workshop.location?.venue || workshop.location?.city || (workshop.location?.isOnline ? 'Online' : 'Venue TBA');

              return (
                <div
                  key={workshop._id}
                  className="workshop-card bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Workshop Image */}
                  <div className="workshop-card-image bg-surface-container relative">
                    {image && <img src={image} alt={workshop.title} loading="lazy" />}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-surface/90 backdrop-blur-md text-on-surface font-label-caps text-[10px] font-semibold">
                        {format}
                      </span>
                    </div>
                  </div>

                  {/* Workshop Content */}
                  <div className="p-6 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className={`font-label-caps text-[11px] font-bold ${
                            idx === 0 ? 'text-primary' : 'text-secondary'
                          }`}
                        >
                          {type}
                        </span>

                        {/* Live Seat Counter Badge */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-md text-[11px] font-bold ${
                            idx === 0
                              ? 'bg-error-container text-on-error-container'
                              : 'bg-secondary-container text-on-secondary-container'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              idx === 0 ? 'bg-error animate-ping' : 'bg-secondary'
                            }`}
                          />
                          <span>{seatsLeft}</span>
                        </span>
                      </div>

                      <h3 className="font-headline-sm text-title-lg lg:text-headline-sm text-on-surface">
                        {workshop.title}
                      </h3>

                      <p className="font-body-sm text-on-surface-variant mt-2 leading-relaxed">
                        {workshop.description}
                      </p>
                    </div>

                    {/* Date & Location Breakdown */}
                    <div className="space-y-1.5 pt-3 border-t border-outline-variant/30">
                      <div className="flex items-center justify-between text-body-sm">
                        <span className="text-on-surface-variant flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-outline" /> {formatDate(workshop.date)}
                        </span>
                        <span className="font-title-md text-on-surface font-semibold">
                          {formatINR(workshop.price)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-body-sm">
                        <span className="text-on-surface-variant flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-outline" /> {location}
                        </span>
                        <span className="text-secondary font-label-md font-semibold">
                          Materials Provided
                        </span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => onReserve && onReserve(workshop)}
                        className={`w-full py-3 rounded-full font-label-md transition-colors flex items-center justify-center gap-2 ${
                          idx === 0
                            ? 'bg-primary text-on-primary hover:bg-primary-container'
                            : 'bg-on-surface text-surface hover:bg-primary'
                        }`}
                      >
                        <span>{idx === 0 ? 'Reserve Immersion Seat' : 'Book Village Residency'}</span>
                        {idx === 0 ? (
                          <UserCheck className="w-4 h-4" />
                        ) : (
                          <Home className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
