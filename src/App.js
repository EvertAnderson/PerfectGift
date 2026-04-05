import React, { useState, useEffect } from 'react';
import PetalCurtain from './components/PetalCurtain';
import KingProteaFlower from './components/KingProteaFlower';
import './App.css';

// Phases: 'curtain' → 'fade' → 'drawing' → 'complete'
function App() {
  const [phase, setPhase] = useState('curtain');

  useEffect(() => {
    // After 3.2s petals have fallen — fade them out
    const t1 = setTimeout(() => setPhase('fade'), 3200);
    // After fade (0.8s) → start drawing the flower
    const t2 = setTimeout(() => setPhase('drawing'), 4000);
    // After full draw (~7s) → show message
    const t3 = setTimeout(() => setPhase('complete'), 11000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="app-root">
      {/* Background ambient particles */}
      <div className="bg-glow" />

      {/* Petal curtain */}
      <PetalCurtain visible={phase === 'curtain' || phase === 'fade'} fading={phase === 'fade'} />

      {/* Flower + message — hidden until petals fade */}
      <div className={`stage ${phase === 'drawing' || phase === 'complete' ? 'stage--visible' : ''}`}>
        <KingProteaFlower active={phase === 'drawing' || phase === 'complete'} />

        <div className={`birthday-msg ${phase === 'complete' ? 'birthday-msg--visible' : ''}`}>
          <p className="birthday-line1">Feliz Cumpleaños</p>
          <p className="birthday-line2">✦ con todo mi cariño ✦</p>
        </div>
      </div>
    </div>
  );
}

export default App;
