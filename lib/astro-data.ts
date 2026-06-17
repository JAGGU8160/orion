export type AstroCategoryKey =
  | "planetary" | "exoplanet" | "stellar" | "cosmology"
  | "gravity" | "mission" | "transient" | "instrument";

export interface AstroEntry {
  id: string;
  year: number;
  date: string;
  title: string;
  summary: string;
  category: AstroCategoryKey;
  source: string;
  milestone: boolean;
  img: boolean;
  seq: number;
}

export interface AstroCategory { label: string; hue: number; glyph: string }
export interface AstroEra      { id: string; label: string; from: number; to: number }

export const ASTRO_CATEGORIES: Record<AstroCategoryKey, AstroCategory> = {
  planetary:  { label: "Planetary",             hue: 168, glyph: "◐" },
  exoplanet:  { label: "Exoplanets",            hue: 270, glyph: "✦" },
  stellar:    { label: "Stars & Stellar",       hue: 42,  glyph: "★" },
  cosmology:  { label: "Galaxies & Cosmology",  hue: 222, glyph: "✸" },
  gravity:    { label: "Black Holes & Gravity", hue: 312, glyph: "◉" },
  mission:    { label: "Missions & Spacecraft", hue: 205, glyph: "▲" },
  transient:  { label: "Comets & Transients",   hue: 24,  glyph: "☄" },
  instrument: { label: "Instruments & Sites",   hue: 152, glyph: "⬡" },
};

export const ASTRO_ERAS: AstroEra[] = [
  { id: "eye",    label: "Era of the Eye",      from: 1800, to: 1899 },
  { id: "modern", label: "Modern Physics",      from: 1900, to: 1945 },
  { id: "space",  label: "The Space Age",       from: 1946, to: 1989 },
  { id: "great",  label: "Great Observatories", from: 1990, to: 2009 },
  { id: "new",    label: "The New Cosmos",      from: 2010, to: 2026 },
];

