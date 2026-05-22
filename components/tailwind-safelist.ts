// This file acts as a static safelist for Tailwind CSS v4.
// Since the Tailwind v4 compiler statically scans `./components/**/*.{js,ts,jsx,tsx}`,
// writing these class strings literally ensures they are compiled into globals.css.

const OPACITIES = ["10", "20", "30", "40", "50", "60", "70", "80", "90", "100"];
const COLORS = [
  "custom-blue",
  "custom-green",
  "custom-celadon",
  "custom-coconut",
  "custom-rosewood",
  "custom-terracotta",
  "custom-almond",
  "black",
  "white"
];

// Helper to generate arrays of strings so that the compiler sees the literal strings
// Actually, since Tailwind v4 is a static compiler, let's write them as literal string arrays
// so the scanner is 100% guaranteed to find them.

export const TAILWIND_TEXT_SAFELIST = [
  // custom-blue
  "text-custom-blue/10", "text-custom-blue/20", "text-custom-blue/30", "text-custom-blue/40", "text-custom-blue/50", "text-custom-blue/60", "text-custom-blue/70", "text-custom-blue/80", "text-custom-blue/90", "text-custom-blue/100",
  "dark:text-custom-blue/10", "dark:text-custom-blue/20", "dark:text-custom-blue/30", "dark:text-custom-blue/40", "dark:text-custom-blue/50", "dark:text-custom-blue/60", "dark:text-custom-blue/70", "dark:text-custom-blue/80", "dark:text-custom-blue/90", "dark:text-custom-blue/100",

  // custom-green
  "text-custom-green/10", "text-custom-green/20", "text-custom-green/30", "text-custom-green/40", "text-custom-green/50", "text-custom-green/60", "text-custom-green/70", "text-custom-green/80", "text-custom-green/90", "text-custom-green/100",
  "dark:text-custom-green/10", "dark:text-custom-green/20", "dark:text-custom-green/30", "dark:text-custom-green/40", "dark:text-custom-green/50", "dark:text-custom-green/60", "dark:text-custom-green/70", "dark:text-custom-green/80", "dark:text-custom-green/90", "dark:text-custom-green/100",

  // custom-celadon
  "text-custom-celadon/10", "text-custom-celadon/20", "text-custom-celadon/30", "text-custom-celadon/40", "text-custom-celadon/50", "text-custom-celadon/60", "text-custom-celadon/70", "text-custom-celadon/80", "text-custom-celadon/90", "text-custom-celadon/100",
  "dark:text-custom-celadon/10", "dark:text-custom-celadon/20", "dark:text-custom-celadon/30", "dark:text-custom-celadon/40", "dark:text-custom-celadon/50", "dark:text-custom-celadon/60", "dark:text-custom-celadon/70", "dark:text-custom-celadon/80", "dark:text-custom-celadon/90", "dark:text-custom-celadon/100",

  // custom-coconut
  "text-custom-coconut/10", "text-custom-coconut/20", "text-custom-coconut/30", "text-custom-coconut/40", "text-custom-coconut/50", "text-custom-coconut/60", "text-custom-coconut/70", "text-custom-coconut/80", "text-custom-coconut/90", "text-custom-coconut/100",
  "dark:text-custom-coconut/10", "dark:text-custom-coconut/20", "dark:text-custom-coconut/30", "dark:text-custom-coconut/40", "dark:text-custom-coconut/50", "dark:text-custom-coconut/60", "dark:text-custom-coconut/70", "dark:text-custom-coconut/80", "dark:text-custom-coconut/90", "dark:text-custom-coconut/100",

  // custom-rosewood
  "text-custom-rosewood/10", "text-custom-rosewood/20", "text-custom-rosewood/30", "text-custom-rosewood/40", "text-custom-rosewood/50", "text-custom-rosewood/60", "text-custom-rosewood/70", "text-custom-rosewood/80", "text-custom-rosewood/90", "text-custom-rosewood/100",
  "dark:text-custom-rosewood/10", "dark:text-custom-rosewood/20", "dark:text-custom-rosewood/30", "dark:text-custom-rosewood/40", "dark:text-custom-rosewood/50", "dark:text-custom-rosewood/60", "dark:text-custom-rosewood/70", "dark:text-custom-rosewood/80", "dark:text-custom-rosewood/90", "dark:text-custom-rosewood/100",

  // custom-terracotta
  "text-custom-terracotta/10", "text-custom-terracotta/20", "text-custom-terracotta/30", "text-custom-terracotta/40", "text-custom-terracotta/50", "text-custom-terracotta/60", "text-custom-terracotta/70", "text-custom-terracotta/80", "text-custom-terracotta/90", "text-custom-terracotta/100",
  "dark:text-custom-terracotta/10", "dark:text-custom-terracotta/20", "dark:text-custom-terracotta/30", "dark:text-custom-terracotta/40", "dark:text-custom-terracotta/50", "dark:text-custom-terracotta/60", "dark:text-custom-terracotta/70", "dark:text-custom-terracotta/80", "dark:text-custom-terracotta/90", "dark:text-custom-terracotta/100",

  // custom-almond
  "text-custom-almond/10", "text-custom-almond/20", "text-custom-almond/30", "text-custom-almond/40", "text-custom-almond/50", "text-custom-almond/60", "text-custom-almond/70", "text-custom-almond/80", "text-custom-almond/90", "text-custom-almond/100",
  "dark:text-custom-almond/10", "dark:text-custom-almond/20", "dark:text-custom-almond/30", "dark:text-custom-almond/40", "dark:text-custom-almond/50", "dark:text-custom-almond/60", "dark:text-custom-almond/70", "dark:text-custom-almond/80", "dark:text-custom-almond/90", "dark:text-custom-almond/100",

  // black
  "text-black/10", "text-black/20", "text-black/30", "text-black/40", "text-black/50", "text-black/60", "text-black/70", "text-black/80", "text-black/90", "text-black/100",
  "dark:text-black/10", "dark:text-black/20", "dark:text-black/30", "dark:text-black/40", "dark:text-black/50", "dark:text-black/60", "dark:text-black/70", "dark:text-black/80", "dark:text-black/90", "dark:text-black/100",

  // white
  "text-white/10", "text-white/20", "text-white/30", "text-white/40", "text-white/50", "text-white/60", "text-white/70", "text-white/80", "text-white/90", "text-white/100",
  "dark:text-white/10", "dark:text-white/20", "dark:text-white/30", "dark:text-white/40", "dark:text-white/50", "dark:text-white/60", "dark:text-white/70", "dark:text-white/80", "dark:text-white/90", "dark:text-white/100"
];

