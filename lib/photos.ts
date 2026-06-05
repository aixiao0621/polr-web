export type Photo = {
  /** Stable id used for routing & keys */
  id: string;
  /** Path under /public */
  src: string;
  /** Short evocative title shown on the polaroid caption line */
  title: string;
  /** Location / sub-caption */
  place: string;
  /** Year or full date string */
  date: string;
  /** Editorial category used for the filter rail */
  category: "architecture" | "street" | "landscape" | "portrait" | "still";
  /** Optional longer note revealed in the lightbox */
  note?: string;
  /** Faux camera metadata for the editorial footer */
  exif?: {
    camera?: string;
    film?: string;
    focal?: string;
    aperture?: string;
    shutter?: string;
    iso?: string;
  };
};

/**
 * Demo data set.
 * Reuses a small pool of supplied photographs so we can evaluate the
 * layout & motion design. Several cities now hold multiple frames so the
 * atlas clustering can be exercised.
 */
const HERO = "/photos/architecture-stairs.jpg";
const P1 = "/photos/20260603-073253.jpg";
const P2 = "/photos/20260603-073329.jpg";
const P3 = "/photos/20260603-073407.jpg";
const P4 = "/photos/20260603-073412.jpg";
const P5 = "/photos/20260603-073418.jpg";

