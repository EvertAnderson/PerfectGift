import React, { useMemo } from 'react';
import './KingProteaFlower.css';

const CX = 200;
const CY = 195;

// --- Geometry helpers ---
function toRad(deg) { return (deg * Math.PI) / 180; }

/**
 * Generate a single bract (petal-like bract) path at a given angle.
 * The bract originates from the edge of the central dome (radius baseR)
 * and tapers to a point at distance (baseR + length).
 */
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

  const blend = 0.6;
  const c1x = lx + blend * length * Math.cos(a);
  const c1y = ly + blend * length * Math.sin(a);
  const c2x = rx + blend * length * Math.cos(a);
  const c2y = ry + blend * length * Math.sin(a);

  const f = (n) => n.toFixed(2);
  return `M${f(lx)},${f(ly)} C${f(c1x)},${f(c1y)} ${f(tx)},${f(ty)} ${f(tx)},${f(ty)} C${f(tx)},${f(ty)} ${f(c2x)},${f(c2y)} ${f(rx)},${f(ry)} Z`;
}

/** Evenly-spaced angles for N bracts */
function angles(n, offset = 0) {
  return Array.from({ length: n }, (_, i) => offset + (360 / n) * i);
}

// --- Bract layer data ---
// Each layer: { bracts:[paths], fill, stroke, strokeWidth, delay }

function useLayers() {
  return useMemo(() => {
    const outerAngles = angles(14, 0);
    const midAngles = angles(12, 360 / 24);
    const innerAngles = angles(10, 360 / 20);
    const innermost = angles(8, 360 / 16);

    return [
      // Layer 0 — outermost wide bracts (dark magenta)
      {
        id: 'outer',
        paths: outerAngles.map(a => bracePath(a, 115, 34, 52)),
        fill: '#8b0042',
        stroke: '#6d0033',
        strokeWidth: 1.2,
        delay: 0.1,
        duration: 1.8,
      },
      // Layer 1 — mid bracts (vivid pink)
      {
        id: 'mid',
        paths: midAngles.map(a => bracePath(a, 95, 28, 52)),
        fill: '#c2185b',
        stroke: '#ad1457',
        strokeWidth: 1,
        delay: 1.8,
        duration: 1.6,
      },
      // Layer 2 — inner bracts (bright pink)
      {
        id: 'inner',
        paths: innerAngles.map(a => bracePath(a, 74, 22, 50)),
        fill: '#e91e8c',
        stroke: '#d81b60',
        strokeWidth: 0.9,
        delay: 3.2,
        duration: 1.4,
      },
      // Layer 3 — innermost bracts (light pink)
      {
        id: 'innermost',
        paths: innermost.map(a => bracePath(a, 54, 16, 46)),
        fill: '#f48fb1',
        stroke: '#f06292',
        strokeWidth: 0.8,
        delay: 4.4,
        duration: 1.2,
      },
    ];
  }, []);
}

// Dome florets (the fuzzy center of a King Protea)
function DomeFlorets({ active }) {
  const florets = useMemo(() => {
    const items = [];
    // Concentric rings of florets
    const rings = [
      { r: 0, count: 1 },
      { r: 12, count: 7 },
      { r: 22, count: 13 },
      { r: 32, count: 18 },
      { r: 42, count: 22 },
    ];
    rings.forEach(({ r, count }) => {
      for (let i = 0; i < count; i++) {
        const a = toRad((360 / count) * i);
        const fx = CX + r * Math.cos(a);
        const fy = CY + r * Math.sin(a);
        const isCenter = r < 5;
        items.push({ fx, fy, isCenter });
      }
    });
    return items;
  }, []);

  return (
    <g className={`dome-florets ${active ? 'dome-florets--active' : ''}`}>
      {/* Dark base dome */}
      <circle cx={CX} cy={CY} r={48} fill="#4a0030" stroke="#2d0020" strokeWidth="1.5" />
      <circle cx={CX} cy={CY} r={44} fill="#5c0038" />

      {/* Floret stems/stigmas */}
      {florets.map((f, i) => (
        <g key={i}>
          <line
            x1={f.fx} y1={f.fy}
            x2={f.fx} y2={f.fy - (f.isCenter ? 9 : 7)}
            stroke="#f8bbd0"
            strokeWidth={f.isCenter ? 1.4 : 0.9}
            strokeLinecap="round"
          />
          <circle
            cx={f.fx}
            cy={f.fy - (f.isCenter ? 9 : 7)}
            r={f.isCenter ? 2.2 : 1.4}
            fill={f.isCenter ? '#fff8e1' : '#fce4ec'}
          />
        </g>
      ))}

      {/* Rim highlight */}
      <circle cx={CX} cy={CY} r={48} fill="none" stroke="#f48fb1" strokeWidth="1.5" opacity="0.6" />
    </g>
  );
}

