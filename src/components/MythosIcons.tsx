import React from 'react';

interface IconProps {
  type: string;
  className?: string;
  color?: string;
}

export const MythosIcon: React.FC<IconProps> = ({ type, className = "w-12 h-12", color = "#34d399" }) => {
  switch (type) {
    case 'tentacles': // Cthulhu
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="32" cy="22" r="14" stroke={color} strokeWidth="2" strokeDasharray="2 3" opacity="0.6" />
          {/* Central cephalopoid head */}
          <path d="M22 22C22 14 26 10 32 10C38 10 42 14 42 22C42 28 38 31 32 31C26 31 22 28 22 22Z" fill={`${color}22`} stroke={color} strokeWidth="2" />
          {/* Piercing alien eyes */}
          <circle cx="28" cy="20" r="2" fill={color} />
          <circle cx="36" cy="20" r="2" fill={color} />
          {/* Writhing tentacles */}
          <path d="M25 30C23 37 19 44 14 48C12 49 14 52 16 51C21 47 26 38 28 32" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M29 32C28 41 25 49 22 56C21 58 24 59 26 57C30 50 32 40 31 32" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M33 32C34 40 36 50 40 57C42 59 45 58 44 56C41 49 38 41 37 32" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M37 30C40 37 44 44 50 49C52 50 54 48 52 46C47 42 42 36 39 30" stroke={color} strokeWidth="2" strokeLinecap="round" />
          {/* Wings silhouette */}
          <path d="M18 16C12 12 6 15 4 22C8 21 14 20 18 22" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          <path d="M46 16C52 12 58 15 60 22C56 21 50 20 46 22" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        </svg>
      );

    case 'chaos': // Nyarlathotep
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="32" cy="32" r="22" stroke={color} strokeWidth="1.5" strokeDasharray="3 4" opacity="0.4" />
          {/* Shifting masked avatar */}
          <path d="M32 10L36 24L50 28L38 36L42 50L32 40L22 50L26 36L14 28L28 24L32 10Z" fill={`${color}18`} stroke={color} strokeWidth="2" strokeLinejoin="round" />
          {/* Thousand faces eye in the core */}
          <circle cx="32" cy="32" r="5" stroke={color} strokeWidth="2" />
          <circle cx="32" cy="32" r="2" fill={color} />
          <path d="M32 18V24M32 40V46M18 32H24M40 32H46" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'spheres': // Yog-Sothoth
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Cluster of glowing iridescent cosmic spheres */}
          <circle cx="32" cy="32" r="12" fill={`${color}22`} stroke={color} strokeWidth="2" />
          <circle cx="20" cy="22" r="8" fill={`${color}18`} stroke={color} strokeWidth="1.5" />
          <circle cx="44" cy="22" r="8" fill={`${color}18`} stroke={color} strokeWidth="1.5" />
          <circle cx="18" cy="40" r="9" fill={`${color}18`} stroke={color} strokeWidth="1.5" />
          <circle cx="46" cy="40" r="9" fill={`${color}18`} stroke={color} strokeWidth="1.5" />
          <circle cx="32" cy="50" r="7" fill={`${color}18`} stroke={color} strokeWidth="1.5" />
          <circle cx="32" cy="14" r="6" fill={`${color}18`} stroke={color} strokeWidth="1.5" />
          {/* Keyhole / Dimensional Gate in the center */}
          <circle cx="32" cy="29" r="3" fill={color} />
          <path d="M30 31L29 37H35L34 31" fill={color} />
        </svg>
      );

    case 'goat': // Shub-Niggurath
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Black goat curved spiral horns */}
          <path d="M28 26C24 18 16 14 8 16C6 20 10 26 18 27C24 28 26 29 27 32" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M36 26C40 18 48 14 56 16C58 20 54 26 46 27C40 28 38 29 37 32" stroke={color} strokeWidth="2" strokeLinecap="round" />
          {/* Goat skull contour */}
          <path d="M26 30H38L35 44L32 50L29 44L26 30Z" fill={`${color}22`} stroke={color} strokeWidth="2" strokeLinejoin="round" />
          {/* Horizontal slit eyes */}
          <ellipse cx="29" cy="36" rx="2.5" ry="1" fill={color} />
          <ellipse cx="35" cy="36" rx="2.5" ry="1" fill={color} />
          {/* Writhing roots/tentacle hooves */}
          <path d="M26 50C22 56 16 58 12 58" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M38 50C42 56 48 58 52 58" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M32 50V60" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'core': // Azathoth
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Chaos nuclear center */}
          <circle cx="32" cy="32" r="9" fill={color} opacity="0.8" />
          <circle cx="32" cy="32" r="16" stroke={color} strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="32" cy="32" r="23" stroke={color} strokeWidth="1" opacity="0.5" />
          {/* Blasphemous flute soundwaves / chaotic rays */}
          <path d="M32 8V2M32 62V56M8 32H2M62 32H56" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M15 15L10 10M54 54L49 49M15 49L10 54M54 10L49 15" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <circle cx="32" cy="32" r="4" fill="#080c0e" />
        </svg>
      );

    case 'tome': // Necronomicon
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Grimoire cover bound in human skin */}
          <path d="M14 12C14 12 24 10 32 13C40 10 50 12 50 12V52C50 52 40 50 32 53C24 50 14 52 14 52V12Z" fill={`${color}22`} stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <path d="M32 13V53" stroke={color} strokeWidth="2" />
          {/* Occult seal on cover */}
          <circle cx="23" cy="32" r="5" stroke={color} strokeWidth="1.5" />
          <path d="M20 32H26M23 29V35" stroke={color} strokeWidth="1.5" />
          <circle cx="41" cy="32" r="5" stroke={color} strokeWidth="1.5" />
          <path d="M38 32H44M41 29V35" stroke={color} strokeWidth="1.5" />
          {/* Bookmark ribbon */}
          <path d="M32 53L35 60L32 58L29 60L32 53" fill={color} />
        </svg>
      );

    case 'fish': // Dagon
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Deep Sea Abyssal Leviathan / Monolith watcher */}
          <path d="M16 32C16 20 28 14 42 16C48 24 50 36 42 44C28 46 16 40 16 32Z" fill={`${color}22`} stroke={color} strokeWidth="2" />
          <path d="M42 28L54 20V42L42 34" fill={`${color}33`} stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <circle cx="26" cy="24" r="3" fill={color} />
          {/* Gills and scales */}
          <path d="M30 28C32 30 32 34 30 36" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M35 27C37 30 37 35 35 37" stroke={color} strokeWidth="2" strokeLinecap="round" />
          {/* Sunken sea waves */}
          <path d="M10 50C16 48 20 52 26 50C32 48 36 52 42 50C48 48 52 52 58 50" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        </svg>
      );

    case 'star': // Elder Sign
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Five-pointed elder talisman */}
          <polygon points="32,6 38,24 57,24 42,35 48,53 32,42 16,53 22,35 7,24 26,24" fill={`${color}22`} stroke={color} strokeWidth="2" strokeLinejoin="round" />
          {/* Central watchful eye / burning flame branch */}
          <path d="M22 34C26 28 38 28 42 34C38 40 26 40 22 34Z" stroke={color} strokeWidth="1.5" />
          <circle cx="32" cy="34" r="2.5" fill={color} />
          <path d="M32 26V30" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'hound': // Tindalos
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Angular spacetime geometric predator */}
          <path d="M12 18L32 10L52 18L44 38L32 54L20 38L12 18Z" fill={`${color}22`} stroke={color} strokeWidth="2" strokeLinejoin="round" />
          {/* Non-Euclidean acute angles */}
          <line x1="12" y1="18" x2="44" y2="38" stroke={color} strokeWidth="1.5" opacity="0.6" />
          <line x1="52" y1="18" x2="20" y2="38" stroke={color} strokeWidth="1.5" opacity="0.6" />
          <line x1="32" y1="10" x2="32" y2="54" stroke={color} strokeWidth="1.5" />
          {/* Hungry glowing eyes */}
          <polygon points="26,26 30,24 28,30" fill={color} />
          <polygon points="38,26 34,24 36,30" fill={color} />
        </svg>
      );

    case 'fungi': // Mi-Go
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Crustacean / extraterrestrial spore head */}
          <ellipse cx="32" cy="24" rx="14" ry="10" fill={`${color}22`} stroke={color} strokeWidth="2" />
          {/* Pulsing sensorial cilia */}
          <circle cx="26" cy="22" r="1.5" fill={color} />
          <circle cx="32" cy="20" r="1.5" fill={color} />
          <circle cx="38" cy="22" r="1.5" fill={color} />
          <circle cx="29" cy="26" r="1.5" fill={color} />
          <circle cx="35" cy="26" r="1.5" fill={color} />
          {/* Membranous interstellar wings */}
          <path d="M18 24C10 20 4 28 6 38C12 36 16 32 20 28" stroke={color} strokeWidth="1.5" fill={`${color}15`} />
          <path d="M46 24C54 20 60 28 58 38C52 36 48 32 44 28" stroke={color} strokeWidth="1.5" fill={`${color}15`} />
          {/* Jointed claw appendages */}
          <path d="M26 34L22 46L16 48" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M38 34L42 46L48 48" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M32 34V52" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'gem': // Trapezohedron
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Shining Trapezohedron facets */}
          <polygon points="32,8 52,22 42,54 22,54 12,22" fill={`${color}22`} stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <polygon points="32,8 24,30 32,46 40,30" fill={`${color}40`} stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
          <line x1="12" y1="22" x2="24" y2="30" stroke={color} strokeWidth="1.5" />
          <line x1="52" y1="22" x2="40" y2="30" stroke={color} strokeWidth="1.5" />
          <line x1="22" y1="54" x2="32" y2="46" stroke={color} strokeWidth="1.5" />
          <line x1="42" y1="54" x2="32" y2="46" stroke={color} strokeWidth="1.5" />
          {/* Dark inner haunter pupil */}
          <circle cx="32" cy="30" r="3" fill="#080c0e" stroke={color} strokeWidth="1.5" />
        </svg>
      );

    case 'idol': // Relic / Idol of Cthulhu
    default:
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Cyclopean Soapstone Idol */}
          <path d="M18 52L22 28L28 20H36L42 28L46 52H18Z" fill={`${color}22`} stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <path d="M22 28C22 18 26 12 32 12C38 12 42 18 42 28" stroke={color} strokeWidth="1.5" />
          {/* Carved stone eyes */}
          <circle cx="28" cy="24" r="2" fill={color} />
          <circle cx="36" cy="24" r="2" fill={color} />
          {/* Bas-relief pedestal */}
          <rect x="14" y="52" width="36" height="6" rx="1" fill={`${color}33`} stroke={color} strokeWidth="1.5" />
          <line x1="24" y1="36" x2="40" y2="36" stroke={color} strokeWidth="1.5" />
          <line x1="28" y1="42" x2="36" y2="42" stroke={color} strokeWidth="1.5" />
        </svg>
      );
  }
};
