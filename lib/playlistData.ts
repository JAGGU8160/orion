export interface Song {
  id: number;
  title: string;
  artist: string;
  category: string;
  url: string;
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
  { id: 1,  title: "Time",                          artist: "Hans Zimmer",       category: "Cinematic & Orchestral",            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",  coverArt: "https://picsum.photos/seed/zimmer-time/200/200"    },
  { id: 2,  title: "Day One",                       artist: "Hans Zimmer",       category: "Cinematic & Orchestral",            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",  coverArt: "https://picsum.photos/seed/dayone/200/200"         },
  { id: 3,  title: "Experience",                    artist: "Ludovico Einaudi",  category: "Cinematic & Orchestral",            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",  coverArt: "https://picsum.photos/seed/einaudi/200/200"        },
  { id: 4,  title: "Solas",                         artist: "Jamie Duffy",       category: "Cinematic & Orchestral",            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",  coverArt: "https://picsum.photos/seed/solas/200/200"          },
  { id: 5,  title: "First Step",                    artist: "Hans Zimmer",       category: "Cinematic & Orchestral",            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",  coverArt: "https://picsum.photos/seed/firststep/200/200"      },
  { id: 6,  title: "Elegy for the Arctic",          artist: "Ludovico Einaudi",  category: "Cinematic & Orchestral",            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",  coverArt: "https://picsum.photos/seed/arctic/200/200"         },

  // ── Space Ambient & Lo-Fi ──────────────────────────────────────────────────
  { id: 7,  title: "Weightless",                    artist: "Marconi Union",     category: "Space Ambient & Lo-Fi",             url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",  coverArt: "https://picsum.photos/seed/weightless/200/200"     },
  { id: 8,  title: "Comptine d'un autre été",       artist: "Yann Tiersen",      category: "Space Ambient & Lo-Fi",             url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",  coverArt: "https://picsum.photos/seed/tiersen/200/200"        },
  { id: 9,  title: "Divenire",                      artist: "Ludovico Einaudi",  category: "Space Ambient & Lo-Fi",             url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",  coverArt: "https://picsum.photos/seed/divenire/200/200"       },
  { id: 10, title: "Midnight Observatory",          artist: "Lofi Cosmos",       category: "Space Ambient & Lo-Fi",             url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3", coverArt: "https://picsum.photos/seed/observatory/200/200"    },

  // ── Synthwave & Electronic Sci-Fi ─────────────────────────────────────────
  { id: 11, title: "Runaway",                       artist: "Kanye West",        category: "Synthwave & Electronic Sci-Fi",    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3", coverArt: "https://picsum.photos/seed/runaway/200/200"        },
  { id: 12, title: "Harder Better Faster Stronger", artist: "Daft Punk",         category: "Synthwave & Electronic Sci-Fi",    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3", coverArt: "https://picsum.photos/seed/daftpunk1/200/200"      },
  { id: 13, title: "Giorgio by Moroder",            artist: "Daft Punk",         category: "Synthwave & Electronic Sci-Fi",    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3", coverArt: "https://picsum.photos/seed/giorgio/200/200"        },
  { id: 14, title: "Outrun the Stars",              artist: "Perturbator",       category: "Synthwave & Electronic Sci-Fi",    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3", coverArt: "https://picsum.photos/seed/synthwave/200/200"      },

  // ── Classic Rock & Pop Space Anthems ─────────────────────────────────────
  { id: 15, title: "Space Oddity",                  artist: "David Bowie",       category: "Classic Rock & Pop Space Anthems",  url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3", coverArt: "https://picsum.photos/seed/bowie1/200/200"         },
  { id: 16, title: "Rocket Man",                    artist: "Elton John",        category: "Classic Rock & Pop Space Anthems",  url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3", coverArt: "https://picsum.photos/seed/elton/200/200"          },
  { id: 17, title: "Starman",                       artist: "David Bowie",       category: "Classic Rock & Pop Space Anthems",  url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3", coverArt: "https://picsum.photos/seed/bowie2/200/200"         },

  // ── Cosmic Dread & Epic Crescendos ────────────────────────────────────────
  { id: 18, title: "In the House, In a Heartbeat",  artist: "John Murphy",       category: "Cosmic Dread & Epic Crescendos",    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",  coverArt: "https://picsum.photos/seed/28days/200/200"         },
  { id: 19, title: "Me and the Devil (Instrumental)", artist: "Soap&Skin",       category: "Cosmic Dread & Epic Crescendos",    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",  coverArt: "https://picsum.photos/seed/devil/200/200"          },
  { id: 20, title: "I Believe",                     artist: "Yoav",              category: "Cosmic Dread & Epic Crescendos",    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",  coverArt: "https://picsum.photos/seed/ibelieve/200/200"       },
  { id: 21, title: "On the Nature of Daylight",     artist: "Max Richter",       category: "Cosmic Dread & Epic Crescendos",    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",  coverArt: "https://picsum.photos/seed/richter/200/200"        },
  { id: 22, title: "Also Sprach Zarathustra",       artist: "Richard Strauss",   category: "Cosmic Dread & Epic Crescendos",    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",  coverArt: "https://picsum.photos/seed/zarathustra/200/200"    },

  // ── Indian Acoustic & Historical Epics ────────────────────────────────────
  { id: 23, title: "Dil Se Re",                     artist: "A.R. Rahman",       category: "Indian Acoustic & Historical Epics", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",  coverArt: "https://picsum.photos/seed/rahman1/200/200"        },
  { id: 24, title: "Vande Mataram",                 artist: "A.R. Rahman",       category: "Indian Acoustic & Historical Epics", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",  coverArt: "https://picsum.photos/seed/rahman2/200/200"        },
  { id: 25, title: "Lagaan Theme",                  artist: "A.R. Rahman",       category: "Indian Acoustic & Historical Epics", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",  coverArt: "https://picsum.photos/seed/lagaan/200/200"         },
  { id: 26, title: "Kehna Hi Kya",                  artist: "A.R. Rahman",       category: "Indian Acoustic & Historical Epics", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",  coverArt: "https://picsum.photos/seed/kehna/200/200"          },
];
