// The bride and groom as illustrated, animated characters, drawn in a chibi wedding
// style: Hemsagar in a safa and cream sherwani with a red dupatta, Archana in a red
// lehenga under a sheer veil, holding a garland of flowers. Everything is inline
// SVG, so there are no image files to load. Ambient motion (blinks, a swaying
// kalgi, swinging jhumkas, falling petals) lives in styles/characters.css; the
// scroll-driven moments are built by the sections that use these pieces.

import '../styles/characters.css';

const SKIN = '#EDBB92';
const SKIN_SHADE = '#D69B70';
const HAIR = '#2A1712';
const GOLD = '#D9A23A';
const GOLD_LIGHT = '#F6D98C';
const RED = '#D42A2A';
const RED_DEEP = '#A8141F';
const CREAM = '#F7ECD6';
const CREAM_SHADE = '#E9D4AA';

const PETALS = [
  { x: 24, dx: 14, delay: 0, dur: 9, color: '#F28C28' },
  { x: 58, dx: -10, delay: 3.2, dur: 11, color: '#FFFFFF' },
  { x: 96, dx: 18, delay: 6.1, dur: 10, color: '#F28C28' },
  { x: 134, dx: -16, delay: 1.7, dur: 12, color: '#F7B3C2' },
  { x: 170, dx: 8, delay: 4.6, dur: 9.5, color: '#FFFFFF' },
];

const SPARKS = [
  { x: 26, y: 70, delay: 0 },
  { x: 176, y: 54, delay: 1.1 },
  { x: 168, y: 190, delay: 2.2 },
  { x: 30, y: 200, delay: 3.1 },
];

function Petals({ offset = 0, fall = 380 }) {
  return (
    <g aria-hidden="true">
      {PETALS.map(petal => (
        <ellipse
          key={petal.x}
          className="char__petal"
          cx={petal.x + offset}
          cy={-8}
          rx="3.6"
          ry="2"
          fill={petal.color}
          style={{ '--dx': `${petal.dx}px`, '--fall': `${fall}px`, '--delay': `${petal.delay}s`, '--dur': `${petal.dur}s` }}
        />
      ))}
    </g>
  );
}

function Sparks({ offset = 0 }) {
  return (
    <g aria-hidden="true">
      {SPARKS.map(spark => (
        <g key={`${spark.x}-${spark.y}`} transform={`translate(${spark.x + offset} ${spark.y})`}>
          <path
            className="char__spark"
            d="M0 -6 L1.5 -1.5 L6 0 L1.5 1.5 L0 6 L-1.5 1.5 L-6 0 L-1.5 -1.5 Z"
            fill={GOLD_LIGHT}
            style={{ '--delay': `${spark.delay}s` }}
          />
        </g>
      ))}
    </g>
  );
}

/** Marigold and jasmine strung along a path, drawn as rows of round beads. */
function Garland({ d, className = '', size = 10 }) {
  return (
    <g className={className} fill="none" strokeLinecap="round">
      <path d={d} stroke="#E8731A" strokeWidth={size} strokeDasharray="0.1 9" />
      <path d={d} stroke="#F7A62B" strokeWidth={size - 3} strokeDasharray="0.1 9" />
      <path d={d} stroke="#FFFFFF" strokeWidth={size - 4} strokeDasharray="0.1 9" strokeDashoffset="4.5" />
    </g>
  );
}

/** The big chibi eyes both of them share: lash line, iris, two catch-lights. */
function Eyes({ lashes = false }) {
  return (
    <g className="char__eyes">
      {[82, 118].map(cx => (
        <g key={cx}>
          <ellipse cx={cx} cy="120" rx="9" ry="10.5" fill="#FFFFFF" />
          <circle cx={cx} cy="121" r="7.4" fill="#5A3420" />
          <circle cx={cx} cy="121" r="3.8" fill="#1A0E0A" />
          <circle cx={cx + 3} cy="117" r="2.7" fill="#FFFFFF" />
          <circle cx={cx - 2.5} cy="125" r="1.2" fill="#FFFFFF" />
        </g>
      ))}
      <path d="M72 116 Q82 106 92 114 M108 114 Q118 106 128 116" stroke={HAIR} strokeWidth="2.6" strokeLinecap="round" fill="none" />
      {lashes && (
        <path d="M72 116 L67 112 M74 112 L70 107 M128 116 L133 112 M126 112 L130 107" stroke={HAIR} strokeWidth="1.6" strokeLinecap="round" />
      )}
    </g>
  );
}

