import { UserProfile } from "../types";

export const PRODUCT_TAMIL = "அரண்யம்";

// Premium, curated Tamil glossary words with deep cultural meanings for the matrimony app
export const TAMIL_GLOSSARY = [
  {
    word: "துணை",
    transliteration: "Thunai",
    meaning: "Companion",
    description: "A supportive partner who walks beside you, sharing life's burdens and joys.",
  },
  {
    word: "பொருத்தம்",
    transliteration: "Porutham",
    meaning: "Alignment",
    description: "The harmonic alignment of values, life rhythm, and mutual understanding.",
  },
  {
    word: "அகம்",
    transliteration: "Akam",
    meaning: "Inner Heart / Home",
    description: "The sacred inner space of emotions, love, and private domestic life.",
  },
  {
    word: "அரண்யம்",
    transliteration: "Aranyam",
    meaning: "Secured Sanctuary",
    description: "A protected forest haven where connection thrives in absolute safety and trust.",
  },
  {
    word: "அன்பு",
    transliteration: "Anbu",
    meaning: "Deep Affection",
    description: "Unconditional kindness, care, and devotion that forms the bedrock of union.",
  },
  {
    word: "சங்கமம்",
    transliteration: "Sangamam",
    meaning: "Confluence",
    description: "The beautiful coming together of two paths, families, and lifetimes.",
  },
];

export const interests = [
  { label: "Carnatic music", tamil: "கர்நாடக இசை", tone: "from-[#A92C2C] to-[#E9C46A]" },
  { label: "Tamil literature", tamil: "தமிழ் இலக்கியம்", tone: "from-[#8B1E1E] to-[#D1A128]" },
  { label: "Diaspora identity", tamil: "புலம்பெயர் வாழ்வு", tone: "from-[#9E1C1C] to-[#C29624]" },
  { label: "Jaffna cooking", tamil: "யாழ்ப்பாண சமையல்", tone: "from-[#A21C1C] to-[#E5A93C]" },
  { label: "Ilaiyaraaja", tamil: "இளையராஜா", tone: "from-[#8E1616] to-[#D9B44A]" },
  { label: "Modern cinema", tamil: "நவீன சினிமா", tone: "from-[#6F1414] to-[#CBA330]" },
  { label: "Travel", tamil: "பயணம்", tone: "from-[#B45A3C] to-[#F1DCA7]" },
  { label: "Tech", tamil: "தொழில்நுட்பம்", tone: "from-[#3E6F68] to-[#9CD0C7]" },
  { label: "Fitness", tamil: "உடற்பயிற்சி", tone: "from-[#4B7C47] to-[#AEE0AA]" },
  { label: "Faith & family", tamil: "நம்பிக்கை குடும்பம்", tone: "from-[#9F7A2A] to-[#F3D794]" },
  { label: "Social impact", tamil: "சமூக சேவை", tone: "from-[#3A7E8C] to-[#9FE2F0]" },
  { label: "Slow living", tamil: "அமைதியான வாழ்வு", tone: "from-[#6E5A4F] to-[#D1C2B8]" },
];

export const seedProfiles: UserProfile[] = [
  {
    uid: "profile_anjali",
    name: "Anjali",
    age: 28,
    city: "Melbourne",
    country: "Australia · Diaspora",
    verifiedStatus: true,
    bio: "Design researcher, temple festival volunteer, and weekend coastal walker. Deeply connected to my Tamil roots while enjoying the Australian outdoors. Looking for emotional steadiness, mutual curiosity, and laughter that arrives easily.",
    interests: ["Tamil literature", "Travel", "Ilaiyaraaja", "Diaspora identity", "Slow living"],
    values: ["Privacy-minded", "Family warmth", "Creative life", "Jaffna Heritage", "Diaspora-Born"],
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80", // High quality South Asian professional model portrait
  },
  {
    uid: "profile_kavin",
    name: "Kavin",
    age: 31,
    city: "Toronto",
    country: "Canada · Diaspora",
    verifiedStatus: true,
    bio: "Cloud engineer, mridangam learner, and the person who makes the good Jaffna-style sambar at every friend gathering. Active in the local Toronto Tamil community. Seeking a companion to share music, cultural rituals, and creative conversations.",
    interests: ["Carnatic music", "Jaffna cooking", "Tech", "Faith & family", "Travel"],
    values: ["Grounded ambition", "Kind communication", "Shared rituals", "Vanni Roots", "Bilingual Fluency"],
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80", // High quality South Asian model portrait
  },
  {
    uid: "profile_meera",
    name: "Meera",
    age: 27,
    city: "Colombo",
    country: "Sri Lanka · Local",
    verifiedStatus: true, // Let's make her verified as well for a premium feel
    bio: "Publisher, modern Tamil cinema obsessive, and believer in relationships that feel like a calm room. Based in Colombo but open to global connections. I value literature, social impact, and thoughtful, independent thinking.",
    interests: ["Tamil literature", "Modern cinema", "Social impact", "Slow living", "Ilaiyaraaja"],
    values: ["Gentle honesty", "Cultural fluency", "Independent thinking", "Traditional Arts", "Colombo Roots"],
    image:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80", // High quality South Asian model portrait
  },
];
