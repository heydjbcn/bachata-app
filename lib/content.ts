// Contenido verbatim del diseño Claude Design (basado en bachatappstudio.com)

export const STORE_LINKS = {
  appStore: "https://apps.apple.com/nl/app/batchatapp-studio/id6745797397",
  googlePlay:
    "https://play.google.com/store/apps/details?id=com.bachatappstudio.app",
  email: "support@bachatappstudio.com",
};

export const NAV = [
  { label: "Features", href: "#features" },
  { label: "Mixer", href: "#mixer" },
  { label: "Musicians", href: "#musicians" },
  { label: "Reviews", href: "#testimonials" },
];

export const HERO_STATS = [
  { value: "8+", label: "Bachata styles" },
  { value: "9", label: "Real instrument stems" },
  { value: "50-150%", label: "Speed control" },
];

export const MARQUEE_WORDS = [
  "INNOVATE",
  "INSPIRE",
  "LEAD",
  "TEACH",
  "LEARN",
  "DANCE",
];

// Stems reales separados con IA (Demucs htdemucs_6s) de "Lluvia En La Pared".
// Cada slider controla el volumen real de ese stem (mute = aislar de verdad).
export const MIXER_SONG = {
  title: "Lluvia En La Pared",
  subtitle: "Live multitrack · 6 stems",
};

export const MIXER_STEMS = [
  { name: "Bass", file: "/assets/stems/bass.mp3" },
  { name: "Guitar", file: "/assets/stems/guitar.mp3" },
  { name: "Piano", file: "/assets/stems/piano.mp3" },
  { name: "Percussion", file: "/assets/stems/drums.mp3" },
  { name: "Vocals", file: "/assets/stems/vocals.mp3" },
  { name: "Other", file: "/assets/stems/other.mp3" },
];

export const SPLIT_CHIPS = [
  "Isolate any instrument",
  "Real musicians",
  "Studio-quality sound",
];

const FEATURE_BODY =
  "Adjust the volume of each instrument individually, highlighting the one you need during your classes.";

export const FEATURES: { n: string; title: string; text: string }[] = [
  {
    n: "01",
    title: "Control the speed of any track to practice without frustration.",
    text: FEATURE_BODY,
  },
  {
    n: "02",
    title: "Learn to dance in different timings with clarity and precision.",
    text: FEATURE_BODY,
  },
  {
    n: "03",
    title: "Break down bachata styles into clear, easy-to-understand sections.",
    text: FEATURE_BODY,
  },
  {
    n: "04",
    title: "Play with bachata instruments and their unique combinations.",
    text: FEATURE_BODY,
  },
  {
    n: "05",
    title: "Detect rhythmic changes and their early cues like a pro.",
    text: FEATURE_BODY,
  },
  {
    n: "06",
    title: "Master syncopation to add dynamism and surprise to your dancing.",
    text: FEATURE_BODY,
  },
  {
    n: "07",
    title:
      "Dive into the essence of merengue — learn it and bring it to your classes.",
    text: FEATURE_BODY,
  },
  {
    n: "08",
    title: "Save your favorite tracks and exercises all in one place.",
    text: FEATURE_BODY,
  },
];

export const CHOICE_LOGOS = [
  "/assets/Logo-Bachatappstudio1.webp",
  "/assets/Logo-Bachatappstudio2.webp",
  "/assets/Logo-Bachatappstudio3.webp",
];

export const MINI_REVIEWS: { title: string; text: string }[] = [
  {
    title: "Professional and direct",
    text: "The best app to teach and learn how to dance bachata. Perfect!",
  },
  {
    title: "Emotional and heartfelt",
    text: "It feels like dancing in the heart of the Dominican Republic. Pure magic!",
  },
  {
    title: "Technical and convincing",
    text: "Crystal-clear sound, real musicians, and an intuitive design. Nothing else compares.",
  },
];

export const MUSICIANS: {
  role: string;
  name: string;
  image: string;
  text: string;
}[] = [
  {
    role: "Lead Guitar",
    name: "René Rojas",
    image: "/assets/MINIATURA-BACHATAPP-STUDIO-LEAD-GUITAR-1-scaled.webp",
    text: "Play with instruments, rhythms, timing, syncopations, speeds and counts.",
  },
  {
    role: "Bass Player",
    name: "Nelson Yánez",
    image: "/assets/MINIATURA-BACHATAPP-STUDIO-BASS-PLAYER-scaled.webp",
    text: "Play with instruments, rhythms, timing, syncopations, speeds and counts.",
  },
  {
    role: "Saxophonist",
    name: "Juan Sin Miedo",
    image: "/assets/MINIATURA-BACHATAPP-STUDIO-SAXOFONISTA-1-scaled.webp",
    text: "Play with instruments, rhythms, timing, syncopations, speeds and counts.",
  },
];

export const TESTIMONIALS: {
  name: string;
  place: string;
  role: string;
  text: string;
}[] = [
  {
    name: "Sofía Martínez",
    place: "Spain",
    role: "teacher",
    text: "BachatAppStudio has made structuring my classes so much easier. The level-based sections and music tracks are perfect for teaching technique and rhythm.",
  },
  {
    name: "Luis Felipe Rodríguez",
    place: "Colombia",
    role: "student",
    text: "I always struggled with keeping the rhythm, but with this app everything is so clear and intuitive that I finally feel like I'm truly dancing.",
  },
  {
    name: "Anaïs Dupont",
    place: "France",
    role: "teacher",
    text: "The sound quality is amazing. I use it not only for bachata, but to introduce my students to merengue and bolero. A true gem!",
  },
  {
    name: "José Ángel Méndez",
    place: "Dominican Republic",
    role: "teacher",
    text: "Finally, a tool created with real knowledge of our culture. This app has essence, history, and a rare musical quality.",
  },
  {
    name: "Mariana Silva",
    place: "Brazil",
    role: "student",
    text: "I've never learned so quickly. Everything is super well explained and organized. The interface feels like it was made for me.",
  },
  {
    name: "Tomás Keller",
    place: "Germany",
    role: "teacher",
    text: "I use the app in my group classes. My students are hooked on the practice dynamics — like a professional teaching assistant.",
  },
  {
    name: "Lucía Herrera",
    place: "Argentina",
    role: "teacher",
    text: "A revolution for those of us teaching Latin rhythms! It's saved me time and gives me top-quality material.",
  },
  {
    name: "Andrés Cárdenas",
    place: "Mexico",
    role: "student",
    text: "The design is intuitive, practical, and elegant. I love how it goes from the basics to advanced — the real instruments make all the difference.",
  },
];