function Face({ lashes, lips }) {
  return (
    <>
      <ellipse cx="54" cy="122" rx="7" ry="9" fill={SKIN_SHADE} />
      <ellipse cx="146" cy="122" rx="7" ry="9" fill={SKIN_SHADE} />
      <ellipse cx="100" cy="118" rx="45" ry="44" fill={SKIN} />
      <ellipse cx="70" cy="138" rx="7.5" ry="4.5" fill="#F08A80" opacity="0.45" />
      <ellipse cx="130" cy="138" rx="7.5" ry="4.5" fill="#F08A80" opacity="0.45" />
      <Eyes lashes={lashes} />
      <path d="M98 133 Q100 136 102 133" stroke={SKIN_SHADE} strokeWidth="1.6" strokeLinecap="round" fill="none" />
      {lips ? (
        <path d="M92 143 Q100 151 108 143 Q100 147 92 143 Z" fill="#D6264A" stroke="#B3122E" strokeWidth="1" />
      ) : (
        <path d="M92 143 Q100 150 108 143" stroke="#8A3A2A" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      )}
    </>
  );
}

function Shadow() {
  return <ellipse cx="100" cy="352" rx="54" ry="6" fill="#000000" opacity="0.2" />;
}

export function GroomArt() {
  return (
    <g className="char__figure">
      <Shadow />
      <g className="char__body">
        {/* Churidar and juttis */}
        <rect x="80" y="294" width="17" height="48" rx="6" fill={CREAM_SHADE} />
        <rect x="103" y="294" width="17" height="48" rx="6" fill={CREAM_SHADE} />
        <path d="M70 348 Q74 336 92 337 L98 343 Q98 350 90 351 Z" fill="#6E3F22" />
        <path d="M130 348 Q126 336 108 337 L102 343 Q102 350 110 351 Z" fill="#6E3F22" />
        <path d="M72 346 Q80 340 92 340 M128 346 Q120 340 108 340" stroke={GOLD} strokeWidth="1.4" fill="none" />

        {/* Sherwani */}
        <path d="M60 178 C64 166 80 160 100 160 C120 160 136 166 140 178 L150 298 C130 304 70 304 50 298 Z" fill={CREAM} />
        <path d="M100 166 L100 298" stroke={CREAM_SHADE} strokeWidth="1.6" />
        <path d="M54 286 C80 292 120 292 146 286" stroke={GOLD} strokeWidth="2.2" fill="none" />
        {[178, 194, 210, 226, 262, 278].map(y => (
          <circle key={y} cx="100" cy={y} r="2.6" fill={GOLD} />
        ))}
        {[[72, 200], [80, 240], [70, 270], [126, 250], [118, 280], [84, 218]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.3" fill={GOLD_LIGHT} />
        ))}
        <path d="M88 158 Q100 168 112 158 L112 166 Q100 174 88 166 Z" fill={CREAM_SHADE} stroke={GOLD} strokeWidth="1" />
        <rect x="90" y="148" width="20" height="14" fill={SKIN_SHADE} />

        <g className="char__jewel">
          <path d="M84 168 C88 196 112 196 116 168" stroke={GOLD} strokeWidth="3.6" strokeLinecap="round" strokeDasharray="0.1 5.5" fill="none" />
          <path d="M80 170 C84 214 116 214 120 170" stroke={GOLD_LIGHT} strokeWidth="2.4" fill="none" />
          <circle cx="100" cy="206" r="4.6" fill={GOLD} />
          <circle cx="100" cy="206" r="2" fill="#C1121F" />
          <circle cx="90" cy="198" r="1.8" fill="#1F8A5B" />
          <circle cx="110" cy="198" r="1.8" fill="#1F8A5B" />
        </g>

        {/* Sleeves, the red dupatta over his left shoulder, then joined hands */}
        <path d="M64 182 C50 204 54 230 78 240" stroke={CREAM} strokeWidth="22" strokeLinecap="round" fill="none" />
        <path d="M136 182 C150 204 146 230 122 240" stroke={CREAM} strokeWidth="22" strokeLinecap="round" fill="none" />
        <g className="char__dupatta">
          <path d="M118 164 C134 162 146 172 148 184 L156 300 C150 306 134 306 128 300 L126 202 C124 188 120 176 118 164 Z" fill={RED} />
          <path d="M118 164 C134 162 146 172 148 184 L156 300 M128 300 L126 202 C124 188 120 176 118 164" stroke={GOLD} strokeWidth="2.6" fill="none" />
          <path d="M130 300 L154 300" stroke={GOLD_LIGHT} strokeWidth="6" strokeDasharray="1 2" />
          {[[138, 220], [140, 250], [142, 278], [134, 196]].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="2.2" fill={GOLD} />
          ))}
        </g>
        <g className="char__hands">
          <path d="M82 232 L88 246 M118 232 L112 246" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="94" cy="242" rx="11" ry="9" fill={SKIN} />
          <ellipse cx="106" cy="244" rx="11" ry="9" fill={SKIN} stroke={SKIN_SHADE} strokeWidth="0.8" />
          <path d="M100 238 L108 238 M101 242 L109 242 M102 246 L109 246" stroke={SKIN_SHADE} strokeWidth="0.9" strokeLinecap="round" />
        </g>

        <g className="char__head">
          <path d="M54 122 C50 98 62 88 100 88 C138 88 150 98 146 122 C140 108 128 102 114 104 C108 110 92 110 86 104 C72 102 60 108 54 122 Z" fill={HAIR} />
          <Face />
          <path d="M60 104 C66 92 80 90 88 96 L82 104 C74 102 66 104 60 110 Z M140 104 C134 92 120 90 112 96 L118 104 C126 102 134 104 140 110 Z" fill={HAIR} />
          <ellipse cx="100" cy="101" rx="1.8" ry="4" fill="#C1121F" />

          {/* Safa: wrapped turban, sarpech brooch and a fan-pleated kalgi */}
          <g className="char__kalgi">
            <path d="M104 50 L92 8 Q118 -2 138 14 Z" fill="#F28C28" />
            <path d="M104 50 L100 8 M104 50 L110 4 M104 50 L120 4 M104 50 L130 8" stroke="#E06B10" strokeWidth="1.4" />
          </g>
          <path d="M50 98 C42 62 68 40 100 40 C132 40 158 62 150 98 C134 90 118 88 100 88 C82 88 66 90 50 98 Z" fill="#D9361E" />
          <path d="M56 86 C80 70 120 70 146 86 M54 72 C78 54 124 54 148 72 M64 56 C84 46 118 46 138 56" stroke="#F28C28" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M50 98 C66 90 82 88 100 88 C118 88 134 90 150 98" stroke={GOLD} strokeWidth="3.2" fill="none" />
          <g className="char__jewel">
            <circle cx="100" cy="70" r="10" fill={GOLD} />
            <circle cx="100" cy="70" r="4.4" fill="#C1121F" />
            <path d="M100 80 L100 88" stroke={GOLD} strokeWidth="1.4" />
            <path d="M97 88 L103 88 L100 95 Z" fill="#1F9AA8" />
            {[0, 60, 120, 180, 240, 300].map(a => (
              <circle key={a} cx={100 + 7.5 * Math.cos((a * Math.PI) / 180)} cy={70 + 7.5 * Math.sin((a * Math.PI) / 180)} r="1.3" fill={GOLD_LIGHT} />
            ))}
          </g>
        </g>
      </g>
    </g>
  );
}

