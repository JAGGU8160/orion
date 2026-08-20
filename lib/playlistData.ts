export interface Song {
  id: number;
  title: string;
  artist: string;
  category: string;
  saavnId: string;   // from jiosaavn.com/song/slug/THIS_PART
  coverArt: string;
}

export const CATEGORIES = [
  "Cinematic & Orchestral",
  "Space Ambient & Lo-Fi",
  "Synthwave & Electronic Sci-Fi",
  "Classic Rock & Pop Space Anthems",
  "Cosmic Dread & Epic Crescendos",
  "Indian Acoustic & Historical Epics",
] as const;

export type Category = (typeof CATEGORIES)[number];

// saavnId = last segment of jiosaavn.com/song/{slug}/{ID}
// e.g. https://www.jiosaavn.com/song/time/HBxaVBFYfmc  →  HBxaVBFYfmc
export const playlist: Song[] = [
  // ── Cinematic & Orchestral ─────────────────────────────────────────────────
  { id: 1,  title: "Time",                          artist: "Hans Zimmer",      category: "Cinematic & Orchestral",             saavnId: "HBxaVBFYfmc", coverArt: "https://picsum.photos/seed/zimmer-time/200/200"    },
  { id: 2,  title: "Experience",                    artist: "Ludovico Einaudi", category: "Cinematic & Orchestral",             saavnId: "TODO",        coverArt: "https://picsum.photos/seed/einaudi/200/200"        },
  { id: 3,  title: "Solas",                         artist: "Jamie Duffy",      category: "Cinematic & Orchestral",             saavnId: "TODO",        coverArt: "https://picsum.photos/seed/solas/200/200"          },
  { id: 4,  title: "Day One",                       artist: "Hans Zimmer",      category: "Cinematic & Orchestral",             saavnId: "TODO",        coverArt: "https://picsum.photos/seed/dayone/200/200"         },
  { id: 5,  title: "Elegy for the Arctic",          artist: "Ludovico Einaudi", category: "Cinematic & Orchestral",             saavnId: "TODO",        coverArt: "https://picsum.photos/seed/arctic/200/200"         },

  // ── Space Ambient & Lo-Fi ──────────────────────────────────────────────────
  { id: 6,  title: "Weightless",                    artist: "Marconi Union",    category: "Space Ambient & Lo-Fi",              saavnId: "TODO",        coverArt: "https://picsum.photos/seed/weightless/200/200"     },
  { id: 7,  title: "Comptine d'un autre été",       artist: "Yann Tiersen",     category: "Space Ambient & Lo-Fi",              saavnId: "TODO",        coverArt: "https://picsum.photos/seed/tiersen/200/200"        },
  { id: 8,  title: "On the Nature of Daylight",     artist: "Max Richter",      category: "Space Ambient & Lo-Fi",              saavnId: "TODO",        coverArt: "https://picsum.photos/seed/richter/200/200"        },

  // ── Synthwave & Electronic Sci-Fi ─────────────────────────────────────────
  { id: 9,  title: "Runaway",                       artist: "Kanye West",       category: "Synthwave & Electronic Sci-Fi",     saavnId: "TODO",        coverArt: "https://picsum.photos/seed/runaway/200/200"        },
  { id: 10, title: "Harder Better Faster Stronger", artist: "Daft Punk",        category: "Synthwave & Electronic Sci-Fi",     saavnId: "TODO",        coverArt: "https://picsum.photos/seed/daftpunk1/200/200"      },

  // ── Classic Rock & Pop Space Anthems ──────────────────────────────────────
  { id: 11, title: "Space Oddity",                  artist: "David Bowie",      category: "Classic Rock & Pop Space Anthems",   saavnId: "TODO",        coverArt: "https://picsum.photos/seed/bowie1/200/200"         },
  { id: 12, title: "Rocket Man",                    artist: "Elton John",       category: "Classic Rock & Pop Space Anthems",   saavnId: "TODO",        coverArt: "https://picsum.photos/seed/elton/200/200"          },
  { id: 13, title: "Starman",                       artist: "David Bowie",      category: "Classic Rock & Pop Space Anthems",   saavnId: "TODO",        coverArt: "https://picsum.photos/seed/bowie2/200/200"         },

  // ── Cosmic Dread & Epic Crescendos ────────────────────────────────────────
  { id: 14, title: "In the House, In a Heartbeat",  artist: "John Murphy",      category: "Cosmic Dread & Epic Crescendos",     saavnId: "TODO",        coverArt: "https://picsum.photos/seed/28days/200/200"         },
  { id: 15, title: "Interstellar Main Theme",       artist: "Hans Zimmer",      category: "Cosmic Dread & Epic Crescendos",     saavnId: "TODO",        coverArt: "https://picsum.photos/seed/interstellar/200/200"   },
  { id: 16, title: "No Time for Caution",           artist: "Hans Zimmer",      category: "Cosmic Dread & Epic Crescendos",     saavnId: "TODO",        coverArt: "https://picsum.photos/seed/docking/200/200"        },

  // ── Indian Acoustic & Historical Epics ────────────────────────────────────
  { id: 17, title: "Dil Se Re",                     artist: "A.R. Rahman",      category: "Indian Acoustic & Historical Epics", saavnId: "TODO",        coverArt: "https://picsum.photos/seed/rahman1/200/200"        },
  { id: 18, title: "Vande Mataram",                 artist: "A.R. Rahman",      category: "Indian Acoustic & Historical Epics", saavnId: "TODO",        coverArt: "https://picsum.photos/seed/rahman2/200/200"        },
  { id: 19, title: "Kehna Hi Kya",                  artist: "A.R. Rahman",      category: "Indian Acoustic & Historical Epics", saavnId: "TODO",        coverArt: "https://picsum.photos/seed/kehna/200/200"          },
  { id: 20, title: "Lagaan Theme",                  artist: "A.R. Rahman",      category: "Indian Acoustic & Historical Epics", saavnId: "TODO",        coverArt: "https://picsum.photos/seed/lagaan/200/200"         },
];