export const photos: Photo[] = [
  {
    id: "stairwell-01",
    src: HERO,
    title: "Ascension",
    place: "Chongqing · Liziba",
    date: "2026-04-12",
    category: "architecture",
    note: "Morning light folding down a spiral stairwell — the geometry doing all the talking.",
    exif: {
      camera: "Leica M6",
      film: "Kodak Portra 400",
      focal: "35mm",
      aperture: "ƒ/2.8",
      shutter: "1/125",
      iso: "400",
    },
  },
  {
    id: "stairwell-01b",
    src: P1,
    title: "Cable Car Hour",
    place: "Chongqing · Hongyadong",
    date: "2026-04-09",
    category: "street",
    note: "The city stacked on itself, lights coming up through the river haze.",
    exif: {
      camera: "Leica M6",
      film: "Cinestill 800T",
      focal: "35mm",
      aperture: "ƒ/2",
      shutter: "1/60",
      iso: "800",
    },
  },
  {
    id: "stairwell-02",
    src: HERO,
    title: "Quiet Geometry",
    place: "Hong Kong · Quarry Bay",
    date: "2026-03-22",
    category: "architecture",
    note: "A study in repetition. Concrete, shadow, and the patience of an empty hallway.",
    exif: {
      camera: "Leica M6",
      film: "Ilford HP5",
      focal: "28mm",
      aperture: "ƒ/4",
      shutter: "1/60",
      iso: "400",
    },
  },
  {
    id: "stairwell-02b",
    src: P2,
    title: "Monster Building",
    place: "Hong Kong · Quarry Bay",
    date: "2026-03-21",
    category: "architecture",
    note: "Looking up into the well of windows until the sky became a small square.",
    exif: {
      camera: "Nikon FM2",
      film: "Tri-X 400",
      focal: "24mm",
      aperture: "ƒ/5.6",
      shutter: "1/125",
      iso: "400",
    },
  },
  {
    id: "stairwell-02c",
    src: P3,
    title: "Neon Descent",
    place: "Hong Kong · Sheung Wan",
    date: "2025-11-18",
    category: "street",
    note: "Down the escalator into a warmer, louder evening.",
    exif: {
      camera: "Contax T2",
      film: "Cinestill 800T",
      focal: "38mm",
      aperture: "ƒ/2.8",
      shutter: "1/90",
      iso: "800",
    },
  },
  {
    id: "stairwell-03",
    src: HERO,
    title: "Threshold",
    place: "Suzhou · Pingjiang",
    date: "2025-09-15",
    category: "landscape",
    note: "The moment before stepping through — held a little longer than necessary.",
    exif: {
      camera: "Hasselblad 500C",
      film: "Fuji Pro 400H",
      focal: "80mm",
      aperture: "ƒ/5.6",
      shutter: "1/250",
      iso: "400",
    },
  },
  {
    id: "stairwell-04",
    src: HERO,
    title: "Long Way Down",
    place: "Shanghai · The Bund",
    date: "2025-09-13",
    category: "street",
    note: "Found this descending into the old town. Nobody around but the echo.",
    exif: {
      camera: "Contax T2",
      film: "Cinestill 800T",
      focal: "38mm",
      aperture: "ƒ/2.8",
      shutter: "1/90",
      iso: "800",
    },
  },
  {
    id: "stairwell-04b",
    src: P4,
    title: "Glass & Rain",
    place: "Shanghai · Lujiazui",
    date: "2025-06-07",
    category: "architecture",
    note: "Towers dissolving into low cloud — the river only a rumour below.",
    exif: {
      camera: "Mamiya 7",
      film: "Kodak Ektar 100",
      focal: "65mm",
      aperture: "ƒ/4",
      shutter: "1/250",
      iso: "100",
    },
  },
  {
    id: "stairwell-04c",
    src: P5,
    title: "Lane 1933",
    place: "Shanghai · Hongkou",
    date: "2024-10-04",
    category: "still",
    note: "Spiral ramps of an old slaughterhouse, now only light moves through them.",
    exif: {
      camera: "Rolleiflex 2.8F",
      film: "Fuji Acros 100",
      focal: "80mm",
      aperture: "ƒ/5.6",
      shutter: "1/125",
      iso: "100",
    },
  },
  {
    id: "stairwell-05",
    src: HERO,
    title: "Soft Concrete",
    place: "Xi'an · Beilin",
    date: "2025-06-05",
    category: "still",
    note: "Texture as subject. Letting the wall be the whole frame.",
    exif: {
      camera: "Leica M6",
      film: "Kodak Gold 200",
      focal: "50mm",
      aperture: "ƒ/8",
      shutter: "1/500",
      iso: "200",
    },
  },
  {
    id: "stairwell-06",
    src: HERO,
    title: "Vertigo",
    place: "Beijing · Hutong",
    date: "2024-10-01",
    category: "architecture",
    note: "Looking up until the building seemed to lean back at me.",
    exif: {
      camera: "Nikon FM2",
      film: "Tri-X 400",
      focal: "24mm",
      aperture: "ƒ/5.6",
      shutter: "1/125",
      iso: "400",
    },
  },
  {
    id: "stairwell-06b",
    src: P1,
    title: "Drum Tower Dusk",
    place: "Beijing · Gulou",
    date: "2024-07-19",
    category: "street",
    note: "Bicycles and grey brick, the old city breathing out at the end of the day.",
    exif: {
      camera: "Olympus OM-1",
      film: "Portra 800",
      focal: "50mm",
      aperture: "ƒ/2",
      shutter: "1/60",
      iso: "800",
    },
  },
  {
    id: "stairwell-07",
    src: HERO,
    title: "Last Landing",
    place: "Chengdu · Kuanzhai",
    date: "2024-07-16",
    category: "portrait",
    note: "Where the staircase finally gives up and lets the sky in.",
    exif: {
      camera: "Mamiya 7",
      film: "Kodak Ektar 100",
      focal: "65mm",
      aperture: "ƒ/4",
      shutter: "1/250",
      iso: "100",
    },
  },
  {
    id: "stairwell-08",
    src: HERO,
    title: "Half Light",
    place: "Hangzhou · West Lake",
    date: "2024-04-11",
    category: "street",
    note: "The hour when the walls remember the day's warmth.",
    exif: {
      camera: "Olympus OM-1",
      film: "Portra 800",
      focal: "50mm",
      aperture: "ƒ/2",
      shutter: "1/60",
      iso: "800",
    },
  },
  {
    id: "stairwell-08b",
    src: P2,
    title: "Six Harmonies",
    place: "Hangzhou · Qiantang",
    date: "2023-11-26",
    category: "landscape",
    note: "An old pagoda half-swallowed by mist over the river.",
    exif: {
      camera: "Hasselblad 500C",
      film: "Fuji Pro 400H",
      focal: "80mm",
      aperture: "ƒ/5.6",
      shutter: "1/250",
      iso: "400",
    },
  },
  {
    id: "stairwell-09",
    src: HERO,
    title: "Echoes",
    place: "Guangzhou · Liwan",
    date: "2023-08-14",
    category: "landscape",
    note: "Sound has nowhere to go here but up.",
    exif: {
      camera: "Rolleiflex 2.8F",
      film: "Fuji Acros 100",
      focal: "80mm",
      aperture: "ƒ/5.6",
      shutter: "1/125",
      iso: "100",
    },
  },
  {
    id: "stairwell-09b",
    src: P3,
    title: "Arcade Light",
    place: "Guangzhou · Enning",
    date: "2023-08-12",
    category: "street",
    note: "Qilou arcades, columns marching off into the warm dark.",
    exif: {
      camera: "Contax T2",
      film: "Kodak Gold 200",
      focal: "38mm",
      aperture: "ƒ/2.8",
      shutter: "1/90",
      iso: "200",
    },
  },
];


