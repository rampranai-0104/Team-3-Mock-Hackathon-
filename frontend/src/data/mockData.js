// Comprehensive frontend mock dataset for Tvarita Portals
// Mapped to the MERN schemas in Tvarita_MERN_Project_Documentation.docx

export const publicUser = {
  id: "usr_aarav_88219",
  name: "Aarav Mehta",
  patronTier: "SAHASRA PATRON TIER",
  memberId: "#TV-88219",
  bio: "Cultural heritage advocate & folk art patron supporting indigenous artisans across Maharashtra, Madhya Pradesh & Bihar.",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
  metrics: {
    traditionsPreserved: 3,
    artisansSustained: 4,
    royaltiesDisbursed: "₹48,200",
    escrowAuditId: "AUD-ESC-2026-09"
  }
};

export const artForms = [
  {
    id: "warli",
    name: "Warli Folk Painting",
    region: "North Sahyadri Range, Maharashtra",
    category: "Ritual & Geometric Tribal",
    giCertified: true,
    giTag: "GI-2014-MH-441",
    tagline: "Sacred Geometric Invocations of Mother Nature",
    description: "One of the oldest surviving tribal art traditions in India, Warli paintings use basic geometric shapes—circles, triangles, and squares—derived from nature. Created with crushed wild rice paste on mud and cowdung-primed walls.",
    motifs: ["Tarpa Dance", "Palaghat Goddess of Fertility", "Sacred Trees", "Harvest Circles"],
    materials: ["Geru Clay (Red Ochre)", "Fermented Rice Paste Wash", "Chewed Bamboo Twig Stylus"],
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",
    leadArtisan: "Dinesh Somashekar"
  },
  {
    id: "gond",
    name: "Gond Pardhan Art",
    region: "Dindori & Mandla, Madhya Pradesh",
    category: "Animist & Ecological Folktales",
    giCertified: true,
    giTag: "GI-2016-MP-512",
    tagline: "Intricate Dot-and-Dash Vibrations of the Forest",
    description: "Practiced by the Gond Pardhan community of Central India. Every tree, bird, and forest creature is imbued with sacred spiritual energy, rendered through distinctive signature dot-and-line stippling unique to each clan.",
    motifs: ["Bada Dev Sacred Mahua Tree", "Flying Peacocks", "Deer with Horn-Branches", "Elephant & Fish"],
    materials: ["Yellow Clay (Ramraj)", "Gheru Ochre", "Charcoal & Chhui Clay", "Handmade Canvas"],
    image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=800&q=80",
    leadArtisan: "Bhajju Shyam"
  },
  {
    id: "mithila",
    name: "Mithila / Madhubani Painting",
    region: "Mithila Region, Bihar",
    category: "Ritual Fresco & Line Art",
    giCertified: true,
    giTag: "GI-2007-BR-088",
    tagline: "Ancient Lineages of Line, Natural Dye & Sacred Space",
    description: "Practiced traditionally by women on freshly plastered mud walls during ceremonies and weddings. Characterized by intricate double-line borders, geometric hatching, and vibrant dyes sourced from flower petals and soot.",
    motifs: ["Kohbar Bridal Chamber", "Matsya Avatar", "Sun & Moon Cosmic Guardians", "Lotus Pond"],
    materials: ["Lampblack Soot", "Aparajita Flower Indigo", "Turmeric Extract", "Handloom Tussar Silk"],
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    leadArtisan: "Dulari Devi"
  },
  {
    id: "pattachitra",
    name: "Odisha Pattachitra",
    region: "Raghurajpur Crafts Village, Odisha",
    category: "Cloth Scroll & Palm Leaf Inscription",
    giCertified: true,
    giTag: "GI-2008-OD-110",
    tagline: "Master Scrollmaking from Ancient Guild Sanctuaries",
    description: "A centuries-old sacred art form where patuas (painters) prepare cloth canvases using tamarind seed paste and chalk powder. The narratives illustrate Jagannath temple lore and classical epics with fine brushwork.",
    motifs: ["Jagannath Triad", "Kaliya Dalan", "Tree of Life with Birds", "Dashavatar"],
    materials: ["Tamarind Seed Gum Substrate", "Crushed Conch Shell White", "Hingula Vermilion", "Lampblack"],
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80",
    leadArtisan: "Apanna Mohapatra"
  },
  {
    id: "sohrai",
    name: "Sohrai & Khovar Murals",
    region: "Hazaribagh, Jharkhand",
    category: "Winter Harvest & Nuptial Mud Murals",
    giCertified: true,
    giTag: "GI-2020-JH-672",
    tagline: "Sacred Mud Engraving & Ochre Fertility Murals",
    description: "Painted during the harvest and wedding seasons by tribal women using chewed datun sticks, cloth swabs, and combs. Layers of black manganese earth are coated with white kaolin clay and scraped to reveal patterns.",
    motifs: ["Pashupati Lord of Animals", "Spotted Deer", "Hornbill Birds", "Sacred Plant Combs"],
    materials: ["Charcoal Manganese Mud", "White Kaolin (Dhudhi)", "Red Geru Clay", "Wild Grass Datun"],
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
    leadArtisan: "Jamuna Devi"
  }
];

