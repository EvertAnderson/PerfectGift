import React from 'react';
import './DecorativeBorder.css';

// ── Reusable micro-components ─────────────────────────────────────────────────

const P8 = [0, 45, 90, 135, 180, 225, 270, 315];
const P5 = [0, 72, 144, 216, 288];
const P6 = [0, 60, 120, 180, 240, 300];

/** Small 8-petal protea */
function F8({ cx = 0, cy = 0, ry = 12, rx = 3, fill = 'rgba(160,20,80,0.42)', stroke = 'rgba(244,143,177,0.78)' }) {
  return (
    <g transform={`translate(${cx},${cy})`}>
      {P8.map(a => <ellipse key={a} rx={rx} ry={ry} transform={`rotate(${a})`} fill={fill} stroke={stroke} strokeWidth="0.65" />)}
      <circle r={ry * 0.34 + 1} fill="rgba(25,0,12,0.65)" stroke={stroke} strokeWidth="0.7" />
      <circle r={ry * 0.17} fill="rgba(255,248,225,0.72)" />
    </g>
  );
}

/** Small 5-petal flower */
function F5({ cx = 0, cy = 0, ry = 5.5, fill = 'rgba(194,24,91,0.38)', stroke = 'rgba(244,143,177,0.65)' }) {
  return (
    <g transform={`translate(${cx},${cy})`}>
      {P5.map(a => <ellipse key={a} rx="1.6" ry={ry} transform={`rotate(${a})`} fill={fill} stroke={stroke} strokeWidth="0.45" />)}
      <circle r="2" fill="rgba(255,248,225,0.62)" />
    </g>
  );
}

/** Small 6-petal bud */
function F6({ cx = 0, cy = 0, ry = 4, fill = 'rgba(194,24,91,0.3)', stroke = 'rgba(244,143,177,0.55)' }) {
  return (
    <g transform={`translate(${cx},${cy})`}>
      {P6.map(a => <ellipse key={a} rx="1.2" ry={ry} transform={`rotate(${a})`} fill={fill} stroke={stroke} strokeWidth="0.4" />)}
      <circle r="1.5" fill="rgba(255,248,225,0.5)" />
    </g>
  );
}

/** One leaf from (x1,y1) curving to (x2,y2) */
function Leaf({ d, fill = 'rgba(65,125,65,0.20)', stroke = 'rgba(115,175,115,0.60)' }) {
  return <path d={d} fill={fill} stroke={stroke} strokeWidth="0.72" strokeLinecap="round" />;
}

// ── Corner ornament (160×160 viewBox, top-left orientation) ──────────────────
function CornerPiece() {
  return (
    <g>
      {/* === Frame lines: two concentric L-shapes with arc corner === */}
      <path d="M 12,36 L 12,158 M 36,12 L 158,12"
        stroke="rgba(244,143,177,0.44)" strokeWidth="0.9" fill="none" strokeLinecap="round" />
      <path d="M 18,34 L 18,158 M 34,18 L 158,18"
        stroke="rgba(244,143,177,0.22)" strokeWidth="0.55" fill="none" strokeLinecap="round" />
      <path d="M 12,34 A 22,22 0 0 1 34,12"
        stroke="rgba(244,143,177,0.44)" strokeWidth="0.9" fill="none" />
      <path d="M 18,32 A 16,16 0 0 1 32,18"
        stroke="rgba(244,143,177,0.22)" strokeWidth="0.55" fill="none" />

      {/* === Main corner protea flower === */}
      <F8 cx={33} cy={33} ry={14} rx={3.5}
        fill="rgba(155,22,78,0.45)" stroke="rgba(244,143,177,0.82)" />

      {/* Two small leaves flanking the corner flower */}
      <Leaf d="M 33,19 C 25,11 21,7 25,15" />
      <Leaf d="M 33,19 C 41,11 45,7 41,15" />

      {/* === Horizontal vine along top border === */}
      <path d="M 48,20 C 68,14 85,25 105,19 C 125,13 143,23 158,18"
        stroke="rgba(125,182,125,0.60)" strokeWidth="1.05" fill="none" strokeLinecap="round" />

      {/* Leaf pairs on horizontal vine */}
      <Leaf d="M 73,19 C 70,9 66,5 68,14" />
      <Leaf d="M 73,19 C 76,29 80,33 77,23" />
      <Leaf d="M 117,19 C 114,9 110,5 112,14" />
      <Leaf d="M 117,19 C 120,29 124,33 121,23" />

      {/* Flowers on horizontal vine */}
      <F5 cx={92} cy={17} ry={5.5} />
      <F6 cx={138} cy={17} ry={4.5} />

      {/* Tiny dot accent + curl at vine end */}
      <circle cx={50} cy={24} r="1.4" fill="rgba(244,143,177,0.42)" />
      <path d="M 158,18 C 164,12 169,18 164,23 C 159,28 154,21 158,18"
        stroke="rgba(125,182,125,0.48)" strokeWidth="0.72" fill="none" />

      {/* === Vertical vine along left border === */}
      <path d="M 20,48 C 14,68 25,85 19,105 C 13,125 23,143 18,158"
        stroke="rgba(125,182,125,0.60)" strokeWidth="1.05" fill="none" strokeLinecap="round" />

      {/* Leaf pairs on vertical vine */}
      <Leaf d="M 19,73 C 9,70 5,66 14,68" />
      <Leaf d="M 19,73 C 29,76 33,80 23,77" />
      <Leaf d="M 19,117 C 9,114 5,110 14,112" />
      <Leaf d="M 19,117 C 29,120 33,124 23,121" />

      {/* Flowers on vertical vine */}
      <F5 cx={17} cy={92} ry={5.5} />
      <F6 cx={17} cy={138} ry={4.5} />

      {/* Tiny dot accent + curl at vine end */}
      <circle cx={24} cy={50} r="1.4" fill="rgba(244,143,177,0.42)" />
      <path d="M 18,158 C 12,164 18,169 23,164 C 28,159 21,154 18,158"
        stroke="rgba(125,182,125,0.48)" strokeWidth="0.72" fill="none" />

      {/* Small extra berries / dot cluster near corner flower */}
      {[[46,30],[30,46],[44,44]].map(([x,y], i) => (
        <circle key={i} cx={x} cy={y} r="1.8" fill="rgba(244,143,177,0.35)" />
      ))}
    </g>
  );
}

