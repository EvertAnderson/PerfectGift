import React, { useMemo } from 'react';
import './KingProteaFlower.css';

const CX = 200;
const CY = 200;
const f = (n) => n.toFixed(2);

function toRad(deg) { return (deg * Math.PI) / 180; }

// ── Bract outline path ──────────────────────────────────────────────────────
function bracePath(angle, length, width, baseR = 55) {
  const a = toRad(angle - 90);
  const perp = a + Math.PI / 2;
  const bx = CX + baseR * Math.cos(a);
  const by = CY + baseR * Math.sin(a);
  const tx = CX + (baseR + length) * Math.cos(a);
  const ty = CY + (baseR + length) * Math.sin(a);
  const hw = width / 2;
  const lx = bx + hw * Math.cos(perp);
  const ly = by + hw * Math.sin(perp);
  const rx = bx - hw * Math.cos(perp);
  const ry = by - hw * Math.sin(perp);
  // Slightly pinched blend for a more tapered look
  const blend = 0.58;
  const c1x = lx + blend * length * Math.cos(a);
  const c1y = ly + blend * length * Math.sin(a);
  const c2x = rx + blend * length * Math.cos(a);
  const c2y = ry + blend * length * Math.sin(a);
  return `M${f(lx)},${f(ly)} C${f(c1x)},${f(c1y)} ${f(tx)},${f(ty)} ${f(tx)},${f(ty)} C${f(tx)},${f(ty)} ${f(c2x)},${f(c2y)} ${f(rx)},${f(ry)} Z`;
}

// ── Midrib + lateral veins for a bract ─────────────────────────────────────
function braceVeins(angle, length, baseR = 55) {
  const a = toRad(angle - 90);
  const bx = CX + baseR * Math.cos(a);
  const by = CY + baseR * Math.sin(a);
  const tx = CX + (baseR + length) * Math.cos(a);
  const ty = CY + (baseR + length) * Math.sin(a);

  const paths = [];
  // midrib
  paths.push(`M${f(bx)},${f(by)} L${f(tx)},${f(ty)}`);

  // 3 pairs of lateral veins
  for (let k = 1; k <= 3; k++) {
    const t = k / 4.5;
    const mx = bx + t * (tx - bx);
    const my = by + t * (ty - by);
    const vl = (length * 0.27) * (1 - t * 0.45);
    const va1 = a + toRad(38);
    const va2 = a - toRad(38);
    paths.push(`M${f(mx)},${f(my)} L${f(mx + Math.cos(va1) * vl)},${f(my + Math.sin(va1) * vl)}`);
    paths.push(`M${f(mx)},${f(my)} L${f(mx + Math.cos(va2) * vl)},${f(my + Math.sin(va2) * vl)}`);
  }
  return paths;
}

// ── Evenly-spaced angles ────────────────────────────────────────────────────
function angles(n, offset = 0) {
  return Array.from({ length: n }, (_, i) => offset + (360 / n) * i);
}

