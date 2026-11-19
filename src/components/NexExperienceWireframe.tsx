'use client';

import { useEffect, useRef } from 'react';
import { TransitionLink } from './TransitionLink';

interface Line3D {
  p1: [number, number, number];
  p2: [number, number, number];
  color?: string;
  isPopUp?: boolean;
}

interface WireframeScene {
  backgroundLines: Line3D[];
  totemLines: Line3D[];
  monitorStandLines: Line3D[];
  monitorLines: Line3D[];
  monitorFaceCorners: [number, number, number][];
  wallScreenFaces: [number, number, number][][];
  totemScreenFace: [number, number, number][];
}

function buildNexExperienceWireframe(): WireframeScene {
  const backgroundLines: Line3D[] = [];
  const totemLines: Line3D[] = [];
  const monitorStandLines: Line3D[] = [];
  const monitorLines: Line3D[] = [];

  // ==========================================
  // 1. ARCHITECTURAL ROOM WIREFRAME
  // Perfectly aligned rectangular perspective room (orthogonally bounded)
  const roomW = 3.6;
  const roomH_top = -1.55; // Ceiling plane
  const roomH_bot = 1.15;  // Floor plane
  const roomZ_back = -0.2; // Back Wall
  const roomZ_front = 3.6; // Front plane

  // Back Wall rectangle (Outer Architectural Boundary)
  // Ceiling transverse line connecting top-left and top-right: accented in White Tusker red
  backgroundLines.push({ p1: [-roomW, roomH_top, roomZ_back], p2: [roomW, roomH_top, roomZ_back], color: 'rgba(235, 45, 55, 0.9)' });
  backgroundLines.push({ p1: [roomW, roomH_top, roomZ_back], p2: [roomW, roomH_bot, roomZ_back] });
  backgroundLines.push({ p1: [roomW, roomH_bot, roomZ_back], p2: [-roomW, roomH_bot, roomZ_back] });
  backgroundLines.push({ p1: [-roomW, roomH_bot, roomZ_back], p2: [-roomW, roomH_top, roomZ_back] });

  // 4 Clean Perspective Room Edges (Wall/Ceiling and Wall/Floor junctions)
  // Left and right side above: accented in White Tusker red
  backgroundLines.push({ p1: [-roomW, roomH_top, roomZ_back], p2: [-roomW, roomH_top, roomZ_front], color: 'rgba(235, 45, 55, 0.9)' });
  backgroundLines.push({ p1: [roomW, roomH_top, roomZ_back], p2: [roomW, roomH_top, roomZ_front], color: 'rgba(235, 45, 55, 0.9)' });
  backgroundLines.push({ p1: [-roomW, roomH_bot, roomZ_back], p2: [-roomW, roomH_bot, roomZ_front] });
  backgroundLines.push({ p1: [roomW, roomH_bot, roomZ_back], p2: [roomW, roomH_bot, roomZ_front] });

  // Front Aperture Frame
  // Front ceiling transverse line connecting top-left and top-right: accented in White Tusker red
  backgroundLines.push({ p1: [-roomW, roomH_top, roomZ_front], p2: [roomW, roomH_top, roomZ_front], color: 'rgba(235, 45, 55, 0.9)' });
  backgroundLines.push({ p1: [roomW, roomH_top, roomZ_front], p2: [roomW, roomH_bot, roomZ_front] });
  backgroundLines.push({ p1: [roomW, roomH_bot, roomZ_front], p2: [-roomW, roomH_bot, roomZ_front] });
  backgroundLines.push({ p1: [-roomW, roomH_bot, roomZ_front], p2: [-roomW, roomH_top, roomZ_front] });

  // Clean Side Columns (1 structural portal per side)
  backgroundLines.push({ p1: [-roomW, roomH_top, 1.6], p2: [-roomW, roomH_bot, 1.6] });
  backgroundLines.push({ p1: [roomW, roomH_top, 1.6], p2: [roomW, roomH_bot, 1.6] });

  // ==========================================
  // 2. CEILING DOME COVE (Sleek Minimal Architectural Ring)
  // ==========================================
  const domeCenterY = roomH_top - 0.05;
  const domeCenterZ = 1.6;
  const numRings = 3;
  const ringSegments = 36;

  for (let r = 1; r <= numRings; r++) {
    const radiusX = (r / numRings) * 2.2;
    const radiusZ = (r / numRings) * 1.3;
    for (let s = 0; s < ringSegments; s++) {
      const a1 = (s / ringSegments) * Math.PI * 2;
      const a2 = ((s + 1) / ringSegments) * Math.PI * 2;
      backgroundLines.push({
        p1: [Math.cos(a1) * radiusX, domeCenterY, domeCenterZ + Math.sin(a1) * radiusZ],
        p2: [Math.cos(a2) * radiusX, domeCenterY, domeCenterZ + Math.sin(a2) * radiusZ],
      });
    }
  }

  // 4 Elegant Axis Spokes for Dome (Horizontal and Vertical cross lines) accented in White Tusker red
  for (let s = 0; s < 4; s++) {
    const a = (s / 4) * Math.PI * 2;
    backgroundLines.push({
      p1: [0, domeCenterY, domeCenterZ],
      p2: [Math.cos(a) * 2.2, domeCenterY, domeCenterZ + Math.sin(a) * 1.3],
      color: 'rgba(235, 45, 55, 0.9)',
    });
  }

  // ==========================================
  // 3. LOWER WALL: THREE PRESENTATION SCREENS
  // ==========================================
  // 3. Three Presentation Screens: Balanced size attached flush into the back wall
  const screenW = 0.62;
  const screenH = 0.349; // Exact 16:9 ratio
  const lowerScreenCY = 0.07;
  const lowerScreenY1 = lowerScreenCY - screenH / 2;
  const lowerScreenY2 = lowerScreenCY + screenH / 2;
  const lowerScreens = [
    { cx: -0.92 }, // Left Screen
    { cx: 0.0 },   // Center Screen
    { cx: 0.92 },  // Right Screen
  ];

  const wallScreenFaces: [number, number, number][][] = [];

  lowerScreens.forEach(({ cx }) => {
    const x1 = cx - screenW / 2;
    const x2 = cx + screenW / 2;
    const wallZ = roomZ_back;

    wallScreenFaces.push([
      [x1, lowerScreenY1, wallZ],
      [x2, lowerScreenY1, wallZ],
      [x2, lowerScreenY2, wallZ],
      [x1, lowerScreenY2, wallZ],
    ]);
  });

  // ==========================================
  // 4. UPPER FLOOR MEZZANINE (ABOVE THE 3 SCREENS)
  const upperFloorY = -0.32; // Floor level right above lower screens
  const upperFloorZ_front = 1.35; // Walkway front edge

  // Mezzanine structural beam & border
  backgroundLines.push({ p1: [-roomW, upperFloorY, roomZ_back], p2: [roomW, upperFloorY, roomZ_back] });
  backgroundLines.push({ p1: [-roomW, upperFloorY, upperFloorZ_front], p2: [roomW, upperFloorY, upperFloorZ_front] });
  backgroundLines.push({ p1: [-roomW, upperFloorY, roomZ_back], p2: [-roomW, upperFloorY, upperFloorZ_front] });
  backgroundLines.push({ p1: [roomW, upperFloorY, roomZ_back], p2: [roomW, upperFloorY, upperFloorZ_front] });

  // Minimal Mezzanine Walkway Slats (clean spacing)
  for (let uz = 0.45; uz < upperFloorZ_front; uz += 0.45) {
    backgroundLines.push({ p1: [-roomW, upperFloorY, uz], p2: [roomW, upperFloorY, uz] });
  }

  // ==========================================
  // 5. UPPER LEVEL SCREENS:
  // LEFT SIDE: Digital Signage Totem (Portrait 9:16) with Red Logo & White Tusker
  // RIGHT SIDE: 1 Screen like the 3 screens (Landscape 16:9)
  // Attached directly into the back wall plane behind the upper mezzanine platform
  // ==========================================

  // A) LEFT SIDE DIGITAL SIGNAGE TOTEM (Sleek Modern Digital Kiosk Stand)
  // Flush mounted directly onto the back wall:
  const totemW = 0.36;
  const totemH = 0.64;
  const totemX = -1.60;
  const totemBaseY = upperFloorY;
  const totemTopY = totemBaseY - totemH;
  const totemZ = roomZ_back; // Attached to backside wall
  const hw_t = totemW / 2;

  // 1. Sleek Floor Base Plinth:
  const baseW = totemW + 0.08;
  const bH = 0.025;
  totemLines.push({ p1: [totemX - baseW / 2, totemBaseY, totemZ], p2: [totemX + baseW / 2, totemBaseY, totemZ] });
  totemLines.push({ p1: [totemX - baseW / 2, totemBaseY - bH, totemZ], p2: [totemX + baseW / 2, totemBaseY - bH, totemZ] });
  totemLines.push({ p1: [totemX - baseW / 2, totemBaseY, totemZ], p2: [totemX - baseW / 2, totemBaseY - bH, totemZ] });
  totemLines.push({ p1: [totemX + baseW / 2, totemBaseY, totemZ], p2: [totemX + baseW / 2, totemBaseY - bH, totemZ] });

  // 2. Clean Front Outer Chassis Frame:
  totemLines.push({ p1: [totemX - hw_t, totemBaseY - bH, totemZ], p2: [totemX + hw_t, totemBaseY - bH, totemZ] });
  totemLines.push({ p1: [totemX + hw_t, totemBaseY - bH, totemZ], p2: [totemX + hw_t, totemTopY, totemZ] });
  totemLines.push({ p1: [totemX + hw_t, totemTopY, totemZ], p2: [totemX - hw_t, totemTopY, totemZ] });
  totemLines.push({ p1: [totemX - hw_t, totemTopY, totemZ], p2: [totemX - hw_t, totemBaseY - bH, totemZ] });

  // 3. Screen Face (Inner display area):
  const bIn = 0.02;
  const totemScreenFace: [number, number, number][] = [
    [totemX - hw_t + bIn, totemTopY + bIn, totemZ],
    [totemX + hw_t - bIn, totemTopY + bIn, totemZ],
    [totemX + hw_t - bIn, totemBaseY - bH - bIn, totemZ],
    [totemX - hw_t + bIn, totemBaseY - bH - bIn, totemZ],
  ];

  // B) RIGHT SIDE: 1 Screen like the 3 screens (Landscape 16:9) on the Upper Wall
  // Attached directly onto the back wall:
  const upperRightScreenW = 0.68;
  const upperRightScreenH = 0.3825; // Exact 16:9 ratio
  const upperRightCX = 1.60; // Clean symmetric positioning on the upper back wall
  const upperRightCY = upperFloorY - upperRightScreenH / 2 - 0.08;
  const urY1 = upperRightCY - upperRightScreenH / 2;
  const urY2 = upperRightCY + upperRightScreenH / 2;

  wallScreenFaces.push([
    [upperRightCX - upperRightScreenW / 2, urY1, roomZ_back],
    [upperRightCX + upperRightScreenW / 2, urY1, roomZ_back],
    [upperRightCX + upperRightScreenW / 2, urY2, roomZ_back],
    [upperRightCX - upperRightScreenW / 2, urY2, roomZ_back],
  ]);

  // ==========================================
  // 6. MAIN GROUND FLOOR PERSPECTIVE GRID (Clean, minimal architectural lines)
  for (let z = 0.8; z <= roomZ_front; z += 0.9) {
    backgroundLines.push({ p1: [-roomW, roomH_bot, z], p2: [roomW, roomH_bot, z] });
  }

  // ==========================================
  // 7. THE MONITOR IN FRONT OF THE VIEWER
  // Grounded prominently at the first floor horizontal line right before me
  // ==========================================
  const tabW = 2.00;
  const tabH = 2.00 / (790 / 376); // Exact 790x376 ratio (2.10106) => 0.9519
  const tabCenterZ = 0.58; // Grounded right at the starting first floor horizontal line
  const tabCenterY = 0.64; // Comfortably grounded in the foreground
  const tiltAngle = 0.0;   // Upright monitor aligned with 3D camera and UI

  const getTabPoint = (localX: number, localY: number, localZ: number = 0): [number, number, number] => {
    const yRot = localY * Math.cos(tiltAngle) - localZ * Math.sin(tiltAngle);
    const zRot = localY * Math.sin(tiltAngle) + localZ * Math.cos(tiltAngle);
    return [localX, tabCenterY + yRot, tabCenterZ + zRot];
  };

  const hw = tabW / 2;
  const hh = tabH / 2;

  // Clean, Sleek Pedestal Stand (Clean single-column structural design)
  const hingeY = tabCenterY + hh * 0.45;
  const hingeZ = tabCenterZ + 0.04;
  const hingeW = 0.14;
  const hingeH = 0.08;

  monitorStandLines.push({ p1: [-hingeW, hingeY - hingeH / 2, hingeZ], p2: [hingeW, hingeY - hingeH / 2, hingeZ] });
  monitorStandLines.push({ p1: [hingeW, hingeY - hingeH / 2, hingeZ], p2: [hingeW, hingeY + hingeH / 2, hingeZ] });
  monitorStandLines.push({ p1: [hingeW, hingeY + hingeH / 2, hingeZ], p2: [-hingeW, hingeY + hingeH / 2, hingeZ] });
  monitorStandLines.push({ p1: [-hingeW, hingeY + hingeH / 2, hingeZ], p2: [-hingeW, hingeY - hingeH / 2, hingeZ] });

  // Main Stand Column
  const baseCenterY = roomH_bot;
  const baseCenterZ = tabCenterZ + 0.08;
  const neckW_top = 0.06;
  const neckW_bot = 0.12;

  monitorStandLines.push({ p1: [-neckW_top, hingeY, hingeZ], p2: [-neckW_bot, baseCenterY, baseCenterZ] });
  monitorStandLines.push({ p1: [neckW_top, hingeY, hingeZ], p2: [neckW_bot, baseCenterY, baseCenterZ] });

  // Floor Base Plinth
  const footW = 0.38;
  const footFrontZ = baseCenterZ - 0.12;
  const footBackZ = baseCenterZ + 0.12;
  monitorStandLines.push({ p1: [-footW / 2, baseCenterY, footFrontZ], p2: [footW / 2, baseCenterY, footFrontZ] });
  monitorStandLines.push({ p1: [footW / 2, baseCenterY, footFrontZ], p2: [footW * 0.4, baseCenterY, footBackZ] });
  monitorStandLines.push({ p1: [footW * 0.4, baseCenterY, footBackZ], p2: [-footW * 0.4, baseCenterY, footBackZ] });
  monitorStandLines.push({ p1: [-footW * 0.4, baseCenterY, footBackZ], p2: [-footW / 2, baseCenterY, footFrontZ] });

  // 4 Corners of Monitor Face for Texture Mapping & Solid Occlusion Mask
  const monitorFaceCorners: [number, number, number][] = [
    getTabPoint(-hw, -hh),
    getTabPoint(hw, -hh),
    getTabPoint(hw, hh),
    getTabPoint(-hw, hh),
  ];

  return {
    backgroundLines,
    totemLines,
    monitorStandLines,
    monitorLines,
    monitorFaceCorners,
    wallScreenFaces,
    totemScreenFace,
  };
}