// ── Top-centre ornament (260×72 viewBox, symmetric) ───────────────────────────
function TopCentre() {
  return (
    <g>
      {/* Larger central protea */}
      <F8 cx={130} cy={36} ry={17} rx={4.2}
        fill="rgba(155,22,78,0.48)" stroke="rgba(244,143,177,0.86)"
      />

      {/* Leaf pair flanking the central flower */}
      <Leaf d="M 113,22 C 105,13 101,9 104,19" />
      <Leaf d="M 147,22 C 155,13 159,9 156,19" />

      {/* Left vine */}
      <path d="M 112,32 C 93,25 74,34 56,28 C 38,22 22,30 6,26"
        stroke="rgba(125,182,125,0.58)" strokeWidth="1.05" fill="none" strokeLinecap="round" />
      {/* Right vine */}
      <path d="M 148,32 C 167,25 186,34 204,28 C 222,22 238,30 254,26"
        stroke="rgba(125,182,125,0.58)" strokeWidth="1.05" fill="none" strokeLinecap="round" />

      {/* Left vine — leaf pairs */}
      <Leaf d="M 75,31 C 72,21 68,17 70,26" />
      <Leaf d="M 75,31 C 78,41 82,44 79,35" />
      <Leaf d="M 40,28 C 37,18 33,14 35,23" />
      <Leaf d="M 40,28 C 43,38 47,41 44,32" />

      {/* Right vine — leaf pairs (mirrored) */}
      <Leaf d="M 185,31 C 182,21 178,17 180,26" />
      <Leaf d="M 185,31 C 188,41 192,44 189,35" />
      <Leaf d="M 220,28 C 217,18 213,14 215,23" />
      <Leaf d="M 220,28 C 223,38 227,41 224,32" />

      {/* Small side flowers */}
      <F5 cx={60}  cy={26} ry={5.5} />
      <F6 cx={18}  cy={24} ry={4.5} />
      <F5 cx={200} cy={26} ry={5.5} />
      <F6 cx={242} cy={24} ry={4.5} />

      {/* Tiny dots near centre flower */}
      {[[108,28],[152,28],[130,20]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="1.6" fill="rgba(244,143,177,0.38)" />
      ))}
    </g>
  );
}

// ── Side ornament (65×220 viewBox, centred on left edge) ─────────────────────
function SideOrnament() {
  return (
    <g>
      {/* Gentle vertical vine */}
      <path d="M 33,5 C 28,40 38,70 32,110 C 26,150 36,180 32,215"
        stroke="rgba(125,182,125,0.52)" strokeWidth="0.95" fill="none" strokeLinecap="round" />

      {/* Leaf pairs */}
      {[45, 110, 175].map((y, i) => (
        <g key={i}>
          <Leaf d={`M 32,${y} C 19,${y - 8} 13,${y - 14} 17,${y - 4}`} />
          <Leaf d={`M 32,${y} C 45,${y - 8} 51,${y - 14} 47,${y - 4}`} />
        </g>
      ))}

      {/* Centre flower */}
      <F5 cx={32} cy={110} ry={6} />

      {/* Small dots */}
      {[[32,75],[32,145]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="1.8" fill="rgba(244,143,177,0.38)" />
      ))}
    </g>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
function DecorativeBorder({ visible }) {
  return (
    <div className={`deco-border ${visible ? 'deco-border--visible' : ''}`}>

      {/* Corner ornaments — one design, CSS-mirrored for each corner */}
      <svg viewBox="0 0 160 160" className="corner-svg corner-tl" aria-hidden>
        <CornerPiece />
      </svg>
      <svg viewBox="0 0 160 160" className="corner-svg corner-tr" aria-hidden>
        <CornerPiece />
      </svg>
      <svg viewBox="0 0 160 160" className="corner-svg corner-bl" aria-hidden>
        <CornerPiece />
      </svg>
      <svg viewBox="0 0 160 160" className="corner-svg corner-br" aria-hidden>
        <CornerPiece />
      </svg>

      {/* Top + bottom centre ornaments */}
      <svg viewBox="0 0 260 72" className="centre-ornament centre-top" aria-hidden>
        <TopCentre />
      </svg>
      <svg viewBox="0 0 260 72" className="centre-ornament centre-bottom" aria-hidden>
        <TopCentre />
      </svg>

      {/* Left + right side ornaments */}
      <svg viewBox="0 0 65 220" className="side-ornament side-left" aria-hidden>
        <SideOrnament />
      </svg>
      <svg viewBox="0 0 65 220" className="side-ornament side-right" aria-hidden>
        <SideOrnament />
      </svg>
    </div>
  );
}

export default DecorativeBorder;
