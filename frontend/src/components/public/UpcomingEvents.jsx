import React, { useState, useEffect } from 'react';
import BookingModal from './BookingModal';
import publicService from '../../services/publicService';

function mapLearningJourney(raw) {
  const totalModules = raw.modules?.length || 0;
  const totalMinutes = (raw.modules || []).reduce((acc, m) => acc + (m.durationMinutes || 0), 0);
  return {
    id: raw._id,
    title: raw.title,
    tradition: raw.artFormId?.name || 'Traditional Art',
    instructor: raw.artistIds?.[0]?.displayName || 'Guild Faculty',
    level: raw.level ? `${raw.level.charAt(0).toUpperCase()}${raw.level.slice(1)} Immersion` : 'Self-Paced Immersion',
    totalModules,
    // Per-learner progress isn't tracked by the backend LearningJourney model yet,
    // so we surface the course as not-yet-started rather than fabricating progress.
    completedModules: 0,
    progressPercentage: 0,
    currentModule: raw.modules?.[0]?.title || 'Module 1: Introduction',
    nextAction: `Start Lesson: ${raw.modules?.[0]?.title || 'Introduction'}`,
    duration: `${(totalMinutes / 60).toFixed(1)} Hours Content`,
    image: raw.artFormId?.media?.[0]?.url || '',
  };
}

