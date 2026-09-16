import React, { useState } from 'react';
import { REGIONAL_TERROIR_DATA } from '../../data/publicMockData';

export default function RegionalExplorer() {
  const [activeRegionTab, setActiveRegionTab] = useState('all');
  const [activeHotspotId, setActiveHotspotId] = useState('mithila');

  const activeHotspot =
    REGIONAL_TERROIR_DATA.hotspots.find((h) => h.id === activeHotspotId) ||
    REGIONAL_TERROIR_DATA.hotspots[0];

  const regionTabs = [
    { id: 'all', label: 'All Ecosystems' },
    { id: 'ghats', label: 'Western Ghats' },
    { id: 'mithila', label: 'Mithilanchal' },
    { id: 'highlands', label: 'Central Highlands' },
    { id: 'east', label: 'Eastern Coastlines' },
  ];

  const handleTabClick = (tabId) => {
    setActiveRegionTab(tabId);
    if (tabId !== 'all') {
      const match = REGIONAL_TERROIR_DATA.hotspots.find((h) => h.id === tabId);
      if (match) setActiveHotspotId(match.id);
    }
  };

  const handlePinClick = (hotspot) => {
    setActiveHotspotId(hotspot.id);
    setActiveRegionTab(hotspot.id);
  };

  return (
    <section className="section-padding" id="terroir-map">
      <div className="container-max">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-[1px] bg-primary"></span>
              <span className="font-label-caps text-primary">Geographical Custodianship</span>
            </div>
            <h2 className="font-headline-lg text-on-surface">
              The Living Terroir of Indian Tribal Art
            </h2>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap gap-2">
            {regionTabs.map((tab) => {
              const isActive = activeRegionTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(tab.id)}
                  className={`px-4 py-1.5 rounded-full font-label-md transition-colors ${
                    isActive
                      ? 'bg-on-surface text-surface font-semibold'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Regional Map Container with Overlaid Hotspots */}
        <div className="regional-map relative rounded-2xl overflow-hidden shadow-xl bg-surface-container">
          <img
            src={REGIONAL_TERROIR_DATA.mapBackground}
            alt="Indian Tribal Art Terroir Map"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            loading="lazy"
          />
          {/* Gradient overlay for readability */}
          <div className="map-gradient-overlay" />

          <div className="relative z-10 w-full h-full flex flex-col justify-between p-6 lg:p-10">

            {/* Top/Left: Dynamic Info Overlay Drawer */}
            <div
              className="relative z-10 max-w-md backdrop-blur-xl p-6 rounded-2xl shadow-xl space-y-3"
              style={{ backgroundColor: 'rgba(251, 249, 243, 0.94)' }}
            >
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-[10px] text-primary font-bold">
                  {activeHotspot.tag}
                </span>
                <span className="font-label-caps text-[10px] text-secondary font-semibold bg-secondary-container px-2 py-0.5 rounded-full">
                  Protected Terroir
                </span>
              </div>

              <h3 className="font-headline-sm text-on-surface">
                {activeHotspot.locationName}
              </h3>

              <p className="font-body-sm text-on-surface-variant leading-relaxed">
                {activeHotspot.desc}
              </p>

              <div className="pt-3 grid grid-cols-3 gap-3 border-t border-outline-variant/30">
                <div>
                  <span className="font-label-caps text-[9px] text-outline block">Active Guilds</span>
                  <span className="font-title-md text-on-surface font-semibold">
                    {activeHotspot.guilds}
                  </span>
                </div>
                <div>
                  <span className="font-label-caps text-[9px] text-outline block">Natural Dyes</span>
                  <span className="font-title-md text-on-surface font-semibold">
                    {activeHotspot.dyes}
                  </span>
                </div>
                <div>
                  <span className="font-label-caps text-[9px] text-outline block">Avg Experience</span>
                  <span className="font-title-md text-on-surface font-semibold">
                    {activeHotspot.experience}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom: Map Terroir Highlights Pin Bar */}
            <div className="relative z-10 flex flex-wrap items-center gap-3 mt-6">
              {REGIONAL_TERROIR_DATA.hotspots.map((hotspot) => {
                const isSelected = activeHotspotId === hotspot.id;
                return (
                  <button
                    key={hotspot.id}
                    type="button"
                    onClick={() => handlePinClick(hotspot)}
                    className={`px-4 py-2 rounded-full backdrop-blur-md shadow-md font-label-md flex items-center gap-2 hover:scale-105 transition-all ${
                      isSelected
                        ? 'bg-surface text-on-surface font-bold ring-2 ring-primary/40'
                        : 'bg-surface/90 text-on-surface-variant hover:bg-surface'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: hotspot.color }}
                    />
                    <span>{hotspot.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
