import React, { useState } from 'react';
import { institutionData } from '../../data/mockData';

export default function InstUpcomingEvents() {
  const [engagements] = useState(institutionData.upcomingEngagements);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <span className="font-label-caps text-xs text-primary font-bold uppercase tracking-widest block mb-1">
            Section 4 • Active Engagements
          </span>
          <h2 className="font-headline-md text-2xl lg:text-3xl font-bold text-on-surface">
            Upcoming Institutional Sessions
          </h2>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Scheduled master practitioner residencies, campus cultural streams, and faculty immersion timetables.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface text-xs font-semibold">
            {engagements.length} Confirmed Engagements
          </span>
        </div>
      </div>

      {/* Grid of Engagements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {engagements.map((eng) => (
          <div
            key={eng.id}
            className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-label-caps font-bold">
                  {eng.tradition}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-surface-container-lowest text-primary font-semibold border border-outline-variant/20">
                  {eng.status}
                </span>
              </div>

              <div>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface leading-snug">
                  {eng.title}
                </h3>
                <p className="text-xs text-primary font-medium mt-1">
                  Master Custodian: {eng.master}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-primary">schedule</span>
                  <span>{eng.date} • {eng.time}</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-primary">groups</span>
                  <span>{eng.cohort}</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-primary">hub</span>
                  <span>{eng.format}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-outline-variant/20 flex items-center gap-2">
              <button
                type="button"
                onClick={() => alert(`Launching Virtual Guild Atelier Link for: ${eng.title}`)}
                className="flex-1 py-2 px-3 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[15px]">videocam</span>
                <span>Join Atelier</span>
              </button>

              <button
                type="button"
                onClick={() => alert(`Curriculum dossier & Student Preparation Workbook downloaded for ${eng.title}.`)}
                className="p-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs"
                title="Download Curriculum Dossier"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