const BOUQUET_LEAVES = [[84, 254, -30], [116, 254, 30], [90, 280, -20], [110, 284, 20], [100, 304, 0]];
const BOUQUET_FLOWERS = [
  [90, 256, '#FFFFFF'], [104, 262, '#FFFFFF'], [96, 274, '#FFFFFF'], [108, 286, '#FFFFFF'], [98, 294, '#FFFFFF'],
  [112, 252, '#F38BB0'], [86, 270, '#F38BB0'], [102, 282, '#F38BB0'],
  [82, 260, '#3D7FE0'], [116, 270, '#3D7FE0'], [92, 302, '#3D7FE0'], [106, 300, '#3D7FE0'],
];

export function BrideArt() {
  return (
    <g className="char__figure">
      <Shadow />
      <g className="char__body">
        {/* The sheer veil behind, then long hair */}
        <g className="char__veil">
          <path d="M52 96 C50 48 150 48 148 96 L172 304 C150 318 50 318 28 304 Z" fill="#F25C3B" opacity="0.32" />
          <path d="M52 96 L28 304 M148 96 L172 304" stroke={GOLD} strokeWidth="2.4" fill="none" opacity="0.8" />
        </g>
        <path d="M56 100 C52 60 148 60 144 100 L152 196 C138 204 62 204 48 196 Z" fill={HAIR} />

        {/* Lehenga with gold bands at the hem */}
        <path d="M64 218 C58 262 40 312 24 342 L176 342 C160 312 142 262 136 218 Z" fill={RED} />
        {[[86, 228, 70, 340], [100, 228, 100, 340], [114, 228, 130, 340]].map(([x1, y1, x2, y2]) => (
          <path key={x1} d={`M${x1} ${y1} L${x2} ${y2}`} stroke={RED_DEEP} strokeWidth="1.4" />
        ))}
        <path d="M27 334 L173 334" stroke={GOLD} strokeWidth="8" />
        <path d="M34 320 L166 320" stroke={GOLD_LIGHT} strokeWidth="2.6" />
        {[[60, 300], [140, 300], [76, 270], [124, 268], [52, 320], [148, 320], [100, 318]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill={GOLD} />
        ))}

        {/* Blouse and pallu */}
        <path d="M62 178 C66 166 82 160 100 160 C118 160 134 166 138 178 L140 224 L60 224 Z" fill="#E0365A" />
        <path d="M60 222 L140 222" stroke={GOLD} strokeWidth="3" />
        <path d="M84 162 Q100 176 116 162" stroke={GOLD} strokeWidth="2.6" fill="none" />
        <g className="char__dupatta">
          <path d="M120 164 C136 164 146 176 144 192 L94 300 L72 296 Z" fill="#E8A33A" />
          <path d="M120 164 C136 164 146 176 144 192 L94 300 M72 296 L120 164" stroke={RED_DEEP} strokeWidth="2" fill="none" />
          <path d="M126 186 L90 270" stroke={RED} strokeWidth="3" strokeDasharray="4 5" />
        </g>
        <rect x="91" y="148" width="18" height="14" fill={SKIN_SHADE} />

        <g className="char__jewel">
          <path d="M86 164 Q100 176 114 164" stroke={GOLD} strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M82 168 C86 206 114 206 118 168" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="0.1 4.2" fill="none" />
          <path d="M80 170 C84 214 116 214 120 170" stroke={GOLD_LIGHT} strokeWidth="2" fill="none" />
          <circle cx="100" cy="186" r="4" fill={GOLD} />
          <circle cx="100" cy="186" r="1.8" fill="#1F8A5B" />
        </g>

        {/* Arms, bangles, the flower garland she holds, then her hands */}
        <path d="M64 180 C58 192 56 200 57 208 M136 180 C142 192 144 200 143 208" stroke="#E0365A" strokeWidth="16" strokeLinecap="round" fill="none" />
        <path d="M58 206 C56 228 68 244 88 250 M142 206 C144 228 132 244 112 250" stroke={SKIN} strokeWidth="12" strokeLinecap="round" fill="none" />
        <g className="char__bangles" stroke={GOLD_LIGHT} strokeWidth="2.6" strokeLinecap="round">
          <path d="M66 236 L72 228 M70 240 L76 232 M134 236 L128 228 M130 240 L124 232" />
        </g>
        <g className="char__bouquet">
          {BOUQUET_LEAVES.map(([x, y, r]) => (
            <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="8" ry="3.6" fill="#3E8E4E" transform={`rotate(${r} ${x} ${y})`} />
          ))}
          {BOUQUET_FLOWERS.map(([x, y, color]) => (
            <g key={`${x}-${y}`}>
              <circle cx={x} cy={y} r="5.6" fill={color} stroke="#00000014" strokeWidth="0.6" />
              <circle cx={x} cy={y} r="1.7" fill="#F7D774" />
            </g>
          ))}
        </g>
        <ellipse cx="91" cy="250" rx="8" ry="6.5" fill={SKIN} />
        <ellipse cx="109" cy="250" rx="8" ry="6.5" fill={SKIN} />

        <g className="char__head">
          <Face lashes lips />
          <path d="M56 112 C54 74 146 74 144 112 C138 92 122 82 100 82 C78 82 62 92 56 112 Z" fill={HAIR} />
          <path d="M100 76 L100 86" stroke="#5A4048" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="100" cy="106" r="2.4" fill="#C1121F" />
          <circle cx="95.5" cy="135" r="2.4" stroke={GOLD} strokeWidth="1" fill="none" />
          <g className="char__jewel">
            <path d="M100 76 C86 78 72 86 60 100 M100 76 C114 78 128 86 140 100" stroke={GOLD} strokeWidth="1.4" fill="none" />
            <path d="M100 76 L100 88" stroke={GOLD} strokeWidth="1.4" />
            <path d="M92 88 L108 88 L100 101 Z" fill={GOLD} />
            <circle cx="100" cy="92" r="2.3" fill="#C1121F" />
          </g>
          {/* The veil drawn forward over her hair, edged in gold */}
          <g className="char__veil">
            <path d="M50 108 C44 50 156 50 150 108 C144 78 124 64 100 64 C76 64 56 78 50 108 Z" fill="#E8452E" opacity="0.6" />
            <path d="M50 108 C44 50 156 50 150 108" stroke={GOLD} strokeWidth="3" strokeDasharray="5 2" fill="none" />
          </g>
        </g>

        <g className="char__jhumka" aria-hidden="true">
          <circle cx="54" cy="132" r="3" fill={GOLD} />
          <path d="M47 136 Q54 154 61 136 Z" fill={GOLD} />
          <path d="M48 147 L60 147" stroke={GOLD_LIGHT} strokeWidth="2" strokeDasharray="0.1 3" strokeLinecap="round" />
        </g>
        <g className="char__jhumka char__jhumka--late" aria-hidden="true">
          <circle cx="146" cy="132" r="3" fill={GOLD} />
          <path d="M139 136 Q146 154 153 136 Z" fill={GOLD} />
          <path d="M140 147 L152 147" stroke={GOLD_LIGHT} strokeWidth="2" strokeDasharray="0.1 3" strokeLinecap="round" />
        </g>
      </g>
    </g>
  );
}