export const TAILWIND_BG_SAFELIST = [
  // custom-blue
  "bg-custom-blue/10", "bg-custom-blue/20", "bg-custom-blue/30", "bg-custom-blue/40", "bg-custom-blue/50", "bg-custom-blue/60", "bg-custom-blue/70", "bg-custom-blue/80", "bg-custom-blue/90", "bg-custom-blue/100",
  "dark:bg-custom-blue/10", "dark:bg-custom-blue/20", "dark:bg-custom-blue/30", "dark:bg-custom-blue/40", "dark:bg-custom-blue/50", "dark:bg-custom-blue/60", "dark:bg-custom-blue/70", "dark:bg-custom-blue/80", "dark:bg-custom-blue/90", "dark:bg-custom-blue/100",

  // custom-green
  "bg-custom-green/10", "bg-custom-green/20", "bg-custom-green/30", "bg-custom-green/40", "bg-custom-green/50", "bg-custom-green/60", "bg-custom-green/70", "bg-custom-green/80", "bg-custom-green/90", "bg-custom-green/100",
  "dark:bg-custom-green/10", "dark:bg-custom-green/20", "dark:bg-custom-green/30", "dark:bg-custom-green/40", "dark:bg-custom-green/50", "dark:bg-custom-green/60", "dark:bg-custom-green/70", "dark:bg-custom-green/80", "dark:bg-custom-green/90", "dark:bg-custom-green/100",

  // custom-celadon
  "bg-custom-celadon/10", "bg-custom-celadon/20", "bg-custom-celadon/30", "bg-custom-celadon/40", "bg-custom-celadon/50", "bg-custom-celadon/60", "bg-custom-celadon/70", "bg-custom-celadon/80", "bg-custom-celadon/90", "bg-custom-celadon/100",
  "dark:bg-custom-celadon/10", "dark:bg-custom-celadon/20", "dark:bg-custom-celadon/30", "dark:bg-custom-celadon/40", "dark:bg-custom-celadon/50", "dark:bg-custom-celadon/60", "dark:bg-custom-celadon/70", "dark:bg-custom-celadon/80", "dark:bg-custom-celadon/90", "dark:bg-custom-celadon/100",

  // custom-coconut
  "bg-custom-coconut/10", "bg-custom-coconut/20", "bg-custom-coconut/30", "bg-custom-coconut/40", "bg-custom-coconut/50", "bg-custom-coconut/60", "bg-custom-coconut/70", "bg-custom-coconut/80", "bg-custom-coconut/90", "bg-custom-coconut/100",
  "dark:bg-custom-coconut/10", "dark:bg-custom-coconut/20", "dark:bg-custom-coconut/30", "dark:bg-custom-coconut/40", "dark:bg-custom-coconut/50", "dark:bg-custom-coconut/60", "dark:bg-custom-coconut/70", "dark:bg-custom-coconut/80", "dark:bg-custom-coconut/90", "dark:bg-custom-coconut/100",

  // custom-rosewood
  "bg-custom-rosewood/10", "bg-custom-rosewood/20", "bg-custom-rosewood/30", "bg-custom-rosewood/40", "bg-custom-rosewood/50", "bg-custom-rosewood/60", "bg-custom-rosewood/70", "bg-custom-rosewood/80", "bg-custom-rosewood/90", "bg-custom-rosewood/100",
  "dark:bg-custom-rosewood/10", "dark:bg-custom-rosewood/20", "dark:bg-custom-rosewood/30", "dark:bg-custom-rosewood/40", "dark:bg-custom-rosewood/50", "dark:bg-custom-rosewood/60", "dark:bg-custom-rosewood/70", "dark:bg-custom-rosewood/80", "dark:bg-custom-rosewood/90", "dark:bg-custom-rosewood/100",

  // custom-terracotta
  "bg-custom-terracotta/10", "bg-custom-terracotta/20", "bg-custom-terracotta/30", "bg-custom-terracotta/40", "bg-custom-terracotta/50", "bg-custom-terracotta/60", "bg-custom-terracotta/70", "bg-custom-terracotta/80", "bg-custom-terracotta/90", "bg-custom-terracotta/100",
  "dark:bg-custom-terracotta/10", "dark:bg-custom-terracotta/20", "dark:bg-custom-terracotta/30", "dark:bg-custom-terracotta/40", "dark:bg-custom-terracotta/50", "dark:bg-custom-terracotta/60", "dark:bg-custom-terracotta/70", "dark:bg-custom-terracotta/80", "dark:bg-custom-terracotta/90", "dark:bg-custom-terracotta/100",

  // custom-almond
  "bg-custom-almond/10", "bg-custom-almond/20", "bg-custom-almond/30", "bg-custom-almond/40", "bg-custom-almond/50", "bg-custom-almond/60", "bg-custom-almond/70", "bg-custom-almond/80", "bg-custom-almond/90", "bg-custom-almond/100",
  "dark:bg-custom-almond/10", "dark:bg-custom-almond/20", "dark:bg-custom-almond/30", "dark:bg-custom-almond/40", "dark:bg-custom-almond/50", "dark:bg-custom-almond/60", "dark:bg-custom-almond/70", "dark:bg-custom-almond/80", "dark:bg-custom-almond/90", "dark:bg-custom-almond/100",

  // black
  "bg-black/10", "bg-black/20", "bg-black/30", "bg-black/40", "bg-black/50", "bg-black/60", "bg-black/70", "bg-black/80", "bg-black/90", "bg-black/100",
  "dark:bg-black/10", "dark:bg-black/20", "dark:bg-black/30", "dark:bg-black/40", "dark:bg-black/50", "dark:bg-black/60", "dark:bg-black/70", "dark:bg-black/80", "dark:bg-black/90", "dark:bg-black/100",

  // white
  "bg-white/10", "bg-white/20", "bg-white/30", "bg-white/40", "bg-white/50", "bg-white/60", "bg-white/70", "bg-white/80", "bg-white/90", "bg-white/100",
  "dark:bg-white/10", "dark:bg-white/20", "dark:bg-white/30", "dark:bg-white/40", "dark:bg-white/50", "dark:bg-white/60", "dark:bg-white/70", "dark:bg-white/80", "dark:bg-white/90", "dark:bg-white/100"
];

export const TAILWIND_SAFELIST = [...TAILWIND_TEXT_SAFELIST, ...TAILWIND_BG_SAFELIST];
