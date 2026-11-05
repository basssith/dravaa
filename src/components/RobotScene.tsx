'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, Lightformer, useTexture } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

const LIME = '#b6ff66';
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Scroll + pointer state shared with the render loop without re-rendering React. */
type Track = { heroP: number; ap: number; px: number; py: number };

function radialTexture(inner: string, outer: string) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0, inner);
  grd.addColorStop(1, outer);
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Drava smile mark in 3D: two square eyes + a quarter-ring mouth. */
function useSmileGeometry() {
  return useMemo(() => {
    const cx = -0.4889, cy = 0.4889, rIn = 0.9778, rOut = 1.5889;
    const shape = new THREE.Shape();
    shape.moveTo(cx + rIn, cy);
    shape.lineTo(cx + rOut, cy);
    shape.absarc(cx, cy, rOut, 0, -Math.PI / 2, true);
    shape.lineTo(cx, cy - rIn);
    shape.absarc(cx, cy, rIn, -Math.PI / 2, 0, false);
    return {
      eye: new THREE.BoxGeometry(0.61, 0.61, 0.28),
      mouth: new THREE.ExtrudeGeometry(shape, { depth: 0.28, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.03, bevelSegments: 4 })
    };
  }, []);
}

// Positions relative to the robot. +x = the robot's outer side (away from the text); mirrored per section.
const SMILES: [x: number, y: number, z: number, scale: number][] = [
  [0.8, 1.8, -0.4, 0.26],
  [1.1, -0.95, 0.3, 0.22],
  [-0.95, -1.35, -1.0, 0.16]
];

