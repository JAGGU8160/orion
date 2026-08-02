export interface Song {
  id: number;
  title: string;
  artist: string;
  category: string;
  youtubeId: string;
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

export const playlist: Song[] = [
  // ── Cinematic & Orchestral ─────────────────────────────────────────────────
  { id: 1,  title: "Time",                           artist: "Hans Zimmer",      category: "Cinematic & Orchestral",            youtubeId: "RzzWmHCRCwY", coverArt: "https://picsum.photos/seed/zimmer-time/200/200"    },
  { id: 2,  title: "Day One",                        artist: "Hans Zimmer",      category: "Cinematic & Orchestral",            youtubeId: "KMCO2LLjWg0", coverArt: "https://picsum.photos/seed/dayone/200/200"         },
  { id: 3,  title: "Experience",                     artist: "Ludovico Einaudi", category: "Cinematic & Orchestral",            youtubeId: "hN_PE3oNcaQ", coverArt: "https://picsum.photos/seed/einaudi/200/200"        },
  { id: 4,  title: "Solas",                          artist: "Jamie Duffy",      category: "Cinematic & Orchestral",            youtubeId: "XekJMmRjVBU", coverArt: "https://picsum.photos/seed/solas/200/200"          },
  { id: 5,  title: "First Step",                     artist: "Hans Zimmer",      category: "Cinematic & Orchestral",            youtubeId: "QYqvbM7stMo", coverArt: "https://picsum.photos/seed/firststep/200/200"      },
  { id: 6,  title: "Elegy for the Arctic",           artist: "Ludovico Einaudi", category: "Cinematic & Orchestral",            youtubeId: "-6EJtFBo3To", coverArt: "https://picsum.photos/seed/arctic/200/200"         },

  // ── Space Ambient & Lo-Fi ──────────────────────────────────────────────────
  { id: 7,  title: "Weightless",                     artist: "Marconi Union",    category: "Space Ambient & Lo-Fi",             youtubeId: "UfcAVejslrU", coverArt: "https://picsum.photos/seed/weightless/200/200"     },
  { id: 8,  title: "Comptine d'un autre été",        artist: "Yann Tiersen",     category: "Space Ambient & Lo-Fi",             youtubeId: "yLNBMsN0T8E", coverArt: "https://picsum.photos/seed/tiersen/200/200"        },
  { id: 9,  title: "Divenire",                       artist: "Ludovico Einaudi", category: "Space Ambient & Lo-Fi",             youtubeId: "mMpCJXDFD-A", coverArt: "https://picsum.photos/seed/divenire/200/200"       },
  { id: 10, title: "On the Nature of Daylight",      artist: "Max Richter",      category: "Space Ambient & Lo-Fi",             youtubeId: "_PLKB8RXEPE", coverArt: "https://picsum.photos/seed/richter2/200/200"       },

  // ── Synthwave & Electronic Sci-Fi ─────────────────────────────────────────
  { id: 11, title: "Runaway (Piano)",                artist: "Kanye West",       category: "Synthwave & Electronic Sci-Fi",    youtubeId: "Bm5iA4Zupek", coverArt: "https://picsum.photos/seed/runaway/200/200"        },
  { id: 12, title: "Harder Better Faster Stronger",  artist: "Daft Punk",        category: "Synthwave & Electronic Sci-Fi",    youtubeId: "yydNF8tuVmU", coverArt: "https://picsum.photos/seed/daftpunk1/200/200"      },
  { id: 13, title: "Giorgio by Moroder",             artist: "Daft Punk",        category: "Synthwave & Electronic Sci-Fi",    youtubeId: "zhl-Cs1uKgI", coverArt: "https://picsum.photos/seed/giorgio/200/200"        },
  { id: 14, title: "Contact",                        artist: "Daft Punk",        category: "Synthwave & Electronic Sci-Fi",    youtubeId: "6KBHkFOlDqE", coverArt: "https://picsum.photos/seed/contact/200/200"        },

  // ── Classic Rock & Pop Space Anthems ──────────────────────────────────────
  { id: 15, title: "Space Oddity",                   artist: "David Bowie",      category: "Classic Rock & Pop Space Anthems",  youtubeId: "iYYRH4apXDo", coverArt: "https://picsum.photos/seed/bowie1/200/200"         },
  { id: 16, title: "Rocket Man",                     artist: "Elton John",       category: "Classic Rock & Pop Space Anthems",  youtubeId: "DtVBCG6ThDk", coverArt: "https://picsum.photos/seed/elton/200/200"          },
  { id: 17, title: "Starman",                        artist: "David Bowie",      category: "Classic Rock & Pop Space Anthems",  youtubeId: "hmHHUSxUwgA", coverArt: "https://picsum.photos/seed/bowie2/200/200"         },

  // ── Cosmic Dread & Epic Crescendos ────────────────────────────────────────
  { id: 18, title: "In the House, In a Heartbeat",   artist: "John Murphy",      category: "Cosmic Dread & Epic Crescendos",    youtubeId: "W89lxiLnBEU", coverArt: "https://picsum.photos/seed/28days/200/200"         },
  { id: 19, title: "Also Sprach Zarathustra",        artist: "Richard Strauss",  category: "Cosmic Dread & Epic Crescendos",    youtubeId: "dVUDCMBs7Bw", coverArt: "https://picsum.photos/seed/zarathustra/200/200"    },
  { id: 20, title: "Interstellar Main Theme",        artist: "Hans Zimmer",      category: "Cosmic Dread & Epic Crescendos",    youtubeId: "UDVtMYqUAyw", coverArt: "https://picsum.photos/seed/interstellar/200/200"   },
  { id: 21, title: "No Time for Caution (Docking)",  artist: "Hans Zimmer",      category: "Cosmic Dread & Epic Crescendos",    youtubeId: "lM8el5T_k34", coverArt: "https://picsum.photos/seed/docking/200/200"        },

  // ── Indian Acoustic & Historical Epics ────────────────────────────────────
  { id: 22, title: "Dil Se Re",                      artist: "A.R. Rahman",      category: "Indian Acoustic & Historical Epics", youtubeId: "XBtMJMYH9go", coverArt: "https://picsum.photos/seed/rahman1/200/200"        },
  { id: 23, title: "Vande Mataram",                  artist: "A.R. Rahman",      category: "Indian Acoustic & Historical Epics", youtubeId: "iEbH1A4LNQQ", coverArt: "https://picsum.photos/seed/rahman2/200/200"        },
  { id: 24, title: "Kehna Hi Kya",                   artist: "A.R. Rahman",      category: "Indian Acoustic & Historical Epics", youtubeId: "0y8iSBVLF14", coverArt: "https://picsum.photos/seed/kehna/200/200"          },
  { id: 25, title: "Lagaan Theme",                   artist: "A.R. Rahman",      category: "Indian Acoustic & Historical Epics", youtubeId: "SaEKMpGJal8", coverArt: "https://picsum.photos/seed/lagaan/200/200"          },
];
