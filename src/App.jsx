import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react'; // 1. Importación añadida
import PetalCurtain from './components/PetalCurtain';
import KingProteaFlower from './components/KingProteaFlower';
import KingProteaFlower3D from './components/KingProteaFlower3D';
import ViewDropdown from './components/ViewDropdown';
import DecorativeBorder from './components/DecorativeBorder';
import './App.css';

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
            <Analytics /> {/* 2. Componente de rastreo añadido aquí */}

            <div className="bg-glow" />

            <DecorativeBorder visible={stageVisible} />

            <PetalCurtain
                visible={phase === 'curtain' || phase === 'fade'}
                fading={phase === 'fade'}
            />

            <div className={`dropdown-wrap ${dropdownReady ? 'dropdown-wrap--visible' : ''}`}>
                <ViewDropdown value={viewMode} onChange={setViewMode} />
            </div>

            <div className={`stage ${stageVisible ? 'stage--visible' : ''}`}>
                <div className="view-container">
                    <div className={`view-panel ${viewMode === '2d' ? 'view-panel--active' : ''}`}>
                        <KingProteaFlower
                            active={stageVisible}
                            showSparkles={msgVisible}
                        />
                    </div>
                    <div className={`view-panel ${viewMode === '3d' ? 'view-panel--active' : ''}`}>
                        <KingProteaFlower3D active={stageVisible} />
                    </div>
                </div>

                <div className={`birthday-msg ${msgVisible ? 'birthday-msg--visible' : ''}`}>
                    <p className="birthday-line1">Feliz Cumpleaños Madeleine una hermosa Protea King</p>
                    <p className="birthday-line2">✦ Llevas una corona de valentía que el viento no doblega. Eres mi flor majestuosa, nacida del fuego, el sol y la arena. Mi amor por ti es como tu naturaleza: salvaje, resistente y eterno. Te amo. ✦</p>
                </div>
            </div>
        </div>
    );
}

export default App;