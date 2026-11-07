/**
 * Character portraits encoded as SVG data URIs (sticker style)
 * If image loading fails, the UI gracefully falls back to 👦 / 👧 emojis.
 */

// Boy founder avatar: bright cap, friendly smile, sticker outline
const boySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <circle cx="60" cy="60" r="54" fill="#5CC8FF" stroke="#2B2D42" stroke-width="6"/>
  <!-- Cap -->
  <path d="M30 46 C32 24, 88 24, 90 46 Z" fill="#FFD23F" stroke="#2B2D42" stroke-width="5"/>
  <path d="M72 40 L104 42 C104 45, 95 50, 72 47 Z" fill="#FF9F1C" stroke="#2B2D42" stroke-width="4"/>
  <!-- Head -->
  <ellipse cx="60" cy="68" rx="28" ry="26" fill="#FFE0B2" stroke="#2B2D42" stroke-width="5"/>
  <!-- Ears -->
  <circle cx="31" cy="68" r="6" fill="#FFE0B2" stroke="#2B2D42" stroke-width="4"/>
  <circle cx="89" cy="68" r="6" fill="#FFE0B2" stroke="#2B2D42" stroke-width="4"/>
  <!-- Eyes -->
  <ellipse cx="49" cy="66" rx="4" ry="5" fill="#2B2D42"/>
  <ellipse cx="71" cy="66" rx="4" ry="5" fill="#2B2D42"/>
  <circle cx="51" cy="64" r="1.5" fill="#FFFFFF"/>
  <circle cx="73" cy="64" r="1.5" fill="#FFFFFF"/>
  <!-- Cheeks -->
  <ellipse cx="43" cy="74" rx="4" ry="2.5" fill="#FF6B6B" opacity="0.6"/>
  <ellipse cx="77" cy="74" rx="4" ry="2.5" fill="#FF6B6B" opacity="0.6"/>
  <!-- Big Smile -->
  <path d="M50 75 Q60 86 70 75" fill="none" stroke="#2B2D42" stroke-width="4" stroke-linecap="round"/>
  <!-- T-shirt collar -->
  <path d="M42 93 C42 93, 60 102, 78 93 L84 114 L36 114 Z" fill="#4ADE80" stroke="#2B2D42" stroke-width="5"/>
</svg>`;

// Girl founder avatar: bright hair buns, big glasses/smile, sticker outline
const girlSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <circle cx="60" cy="60" r="54" fill="#FF9F1C" stroke="#2B2D42" stroke-width="6"/>
  <!-- Hair Buns -->
  <circle cx="32" cy="38" r="14" fill="#4B2411" stroke="#2B2D42" stroke-width="5"/>
  <circle cx="88" cy="38" r="14" fill="#4B2411" stroke="#2B2D42" stroke-width="5"/>
  <!-- Hair Base -->
  <path d="M30 65 C26 35, 94 35, 90 65 C82 52, 38 52, 30 65 Z" fill="#4B2411" stroke="#2B2D42" stroke-width="5"/>
  <!-- Head -->
  <ellipse cx="60" cy="68" rx="28" ry="26" fill="#FCD5B5" stroke="#2B2D42" stroke-width="5"/>
  <!-- Ears -->
  <circle cx="31" cy="68" r="6" fill="#FCD5B5" stroke="#2B2D42" stroke-width="4"/>
  <circle cx="89" cy="68" r="6" fill="#FCD5B5" stroke="#2B2D42" stroke-width="4"/>
  <!-- Glasses -->
  <rect x="40" y="58" width="16" height="14" rx="4" fill="#FFFFFF" fill-opacity="0.3" stroke="#8B5CF6" stroke-width="3"/>
  <rect x="64" y="58" width="16" height="14" rx="4" fill="#FFFFFF" fill-opacity="0.3" stroke="#8B5CF6" stroke-width="3"/>
  <line x1="56" y1="65" x2="64" y2="65" stroke="#8B5CF6" stroke-width="3"/>
  <!-- Eyes -->
  <ellipse cx="48" cy="65" rx="3.5" ry="4.5" fill="#2B2D42"/>
  <ellipse cx="72" cy="65" rx="3.5" ry="4.5" fill="#2B2D42"/>
  <circle cx="50" cy="63" r="1.5" fill="#FFFFFF"/>
  <circle cx="74" cy="63" r="1.5" fill="#FFFFFF"/>
  <!-- Cheeks -->
  <ellipse cx="42" cy="75" rx="4" ry="2.5" fill="#FF6B6B" opacity="0.6"/>
  <ellipse cx="78" cy="75" rx="4" ry="2.5" fill="#FF6B6B" opacity="0.6"/>
  <!-- Happy Smile -->
  <path d="M51 77 Q60 87 69 77" fill="none" stroke="#2B2D42" stroke-width="4" stroke-linecap="round"/>
  <!-- Shirt -->
  <path d="M42 93 C42 93, 60 102, 78 93 L84 114 L36 114 Z" fill="#5CC8FF" stroke="#2B2D42" stroke-width="5"/>
</svg>`;

export const BOY_IMAGE_BASE64 = `data:image/svg+xml;utf8,${encodeURIComponent(boySvg)}`;
export const GIRL_IMAGE_BASE64 = `data:image/svg+xml;utf8,${encodeURIComponent(girlSvg)}`;

export interface CharacterOption {
  id: 'boy' | 'girl';
  name: string;
  emoji: string;
  image: string;
  badge: string;
  tagline: string;
}

export const CHARACTERS: CharacterOption[] = [
  {
    id: 'boy',
    name: 'Leo',
    emoji: '👦',
    image: BOY_IMAGE_BASE64,
    badge: 'Curious Builder 🛠️',
    tagline: 'Loves building gadgets & math puzzles!',
  },
  {
    id: 'girl',
    name: 'Maya',
    emoji: '👧',
    image: GIRL_IMAGE_BASE64,
    badge: 'Creative Leader ✨',
    tagline: 'Loves smart ideas & team projects!',
  },
];
