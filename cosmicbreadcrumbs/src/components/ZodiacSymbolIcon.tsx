import React, { useId } from 'react';

interface ZodiacSymbolIconProps {
  sign: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  fallbackText?: string;
}

export const ZodiacSymbolIcon: React.FC<ZodiacSymbolIconProps> = ({
  sign,
  className = '',
  size = 'md',
  fallbackText,
}) => {
  const uid = useId().replace(/:/g, '');
  const normalizedSign = (sign || '').toLowerCase().trim();

  // Enhanced slightly bigger default sizing across all tiers
  const sizeDimensions = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-10 w-10 text-sm',
    md: 'h-14 w-14 text-lg',
    lg: 'h-20 w-20 text-2xl',
    xl: 'h-28 w-28 text-4xl',
    '2xl': 'h-36 w-36 text-5xl',
  };

  const renderGlyph = () => {
    switch (normalizedSign) {
      case 'aries':
        return (
          /* Aries Ram Horns ♈ - Exact match to user photo */
          <g>
            <path
              d="
                M 100,154
                L 100,92
                C 100,72 87,56 69,56
                C 52,56 40,69 40,86
                C 40,101 50,109 58,109
                C 64,109 68,104 68,98
                C 68,90 60,88 60,82
                C 60,74 67,67 76,67
                C 86,67 91,78 91,92
                L 91,154
                Z
              "
              fill="#ffffff"
            />
            <path
              d="
                M 100,154
                L 100,92
                C 100,72 113,56 131,56
                C 148,56 160,69 160,86
                C 160,101 150,109 142,109
                C 136,109 132,104 132,98
                C 132,90 140,88 140,82
                C 140,74 133,67 124,67
                C 114,67 109,78 109,92
                L 109,154
                Z
              "
              fill="#ffffff"
            />
            {/* Center Join stem bridge */}
            <path d="M 91,90 L 109,90 L 109,154 L 91,154 Z" fill="#ffffff" />
          </g>
        );

      case 'taurus':
        return (
          /* Taurus Bull ♉ - Exact match to user photo */
          <g>
            {/* Lower Circle */}
            <circle cx="100" cy="120" r="29" fill="none" stroke="#ffffff" strokeWidth="13" />
            {/* Upper Horns Arc */}
            <path
              d="
                M 50,64
                C 61,64 71,74 81,89
                C 87,98 93,102 100,102
                C 107,102 113,98 119,89
                C 129,74 139,64 150,64
                L 150,77
                C 138,77 128,88 119,101
                C 111,111 106,114 100,114
                C 94,114 89,111 81,101
                C 72,88 62,77 50,77
                Z
              "
              fill="#ffffff"
            />
          </g>
        );

      case 'gemini':
        return (
          /* Gemini Twins ♊ - Exact match to user photo */
          <g>
            {/* Top Arched Bar */}
            <path
              d="M 52,62 C 69,68 131,68 148,62 L 148,76 C 131,82 69,82 52,76 Z"
              fill="#ffffff"
            />
            {/* Bottom Arched Bar */}
            <path
              d="M 52,138 C 69,132 131,132 148,138 L 148,124 C 131,118 69,118 52,124 Z"
              fill="#ffffff"
            />
            {/* Left Pillar */}
            <rect x="73" y="73" width="14" height="54" fill="#ffffff" rx="1.5" />
            {/* Right Pillar */}
            <rect x="113" y="73" width="14" height="54" fill="#ffffff" rx="1.5" />
          </g>
        );

      case 'cancer':
        return (
          /* Cancer Crab Claws ♋ - Exact match to user photo */
          <g>
            {/* Upper Claw with right tail */}
            <circle cx="70" cy="85" r="17" fill="none" stroke="#ffffff" strokeWidth="12" />
            <path
              d="M 70,69 C 95,69 144,74 144,97 L 131,97 C 131,83 95,81 70,81 Z"
              fill="#ffffff"
            />
            {/* Lower Claw with left tail */}
            <circle cx="130" cy="115" r="17" fill="none" stroke="#ffffff" strokeWidth="12" />
            <path
              d="M 130,131 C 105,131 56,126 56,103 L 69,103 C 69,117 105,119 130,119 Z"
              fill="#ffffff"
            />
          </g>
        );

      case 'leo':
        return (
          /* Leo Lion ♌ - Exact match to user photo */
          <g>
            {/* Lower-left circle */}
            <circle cx="72" cy="120" r="17" fill="none" stroke="#ffffff" strokeWidth="12" />
            {/* Arched mane and curling flick tail */}
            <path
              d="
                M 84,109
                C 82,85 90,61 113,61
                C 134,61 143,77 143,95
                C 143,119 121,137 121,143
                C 121,149 125,151 131,151
                C 138,151 143,146 146,140
                L 155,144
                C 150,157 141,163 129,163
                C 114,163 108,153 108,141
                C 108,128 129,112 129,95
                C 129,83 123,73 113,73
                C 98,73 94,92 96,110
                Z
              "
              fill="#ffffff"
            />
          </g>
        );

      case 'virgo':
        return (
          /* Virgo Maiden ♍ - Exact match to user photo */
          <g>
            {/* Three Arched Vertical Stems */}
            <path
              d="
                M 55,132 L 55,91 C 55,75 65,64 78,64 C 87,64 94,70 98,79
                C 102,70 109,64 119,64 C 131,64 139,74 139,89 L 139,132
                L 127,132 L 127,90 C 127,80 122,75 115,75 C 107,75 102,82 102,91
                L 102,132 L 90,132 L 90,90 C 90,80 85,75 78,75 C 70,75 67,82 67,91
                L 67,132 Z
              "
              fill="#ffffff"
            />
            {/* Crossed Loop and Ribbon Tail */}
            <path
              d="
                M 127,110
                C 137,115 147,122 147,134
                C 147,149 132,158 117,158
                C 112,158 107,156 103,154
                L 107,143
                C 110,145 114,147 118,147
                C 126,147 135,141 135,132
                C 135,124 128,118 119,116
                L 127,110
                Z
              "
              fill="#ffffff"
            />
            {/* Slash Crossing */}
            <path
              d="M 121,121 L 152,156 L 143,164 L 112,129 Z"
              fill="#ffffff"
            />
          </g>
        );

      case 'libra':
        return (
          /* Libra Scales ♎ - Exact match to user photo */
          <g>
            {/* Upper Omega Balance Arc */}
            <path
              d="
                M 48,95
                L 70,95
                C 73,75 85,62 100,62
                C 115,62 127,75 130,95
                L 152,95
                L 152,107
                L 126,107
                C 123,93 114,75 100,75
                C 86,75 77,93 74,107
                L 48,107
                Z
              "
              fill="#ffffff"
            />
            {/* Lower Parallel Balance Line */}
            <rect x="48" y="122" width="104" height="13" fill="#ffffff" rx="2" />
          </g>
        );

      case 'scorpio':
        return (
          /* Scorpio Scorpion ♏ - Exact match to user photo */
          <g>
            {/* Three Arched Vertical Stems */}
            <path
              d="
                M 55,132 L 55,91 C 55,75 65,64 78,64 C 87,64 94,70 98,79
                C 102,70 109,64 119,64 C 131,64 139,74 139,89 L 139,132
                C 139,147 147,152 155,152 L 157,152 L 152,163 C 142,163 127,157 127,138
                L 127,90 C 127,80 122,75 115,75 C 107,75 102,82 102,91
                L 102,132 L 90,132 L 90,90 C 90,80 85,75 78,75 C 70,75 67,82 67,91
                L 67,132 Z
              "
              fill="#ffffff"
            />
            {/* Sharp Pointed Stinger Arrow Tip */}
            <polygon points="147,159 171,159 159,135" fill="#ffffff" />
            <polygon points="151,155 169,155 160,137" fill="#ffffff" />
          </g>
        );

      case 'sagittarius':
        return (
          /* Sagittarius Archer ♐ - Exact match to user photo */
          <g>
            {/* Arrowhead & Main Shaft */}
            <path
              d="
                M 154,50
                L 106,50
                L 106,64
                L 133,64
                L 56,141
                L 65,150
                L 142,73
                L 142,100
                L 154,100
                Z
              "
              fill="#ffffff"
            />
            {/* Perpendicular Crossbar */}
            <path
              d="
                M 76,100
                L 106,130
                L 97,139
                L 67,109
                Z
              "
              fill="#ffffff"
            />
          </g>
        );

      case 'capricorn':
        return (
          /* Capricorn Sea-Goat ♑ - Exact match to user photo */
          <g>
            {/* Left Horn/Leg V Shape into Sea-Goat tail loop */}
            <path
              d="
                M 50,70
                C 60,70 69,77 74,89
                L 74,129
                L 86,129
                L 86,83
                C 86,70 94,63 105,63
                C 115,63 124,72 124,85
                L 124,111
                C 129,103 136,98 145,98
                C 158,98 168,108 168,122
                C 168,136 156,147 141,147
                C 127,147 118,137 115,125
                L 104,149
                L 92,149
                L 112,105
                L 112,85
                C 112,78 108,74 103,74
                C 97,74 95,78 95,85
                L 74,145
                L 62,145
                L 62,92
                C 59,84 55,82 50,82
                Z
              "
              fill="#ffffff"
            />
            {/* Inner tail loop hole */}
            <circle cx="141" cy="122" r="10" fill="none" stroke="#ffffff" strokeWidth="10" />
          </g>
        );

      case 'aquarius':
        return (
          /* Aquarius Water Waves ♒ - Exact match to user photo */
          <g>
            {/* Top Zig-Zag Wave */}
            <path
              d="
                M 46,84
                L 69,61
                L 92,84
                L 115,61
                L 138,84
                L 161,61
                L 161,77
                L 138,100
                L 115,77
                L 92,100
                L 69,77
                L 46,100
                Z
              "
              fill="#ffffff"
            />
            {/* Bottom Zig-Zag Wave */}
            <path
              d="
                M 46,122
                L 69,99
                L 92,122
                L 115,99
                L 138,122
                L 161,99
                L 161,115
                L 138,138
                L 115,115
                L 92,138
                L 69,115
                L 46,138
                Z
              "
              fill="#ffffff"
            />
          </g>
        );

      case 'pisces':
        return (
          /* Pisces Two Fishes ♓ - Exact match to user photo */
          <g>
            {/* Left Outward Crescent */}
            <path
              d="
                M 79,59
                C 59,73 59,127 79,141
                L 66,141
                C 44,125 44,75 66,59
                Z
              "
              fill="#ffffff"
            />
            {/* Right Outward Crescent */}
            <path
              d="
                M 121,59
                C 141,73 141,127 121,141
                L 134,141
                C 156,125 156,75 134,59
                Z
              "
              fill="#ffffff"
            />
            {/* Center Connecting Crossbar */}
            <rect x="56" y="94" width="88" height="12" fill="#ffffff" rx="1.5" />
          </g>
        );

      default:
        return (
          <text
            x="100"
            y="118"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="52"
            fontFamily="serif"
            fontWeight="bold"
          >
            {fallbackText || sign}
          </text>
        );
    }
  };

  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${sizeDimensions[size]} ${className}`}
      title={`${sign} - Zodiac`}
    >
      <svg 
        viewBox="0 0 200 200" 
        className="h-full w-full drop-shadow-[0_0_16px_rgba(56,189,248,0.75)]"
      >
        <defs>
          {/* Intense Neon Cyan Rosette Glow */}
          <filter id={`neonGlow-${uid}`} x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Inner Deep Cosmic Nebula Base */}
          <radialGradient id={`cosmicCore-${uid}`} cx="45%" cy="38%" r="68%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="28%" stopColor="#2563eb" />
            <stop offset="52%" stopColor="#4338ca" />
            <stop offset="78%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#080718" />
          </radialGradient>

          {/* Paint brush watercolor overlay gradient */}
          <linearGradient id={`brushOverlay-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
            <stop offset="35%" stopColor="#818cf8" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#c084fc" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.6" />
          </linearGradient>

          {/* Fine guilloche / fishnet mesh pattern for border inlay matching user photos */}
          <pattern id={`meshInlay-${uid}`} width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M 0,3 L 6,3 M 3,0 L 3,6 M 0,0 L 6,6 M 6,0 L 0,6" stroke="#38bdf8" strokeWidth="0.6" opacity="0.45" />
          </pattern>

          <clipPath id={`coreClip-${uid}`}>
            <circle cx="100" cy="100" r="64" />
          </clipPath>
        </defs>

        {/* 1. SCALLOPED WAVY NEON CYAN ROSETTE OUTER BORDER (16-PETAL HARMONIC) */}
        <path
          d="M 194,100 C 194.00,105.33 181.61,110.00 180.42,116 C 179.23,122.00 188.88,131.04 186.84,135.97 C 184.80,140.90 171.58,140.48 168.18,145.56 C 164.78,150.64 170.24,162.70 166.47,166.47 C 162.70,170.24 150.64,164.78 145.56,168.18 C 140.48,171.58 140.90,184.80 135.97,186.84 C 131.04,188.88 122.00,179.23 116,180.42 C 110.00,181.61 105.33,194.00 100,194 C 94.67,194.00 90.00,181.61 84,180.42 C 78.00,179.23 68.96,188.88 64.03,186.84 C 59.10,184.80 59.52,171.58 54.44,168.18 C 49.36,164.78 37.30,170.24 33.53,166.47 C 29.76,162.70 35.22,150.64 31.82,145.56 C 28.43,140.48 15.20,140.90 13.16,135.97 C 11.12,131.04 20.77,122.00 19.58,116 C 18.39,110.00 6.00,105.33 6,100 C 6.00,94.67 18.39,90.00 19.58,84 C 20.77,78.00 11.12,68.96 13.16,64.03 C 15.20,59.10 28.43,59.52 31.82,54.44 C 35.22,49.36 29.76,37.30 33.53,33.53 C 37.30,29.76 49.36,35.22 54.44,31.82 C 59.52,28.43 59.10,15.20 64.03,13.16 C 68.96,11.12 78.00,20.77 84,19.58 C 90.00,18.39 94.67,6.00 100,6 C 105.33,6.00 110.00,18.39 116,19.58 C 122.00,20.77 131.04,11.12 135.97,13.16 C 140.90,15.20 140.48,28.43 145.56,31.82 C 150.64,35.22 162.70,29.76 166.47,33.53 C 170.24,37.30 164.78,49.36 168.18,54.44 C 171.58,59.52 184.80,59.10 186.84,64.03 C 188.88,68.96 179.23,78.00 180.42,84 C 181.61,90.00 194.00,94.67 194,100 Z"
          fill="#060919"
          stroke="#38bdf8"
          strokeWidth="4.5"
          strokeLinejoin="round"
          filter={`url(#neonGlow-${uid})`}
        />

        {/* 2. GUILLOCHE / MESH INLAY TEXTURE IN SCALLOP MARGIN */}
        <path
          d="M 194,100 C 194.00,105.33 181.61,110.00 180.42,116 C 179.23,122.00 188.88,131.04 186.84,135.97 C 184.80,140.90 171.58,140.48 168.18,145.56 C 164.78,150.64 170.24,162.70 166.47,166.47 C 162.70,170.24 150.64,164.78 145.56,168.18 C 140.48,171.58 140.90,184.80 135.97,186.84 C 131.04,188.88 122.00,179.23 116,180.42 C 110.00,181.61 105.33,194.00 100,194 C 94.67,194.00 90.00,181.61 84,180.42 C 78.00,179.23 68.96,188.88 64.03,186.84 C 59.10,184.80 59.52,171.58 54.44,168.18 C 49.36,164.78 37.30,170.24 33.53,166.47 C 29.76,162.70 35.22,150.64 31.82,145.56 C 28.43,140.48 15.20,140.90 13.16,135.97 C 11.12,131.04 20.77,122.00 19.58,116 C 18.39,110.00 6.00,105.33 6,100 C 6.00,94.67 18.39,90.00 19.58,84 C 20.77,78.00 11.12,68.96 13.16,64.03 C 15.20,59.10 28.43,59.52 31.82,54.44 C 35.22,49.36 29.76,37.30 33.53,33.53 C 37.30,29.76 49.36,35.22 54.44,31.82 C 59.52,28.43 59.10,15.20 64.03,13.16 C 68.96,11.12 78.00,20.77 84,19.58 C 90.00,18.39 94.67,6.00 100,6 C 105.33,6.00 110.00,18.39 116,19.58 C 122.00,20.77 131.04,11.12 135.97,13.16 C 140.90,15.20 140.48,28.43 145.56,31.82 C 150.64,35.22 162.70,29.76 166.47,33.53 C 170.24,37.30 164.78,49.36 168.18,54.44 C 171.58,59.52 184.80,59.10 186.84,64.03 C 188.88,68.96 179.23,78.00 180.42,84 C 181.61,90.00 194.00,94.67 194,100 Z"
          fill={`url(#meshInlay-${uid})`}
          opacity="0.95"
        />

        {/* 3. INNER GLOWING CIRCULAR CYAN RIM (DOUBLE RINGS) */}
        <circle
          cx="100"
          cy="100"
          r="66"
          fill="none"
          stroke="#7dd3fc"
          strokeWidth="3.5"
          filter={`url(#neonGlow-${uid})`}
        />
        <circle
          cx="100"
          cy="100"
          r="64"
          fill="none"
          stroke="#0284c7"
          strokeWidth="1.5"
          opacity="0.85"
        />

        {/* 4. COSMIC NEBULA TEXTURED CORE (CLIPPED) */}
        <g clipPath={`url(#coreClip-${uid})`}>
          <circle cx="100" cy="100" r="64" fill={`url(#cosmicCore-${uid})`} />
          
          {/* Painted Nebula Brush Streaks */}
          <path
            d="M25,50 Q75,120 125,30 Q155,80 175,120 L175,175 L25,175 Z"
            fill={`url(#brushOverlay-${uid})`}
            opacity="0.88"
          />
          <path
            d="M30,135 Q85,60 135,100 Q155,120 175,145 L100,175 Z"
            fill="#a855f7"
            opacity="0.5"
          />
          <circle cx="68" cy="78" r="34" fill="#0284c7" opacity="0.45" />
          <circle cx="138" cy="120" r="36" fill="#ec4899" opacity="0.38" />
          <circle cx="95" cy="115" r="30" fill="#38bdf8" opacity="0.35" />

          {/* Vignette Shadow Edge */}
          <circle cx="100" cy="100" r="64" fill="none" stroke="#030712" strokeWidth="8" opacity="0.65" />
        </g>

        {/* 5. PRISTINE WHITE GLYPH WITH SOFT NEON GLOW */}
        <g filter={`url(#neonGlow-${uid})`}>
          {renderGlyph()}
        </g>
      </svg>
    </div>
  );
};