export const masterArtists = [
  {
    id: "art_dinesh",
    name: "Dinesh Somashekar",
    tradition: "Warli Folk Tradition",
    region: "Palghar, Maharashtra",
    experience: "32 Years Mastery",
    clan: "Jivya Mashe Lineage",
    giCertified: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
    bio: "Senior guildmaster preserving 4th-generation rice paste sacred geometry techniques in the Sahyadri forest ateliers.",
    activeWorkshops: 1,
    followersCount: 1420,
    isFollowing: true,
    status: "In Forest Atelier"
  },
  {
    id: "art_bhajju",
    name: "Bhajju Shyam",
    tradition: "Gond Pardhan Art",
    region: "Patangarh, Madhya Pradesh",
    experience: "28 Years Mastery",
    clan: "Pardhan Bardic Guild",
    giCertified: true,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
    bio: "Padma Shri nominee & renowned Gond artist transforming sacred animist folk mythology into international museum retrospectives.",
    activeWorkshops: 2,
    followersCount: 3890,
    isFollowing: true,
    status: "Live in Studio"
  },
  {
    id: "art_dulari",
    name: "Dulari Devi",
    tradition: "Mithila / Madhubani",
    region: "Ranti, Bihar",
    experience: "35 Years Mastery",
    clan: "Kachni Lineage",
    giCertified: true,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80",
    bio: "Padma Shri awardee, pioneering contemporary themes and female social empowerment through classical Mithila fine line craft.",
    activeWorkshops: 1,
    followersCount: 4210,
    isFollowing: true,
    status: "Natural Dye Prep"
  },
  {
    id: "art_apanna",
    name: "Apanna Mohapatra",
    tradition: "Odisha Pattachitra",
    region: "Raghurajpur, Odisha",
    experience: "40 Years Mastery",
    clan: "Chitrakara Heritage Guild",
    giCertified: true,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80",
    bio: "Master custodian specializing in mineral pigment extraction and delicate palm-leaf engraving of classical Jagannath scrolls.",
    activeWorkshops: 1,
    followersCount: 2150,
    isFollowing: true,
    status: "Available for Commissions"
  },
  {
    id: "art_jamuna",
    name: "Jamuna Devi",
    tradition: "Sohrai & Khovar Murals",
    region: "Hazaribagh, Jharkhand",
    experience: "25 Years Mastery",
    clan: "Kurmi Tribal Guild",
    giCertified: true,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80",
    bio: "Leading elder artist recognized for mural conservation using indigenous white kaolin and river mud reliefs.",
    activeWorkshops: 0,
    followersCount: 980,
    isFollowing: false,
    status: "At Harvest Guild"
  }
];