// ── Layer definitions ────────────────────────────────────────────────────────
function useLayers() {
  return useMemo(() => {
    return [
      // 0 — Stipular bracts (green-tinged, widest, at the very base)
      {
        id: 'stipule',
        angList: angles(10, 5),
        length: 62, width: 36, baseR: 48,
        fill: 'url(#grad-stipule)', stroke: '#3a0030', strokeWidth: 1.0,
        delay: 0.05, duration: 1.4,
      },
      // 1 — Outermost bracts (deep burgundy)
      {
        id: 'outer2',
        angList: angles(16, 0),
        length: 125, width: 36, baseR: 54,
        fill: 'url(#grad-outer2)', stroke: '#4a0028', strokeWidth: 1.3,
        delay: 0.6, duration: 2.0,
      },
      // 2 — Outer bracts (dark crimson-magenta)
      {
        id: 'outer',
        angList: angles(14, 360 / 28),
        length: 105, width: 31, baseR: 54,
        fill: 'url(#grad-outer)', stroke: '#6d0033', strokeWidth: 1.2,
        delay: 2.4, duration: 1.8,
      },
      // 3 — Mid bracts (vivid magenta)
      {
        id: 'mid',
        angList: angles(12, 360 / 24),
        length: 82, width: 26, baseR: 52,
        fill: 'url(#grad-mid)', stroke: '#ad1457', strokeWidth: 1.0,
        delay: 4.0, duration: 1.6,
      },
      // 4 — Inner bracts (bright pink)
      {
        id: 'inner',
        angList: angles(10, 360 / 20),
        length: 62, width: 20, baseR: 50,
        fill: 'url(#grad-inner)', stroke: '#d81b60', strokeWidth: 0.9,
        delay: 5.4, duration: 1.4,
      },
      // 5 — Innermost bracts (pale pink/cream)
      {
        id: 'innermost',
        angList: angles(8, 360 / 16),
        length: 42, width: 14, baseR: 46,
        fill: 'url(#grad-innermost)', stroke: '#f06292', strokeWidth: 0.8,
        delay: 6.6, duration: 1.2,
      },
    ];
  }, []);
}

// ── Dome component ───────────────────────────────────────────────────────────
function DomeFlorets() {
  const florets = useMemo(() => {
    const items = [];
    const rings = [
      { r: 0,  count: 1  },
      { r: 9,  count: 6  },
      { r: 17, count: 11 },
      { r: 25, count: 16 },
      { r: 33, count: 20 },
      { r: 41, count: 24 },
    ];
    rings.forEach(({ r, count }) => {
      for (let i = 0; i < count; i++) {
        const a = toRad((360 / count) * i + (r % 2 === 0 ? 0 : 10));
        const fx = CX + r * Math.cos(a);
        const fy = CY + r * Math.sin(a);
        const isCenter = r < 2;
        const isMid = r < 20;
        items.push({ fx, fy, isCenter, isMid });
      }
    });
    return items;
  }, []);

  return (
    <g>
      {/* Multi-layer dome base */}
      <circle cx={CX} cy={CY} r={50} fill="#200012" />
      <circle cx={CX} cy={CY} r={47} fill="url(#grad-dome-base)" />
      <circle cx={CX} cy={CY} r={43} fill="#3d0024" />
      {/* Texture rings */}
      {[37, 30, 23, 16].map(r => (
        <circle key={r} cx={CX} cy={CY} r={r} fill="none"
          stroke="#5c0038" strokeWidth="0.6" opacity="0.5" />
      ))}

      {/* Floret stems and tips */}
      {florets.map((fl, i) => {
        const stemLen = fl.isCenter ? 10 : fl.isMid ? 8 : 6.5;
        const tipR = fl.isCenter ? 2.5 : fl.isMid ? 1.8 : 1.4;
        const tipColor = fl.isCenter ? '#fffde7' : fl.isMid ? '#fff8e1' : '#fce4ec';
        const stemColor = fl.isMid ? '#f8bbd0' : '#f48fb1';
        return (
          <g key={i}>
            <line x1={fl.fx} y1={fl.fy} x2={fl.fx} y2={fl.fy - stemLen}
              stroke={stemColor} strokeWidth={fl.isCenter ? 1.5 : 1.0} strokeLinecap="round" />
            <circle cx={fl.fx} cy={fl.fy - stemLen} r={tipR} fill={tipColor} />
          </g>
        );
      })}

      {/* Rim highlights */}
      <circle cx={CX} cy={CY} r={50} fill="none" stroke="#e91e8c" strokeWidth="1.2" opacity="0.4" />
      <circle cx={CX} cy={CY} r={48} fill="none" stroke="#f48fb1" strokeWidth="0.8" opacity="0.3" />

      {/* Dome edge fuzzy texture */}
      {Array.from({ length: 32 }, (_, i) => {
        const a = toRad(i * (360 / 32));
        const r0 = 45;
        const r1 = 50 + Math.sin(i * 2.5) * 3;
        return (
          <line key={i}
            x1={CX + r0 * Math.cos(a)} y1={CY + r0 * Math.sin(a)}
            x2={CX + r1 * Math.cos(a)} y2={CY + r1 * Math.sin(a)}
            stroke="#f8bbd0" strokeWidth="0.7" opacity="0.5" strokeLinecap="round"
          />
        );
      })}
    </g>
  );
}