export function NexExperienceWireframe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animId = 0;

    const dashboardImg = new Image();
    dashboardImg.src = "/images/white_tusker_kiosk_current.png?v=clean";
    let imgLoaded = false;
    dashboardImg.onload = () => { imgLoaded = true; };

    const wallScreenImg = new Image();
    wallScreenImg.src = "/images/white_tusker_wall_screen.png?v=black";
    let wallImgLoaded = false;
    wallScreenImg.onload = () => { wallImgLoaded = true; };

    const {
      backgroundLines,
      totemLines,
      monitorStandLines,
      monitorLines,
      monitorFaceCorners,
      wallScreenFaces,
      totemScreenFace,
    } = buildNexExperienceWireframe();

    let targetRotY = 0;
    let targetRotX = 0;
    let currRotY = 0;
    let currRotX = 0;

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const project = (
      x: number,
      y: number,
      z: number,
      rotX: number,
      rotY: number,
      cameraZ: number
    ): [number, number, number, boolean] => {
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = x * cosY - z * sinY;
      const z1 = z * cosY + x * sinY;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = z1 * cosX + y * sinX;

      const dist = z2 + cameraZ;
      if (dist <= 0.2) return [0, 0, 0, false];

      const fov = Math.min(width, height) * 0.88;
      const projX = width / 2 + (x1 / dist) * fov;
      const projY = height / 2 + (y2 / dist) * fov;

      return [projX, projY, dist, true];
    };

    const cameraZ = 2.4;

    const drawTri = (
      img: HTMLImageElement,
      p0: [number, number], p1: [number, number], p2: [number, number],
      u0: number, v0: number, u1: number, v1: number, u2: number, v2: number
    ) => {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(p0[0], p0[1]);
      ctx.lineTo(p1[0], p1[1]);
      ctx.lineTo(p2[0], p2[1]);
      ctx.closePath();
      ctx.clip();

      const denom = u0 * (v1 - v2) - u1 * (v0 - v2) + u2 * (v0 - v1);
      if (Math.abs(denom) > 1e-5) {
        const a = (p0[0] * (v1 - v2) - p1[0] * (v0 - v2) + p2[0] * (v0 - v1)) / denom;
        const b = (p0[1] * (v1 - v2) - p1[1] * (v0 - v2) + p2[1] * (v0 - v1)) / denom;
        const c = (u0 * (p1[0] - p2[0]) - u1 * (p0[0] - p2[0]) + u2 * (p0[0] - p1[0])) / denom;
        const d = (u0 * (p1[1] - p2[1]) - u1 * (p0[1] - p2[1]) + u2 * (p0[1] - p1[1])) / denom;
        const e = p0[0] - a * u0 - c * v0;
        const f = p0[1] - b * u0 - d * v0;

        ctx.transform(a, b, c, d, e, f);
        ctx.drawImage(img, 0, 0);
      }
      ctx.restore();
    };

    const render = () => {
      currRotY += (targetRotY - currRotY) * 0.05;
      currRotX += (targetRotX - currRotX) * 0.05;

      const cameraPitch = currRotX;
      const cameraYaw = currRotY;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. Draw Architectural Room Wireframe (Clean, minimal blueprint lines)
      backgroundLines.forEach((line) => {
        const [x1, y1, z1] = line.p1;
        const [x2, y2, z2] = line.p2;

        const [px1, py1, d1, v1] = project(x1, y1, z1, cameraPitch, cameraYaw, cameraZ);
        const [px2, py2, d2, v2] = project(x2, y2, z2, cameraPitch, cameraYaw, cameraZ);

        if (v1 && v2) {
          ctx.beginPath();
          ctx.moveTo(px1, py1);
          ctx.lineTo(px2, py2);
          ctx.lineWidth = line.color ? 1.4 : 0.85;
          ctx.strokeStyle = line.color || 'rgba(255, 255, 255, 0.45)';
          ctx.stroke();
        }
      });

      // 2. Draw Digital Signage Totem Chassis & Plinth Wireframe
      totemLines.forEach((line) => {
        const [x1, y1, z1] = line.p1;
        const [x2, y2, z2] = line.p2;

        const [px1, py1, d1, v1] = project(x1, y1, z1, cameraPitch, cameraYaw, cameraZ);
        const [px2, py2, d2, v2] = project(x2, y2, z2, cameraPitch, cameraYaw, cameraZ);

        if (v1 && v2) {
          ctx.beginPath();
          ctx.moveTo(px1, py1);
          ctx.lineTo(px2, py2);
          ctx.lineWidth = 1.0;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.stroke();
        }
      });

      // 3. Render White Tusker Graphics on Wall Screens & Digital Signage
      if (wallImgLoaded && wallScreenImg.naturalWidth > 0) {
        const wiw = wallScreenImg.naturalWidth;
        const wih = wallScreenImg.naturalHeight;

        // Presentation screens (Lower 3 screens + Upper Right screen) attached static to back wall without animation
        wallScreenFaces.forEach((corners) => {
          const x1 = Math.min(corners[0][0], corners[1][0]);
          const x2 = Math.max(corners[0][0], corners[1][0]);
          const y1 = Math.min(corners[0][1], corners[2][1]);
          const y2 = Math.max(corners[0][1], corners[2][1]);
          const z = corners[0][2];
          const bz = 0.015; // Clean slim bezel

          // 3D Clean Outer Bezel Frame
          const pb0 = project(x1 - bz, y1 - bz, z, 0, 0, cameraZ);
          const pb1 = project(x2 + bz, y1 - bz, z, 0, 0, cameraZ);
          const pb2 = project(x2 + bz, y2 + bz, z, 0, 0, cameraZ);
          const pb3 = project(x1 - bz, y2 + bz, z, 0, 0, cameraZ);

          const projected = corners.map((p) =>
            project(p[0], p[1], p[2], 0, 0, cameraZ)
          );

          if (projected.every((p) => p[3]) && pb0[3] && pb1[3] && pb2[3] && pb3[3]) {
            const p0: [number, number] = [projected[0][0], projected[0][1]];
            const p1: [number, number] = [projected[1][0], projected[1][1]];
            const p2: [number, number] = [projected[2][0], projected[2][1]];
            const p3: [number, number] = [projected[3][0], projected[3][1]];

            const b0: [number, number] = [pb0[0], pb0[1]];
            const b1: [number, number] = [pb1[0], pb1[1]];
            const b2: [number, number] = [pb2[0], pb2[1]];
            const b3: [number, number] = [pb3[0], pb3[1]];

            // Solid black backing
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.moveTo(b0[0], b0[1]);
            ctx.lineTo(b1[0], b1[1]);
            ctx.lineTo(b2[0], b2[1]);
            ctx.lineTo(b3[0], b3[1]);
            ctx.closePath();
            ctx.fill();

            // Render White Tusker Image inside the screen
            const u0 = wiw * 0.03;
            const u1 = wiw * 0.97;
            const v0 = wih * 0.04;
            const v1 = wih * 0.96;

            drawTri(wallScreenImg, p0, p1, p2, u0, v0, u1, v0, u1, v1);
            drawTri(wallScreenImg, p0, p2, p3, u0, v0, u1, v1, u0, v1);

            // Clean crisp outer frame outline
            ctx.beginPath();
            ctx.moveTo(b0[0], b0[1]);
            ctx.lineTo(b1[0], b1[1]);
            ctx.lineTo(b2[0], b2[1]);
            ctx.lineTo(b3[0], b3[1]);
            ctx.closePath();
            ctx.lineWidth = 1.0;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.stroke();
          }
        });

        // Left Digital Signage Totem on Upper Floor: Rendered in FRONT of the kiosk frame
        if (totemScreenFace) {
          const projTotem = totemScreenFace.map((p) =>
            project(p[0], p[1], p[2], cameraPitch, cameraYaw, cameraZ)
          );
          if (projTotem.every((p) => p[3])) {
            const p0: [number, number] = [projTotem[0][0], projTotem[0][1]];
            const p1: [number, number] = [projTotem[1][0], projTotem[1][1]];
            const p2: [number, number] = [projTotem[2][0], projTotem[2][1]];
            const p3: [number, number] = [projTotem[3][0], projTotem[3][1]];

            // Solid black underlay
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.moveTo(p0[0], p0[1]);
            ctx.lineTo(p1[0], p1[1]);
            ctx.lineTo(p2[0], p2[1]);
            ctx.lineTo(p3[0], p3[1]);
            ctx.closePath();
            ctx.fill();

            // Center-crop portrait mapping for the vertical kiosk screen
            const uCrop = wiw * 0.22;
            const u0 = uCrop;
            const u1 = wiw - uCrop;
            const v0 = wih * 0.08;
            const v1 = wih * 0.92;

            drawTri(wallScreenImg, p0, p1, p2, u0, v0, u1, v0, u1, v1);
            drawTri(wallScreenImg, p0, p2, p3, u0, v0, u1, v1, u0, v1);

            // Subtle crisp border around the screen glass
            ctx.beginPath();
            ctx.moveTo(p0[0], p0[1]);
            ctx.lineTo(p1[0], p1[1]);
            ctx.lineTo(p2[0], p2[1]);
            ctx.lineTo(p3[0], p3[1]);
            ctx.closePath();
            ctx.lineWidth = 1.2;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.stroke();
          }
        }
      }

      // 4. Draw Monitor Stand Pedestal in the floor
      monitorStandLines.forEach((line) => {
        const [x1, y1, z1] = line.p1;
        const [x2, y2, z2] = line.p2;

        const [px1, py1, d1, v1] = project(x1, y1, z1, cameraPitch, cameraYaw, cameraZ);
        const [px2, py2, d2, v2] = project(x2, y2, z2, cameraPitch, cameraYaw, cameraZ);

        if (v1 && v2) {
          ctx.beginPath();
          ctx.moveTo(px1, py1);
          ctx.lineTo(px2, py2);
          ctx.lineWidth = 1.4;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.stroke();
        }
      });

      // 5. OPAQUE DEPTH OCCLUSION MASK: Blocks any lines behind the front monitor
      const facePts = monitorFaceCorners.map((p) =>
        project(p[0], p[1], p[2], cameraPitch, cameraYaw, cameraZ)
      );

      if (facePts.every((p) => p[3])) {
        const p0: [number, number] = [facePts[0][0], facePts[0][1]];
        const p1: [number, number] = [facePts[1][0], facePts[1][1]];
        const p2: [number, number] = [facePts[2][0], facePts[2][1]];
        const p3: [number, number] = [facePts[3][0], facePts[3][1]];

        // Helper to trace the smooth rounded monitor chassis contour matching the UI bezel
        const traceMonitorOutline = () => {
          const rX = 0.023;
          const rY = 0.048;

          const p01_a: [number, number] = [p0[0] + (p1[0] - p0[0]) * rX, p0[1] + (p1[1] - p0[1]) * rX];
          const p01_b: [number, number] = [p1[0] - (p1[0] - p0[0]) * rX, p1[1] - (p1[1] - p0[1]) * rX];

          const p12_a: [number, number] = [p1[0] + (p2[0] - p1[0]) * rY, p1[1] + (p2[1] - p1[1]) * rY];
          const p12_b: [number, number] = [p2[0] - (p2[0] - p1[0]) * rY, p2[1] - (p2[1] - p1[1]) * rY];

          const p23_a: [number, number] = [p2[0] + (p3[0] - p2[0]) * rX, p2[1] + (p3[1] - p2[0]) * rX];
          const p23_b: [number, number] = [p3[0] - (p3[0] - p2[0]) * rX, p3[1] - (p3[1] - p2[0]) * rX];

          const p30_a: [number, number] = [p3[0] + (p0[0] - p3[0]) * rY, p3[1] + (p0[1] - p3[1]) * rY];
          const p30_b: [number, number] = [p0[0] - (p0[0] - p3[0]) * rY, p0[1] - (p0[1] - p3[1]) * rY];

          ctx.beginPath();
          ctx.moveTo(p01_a[0], p01_a[1]);
          ctx.lineTo(p01_b[0], p01_b[1]);
          ctx.quadraticCurveTo(p1[0], p1[1], p12_a[0], p12_a[1]);
          ctx.lineTo(p12_b[0], p12_b[1]);
          ctx.quadraticCurveTo(p2[0], p2[1], p23_a[0], p23_a[1]);
          ctx.lineTo(p23_b[0], p23_b[1]);
          ctx.quadraticCurveTo(p3[0], p3[1], p30_a[0], p30_a[1]);
          ctx.lineTo(p30_b[0], p30_b[1]);
          ctx.quadraticCurveTo(p0[0], p0[1], p01_a[0], p01_a[1]);
          ctx.closePath();
        };

        // Solid rounded occlusion mask
        ctx.save();
        traceMonitorOutline();
        ctx.fillStyle = '#000000';
        ctx.shadowColor = 'rgba(0, 0, 0, 1)';
        ctx.shadowBlur = 35;
        ctx.shadowOffsetY = 15;
        ctx.fill();
        ctx.restore();

        // Fit the White Tusker dashboard kiosk image onto the front monitor face
        if (imgLoaded && dashboardImg.naturalWidth > 0) {
          const iw = dashboardImg.naturalWidth;
          const ih = dashboardImg.naturalHeight;

          drawTri(dashboardImg, p0, p1, p2, 0, 0, iw, 0, iw, ih);
          drawTri(dashboardImg, p0, p2, p3, 0, 0, iw, ih, 0, ih);
        }
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full bg-[#000000] overflow-hidden select-none cursor-crosshair"
    >
      {/* 3D Wireframe Canvas */}
      <canvas ref={canvasRef} className="block h-full w-full" />

      {/* Subtle minimal exit back to Drava Ecosystem */}
      <TransitionLink
        href="/applications"
        aria-label="Back to products"
        className="fixed top-5 left-6 z-50 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3.5 py-1.5 text-xs font-mono text-white/50 hover:text-white hover:border-white/30 hover:bg-black/80 transition-all backdrop-blur-sm"
      >
        <span>←</span>
        <span>DRAVA</span>
      </TransitionLink>
    </div>
  );
}