export const upcomingWorkshops = [
  {
    id: "ws_warli_7740",
    title: "Warli Natural Pigment & Sacred Geometry Rituals",
    tradition: "Warli Folk Tradition",
    instructor: "Dinesh Somashekar",
    instructorRole: "Elder Guildmaster",
    location: "Palghar Forest Atelier (Hybrid)",
    date: "Sept 19, 2026",
    time: "10:00 AM - 01:30 PM IST",
    daysRemaining: 2,
    hoursRemaining: 14,
    minutesRemaining: 45,
    passId: "WAR-7740",
    price: "₹1,850",
    confirmed: true,
    prepKitStatus: "In Transit • Bhiwandi Logistics Hub (Out for Delivery)",
    kitDetails: "Geru ochre brick, sun-dried wild rice wash, and 3 calibrated bamboo styluses",
    description: "Hands-on immersion into the sacred geometry of the Tarpa dance and fertility rituals. Sourcing natural clay and preparing ceremonial wash.",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "ws_gond_8901",
    title: "Gond Pardhan Ecological Lore & Organic Stippling",
    tradition: "Gond Pardhan Art",
    instructor: "Bhajju Shyam",
    instructorRole: "Master Practitioner",
    location: "Bhopal Cultural Complex / Live Stream",
    date: "Sept 25, 2026",
    time: "03:00 PM - 06:00 PM IST",
    daysRemaining: 8,
    hoursRemaining: 19,
    minutesRemaining: 10,
    passId: "GND-8901",
    price: "₹2,200",
    confirmed: false,
    prepKitStatus: "Ready for Dispatch upon Pass Reservation",
    kitDetails: "Hand-primed cotton canvas, natural soot & yellow ramraj pigments, fine bamboo brushes",
    description: "Learn the distinctive dot-and-dash stroke language expressing forest animals and cosmological Gond folklore.",
    image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "ws_mithila_6512",
    title: "Mithila Natural Dyes on Handloom Tussar Silk",
    tradition: "Mithila / Madhubani",
    instructor: "Dulari Devi",
    instructorRole: "Padma Shri Master Custodian",
    location: "Ranti Village Atelier / Online Masterclass",
    date: "Oct 04, 2026",
    time: "11:00 AM - 02:30 PM IST",
    daysRemaining: 17,
    hoursRemaining: 8,
    minutesRemaining: 30,
    passId: "MTH-6512",
    price: "₹2,500",
    confirmed: false,
    prepKitStatus: "Artisan Guild Assembly in Ranti",
    kitDetails: "Raw Tussar silk substrate swatch, organic indigo, boiled turmeric extract, nib pens",
    description: "Master the fine Kachni line technique and extraction of natural plant-based pigments for ceremonial bridal artwork.",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80"
  }
];

export const learningJourneys = [
  {
    id: "lj_warli_foundations",
    title: "Warli Sacred Geometry & Natural Pigments",
    tradition: "Warli Tradition",
    instructor: "Dinesh Somashekar",
    level: "Intermediate Immersion",
    totalModules: 5,
    completedModules: 3,
    progressPercentage: 65,
    currentModule: "Module 3: Sacred Tarpa Concentric Spiral Choreography",
    nextAction: "Resume Lesson: Pigment Density & Stylus Angle",
    duration: "4.5 Hours Content",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "lj_gond_symbology",
    title: "Gond Tree of Life: Dot and Dash Sacred Zoology",
    tradition: "Gond Pardhan Art",
    instructor: "Bhajju Shyam",
    level: "Masterclass Apprenticeship",
    totalModules: 6,
    completedModules: 1,
    progressPercentage: 20,
    currentModule: "Module 2: Animist Bird Portrayals & Sky Gods",
    nextAction: "Start Lesson: The Peacock in Mahua Bloom",
    duration: "6.0 Hours Content",
    image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=800&q=80"
  }
];

export const myArtworkOrders = [
  {
    id: "ord_9921",
    orderNumber: "TVR-ORD-9921",
    title: "The Cosmic Tree & Midnight Serpent",
    artist: "Bhajju Shyam",
    tradition: "Gond Pardhan Masterwork",
    dimensions: "36 x 24 inches on Hand-Primed Canvas",
    amount: "₹18,500",
    orderDate: "Sept 11, 2026",
    nfcProvenanceTag: "0x89F4...A482",
    giTagNumber: "GI-2016-MP-512-CERT",
    directArtisanRoyalty: "100% Direct: ₹18,500 Disbursed to Bhajju Shyam",
    image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=800&q=80",
    stepper: [
      { step: 1, title: "Order Authenticated", status: "completed", date: "Sept 11 • 04:15 PM" },
      { step: 2, title: "Canvas Primed with Cowdung Wash", status: "completed", date: "Sept 12 • 11:30 AM" },
      { step: 3, title: "Master Signature Inscribed", status: "completed", date: "Sept 13 • 03:00 PM" },
      { step: 4, title: "Cryptographic NFC Provenance Tag Affixed", status: "completed", date: "Sept 14 • 06:20 PM" },
      { step: 5, title: "Dispatched via Insured Cultural Courier", status: "in_progress", date: "In Transit (Est. Tomorrow)" }
    ]
  }
];

