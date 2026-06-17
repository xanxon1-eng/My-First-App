import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, RotateCw, Sliders, Eye, EyeOff, Layers, Grid, Info, Check, HelpCircle, 
  RefreshCw, ZoomIn, ZoomOut, Maximize2, Move, Compass
} from 'lucide-react';

// Define the 3D vertex type
interface Vertex3D {
  x: number;
  y: number;
  z: number;
}

// 4 distinct presets as requested by user
type PresetType = 'standard' | 'rotated_vps' | 'rotated_horizon' | 'moved_horizon';

// Interactive renderable face type to implement sorted Painter's Algorithm
interface RenderableFace {
  type: 'polygon' | 'custom';
  w_avg: number;
  pts?: { x: number; y: number }[];
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  strokeDasharray?: string;
  render?: () => React.ReactNode;
}

export const DrawingModule: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  // Canvas size references
  const canvasWidth = 800;
  const canvasHeight = 520;

  // 1. Independent Vanishing Points & Perspective Coordinates
  // Initial standard values: flat horizon at height 240, centered, spread of 640px
  const [vp1, setVp1] = useState({ x: 80, y: 240 });
  const [vp2, setVp2] = useState({ x: 720, y: 240 });

  // Draggable Stool Vanishing Points (starting as standard calculations on the horizon)
  const [vp3, setVp3] = useState({ x: 300, y: 240 });
  const [vp4, setVp4] = useState({ x: 500, y: 240 });

  // 360° Room Rotation state
  const [roomRot, setRoomRot] = useState(0);

  // Front Walls display selection: 'wireframe' | 'hidden' | 'opaque'
  const [frontWallsMode, setFrontWallsMode] = useState<'wireframe' | 'hidden' | 'opaque'>('wireframe');

  const [verticalTilt, setVerticalTilt] = useState(90);     // Angle of vertical lines (60 to 120, 90 is straight up)
  const [originX, setOriginX] = useState(400);             // Screen origin X (center of room corner)
  const [originY, setOriginY] = useState(390);             // Screen origin Y (room floor corner)
  
  // 3D scale factors (Z scale height factor)
  const [scaleZ, setScaleZ] = useState(110);

  // Stool Rotation Settings
  const [stoolRot, setStoolRot] = useState(35);             // Rotation of the secondary stool in degrees (0 - 360)

  // Zoom and Pan coordinates
  const [zoom, setZoom] = useState(1.0);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);

  // Interactive Visibility Toggles
  const [showConstruction, setShowConstruction] = useState(true);
  const [showStoolConstruction, setShowStoolConstruction] = useState(true);
  const [showRoomGrid, setShowRoomGrid] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [activePreset, setActivePreset] = useState<PresetType>('standard');

  // Mouse tracking for drag/pan operations
  const canvasRef = useRef<SVGSVGElement | null>(null);
  const [draggedElement, setDraggedElement] = useState<'vp1' | 'vp2' | 'vp3' | 'vp4' | 'origin' | 'horizon' | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // 2. Mathematical Calculations derived from Independent VPs
  const vpCenter = useMemo(() => ({
    x: (vp1.x + vp2.x) / 2,
    y: (vp1.y + vp2.y) / 2
  }), [vp1, vp2]);

  const { uHat, vHat, horizonTilt, horizonDistance } = useMemo(() => {
    const dx = vp2.x - vp1.x;
    const dy = vp2.y - vp1.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1e-5;
    const u = { x: dx / dist, y: dy / dist };
    const v = { x: -u.y, y: u.x }; // Perpendicular vector pointing downwards
    const tilt = (Math.atan2(dy, dx) * 180) / Math.PI;
    return { uHat: u, vHat: v, horizonTilt: tilt, horizonDistance: dist };
  }, [vp1, vp2]);

  // Secondary Stool rotation VPs
  const stoolRad = useMemo(() => (stoolRot * Math.PI) / 180, [stoolRot]);
  
  // Projection coefficients
  const k_x = 1.0;
  const k_y = 1.0;

  // Dynamic feedback sync to realign VP3 and VP4 during normal room navigation or rotation
  useEffect(() => {
    if (draggedElement !== 'vp3' && draggedElement !== 'vp4') {
      const totalAngle = stoolRot + roomRot;
      const totalRad = (totalAngle * Math.PI) / 180;

      const alpha3 = (k_x * Math.cos(totalRad)) / (k_x * Math.cos(totalRad) + k_y * Math.sin(totalRad) + 1e-5);
      setVp3({
        x: alpha3 * vp1.x + (1 - alpha3) * vp2.x,
        y: alpha3 * vp1.y + (1 - alpha3) * vp2.y,
      });

      const alpha4 = (k_x * Math.cos(totalRad + Math.PI / 2)) / (k_x * Math.cos(totalRad + Math.PI / 2) + k_y * Math.sin(totalRad + Math.PI / 2) + 1e-5);
      setVp4({
        x: alpha4 * vp1.x + (1 - alpha4) * vp2.x,
        y: alpha4 * vp1.y + (1 - alpha4) * vp2.y,
      });
    }
  }, [vp1, vp2, stoolRot, roomRot, draggedElement]);

  // Vertical line direction
  const vertRad = useMemo(() => (verticalTilt * Math.PI) / 180, [verticalTilt]);
  const vertHat = useMemo(() => ({ x: Math.cos(vertRad), y: -Math.sin(vertRad) }), [vertRad]);

  // Derived fine-tuning attributes for bidirectional slider controls
  const computedHorizonHeight = useMemo(() => {
    return Math.round(canvasHeight / 2 + (vpCenter.x - canvasWidth / 2) * vHat.x + (vpCenter.y - canvasHeight / 2) * vHat.y);
  }, [vpCenter, vHat]);

  const computedHorizonTilt = useMemo(() => Math.round(horizonTilt), [horizonTilt]);
  const computedVpDistance = useMemo(() => Math.round(horizonDistance / 2), [horizonDistance]);
  const computedVpShift = useMemo(() => {
    return Math.round((vpCenter.x - canvasWidth / 2) * uHat.x + (vpCenter.y - canvasHeight / 2) * uHat.y);
  }, [vpCenter, uHat]);

  // Bidirectional syncing: slider controls update independent VPs
  const updateVPsFromSliders = (vals: {
    height?: number;
    tilt?: number;
    distance?: number;
    shift?: number;
  }) => {
    const h = vals.height !== undefined ? vals.height : computedHorizonHeight;
    const t = vals.tilt !== undefined ? vals.tilt : computedHorizonTilt;
    const d = vals.distance !== undefined ? vals.distance : computedVpDistance;
    const s = vals.shift !== undefined ? vals.shift : computedVpShift;

    const angleRad = (t * Math.PI) / 180;
    const cosVal = Math.cos(angleRad);
    const sinVal = Math.sin(angleRad);
    const u = { x: cosVal, y: sinVal };
    const v = { x: -sinVal, y: cosVal };

    const center = {
      x: canvasWidth / 2 + s * u.x + (h - canvasHeight / 2) * v.x,
      y: canvasHeight / 2 + s * u.y + (h - canvasHeight / 2) * v.y,
    };

    setVp1({
      x: center.x - d * u.x,
      y: center.y - d * u.y,
    });
    setVp2({
      x: center.x + d * u.x,
      y: center.y + d * u.y,
    });
    setActivePreset('standard'); // Set to custom/unlocked preset mode when manual tuning is performed
  };

  // Set Presets using the bidirectional helper
  const applyPreset = (preset: PresetType) => {
    setActivePreset(preset);
    let hHeight = 240;
    let hTilt = 0;
    let dist = 320;
    let shift = 0;
    let vertAngle = 90;
    let ox = 400;
    let oy = 390;

    switch (preset) {
      case 'standard':
        hHeight = 240; hTilt = 0; dist = 320; shift = 0; vertAngle = 90; ox = 400; oy = 390;
        break;
      case 'rotated_vps':
        hHeight = 240; hTilt = 0; dist = 350; shift = -110; vertAngle = 90; ox = 400; oy = 390;
        break;
      case 'rotated_horizon':
        hHeight = 240; hTilt = -12; dist = 320; shift = 0; vertAngle = 78; ox = 400; oy = 380;
        break;
      case 'moved_horizon':
        hHeight = 150; hTilt = 0; dist = 320; shift = 0; vertAngle = 90; ox = 400; oy = 410;
        break;
    }

    setOriginX(ox);
    setOriginY(oy);
    setVerticalTilt(vertAngle);
    setStoolRot(35);
    setRoomRot(0);

    const angleRad = (hTilt * Math.PI) / 180;
    const cosVal = Math.cos(angleRad);
    const sinVal = Math.sin(angleRad);
    const u = { x: cosVal, y: sinVal };
    const v = { x: -sinVal, y: cosVal };

    const center = {
      x: canvasWidth / 2 + shift * u.x + (hHeight - canvasHeight / 2) * v.x,
      y: canvasHeight / 2 + shift * u.y + (hHeight - canvasHeight / 2) * v.y,
    };

    setVp1({
      x: center.x - dist * u.x,
      y: center.y - dist * u.y,
    });
    setVp2({
      x: center.x + dist * u.x,
      y: center.y + dist * u.y,
    });
  };

  // 3. Perspective Projection Engine
  // Projects any 3D coordinate (x, y, z) into screen space
  const projectPoint = (x3D: number, y3D: number, z3D: number): { x: number; y: number } => {
    const fx = x3D / 3.0; // Normalized room dimensions
    const fy = y3D / 3.0;

    // Depth scaling factor
    const w = 1.0 + k_x * fx + k_y * fy;

    // Projection combining baseline, left VP vector, right VP vector, and scaled vertical height
    const px = (originX + k_x * fx * vp1.x + k_y * fy * vp2.x) / w + (z3D * scaleZ * vertHat.x) / w;
    const py = (originY + k_x * fx * vp1.y + k_y * fy * vp2.y) / w + (z3D * scaleZ * vertHat.y) / w;

    return { x: px, y: py };
  };

  // Projects a 3D coordinate with room 360° rotation about center axis (1.5, 1.5)
  const projectPointRot = (x3D: number, y3D: number, z3D: number): { x: number; y: number } => {
    const angleRad = (roomRot * Math.PI) / 180;
    const cx = 1.5;
    const cy = 1.5;
    const dx = x3D - cx;
    const dy = y3D - cy;
    const rx = cx + (dx * Math.cos(angleRad) - dy * Math.sin(angleRad));
    const ry = cy + (dx * Math.sin(angleRad) + dy * Math.cos(angleRad));

    return projectPoint(rx, ry, z3D);
  };

  // Projects dual-rotated stool vertices using custom vanishing points (vp3, vp4) to allow independent sliding
  const projectStoolPoint = (lx: number, ly: number, lz: number): { x: number; y: number } => {
    // 1. Local stool rotation around stool center (1.7, 0.7)
    const cx = 1.7;
    const cy = 0.7;
    const rx = lx - cx;
    const ry = ly - cy;
    const sRad = (stoolRot * Math.PI) / 180;
    const localRotX = rx * Math.cos(sRad) - ry * Math.sin(sRad);
    const localRotY = rx * Math.sin(sRad) + ry * Math.cos(sRad);
    
    // Coordinates of this point in the room frame (before room rotation)
    const roomX = cx + localRotX;
    const roomY = cy + localRotY;

    // 2. Rotate room frame around room center (1.5, 1.5) by roomRot
    const angleRad = (roomRot * Math.PI) / 180;
    const rcx = 1.5;
    const rcy = 1.5;
    const dx = roomX - rcx;
    const dy = roomY - rcy;
    const rotX = rcx + (dx * Math.cos(angleRad) - dy * Math.sin(angleRad));
    const rotY = rcy + (dx * Math.sin(angleRad) + dy * Math.cos(angleRad));

    // 3. Project! We combine the rotated stool center (under roomRot) with stool VP3 and VP4 recession offsets
    const cdx = cx - rcx;
    const cdy = cy - rcy;
    const rotCX = rcx + (cdx * Math.cos(angleRad) - cdy * Math.sin(angleRad));
    const rotCY = rcy + (cdx * Math.sin(angleRad) + cdy * Math.cos(angleRad));

    const rotRx = rotX - rotCX;
    const rotRy = rotY - rotCY;

    const w = 1.0 + k_x * (rotCX + rotRx) / 3.0 + k_y * (rotCY + rotRy) / 3.0;

    const px = (originX + k_x * (rotCX / 3.0) * vp1.x + k_y * (rotCY / 3.0) * vp2.x + (k_x / 3.0) * rotRx * vp3.x + (k_y / 3.0) * rotRy * vp4.x) / w + (lz * scaleZ * vertHat.x) / w;
    const py = (originY + k_x * (rotCX / 3.0) * vp1.y + k_y * (rotCY / 3.0) * vp2.y + (k_x / 3.0) * rotRx * vp3.y + (k_y / 3.0) * rotRy * vp4.y) / w + (lz * scaleZ * vertHat.y) / w;

    return { x: px, y: py };
  };

  // Depth weight helper (Painter's depth coordinates)
  // Farther back points have smaller w coordinates (closer to corner origin 0,0,0)
  // Closer points have larger w coordinates
  const getW = (x: number, y: number): number => {
    return 1.0 + k_x * (x / 3.0) + k_y * (y / 3.0);
  };

  // Rotated room depth coefficient helper
  const getWRot = (x3D: number, y3D: number): number => {
    const angleRad = (roomRot * Math.PI) / 180;
    const cx = 1.5;
    const cy = 1.5;
    const dx = x3D - cx;
    const dy = y3D - cy;
    const rx = cx + (dx * Math.cos(angleRad) - dy * Math.sin(angleRad));
    const ry = cy + (dx * Math.sin(angleRad) + dy * Math.cos(angleRad));
    return getW(rx, ry);
  };

  // Rotated stool depth helper
  const getStoolWRot = (lx: number, ly: number): number => {
    const cx = 1.7;
    const cy = 0.7;
    const rx = lx - cx;
    const ry = ly - cy;
    const sRad = (stoolRot * Math.PI) / 180;
    const localRotX = rx * Math.cos(sRad) - ry * Math.sin(sRad);
    const localRotY = rx * Math.sin(sRad) + ry * Math.cos(sRad);
    
    const roomX = cx + localRotX;
    const roomY = cy + localRotY;

    const angleRad = (roomRot * Math.PI) / 180;
    const rcx = 1.5;
    const rcy = 1.5;
    const dx = roomX - rcx;
    const dy = roomY - rcy;
    const rotX = rcx + (dx * Math.cos(angleRad) - dy * Math.sin(angleRad));
    const rotY = rcy + (dx * Math.sin(angleRad) + dy * Math.cos(angleRad));

    return 1.0 + k_x * rotX / 3.0 + k_y * rotY / 3.0;
  };

  // Projected SVG coordinates path string
  const toPointsPath = (pts: { x: number; y: number }[]) => {
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ' Z';
  };

  // Handle Dragging / Panning on SVG canvas
  const handleMouseDown = (e: React.MouseEvent<any>, el: 'vp1' | 'vp2' | 'vp3' | 'vp4' | 'origin' | 'horizon') => {
    e.stopPropagation();
    if (e.button === 1) return; // Ignore on middle click
    setDraggedElement(el);
  };

  // Middle-mouse or Space dragging setup
  const handleCanvasMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button === 1) { // Middle mouse button
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - panX, y: e.clientY - panY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (isPanning) {
      setPanX(e.clientX - panStart.x);
      setPanY(e.clientY - panStart.y);
      return;
    }

    if (!draggedElement) return;

    // Convert screen coordinate back to SVG coordinate under the active Zoom/Pan transform
    const svgX = (mx - panX) / zoom;
    const svgY = (my - panY) / zoom;

    if (draggedElement === 'origin') {
      setOriginX(Math.max(50, Math.min(750, svgX)));
      setOriginY(Math.max(100, Math.min(500, svgY)));
    } else if (draggedElement === 'vp1') {
      // Independent VP1 is placed exactly under the cursor
      setVp1({ x: svgX, y: svgY });
      setActivePreset('standard');
    } else if (draggedElement === 'vp2') {
      // Independent VP2 is placed exactly under the cursor
      setVp2({ x: svgX, y: svgY });
      setActivePreset('standard');
    } else if (draggedElement === 'vp3') {
      // Independent VP3 is placed exactly under the cursor
      setVp3({ x: svgX, y: svgY });
      setActivePreset('standard');
    } else if (draggedElement === 'vp4') {
      // Independent VP4 is placed exactly under the cursor
      setVp4({ x: svgX, y: svgY });
      setActivePreset('standard');
    } else if (draggedElement === 'horizon') {
      // Shifting horizon line dynamically: translates both VPs along perpendicular vector vHat
      const prevCenter = { x: (vp1.x + vp2.x) / 2, y: (vp1.y + vp2.y) / 2 };
      const dx = svgX - prevCenter.x;
      const dy = svgY - prevCenter.y;
      const shiftDistance = dx * vHat.x + dy * vHat.y;

      setVp1({ x: vp1.x + shiftDistance * vHat.x, y: vp1.y + shiftDistance * vHat.y });
      setVp2({ x: vp2.x + shiftDistance * vHat.x, y: vp2.y + shiftDistance * vHat.y });
      setActivePreset('standard');
    }
  };

  const handleMouseUp = () => {
    setDraggedElement(null);
    setIsPanning(false);
  };

  // Scroll wheel zooming (centered on mouse position)
  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    // SVG coordinate under current zoom/pan before scaling
    const svgX = (mx - panX) / zoom;
    const svgY = (my - panY) / zoom;

    const zoomStep = 1.15;
    const nextZoom = e.deltaY < 0 ? zoom * zoomStep : zoom / zoomStep;
    const finalZoom = Math.max(0.3, Math.min(5.0, nextZoom));

    setPanX(mx - svgX * finalZoom);
    setPanY(my - svgY * finalZoom);
    setZoom(finalZoom);
  };

  const handleZoomButton = (direction: 'in' | 'out') => {
    const scale = direction === 'in' ? 1.25 : 0.8;
    const nextZoom = zoom * scale;
    const finalZoom = Math.max(0.3, Math.min(5.0, nextZoom));
    
    // Zoom relative to canvas center
    const cx = canvasWidth / 2;
    const cy = canvasHeight / 2;
    const svgX = (cx - panX) / zoom;
    const svgY = (cy - panY) / zoom;

    setPanX(cx - svgX * finalZoom);
    setPanY(cy - svgY * finalZoom);
    setZoom(finalZoom);
  };

  const handleResetZoomPan = () => {
    setZoom(1.0);
    setPanX(0);
    setPanY(0);
  };

  // Shared corner projection coordinates for construction lines
  const L = 3.0;
  const H = 2.2;
  
  // Dynamic rotated room corners for proper bounding guides
  const cornersRot = useMemo(() => {
    return {
      c_0_0_0: projectPointRot(0, 0, 0),
      c_L_0_0: projectPointRot(L, 0, 0),
      c_0_L_0: projectPointRot(0, L, 0),
      c_L_L_0: projectPointRot(L, L, 0),
      c_0_0_H: projectPointRot(0, 0, H),
      c_L_0_H: projectPointRot(L, 0, H),
      c_0_L_H: projectPointRot(0, L, H),
      c_L_L_H: projectPointRot(L, L, H),
    };
  }, [vp1, vp2, originX, originY, verticalTilt, roomRot]);

  // Checker grids paths on the floor
  const floorGrids = useMemo(() => {
    const grids = [];
    if (showRoomGrid) {
      for (let i = 0.5; i < L; i += 0.5) {
        grids.push({ p1: projectPointRot(i, 0, 0), p2: projectPointRot(i, L, 0) });
        grids.push({ p1: projectPointRot(0, i, 0), p2: projectPointRot(L, i, 0) });
      }
    }
    return grids;
  }, [vp1, vp2, originX, originY, showRoomGrid, verticalTilt, roomRot]);

  // 4. Unified Mathematical Depth Sorting (Painter's Algorithm)
  // Generates 100% Watertight structural faces back-to-front under 360° rotation
  const sortedFaces = useMemo(() => {
    const faces: RenderableFace[] = [];

    // Foreground detection thresholds
    const isWall1Fore = getWRot(1.5, 0) > getWRot(1.5, 1.5) + 0.05;
    const isWall2Fore = getWRot(0, 1.5) > getWRot(1.5, 1.5) + 0.05;
    const isWall3Fore = getWRot(3.0, 1.5) > getWRot(1.5, 1.5) + 0.05;
    const isWall4Fore = getWRot(1.5, 3.0) > getWRot(1.5, 1.5) + 0.05;

    // Helper to render static structural walls with custom foreground rules
    const renderWall = (wallIdx: number, w_avg: number, pts: { x: number; y: number }[], fill: string, stroke: string, isFore: boolean) => {
      if (isFore && frontWallsMode === 'hidden') return;
      
      const wallOpacity = isFore && frontWallsMode === 'wireframe' ? 0.15 : 1.0;
      const wallStrokeDash = isFore && frontWallsMode === 'wireframe' ? '4,4' : undefined;
      const wallFill = isFore && frontWallsMode === 'wireframe' ? 'none' : fill;

      faces.push({
        type: 'polygon',
        w_avg,
        pts,
        fill: wallFill,
        stroke,
        strokeWidth: isFore && frontWallsMode === 'wireframe' ? 1.0 : 1.5,
        strokeDasharray: wallStrokeDash,
        opacity: wallOpacity,
      });
    };

    // Helper to render beautiful baseboards with matching wireframe visibility filter
    const renderBaseboard = (wallIdx: number, w_avg: number, pts: { x: number; y: number }[], fill: string, isFore: boolean) => {
      if (isFore && frontWallsMode === 'hidden') return;
      const opacity = isFore && frontWallsMode === 'wireframe' ? 0.15 : 1.0;
      const strokeDash = isFore && frontWallsMode === 'wireframe' ? '4,4' : undefined;
      const stroke = isFore && frontWallsMode === 'wireframe' ? '#3c3b38' : '#1f130b';
      const boardFill = isFore && frontWallsMode === 'wireframe' ? 'none' : fill;
      faces.push({
        type: 'polygon',
        w_avg: w_avg + 0.005, // slightly in front of wall surface
        pts,
        fill: boardFill,
        stroke,
        strokeWidth: isFore && frontWallsMode === 'wireframe' ? 0.8 : 1.0,
        strokeDasharray: strokeDash,
        opacity,
      });
    };

    // --- WALL SECTIONS DRAWING ---
    // Wall 1: Y = 0 (Back left)
    renderWall(1, getWRot(1.5, 0), [cornersRot.c_L_0_0, cornersRot.c_0_0_0, cornersRot.c_0_0_H, cornersRot.c_L_0_H], '#f6f4eb', '#3c3b38', isWall1Fore);
    
    // Wall 2: X = 0 (Back right)
    renderWall(2, getWRot(0, 1.5), [cornersRot.c_0_L_0, cornersRot.c_0_0_0, cornersRot.c_0_0_H, cornersRot.c_0_L_H], '#f1ece0', '#3c3b38', isWall2Fore);
    
    // Wall 3: X = L (Front left option)
    renderWall(3, getWRot(3.0, 1.5), [cornersRot.c_L_0_0, cornersRot.c_L_L_0, cornersRot.c_L_L_H, cornersRot.c_L_0_H], '#eae5d7', '#3c3b38', isWall3Fore);

    // Wall 4: Y = L (Front right option)
    renderWall(4, getWRot(1.5, 3.0), [cornersRot.c_0_L_0, cornersRot.c_L_L_0, cornersRot.c_L_L_H, cornersRot.c_0_L_H], '#f3eee2', '#3c3b38', isWall4Fore);

    // --- BASEBOARDS SECTIONS ---
    renderBaseboard(1, getWRot(1.5, 0), [projectPointRot(L, 0, 0), projectPointRot(0, 0, 0), projectPointRot(0, 0, 0.08), projectPointRot(L, 0, 0.08)], '#5c4d3c', isWall1Fore);
    renderBaseboard(2, getWRot(0, 1.5), [projectPointRot(0, L, 0), projectPointRot(0, 0, 0), projectPointRot(0, 0, 0.08), projectPointRot(0, L, 0.08)], '#5c4d3c', isWall2Fore);
    renderBaseboard(3, getWRot(3.0, 1.5), [projectPointRot(L, 0, 0), projectPointRot(L, L, 0), projectPointRot(L, L, 0.08), projectPointRot(L, 0, 0.08)], '#544636', isWall3Fore);
    renderBaseboard(4, getWRot(1.5, 3.0), [projectPointRot(0, L, 0), projectPointRot(L, L, 0), projectPointRot(L, L, 0.08), projectPointRot(0, L, 0.08)], '#544636', isWall4Fore);

    // --- WALL FEATURES & ANNOTATIONS (WINDOW, DOOR, PAINTING, CLOCK) ---
    
    // Window on Wall 1 (Y=0)
    const shouldDrawWall1Features = !isWall1Fore || frontWallsMode !== 'hidden';
    const wall1FeatureOpacity = (isWall1Fore && frontWallsMode === 'wireframe') ? 0.2 : 1.0;
    if (shouldDrawWall1Features) {
      const winPts = [
        projectPointRot(0.6, 0, 0.6),
        projectPointRot(1.8, 0, 0.6),
        projectPointRot(1.8, 0, 1.6),
        projectPointRot(0.6, 0, 1.6),
      ];
      faces.push({
        type: 'custom',
        w_avg: getWRot(1.5, 0) + 0.01,
        render: () => {
          const centerLines = [
            { p1: projectPointRot(1.2, 0, 0.6), p2: projectPointRot(1.2, 0, 1.6) },
            { p1: projectPointRot(0.6, 0, 1.1), p2: projectPointRot(1.8, 0, 1.1) },
          ];
          return (
            <g key="window-grp" stroke="#3c3b38" strokeWidth="1" fill={isWall1Fore && frontWallsMode === 'wireframe' ? 'none' : '#e9eff6'} opacity={wall1FeatureOpacity} filter="url(#pencil-texture)">
              <path d={toPointsPath(winPts)} />
              {centerLines.map((line, idx) => (
                <line key={`w-line-${idx}`} x1={line.p1.x} y1={line.p1.y} x2={line.p2.x} y2={line.p2.y} stroke="#73726c" />
              ))}
            </g>
          );
        }
      });
    }

    // Door on Wall 2 (X=0)
    const shouldDrawWall2Features = !isWall2Fore || frontWallsMode !== 'hidden';
    const wall2FeatureOpacity = (isWall2Fore && frontWallsMode === 'wireframe') ? 0.2 : 1.0;
    if (shouldDrawWall2Features) {
      const dPts = [
        projectPointRot(0, 0.7, 0),
        projectPointRot(0, 1.6, 0),
        projectPointRot(0, 1.6, 1.9),
        projectPointRot(0, 0.7, 1.9),
      ];
      const pInner = [
        projectPointRot(0, 0.75, 0.05),
        projectPointRot(0, 1.55, 0.05),
        projectPointRot(0, 1.55, 1.85),
        projectPointRot(0, 0.75, 1.85),
      ];
      const knob = projectPointRot(0, 1.45, 0.95);
      faces.push({
        type: 'custom',
        w_avg: getWRot(0, 1.5) + 0.01,
        render: () => {
          return (
            <g key="door-grp" stroke="#4a3e2c" strokeWidth="1.2" fill={isWall2Fore && frontWallsMode === 'wireframe' ? 'none' : '#e3ded3'} opacity={wall2FeatureOpacity} filter="url(#pencil-texture)">
              <path d={toPointsPath(dPts)} />
              <path d={toPointsPath(pInner)} fill="none" stroke="#7e7668" strokeWidth="0.8" />
              <circle cx={knob.x} cy={knob.y} r="3" fill="#8c7853" stroke="#222" />
            </g>
          );
        }
      });
    }

    // Circular Witcher-Style Poster painting on Wall 3 (X=L)
    const shouldDrawWall3Features = !isWall3Fore || frontWallsMode !== 'hidden';
    const wall3FeatureOpacity = (isWall3Fore && frontWallsMode === 'wireframe') ? 0.2 : 1.0;
    if (shouldDrawWall3Features) {
      const pLeftTop = projectPointRot(3.0, 1.2, 1.5);
      const pRightTop = projectPointRot(3.0, 1.8, 1.5);
      const pRightBottom = projectPointRot(3.0, 1.8, 0.9);
      const pLeftBottom = projectPointRot(3.0, 1.2, 0.9);
      faces.push({
        type: 'custom',
        w_avg: getWRot(3.0, 1.5) + 0.01,
        render: () => {
          const mCenter = projectPointRot(3.0, 1.5, 1.2);
          return (
            <g key="wall3-painting" stroke="#38210f" strokeWidth="1.4" fill="#3c2f2f" opacity={wall3FeatureOpacity} filter="url(#pencil-texture)">
              <path d={toPointsPath([pLeftTop, pRightTop, pRightBottom, pLeftBottom])} fill="#4e3629" />
              <path d={toPointsPath([
                projectPointRot(3.0, 1.25, 1.45),
                projectPointRot(3.0, 1.75, 1.45),
                projectPointRot(3.0, 1.75, 0.95),
                projectPointRot(3.0, 1.25, 0.95)
              ])} fill="#dfd0b2" stroke="#4e3629" strokeWidth="0.5" />
              <circle cx={mCenter.x} cy={mCenter.y} r="14" fill="none" stroke="#7e6754" strokeWidth="1" strokeDasharray="3,1" />
              <path d={`M ${mCenter.x-10} ${mCenter.y+2} Q ${mCenter.x-4} ${mCenter.y-8} ${mCenter.x+2} ${mCenter.y+1} T ${mCenter.x+10} ${mCenter.y-2}`} fill="none" stroke="#6b5344" strokeWidth="1" />
              <text x={mCenter.x} y={mCenter.y - 18} textAnchor="middle" fill="#8b5025" fontSize="7" fontFamily="serif" fontWeight="bold">WITCHER WORLD MAP</text>
            </g>
          );
        }
      });
    }

    // Hanging Medieval Clock on Wall 4 (Y=L)
    const shouldDrawWall4Features = !isWall4Fore || frontWallsMode !== 'hidden';
    const wall4FeatureOpacity = (isWall4Fore && frontWallsMode === 'wireframe') ? 0.2 : 1.0;
    if (shouldDrawWall4Features) {
      faces.push({
        type: 'custom',
        w_avg: getWRot(1.5, 3.0) + 0.01,
        render: () => {
          const clockCenter = projectPointRot(1.5, 3.0, 1.4);
          const hourHand = projectPointRot(1.5, 3.0, 1.49);
          const minHand = projectPointRot(1.58, 3.0, 1.4);
          return (
            <g key="wall4-clock" stroke="#1f2d3d" strokeWidth="1.2" fill="#edf2f4" opacity={wall4FeatureOpacity} filter="url(#pencil-texture)">
              <circle cx={clockCenter.x} cy={clockCenter.y} r="14" fill="#313b4c" />
              <circle cx={clockCenter.x} cy={clockCenter.y} r="11" fill="#f4f1ea" stroke="#687b8c" strokeWidth="0.8" />
              <line x1={clockCenter.x} y1={clockCenter.y} x2={hourHand.x} y2={hourHand.y} stroke="#d90429" strokeWidth="1.8" strokeLinecap="round" />
              <line x1={clockCenter.x} y1={clockCenter.y} x2={minHand.x} y2={minHand.y} stroke="#2b2d42" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx={clockCenter.x} cy={clockCenter.y} r="1.8" fill="#d90429" />
            </g>
          );
        }
      });
    }

    // --- RE-USABLE 3D SOLID GENERATION HELPERS SUPPORTING ROTATION ---
    const addBox3DRot = (
      xMin: number, xMax: number,
      yMin: number, yMax: number,
      zMin: number, zMax: number,
      colors: { top: string; front: string; right: string; left: string; back: string; bottom: string },
      stroke: string, strokeWidth: number
    ) => {
      const v000 = { x: xMin, y: yMin, z: zMin };
      const v100 = { x: xMax, y: yMin, z: zMin };
      const v110 = { x: xMax, y: yMax, z: zMin };
      const v010 = { x: xMin, y: yMax, z: zMin };
      
      const v001 = { x: xMin, y: yMin, z: zMax };
      const v101 = { x: xMax, y: yMin, z: zMax };
      const v111 = { x: xMax, y: yMax, z: zMax };
      const v011 = { x: xMin, y: yMax, z: zMax };

      const faceDefs = [
        { pts: [v001, v101, v111, v011], fill: colors.top },         // Top Face
        { pts: [v000, v100, v110, v010], fill: colors.bottom },      // Bottom Face
        { pts: [v010, v110, v111, v011], fill: colors.front },       // Front Face (+Y)
        { pts: [v000, v100, v101, v001], fill: colors.back },        // Back Face (-Y)
        { pts: [v100, v110, v111, v101], fill: colors.right },       // Right Face (+X)
        { pts: [v000, v010, v011, v001], fill: colors.left },        // Left Face (-X)
      ];

      faceDefs.forEach(f => {
        const w_avg = f.pts.reduce((sum, v2) => sum + getWRot(v2.x, v2.y), 0) / f.pts.length;
        const projPts = f.pts.map(v2 => projectPointRot(v2.x, v2.y, v2.z));
        faces.push({
          type: 'polygon',
          w_avg,
          pts: projPts,
          fill: f.fill,
          stroke,
          strokeWidth,
        });
      });
    };

    const addStoolBox3D = (
      xMin: number, xMax: number,
      yMin: number, yMax: number,
      zMin: number, zMax: number,
      colors: { top: string; front: string; right: string; left: string; back: string; bottom: string },
      stroke: string, strokeWidth: number
    ) => {
      const v000 = { x: xMin, y: yMin, z: zMin };
      const v100 = { x: xMax, y: yMin, z: zMin };
      const v110 = { x: xMax, y: yMax, z: zMin };
      const v010 = { x: xMin, y: yMax, z: zMin };
      
      const v001 = { x: xMin, y: yMin, z: zMax };
      const v101 = { x: xMax, y: yMin, z: zMax };
      const v111 = { x: xMax, y: yMax, z: zMax };
      const v011 = { x: xMin, y: yMax, z: zMax };

      const faceDefs = [
        { pts: [v001, v101, v111, v011], fill: colors.top },         // Top Face
        { pts: [v000, v100, v110, v010], fill: colors.bottom },      // Bottom Face
        { pts: [v010, v110, v111, v011], fill: colors.front },       // Front Face
        { pts: [v000, v100, v101, v001], fill: colors.back },        // Back Face
        { pts: [v100, v110, v111, v101], fill: colors.right },       // Right Face
        { pts: [v000, v010, v011, v001], fill: colors.left },        // Left Face
      ];

      faceDefs.forEach(f => {
        const w_avg = f.pts.reduce((sum, v2) => sum + getStoolWRot(v2.x, v2.y), 0) / f.pts.length;
        const projPts = f.pts.map(v2 => projectStoolPoint(v2.x, v2.y, v2.z));
        faces.push({
          type: 'polygon',
          w_avg,
          pts: projPts,
          fill: f.fill,
          stroke,
          strokeWidth,
        });
      });
    };

    // --- 5. HIGH-FIDELITY RECONSTRUCTED COUCH / SOFA (Placed on Wall X=0 / Right wall axis) ---
    // Support Pegs:
    addBox3DRot(0.15, 0.23, 2.05, 2.12, 0, 0.12, {
      top: '#241a13', front: '#1b130e', right: '#150e0a', left: '#1b130e', back: '#150e0a', bottom: '#150e0a'
    }, '#1f130b', 0.8);
    addBox3DRot(0.68, 0.76, 2.05, 2.12, 0, 0.12, {
      top: '#241a13', front: '#1b130e', right: '#150e0a', left: '#1b130e', back: '#150e0a', bottom: '#150e0a'
    }, '#1f130b', 0.8);
    addBox3DRot(0.15, 0.23, 2.68, 2.75, 0, 0.12, {
      top: '#241a13', front: '#1b130e', right: '#150e0a', left: '#1b130e', back: '#150e0a', bottom: '#150e0a'
    }, '#1f130b', 0.8);
    addBox3DRot(0.68, 0.76, 2.68, 2.75, 0, 0.12, {
      top: '#241a13', front: '#1b130e', right: '#150e0a', left: '#1b130e', back: '#150e0a', bottom: '#150e0a'
    }, '#1f130b', 0.8);

    // Pine Wood Solid Supporting Platform Rail:
    addBox3DRot(0.1, 0.82, 1.95, 2.85, 0.12, 0.20, {
      top: '#5c4839', front: '#4a382b', right: '#3b2c21', left: '#4a382b', back: '#3b2c21', bottom: '#3b2c21'
    }, '#1e1105', 1.0);

    // Left Armrest Cushion:
    addBox3DRot(0.1, 0.82, 1.95, 2.08, 0.20, 0.58, {
      top: '#ccd2dd', front: '#b1b9c9', right: '#98a2b5', left: '#b1b9c9', back: '#98a2b5', bottom: '#98a2b5'
    }, '#1f2a3a', 1.0);

    // Right Armrest Cushion:
    addBox3DRot(0.1, 0.82, 2.72, 2.85, 0.20, 0.58, {
      top: '#ccd2dd', front: '#b1b9c9', right: '#98a2b5', left: '#b1b9c9', back: '#98a2b5', bottom: '#98a2b5'
    }, '#1f2a3a', 1.0);

    // Plush seat cushion 1 (Left seat cushion):
    addBox3DRot(0.18, 0.80, 2.08, 2.40, 0.20, 0.44, {
      top: '#d8dee9', front: '#bdc8db', right: '#a3b1cb', left: '#bdc8db', back: '#a3b1cb', bottom: '#a3b1cb'
    }, '#1f2a3a', 1.0);

    // Plush seat cushion 2 (Right seat cushion):
    addBox3DRot(0.18, 0.80, 2.40, 2.72, 0.20, 0.44, {
      top: '#d8dee9', front: '#bdc8db', right: '#a3b1cb', left: '#bdc8db', back: '#a3b1cb', bottom: '#a3b1cb'
    }, '#1f2a3a', 1.0);

    // Main Comfort Backrest Support:
    addBox3DRot(0.1, 0.30, 1.95, 2.85, 0.44, 0.86, {
      top: '#c8cbd1', front: '#aeb3bf', right: '#989eb0', left: '#aeb3bf', back: '#989eb0', bottom: '#989eb0'
    }, '#1f2a3a', 1.0);

    // Cozy Leaning Pillow 1:
    addBox3DRot(0.25, 0.35, 2.12, 2.36, 0.42, 0.66, {
      top: '#f0ad4e', front: '#e09839', right: '#ca8121', left: '#e09839', back: '#ca8121', bottom: '#ca8121'
    }, '#583a0e', 0.8);

    // Cozy Leaning Pillow 2:
    addBox3DRot(0.25, 0.35, 2.44, 2.68, 0.42, 0.66, {
      top: '#f0ad4e', front: '#e09839', right: '#ca8121', left: '#e09839', back: '#ca8121', bottom: '#ca8121'
    }, '#583a0e', 0.8);


    // --- REGAL/SHELVING BOOKCASE UNIT (Placed on Wall Y=0 / Left wall axis) ---
    // Wooden Backplate:
    addBox3DRot(2.0, 2.8, 0.0, 0.05, 0, 1.90, {
      top: '#3b2b1d', front: '#302216', right: '#22170e', left: '#302216', back: '#22170e', bottom: '#22170e'
    }, '#1e130a', 1.0);

    // Left Shelf frame:
    addBox3DRot(2.0, 2.06, 0.05, 0.33, 0, 1.90, {
      top: '#4a3726', front: '#3d2d1e', right: '#2e2114', left: '#3d2d1e', back: '#2e2114', bottom: '#2e2114'
    }, '#1e130a', 1.0);

    // Right Shelf frame:
    addBox3DRot(2.74, 2.80, 0.05, 0.33, 0, 1.90, {
      top: '#4a3726', front: '#3d2d1e', right: '#2e2114', left: '#3d2d1e', back: '#2e2114', bottom: '#2e2114'
    }, '#1e130a', 1.0);

    // Top Cover Board:
    addBox3DRot(2.0, 2.8, 0.0, 0.33, 1.84, 1.90, {
      top: '#523e2b', front: '#443322', right: '#342517', left: '#443322', back: '#342517', bottom: '#342517'
    }, '#1e130a', 1.0);

    // Bottom Base Board:
    addBox3DRot(2.06, 2.74, 0.05, 0.32, 0, 0.12, {
      top: '#523e2b', front: '#443322', right: '#342517', left: '#443322', back: '#342517', bottom: '#342517'
    }, '#1e130a', 1.0);

    // Shelf Level 2 Platform (Y and X center dividers):
    addBox3DRot(2.06, 2.74, 0.05, 0.31, 0.65, 0.70, {
      top: '#523e2b', front: '#443322', right: '#342517', left: '#443322', back: '#342517', bottom: '#342517'
    }, '#1e130a', 1.0);

    // Shelf Level 3 Platform:
    addBox3DRot(2.06, 2.74, 0.05, 0.31, 1.25, 1.30, {
      top: '#523e2b', front: '#443322', right: '#342517', left: '#443322', back: '#342517', bottom: '#342517'
    }, '#1e130a', 1.0);

    // Drawers on Floor tier inside bookshelf:
    addBox3DRot(2.10, 2.38, 0.06, 0.30, 0.12, 0.60, {
      top: '#eec590', front: '#cc9e62', right: '#a2763f', left: '#cc9e62', back: '#a2763f', bottom: '#a2763f'
    }, '#1e130a', 0.8);
    addBox3DRot(2.42, 2.70, 0.06, 0.30, 0.12, 0.60, {
      top: '#eec590', front: '#cc9e62', right: '#a2763f', left: '#cc9e62', back: '#a2763f', bottom: '#a2763f'
    }, '#1e130a', 0.8);

    // Multicolored Books stacked on Level 2 shelf:
    addBox3DRot(2.10, 2.16, 0.08, 0.28, 0.70, 1.15, {
      top: '#e35f5f', front: '#c14545', right: '#963030', left: '#c14545', back: '#963030', bottom: '#963030'
    }, '#2d1111', 0.8);
    addBox3DRot(2.18, 2.24, 0.08, 0.28, 0.70, 1.12, {
      top: '#4fa1d8', front: '#3784ba', right: '#215f8a', left: '#3784ba', back: '#215f8a', bottom: '#215f8a'
    }, '#0d2230', 0.8);
    addBox3DRot(2.26, 2.32, 0.08, 0.28, 0.70, 1.18, {
      top: '#dfb15b', front: '#be9342', right: '#95712c', left: '#be9342', back: '#95712c', bottom: '#95712c'
    }, '#30220a', 0.8);
    addBox3DRot(2.34, 2.40, 0.08, 0.28, 0.70, 1.08, {
      top: '#5cb85c', front: '#449d44', right: '#357ebd', left: '#449d44', back: '#357ebd', bottom: '#357ebd'
    }, '#112b11', 0.8);

    // Decorative Witcher Alchemy Potter Potion bottle and Potion on top shelf (Level 3 shelf):
    addBox3DRot(2.18, 2.28, 0.08, 0.24, 1.30, 1.62, {
      top: '#2ca47e', front: '#187b5a', right: '#105e43', left: '#187b5a', back: '#105e43', bottom: '#105e43'
    }, '#082b20', 0.8);
    addBox3DRot(2.52, 2.62, 0.08, 0.24, 1.30, 1.55, {
      top: '#bfbfbf', front: '#a6a6a6', right: '#8c8c8c', left: '#a6a6a6', back: '#8c8c8c', bottom: '#8c8c8c'
    }, '#333333', 0.8);


    // --- 6. SOLID WOODEN STANDING TABLE (Polished centerpiece) ---
    addBox3DRot(1.1, 1.9, 1.1, 1.9, 0.67, 0.75, {
      top: '#a07d5d', front: '#624732', right: '#4b3524', left: '#624732', back: '#4b3524', bottom: '#4f3824'
    }, '#4f3824', 1.0);

    const tblLegs = [
      { x: 1.15, y: 1.15 },
      { x: 1.85, y: 1.15 },
      { x: 1.85, y: 1.85 },
      { x: 1.15, y: 1.85 }
    ];
    tblLegs.forEach((leg, idx) => {
      faces.push({
        type: 'custom',
        w_avg: getWRot(leg.x, leg.y) - 0.015,
        render: () => {
          const base = projectPointRot(leg.x, leg.y, 0);
          const top = projectPointRot(leg.x, leg.y, 0.67);
          const strokeWidth = 5.5 / getWRot(leg.x, leg.y);
          return (
            <line
              key={`table-leg-${idx}`}
              x1={base.x}
              y1={base.y}
              x2={top.x}
              y2={top.y}
              stroke={idx % 2 === 0 ? '#4f3824' : '#3d2b1c'}
              strokeWidth={Math.max(1.8, strokeWidth)}
              strokeLinecap="round"
              filter="url(#pencil-texture)"
            />
          );
        }
      });
    });


    // --- 7. BAR STOOL WITH ROTATING/SLIDING VANISHING PERSPECTIVE ---
    // Cushion Seat Solid Box:
    addStoolBox3D(1.45, 1.95, 0.45, 0.95, 0.42, 0.50, {
      top: '#7b5996', front: '#271833', right: '#1d1026', left: '#271833', back: '#1d1026', bottom: '#271833'
    }, '#3d1d4f', 1.0);

    const stoolLegs = [
      { x: 1.48, y: 0.48 },
      { x: 1.92, y: 0.48 },
      { x: 1.92, y: 0.92 },
      { x: 1.48, y: 0.92 }
    ];
    stoolLegs.forEach((leg, idx) => {
      faces.push({
        type: 'custom',
        w_avg: getStoolWRot(leg.x, leg.y) - 0.015,
        render: () => {
          const base = projectStoolPoint(leg.x, leg.y, 0);
          const top = projectStoolPoint(leg.x, leg.y, 0.42);
          const strokeWidth = 4.0 / getStoolWRot(leg.x, leg.y);
          return (
            <line
              key={`stool-leg-${idx}`}
              x1={base.x}
              y1={base.y}
              x2={top.x}
              y2={top.y}
              stroke={idx < 2 ? '#3d1d4f' : '#21102b'}
              strokeWidth={Math.max(1.4, strokeWidth)}
              strokeLinecap="round"
              filter="url(#pencil-texture)"
            />
          );
        }
      });
    });


    // --- 8. RED APPLE (TABLETOP FRUIT SET) ---
    faces.push({
      type: 'custom',
      w_avg: getWRot(1.5, 1.5) + 0.02,
      render: () => {
        const center = projectPointRot(1.5, 1.5, 0.75);
        const stemTop = projectPointRot(1.5, 1.5, 0.75 + 0.12);
        const leafTip = projectPointRot(1.53, 1.45, 0.75 + 0.14);
        return (
          <g key="apple-grp" stroke="#400b0b" strokeWidth="1" filter="url(#pencil-texture)">
            <ellipse cx={center.x} cy={center.y + 1} rx="9" ry="3.5" fill="#5c4d36" opacity="0.45" stroke="none" />
            <circle cx={center.x} cy={center.y - 4} r="8.5" fill="#d93b3b" />
            <path d={`M ${center.x - 4} ${center.y - 12} Q ${center.x} ${center.y - 10} ${center.x + 4} ${center.y - 12}`} fill="none" stroke="#a32121" strokeWidth="1.2" />
            <path d={`M ${center.x} ${center.y - 10} Q ${center.x + 4} ${center.y - 16} ${stemTop.x} ${stemTop.y}`} fill="none" stroke="#5a4225" strokeWidth="1.8" />
            <path d={`M ${center.x + 2} ${center.y - 13} Q ${center.x + 10} ${center.y - 17} ${leafTip.x} ${leafTip.y} Q ${center.x + 6} ${center.y - 11} ${center.x + 2} ${center.y - 13}`} fill="#4ca14c" />
          </g>
        );
      }
    });

    // Sort all faces: smallest w (farthest background) to largest w (front closest foreground)
    faces.sort((a, b) => a.w_avg - b.w_avg);
    return faces;
  }, [vp1, vp2, vp3, vp4, originX, originY, verticalTilt, cornersRot, stoolRot, roomRot, frontWallsMode]);

  // Derived Top/Bottom points for construction/rays under rotation
  const tableTopPts = useMemo(() => [
    projectPointRot(1.1, 1.1, 0.75),
    projectPointRot(1.9, 1.1, 0.75),
    projectPointRot(1.9, 1.9, 0.75),
    projectPointRot(1.1, 1.9, 0.75),
  ], [vp1, vp2, originX, originY, verticalTilt, roomRot]);

  const stoolTopPts = useMemo(() => [
    projectStoolPoint(1.45, 0.45, 0.50),
    projectStoolPoint(1.95, 0.45, 0.50),
    projectStoolPoint(1.95, 0.95, 0.50),
    projectStoolPoint(1.45, 0.95, 0.50),
  ], [vp1, vp2, vp3, vp4, originX, originY, verticalTilt, stoolRot, roomRot]);

  return (
    <div className="flex flex-col h-full w-full bg-kingfisher-dark text-kingfisher-surface font-sans overflow-hidden">
      {/* HEADER BAR */}
      <header className="h-14 border-b border-kingfisher-border bg-kingfisher-panel flex items-center justify-between px-4 shrink-0 z-50">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-2 -ml-2 text-kingfisher-muted hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 ml-2">
            <div className="w-8 h-8 bg-kingfisher-deep rounded-md flex items-center justify-center text-white shadow-md">
              <Layers className="w-5 h-5 text-kingfisher-warm" />
            </div>
            <div>
              <h1 className="font-semibold tracking-wide text-sm text-white leading-tight">
                Perspective Interactive Drafting Studio
              </h1>
              <p className="text-[10px] text-kingfisher-warm font-mono tracking-wider uppercase">
                3D Room & Independent Coordinate Space
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Theme Info Badge */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-kingfisher-panel border border-[#ffd700]/20 rounded-md">
            <span className="w-1.5 h-1.5 bg-[#ffd700] rounded-full animate-pulse" />
            <span className="text-[9px] font-bold text-[#ffd700] uppercase tracking-widest font-mono">
              Vector Projector Active
            </span>
          </div>
        </div>
      </header>

      {/* CORE WORKSPACE SPLITTER */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden relative">
        
        {/* LEFT DRAFTING PANEL & INTERACTIVE CANVAS */}
        <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-y-auto custom-scrollbar bg-black/15">
          {/* Main SVG Drafting Canvas */}
          <div className="w-full h-[525px] bg-[#fdfcf7] rounded-2xl border-2 border-kingfisher-border shadow-2xl relative select-none overflow-hidden" 
               style={{ backgroundImage: 'radial-gradient(#e4dfd2 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
            
            {/* Ink-wash top brand marker */}
            <div className="absolute top-4 left-4 pointer-events-none border border-neutral-300 bg-[#fbf9f2]/80 px-2.5 py-1.5 rounded-lg text-[10px] font-mono text-neutral-600 z-10">
              <span className="text-neutral-400">SHEET NO.</span> 01 &bull; PERSPECTIVE ROOM INTERIOR
            </div>

            {/* FLOATING ZOOM AND PAN ACCESSIBILITY TOOLBAR */}
            <div className="absolute top-4 right-4 bg-[#fbf9f2]/95 border border-neutral-300 p-1 rounded-xl flex items-center gap-1 backdrop-blur shadow-md z-10">
              <button 
                onClick={() => handleZoomButton('in')} 
                title="Zoom In"
                className="p-1.5 hover:bg-neutral-200 rounded-lg text-neutral-700 transition"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleZoomButton('out')} 
                title="Zoom Out"
                className="p-1.5 hover:bg-neutral-200 rounded-lg text-neutral-700 transition"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button 
                onClick={handleResetZoomPan} 
                title="Reset View"
                className="p-1.5 hover:bg-neutral-200 rounded-lg text-neutral-700 transition font-mono text-[9px] font-bold"
              >
                100%
              </button>
              <div className="w-px h-4 bg-neutral-300 mx-1" />
              <div className="text-[9px] font-mono font-bold text-neutral-600 px-1 select-none">
                {Math.round(zoom * 100)}%
              </div>
            </div>

            {/* SVG CANVAS */}
            <svg
              ref={canvasRef}
              className={`w-full h-full ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
            >
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#7887b2" />
                </marker>
                {/* Pencil Sketch Stroke Filter to emulate raw sketch */}
                <filter id="pencil-texture">
                  <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
                </filter>
              </defs>

              {/* ZOOM & PAN WRAPPER GROUP */}
              <g transform={`translate(${panX}, ${panY}) scale(${zoom})`}>

                {/* DRAW FLOOR GRID SPACES FIRST */}
                {showRoomGrid && (
                  <g stroke="#e2dcce" strokeWidth="0.8" strokeDasharray="3,3">
                    {floorGrids.map((line, idx) => (
                      <line key={idx} x1={line.p1.x} y1={line.p1.y} x2={line.p2.x} y2={line.p2.y} />
                    ))}
                  </g>
                )}

                {/* DRAFT HORIZON LINE */}
                <g filter="url(#pencil-texture)">
                  <line
                    className="cursor-ns-resize"
                    onMouseDown={(e) => handleMouseDown(e, 'horizon')}
                    x1={vpCenter.x - 1200 * uHat.x}
                    y1={vpCenter.y - 1200 * uHat.y}
                    x2={vpCenter.x + 1200 * uHat.x}
                    y2={vpCenter.y + 1200 * uHat.y}
                    stroke="#5175bf"
                    strokeWidth="1.8"
                    strokeDasharray={Math.abs(horizonTilt) > 0.5 ? "8,4" : "none"}
                  />
                </g>

                {/* VERTICAL AXIS REPRESENTATION LINE */}
                <line
                  x1={originX}
                  y1={originY - 250}
                  x2={originX}
                  y2={originY + 100}
                  stroke="#ababab"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />

                {/* CONSTRUCTION RADIAL CORNER LINES */}
                {showConstruction && (
                  <g stroke="#a69f8c" strokeWidth="0.6" strokeDasharray="2,2" opacity="0.6">
                    {/* Rays to VP1 from Room Corners */}
                    <line x1={vp1.x} y1={vp1.y} x2={cornersRot.c_L_0_0.x} y2={cornersRot.c_L_0_0.y} />
                    <line x1={vp1.x} y1={vp1.y} x2={cornersRot.c_L_0_H.x} y2={cornersRot.c_L_0_H.y} />
                    <line x1={vp1.x} y1={vp1.y} x2={cornersRot.c_0_L_0.x} y2={cornersRot.c_0_L_0.y} />
                    <line x1={vp1.x} y1={vp1.y} x2={cornersRot.c_0_L_H.x} y2={cornersRot.c_0_L_H.y} />

                    {/* Rays to VP2 from Room Corners */}
                    <line x1={vp2.x} y1={vp2.y} x2={cornersRot.c_0_L_0.x} y2={cornersRot.c_0_L_0.y} />
                    <line x1={vp2.x} y1={vp2.y} x2={cornersRot.c_0_L_H.x} y2={cornersRot.c_0_L_H.y} />
                    <line x1={vp2.x} y1={vp2.y} x2={cornersRot.c_L_0_0.x} y2={cornersRot.c_L_0_0.y} />
                    <line x1={vp2.x} y1={vp2.y} x2={cornersRot.c_L_0_H.x} y2={cornersRot.c_L_0_H.y} />

                    {/* Table points extending to primary VPs */}
                    {tableTopPts.map((p, i) => (
                      <g key={`table-ray-${i}`}>
                        <line x1={vp1.x} y1={vp1.y} x2={p.x} y2={p.y} stroke="#cc9550" opacity="0.4" />
                        <line x1={vp2.x} y1={vp2.y} x2={p.x} y2={p.y} stroke="#cc9550" opacity="0.4" />
                      </g>
                    ))}
                  </g>
                )}

                {/* SECONDARY ROTATED STOOL CONSTRUCTION LINES VP3 / VP4 */}
                {showStoolConstruction && (
                  <g stroke="#cc44bb" strokeWidth="0.6" strokeDasharray="2,3" opacity="0.65">
                    {stoolTopPts.map((p, i) => (
                      <g key={`stool-ray-${i}`}>
                        <line x1={vp3.x} y1={vp3.y} x2={p.x} y2={p.y} />
                        <line x1={vp4.x} y1={vp4.y} x2={p.x} y2={p.y} />
                      </g>
                    ))}
                  </g>
                )}

                {/* UNIFIED DEPTH SORTED HANDLER RENDER (Painter's Algorithm) */}
                {sortedFaces.map((face, idx) => {
                  if (face.type === 'polygon' && face.pts) {
                    return (
                      <path
                        key={`face-${idx}`}
                        d={toPointsPath(face.pts)}
                        fill={face.fill || 'none'}
                        stroke={face.stroke || 'none'}
                        strokeWidth={face.strokeWidth || 1}
                        opacity={face.opacity ?? 1}
                        strokeDasharray={face.strokeDasharray}
                        filter="url(#pencil-texture)"
                      />
                    );
                  } else if (face.type === 'custom' && face.render) {
                    return <React.Fragment key={`face-${idx}`}>{face.render()}</React.Fragment>;
                  }
                  return null;
                })}

                {/* DRAGGABLE CENTER ORIGIN POINT */}
                <circle
                  cx={originX}
                  cy={originY}
                  r="6"
                  className="cursor-pointer fill-[#ffd700] hover:fill-[#ffea6c] stroke-[#222] transition-colors"
                  onMouseDown={(e) => handleMouseDown(e, 'origin')}
                />

                {/* DRAGGABLE INDEPENDENT VANISHING POINTS */}
                {/* Left VP1 Indicator */}
                <g className="cursor-pointer select-none group" onMouseDown={(e) => handleMouseDown(e, 'vp1')}>
                  <circle cx={vp1.x} cy={vp1.y} r="18" fill="transparent" />
                  <circle cx={vp1.x} cy={vp1.y} r="6.2" fill="#d97706" className="stroke-white" strokeWidth="1.8" />
                  <circle cx={vp1.x} cy={vp1.y} r="11" fill="none" stroke="#d97706" strokeWidth="1" strokeDasharray="3,1" />
                  <line x1={vp1.x - 14} y1={vp1.y} x2={vp1.x + 14} y2={vp1.y} stroke="#d97706" strokeWidth="1" />
                  <line x1={vp1.x} y1={vp1.y - 14} x2={vp1.x} y2={vp1.y + 14} stroke="#d97706" strokeWidth="1" />
                </g>

                {/* Right VP2 Indicator */}
                <g className="cursor-pointer select-none group" onMouseDown={(e) => handleMouseDown(e, 'vp2')}>
                  <circle cx={vp2.x} cy={vp2.y} r="18" fill="transparent" />
                  <circle cx={vp2.x} cy={vp2.y} r="6.2" fill="#d97706" className="stroke-white" strokeWidth="1.8" />
                  <circle cx={vp2.x} cy={vp2.y} r="11" fill="none" stroke="#d97706" strokeWidth="1" strokeDasharray="3,1" />
                  <line x1={vp2.x - 14} y1={vp2.y} x2={vp2.x + 14} y2={vp2.y} stroke="#d97706" strokeWidth="1" />
                  <line x1={vp2.x} y1={vp2.y - 14} x2={vp2.x} y2={vp2.y + 14} stroke="#d97706" strokeWidth="1" />
                </g>

                {/* ROTATED STOOL VANISHING POSITION MARKS */}
                <g className="opacity-95 select-none pointer-events-none">
                  <circle cx={vp3.x} cy={vp3.y} r="4.2" fill="#ae00ff" stroke="#fff" strokeWidth="1" />
                  <circle cx={vp4.x} cy={vp4.y} r="4.2" fill="#ae00ff" stroke="#fff" strokeWidth="1" />
                </g>

                {/* CANVAS HUD TEXT ANNOTATIONS */}
                {showLabels && (
                  <g fill="#21201d" fontSize="9.5" fontWeight="bold" fontFamily="monospace" pointerEvents="none" className="select-none">
                    <text x={vp1.x} y={vp1.y - 18} textAnchor="middle" fill="#9e5600" fontSize="10.5">L-VP1 ({Math.round(vp1.x)}, {Math.round(vp1.y)})</text>
                    <text x={vp2.x} y={vp2.y - 18} textAnchor="middle" fill="#9e5600" fontSize="10.5">R-VP2 ({Math.round(vp2.x)}, {Math.round(vp2.y)})</text>
                    
                    <text x={vp3.x} y={vp3.y + 18} textAnchor="middle" fill="#780ba3">Stool VP3</text>
                    <text x={vp4.x} y={vp4.y + 18} textAnchor="middle" fill="#780ba3">Stool VP4</text>

                    {/* Camera Horizon labeling */}
                    <text x={vpCenter.x - 120 * uHat.x - 12 * vHat.x} y={vpCenter.y - 120 * uHat.y - 12 * vHat.y} 
                          transform={`rotate(${horizonTilt} ${vpCenter.x} ${vpCenter.y})`}
                          fill="#39548a" fontSize="10" letterSpacing="0.1em">--- DYNAMIC CAMERA HORIZON ---</text>

                    <text x={originX + 15} y={originY - 180} fill="#787771" fontSize="9" fontWeight="normal">
                      Vertical Axis Line ({90 - (90-verticalTilt)}&deg;)
                    </text>
                    
                    <text x={originX + 8} y={originY - 14} fill="#857008">Room Origin Corner</text>
                  </g>
                )}

              </g>
            </svg>

            {/* Instruction tooltip banner */}
            <div className="absolute bottom-4 left-4 right-4 bg-[#fbf9f2]/95 border border-amber-900/15 p-3 rounded-xl flex items-start gap-2 backdrop-blur shadow-md z-10">
              <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-neutral-800 font-medium leading-relaxed">
                  <strong>Interactive drafting upgrades:</strong> 
                  <br />
                  &bull; <strong>Zoom:</strong> Scroll your wheel or use the top-right zoom keys.
                  <br />
                  &bull; <strong>Slick Pan:</strong> Hold and drag the scene with your <strong className="text-amber-800">Middle Mouse Button</strong>.
                  <br />
                  &bull; <strong>Free VPs:</strong> Hold and drag <strong className="text-amber-700">L-VP1</strong> or <strong className="text-amber-700">R-VP2</strong> crosshairs <em>anywhere</em> independently! Everything updates in real-time with flawless depth sorted watertight 3D solids.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT CONTROL SIDEBAR AND PEDAGOGY DETAILS */}
        <aside className="w-full lg:w-96 bg-kingfisher-panel/95 border-l border-kingfisher-border flex flex-col p-6 shrink-0 overflow-y-auto custom-scrollbar">
          
          <div className="space-y-6">
            {/* 1. Educational Presets Selectors */}
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <Grid className="w-4 h-4 text-kingfisher-warm" />
                Perspective Presets (Pencil Cases)
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { id: 'standard', label: '1. Standard 2-VP' },
                  { id: 'rotated_vps', label: '2. Slid VP Axis' },
                  { id: 'rotated_horizon', label: '3. Rolled Horizon' },
                  { id: 'moved_horizon', label: '4. Elevated Camera' }
                ] as { id: PresetType; label: string }[]).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => applyPreset(p.id)}
                    className={`px-3 py-2 text-xs font-bold tracking-wide rounded-xl border text-left transition-all ${
                      activePreset === p.id && computedHorizonHeight === (p.id === 'moved_horizon' ? 150 : 240) && computedHorizonTilt === (p.id === 'rotated_horizon' ? -12 : 0)
                        ? 'bg-kingfisher-blue/25 text-white border-kingfisher-blue/80 shadow-md'
                        : 'bg-black/30 text-kingfisher-muted border-kingfisher-border/30 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-kingfisher-muted mt-2 leading-relaxed italic">
                {activePreset === 'standard' && "Case 1: Ground-level camera facing the main back corner of standard 2-point alignment."}
                {activePreset === 'rotated_vps' && "Case 2: Slid perspective angle. Center of interest moves sideways, shifting depth focal vectors."}
                {activePreset === 'rotated_horizon' && "Case 3: Rolled camera tilt. Tilted horizon line forces the physical vertical lines to skew corresponding to view-roll."}
                {activePreset === 'moved_horizon' && "Case 4: Extreme elevated (helicopter) angle. Horizon line moves up, changing the receding base plane surface area."}
              </p>
            </div>

            <div className="h-px bg-kingfisher-border/50" />

            {/* 2. Interactive Object Controller */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <RotateCw className="w-4 h-4 text-kingfisher-warm" />
                  Secondary Object Rotation
                </h3>
                <span className="text-xs font-mono font-bold text-kingfisher-warm bg-kingfisher-warm/15 px-2 py-0.5 rounded border border-kingfisher-warm/20">
                  {stoolRot}&deg;
                </span>
              </div>
              <p className="text-[11px] text-kingfisher-muted leading-relaxed mb-3">
                Rotate the purple bar stool. Because its walls are no longer parallel to the room's main axis, it "breaks" the room's grid, generating two unique vanishing points <strong>(VP3 &amp; VP4)</strong>.
              </p>
              <input
                type="range"
                min="0"
                max="360"
                value={stoolRot}
                onChange={(e) => setStoolRot(parseInt(e.target.value))}
                className="w-full accent-kingfisher-warm cursor-pointer"
              />
            </div>

            <div className="h-px bg-kingfisher-border/50" />

            {/* 3. Sliding Calibration Controls */}
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-kingfisher-warm" />
                Bidirectional Camera Tuner
              </h3>
              
              <div className="space-y-4">
                {/* Horizon Height Slider */}
                <div>
                  <div className="flex justify-between text-xs text-kingfisher-muted mb-1.5 font-medium">
                    <span>Horizon / Eye Height (Y)</span>
                    <span className="font-mono text-white">{computedHorizonHeight}px</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="450"
                    value={computedHorizonHeight}
                    onChange={(e) => updateVPsFromSliders({ height: parseInt(e.target.value) })}
                    className="w-full accent-kingfisher-blue cursor-pointer"
                  />
                </div>

                {/* Horizon Roll Slider */}
                <div>
                  <div className="flex justify-between text-xs text-kingfisher-muted mb-1.5 font-medium">
                    <span>Horizon Camera Roll (Tilt)</span>
                    <span className="font-mono text-white">{computedHorizonTilt}&deg;</span>
                  </div>
                  <input
                    type="range"
                    min="-60"
                    max="60"
                    value={computedHorizonTilt}
                    onChange={(e) => updateVPsFromSliders({ tilt: parseInt(e.target.value) })}
                    className="w-full accent-kingfisher-blue cursor-pointer"
                  />
                </div>

                {/* VP Interval distance slider */}
                <div>
                  <div className="flex justify-between text-xs text-kingfisher-muted mb-1.5 font-medium">
                    <span>Vanish Points Distance (X-spread)</span>
                    <span className="font-mono text-white">{computedVpDistance * 2}px</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="600"
                    value={computedVpDistance}
                    onChange={(e) => updateVPsFromSliders({ distance: parseInt(e.target.value) })}
                    className="w-full accent-kingfisher-blue cursor-pointer"
                  />
                </div>

                {/* Vertical Axis Slices Tilt */}
                <div>
                  <div className="flex justify-between text-xs text-kingfisher-muted mb-1.5 font-medium">
                    <span>Vertical Lines Angle (3rd VP simulation)</span>
                    <span className="font-mono text-white">{verticalTilt}&deg;</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="120"
                    value={verticalTilt}
                    onChange={(e) => setVerticalTilt(parseInt(e.target.value))}
                    className="w-full accent-kingfisher-blue cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-kingfisher-border/50" />

            {/* 4. Display Layer toggles */}
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">
                Visibility Filters
              </h3>
              <div className="space-y-1.5">
                {[
                  { state: showConstruction, setter: setShowConstruction, label: 'Show Room Projection Rays (VP1 & VP2)' },
                  { state: showStoolConstruction, setter: setShowStoolConstruction, label: 'Show Rotated Object Rays (VP3 & VP4)' },
                  { state: showRoomGrid, setter: setShowRoomGrid, label: 'Show Floor Unit Checker Grid' },
                  { state: showLabels, setter: setShowLabels, label: 'Show Workspace Canvas HUD Annotations' }
                ].map((toggle, idx) => (
                  <label key={idx} className="flex items-center gap-3 text-xs text-kingfisher-muted hover:text-white cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={toggle.state}
                      onChange={(e) => toggle.setter(e.target.checked)}
                      className="rounded border-kingfisher-border bg-black/45 text-kingfisher-blue focus:ring-opacity-50 accent-kingfisher-blue"
                    />
                    <span>{toggle.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="h-px bg-kingfisher-border/50" />

            {/* 5. Pedagogical Masterclass Section */}
            <div className="bg-kingfisher-deep/45 p-4 rounded-2xl border border-kingfisher-border/30">
              <h4 className="text-xs font-bold text-[#ffd700] uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#ffd700]" />
                Perspective Rule Core Blueprint
              </h4>
              <p className="text-[11px] text-kingfisher-muted leading-relaxed space-y-1">
                Any set of lines that are parallel in <strong>3D World Space</strong> MUST converge at a single, shared <strong>Vanishing Point (VP)</strong> on the screen.
              </p>
              <ul className="text-[10px] text-kingfisher-muted/80 list-disc list-inside mt-2 space-y-1">
                <li><strong className="text-white">Room walls, window, door, couch, table</strong>: follow baseline axis receding coordinates towards <span className="text-amber-500 font-bold">VP1</span> and <span className="text-amber-500 font-bold">VP2</span>.</li>
                <li><strong className="text-[#ae00ff] font-bold">Rotated Bar Stool</strong>: because it rotates by {stoolRot}&deg; relative to the room layout axis, its lines recede to <span className="text-purple-400 font-bold">VP3</span> and <span className="text-purple-400 font-bold">VP4</span>.</li>
                <li><strong className="text-white font-bold">Water-tight Solids</strong>: Solid objects are rendered in a fully depth-sorted array (Painter's Algorithm), guaranteeing perfect visual occlusion from any dynamic camera angle.</li>
              </ul>
            </div>

          </div>
        </aside>
      </div>
    </div>
  );
};