/**
 * Approximate position of each city on the abstract China map,
 * expressed as a percentage of the map canvas (x: west→east, y: north→south),
 * matching the MAP viewBox of 1000 × 700.
 * Intentionally loose — the atlas is meant to feel atmospheric, not precise.
 */
export const cityCoords: Record<string, { x: number; y: number }> = {
  Beijing: { x: 70, y: 37 },
  "Xi'an": { x: 57, y: 52 },
  Chengdu: { x: 49, y: 63 },
  Chongqing: { x: 54, y: 68 },
  Suzhou: { x: 74, y: 59 },
  Shanghai: { x: 80, y: 62 },
  Hangzhou: { x: 76, y: 67 },
  Guangzhou: { x: 63, y: 84 },
  "Hong Kong": { x: 68, y: 88 },
};

/** Display names for the atlas labels (Chinese characters for flavour). */
export const cityLabels: Record<string, string> = {
  Beijing: "北京",
  "Xi'an": "西安",
  Chengdu: "成都",
  Chongqing: "重庆",
  Suzhou: "苏州",
  Shanghai: "上海",
  Hangzhou: "杭州",
  Guangzhou: "广州",
  "Hong Kong": "香港",
};

/** Derive the city from a "City · District" place string. */
export function cityOf(place: string): string {
  return place.split("·")[0].trim();
}

/**
 * Simplified, dream-like silhouette of mainland China (viewBox 0 0 1000 700).
 * Not cartographically exact — just enough to read as "中国".
 */
export const CHINA_PATH =
  "M120,200 L200,150 L280,195 L345,160 L460,150 L560,120 L645,150 " +
  "L725,118 L820,88 L905,110 L952,160 L908,200 L858,182 L800,238 L762,268 " +
  "L792,300 L762,332 L780,400 L782,436 L762,470 L740,500 L702,540 L680,582 " +
  "L662,610 L640,600 L622,620 L562,610 L542,642 L500,650 L460,612 L400,600 " +
  "L340,576 L295,556 L250,500 L182,462 L142,420 L122,360 L140,300 Z";

/** Outlying islands, drawn faintly beside the mainland (same viewBox). */
export const CHINA_ISLANDS = [
  // Hainan
  "M560,648 q22,-6 26,16 q-4,22 -28,18 q-16,-18 2,-34 Z",
  // Taiwan
  "M806,548 q16,14 6,58 q-18,-10 -10,-52 Z",
];
