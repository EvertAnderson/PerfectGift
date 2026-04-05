import React, { useState, useEffect } from 'react';
import PetalCurtain from './components/PetalCurtain';
import KingProteaFlower from './components/KingProteaFlower';
import KingProteaFlower3D from './components/KingProteaFlower3D';
import ViewDropdown from './components/ViewDropdown';
import DecorativeBorder from './components/DecorativeBorder';
import './App.css';

// Phases: 'curtain' → 'fade' → 'drawing' → 'complete'
function App() {
  const [phase, setPhase] = useState('curtain');
  const [viewMode, setViewMode] = useState('2d');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('fade'),     3200);
    const t2 = setTimeout(() => setPhase('drawing'),  4000);
    const t3 = setTimeout(() => setPhase('complete'), 12500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const stageVisible  = phase === 'drawing'  || phase === 'complete';
  const msgVisible    = phase === 'complete';
  const dropdownReady = phase === 'drawing'  || phase === 'complete';

  return (
    <div className="app-root">
      <div className="bg-glow" />

      {/* Decorative botanical border — fades in with the flower */}
      <DecorativeBorder visible={stageVisible} />

      {/* Petal curtain */}
      <PetalCurtain
        visible={phase === 'curtain' || phase === 'fade'}
        fading={phase === 'fade'}
      />

      {/* View switcher — fades in once drawing starts */}
      <div className={`dropdown-wrap ${dropdownReady ? 'dropdown-wrap--visible' : ''}`}>
        <ViewDropdown value={viewMode} onChange={setViewMode} />
      </div>

      {/* Stage */}
      <div className={`stage ${stageVisible ? 'stage--visible' : ''}`}>

        {/* Panel container — fixed size, panels overlap inside */}
        <div className="view-container">
          <div className={`view-panel ${viewMode === '2d' ? 'view-panel--active' : ''}`}>
            <KingProteaFlower
              active={stageVisible}
              showSparkles={msgVisible}
            />
          </div>
          {/* 3D view — always mounted to avoid Three.js reinit lag */}
          <div className={`view-panel ${viewMode === '3d' ? 'view-panel--active' : ''}`}>
            <KingProteaFlower3D active={stageVisible} />
          </div>
        </div>

        {/* Birthday message */}
        <div className={`birthday-msg ${msgVisible ? 'birthday-msg--visible' : ''}`}>
          <p className="birthday-line1">Feliz Cumpleaños Madeleine una hermosa King Protea</p>
          <p className="birthday-line2">✦ con todo mi amor para una flor que no es frágil al viento y se doblega, eres un belleza que nacio en el fuego del sol y la arena. ✦</p>
        </div>
      </div>
    </div>
  );
}

export default App;
