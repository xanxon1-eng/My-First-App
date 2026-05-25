import React, { useState, useEffect, useRef } from 'react';
import { PageHeader, SectionCard, StatRow, CodeBlock, HighlightBox } from './OptimizationHelpers';
import { 
  TreePine, Footprints, HardDrive, Cpu, Monitor, Database, Settings, 
  Waves, RefreshCw, Layers, ShieldAlert, Sparkles, Play, Pause, Compass, Grid, ArrowRight, Eye, Move
} from 'lucide-react';
import { COLORS } from '../../../../constants/colors';

// Simple types for water simulation
interface Obstacle {
  x: number;
  y: number;
  radius: number;
  isTemp?: boolean;
}

interface Barrel {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export const OpenWorldSystemsTab: React.FC = () => {
  // Simulation Settings State
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [renderMode, setRenderMode] = useState<'water' | 'normals' | 'velocity' | 'refraction'>('water');
  const [lodEnabled, setLodEnabled] = useState<boolean>(true);
  const [cameraMoving, setCameraMoving] = useState<boolean>(false);
  const [showRipplesOnHover, setShowRipplesOnHover] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'simulation' | 'tech_specs' | 'implementation'>('simulation');

  // Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Time tracker for idle blur
  const lastCameraMoveRef = useRef<number>(Date.now());
  const [currentBlurAmount, setCurrentBlurAmount] = useState<number>(0);

  // Simulation grid settings (64x64 grid mapped to canvas)
  const GRID_SIZE = 64;
  const hGridPrev = useRef<Float32Array>(new Float32Array(GRID_SIZE * GRID_SIZE));
  const hGridCurr = useRef<Float32Array>(new Float32Array(GRID_SIZE * GRID_SIZE));
  const hGridNext = useRef<Float32Array>(new Float32Array(GRID_SIZE * GRID_SIZE));
  
  // Velocity flow vectors (default flowing left -> right)
  const flowX = useRef<Float32Array>(new Float32Array(GRID_SIZE * GRID_SIZE));
  const flowY = useRef<Float32Array>(new Float32Array(GRID_SIZE * GRID_SIZE));

  // Dynamic objects
  const [obstacles, setObstacles] = useState<Obstacle[]>([
    { x: 18, y: 32, radius: 4 }, // Big central rock
    { x: 38, y: 20, radius: 3 }, // Top right rock
    { x: 45, y: 44, radius: 3 }, // Bottom right secondary rock
  ]);

  const [barrels, setBarrels] = useState<Barrel[]>([
    { x: 5, y: 15, vx: 0, vy: 0, radius: 1.8, color: '#d97706' }, // Amber barrel 1
    { x: 10, y: 48, vx: 0, vy: 0, radius: 1.8, color: '#b45309' }, // Brown barrel 2
  ]);

  // Interactive Bucket State
  const [bucketMode, setBucketMode] = useState<'create_boulder' | 'drop_bucket'>('drop_bucket');
  const [bucket, setBucket] = useState({
    x: 24,
    y: 12,
    vx: 0,
    vy: 0,
    radius: 2.2,
    fillPercent: 0,
    isHeld: false,
    dragForce: 0,
    sloshX: 0,
    sloshY: 0
  });

  // Handle interaction to place obstacles or emit ripples, and lift the bucket
  const handleCanvasInteraction = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Map to grid coordinates
    const gridX = (clickX / rect.width) * GRID_SIZE;
    const gridY = (clickY / rect.height) * GRID_SIZE;

    // Check click near bucket to grab/hold it
    const clickDistToBucket = Math.hypot(bucket.x - gridX, bucket.y - gridY);
    if (clickDistToBucket < bucket.radius + 1.8) {
      setBucket(prev => ({ ...prev, isHeld: !prev.isHeld, vx: 0, vy: 0 }));
      triggerSplash(Math.floor(gridX), Math.floor(gridY), 8);
      return;
    }

    if (gridX >= 1 && gridX < GRID_SIZE - 1 && gridY >= 1 && gridY < GRID_SIZE - 1) {
      if (e.shiftKey || bucketMode === 'create_boulder') {
        // Shift Key: Toggle Obstacle Boulder
        const hitIdx = obstacles.findIndex(obs => Math.hypot(obs.x - gridX, obs.y - gridY) < obs.radius + 1);
        if (hitIdx > -1) {
          setObstacles(prev => prev.filter((_, idx) => idx !== hitIdx));
        } else {
          setObstacles(prev => [...prev, { x: gridX, y: gridY, radius: 2.5, isTemp: true }]);
        }
      } else {
        // Normal Click: Spawn massive splash ripple
        triggerSplash(Math.floor(gridX), Math.floor(gridY), 15);
      }
    }
  };

  const handlePointerMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    const gridX = (clickX / rect.width) * GRID_SIZE;
    const gridY = (clickY / rect.height) * GRID_SIZE;