function Portrait({ label, bg, children, className }) {
  return (
    <figure className={`photo char ${className || ''}`.trim()} style={{ aspectRatio: '200 / 360' }}>
      <svg viewBox="0 0 200 360" role="img" aria-label={label} preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={`char-bg-${bg.id}`} cx="50%" cy="38%" r="75%">
            <stop offset="0" stopColor={bg.inner} />
            <stop offset="1" stopColor={bg.outer} />
          </radialGradient>
          <radialGradient id="char-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor={GOLD_LIGHT} stopOpacity="0.55" />
            <stop offset="1" stopColor={GOLD_LIGHT} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="200" height="360" fill={`url(#char-bg-${bg.id})`} />
        <circle className="char__halo" cx="100" cy="130" r="96" fill="url(#char-halo)" />
        <Sparks />
        <Petals />
        {children}
      </svg>
    </figure>
  );
}

export function GroomPortrait({ className }) {
  return (
    <Portrait
      className={className}
      label="Illustration of Hemsagar in a red safa, cream sherwani and red dupatta"
      bg={{ id: 'groom', inner: '#17435A', outer: '#0E2A3B' }}
    >
      <GroomArt />
    </Portrait>
  );
}

export function BridePortrait({ className }) {
  return (
    <Portrait
      className={className}
      label="Illustration of Archana in a red lehenga and sheer veil, holding a garland of flowers"
      bg={{ id: 'bride', inner: '#8A1C3B', outer: '#4B0F26' }}
    >
      <BrideArt />
    </Portrait>
  );
}