// Stem + leaves
function StemAndLeaves({ active }) {
  return (
    <g className={`stem ${active ? 'stem--active' : ''}`}>
      {/* Stem */}
      <path
        d={`M${CX},${CY + 52} C${CX - 8},${CY + 100} ${CX + 5},${CY + 150} ${CX},${CY + 200}`}
        fill="none" stroke="#2e7d32" strokeWidth="7" strokeLinecap="round"
      />
      {/* Leaf left */}
      <path
        d={`M${CX - 5},${CY + 120} C${CX - 45},${CY + 100} ${CX - 65},${CY + 145} ${CX - 40},${CY + 155} C${CX - 20},${CY + 165} ${CX - 5},${CY + 140} ${CX - 5},${CY + 120}`}
        fill="#388e3c" stroke="#2e7d32" strokeWidth="1"
      />
      {/* Leaf right */}
      <path
        d={`M${CX + 3},${CY + 145} C${CX + 40},${CY + 130} ${CX + 65},${CY + 170} ${CX + 38},${CY + 178} C${CX + 18},${CY + 186} ${CX + 3},${CY + 165} ${CX + 3},${CY + 145}`}
        fill="#388e3c" stroke="#2e7d32" strokeWidth="1"
      />
      {/* Leaf veins */}
      <path d={`M${CX - 5},${CY + 120} C${CX - 35},${CY + 130} ${CX - 55},${CY + 150} ${CX - 40},${CY + 155}`}
        fill="none" stroke="#2e7d32" strokeWidth="0.7" opacity="0.7" />
      <path d={`M${CX + 3},${CY + 145} C${CX + 35},${CY + 152} ${CX + 55},${CY + 173} ${CX + 38},${CY + 178}`}
        fill="none" stroke="#2e7d32" strokeWidth="0.7" opacity="0.7" />
    </g>
  );
}

function BractLayer({ layer, active }) {
  return (
    <g>
      {layer.paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill={layer.fill}
          stroke={layer.stroke}
          strokeWidth={layer.strokeWidth}
          className={`bract-path ${active ? 'bract-path--active' : ''}`}
          style={{
            animationDelay: `${layer.delay + i * 0.04}s`,
            animationDuration: `${layer.duration}s`,
          }}
        />
      ))}
    </g>
  );
}

function KingProteaFlower({ active }) {
  const layers = useLayers();

  // dome appears after all bracts (~5.8s)
  const domeDelay = 5.6;
  const stemDelay = 0.05;

  return (
    <div className="flower-wrap">
      <svg
        viewBox="0 0 400 420"
        xmlns="http://www.w3.org/2000/svg"
        className="protea-svg"
      >
        <defs>
          <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2d0a1e" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0d0008" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Soft glow behind flower */}
        <ellipse cx={CX} cy={CY} rx="160" ry="160" fill="url(#bgGlow)" />

        {/* Stem drawn first */}
        {active && <StemAndLeaves active={active} style={{ animationDelay: `${stemDelay}s` }} />}

        {/* Bract layers — outer to inner */}
        {active && layers.map(layer => (
          <BractLayer key={layer.id} layer={layer} active={active} />
        ))}

        {/* Central dome — appears last */}
        {active && (
          <g style={{
            opacity: 0,
            animation: active ? `fadeInDome 1s ease-out ${domeDelay}s forwards` : 'none'
          }}>
            <DomeFlorets active={active} />
          </g>
        )}
      </svg>
    </div>
  );
}

export default KingProteaFlower;