export const marketplaceProducts = [
  {
    id: "prod_warli_canvas",
    title: "Tarpa Celebration of Winter Harvest",
    tradition: "Warli Folk Painting",
    artist: "Dinesh Somashekar",
    price: 8500,
    formattedPrice: "₹8,500",
    medium: "Crushed Rice Paste on Geru Coated Canvas",
    dimensions: "24 x 18 inches",
    giCertified: true,
    inStock: 3,
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",
    royaltyPledge: "100% Direct-to-Artisan Payout: ₹8,500 directly deposited to the artisan cooperative."
  },
  {
    id: "prod_gond_flying_peacock",
    title: "Flying Peacock in Mahua Bloom",
    tradition: "Gond Pardhan Art",
    artist: "Bhajju Shyam",
    price: 12400,
    formattedPrice: "₹12,400",
    medium: "Acrylic & Organic Pigments on Fine Linen",
    dimensions: "30 x 20 inches",
    giCertified: true,
    inStock: 2,
    image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=800&q=80",
    royaltyPledge: "Direct Artisan Remuneration: ₹12,400 to Patangarh Guild Council."
  },
  {
    id: "prod_mithila_kohbar",
    title: "Kohbar Bridal Chamber Sacred Cosmos",
    tradition: "Mithila / Madhubani",
    artist: "Dulari Devi",
    price: 9800,
    formattedPrice: "₹9,800",
    medium: "Natural Mineral & Petal Pigments on Tussar Silk",
    dimensions: "28 x 22 inches",
    giCertified: true,
    inStock: 1,
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    royaltyPledge: "Direct Artisan Remuneration: ₹9,800 to Ranti Women Artisans Guild."
  },
  {
    id: "prod_pattachitra_krishna",
    title: "Tala Pata Palm-Leaf Krishna Leela",
    tradition: "Odisha Pattachitra",
    artist: "Apanna Mohapatra",
    price: 15200,
    formattedPrice: "₹15,200",
    medium: "Incised Dried Palm Leaf with Lampblack Etch",
    dimensions: "32 x 12 inches folding scroll",
    giCertified: true,
    inStock: 2,
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80",
    royaltyPledge: "Direct Artisan Remuneration: ₹15,200 to Raghurajpur Crafts Guild."
  }
];