// ── Stem + leaves ────────────────────────────────────────────────────────────
function StemAndLeaves({ active }) {
  return (
    <g className={`stem ${active ? 'stem--active' : ''}`}>
      {/* Main stem */}
      <path d={`M${CX},${CY + 53} C${CX - 10},${CY + 100} ${CX + 8},${CY + 155} ${CX + 2},${CY + 215}`}
        fill="none" stroke="#1b5e20" strokeWidth="9" strokeLinecap="round" />
      <path d={`M${CX},${CY + 53} C${CX - 10},${CY + 100} ${CX + 8},${CY + 155} ${CX + 2},${CY + 215}`}
        fill="none" stroke="#388e3c" strokeWidth="6" strokeLinecap="round" />
      {/* Stem highlight */}
      <path d={`M${CX - 1},${CY + 55} C${CX - 8},${CY + 100} ${CX + 6},${CY + 150} ${CX + 2},${CY + 210}`}
        fill="none" stroke="#66bb6a" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />

      {/* Leaf left */}
      <path d={`M${CX - 6},${CY + 125} C${CX - 50},${CY + 103} ${CX - 72},${CY + 148} ${CX - 44},${CY + 160}
        C${CX - 22},${CY + 170} ${CX - 6},${CY + 145} ${CX - 6},${CY + 125}`}
        fill="#2e7d32" stroke="#1b5e20" strokeWidth="1" />
      <path d={`M${CX - 6},${CY + 125} C${CX - 38},${CY + 132} ${CX - 58},${CY + 152} ${CX - 44},${CY + 160}`}
        fill="none" stroke="#388e3c" strokeWidth="1.2" opacity="0.7" />
      {[0.3, 0.55, 0.75].map((t, i) => {
        const mx = (CX - 6) + t * ((CX - 44) - (CX - 6));
        const my = (CY + 125) + t * ((CY + 160) - (CY + 125)) + t * 15;
        return (
          <line key={i}
            x1={mx} y1={my}
            x2={mx - 14 * (1 - t)} y2={my - 5 + 8 * t}
            stroke="#388e3c" strokeWidth="0.8" opacity="0.6" strokeLinecap="round"
          />
        );
      })}

      {/* Leaf right */}
      <path d={`M${CX + 5},${CY + 148} C${CX + 46},${CY + 132} ${CX + 70},${CY + 173} ${CX + 42},${CY + 182}
        C${CX + 20},${CY + 190} ${CX + 5},${CY + 168} ${CX + 5},${CY + 148}`}
        fill="#2e7d32" stroke="#1b5e20" strokeWidth="1" />
      <path d={`M${CX + 5},${CY + 148} C${CX + 38},${CY + 155} ${CX + 58},${CY + 175} ${CX + 42},${CY + 182}`}
        fill="none" stroke="#388e3c" strokeWidth="1.2" opacity="0.7" />
      {[0.3, 0.55, 0.75].map((t, i) => {
        const mx = (CX + 5) + t * ((CX + 42) - (CX + 5));
        const my = (CY + 148) + t * ((CY + 182) - (CY + 148)) + t * 8;
        return (
          <line key={i}
            x1={mx} y1={my}
            x2={mx + 14 * (1 - t)} y2={my - 5 + 8 * t}
            stroke="#388e3c" strokeWidth="0.8" opacity="0.6" strokeLinecap="round"
          />
        );
      })}

      {/* Upper small leaf */}
      <path d={`M${CX + 3},${CY + 80} C${CX + 30},${CY + 68} ${CX + 42},${CY + 90} ${CX + 20},${CY + 98}
        C${CX + 8},${CY + 102} ${CX + 3},${CY + 90} ${CX + 3},${CY + 80}`}
        fill="#388e3c" stroke="#2e7d32" strokeWidth="0.8" />
    </g>
  );
}

