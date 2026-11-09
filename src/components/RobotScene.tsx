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

/** Scroll + pointer + drag state shared with the render loop without re-rendering React. */
type Track = {
  heroP: number;
  ap: number;
  px: number;
  py: number;
  dragRotX: number;
  dragRotY: number;
  targetDragRotX: number;
  targetDragRotY: number;
  isDragging: boolean;
};

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

  // Create high-detail volumetric 3D rounded extrusion geometry for the robot slab
  const robot3DGeom = useMemo(() => {
    const width = 2.4;
    const height = 3.088;
    const radius = 0.28;
    const shape = new THREE.Shape();
    const x = -width / 2;
    const y = -height / 2;
    const w = width;
    const h = height;
    const r = radius;

    shape.moveTo(x + r, y);
    shape.lineTo(x + w - r, y);
    shape.quadraticCurveTo(x + w, y, x + w, y + r);
    shape.lineTo(x + w, y + h - r);
    shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    shape.lineTo(x + r, y + h);
    shape.quadraticCurveTo(x, y + h, x, y + h - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);

    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: 0.18,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05
    });

    // Remap front cap UVs so robot.png wraps correctly
    const pos = geom.attributes.position;
    const uvs = geom.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const px = pos.getX(i);
      const py = pos.getY(i);
      const pz = pos.getZ(i);
      if (pz > 0.08) {
        uvs.setXY(i, (px - x) / w, (py - y) / h);
      }
    }
    uvs.needsUpdate = true;
    return geom;
  }, []);

  const robotMaterials = useMemo(() => {
    const frontMat = new THREE.MeshStandardMaterial({
      map: robotTex,
      transparent: true,
      alphaTest: 0.02,
      roughness: 0.25,
      metalness: 0.15
    });
    const edgeMat = new THREE.MeshPhysicalMaterial({
      color: 0x141820,
      metalness: 0.85,
      roughness: 0.2,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1
    });
    const backMat = new THREE.MeshStandardMaterial({
      color: 0x141820,
      metalness: 0.6,
      roughness: 0.3
    });
    return [frontMat, edgeMat, backMat];
  }, [robotTex]);

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
    const tr = track.current;
    const { heroP, ap, px, py } = tr;
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

    // Robot only appears in Approach section (#approach / Companion), never in Landing/Hero page
    const heroVis = 0;
    const [r0, r1, f0, f1] = wide ? [0.1, 0.3, 0.7, 0.9] : [0.05, 0.2, 0.45, 0.6];
    const apVis = ap < 0 ? 0 : smooth(r0, r1, ap) * (1 - smooth(f0, f1, ap));
    const inApproach = true;
    s.opacity += (apVis - s.opacity) * 0.1;

    const a = inApproach ? approach : hero;
    const ty = a.y + (inApproach ? (0.5 - ap) * 1.4 : heroP * 1.6);
    const k = s.opacity < 0.05 ? 1 : 0.08; // snap while invisible so it never visibly slides across
    r.position.x += (a.x - r.position.x) * k;
    r.position.y += (ty - r.position.y) * k;
    r.scale.setScalar(r.scale.x + (a.s - r.scale.x) * k);

    // Inertial drag decay
    if (!tr.isDragging) {
      tr.targetDragRotX *= 0.94;
      tr.targetDragRotY *= 0.94;
    }
    tr.dragRotX += (tr.targetDragRotX - tr.dragRotX) * 0.12;
    tr.dragRotY += (tr.targetDragRotY - tr.dragRotY) * 0.12;

    s.tiltX += (py * 0.18 - s.tiltX) * 0.06;
    s.tiltY += (px * 0.35 - s.tiltY) * 0.06;

    // Full 3D rotation combining drag interaction, mouse tracking, and subtle idle drift
    rb.rotation.y = tr.dragRotY + s.tiltY + Math.sin(t * 0.6) * 0.08 * m + (inApproach ? (ap - 0.5) * 0.6 : heroP * 0.8);
    rb.rotation.x = tr.dragRotX - s.tiltX;
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

    robotMaterials.forEach((mat) => {
      mat.opacity = s.opacity;
    });
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

      {/* 3D Extruded Beveled Character Slab with Drag Rotation */}
      <mesh ref={robot} geometry={robot3DGeom} material={robotMaterials} castShadow receiveShadow />

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
  const track = useRef<Track>({
    heroP: 0,
    ap: -1,
    px: 0,
    py: 0,
    dragRotX: 0,
    dragRotY: 0,
    targetDragRotX: 0,
    targetDragRotY: 0,
    isDragging: false
  });
  const reduced = useMemo(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const dragStart = useRef({ x: 0, y: 0 });

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

    const onPointerMove = (e: PointerEvent) => {
      track.current.px = (e.clientX / window.innerWidth) * 2 - 1;
      track.current.py = -((e.clientY / window.innerHeight) * 2 - 1);

      if (track.current.isDragging) {
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        dragStart.current = { x: e.clientX, y: e.clientY };

        track.current.targetDragRotY += dx * 0.008;
        track.current.targetDragRotX += dy * 0.008;
        // Limit pitch tilt
        track.current.targetDragRotX = Math.max(-0.6, Math.min(0.6, track.current.targetDragRotX));
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      // Don't capture on links or buttons
      if ((e.target as HTMLElement).closest('a, button, input')) return;
      track.current.isDragging = true;
      dragStart.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      track.current.isDragging = false;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 35, position: [0, 0, 8], near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <ambientLight intensity={1.4} />
      <directionalLight position={[3, 4, 5]} intensity={2.4} />
      <directionalLight position={[-4, 1, -2]} intensity={2.6} color={LIME} />
      {/* Studio reflections for realistic bevel highlights */}
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
