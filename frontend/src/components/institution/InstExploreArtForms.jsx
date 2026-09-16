import React, { useState } from 'react';
import { artForms } from '../../data/mockData';

export default function InstExploreArtForms({ onSelectForWorkshop }) {
  const [selectedDomain, setSelectedDomain] = useState('All');

  const institutionalThemes = [
    {
      id: 'warli',
      name: 'Warli Sacred Geometry',
      region: 'Maharashtra',
      target: 'Grade 6-12 & Corporate Teams',
      pedagogyFocus: 'Sacred Mathematics & Community Ritual Choreography',
      csrImpact: 'Sustains 14 forest hamlets in Palghar forest region',
      quote: 'Students explore symmetry, natural resource conservation, and collective agrarian storytelling.',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
      materialsKit: 'Crushed Wild Rice wash, Geru clay, bamboo styluses'
    },
    {
      id: 'gond',
      name: 'Gond Pardhan Ecological Lore',
      region: 'Madhya Pradesh',
      target: 'Undergraduates, Faculty & CSR Executives',
      pedagogyFocus: 'Biodiversity Ethics & Animist Oral Traditions',
      csrImpact: 'Direct patronage to Pardhan bardic guild families',
      quote: 'Teaches environmental stewardship through signature clan dot-and-dash animal depictions.',
      image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=800&q=80',
      materialsKit: 'Natural Ramraj yellow clay, handloom cotton, organic pigments'
    },
    {
      id: 'mithila',
      name: 'Mithila Natural Pigment Frescoes',
      region: 'Bihar',
      target: 'School Curricula & Women Leadership Seminars',
      pedagogyFocus: 'Natural Dye Chemistry & Matriarchal Lineage Documentation',
      csrImpact: 'Empowers certified women artisans across Ranti village',
      quote: 'Fosters organic dye extraction from turmeric, indigo, and aparajita blossoms on Tussar silk.',
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
      materialsKit: 'Boiled plant extracts, lampblack soot, raw silk swatches'
    },
    {
      id: 'pattachitra',
      name: 'Odisha Pattachitra Scrollmaking',
      region: 'Odisha',
      target: 'Art Academies & Corporate Heritage Galleries',
      pedagogyFocus: 'Classical Narrative Sequencing & Botanical Gum Preparation',
      csrImpact: 'Preserves ancient Raghurajpur heritage crafts village',
      quote: 'Intensive immersion in preparing cloth canvases using tamarind seed paste and chalk.',
      image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
      materialsKit: 'Dried palm leaf strips, stylus needles, crushed conch shell white'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <span className="font-label-caps text-xs text-primary font-bold uppercase tracking-widest block mb-1">
            Section 1 • Institutional Discovery
          </span>
          <h2 className="font-headline-md text-2xl lg:text-3xl font-bold text-on-surface">
            Institutional Cultural Pedagogies
          </h2>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Curated indigenous art forms tailored for academic curricula, experiential campus weeks, and corporate CSR leadership modules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold">
            12A / 80G Certified Modules
          </span>
        </div>
      </div>

      {/* Grid of Institutional Art Offerings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {institutionalThemes.map((theme) => (
          <div
            key={theme.id}
            className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="h-48 w-full relative overflow-hidden bg-surface-container">
                <img
                  src={theme.image}
                  alt={theme.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface text-[10px] font-label-caps font-bold">
                  {theme.region}
                </span>
                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-primary text-on-primary text-[10px] font-bold shadow-xs">
                  {theme.target}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <h3 className="font-headline-sm text-xl font-bold text-on-surface">
                  {theme.name}
                </h3>

                <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-1.5 text-xs">
                  <div>
                    <strong className="text-on-surface">Pedagogical Core: </strong>
                    <span className="text-on-surface-variant">{theme.pedagogyFocus}</span>
                  </div>
                  <div>
                    <strong className="text-secondary">CSR Impact: </strong>
                    <span className="text-on-secondary-container">{theme.csrImpact}</span>
                  </div>
                </div>

                <p className="text-body-sm text-on-surface-variant italic">
                  "{theme.quote}"
                </p>

                <div className="text-xs text-outline">
                  <strong>Materials Provisioned:</strong> {theme.materialsKit}
                </div>
              </div>
            </div>

            <div className="p-4 px-6 border-t border-outline-variant/20 bg-surface-container-low/40 flex items-center justify-between">
              <span className="text-xs text-outline font-semibold">Institutional Pack</span>
              <button
                type="button"
                onClick={() => onSelectForWorkshop(theme.name.split(' ')[0])}
                className="px-4 py-2 rounded-full bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>Book This Tradition</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