// ── Orbiting stars — each uses SMIL animateTransform to orbit around the center ─
// Stars start at evenly spaced angles and orbit continuously at different speeds.
const ORBIT_STARS = [
  { startDeg:   0, r: 176, size: 7.0, dur: 14, color: '#f48fb1' },
  { startDeg:  45, r: 168, size: 5.5, dur: 10, color: '#f8bbd0' },
  { startDeg:  90, r: 179, size: 8.5, dur: 17, color: '#ec407a' },
  { startDeg: 135, r: 170, size: 6.0, dur: 12, color: '#f48fb1' },
  { startDeg: 180, r: 176, size: 7.5, dur: 15, color: '#f8bbd0' },
  { startDeg: 225, r: 166, size: 5.0, dur: 11, color: '#f06292' },
  { startDeg: 270, r: 179, size: 8.0, dur: 18, color: '#ec407a' },
  { startDeg: 315, r: 171, size: 6.5, dur: 13, color: '#f48fb1' },
];

function OrbitingStars({ visible }) {
  return (
    <g className={`orbiting-stars ${visible ? 'orbiting-stars--visible' : ''}`}>
      {ORBIT_STARS.map((s, i) => (
        /* Each <g> is rotated around (CX,CY) by animateTransform.
           The star shape is translated to (CX+r, CY) so it sits on the orbit circle
           before the rotation is applied. */
        <g key={i}>
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`${s.startDeg} ${CX} ${CY}`}
            to={`${s.startDeg + 360} ${CX} ${CY}`}
            dur={`${s.dur}s`}
            repeatCount="indefinite"
          />
          <g transform={`translate(${CX + s.r},${CY})`}>
            {/* 4-pointed star */}
            <line x1={0} y1={-s.size} x2={0} y2={s.size}
              stroke={s.color} strokeWidth="1.8" strokeLinecap="round" />
            <line x1={-s.size} y1={0} x2={s.size} y2={0}
              stroke={s.color} strokeWidth="1.8" strokeLinecap="round" />
            <line x1={-s.size * .62} y1={-s.size * .62} x2={s.size * .62} y2={s.size * .62}
              stroke="#fce4ec" strokeWidth="1.1" strokeLinecap="round" opacity="0.85" />
            <line x1={s.size * .62} y1={-s.size * .62} x2={-s.size * .62} y2={s.size * .62}
              stroke="#fce4ec" strokeWidth="1.1" strokeLinecap="round" opacity="0.85" />
            <circle r={s.size * 0.22} fill="#fff8e1" />
          </g>
        </g>
      ))}
    </g>
  );
}

