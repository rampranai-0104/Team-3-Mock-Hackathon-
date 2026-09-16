/**
 * Admin Mock Data
 *
 * All admin surfaces are now wired to the live backend via adminService (see
 * frontend/src/services/adminService.js). The only remaining export here is
 * ADMIN_LINEAGES_LIST, used exclusively by the "Lineage & Provenance" tab in
 * AdminArtistsPage.jsx as static, decorative illustrative content -- there is
 * no backend model for artist "lineages" (no Lineage collection or fields on
 * the Artist schema), so this is intentionally kept local rather than wired
 * to a nonexistent endpoint.
 */

export const ADMIN_LINEAGES_LIST = [
  {
    id: 'LIN-001',
    lineageTitle: 'Suvasini Ancestral Warli Lineage',
    masterArtist: 'Master Bhaskar Chitrakar',
    generation: '5th Generation Direct Custodian',
    region: 'Ganjad, Palghar, Maharashtra',
    canonicalMotif: 'Palghat Lagna Chowk & Tarpa Spiral',
    sacredPigment: 'Rice Paste Ground with Water & Gum Arabica',
    oralRecordsCount: '14 Shlokas Recorded',
    status: 'Authenticated & Registered',
  },
  {
    id: 'LIN-002',
    lineageTitle: 'Jangarh Singh Shyam School of Gond Art',
    masterArtist: 'Anand Singh Shyam',
    generation: '2nd Generation Jangarh Lineage',
    region: 'Patangarh, Dindori, MP',
    canonicalMotif: 'Mahua Tree of Life & Zoomorphic Dots',
    sacredPigment: 'Natural Geru, Peeli Mitti & Plant Resins',
    oralRecordsCount: '22 Forest Tales Archived',
    status: 'Authenticated & Registered',
  },
  {
    id: 'LIN-003',
    lineageTitle: 'Raghurajpur Heritage Chitrakar Lineage',
    masterArtist: 'Bhaskar Chitrakar',
    generation: '7th Generation Patta Craftsman',
    region: 'Raghurajpur, Puri, Odisha',
    canonicalMotif: 'Gita Govinda & Jagannath Tala Pattachitra',
    sacredPigment: 'Bean-Leaf Soot & Conch Shell Lime',
    oralRecordsCount: '31 Sanskrit Shlokas Archived',
    status: 'Authenticated & Registered',
  },
];
