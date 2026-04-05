import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import './KingProteaFlower3D.css';

// ── Constants ────────────────────────────────────────────────────────────────
const DOME_RADIUS = 0.88;

// Each layer: polar tilt from Y-up (0=pointing up, 90=horizontal)
const BRACT_LAYERS = [
  { count: 16, thetaDeg: 78, len: 2.30, w: 0.72, color: '#3b0020', emissive: '#1a0010', offset:  0 },
  { count: 14, thetaDeg: 64, len: 2.00, w: 0.62, color: '#5c0032', emissive: '#1f000f', offset: 12 },
  { count: 12, thetaDeg: 50, len: 1.72, w: 0.52, color: '#8b0042', emissive: '#280015', offset:  8 },
  { count: 11, thetaDeg: 36, len: 1.46, w: 0.44, color: '#b8175a', emissive: '#35001a', offset:  5 },
  { count: 10, thetaDeg: 22, len: 1.20, w: 0.36, color: '#e01e88', emissive: '#400020', offset:  3 },
  { count:  9, thetaDeg: 10, len: 0.94, w: 0.28, color: '#f06292', emissive: '#500028', offset:  0 },
  // Innermost pale (nearly vertical, slightly creamy)
  { count:  8, thetaDeg:  3, len: 0.68, w: 0.20, color: '#f8bbd0', emissive: '#500030', offset:  0 },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function createBractShape(length, width) {
  const hw = width / 2;
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  // left edge
  shape.bezierCurveTo(-hw, length * 0.18, -hw * 0.78, length * 0.62, 0, length);
  // right edge
  shape.bezierCurveTo( hw * 0.78, length * 0.62,  hw, length * 0.18, 0, 0);
  return shape;
}

// ── Single bract mesh ────────────────────────────────────────────────────────
function ProteaBract({ phi, theta, len, w, color, emissive }) {
  const geometry = useMemo(() => {
    const shape = createBractShape(len, w);
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.055,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.012,
      bevelSegments: 3,
      curveSegments: 14,
    });
  }, [len, w]);

  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color:     new THREE.Color(color),
    emissive:  new THREE.Color(emissive),
    emissiveIntensity: 0.35,
    roughness: 0.68,
    metalness: 0.04,
    side: THREE.DoubleSide,
  }), [color, emissive]);

  // Compute position + quaternion from polar coords
  const [position, quaternion] = useMemo(() => {
    const dir = new THREE.Vector3(
      Math.sin(theta) * Math.cos(phi),
      Math.cos(theta),
      Math.sin(theta) * Math.sin(phi)
    );
    const pos = dir.clone().multiplyScalar(DOME_RADIUS * 0.86);
    const up  = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);
    return [pos, quat];
  }, [phi, theta]);

  return (
    <mesh
      position={position}
      quaternion={quaternion}
      geometry={geometry}
      material={material}
      castShadow
    />
  );
}

// ── All bract rings ──────────────────────────────────────────────────────────
function BractRings() {
  const allBracts = useMemo(() => {
    const items = [];
    BRACT_LAYERS.forEach((layer, li) => {
      const theta = (layer.thetaDeg * Math.PI) / 180;
      for (let i = 0; i < layer.count; i++) {
        const phi = ((2 * Math.PI) / layer.count) * i + (layer.offset * Math.PI) / 180;
        items.push({ key: `${li}-${i}`, phi, theta, ...layer });
      }
    });
    return items;
  }, []);

  return (
    <group>
      {allBracts.map(b => (
        <ProteaBract key={b.key} phi={b.phi} theta={b.theta}
          len={b.len} w={b.w} color={b.color} emissive={b.emissive} />
      ))}
    </group>
  );
}