// ── Deterministic RNG (mulberry32, seed 20260611) ─────────────────
function mulberry32(a: number): () => number {
  return function (): number {
    a = a | 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── 76 curated real milestones ────────────────────────────────────
type CuratedRow = [number, string, string, string, AstroCategoryKey, string, boolean, boolean];
const CURATED: CuratedRow[] = [
  [1801,"Jan 1","Ceres — the first asteroid — discovered","Giuseppe Piazzi spots a moving 'star' from Palermo on the first night of the new century. Lost in the Sun's glare, it is recovered after Carl Gauss invents a new orbit-fitting method to predict where to look.","planetary","Palermo Observatory",true,true],
  [1802,"Mar 28","Pallas found, hinting at a belt","Heinrich Olbers discovers a second body near Ceres' orbit and proposes these may be fragments of a shattered planet — the first idea of an asteroid belt.","planetary","Bremen",false,false],
  [1838,"Oct","First measurement of a star's distance","Friedrich Bessel measures the parallax of 61 Cygni, putting it at roughly 10 light-years — the first time the true distance to a star is known.","stellar","Königsberg Observatory",true,false],
  [1843,"Mar","The Great March Comet blazes overhead","One of the brightest comets in recorded history becomes visible in daylight, its tail stretching across a huge arc of sky.","transient","Worldwide",false,true],
  [1846,"Sep 23","Neptune found by mathematics","Urbain Le Verrier predicts an unseen planet from irregularities in Uranus' orbit; Johann Galle finds it within 1° of the prediction the very same night.","planetary","Berlin Observatory",true,true],
  [1859,"Sep 1","The Carrington Event — a solar superstorm","Richard Carrington witnesses a white-light solar flare; the resulting geomagnetic storm sets telegraph lines sparking and paints aurorae as far south as the Caribbean.","stellar","Redhill, England",true,true],
  [1864,"Aug","Spectroscope reveals a nebula is gas","William Huggins splits the light of a planetary nebula and finds bright emission lines — proof that some nebulae are glowing gas, not unresolved stars.","cosmology","Tulse Hill Observatory",false,false],
  [1868,"Aug 18","Helium discovered in the Sun","During a solar eclipse, a new yellow spectral line is seen in the chromosphere. The element behind it — helium — won't be found on Earth for another 27 years.","stellar","Guntur, India",true,false],
  [1877,"Aug","Mars' two moons spotted","Asaph Hall discovers Phobos and Deimos at the U.S. Naval Observatory during a favorable Mars opposition.","planetary","U.S. Naval Observatory",true,false],
  [1888,"","The New General Catalogue published","J.L.E. Dreyer compiles 7,840 deep-sky objects into the NGC — numbering that astronomers still use for galaxies and nebulae today.","cosmology","Armagh Observatory",false,false],
  [1894,"","Lowell Observatory founded","Percival Lowell builds an observatory in Flagstaff, Arizona to study Mars — and later launches the search that finds Pluto.","instrument","Flagstaff, Arizona",false,false],
  [1908,"Jun 30","The Tunguska impact flattens a forest","An object — likely a small comet or asteroid — explodes over Siberia, levelling 2,000 km² of forest in the largest impact event of recorded history.","transient","Tunguska, Siberia",true,true],
  [1912,"","Henrietta Leavitt's standard candle","Studying Cepheid variables in the Magellanic Clouds, Leavitt finds their pulsation period tracks their brightness — giving astronomy its first reliable cosmic yardstick.","stellar","Harvard College Observatory",true,false],
  [1915,"Nov 25","Einstein completes general relativity","Gravity is recast as the curvature of spacetime — the framework behind black holes, the expanding universe, and gravitational waves.","gravity","Berlin",true,false],
  [1916,"","Schwarzschild describes a black hole","Karl Schwarzschild solves Einstein's equations and finds a radius from within which nothing can escape — the event horizon.","gravity","Eastern Front / Göttingen",true,false],
  [1919,"May 29","Eclipse expedition confirms relativity","Arthur Eddington measures starlight bending around the eclipsed Sun, matching Einstein's prediction and making him world-famous overnight.","gravity","Príncipe & Sobral",true,true],
  [1920,"Apr 26","The Great Debate over the size of the cosmos","Shapley and Curtis argue whether spiral nebulae lie within the Milky Way or are 'island universes' far beyond it. The data isn't yet good enough to decide.","cosmology","Smithsonian, Washington",false,false],
  [1923,"Oct 6","Hubble proves galaxies lie beyond the Milky Way","Edwin Hubble finds a Cepheid in the Andromeda 'nebula', measures its distance, and shows it is a separate galaxy — the universe just got vastly larger.","cosmology","Mount Wilson Observatory",true,true],
  [1925,"","Cecilia Payne: stars are mostly hydrogen","Her doctoral thesis shows the Sun is overwhelmingly hydrogen and helium — overturning the belief that stars match Earth's composition.","stellar","Harvard College Observatory",true,false],
  [1929,"","Hubble's Law: the universe is expanding","Galaxies recede faster the farther away they are. The relationship implies the cosmos is expanding from a hot, dense beginning.","cosmology","Mount Wilson Observatory",true,false],
  [1930,"Feb 18","Pluto discovered at Lowell","Clyde Tombaugh, comparing photographic plates with a blink comparator, spots the faint mover that becomes the ninth planet.","planetary","Lowell Observatory",true,true],
  [1932,"","Jansky hears the Milky Way's radio hiss","Karl Jansky traces a persistent static to the centre of the galaxy, founding the science of radio astronomy.","instrument","Bell Labs, New Jersey",true,false],
  [1933,"","Zwicky infers dark matter in Coma","Galaxies in the Coma Cluster move too fast to be held together by visible mass alone. Fritz Zwicky calls the missing mass 'dunkle Materie'.","cosmology","Caltech",true,false],
  [1938,"","How stars shine: the proton-proton chain","Hans Bethe works out the nuclear fusion reactions that power the Sun and other stars.","stellar","Cornell University",false,false],
  [1948,"Jun 3","The 200-inch Hale Telescope sees first light","For decades the largest telescope on Earth, the Hale on Palomar Mountain defines a generation of extragalactic astronomy.","instrument","Palomar Observatory",true,true],
  [1957,"Oct 4","Sputnik 1 opens the Space Age","The Soviet Union launches the first artificial satellite; its beeping signal is heard by radio operators worldwide.","mission","Baikonur Cosmodrome",true,true],
  [1958,"","Explorer 1 finds the Van Allen belts","America's first satellite detects belts of charged particles trapped by Earth's magnetic field.","mission","Cape Canaveral",true,false],
  [1959,"Oct 7","Luna 3 photographs the Moon's far side","For the first time humanity sees the hemisphere of the Moon forever turned away from Earth.","mission","Soviet Space Program",true,true],
  [1963,"","Quasars: the most luminous objects yet","Maarten Schmidt decodes the redshift of 3C 273, revealing a galaxy-bright source billions of light-years away — powered by a supermassive black hole.","gravity","Palomar Observatory",true,false],
  [1965,"May","The cosmic microwave background found","Penzias and Wilson detect an inescapable hiss from all directions — the cooled afterglow of the Big Bang, clinching the hot-origin model.","cosmology","Bell Labs, Holmdel",true,true],
  [1967,"Nov 28","Jocelyn Bell Burnell discovers pulsars","A ticking radio signal turns out to be a rapidly spinning neutron star — a city-sized stellar corpse beaming like a lighthouse.","stellar","Cambridge (Mullard)",true,false],
  [1969,"Jul 20","Apollo 11: humans walk on the Moon","Neil Armstrong and Buzz Aldrin land in the Sea of Tranquillity as 600 million people watch on Earth.","mission","NASA",true,true],
  [1971,"","Cygnus X-1: first strong black-hole case","An X-ray source orbiting a blue supergiant is too massive to be a neutron star — the first widely accepted stellar black hole.","gravity","Uhuru X-ray satellite",true,false],
  [1976,"Jul 20","Viking 1 lands on Mars","The first fully successful Mars lander returns colour panoramas of a rusty desert and runs experiments searching for life.","mission","NASA / JPL",true,true],
  [1977,"Sep 5","Voyager 1 & 2 begin the grand tour","Launched weeks apart, the Voyagers will visit all four giant planets and carry the Golden Record toward interstellar space.","mission","NASA / JPL",true,true],
  [1977,"Mar 10","Rings discovered around Uranus","Astronomers watching Uranus pass in front of a star see it blink several times — narrow rings, the second ring system found.","planetary","Kuiper Airborne Obs.",false,false],
  [1979,"","The first gravitational lens observed","The 'Twin Quasar' turns out to be one quasar split into two images by an intervening galaxy's gravity, exactly as relativity predicts.","gravity","Kitt Peak / Jodrell Bank",false,false],
  [1987,"Feb 23","Supernova 1987A: a star next door explodes","The closest naked-eye supernova in nearly 400 years erupts in the Large Magellanic Cloud — and detectors catch its neutrino burst.","stellar","Las Campanas Observatory",true,true],
  [1989,"Aug 25","Voyager 2 reaches Neptune","The only spacecraft ever to visit Neptune reveals great dark storms and the geysers of its moon Triton, then heads for the stars.","mission","NASA / JPL",true,true],
  [1989,"Nov 18","COBE launches to map the Big Bang's glow","The Cosmic Background Explorer will measure the CMB spectrum and its tiny temperature ripples.","mission","NASA",false,false],
  [1990,"Apr 24","Hubble Space Telescope reaches orbit","Despite an early mirror flaw, Hubble becomes the most productive observatory in history after a 1993 servicing mission corrects its vision.","instrument","NASA / ESA",true,true],
  [1992,"Apr 23","COBE sees ripples in the infant universe","Tiny temperature variations in the CMB are the seeds of all galaxies — called by one scientist 'looking at the face of God'.","cosmology","NASA (COBE)",true,true],
  [1992,"","First exoplanets — orbiting a pulsar","Wolszczan and Frail find planets around pulsar PSR B1257+12, the first confirmed worlds beyond the Solar System.","exoplanet","Arecibo Observatory",true,false],
  [1994,"Jul 16","Comet Shoemaker-Levy 9 slams into Jupiter","A string of comet fragments crashes into Jupiter over six days, leaving Earth-sized scars and a front-row lesson in cosmic impacts.","transient","Worldwide / Hubble",true,true],
  [1995,"Oct 6","51 Pegasi b: first planet around a Sun-like star","Mayor and Queloz detect a 'hot Jupiter' whipping around its star every four days, opening the floodgates of exoplanet discovery.","exoplanet","Haute-Provence Observatory",true,false],
  [1995,"Dec","The Hubble Deep Field stares into the void","A ten-day exposure of an 'empty' speck of sky reveals some 3,000 galaxies — a core sample of the universe back to its youth.","cosmology","Hubble (STScI)",true,true],
  [1997,"Jul 4","Mars Pathfinder & Sojourner roll onto Mars","The first Mars rover, a microwave-sized robot, proves cheap, fast missions can explore another world.","mission","NASA / JPL",true,true],
  [1998,"","The universe's expansion is accelerating","Two teams studying distant supernovae find the cosmos is speeding apart, driven by a mysterious 'dark energy'. (Nobel Prize, 2011.)","cosmology","High-Z & SCP teams",true,false],
  [2003,"Aug 25","Spitzer Space Telescope opens infrared eyes","The last of NASA's Great Observatories peers through dust to study forming stars, distant galaxies and exoplanet atmospheres.","instrument","NASA / JPL",false,true],
  [2004,"Jul 1","Cassini enters orbit at Saturn","Beginning 13 years at Saturn, Cassini maps the rings, discovers plumes on Enceladus and drops the Huygens probe onto Titan.","mission","NASA / ESA / ASI",true,true],
  [2005,"Jan 14","Huygens lands on Titan","Europe's probe parachutes through an orange haze to the surface of Saturn's largest moon — the most distant landing ever made.","mission","ESA",true,true],
  [2006,"Aug 24","Pluto reclassified as a dwarf planet","The IAU's new definition of 'planet' leaves Pluto out, sparking a debate that still divides classrooms and dinner tables.","planetary","IAU, Prague",true,false],
  [2009,"Mar 7","Kepler launches to find Earth-like worlds","Staring at 150,000 stars for tiny dips in brightness, Kepler will discover thousands of exoplanets and reveal that planets are everywhere.","mission","NASA",true,true],
  [2012,"Aug 6","Curiosity's sky-crane landing on Mars","A one-tonne nuclear-powered rover is lowered onto Gale Crater by rocket crane, then finds evidence of an ancient habitable lake.","mission","NASA / JPL",true,true],
  [2013,"Sep 12","Voyager 1 enters interstellar space","Thirty-six years after launch, Voyager 1 crosses the heliopause — the first human-made object to leave the Sun's bubble.","mission","NASA / JPL",true,false],
  [2014,"Nov 12","Philae lands on a comet","Rosetta's washing-machine-sized lander touches down on comet 67P, the first soft landing on a comet's nucleus.","mission","ESA",true,true],
  [2015,"Jul 14","New Horizons flies past Pluto","After a 9-year, 5-billion-km journey, the probe reveals Pluto's heart-shaped plain, ice mountains and blue-hazed sky.","mission","NASA / JHU-APL",true,true],
  [2016,"Feb 11","LIGO detects gravitational waves","A ripple in spacetime from two merging black holes 1.3 billion light-years away confirms Einstein's last great prediction. (Nobel, 2017.)","gravity","LIGO Collaboration",true,true],
  [2016,"Aug 24","Proxima b: a planet around the nearest star","A roughly Earth-mass world is found in the habitable zone of Proxima Centauri, just 4.2 light-years away.","exoplanet","ESO (La Silla)",true,false],
  [2017,"Aug 17","Kilonova: a multi-messenger spectacle","Gravitational waves and light from a neutron-star merger are seen together, revealing where much of the universe's gold is forged.","gravity","LIGO/Virgo + 70 observatories",true,true],
  [2017,"Oct 19","'Oumuamua: a visitor from another star","A cigar-shaped object on a hyperbolic orbit becomes the first interstellar object ever detected passing through the Solar System.","transient","Pan-STARRS, Hawaii",true,false],
  [2017,"Feb 22","TRAPPIST-1: seven Earth-sized worlds","A nearby cool dwarf star is found to host seven rocky planets, several in the temperate zone — a tantalising system for the search for life.","exoplanet","TRAPPIST / Spitzer",true,true],
  [2019,"Apr 10","First image of a black hole","The Event Horizon Telescope unveils the glowing ring around M87*, a black hole 6.5 billion times the Sun's mass.","gravity","Event Horizon Telescope",true,true],
  [2020,"Oct 20","OSIRIS-REx grabs a piece of asteroid Bennu","NASA's probe taps the surface of Bennu and stows a sample to bring home — material older than the Earth itself.","mission","NASA / Univ. Arizona",true,true],
  [2021,"Dec 25","James Webb Space Telescope launches","The largest space telescope ever flown unfolds a 6.5-metre golden mirror to see the first galaxies and probe exoplanet air.","instrument","NASA / ESA / CSA",true,true],
  [2022,"Jul 12","Webb's first images stun the world","Galaxies lensed into arcs, a dying star's shells, and the deepest infrared view of the cosmos yet — JWST delivers on its promise.","cosmology","JWST (STScI)",true,true],
  [2022,"Sep 26","DART deliberately crashes into an asteroid","Humanity's first planetary-defence test slams a spacecraft into the moonlet Dimorphos and measurably changes its orbit.","mission","NASA / JHU-APL",true,true],
  [2022,"May 12","Image of our galaxy's central black hole","The Event Horizon Telescope images Sagittarius A*, the 4-million-solar-mass black hole at the heart of the Milky Way.","gravity","Event Horizon Telescope",true,true],
  [2023,"Aug 23","Chandrayaan-3 lands near the lunar south pole","India becomes the first nation to land near the Moon's south pole, deploying the Pragyan rover onto the dusty highlands.","mission","ISRO",true,true],
  [2023,"Jul 1","Euclid launches to map dark energy","ESA's telescope begins a six-year survey of billions of galaxies to chart how dark matter and dark energy shaped the cosmos.","instrument","ESA",false,true],
  [2024,"Apr 8","Total solar eclipse crosses North America","The Moon's shadow sweeps from Mexico to Canada as tens of millions stand in the path of totality.","transient","North America",true,true],
  [2024,"Oct 14","Europa Clipper sets sail for Jupiter's icy moon","NASA launches its largest planetary spacecraft to study whether Europa's subsurface ocean could host life.","mission","NASA / JPL",true,true],
  [2025,"Jul 3","Vera C. Rubin Observatory releases first images","With the largest digital camera ever built, Rubin begins a 10-year survey to film the entire southern sky every few nights.","instrument","Rubin Observatory, Chile",true,true],
  [2025,"Mar 11","SPHEREx begins an all-sky infrared survey","NASA's new telescope will map the colour of the entire sky in 102 infrared bands, probing the universe's earliest moments.","instrument","NASA / JPL",false,false],
  [2026,"Mar","Hera arrives to inspect the DART impact site","ESA's Hera spacecraft reaches the Didymos asteroid pair to survey the crater left by DART and refine planetary defence.","mission","ESA",false,false],
  [2026,"May","JWST pins down an early-universe record galaxy","Spectroscopy confirms one of the most distant galaxies yet seen, its light leaving when the cosmos was under 300 million years old.","cosmology","JWST (STScI)",true,true],
];

// ── Padding templates (same logic as astro-data.js) ───────────────
function buildArchive(): AstroEntry[] {
  const records: AstroEntry[] = CURATED.map((r, i) => ({
    id: "m" + i,
    year: r[0], date: r[1], title: r[2], summary: r[3],
    category: r[4], source: r[5], milestone: r[6], img: r[7], seq: 0,
  }));

  const rnd = mulberry32(20260611);
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rnd() * arr.length)];

  const constellations = ["Orion","Cygnus","Lyra","Andromeda","Centaurus","Sagittarius","Cassiopeia","Perseus","Aquila","Hydra","Carina","Vela","Eridanus","Ophiuchus","Cetus","Draco"];
  const obsEarly = ["Greenwich Observatory","Harvard College Observatory","Yerkes Observatory","Lick Observatory","Pulkovo Observatory","Cape Observatory","Paris Observatory","Bonn Observatory"];
  const obsMid   = ["Palomar Observatory","Mount Wilson Observatory","Cerro Tololo","Kitt Peak","Jodrell Bank","Parkes Observatory","Arecibo Observatory","Lick Observatory"];
  const obsNew   = ["ESO Very Large Telescope","Keck Observatory","Gemini Observatory","ALMA","Subaru Telescope","Pan-STARRS","Zwicky Transient Facility","Gran Telescopio Canarias","Rubin Observatory"];
  const craft    = ["Mariner","Pioneer","Venera","Luna","Ranger","Surveyor","Helios","Galileo orbiter","Cassini","Mars Express","New Horizons","Juno","TESS","Gaia"];
  const detectors= ["LIGO Hanford","LIGO Livingston","Virgo","KAGRA"];
  const months   = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const obsFor = (year: number) =>
    year < 1920 ? pick(obsEarly) : year < 1980 ? pick(obsMid) : pick(obsNew);

  function template(year: number): { category: AstroCategoryKey; source: string; title: string; summary: string } {
    const T: (() => { category: AstroCategoryKey; source: string; title: string; summary: string })[] = [];
    T.push(() => ({ category: "transient", source: obsFor(year),
      title: `Comet C/${year} ${String.fromCharCode(65 + Math.floor(rnd() * 6))}${1 + Math.floor(rnd() * 4)} recovered near perihelion`,
      summary: `Astronomers recover the periodic comet on its return to the inner Solar System and refine its orbital elements from a fresh series of plates.` }));
    T.push(() => ({ category: "stellar", source: obsFor(year),
      title: `Variable star catalogued in ${pick(constellations)}`,
      summary: `A new long-period variable is logged during routine sky patrol, its light curve added to the growing photometric record.` }));
    T.push(() => ({ category: "cosmology", source: obsFor(year),
      title: `Faint spiral nebula resolved in ${pick(constellations)}`,
      summary: `Deeper exposures resolve structure in a previously catalogued nebula, adding to the census of the extragalactic sky.` }));
    T.push(() => ({ category: "planetary", source: obsFor(year),
      title: `Opposition of Mars observed and mapped`,
      summary: `A favourable opposition lets observers chart seasonal changes across the Martian surface and time the rotation of cloud features.` }));
    if (year >= 1957) T.push(() => ({ category: "mission", source: "NASA / JPL",
      title: `${pick(craft)} probe completes a deep-space telemetry pass`,
      summary: `Mission controllers receive a fresh batch of telemetry and execute a routine trajectory correction manoeuvre.` }));
    if (year >= 1995) T.push(() => ({ category: "exoplanet", source: obsFor(year),
      title: `Transit candidate confirmed around a nearby dwarf star`,
      summary: `Follow-up photometry and radial-velocity work confirm a planetary companion, adding to the catalogue of known exoplanets.` }));
    if (year >= 1962) T.push(() => ({ category: "gravity", source: obsFor(year),
      title: `X-ray binary flagged as a black-hole candidate`,
      summary: `Variability and mass estimates mark the compact object as a likely stellar-mass black hole pending further monitoring.` }));
    if (year >= 2015) T.push(() => ({ category: "gravity", source: pick(detectors),
      title: `Gravitational-wave candidate logged by ${pick(detectors)}`,
      summary: `A transient signal consistent with a compact-object merger enters the alert stream for rapid electromagnetic follow-up.` }));
    if (year >= 1948) T.push(() => ({ category: "instrument", source: obsFor(year),
      title: `New spectrograph commissioned at ${obsFor(year)}`,
      summary: `An upgraded instrument sees first light, extending the facility's reach to fainter and more distant targets.` }));
    return pick(T)();
  }

  let id = records.length;
  while (records.length < 500) {
    const u = rnd();
    const year = Math.floor(1801 + Math.pow(u, 0.55) * (2026 - 1801));
    const t = template(year);
    records.push({
      id: "g" + (id++),
      year,
      date: pick(months) + " " + (1 + Math.floor(rnd() * 27)),
      title: t.title, summary: t.summary,
      category: t.category, source: t.source,
      milestone: false,
      img: rnd() < 0.18,
      seq: 0,
    });
  }

  records.sort((a, b) => a.year - b.year || (a.milestone === b.milestone ? 0 : a.milestone ? -1 : 1));
  records.forEach((r, i) => { r.seq = i; });
  return records;
}

export const ASTRO_NEWS: AstroEntry[] = buildArchive();