export default function UpcomingEvents({ workshops = [], onBookWorkshop }) {
  const [activeSubTab, setActiveSubTab] = useState('workshops'); // 'workshops' | 'learning'
  const [bookingWorkshop, setBookingWorkshop] = useState(null);
  const [learningJourneys, setLearningJourneys] = useState([]);
  const [learningLoading, setLearningLoading] = useState(false);
  const [learningError, setLearningError] = useState(null);

  // Live countdown timer simulation
  const [countdown, setCountdown] = useState({
    days: 2,
    hours: 14,
    minutes: 42,
    seconds: 18
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeSubTab !== 'learning' || learningJourneys.length > 0) return;
    let mounted = true;
    (async () => {
      try {
        setLearningLoading(true);
        setLearningError(null);
        const res = await publicService.getLearningJourneys();
        const list = Array.isArray(res?.data) ? res.data : [];
        if (mounted) setLearningJourneys(list.map(mapLearningJourney));
      } catch (err) {
        if (mounted) setLearningError(err.message || 'Unable to load learning journeys right now.');
      } finally {
        if (mounted) setLearningLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [activeSubTab, learningJourneys.length]);

  return (
    <div className="space-y-6">
      {/* Header & Sub-Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <span className="font-label-caps text-xs text-primary font-bold uppercase tracking-widest block mb-1">
            Section 3 • Public Engagements
          </span>
          <h2 className="font-headline-md text-2xl lg:text-3xl font-bold text-on-surface">
            Upcoming Events &amp; Learning
          </h2>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Participate in live master practitioner guild workshops or embark on self-paced ancestral art pedagogy.
          </p>
        </div>

        {/* Sub-tab Switcher: Workshops vs Personal Learning */}
        <div className="inline-flex rounded-full bg-surface-container p-1 border border-outline-variant/30 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveSubTab('workshops')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeSubTab === 'workshops'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">palette</span>
            <span>Live Guild Workshops</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('learning')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeSubTab === 'learning'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">menu_book</span>
            <span>Personal Learning</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'workshops' ? (
        /* WORKSHOPS VIEW */
        <div className="space-y-6">
          {workshops.length === 0 ? (
            <div className="text-center py-12 text-on-surface-variant bg-surface-container-low rounded-2xl border border-outline-variant/20">
              <span className="material-symbols-outlined text-outline text-[40px] mb-2">event_busy</span>
              <p className="font-headline-sm text-base">No upcoming workshops published yet</p>
              <p className="text-xs mt-1">Check back soon for new guild masterclasses.</p>
            </div>
          ) : (
            <>
              {/* FEATURED LIVE COUNTDOWN HERO WORKSHOP */}
              <div className="bg-surface-container-low rounded-2xl p-6 lg:p-8 border border-outline-variant/30 shadow-sm relative overflow-hidden">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="max-w-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
                      <span className="font-label-caps text-xs text-primary font-bold uppercase tracking-wider">
                        Next Atelier Live Masterclass
                      </span>
                    </div>

                    <h3 className="font-headline-md text-2xl lg:text-3xl font-bold text-on-surface leading-tight mb-2">
                      {workshops[0].title}
                    </h3>

                    <p className="text-body-sm text-on-surface-variant mb-4">
                      Guided directly by {workshops[0].instructor}. {workshops[0].description}
                    </p>
                  </div>

                  {/* Countdown Plinth */}
                  <div className="flex flex-col items-center p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm self-stretch lg:self-auto min-w-[280px]">
                    <span className="text-[10px] font-label-caps text-outline uppercase font-bold tracking-wider mb-2">
                      Live Stream & Atelier Commences In
                    </span>

                    <div className="grid grid-cols-4 gap-2 text-center w-full mb-4">
                      <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                        <span className="font-headline-sm text-xl font-bold text-primary block">
                          {String(countdown.days).padStart(2, '0')}
                        </span>
                        <span className="text-[9px] font-label-caps text-outline uppercase">Days</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                        <span className="font-headline-sm text-xl font-bold text-primary block">
                          {String(countdown.hours).padStart(2, '0')}
                        </span>
                        <span className="text-[9px] font-label-caps text-outline uppercase">Hours</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                        <span className="font-headline-sm text-xl font-bold text-primary block">
                          {String(countdown.minutes).padStart(2, '0')}
                        </span>
                        <span className="text-[9px] font-label-caps text-outline uppercase">Mins</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
                        <span className="font-headline-sm text-xl font-bold text-primary block">
                          {String(countdown.seconds).padStart(2, '0')}
                        </span>
                        <span className="text-[9px] font-label-caps text-outline uppercase">Secs</span>
                      </div>
                    </div>

                    <div className="w-full text-center">
                      <button
                        type="button"
                        onClick={() => setBookingWorkshop(workshops[0])}
                        className="w-full py-2.5 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">qr_code</span>
                        <span>View Pass / Book Another Seat</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ALL UPCOMING GUILD WORKSHOPS */}
              <div>
                <h4 className="font-headline-sm text-lg font-bold text-on-surface mb-4">
                  All Scheduled Immersion Guild Workshops
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {workshops.map((ws) => (
                    <WorkshopCard
                      key={ws.id}
                      ws={ws}
                      onBook={(w) => setBookingWorkshop(w)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        /* PERSONAL LEARNING VIEW */
        <div className="space-y-6">
          {learningLoading && (
            <div className="text-center py-12 text-on-surface-variant">
              <p className="font-headline-sm text-base">Loading learning journeys…</p>
            </div>
          )}

          {!learningLoading && learningError && (
            <div className="text-center py-12 text-error">
              <p className="font-headline-sm text-base">{learningError}</p>
            </div>
          )}

          {!learningLoading && !learningError && learningJourneys.length === 0 && (
            <div className="text-center py-12 text-on-surface-variant bg-surface-container-low rounded-2xl border border-outline-variant/20">
              <span className="material-symbols-outlined text-outline text-[40px] mb-2">menu_book</span>
              <p className="font-headline-sm text-base">No published learning journeys yet</p>
            </div>
          )}

          {!learningLoading && !learningError && learningJourneys.map((lj) => (
            <LearningJourneyCard key={lj.id} lj={lj} />
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {bookingWorkshop && (
        <BookingModal
          workshop={bookingWorkshop}
          onClose={() => setBookingWorkshop(null)}
          onConfirmBooking={(booked) => {
            if (onBookWorkshop) onBookWorkshop(booked);
          }}
        />
      )}
    </div>
  );
}

function WorkshopCard({ ws, onBook }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div>
        {ws.image && !imageError && (
          <div className="h-44 w-full relative overflow-hidden bg-surface-container">
            <img
              src={ws.image}
              alt=""
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface text-[10px] font-label-caps font-bold">
              {ws.tradition}
            </span>
            <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-primary text-on-primary text-xs font-bold shadow-xs">
              {ws.price}
            </span>
          </div>
        )}

        <div className="p-5 space-y-2.5">
          {(!ws.image || imageError) && (
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface text-[10px] font-label-caps font-bold">
                {ws.tradition}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-primary text-on-primary text-xs font-bold shadow-xs">
                {ws.price}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-outline">
            <span className="material-symbols-outlined text-[16px] text-primary">calendar_today</span>
            <span>{ws.date} • {ws.time}</span>
          </div>

          <h4 className="font-headline-sm text-base font-bold text-on-surface">
            {ws.title}
          </h4>

          <p className="text-xs text-primary font-medium">
            Master: {ws.instructor} ({ws.instructorRole})
          </p>

          <p className="text-body-sm text-on-surface-variant line-clamp-2">
            {ws.description}
          </p>
        </div>
      </div>

      <div className="p-4 px-5 border-t border-outline-variant/20 bg-surface-container-low/50 flex items-center justify-between">
        <span className="text-xs text-outline font-medium">
          {ws.location}
        </span>

        <button
          type="button"
          onClick={() => onBook(ws)}
          className="px-4 py-1.5 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold shadow-xs transition-colors flex items-center gap-1"
        >
          <span>Book Pass</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}

function LearningJourneyCard({ lj }) {
  const [imageError, setImageError] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  return (
    <div className="bg-surface-container-low rounded-2xl p-6 lg:p-8 border border-outline-variant/30 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Visualizer & Preview */}
        <div className="lg:col-span-5 relative rounded-xl overflow-hidden shadow-sm h-60 bg-surface-container">
          {lj.image && !imageError && (
            <img
              src={lj.image}
              alt=""
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-between p-4 text-white">
            <span className="px-2.5 py-0.5 rounded-full bg-primary text-on-primary text-[10px] font-label-caps font-bold self-start">
              {lj.level}
            </span>

            {/* Audio/Video Simulation Bar */}
            <div className="flex items-center gap-3 bg-black/60 backdrop-blur-sm p-3 rounded-xl">
              <button
                type="button"
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:scale-105 transition-transform"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isPlayingAudio ? 'pause' : 'play_arrow'}
                </span>
              </button>
              <div className="flex-1">
                <span className="text-[11px] font-semibold block truncate">
                  {isPlayingAudio ? "Playing Audio Archive" : `Audio Guide: ${lj.instructor}`}
                </span>
                <div className="w-full bg-white/30 h-1 rounded-full overflow-hidden mt-1">
                  <div className={`bg-primary h-full rounded-full ${isPlayingAudio ? 'animate-pulse w-3/4' : 'w-1/3'}`}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Details & Progress */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-primary">{lj.tradition}</span>
              <span className="text-outline text-xs">•</span>
              <span className="text-xs text-outline">{lj.duration}</span>
            </div>
            <h3 className="font-headline-sm text-2xl font-bold text-on-surface">
              {lj.title}
            </h3>
            <p className="text-xs text-outline mt-0.5">Master Instructor: {lj.instructor}</p>
          </div>

          {/* Progress Bar */}
          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-on-surface">Immersion Course Progress</span>
              <span className="font-bold text-primary">{lj.progressPercentage}% Completed</span>
            </div>
            <div className="w-full bg-surface-container h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-700"
                style={{ width: `${lj.progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-outline pt-1">
              <span>{lj.completedModules} of {lj.totalModules} modules mastered</span>
              <span>Next: {lj.currentModule.split(':')[0]}</span>
            </div>
          </div>

          {/* Current Active Module */}
          <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-primary text-[20px]">auto_stories</span>
              <div>
                <span className="text-[10px] font-label-caps text-outline uppercase font-semibold">Active Lesson</span>
                <p className="text-xs font-bold text-on-surface">{lj.currentModule}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => alert(`Resuming ${lj.currentModule}`)}
              className="px-4 py-2 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
            >
              <span>Resume</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