/**
 * Both characters side by side with no background, for laying over other artwork
 * (the mandap behind the temple doors). Each sits in a group the opening timeline
 * can move on its own.
 */
export function CoupleFigures({ className }) {
  return (
    <svg className={`char ${className || ''}`.trim()} viewBox="0 0 400 360" aria-hidden="true">
      <g className="couple__groom">
        <g transform="translate(14 0)">
          <GroomArt />
        </g>
      </g>
      <g className="couple__bride">
        <g transform="translate(186 0)">
          <BrideArt />
        </g>
      </g>
    </svg>
  );
}

const GOPURAM_TIERS = [
  { w: 100, y: 190, h: 110 },
  { w: 84, y: 162, h: 28 },
  { w: 68, y: 138, h: 24 },
  { w: 52, y: 116, h: 22 },
  { w: 36, y: 98, h: 18 },
];

/**
 * Both of them beneath a gopuram and a swag of marigolds, for the muhurtham card.
 * Muhurtham.jsx walks them in from either side and drops the garland as the card
 * scrolls into view; at rest they stand together.
 */
export function CoupleScene({ className }) {
  return (
    <figure className={`photo char ${className || ''}`.trim()} style={{ aspectRatio: '4 / 3' }}>
      <svg
        viewBox="0 0 400 300"
        role="img"
        aria-label="Illustration of Hemsagar and Archana standing together beneath a temple gopuram, strung with marigolds"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="char-bg-scene" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0E2A3B" />
            <stop offset="0.6" stopColor="#4B0F26" />
            <stop offset="1" stopColor="#8A1C3B" />
          </linearGradient>
          <radialGradient id="char-halo-scene" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor={GOLD_LIGHT} stopOpacity="0.5" />
            <stop offset="1" stopColor={GOLD_LIGHT} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="300" fill="url(#char-bg-scene)" />
        <circle className="char__halo" cx="200" cy="150" r="170" fill="url(#char-halo-scene)" />

        <g className="scene__gopuram" fill={GOLD_LIGHT} fillOpacity="0.16" stroke={GOLD_LIGHT} strokeOpacity="0.35" strokeWidth="1">
          {GOPURAM_TIERS.map(tier => (
            <rect key={tier.y} x={200 - tier.w / 2} y={tier.y} width={tier.w} height={tier.h} rx="2" />
          ))}
          <path d="M200 76 C194 84 194 94 200 98 C206 94 206 84 200 76 Z" />
        </g>

        <Sparks offset={100} />
        <Petals offset={100} fall={320} />

        <g className="scene__groom">
          <g transform="translate(46 12) scale(0.8)">
            <GroomArt />
          </g>
        </g>
        <g className="scene__bride">
          <g transform="translate(194 12) scale(0.8)">
            <BrideArt />
          </g>
        </g>

        <g className="scene__swag">
          <Garland d="M-6 14 Q200 110 406 14" className="char__garland" size={11} />
        </g>
      </svg>
    </figure>
  );
}