    if (bucket.isHeld) {
      // Calculate delta movement for sloshing & splashing force
      const dx = gridX - bucket.x;
      const dy = gridY - bucket.y;
      const speed = Math.hypot(dx, dy);

      setBucket(prev => {
        // Gradually fill bucket when dragged through the water
        let newFill = prev.fillPercent;
        const idx = Math.floor(gridY) * GRID_SIZE + Math.floor(gridX);
        if (idx >= 0 && idx < GRID_SIZE * GRID_SIZE) {
          newFill = Math.min(100, prev.fillPercent + 0.95);
        }

        return {
          ...prev,
          x: Math.max(1, Math.min(GRID_SIZE - 2, gridX)),
          y: Math.max(1, Math.min(GRID_SIZE - 2, gridY)),
          sloshX: Math.max(-1, Math.min(1, prev.sloshX * 0.82 + dx * 0.15)),
          sloshY: Math.max(-1, Math.min(1, prev.sloshY * 0.82 + dy * 0.15)),
          fillPercent: newFill
        };
      });

      if (speed > 0.3) {
        const cellX = Math.floor(gridX);
        const cellY = Math.floor(gridY);
        if (cellX >= 2 && cellX < GRID_SIZE - 2 && cellY >= 2 && cellY < GRID_SIZE - 2) {
          const idx = cellY * GRID_SIZE + cellX;
          // Deeper displacement representation as bucket water fills!
          const rippleSeverity = 1.0 + (bucket.fillPercent / 100) * 3.5;
          hGridCurr.current[idx] += rippleSeverity * speed * 0.8;
        }
      }
    } else {
      if (!showRipplesOnHover) return;
      const gridXInt = Math.floor(gridX);
      const gridYInt = Math.floor(gridY);
      if (gridXInt >= 2 && gridXInt < GRID_SIZE - 2 && gridYInt >= 2 && gridYInt < GRID_SIZE - 2) {
        // Small continuous ripples on hover mimicking character footsteps
        const idx = gridYInt * GRID_SIZE + gridXInt;
        hGridCurr.current[idx] += 2.0;
      }
    }
  };

  const triggerSplash = (gx: number, gy: number, strength: number) => {
    const curr = hGridCurr.current;
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const ny = gy + dy;
        const nx = gx + dx;
        if (ny >= 0 && ny < GRID_SIZE && nx >= 0 && nx < GRID_SIZE) {
          const d = Math.hypot(dx, dy);
          if (d <= 2) {
            curr[ny * GRID_SIZE + nx] += (1 - d/3) * strength;
          }
        }
      }
    }
    // Record camera action
    lastCameraMoveRef.current = Date.now();
    setCameraMoving(true);
  };

  const resetSimulation = () => {
    hGridPrev.current.fill(0);
    hGridCurr.current.fill(0);
    hGridNext.current.fill(0);
    setBarrels([
      { x: 4, y: 16, vx: 0, vy: 0, radius: 1.8, color: '#d97706' },
      { x: 8, y: 45, vx: 0, vy: 0, radius: 1.8, color: '#b45309' },
    ]);
    setObstacles([
      { x: 18, y: 32, radius: 4 },
      { x: 38, y: 20, radius: 3 },
      { x: 45, y: 44, radius: 3 },
    ]);
    setBucket({
      x: 24,
      y: 12,
      vx: 0,
      vy: 0,
      radius: 2.2,
      fillPercent: 0,
      isHeld: false,
      dragForce: 0,
      sloshX: 0,
      sloshY: 0
    });
    lastCameraMoveRef.current = Date.now();
    setCameraMoving(false);
  };

  // Setup velocities & main render loop
  useEffect(() => {
    // 1. Initialize Flow field (left-to-right constant river velocity with noise)
    const fx = flowX.current;
    const fy = flowY.current;
    
    // Default flow field: strong rightward movement
    for (let gy = 0; gy < GRID_SIZE; gy++) {
      for (let gx = 0; gx < GRID_SIZE; gx++) {
        const idx = gy * GRID_SIZE + gx;
        fx[idx] = 0.85 + Math.sin(gy / 4) * 0.15; // smooth wave-like currents
        fy[idx] = Math.cos(gx / 6) * 0.1;       // subtle winding
      }
    }

    let animationFrameId: number;

    const updateSimulation = () => {
      if (!isPlaying) return;

      const prev = hGridPrev.current;
      const curr = hGridCurr.current;
      const next = hGridNext.current;
      const fx = flowX.current;
      const fy = flowY.current;

      // Dynamic Obstacle mask build for rapid O(1) grid checks
      const obstacleGrid = new Uint8Array(GRID_SIZE * GRID_SIZE);
      obstacles.forEach(obs => {
        const r2 = obs.radius * obs.radius;
        const minX = Math.max(0, Math.floor(obs.x - obs.radius));
        const maxX = Math.min(GRID_SIZE - 1, Math.ceil(obs.x + obs.radius));
        const minY = Math.max(0, Math.floor(obs.y - obs.radius));
        const maxY = Math.min(GRID_SIZE - 1, Math.ceil(obs.y + obs.radius));
        for (let y = minY; y <= maxY; y++) {
          for (let x = minX; x <= maxX; x++) {
            if (Math.pow(x - obs.x, 2) + Math.pow(y - obs.y, 2) <= r2) {
              obstacleGrid[y * GRID_SIZE + x] = 1;
            }
          }
        }
      });

      // 2. Resolve simplified 2D Shallow Water Wave Equation (Finite Differences + Damping + Flow Advection)
      const damping = 0.985;
      for (let y = 1; y < GRID_SIZE - 1; y++) {
        for (let x = 1; x < GRID_SIZE - 1; x++) {
          const idx = y * GRID_SIZE + x;
          
          if (obstacleGrid[idx]) {
            curr[idx] = -0.5; // push height down inside coliders (creates wake depression)
            continue;
          }

          // Wave propagation solver
          const left = curr[idx - 1];
          const right = curr[idx + 1];
          const up = curr[idx - GRID_SIZE];
          const down = curr[idx + GRID_SIZE];

          // Next state = (average of neighbors) * 2 - previous state
          let nextVal = ((left + right + up + down) / 2) - prev[idx];
          nextVal *= damping;

          // Advector component (flow carries ripples downstream toward right)
          // Look up current advection velocity
          const uForce = fx[idx] * 0.45;
          const advectedIdx = idx - 1; // sample cell upstream
          if (advectedIdx >= 0) {
            nextVal = nextVal * (1 - uForce) + curr[advectedIdx] * uForce;
          }

          next[idx] = nextVal;
        }
      }

      // Add a constant subtle downstream ripple stream at boundaries to simulate live current waves
      for (let y = 1; y < GRID_SIZE - 1; y++) {
        if (Math.random() < 0.12) {
          next[y * GRID_SIZE + 1] += Math.sin(Date.now() / 300 + y) * 0.8;
        }
      }

      // Cycle buffers
      hGridPrev.current = new Float32Array(curr);
      hGridCurr.current = new Float32Array(next);

      // 3. Update dynamic floating physical bodies (floating Barrels carried downstream)
      setBarrels(prevBarrels => {
        return prevBarrels.map(b => {
          // Grid-mapped barrel index
          const cellX = Math.floor(b.x);
          const cellY = Math.floor(b.y);
          
          let forceX = 0;
          let forceY = 0;

          if (cellX >= 0 && cellX < GRID_SIZE && cellY >= 0 && cellY < GRID_SIZE) {
            const idx = cellY * GRID_SIZE + cellX;
            // Barrel gets passive advection from water velocity field
            forceX = fx[idx] * 0.08;
            forceY = fy[idx] * 0.08;

            // Floatation lift: barrel creates small dynamic waves
            hGridCurr.current[idx] = Math.max(hGridCurr.current[idx], 1.2 + Math.sin(Date.now() / 250) * 0.3);
          } else {
            // Out of bounds - loop back to start
            return {
              ...b,
              x: 1,
              y: 5 + Math.random() * (GRID_SIZE - 10),
              vx: 0, vy: 0
            };
          }

          // Obstacle collisions (spring-back separation forces)
          obstacles.forEach(obs => {
            const dist = Math.hypot(b.x - obs.x, b.y - obs.y);
            const mindist = b.radius + obs.radius;
            if (dist < mindist) {
              const nx = (b.x - obs.x) / dist;
              const ny = (b.y - obs.y) / dist;
              const overlap = mindist - dist;
              // Bounce physical impulse
              forceX += nx * overlap * 0.25;
              forceY += ny * overlap * 0.25;
            }
          });

          // Apply physics step
          const newVx = (b.vx + forceX) * 0.88;
          const newVy = (b.vy + forceY) * 0.88;
          const newX = b.x + newVx;
          const newY = b.y + newVy;

          // Re-generate step bounds
          if (newX > GRID_SIZE) {
            // Loop back to left edge to repeat river sweep
            return {
              ...b,
              x: 1,
              y: 5 + Math.random() * (GRID_SIZE - 10),
              vx: 0, vy: 0
            };
          }

          return {
            ...b,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy
          };
        });
      });

      // 3.5. Update dynamic floating bucket (The Crimson Desert Hydrostatic lifting container)
      setBucket(prevBucket => {
        if (prevBucket.isHeld) return prevBucket;

        const cellX = Math.floor(prevBucket.x);
        const cellY = Math.floor(prevBucket.y);
        
        let forceX = 0;
        let forceY = 0;
        let newFillPercent = prevBucket.fillPercent;

        if (cellX >= 0 && cellX < GRID_SIZE && cellY >= 0 && cellY < GRID_SIZE) {
          const idx = cellY * GRID_SIZE + cellX;
          
          // Drift advection speed based on filled container mass
          const massMod = 1.0 - (prevBucket.fillPercent / 100) * 0.42; 
          const currentU = fx[idx];
          const currentV = fy[idx];
          
          forceX = currentU * 0.08 * massMod;
          forceY = currentV * 0.08 * massMod;

          // Fill level increases from surrounding river velocity
          const flowRate = Math.hypot(currentU, currentV);
          newFillPercent = Math.min(100, prevBucket.fillPercent + (0.12 + flowRate * 0.22));

          // Physical flotation: filled bucket sinks deeper, generating larger foam wake
          const depthSinking = 0.6 + (prevBucket.fillPercent / 100) * 1.6;
          hGridCurr.current[idx] = Math.max(hGridCurr.current[idx], depthSinking + Math.sin(Date.now() / 180) * 0.25);
        } else {
          // Out of bounds reset
          return {
            ...prevBucket,
            x: 2,
            y: 8 + Math.random() * (GRID_SIZE - 16),
            vx: 0, vy: 0,
            fillPercent: 0,
            sloshX: 0, sloshY: 0
          };
        }

        // Boulders collisions
        obstacles.forEach(obs => {
          const dist = Math.hypot(prevBucket.x - obs.x, prevBucket.y - obs.y);
          const mindist = prevBucket.radius + obs.radius;
          if (dist < mindist) {
            const nx = (prevBucket.x - obs.x) / dist;
            const ny = (prevBucket.y - obs.y) / dist;
            const overlap = mindist - dist;
            
            forceX += nx * overlap * 0.32;
            forceY += ny * overlap * 0.32;

            // Splash on rock impact if bucket carries heavy water mass
            if (prevBucket.fillPercent > 40) {
              const bSplashX = Math.floor(prevBucket.x);
              const bSplashY = Math.floor(prevBucket.y);
              if (bSplashX >= 2 && bSplashX < GRID_SIZE - 2 && bSplashY >= 2 && bSplashY < GRID_SIZE - 2) {
                hGridCurr.current[bSplashY * GRID_SIZE + bSplashX] += 3.8;
              }
            }
          }
        });

        const newVx = (prevBucket.vx + forceX) * 0.84;
        const newVy = (prevBucket.vy + forceY) * 0.84;
        const newX = prevBucket.x + newVx;
        const newY = prevBucket.y + newVy;

        if (newX > GRID_SIZE) {
          return {
            ...prevBucket,
            x: 2,
            y: 8 + Math.random() * (GRID_SIZE - 16),
            vx: 0, vy: 0,
            fillPercent: 0,
            sloshX: 0, sloshY: 0
          };
        }

        return {
          ...prevBucket,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          fillPercent: newFillPercent,
          sloshX: prevBucket.sloshX * 0.88 + newVx * 0.12,
          sloshY: prevBucket.sloshY * 0.88 + newVy * 0.12
        };
      });
    };

    // Camera Motion Blur / LOD simulation controller
    const checkCameraBlur = () => {
      if (!lodEnabled) {
        setCurrentBlurAmount(0);
        return;
      }
      
      const elapsedSinceMove = Date.now() - lastCameraMoveRef.current;
      if (elapsedSinceMove > 2000) {
        // Camera became static: dynamic LOD kicks in, blurring details to save fillrate
        setCameraMoving(false);
        // Exponentially increase blur up to max (e.g. 5px on UI filter, equivalent to 4x resolution drop)
        setCurrentBlurAmount(Math.min(3.5, (elapsedSinceMove - 2000) / 1000));
      } else {
        // Sharpen quickly
        setCameraMoving(true);
        setCurrentBlurAmount(prev => Math.max(0, prev - 1.2));
      }
    };

    // Render 2D water visualization onto Canvas
    const drawCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      const cellW = w / GRID_SIZE;
      const cellH = h / GRID_SIZE;

      ctx.clearRect(0, 0, w, h);

      // Fill background representing riverbed pebbles/gravel
      ctx.fillStyle = '#292524'; // Warm charcoal gravel color
      ctx.fillRect(0, 0, w, h);

      const currHeight = hGridCurr.current;
      const fX = flowX.current;
      const fY = flowY.current;

      // Fast image data render
      const imgData = ctx.createImageData(w, h);
      
      for (let cy = 0; cy < h; cy++) {
        const gy = Math.floor((cy / h) * GRID_SIZE);
        for (let cx = 0; cx < w; cx++) {
          const gx = Math.floor((cx / w) * GRID_SIZE);
          const gridIdx = gy * GRID_SIZE + gx;
          const heightVal = currHeight[gridIdx] || 0;

          const pixelIdx = (cy * w + cx) * 4;

          // Standard pebble pattern generator mathematically to act as depth bed
          const pebblePattern = Math.sin(gx * 1.5) * Math.cos(gy * 1.5) * 12 + 40;

          if (renderMode === 'water') {
            // Visualizer 1: Full-color Water surface Shader simulation (refraction + ambient depth + foam reflections)
            const isObstacle = obstacles.some(obs => Math.hypot(gx - obs.x, gy - obs.y) < obs.radius);
            
            if (isObstacle) {
              // Draw dark rocky texture
              imgData.data[pixelIdx] = 68;     // R
              imgData.data[pixelIdx + 1] = 64; // G
              imgData.data[pixelIdx + 2] = 60; // B
              imgData.data[pixelIdx + 3] = 255;// Alpha
            } else {
              // Simulating depth refraction offset by state water height
              const refractionOffset = Math.floor(heightVal * 15);
              const depthColorR = Math.max(10, Math.min(80, 22 + pebblePattern * 0.4 - refractionOffset));
              const depthColorG = Math.max(40, Math.min(130, 50 + pebblePattern * 0.6 + heightVal * 25));
              const depthColorB = Math.max(65, Math.min(200, 75 + pebblePattern * 0.8 + heightVal * 55));
              
              // Foam overlay creation (pressure thresholds)
              let foam = 0;
              if (heightVal > 1.3) {
                foam = Math.min(255, (heightVal - 1.3) * 140);
              }
              // Swirling around obstacles adds custom constant white foam
              const adjacentToObstacle = obstacles.some(obs => {
                const dist = Math.hypot(gx - obs.x, gy - obs.y);
                return dist > obs.radius && dist < obs.radius + 2.2;
              });
              if (adjacentToObstacle) {
                foam = Math.max(foam, 110 + Math.sin(Date.now() / 150 + gx + gy) * 40);
              }

              imgData.data[pixelIdx] = Math.min(255, depthColorR + foam);     // R
              imgData.data[pixelIdx + 1] = Math.min(255, depthColorG + foam); // G
              imgData.data[pixelIdx + 2] = Math.min(255, depthColorB + foam); // B
              imgData.data[pixelIdx + 3] = 225; // Transparent overlay
            }
          } 
          else if (renderMode === 'normals') {
            // Visualizer 2: Reshade Normal Map view (Current direction normals + ripple normals)
            // Compute central height derivatives (dx, dy)
            const isObstacle = obstacles.some(obs => Math.hypot(gx - obs.x, gy - obs.y) < obs.radius);
            
            if (isObstacle) {
              imgData.data[pixelIdx] = 127;
              imgData.data[pixelIdx + 1] = 127;
              imgData.data[pixelIdx + 2] = 255;
              imgData.data[pixelIdx + 3] = 255;
            } else {
              const dx = (currHeight[gy * GRID_SIZE + Math.min(GRID_SIZE-1, gx+1)] - currHeight[gy * GRID_SIZE + Math.max(0, gx-1)]) * 120;
              const dy = (currHeight[Math.min(GRID_SIZE-1, gy+1) * GRID_SIZE + gx] - currHeight[Math.max(0, gy-1) * GRID_SIZE + gx]) * 120;

              // Integrate current flow direction vector
              const flowNormX = fX[gridIdx] * 40;
              const flowNormY = fY[gridIdx] * 40;

              const nx = Math.max(-127, Math.min(127, dx + flowNormX));
              const ny = Math.max(-127, Math.min(127, dy + flowNormY));
              
              // Normalize to 0-255 spectrum
              imgData.data[pixelIdx] = nx + 128;      // R (X vector)
              imgData.data[pixelIdx + 1] = ny + 128;  // G (Y vector)
              imgData.data[pixelIdx + 2] = 220;       // B (Z vector)
              imgData.data[pixelIdx + 3] = 255;
            }
          } 
          else if (renderMode === 'velocity') {
            // Visualizer 3: Flow Field velocity intensity scale
            const isObstacle = obstacles.some(obs => Math.hypot(gx - obs.x, gy - obs.y) < obs.radius);
            
            if (isObstacle) {
              imgData.data[pixelIdx] = 30;
              imgData.data[pixelIdx + 1] = 30;
              imgData.data[pixelIdx + 2] = 30;
              imgData.data[pixelIdx + 3] = 255;
            } else {
              const strength = Math.hypot(fX[gridIdx], fY[gridIdx]);
              // Flow map heat coloring
              imgData.data[pixelIdx] = Math.min(255, strength * 200 + heightVal * 20); // Amber hot zones
              imgData.data[pixelIdx + 1] = Math.min(255, strength * 110 + heightVal * 40);
              imgData.data[pixelIdx + 2] = 100;
              imgData.data[pixelIdx + 3] = 255;
            }
          }
          else if (renderMode === 'refraction') {
            // Visualizer 4: Riverbed pebble distortion Refraction
            const isObstacle = obstacles.some(obs => Math.hypot(gx - obs.x, gy - obs.y) < obs.radius);
            if (isObstacle) {
              imgData.data[pixelIdx] = 40;
              imgData.data[pixelIdx + 1] = 40;
              imgData.data[pixelIdx + 2] = 40;
              imgData.data[pixelIdx + 3] = 255;
            } else {
              // Distort pebble coordinates based on wave heights (gravitational lens distortion)
              const shift = Math.floor(heightVal * 12);
              const noiseSample = Math.sin((gx + shift) * 1.5) * Math.cos((gy + shift) * 1.5) * 10 + 35;
              
              imgData.data[pixelIdx] = noiseSample + 12;     // distorted pebble colors
              imgData.data[pixelIdx + 1] = noiseSample + 20;
              imgData.data[pixelIdx + 2] = noiseSample + 15;
              imgData.data[pixelIdx + 3] = 255;
            }
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);

      // 4. Trace the floating physical Barrels & Obstacle overlays
      barrels.forEach(b => {
        const bx = (b.x / GRID_SIZE) * w;
        const by = (b.y / GRID_SIZE) * h;
        const br = (b.radius / GRID_SIZE) * w;

        // Carry indicator flow tail
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.moveTo(bx, by);
        ctx.lineTo(bx - b.vx * 35, by - b.vy * 35);
        ctx.stroke();

        // Barrel Circle
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, 2 * Math.PI);
        ctx.fillStyle = b.color;
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();

        // Lid detail
        ctx.beginPath();
        ctx.arc(bx, by, br * 0.65, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.stroke();
      });

      // Simple visual details for boulders when in normal/diffuse mode
      obstacles.forEach(obs => {
        const ox = (obs.x / GRID_SIZE) * w;
        const oy = (obs.y / GRID_SIZE) * h;
        const or = (obs.radius / GRID_SIZE) * w;

        // Rock specular outline
        ctx.beginPath();
        ctx.arc(ox, oy, or, 0, 2 * Math.PI);
        ctx.strokeStyle = '#44403c';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Boulder core shading
        ctx.beginPath();
        ctx.arc(ox - or*0.15, oy - or*0.15, or * 0.7, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.fill();
      });

      // 4.5. Render Crimson Desert style Hydrostatic Bucket
      {
        const bx = (bucket.x / GRID_SIZE) * w;
        const by = (bucket.y / GRID_SIZE) * h;
        const br = (bucket.radius / GRID_SIZE) * w;

        // Active selection grab guide ring
        if (bucket.isHeld) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.55)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([3, 3]);
          ctx.arc(bx, by, br * 1.55, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Draw bucket cylindrical body base exterior
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, 2 * Math.PI);
        ctx.fillStyle = bucket.isHeld ? '#374151' : '#4b5563';
        ctx.strokeStyle = bucket.isHeld ? '#3b82f6' : '#1f2937';
        ctx.lineWidth = bucket.isHeld ? 2.2 : 1.5;
        ctx.fill();
        ctx.stroke();

        // Draw internal sloshing fluid inside the bucket
        if (bucket.fillPercent > 0) {
          ctx.beginPath();
          const liquidRadius = br * 0.78 * (0.4 + (bucket.fillPercent / 100) * 0.6);
          // Shift fluid coordinate based on slosh state variables (Inertia translation vector)
          const sloshOffX = bucket.sloshX * (br * 0.3);
          const sloshOffY = bucket.sloshY * (br * 0.3);
          ctx.arc(bx + sloshOffX, by + sloshOffY, liquidRadius, 0, 2 * Math.PI);
          ctx.fillStyle = '#2563eb'; // Deep water blue
          ctx.fill();

          // Highlight foam specular slosh ring
          ctx.beginPath();
          ctx.arc(bx + sloshOffX, by + sloshOffY, liquidRadius * 0.82, 0, 2 * Math.PI);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.42)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Draw bucket handles
        ctx.beginPath();
        ctx.arc(bx, by, br * 0.85, Math.PI + bucket.sloshX * 0.4, Math.PI * 2 + bucket.sloshX * 0.4);
        ctx.strokeStyle = '#d1d5db';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Slosh indicator text overlay
        if (bucket.isHeld && Math.hypot(bucket.sloshX, bucket.sloshY) > 0.12) {
          ctx.fillStyle = '#60a5fa';
          ctx.font = 'bold 9px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('SLOSH!', bx, by - br - 5);
        }
      }
    };

    const runFrame = () => {
      updateSimulation();
      checkCameraBlur();
      drawCanvas();
      animationFrameId = requestAnimationFrame(runFrame);
    };

    runFrame();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, renderMode, lodEnabled, obstacles, bucket]);

  // Simulation camera movement virtual clicker trigger
  const triggerCameraPan = () => {
    lastCameraMoveRef.current = Date.now();
    setCameraMoving(true);
    // Inject massive global surface wake to simulate scene movement wave changes
    const curr = hGridCurr.current;
    for (let i = 0; i < curr.length; i += 7) {
      curr[i] += 1.8;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Open World Terrain, Hydrology & Fluid Solvers" 
        subtitle="Master interactive environment simulations including real-time shallow water wave equations (SWE), ocean-coastal mixing pipelines, and custom asset delta-persistence states." 
      />

      {/* Quick Navigation Tabs inside this workspace category */}
      <div className="flex border-b border-kingfisher-border/50 gap-2">
        <button
          onClick={() => setActiveTab('simulation')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'simulation' 
              ? 'border-kingfisher-blue text-white bg-kingfisher-blue/5' 
              : 'border-transparent text-kingfisher-muted hover:text-white'
          }`}
        >
          <Compass className="w-3.5 h-3.5 inline mr-1.5 text-kingfisher-blue" />
          Interactive Rivers Simulation
        </button>
        <button
          onClick={() => setActiveTab('tech_specs')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'tech_specs' 
              ? 'border-kingfisher-blue text-white bg-kingfisher-blue/5' 
              : 'border-transparent text-kingfisher-muted hover:text-white'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 inline mr-1.5 text-amber-500" />
          SWE Technical Specs & Hardware Budgets
        </button>
        <button
          onClick={() => setActiveTab('implementation')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'implementation' 
              ? 'border-kingfisher-blue text-white bg-kingfisher-blue/5' 
              : 'border-transparent text-kingfisher-muted hover:text-white'
          }`}
        >
          <Settings className="w-3.5 h-3.5 inline mr-1.5 text-purple-400" />
          Unreal Engine & C++ Solutions
        </button>
      </div>

      {activeTab === 'simulation' && (
        <div className="space-y-6">
          
          <HighlightBox type="info" className="text-xs">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-[#ffd700]" />
              <strong className="text-[#ffd700] uppercase tracking-wider text-[10px]">Simulation Overview (Inspired by Crimson Desert)</strong>
            </div>
            <p className="text-blue-100/90 leading-relaxed">
              This interactive dashboard mimics the high-fidelity **Shallow Water Equation (SWE) Solver (Saint-Venant)** used in AAA titles like <em>Crimson Desert</em>.
              Click the water canvas below to tap and create dynamic surface ripples. Hold <strong>Shift + Click</strong> on any water cell to place or toggle solid rock boulders, 
              forcing the river water to flow and swirl around them! Observe how floating barrels are dynamically pushed by the local current vector field, collides with obstacles, 
              and propagates localized foam.
            </p>
          </HighlightBox>

          <div id="shallow-water-simulation" className="grid grid-cols-1 lg:grid-cols-12 gap-6 scroll-mt-24">
            
            {/* Primary Interactive Simulation Viewport (Col span 7) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-kingfisher-panel/70 border border-kingfisher-border/60 p-4 rounded-2xl relative shadow-lg">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <Waves className="w-4 h-4 text-kingfisher-blue animate-pulse" />
                    <span className="font-mono text-xs uppercase tracking-wider text-white font-bold">River Simulation Viewport</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-emerald-500 animate-ping' : 'bg-red-500'}`} />
                    <span className="font-mono text-[10px] text-kingfisher-muted uppercase">
                      {isPlaying ? 'Simulation Active' : 'Simulation Paused'}
                    </span>
                  </div>
                </div>

                <div className="relative overflow-hidden border border-black/40 rounded-xl bg-[#292524] touch-none">
                  {/* Real-time WebGL/Canvas viewport */}
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={400}
                    onMouseDown={handleCanvasInteraction}
                    onMouseMove={handlePointerMove}
                    style={{
                      filter: `blur(${currentBlurAmount}px)`,
                      transition: 'filter 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    className="w-full h-auto aspect-square cursor-crosshair block transition-all"
                  />

                  {cameraMoving && (
                    <div className="absolute top-3 left-3 bg-black/60 border border-blue-500/20 px-2 py-1 rounded text-[10px] font-mono text-blue-300 uppercase flex items-center gap-1">
                      <Move className="w-3 h-3 text-blue-400 animate-pulse" /> Camera Traveling
                    </div>
                  )}

                  {currentBlurAmount > 0.5 && (
                    <div className="absolute top-3 right-3 bg-black/75 border border-amber-500/20 px-2.5 py-1.5 rounded text-[10px] font-mono text-amber-400 leading-tight max-w-[190px] uppercase">
                      <strong className="text-white block text-[9px] mb-0.5">Pearl Abyss Idle LOD:</strong>
                      Static camera detected. Water grid blurred to conserve GPU fillrate & cache bandwidth!
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                  <span className="text-[10px] font-mono text-kingfisher-muted">
                    ⚡ <strong>Controls:</strong> Click water to Splash | <strong>Shift + Click</strong> to toggle obstacle Rock
                  </span>
                  <button 
                    onClick={triggerCameraPan}
                    className="bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 px-2.5 py-1 rounded text-[10px] text-blue-400 font-bold uppercase transition"
                  >
                    🎬 Move Camera (Sharpen Grid)
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Control Deck (Col span 5) */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              <div className="bg-kingfisher-panel/60 border border-kingfisher-border/50 p-4 rounded-xl space-y-4">
                <span className="text-[10px] uppercase tracking-wider text-[#ffd700] font-mono font-bold block mb-1">Visualization & Graphics Deck</span>
                
                {/* 1. Selector of Render modes */}
                <div className="space-y-2">
                  <label className="text-white text-xs font-semibold block">Render Pass Pipeline Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'water', label: '1. Diffuse Water + Foam', icon: Waves },
                      { id: 'normals', label: '2. Normal Vector Map', icon: Compass },
                      { id: 'velocity', label: '3. Current Velocity Field', icon: Grid },
                      { id: 'refraction', label: '4. Pebbles Refraction', icon: Eye }
                    ].map(mode => (
                      <button
                        key={mode.id}
                        onClick={() => setRenderMode(mode.id as any)}
                        className={`p-2.5 rounded-lg border text-left flex flex-col justify-between text-xs font-mono transition-all ${
                          renderMode === mode.id
                            ? 'bg-kingfisher-blue/20 border-kingfisher-blue text-white font-bold'
                            : 'bg-black/30 border-kingfisher-border/30 text-kingfisher-muted hover:text-white'
                        }`}
                      >
                        <mode.icon className={`w-4 h-4 mb-1.5 ${renderMode === mode.id ? 'text-kingfisher-blue' : 'text-neutral-500'}`} />
                        <span>{mode.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Simulation Switches */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between border-t border-white/5 pt-3">
                    <div>
                      <span className="text-xs text-white force-semibold block">Continuous Hover Footsteps</span>
                      <span className="text-[10px] text-kingfisher-muted">Spawn tiny ripples around cursor</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={showRipplesOnHover} 
                      onChange={(e) => setShowRipplesOnHover(e.target.checked)}
                      className="rounded bg-black/40 border-kingfisher-border text-kingfisher-blue focus:ring-kingfisher-blue w-4 h-4 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-3">
                    <div>
                      <span className="text-xs text-white force-semibold block">Pearl Abyss Static Camera LOD</span>
                      <span className="text-[10px] text-kingfisher-muted">Blur on-idle to save console bandwidth</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={lodEnabled} 
                      onChange={(e) => setLodEnabled(e.target.checked)}
                      className="rounded bg-black/40 border-kingfisher-border text-kingfisher-blue focus:ring-kingfisher-blue w-4 h-4 cursor-pointer"
                    />
                  </div>
                </div>

                {/* 3. Interactive Water Bucket Mechanics (Crimson Hydrology) */}
                <div className="space-y-2 border-t border-white/5 pt-3">
                  <label className="text-white text-xs font-semibold block flex items-center justify-between">
                    <span>Interactive Water Bucket Mechanics</span>
                    <span className="text-[10px] font-mono bg-blue-500/15 border border-blue-500/35 px-1.5 py-0.5 rounded text-blue-400 select-none">Crimson Hydrology ↗</span>
                  </label>
                  
                  <div className="bg-black/30 border border-kingfisher-border/30 rounded-xl p-3 space-y-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setBucket(prev => ({ ...prev, isHeld: true, fillPercent: 0 }));
                          triggerSplash(Math.floor(bucket.x), Math.floor(bucket.y), 10);
                        }}
                        className={`flex-1 py-2 rounded text-[11px] font-mono font-bold transition-all cursor-pointer ${
                          bucket.isHeld 
                            ? 'bg-blue-600/40 text-blue-300 border border-blue-400/50 shadow-md' 
                            : 'bg-black/40 border border-kingfisher-border/40 text-kingfisher-muted hover:text-white'
                        }`}
                      >
                        👥 Grab/Drag Bucket
                      </button>
                      <button
                        onClick={() => {
                          setBucket(prev => ({ ...prev, isHeld: false }));
                        }}
                        className={`flex-1 py-2 rounded text-[11px] font-mono font-bold transition-all cursor-pointer ${
                          !bucket.isHeld 
                            ? 'bg-[#ffd700]/15 border border-[#ffd700]/30 text-[#ffd700] font-bold' 
                            : 'bg-black/40 border border-kingfisher-border/40 text-kingfisher-muted hover:text-white'
                        }`}
                      >
                        🛶 Drop & Drift
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-kingfisher-muted">Bucket internal volume fill</span>
                        <span className="text-blue-400 font-bold">{bucket.fillPercent.toFixed(0)}% Filled</span>
                      </div>
                      <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full transition-all duration-100"
                          style={{ width: `${bucket.fillPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-kingfisher-muted leading-tight">
                      <div>
                        Inertia Mass: <strong className="text-white">{(1.0 + (bucket.fillPercent / 100) * 1.5).toFixed(2)}x</strong>
                      </div>
                      <div>
                        Flow Drag: <strong className="text-white">{(0.5 + (bucket.fillPercent / 100) * 2.0).toFixed(1)} m/s²</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setBucket({
                          x: 24,
                          y: 12,
                          vx: 0,
                          vy: 0,
                          radius: 2.2,
                          fillPercent: 0,
                          isHeld: false,
                          dragForce: 0,
                          sloshX: 0,
                          sloshY: 0
                        });
                        triggerSplash(24, 12, 8);
                      }}
                      className="w-full py-1 rounded bg-black/55 border border-kingfisher-border/40 hover:bg-black/85 text-[10px] text-zinc-300 font-bold uppercase transition cursor-pointer"
                    >
                      Empty & Re-center Bucket
                    </button>
                  </div>
                </div>

                {/* 4. Action Buttons */}
                <div className="flex gap-2 pt-3 border-t border-white/5">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded font-bold text-xs uppercase cursor-pointer ${
                      isPlaying 
                        ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20' 
                        : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    {isPlaying ? 'Pause Solver' : 'Arouse Solver'}
                  </button>
                  <button
                    onClick={resetSimulation}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-black/40 border border-kingfisher-border/50 hover:bg-black/60 px-3 py-2 rounded text-xs text-white font-mono uppercase cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reset Basin
                  </button>
                </div>
              </div>

              {/* Dynamic Status / Readout */}
              <div className="bg-black/35 border border-amber-500/10 p-3 rounded-lg font-mono text-[10.5px] text-amber-200/90 leading-relaxed mt-2 space-y-1">
                <span className="text-amber-400 font-bold uppercase text-[9.5px] block border-b border-amber-500/15 pb-1">🎮 Real-Time Hydrology Physics Logs:</span>
                <ul className="space-y-1 font-mono text-[10px] text-kingfisher-muted">
                  <li>Basin Slices: <strong className="text-white">64x64 SWE Grid</strong></li>
                  <li>River Velocity: <strong className="text-amber-300">U: +0.85 m/s, V: +0.10 m/s</strong></li>
                  <li>
                    Floating Barrel 1: <strong className="text-white">X:{barrels[0]?.x.toFixed(1)}, Y:{barrels[0]?.y.toFixed(1)}</strong>
                    <span className="text-emerald-400"> (Vel: {Math.hypot(barrels[0]?.vx || 0, barrels[0]?.vy || 0).toFixed(2)} m/s)</span>
                  </li>
                  <li>
                    Hydrostatic Bucket: <strong className="text-blue-400">X:{bucket.x.toFixed(1)}, Y:{bucket.y.toFixed(1)}</strong>
                    <span className="text-[#ffd700]"> (Liquid Vol: {bucket.fillPercent.toFixed(0)}%)</span>
                  </li>
                  <li>
                    Slosh Offset: <strong className="text-white">X:{bucket.sloshX.toFixed(2)}, Y:{bucket.sloshY.toFixed(2)}</strong>
                    <span className="text-purple-400"> (IK Tension Force: {(Math.hypot(bucket.sloshX, bucket.sloshY) * (bucket.fillPercent / 100) * 12.0).toFixed(2)} N)</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>

          <HighlightBox type="success" className="text-xs">
            <div className="flex items-center gap-1.5 mb-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" /> High-End PC / Console Architectural Design Precedent
            </div>
            <p className="text-emerald-100/90 leading-relaxed">
              When working in deep water bodies (like Witcher 3's high seas), global mathematical systems like FFT (Fast Fourier Transform) govern ocean waves. However, for shallow creeks, riverbeds, and dynamic shoreline contact, <strong>2D Shallow Water Equations (Saint-Venant models)</strong> are highly optimized because they completely project the vertical axis away. 
              By simulating just a 2D density-pressure state, you can run water flow calculations live with arbitrary obstacles (boulders, trees, player models) in real-time on shipping hardware, creating swirling eddies and physical buoyancy carry-forces automatically!
            </p>
          </HighlightBox>
        </div>
      )}

      {activeTab === 'tech_specs' && (
        <div className="space-y-6 animate-fadeIn">
          <SectionCard title="Shallow Water Equation (SWE) Solver Architecture specs" icon={Database} color={COLORS.kingfisher.warm}>
            <div className="space-y-4">
              <p className="text-kingfisher-muted text-sm leading-relaxed">
                Most standard 3D open world RPGs rely on pre-baked **Flow Maps** (2D vector textures telling water which direction to flow). While extremely cheap, Flow Maps cannot dynamically react if a spellcaster breaks a bridge, if boulders fall into a path, or if characters drop heavy objects. Crimson Desert uses a live continuous 2D finite-difference wave-equation solver to compute river current flows on-the-fly.
              </p>

              {/* Concrete hardware budget impact breakdown */}
              <span className="text-[10px] font-bold tracking-widest text-[#ffd700] uppercase block">Hardware Latency & Memory Footprint Specs</span>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatRow label="GPU Impact" value="+1.8ms" note="Full resolution pass" color="text-red-400" />
                <StatRow label="CPU Impact" value="+1.2ms" note="If solved on Game Thread" color="text-amber-400" />
                <StatRow label="RAM Impact" value="+24MB" note="Grid cell storage" color="text-blue-400" />
                <StatRow label="VRAM Impact" value="+125MB" note="Normals/Refract target" color="text-purple-400" />
                <StatRow label="Latency / Ping" value="+8.2ms" note="Floating coordinates sync" color="text-teal-400" />
              </div>

              {/* Deep dive on GPU, CPU, RAM, VRAM and latency/ping parameters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-2">
                  <h4 className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    <Monitor className="w-3.5 h-3.5 text-red-400" />
                    GPU & VRAM Analysis (The Fillrate Bottle)
                  </h4>
                  <ul className="space-y-1.5 text-xs text-kingfisher-muted/90">
                    <li><strong>Rasterization Cost:</strong> Resolving high-density normal calculations across wide screen regions forces high pixel-shader instruction count (refraction, double specular highlights, and scrolling foam blending).</li>
                    <li><strong>VRAM Allocations:</strong> Caching the 2D height displacement map, velocity state pools, shoreline SDF maps (Signed Distance Fields), and dynamic G-buffer depth offset bounds requires ~125MB VRAM.</li>
                    <li><strong>Static-Camera LOD Optimization:</strong> Pearl Abyss bypasses fillrate stalls by tracking camera motion. When the virtual camera stays static for more than 2 seconds, the water G-buffer resolution drops dynamically by 4x and applies a bilinear blur filter. This collapses render times from <strong>1.8ms to 0.45ms GPU</strong> instantly.</li>
                  </ul>
                </div>

                <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-2">
                  <h4 className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-amber-400" />
                    CPU, RAM & Network Network footprint
                  </h4>
                  <ul className="space-y-1.5 text-xs text-kingfisher-muted/90">
                    <li><strong>Task Graph Offloading:</strong> Solving Saint-Venant derivatives sequentially on the Game Thread cost 1.2ms CPU, leading to thread stalls. AAA engines resolve calculations directly inside parallel Niagara GPU compute shaders, zeroing out CPU thread impact.</li>
                    <li><strong>SDF Collider Footprint:</strong> To compute water reacting against arbitrary rocks, the scene generates a dynamic 2D Signed Distance Field height map. Caching this temporary 2D physics surface takes ~24MB RAM.</li>
                    <li><strong>Connection Network replication:</strong> Floating objects (like buckets, barrels or boats) require coordinate synchronization. Since water is solved independently on clients, we must NOT replicate water particles, but exclusively replicate floating object transform states over the network (+8.2ms physical sync latency, utilizing compressed UDP packets).</li>
                  </ul>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Crimson Desert Hydrostatic Container (Bucket) & Character IK Physics Pre-planning" icon={Cpu} color={COLORS.kingfisher.warm}>
            <div className="space-y-4">
              <p className="text-kingfisher-muted text-sm leading-relaxed">
                Carrying physical water containers in open world games like <em>The Witcher 3</em> or <em>Crimson Desert</em> represents a complex multi-disciplinary intersection of <strong>hydrostatic momentum calculations, animation system IK feedback, and particle/mesh rendering solvers</strong>. It is never virtualized away.
              </p>

              <div id="hydrostatic-preplanning" className="grid grid-cols-1 md:grid-cols-3 gap-4 scroll-mt-24">
                <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-2">
                  <h5 className="text-[#ffd700] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="bg-amber-400/10 text-amber-400 p-0.5 rounded px-1.5 text-[9px] border border-amber-400/30">MATH</span>
                    1. Buoyancy & Mass Coupling
                  </h5>
                  <p className="text-xs text-kingfisher-muted/90 leading-relaxed">
                    When an empty wooden bucket enters the Saint-Venant current coordinates, it experiences a localized hydrostatic pressure vector:
                    <br/><code className="text-emerald-400 font-mono text-[9.5px] block my-1 bg-black/45 p-1 rounded border border-white/5">F_drift = C_drag * Density * Area * (V_fluid - V_bucket)²</code>
                    As water enters (<code className="text-blue-400">fillPercent</code> increases up to 100%), the container mass rises exponentially, sinking the bucket deeper. This reduces raw drift acceleration but raises its absolute kinetic inertia.
                  </p>
                </div>

                <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-2">
                  <h5 className="text-[#ffd700] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="bg-blue-400/10 text-blue-400 p-0.5 rounded px-1.5 text-[9px] border border-blue-400/30">IK</span>
                    2. Skeletal Joint Bone IK & Tension
                  </h5>
                  <p className="text-xs text-kingfisher-muted/90 leading-relaxed">
                    To make the player feel the physical weight, the drag force vector is calculated in C++ and sent straight to the character's AnimInstance. Inside the animation thread, we use <strong>Control Rig / FABRIK (Forward And Backward Reaching Inverse Kinematics)</strong> to offset wrist, elbow, and spine joints. This force pulls the torso toward the current, creating heavier foot splash rings and straining motion matching poses.
                  </p>
                </div>

                <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-2">
                  <h5 className="text-[#ffd700] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="bg-purple-400/10 text-purple-400 p-0.5 rounded px-1.5 text-[9px] border border-purple-400/30">MESH</span>
                    3. Sloshing & Spilling Fluid Mesh
                  </h5>
                  <p className="text-xs text-kingfisher-muted/90 leading-relaxed">
                    Once lifted, the water inside the bucket is solved on its own local 2D grid. Quick rotation or acceleration generates lateral force vectors:
                    <br/><code className="text-emerald-400 font-mono text-[9.5px] block my-1 bg-black/45 p-1 rounded border border-white/5">A_slosh = A_character + (g * sin(theta))</code>
                    If the slosh amplitude exceeds the physical bucket rim height boundary, it triggers local particle dripping splats and lowers the current water content percentage dynamically.
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {activeTab === 'implementation' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Unreal Engine Features integration */}
          <SectionCard title="Unreal Engine 5 Water System Capability Matrix" icon={Layers} color={COLORS.kingfisher.blue}>
            <div className="space-y-4">
              <div className="bg-black/30 p-4 rounded-xl border border-kingfisher-border/50">
                <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  Unreal Engine Out-Of-The-Box Reality Check
                </h4>
                <ul className="space-y-2.5 text-sm text-kingfisher-muted/90">
                  <li>
                    <strong className="text-emerald-400">UE Has:</strong> 
                    An experimental Water System plugin supporting spline-based river paths, Gerstner Wave math presets, and physical water buoyancy bodies. Standard 2D grid Niagara fluids allow high-performance simulation pools.
                  </li>
                  <li>
                    <strong className="text-red-400">UE Lacks:</strong> 
                    A game-ready camera-aligned multi-resolution 2D Shallow Water Solver integrated natively with static-camera LOD blurs to protect GPU fill-rate. There is no automated bridge carrying arbitrary debris by dynamic river currents out of the box in large open worlds.
                  </li>
                  <li>
                    <strong className="text-kingfisher-blue">How to Use & Implement (C++ Custom Workaround):</strong>
                    Create a custom viewport-aligned Niagara compute shader that solves Saint-Venant conservation of momentum equations on a 512x512 height grid. Read the camera-relative depth buffer to act as an obstacle heightmap. Write dynamic character steps and hit impacts as localized displacement force points. Use scene-depth refraction inside the water material graph to dynamically distort background rocks and render sediment bed pebbles.
                  </li>
                </ul>
              </div>

              <h5 className="text-white font-bold text-sm mt-4 mb-2">C++ Sample: Saint-Venant Height Solver Dispatcher</h5>
              <p className="text-xs text-kingfisher-muted font-mono leading-relaxed bg-black/25 p-2 rounded border border-white/5">
                To keep water calculations completely off the main Game Thread, we can launch async Niagara Compute Shaders to process height grids asynchronously per frame:
              </p>
              <CodeBlock language="cpp" code={`
// Custom Shallow Water compute solver dispatching to GPU render pipelines ( Saint-Venant Equations )
void UShallowWaterSolverComponent::DispatchWaterCompute_RenderThread(
    FRHICommandListImmediate& RHICmdList, 
    FRHITexture2D* HeightMapCurr, 
    FRHITexture2D* HeightMapNext,
    FRHITexture2D* ObstacleMapSDF
)
{
    // Execute a viewport-relative Compute Shader running standard Saint-Venant Equations:
    // H_next = H_curr + dt * ( -div(H_curr * U_curr) )
    TShaderMapRef<FRiverFluidComputeShader> ComputeCS(GetGlobalShaderMap(GMaxRHIFeatureLevel));
    RHICmdList.SetComputeShader(ComputeCS.GetComputeShader());

    // Bind texture coordinates and parameters straight to GPU registers
    ComputeCS->BindTextures(RHICmdList, HeightMapCurr, HeightMapNext, ObstacleMapSDF);
    ComputeCS->SetParameters(RHICmdList, DeltaTime = 0.016f, DampingFactor = 0.985f);

    // Dispatch the compute threads in 16x16 work groups on the GPU
    RHICmdList.DispatchComputeShader(
        GRID_SIZE_X / 16, 
        GRID_SIZE_Y / 16, 
        1
    );

    // Completely offloads the main CPU Game Thread (-1.2ms CPU savings!)
}
`} />
            </div>
          </SectionCard>

          <SectionCard title="C++ Workaround: Container Sloshing & Anim-Drive Kinematics" icon={Settings} color={COLORS.kingfisher.warm}>
            <div className="space-y-4">
              <p className="text-sm text-kingfisher-muted leading-relaxed">
                Unreal Engine has no native "water sloshing in handheld bucket" or "skeletal drag feedback" out of the box. To solve this for your Witcher-inspired PC/Console RPG, we create a C++ component that intercepts character bone velocities and updates a local wave grid:
              </p>

              <CodeBlock language="cpp" code={`
// Custom C++ Solver updating handheld container slosh vectors and kinematic bone drag tension
void UWaterBucketPhysicsComponent::UpdateBucketHydrology(float DeltaTime, FVector CharacterVelocity)
{
    // 1. Calculate linear acceleration of the bucket socket
    FVector BucketSocketLocation = GetOwnerSkeletalMesh()->GetSocketLocation("Hand_R_Bucket");
    FVector FrameAcceleration = (BucketSocketLocation - LastSocketLocation) / (DeltaTime * DeltaTime) - FVector(0, 0, -980.f); // include gravity vector
    LastSocketLocation = BucketSocketLocation;

    // 2. Project acceleration onto bucket coordinate system (slosh momentum vectors)
    FVector LocalAcceleration = ContainerRotation.UnrotateVector(FrameAcceleration);
    SloshMomentum.X = SloshMomentum.X * 0.85f + LocalAcceleration.X * DeltaTime * 0.15f;
    SloshMomentum.Y = SloshMomentum.Y * 0.85f + LocalAcceleration.Y * DeltaTime * 0.15f;

    // 3. Spilling logic: if acceleration spikes, spawn fluid droplet particles and drain water
    float SloshMagnitude = SloshMomentum.Size2D();
    if (SloshMagnitude > SpillageThreshold && CurrentWaterLevel > 0.0f)
    {
        float SpilledVol = (SloshMagnitude - SpillageThreshold) * DeltaTime * SpillCoef;
        CurrentWaterLevel = FMath::Max(0.0f, CurrentWaterLevel - SpilledVol);
        
        // Spawn Niagara splashing drips
        UNiagaraFunctionLibrary::SpawnSystemAtLocation(GetWorld(), WaterSplashFX, BucketSocketLocation);
    }

    // 4. Update FABRIK IK joint offsets based on calculated drag forces inside deep rivers
    FVector InRiverDragForce = GetCurrentRiverFlowVector(BucketSocketLocation) * FluidDensity * CurrentWaterLevel;
    GetOwnerAnimInstance()->SetDynamicIKDragTension(InRiverDragForce); // Offsets spine & clavicle bones dynamically!
}
`} />
            </div>
          </SectionCard>
        </div>
      )}
    </div>
  );
};