export const institutionData = {
  orgName: "The Heritage School & Global Academy",
  partnerName: "Tata Consultancy Guild (Education Wing)",
  tier: "Tier I Cultural Patron",
  accountType: "Institutional Stewardship Account",
  metrics: {
    cohortReach: "2,400",
    cohortUnit: "Students",
    cohortGrowth: "↑ 18% YoY",
    csrDirected: "₹18.5L",
    csrTarget: "₹20,00,000",
    csrPercentage: 92.5,
    taxAuditTag: "Audited 12A/80G Compliant",
    livelihoods: "32 Master Artisans",
    tribesCount: "8 Indigenous Tribes"
  },
  experiences: [
    {
      id: "exp_warli_campus",
      title: "Campus Cultural Week Immersion",
      tradition: "Warli",
      archetype: "Residency",
      tag: "SCHOOL CURRICULUM",
      grade: "Grade 6-12 Modules",
      description: "Full five-day experiential immersion with Warli and Gond masters creating collaborative school permanent murals.",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "exp_tribal_leadership",
      title: "Tribal Narrative Leadership Workshop",
      tradition: "Gond",
      archetype: "Masterclass",
      tag: "EXECUTIVE CSR",
      grade: "Faculty & Corporate Teams",
      description: "Indigenous ecological decision-making and oral storytelling modules led by Gond Pardhan bards for leadership synthesis.",
      image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "exp_living_museum",
      title: "Living Museum Exhibition Setup",
      tradition: "Pattachitra",
      archetype: "Exhibition",
      tag: "CAMPUS INSTALLATION",
      grade: "Whole Community Event",
      description: "Curated 10-day physical heritage gallery with live artisan workstations, live scroll unfolding, and student guides.",
      image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80"
    }
  ],
  requests: [
    {
      id: "req_tvr_882",
      requestNumber: "#TVR-882",
      title: "5-Day Warli Campus Residency & Permanent Mural",
      tradition: "Warli Master Tradition",
      archetype: "Guild Residency",
      cohortCount: 150,
      format: "On-Campus (Auditorium & Art Studios)",
      budgetTotal: "₹1,45,000",
      artisanWages: "₹1,28,180 (88.4%)",
      status: "In Tribal Council Review",
      submissionDate: "Sept 14, 2026",
      statusColor: "text-primary bg-primary-fixed"
    },
    {
      id: "req_tvr_841",
      requestNumber: "#TVR-841",
      title: "Corporate Gond Biodiversity Workshop",
      tradition: "Gond Pardhan Art",
      archetype: "Executive Masterclass",
      cohortCount: 60,
      format: "Hybrid (HQ Boardroom + Live Studio)",
      budgetTotal: "₹95,000",
      artisanWages: "₹83,980 (88.4%)",
      status: "Approved & Scheduled",
      submissionDate: "Aug 29, 2026",
      statusColor: "text-on-secondary-container bg-secondary-container"
    },
    {
      id: "req_tvr_809",
      requestNumber: "#TVR-809",
      title: "Annual Certified Folk Souvenirs Procurement",
      tradition: "Mithila & Dokra",
      archetype: "Corporate Gifting",
      cohortCount: 300,
      format: "Direct Guild Delivery",
      budgetTotal: "₹3,74,500",
      artisanWages: "₹3,31,058 (88.4%)",
      status: "Delivered & Audited",
      submissionDate: "July 12, 2026",
      statusColor: "text-outline bg-surface-container-high"
    }
  ],
  upcomingEngagements: [
    {
      id: "eng_gond_live",
      title: "Gond Pardhan Ecological Lore Live Session",
      tradition: "Gond Tradition",
      master: "Bhajju Shyam",
      date: "Tomorrow • Sept 17, 2026",
      time: "10:30 AM - 12:30 PM",
      cohort: "120 Students (Grade 8-9)",
      format: "Hybrid Virtual Atelier",
      status: "Live Stream Confirmed",
      curriculumDocUrl: "#curriculum-gond"
    },
    {
      id: "eng_mithila_pigments",
      title: "Mithila Natural Pigment Extraction Workshop",
      tradition: "Mithila Tradition",
      master: "Dulari Devi & Guild",
      date: "Sept 24, 2026",
      time: "02:00 PM - 04:30 PM",
      cohort: "85 Students (Visual Arts Wing)",
      format: "On-Campus Studio",
      status: "Logistics Dispatched",
      curriculumDocUrl: "#curriculum-mithila"
    },
    {
      id: "eng_pattachitra_scroll",
      title: "Pattachitra Scrollmaking Intensive",
      tradition: "Odisha Pattachitra",
      master: "Apanna Mohapatra",
      date: "Oct 02, 2026",
      time: "11:00 AM - 03:00 PM",
      cohort: "40 Faculty & CSR Leads",
      format: "Executive Heritage Suite",
      status: "Curriculum Kits Packed",
      curriculumDocUrl: "#curriculum-pattachitra"
    }
  ],
  bulkSouvenirs: [
    {
      id: "souv_mithila_desk",
      title: "Handpainted Mithila Pen Stand & Desk Docket",
      tradition: "Mithila Folk Tradition",
      unitPrice: 1150,
      moq: 25,
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
      description: "Recycled handmade paper docket with natural dye borders painted by women artisans in Madhubani."
    },
    {
      id: "souv_gond_coaster",
      title: "Gond Lacquer Wooden Coaster Guild Box (Set of 6)",
      tradition: "Gond Pardhan Art",
      unitPrice: 2850,
      moq: 15,
      image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=800&q=80",
      description: "Reclaimed seasoned teak wood coasters hand-stippled with organic lac and beeswax coating."
    },
    {
      id: "souv_dokra_paperweight",
      title: "Dokra Lost-Wax Tribal Bell Metal Paperweight",
      tradition: "Dokra Metallurgy",
      unitPrice: 780,
      moq: 50,
      image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80",
      description: "Ancient 4,000-year-old non-ferrous cire perdue casting from tribal craft clusters in Jharkhand."
    }
  ]
};
