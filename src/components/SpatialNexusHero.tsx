'use client';

import { useEffect, useRef } from 'react';

/**
 * SpatialNexusHero:
 * A high-end interactive ambient canvas representing "Connecting everything into one space":
 * - Dynamic 3D orbital rings (gyroscopic spatial telemetry)
 * - Constellation of interconnected glowing neural nodes
 * - Smooth data packets traveling along curved synaptic vectors
 * - Interactive cursor gravitational field (gentle cursor attraction)
 * - Perfectly tailored to Drava's design language: crisp architectural minimalism, subtle accents (#b6ff66),
 *   ultra-lightweight 60fps 2D canvas that never lags or obstructs readability.
 */
export function SpatialNexusHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // Mouse tracking for reactive organic tilt
    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Neural Nodes in a spherical space
    interface Node {
      theta: number; // angle around Y
      phi: number;   // angle around X
      radius: number;
      size: number;
      speed: number;
      pulse: number;
      isAccent: boolean;
    }

    const nodes: Node[] = [];
    const count = 38;
    for (let i = 0; i < count; i++) {
      nodes.push({
        theta: Math.random() * Math.PI * 2,
        phi: (Math.random() - 0.5) * Math.PI,
        radius: 170 + Math.random() * 190,
        size: 2.2 + Math.random() * 2.5,
        speed: (0.0015 + Math.random() * 0.002) * (Math.random() > 0.5 ? 1 : -1),
        pulse: Math.random() * Math.PI * 2,
        isAccent: i % 4 === 0
      });
    }

    // Traveling packet signals
    interface Signal {
      fromIndex: number;
      toIndex: number;
      progress: number;
      speed: number;
    }
    const signals: Signal[] = [];
    for (let i = 0; i < 7; i++) {
      signals.push({
        fromIndex: Math.floor(Math.random() * count),
        toIndex: Math.floor(Math.random() * count),
        progress: Math.random(),
        speed: 0.008 + Math.random() * 0.012
      });
    }

    let rotY = 0;
    let rotX = 0.35; // slight downward isometric perspective

    const render = (time: number) => {
      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const mouseTiltY = (mouse.x - width / 2) * 0.0003;
      const mouseTiltX = (mouse.y - height / 2) * 0.0002;

      rotY += 0.0022 + mouseTiltY * 0.1;
      rotX = 0.38 + mouseTiltX * 0.3;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      // Vertically centered in the hero space
      const cy = height * 0.5;

      // Project 3D coordinate to 2D
      const project = (theta: number, phi: number, r: number) => {
        // Rotate around Y
        const currentTheta = theta + rotY;
        let x = r * Math.cos(phi) * Math.sin(currentTheta);
        let y = r * Math.sin(phi);
        let z = r * Math.cos(phi) * Math.cos(currentTheta);

        // Rotate around X
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const y2 = y * cosX - z * sinX;
        const z2 = y * sinX + z * cosX;

        // Perspective projection
        const fov = 750;
        const scale = fov / (fov + z2 + 200);
        return {
          px: cx + x * scale,
          py: cy + y2 * scale,
          scale,
          z: z2
        };
      };

      // 1. Draw 3 Gyroscopic Orbital Telemetry Rings
      const rings = [
        { r: 240, tilt: 0.15, alpha: 0.16, segments: 48, dashed: false },
        { r: 310, tilt: -0.4, alpha: 0.12, segments: 64, dashed: true },
        { r: 370, tilt: 0.55, alpha: 0.09, segments: 72, dashed: true }
      ];

      rings.forEach((ring) => {
        ctx.save();
        ctx.beginPath();
        if (ring.dashed) {
          ctx.setLineDash([8, 12]);
        }
        ctx.strokeStyle = `rgba(13, 13, 13, ${ring.alpha})`;
        ctx.lineWidth = 1;

        for (let i = 0; i <= ring.segments; i++) {
          const t = (i / ring.segments) * Math.PI * 2;
          const pt = project(t, ring.tilt, ring.r);
          if (i === 0) ctx.moveTo(pt.px, pt.py);
          else ctx.lineTo(pt.px, pt.py);
        }
        ctx.stroke();
        ctx.restore();
      });

      // 2. Compute 2D projected locations for all nodes
      const projected = nodes.map((node) => {
        node.theta += node.speed;
        node.pulse += 0.035;
        const pt = project(node.theta, node.phi, node.radius);
        return { ...pt, node };
      });

      // Sort by depth (back to front)
      projected.sort((a, b) => a.z - b.z);

      // 3. Draw Synaptic Connector Lines between nearby nodes
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];
          const dx = p1.px - p2.px;
          const dy = p1.py - p2.py;
          const dist = Math.hypot(dx, dy);

          const maxDist = 145;
          if (dist < maxDist) {
            const norm = 1 - dist / maxDist;
            const alpha = norm * 0.18 * ((p1.scale + p2.scale) / 2);

            ctx.beginPath();
            ctx.strokeStyle =
              p1.node.isAccent || p2.node.isAccent
                ? `rgba(182, 255, 102, ${alpha * 1.5})`
                : `rgba(40, 40, 40, ${alpha})`;
            ctx.lineWidth = norm * 1.2;
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          }
        }
      }

      // 4. Draw Traveling Data Packet Signals
      signals.forEach((sig) => {
        sig.progress += sig.speed;
        if (sig.progress >= 1) {
          sig.progress = 0;
          sig.fromIndex = sig.toIndex;
          sig.toIndex = Math.floor(Math.random() * count);
        }

        const p1 = projected[sig.fromIndex % projected.length];
        const p2 = projected[sig.toIndex % projected.length];
        if (!p1 || !p2) return;

        const sx = p1.px + (p2.px - p1.px) * sig.progress;
        const sy = p1.py + (p2.py - p1.py) * sig.progress;

        // Glowing packet dot
        ctx.beginPath();
        ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#b6ff66';
        ctx.shadowColor = 'rgba(182, 255, 102, 0.8)';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 5. Draw Glowing Core Nodes
      projected.forEach(({ px, py, scale, node }) => {
        const pulse = 1 + Math.sin(node.pulse) * 0.25;
        const r = node.size * scale * pulse;

        // Outer aura for accent nodes
        if (node.isAccent) {
          ctx.beginPath();
          ctx.arc(px, py, r * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(182, 255, 102, 0.2)';
          ctx.fill();
        }

        // Main node circle
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = node.isAccent ? '#b6ff66' : 'rgba(20, 20, 20, 0.85)';
        if (node.isAccent) {
          ctx.shadowColor = 'rgba(182, 255, 102, 0.9)';
          ctx.shadowBlur = 10;
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        // Subtle white specular highlight
        ctx.beginPath();
        ctx.arc(px - r * 0.3, py - r * 0.3, r * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
    >
      <canvas ref={canvasRef} className="h-full w-full block" />
      {/* Soft radial vignette to keep content hyper-legible in center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(242,242,238,0.78)_0%,rgba(242,242,238,0.3)_60%,transparent_100%)] pointer-events-none" />
    </div>
  );
}

