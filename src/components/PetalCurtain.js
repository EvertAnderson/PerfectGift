import React, { useMemo } from 'react';
import './PetalCurtain.css';

const PETAL_COLORS = ['#e91e8c','#d81b60','#f06292','#f48fb1','#ad1457','#c2185b','#ec407a'];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function PetalCurtain({ visible, fading }) {
  const petals = useMemo(() => {
    return Array.from({ length: 90 }, (_, i) => ({
      id: i,
      left: randomBetween(0, 100),         // % across screen
      delay: randomBetween(0, 2.8),        // staggered start
      duration: randomBetween(2.2, 3.8),   // fall speed
      size: randomBetween(10, 22),         // px
      rotate: randomBetween(0, 360),       // initial rotation
      spin: randomBetween(-180, 180),      // spin during fall
      color: PETAL_COLORS[i % PETAL_COLORS.length],
      skew: randomBetween(-20, 20),
    }));
  }, []);

  if (!visible && !fading) return null;

  return (
    <div className={`petal-curtain ${fading ? 'petal-curtain--fading' : ''}`}>
      {petals.map(p => (
        <div
          key={p.id}
          className="petal"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            width: `${p.size * 0.55}px`,
            height: `${p.size}px`,
            background: p.color,
            transform: `rotate(${p.rotate}deg) skewX(${p.skew}deg)`,
            '--spin': `${p.spin}deg`,
          }}
        />
      ))}
    </div>
  );
}

export default PetalCurtain;