// ── Dome with instanced florets ──────────────────────────────────────────────
function Dome() {
  const stemRef = useRef();
  const tipRef  = useRef();

  const floretPositions = useMemo(() => {
    const pts = [];
    const rows = 9;
    for (let r = 0; r <= rows; r++) {
      const theta = (r / rows) * (Math.PI / 2);
      const y     = Math.cos(theta) * DOME_RADIUS * 0.97;
      const ring  = Math.sin(theta) * DOME_RADIUS * 0.97;
      const countInRing = r === 0 ? 1 : Math.round(r * 5.8);
      for (let i = 0; i < countInRing; i++) {
        const phi = (2 * Math.PI * i) / countInRing;
        pts.push({
          x: ring * Math.cos(phi),
          y,
          z: ring * Math.sin(phi),
        });
      }
    }
    return pts;
  }, []);

  const stemGeo = useMemo(() => new THREE.CylinderGeometry(0.016, 0.022, 0.20, 5), []);
  const tipGeo  = useMemo(() => new THREE.SphereGeometry(0.034, 7, 7), []);

  const stemMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#f5e6d0', roughness: 0.85,
  }), []);
  const tipMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#fff8e1',
    emissive: '#fff0c0',
    emissiveIntensity: 0.55,
    roughness: 0.45,
  }), []);

  useEffect(() => {
    if (!stemRef.current || !tipRef.current) return;
    const dummy = new THREE.Object3D();
    const up    = new THREE.Vector3(0, 1, 0);

    floretPositions.forEach((pt, i) => {
      const dir = new THREE.Vector3(pt.x, pt.y, pt.z).normalize();
      const q   = new THREE.Quaternion().setFromUnitVectors(up, dir);

      // Stem base at dome surface
      dummy.position.set(pt.x, pt.y, pt.z);
      dummy.quaternion.copy(q);
      dummy.updateMatrix();
      stemRef.current.setMatrixAt(i, dummy.matrix);

      // Tip offset outward along direction
      const tip = new THREE.Vector3(pt.x, pt.y, pt.z).add(dir.multiplyScalar(0.14));
      dummy.position.copy(tip);
      dummy.updateMatrix();
      tipRef.current.setMatrixAt(i, dummy.matrix);
    });
    stemRef.current.instanceMatrix.needsUpdate = true;
    tipRef.current.instanceMatrix.needsUpdate  = true;
  }, [floretPositions]);

  return (
    <group>
      {/* Base dome hemisphere */}
      <mesh receiveShadow>
        <sphereGeometry args={[DOME_RADIUS, 48, 48, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#200012" roughness={0.92} side={THREE.DoubleSide} />
      </mesh>
      {/* Mid-tone layer */}
      <mesh>
        <sphereGeometry args={[DOME_RADIUS * 0.96, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#380020" roughness={0.88} />
      </mesh>

      {/* Floret stems */}
      <instancedMesh ref={stemRef} args={[stemGeo, stemMat, floretPositions.length]}
        castShadow />
      {/* Floret tips */}
      <instancedMesh ref={tipRef}  args={[tipGeo,  tipMat,  floretPositions.length]}
        castShadow />

      {/* Halo glow ring around dome */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[DOME_RADIUS * 1.05, 0.04, 8, 64]} />
        <meshStandardMaterial color="#e91e8c" emissive="#e91e8c"
          emissiveIntensity={1.2} roughness={0.3} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

// ── Stem + 3D leaves ─────────────────────────────────────────────────────────
function Stem() {
  const stemCurve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3( 0.00, -DOME_RADIUS,       0),
    new THREE.Vector3( 0.08, -1.45,              0),
    new THREE.Vector3(-0.05, -2.30,              0),
    new THREE.Vector3( 0.00, -3.20,              0),
  ]), []);

  const leafLeft = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.bezierCurveTo(-0.6, 0.2, -0.9, 0.85, -0.5, 1.0);
    s.bezierCurveTo(-0.2, 1.1,  0.0, 0.6,   0,   0);
    return s;
  }, []);

  const leafRight = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.bezierCurveTo(0.6, 0.2, 0.85, 0.85, 0.45, 1.0);
    s.bezierCurveTo(0.2, 1.1, 0.0,  0.6,  0,    0);
    return s;
  }, []);

  const leafGeo1 = useMemo(() => new THREE.ShapeGeometry(leafLeft,  24), [leafLeft]);
  const leafGeo2 = useMemo(() => new THREE.ShapeGeometry(leafRight, 24), [leafRight]);
  const leafMat  = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#2e7d32', roughness: 0.75, metalness: 0.0, side: THREE.DoubleSide,
  }), []);

  return (
    <group>
      <mesh castShadow>
        <tubeGeometry args={[stemCurve, 24, 0.065, 8, false]} />
        <meshStandardMaterial color="#2e7d32" roughness={0.78} />
      </mesh>

      {/* Left leaf */}
      <mesh geometry={leafGeo1} material={leafMat}
        position={[-0.06, -1.7, 0]}
        rotation={[0, 0, Math.PI * 0.12]}
        castShadow />
      {/* Right leaf */}
      <mesh geometry={leafGeo2} material={leafMat}
        position={[0.06, -2.2, 0]}
        rotation={[0, 0, -Math.PI * 0.1]}
        castShadow />
    </group>
  );
}

// ── Animated flower group ────────────────────────────────────────────────────
function FlowerGroup({ active }) {
  const groupRef = useRef();
  const progress = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    // Auto-rotate
    groupRef.current.rotation.y += delta * 0.28;
    // Scale-in entrance
    if (active && progress.current < 1) {
      progress.current = Math.min(1, progress.current + delta * 0.9);
      const s = THREE.MathUtils.smoothstep(progress.current, 0, 1);
      groupRef.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={groupRef} scale={0} position={[0, 0.5, 0]}>
      <BractRings />
      <Dome />
      <Stem />
    </group>
  );
}

// ── Lighting ─────────────────────────────────────────────────────────────────
function SceneLights() {
  return (
    <>
      <ambientLight color="#1c0012" intensity={2.5} />
      {/* Main pink key light — above-front */}
      <pointLight color="#ff4499" intensity={18} position={[0, 5, 4]} distance={18} decay={2} />
      {/* Warm amber fill — right side */}
      <pointLight color="#ffaa44" intensity={8}  position={[5, 2, 0]} distance={14} decay={2} />
      {/* Purple rim light — behind */}
      <pointLight color="#9933ee" intensity={5}  position={[-4, 1, -5]} distance={14} decay={2} />
      {/* Magenta under-fill — below */}
      <pointLight color="#ff66aa" intensity={6}  position={[0, -4, 2]} distance={12} decay={2} />
      {/* Bright top accent */}
      <spotLight
        color="#ffccee"
        intensity={25}
        position={[0, 9, 2]}
        angle={0.35}
        penumbra={0.7}
        distance={20}
        castShadow
        shadow-mapSize={[512, 512]}
      />
    </>
  );
}

// ── Canvas wrapper ────────────────────────────────────────────────────────────
function KingProteaFlower3D({ active }) {
  return (
    <div className="flower-3d-wrap">
      <Canvas
        camera={{ position: [0, 1.8, 7], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        shadows
        style={{ background: 'transparent' }}
        dpr={Math.min(window.devicePixelRatio, 2)}
      >
        <SceneLights />
        <FlowerGroup active={active} />
        <OrbitControls
          enableZoom
          minDistance={3.5}
          maxDistance={14}
          enablePan={false}
          target={[0, 0.4, 0]}
        />
        <Stars
          radius={80} depth={40} count={900}
          factor={2.2} saturation={0.25} fade speed={0.4}
        />
      </Canvas>
    </div>
  );
}

export default KingProteaFlower3D;