function Rig({ track, reduced }: { track: React.RefObject<Track>; reduced: boolean }) {
  const robotTex = useTexture('/assets/robot.png');
  const gl = useThree((s) => s.gl);
  const geo = useSmileGeometry();
  const glowTex = useMemo(() => radialTexture('rgba(182,255,102,0.6)', 'rgba(182,255,102,0)'), []);
  const shadowTex = useMemo(() => radialTexture('rgba(13,13,13,0.32)', 'rgba(13,13,13,0)'), []);
  const smileMat = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: LIME, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 1.4, transparent: true }),
    []
  );

  useEffect(() => {
    robotTex.colorSpace = THREE.SRGBColorSpace;
    robotTex.anisotropy = gl.capabilities.getMaxAnisotropy();
    robotTex.needsUpdate = true;
  }, [robotTex, gl]);

  const rig = useRef<THREE.Group>(null);
  const robot = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);
  const shadow = useRef<THREE.Mesh>(null);
  const smiles = useRef<(THREE.Group | null)[]>([]);
  const state = useRef({ opacity: 0, tiltX: 0, tiltY: 0 });

  useFrame(({ camera, size, clock }) => {
    const r = rig.current, rb = robot.current;
    if (!r || !rb || !glow.current || !shadow.current) return;
    const s = state.current;
    const { heroP, ap, px, py } = track.current;
    const t = clock.elapsedTime;
    const m = reduced ? 0 : 1;

    // Layout anchors from the visible frustum at z = 0.
    const cam = camera as THREE.PerspectiveCamera;
    const halfH = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * cam.position.z;
    const halfW = halfH * (size.width / size.height);
    const wide = size.width >= 900;
    // Hero: pinned right (clear of the headline) on desktop; in the gap above the headline on mobile.
    const hero = wide ? { x: halfW - 1.35, y: -0.05, s: 0.9 } : { x: 0, y: halfH * 0.36, s: 0.5 };
    // Approach: left column on desktop, top spacer on mobile.
    const approach = wide ? { x: -halfW * 0.5, y: 0, s: 1 } : { x: 0, y: halfH * 0.2, s: 0.8 };

    const heroVis = 1 - smooth(0.25, 0.8, heroP);
    const [r0, r1, f0, f1] = wide ? [0.1, 0.3, 0.7, 0.9] : [0.05, 0.2, 0.45, 0.6];
    const apVis = ap < 0 ? 0 : smooth(r0, r1, ap) * (1 - smooth(f0, f1, ap));
    const inApproach = apVis > heroVis;
    s.opacity += (Math.max(heroVis, apVis) - s.opacity) * 0.1;

    const a = inApproach ? approach : hero;
    const ty = a.y + (inApproach ? (0.5 - ap) * 1.4 : heroP * 1.6);
    const k = s.opacity < 0.05 ? 1 : 0.08; // snap while invisible so it never visibly slides across
    r.position.x += (a.x - r.position.x) * k;
    r.position.y += (ty - r.position.y) * k;
    r.scale.setScalar(r.scale.x + (a.s - r.scale.x) * k);

    s.tiltX += (py * 0.18 - s.tiltX) * 0.06;
    s.tiltY += (px * 0.35 - s.tiltY) * 0.06;
    rb.rotation.y = s.tiltY + Math.sin(t * 0.6) * 0.08 * m + (inApproach ? (ap - 0.5) * 0.6 : heroP * 0.8);
    rb.rotation.x = -s.tiltX;
    rb.position.y = Math.sin(t * 1.1) * 0.08 * m;
    shadow.current.scale.x = 1 - rb.position.y * 0.8;
    glow.current.position.set(px * 0.3, py * 0.2, -0.8);

    const side = inApproach ? -1 : 1;
    smiles.current.forEach((g, i) => {
      if (!g) return;
      const [x, y, z] = SMILES[i];
      const depth = z + 1.5;
      g.position.set(x * side + px * 0.25 * depth, y + py * 0.15 * depth, z);
    });

    (rb.material as THREE.MeshBasicMaterial).opacity = s.opacity;
    (glow.current.material as THREE.MeshBasicMaterial).opacity = s.opacity * 0.9;
    (shadow.current.material as THREE.MeshBasicMaterial).opacity = s.opacity;
    smileMat.opacity = s.opacity;
    r.visible = s.opacity > 0.01;
  });

  return (
    <group ref={rig}>
      <mesh ref={glow}>
        <planeGeometry args={[5.6, 5.6]} />
        <meshBasicMaterial map={glowTex} transparent depthWrite={false} />
      </mesh>
      <mesh ref={shadow} position={[0, -1.85, -0.2]} scale={[1, 0.2, 1]}>
        <planeGeometry args={[2.6, 2.6]} />
        <meshBasicMaterial map={shadowTex} transparent depthWrite={false} />
      </mesh>
      {/* robot.png is 796 x 1024 */}
      <mesh ref={robot}>
        <planeGeometry args={[2.4, 3.088]} />
        <meshBasicMaterial map={robotTex} transparent alphaTest={0.02} side={THREE.DoubleSide} />
      </mesh>

      {SMILES.map(([, , , scale], i) => (
        <group key={i} ref={(g) => { smiles.current[i] = g; }}>
          <Float speed={reduced ? 0 : 1.6} rotationIntensity={reduced ? 0 : 0.8} floatIntensity={reduced ? 0 : 0.6}>
            <group scale={scale}>
              <group position={[0.1, -0.25, 0]}>
                <mesh geometry={geo.eye} material={smileMat} position={[-0.7944, 0.7944, 0]} />
                <mesh geometry={geo.eye} material={smileMat} position={[0.1681, 0.7944, 0]} />
                <mesh geometry={geo.mouth} material={smileMat} position={[0, 0, -0.14]} />
              </group>
            </group>
          </Float>
        </group>
      ))}
    </group>
  );
}

export default function RobotScene() {
  const track = useRef<Track>({ heroP: 0, ap: -1, px: 0, py: 0 });
  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById('hero');
      const approach = document.getElementById('approach');
      if (hero) {
        const h = hero.getBoundingClientRect();
        track.current.heroP = Math.min(1, Math.max(0, -h.top / h.height));
      }
      if (approach) {
        const r = approach.getBoundingClientRect();
        track.current.ap = (window.innerHeight - r.top) / (window.innerHeight + r.height);
      }
    };
    const onPointer = (e: PointerEvent) => {
      track.current.px = (e.clientX / window.innerWidth) * 2 - 1;
      track.current.py = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
    };
  }, []);

  return (
    <Canvas
      flat
      dpr={[1, 2]}
      camera={{ fov: 35, position: [0, 0, 8], near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <ambientLight intensity={1.3} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} />
      <directionalLight position={[-4, 1, -2]} intensity={2.5} color={LIME} />
      {/* Studio reflections generated locally — no HDR download */}
      <Environment resolution={256}>
        <Lightformer intensity={3} position={[0, 4, 2]} scale={[8, 2, 1]} />
        <Lightformer intensity={2} position={[-5, 0, 3]} scale={[2, 6, 1]} />
        <Lightformer intensity={1.5} color={LIME} position={[5, -1, 2]} scale={[2, 4, 1]} />
      </Environment>
      <Suspense fallback={null}>
        <Rig track={track} reduced={reduced} />
      </Suspense>
    </Canvas>
  );
}
