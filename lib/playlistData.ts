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
  // Cinematic & Orchestral
  { id: 1,  title: "Interstellar Main Theme", artist: "Hans Zimmer",      category: "Cinematic & Orchestral",           url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",  coverArt: "https://picsum.photos/seed/interstellar/200/200" },
  { id: 2,  title: "First Step",              artist: "Hans Zimmer",      category: "Cinematic & Orchestral",           url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",  coverArt: "https://picsum.photos/seed/firststep/200/200"    },
  { id: 3,  title: "Day One",                 artist: "Hans Zimmer",      category: "Cinematic & Orchestral",           url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",  coverArt: "https://picsum.photos/seed/dayone/200/200"       },

  // Space Ambient & Lo-Fi
  { id: 4,  title: "Weightless",              artist: "Marconi Union",    category: "Space Ambient & Lo-Fi",            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",  coverArt: "https://picsum.photos/seed/weightless/200/200"   },
  { id: 5,  title: "Music for Airports",      artist: "Brian Eno",        category: "Space Ambient & Lo-Fi",            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",  coverArt: "https://picsum.photos/seed/brianen/200/200"      },
  { id: 6,  title: "Midnight Observatory",    artist: "Lofi Cosmos",      category: "Space Ambient & Lo-Fi",            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",  coverArt: "https://picsum.photos/seed/observatory/200/200"  },

  // Synthwave & Electronic Sci-Fi
  { id: 7,  title: "Harder Better Faster",    artist: "Daft Punk",        category: "Synthwave & Electronic Sci-Fi",   url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",  coverArt: "https://picsum.photos/seed/daftpunk1/200/200"    },
  { id: 8,  title: "Giorgio by Moroder",      artist: "Daft Punk",        category: "Synthwave & Electronic Sci-Fi",   url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",  coverArt: "https://picsum.photos/seed/daftpunk2/200/200"    },
  { id: 9,  title: "Outrun the Stars",        artist: "Perturbator",      category: "Synthwave & Electronic Sci-Fi",   url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",  coverArt: "https://picsum.photos/seed/synthwave/200/200"    },

  // Classic Rock & Pop Space Anthems
  { id: 10, title: "Space Oddity",            artist: "David Bowie",      category: "Classic Rock & Pop Space Anthems", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3", coverArt: "https://picsum.photos/seed/bowie1/200/200"       },
  { id: 11, title: "Rocket Man",              artist: "Elton John",       category: "Classic Rock & Pop Space Anthems", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3", coverArt: "https://picsum.photos/seed/elton/200/200"        },
  { id: 12, title: "Starman",                 artist: "David Bowie",      category: "Classic Rock & Pop Space Anthems", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3", coverArt: "https://picsum.photos/seed/bowie2/200/200"       },

  // Cosmic Dread & Epic Crescendos
  { id: 13, title: "Also Sprach Zarathustra", artist: "Richard Strauss",  category: "Cosmic Dread & Epic Crescendos",   url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3", coverArt: "https://picsum.photos/seed/zarathustra/200/200"  },
  { id: 14, title: "The Dark Side",           artist: "Hans Zimmer",      category: "Cosmic Dread & Epic Crescendos",   url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3", coverArt: "https://picsum.photos/seed/darkside/200/200"     },
  { id: 15, title: "On the Nature of Daylight", artist: "Max Richter",    category: "Cosmic Dread & Epic Crescendos",   url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3", coverArt: "https://picsum.photos/seed/richter/200/200"      },

  // Indian Acoustic & Historical Epics
  { id: 16, title: "Dil Se Re",              artist: "A.R. Rahman",       category: "Indian Acoustic & Historical Epics", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3", coverArt: "https://picsum.photos/seed/rahman1/200/200"    },
  { id: 17, title: "Vande Mataram",          artist: "A.R. Rahman",       category: "Indian Acoustic & Historical Epics", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3", coverArt: "https://picsum.photos/seed/rahman2/200/200"    },
  { id: 18, title: "Roja Jaaneman",          artist: "A.R. Rahman",       category: "Indian Acoustic & Historical Epics", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",  coverArt: "https://picsum.photos/seed/rahman3/200/200"    },
];