// ── Bract layer with veins ────────────────────────────────────────────────────
function BractLayer({ layer, active, showVeins }) {
  const paths = useMemo(() =>
    layer.angList.map(a => bracePath(a, layer.length, layer.width, layer.baseR)),
    [layer]
  );
  const veins = useMemo(() =>
    layer.angList.map(a => braceVeins(a, layer.length, layer.baseR)),
    [layer]
  );

  return (
    <g>
      {paths.map((d, i) => (
        <path key={i} d={d}
          fill={layer.fill}
          stroke={layer.stroke}
          strokeWidth={layer.strokeWidth}
          className={`bract-path ${active ? 'bract-path--active' : ''}`}
          style={{ animationDelay: `${layer.delay + i * 0.035}s`, animationDuration: `${layer.duration}s` }}
        />
      ))}
      {/* Vein lines rendered on top */}
      {showVeins && veins.map((veinSet, i) => (
        veinSet.map((vd, j) => (
          <path key={`${i}-${j}`} d={vd}
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth={j === 0 ? 0.9 : 0.6}
            strokeLinecap="round"
            className={`bract-path ${active ? 'bract-path--active' : ''}`}
            style={{
              animationDelay: `${layer.delay + i * 0.035 + 0.05}s`,
              animationDuration: `${layer.duration}s`,
            }}
          />
        ))
      ))}
    </g>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
function KingProteaFlower({ active, showSparkles }) {
  const layers = useLayers();
  const domeDelay = 7.8;

  return (
    <div className="flower-wrap">
      <svg viewBox="0 0 400 440" xmlns="http://www.w3.org/2000/svg" className="protea-svg">
        <defs>
          {/* Radial gradients — inner=dark, outer=lighter (correct for King Protea) */}
          <radialGradient id="grad-stipule" cx={CX} cy={CY} r="125" gradientUnits="userSpaceOnUse">
            <stop offset="30%" stopColor="#1a3a1c" />
            <stop offset="70%" stopColor="#4a1040" />
            <stop offset="100%" stopColor="#7b1950" />
          </radialGradient>
          <radialGradient id="grad-outer2" cx={CX} cy={CY} r="175" gradientUnits="userSpaceOnUse">
            <stop offset="25%" stopColor="#3b0020" />
            <stop offset="65%" stopColor="#6d0033" />
            <stop offset="100%" stopColor="#a50050" />
          </radialGradient>
          <radialGradient id="grad-outer" cx={CX} cy={CY} r="155" gradientUnits="userSpaceOnUse">
            <stop offset="25%" stopColor="#4f0030" />
            <stop offset="60%" stopColor="#8b0042" />
            <stop offset="100%" stopColor="#c2185b" />
          </radialGradient>
          <radialGradient id="grad-mid" cx={CX} cy={CY} r="135" gradientUnits="userSpaceOnUse">
            <stop offset="25%" stopColor="#6d0040" />
            <stop offset="65%" stopColor="#b0004a" />
            <stop offset="100%" stopColor="#e91e8c" />
          </radialGradient>
          <radialGradient id="grad-inner" cx={CX} cy={CY} r="110" gradientUnits="userSpaceOnUse">
            <stop offset="25%" stopColor="#8b0050" />
            <stop offset="65%" stopColor="#d81b60" />
            <stop offset="100%" stopColor="#f06292" />
          </radialGradient>
          <radialGradient id="grad-innermost" cx={CX} cy={CY} r="90" gradientUnits="userSpaceOnUse">
            <stop offset="20%" stopColor="#ad1457" />
            <stop offset="65%" stopColor="#ec407a" />
            <stop offset="100%" stopColor="#f8bbd0" />
          </radialGradient>
          <radialGradient id="grad-dome-base" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4a0030" />
            <stop offset="60%" stopColor="#2d0018" />
            <stop offset="100%" stopColor="#1a000f" />
          </radialGradient>

          {/* Outer halo glow */}
          <radialGradient id="halo" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="#0d0008" stopOpacity="0" />
            <stop offset="80%" stopColor="#e91e8c" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#0d0008" stopOpacity="0" />
          </radialGradient>

          {/* Subtle inner bloom glow for dome */}
          <filter id="domeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Bract soft shadow */}
          <filter id="bractShadow" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#0d0008" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Outer halo */}
        <ellipse cx={CX} cy={CY} rx="185" ry="185" fill="url(#halo)" />

        {/* Stem + leaves first */}
        {active && <StemAndLeaves active={active} />}

        {/* Bract layers outer → inner */}
        {active && layers.map((layer, li) => (
          <BractLayer
            key={layer.id}
            layer={layer}
            active={active}
            showVeins={li >= 1} /* skip veins on stipules */
          />
        ))}

        {/* Dome — appears last */}
        {active && (
          <g filter="url(#domeGlow)"
            style={{ opacity: 0, animation: active ? `fadeInDome 1.2s ease-out ${domeDelay}s forwards` : 'none' }}>
            <DomeFlorets />
          </g>
        )}

        {/* Orbiting stars */}
        <OrbitingStars visible={showSparkles} />
      </svg>
    </div>
  );
}

export default KingProteaFlower;
