<template>
  <div class="w-full bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8 flex flex-col space-y-6 select-none relative" id="skills-bowl-container">
    <!-- Header with interactive explanation -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="space-y-1">
        <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] text-indigo-600 font-mono font-bold uppercase tracking-wider">
          Интерактивная песочница / Physics Sandbox
        </div>
        <h3 class="text-xl font-display font-extrabold text-slate-900">
          Стек технологий & Навыки
        </h3>
        <p class="text-xs text-slate-500 max-w-lg">
          Взаимодействуйте с чашей: хватайте и бросайте шары-навыки, наклоняйте чашу мышкой или встряхивайте её, чтобы увидеть физику в действии!
        </p>
      </div>

      <!-- Live Physics Controls -->
      <div class="flex items-center gap-2 flex-wrap text-xs">
        <button 
          @click="resetBalls" 
          class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
          title="Сбросить позиции шаров"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>Сбросить</span>
        </button>
        <button 
          @click="addChaos" 
          class="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold rounded-lg transition-colors cursor-pointer"
          title="Встряхнуть чашу"
        >
          <Sparkles class="w-3.5 h-3.5" />
          <span>Встряхнуть</span>
        </button>
      </div>
    </div>

    <!-- The Canvas Arena -->
    <div class="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[500px] bg-slate-50 border border-slate-200/60 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
      <canvas 
        ref="canvasRef"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseLeave"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
        class="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing touch-none"
      ></canvas>

      <!-- Watermark or instructions if idle -->
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none text-[10px] text-slate-400 font-mono font-bold tracking-widest uppercase flex items-center gap-2">
        <span>← Перетаскивайте чашу или шары →</span>
      </div>
    </div>

    <!-- Skills Legend -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs border-t border-slate-100">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-sky-400"></span>
        <div class="text-slate-600 font-medium">Winter: Back-end & SQL</div>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-emerald-400"></span>
        <div class="text-slate-600 font-medium">Spring: Front-end & UI</div>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-amber-400"></span>
        <div class="text-slate-600 font-medium">Summer: Real-time & High-load</div>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-orange-400"></span>
        <div class="text-slate-600 font-medium">Autumn: DevOps & CI/CD</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { RotateCcw, Sparkles } from 'lucide-vue-next';

interface SkillBall {
  label: string;
  category: 'winter' | 'spring' | 'summer' | 'autumn';
  color: string;
  textColor: string;
  radius: number;
  // Local coordinates (relative to bowl center)
  localX: number;
  localY: number;
  vx: number;
  vy: number;
  mass: number;
}

const canvasRef = ref<HTMLCanvasElement | null>(null);

// Skills database classified by seasons (optimized count to prevent overcrowding)
const rawSkills: Array<{ label: string; category: 'winter' | 'spring' | 'summer' | 'autumn' }> = [
  // Winter: Back-end / Systems
  { label: 'Postgres', category: 'winter' },
  { label: 'Node.js', category: 'winter' },
  { label: 'Docker', category: 'winter' },
  { label: 'SQL/NoSQL', category: 'winter' },
  { label: 'Security', category: 'winter' },
  { label: 'Linux', category: 'winter' },

  // Spring: Front-end / Design
  { label: 'Vue 3', category: 'spring' },
  { label: 'TS', category: 'spring' },
  { label: 'Tailwind', category: 'spring' },
  { label: 'UI/UX', category: 'spring' },
  { label: 'React', category: 'spring' },
  { label: 'Charts', category: 'spring' },

  // Summer: High-load / Real-time
  { label: 'WebSockets', category: 'summer' },
  { label: 'Redis', category: 'summer' },
  { label: 'Express', category: 'summer' },
  { label: 'Serverless', category: 'summer' },
  { label: 'CDN / Edge', category: 'summer' },

  // Autumn: Quality / CI-CD
  { label: 'CI/CD', category: 'autumn' },
  { label: 'Git/GitHub', category: 'autumn' },
  { label: 'Vite', category: 'autumn' },
  { label: 'Testing', category: 'autumn' },
  { label: 'Refactor', category: 'autumn' },
];

const colorPalette = {
  winter: { bg: '#38bdf8', text: '#0369a1' },  // sky-400, sky-700
  spring: { bg: '#34d399', text: '#047857' },  // emerald-400, emerald-700
  summer: { bg: '#fbbf24', text: '#b45309' },  // amber-400, amber-700
  autumn: { bg: '#fb923c', text: '#c2410c' }   // orange-400, orange-700
};

// Physics state
const balls = ref<SkillBall[]>([]);
const cupRotation = ref(0); // in radians
const cupRotVel = ref(0);   // velocity
const cupX = ref(0);        // absolute world center coordinates
const cupY = ref(0);
const lastCupX = ref(0);
const lastCupY = ref(0);

const cupRadius = ref(170);   // size of the bowl (radius of bottom semi-circle)
const cupWallHeight = ref(95); // height of straight side walls
const glassLidY = ref(-100);  // invisible top boundary to lock balls inside

const gravity = 0.35; // brisk gravity strength
const friction = 0.985; // extremely low air resistance for lively kinetic motion
const restitution = 0.28; // nice bouncy elasticity between balls
const wallRestitution = 0.25; // bouncing off cup walls

// Animation / Frame loop
let animationFrameId: number | null = null;

// Interaction states
let isDraggingBallIndex = -1;
let isRotatingCup = false;
let startDragAngle = 0;
let startCupRotation = 0;
let lastMouseLocalX = 0;
let lastMouseLocalY = 0;

// Setup skills and positions inside the bowl
const initBalls = () => {
  balls.value = rawSkills.map((skill, index) => {
    const palette = colorPalette[skill.category];
    
    // Significantly smaller scale radius based on text length to fit label perfectly without overcrowding
    const radius = Math.max(15, skill.label.length * 1.9 + 4);
    
    // Spawn balls in staggered rows inside the lower part of the cup
    const colCount = 5;
    const col = index % colCount;
    const row = Math.floor(index / colCount);
    
    const localX = -100 + col * 48 + (row % 2) * 12 + (Math.random() - 0.5) * 5;
    const localY = -35 + row * 32 + (Math.random() - 0.5) * 5;

    return {
      label: skill.label,
      category: skill.category,
      color: palette.bg,
      textColor: palette.text,
      radius,
      localX,
      localY,
      vx: 0,
      vy: 0,
      mass: radius * radius // mass is proportional to area
    };
  });
};

const resetBalls = () => {
  initBalls();
  cupRotation.value = 0;
  cupRotVel.value = 0;
};

// Shakes the bowl by applying random velocities to all balls and tilting it
const addChaos = () => {
  balls.value.forEach(ball => {
    ball.vx += (Math.random() - 0.5) * 15;
    ball.vy -= (Math.random() * 12 + 5);
  });
  cupRotVel.value += (Math.random() - 0.5) * 0.4;
};

// Physics core loop
const updatePhysics = () => {
  // 1. Wobble / Spring back rotation behavior when user is not manually rotating
  if (!isRotatingCup) {
    const springK = 0.05; // spring stiffness
    const damping = 0.15; // spring damper
    const rotForce = -springK * cupRotation.value - damping * cupRotVel.value;
    cupRotVel.value += rotForce;
    cupRotation.value += cupRotVel.value;
  }

  // Calculate cup absolute movement for inertial forces
  const dxCup = cupX.value - lastCupX.value;
  const dyCup = cupY.value - lastCupY.value;
  lastCupX.value = cupX.value;
  lastCupY.value = cupY.value;

  // 2. Local gravity vector based on cup rotation
  const localGravX = gravity * Math.sin(cupRotation.value);
  const localGravY = gravity * Math.cos(cupRotation.value);

  const totalBalls = balls.value.length;

  // Apply forces & integrate positions first
  for (let i = 0; i < totalBalls; i++) {
    const b = balls.value[i];
    if (i === isDraggingBallIndex) continue;

    // Apply gravity
    b.vx += localGravX;
    b.vy += localGravY;

    // Apply cup motion inertia
    b.vx -= dxCup * 0.12;
    b.vy -= dyCup * 0.12;

    // Apply air resistance/friction
    b.vx *= friction;
    b.vy *= friction;

    // Update position
    b.localX += b.vx;
    b.localY += b.vy;
  }

  // Multi-pass constraint solver (combines boundaries and ball-to-ball checks)
  // Re-evaluating multiple times per frame creates a highly stable stack that settles perfectly
  const solverSteps = 4;
  for (let step = 0; step < solverSteps; step++) {
    const R = cupRadius.value;
    const H = cupWallHeight.value;

    // A. Resolve boundaries
    for (let i = 0; i < totalBalls; i++) {
      const b = balls.value[i];
      if (i === isDraggingBallIndex) continue;

      // Bottom semi-circle
      if (b.localY >= 0) {
        const dist = Math.sqrt(b.localX * b.localX + b.localY * b.localY);
        const limit = R - b.radius;
        if (dist > limit) {
          const nx = b.localX / dist;
          const ny = b.localY / dist;
          b.localX = nx * limit;
          b.localY = ny * limit;

          // Velocity reflection along normal
          const vn = b.vx * nx + b.vy * ny;
          if (vn > 0) {
            b.vx -= vn * (1.0 + wallRestitution) * nx;
            b.vy -= vn * (1.0 + wallRestitution) * ny;
            // Additional rolling friction to damp boundary energy
            b.vx *= 0.94;
            b.vy *= 0.94;
          }
        }
      }

      // Straight walls (when above bottom center line, y < 0)
      if (b.localY < 0 && b.localY >= glassLidY.value) {
        // Left wall
        if (b.localX - b.radius < -R) {
          b.localX = -R + b.radius;
          if (b.vx < 0) b.vx = -b.vx * wallRestitution;
        }
        // Right wall
        if (b.localX + b.radius > R) {
          b.localX = R - b.radius;
          if (b.vx > 0) b.vx = -b.vx * wallRestitution;
        }
      }

      // Ceiling lid
      if (b.localY - b.radius < glassLidY.value) {
        b.localY = glassLidY.value + b.radius;
        if (b.vy < 0) b.vy = -b.vy * wallRestitution;
      }
    }

    // B. Resolve ball-to-ball collisions
    for (let i = 0; i < totalBalls; i++) {
      const b1 = balls.value[i];
      for (let j = i + 1; j < totalBalls; j++) {
        const b2 = balls.value[j];

        const dx = b2.localX - b1.localX;
        const dy = b2.localY - b1.localY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = b1.radius + b2.radius;

        if (dist < minDist && dist > 0.01) {
          const overlap = minDist - dist;
          const nx = dx / dist;
          const ny = dy / dist;

          const totalMass = b1.mass + b2.mass;
          // Soft positional correction factor to avoid extreme rigid pops
          const push = overlap * 0.92;

          if (i !== isDraggingBallIndex && j !== isDraggingBallIndex) {
            b1.localX -= nx * push * (b2.mass / totalMass);
            b1.localY -= ny * push * (b2.mass / totalMass);
            b2.localX += nx * push * (b1.mass / totalMass);
            b2.localY += ny * push * (b1.mass / totalMass);
          } else if (i === isDraggingBallIndex) {
            b2.localX += nx * push;
            b2.localY += ny * push;
          } else {
            b1.localX -= nx * push;
            b1.localY -= ny * push;
          }

          // Elastic impulse response
          const rvx = b2.vx - b1.vx;
          const rvy = b2.vy - b1.vy;
          const vn = rvx * nx + rvy * ny;

          if (vn < 0) {
            const impulse = -(1.0 + restitution) * vn / (1.0 / b1.mass + 1.0 / b2.mass);
            if (i !== isDraggingBallIndex) {
              b1.vx -= (impulse / b1.mass) * nx;
              b1.vy -= (impulse / b1.mass) * ny;
            }
            if (j !== isDraggingBallIndex) {
              b2.vx += (impulse / b2.mass) * nx;
              b2.vy += (impulse / b2.mass) * ny;
            }
          }
        }
      }
    }
  }

  // Deactivate extremely small movements (resting sleep) to guarantee ZERO jitter/shaking!
  for (let i = 0; i < totalBalls; i++) {
    const b = balls.value[i];
    if (i === isDraggingBallIndex) continue;

    const vel = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
    if (vel < 0.15) {
      // Exponentially degrade remaining energy to enforce static sleep gently
      b.vx *= 0.8;
      b.vy *= 0.8;
      if (vel < 0.03) {
        b.vx = 0;
        b.vy = 0;
      }
    }
  }
};

// Render Loop
const draw = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Position Cup in middle of canvas (shifted down slightly for aesthetic balance)
  cupX.value = canvas.width / 2;
  cupY.value = canvas.height / 2 + 10;

  ctx.save();
  // Transform canvas view to cup local system
  ctx.translate(cupX.value, cupY.value);
  ctx.rotate(cupRotation.value);

  const R = cupRadius.value;
  const H = cupWallHeight.value;

  // 1. Draw Glassy Cup Background Fill
  ctx.beginPath();
  // Start from top-left rim
  ctx.moveTo(-R, -H);
  // Down to top left of circle
  ctx.lineTo(-R, 0);
  // Semicircle bottom
  ctx.arc(0, 0, R, Math.PI, 0, true);
  // Up to top-right rim
  ctx.lineTo(R, -H);
  // Soft rounded lid closure visual
  ctx.quadraticCurveTo(0, -H - 12, -R, -H);
  ctx.fillStyle = 'rgba(241, 245, 249, 0.45)'; // elegant light slate glow
  ctx.fill();

  // Highlight glass effect gradient
  const glassGrad = ctx.createLinearGradient(-R, -H, R, R);
  glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
  glassGrad.addColorStop(0.5, 'rgba(226, 232, 240, 0.1)');
  glassGrad.addColorStop(1, 'rgba(148, 163, 184, 0.15)');
  ctx.fillStyle = glassGrad;
  ctx.fill();

  // 2. Draw Skills Balls
  balls.value.forEach((ball, idx) => {
    ctx.save();
    ctx.translate(ball.localX, ball.localY);

    // Ball Base Glow Shadow
    ctx.beginPath();
    ctx.arc(0, 3, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.08)';
    ctx.fill();

    // Ball Body
    ctx.beginPath();
    ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();

    // Draw stylish border around balls
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // Subtle gloss / 3D highlight arc
    ctx.beginPath();
    ctx.arc(0, 0, ball.radius, Math.PI * 1.1, Math.PI * 1.8);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Text Label Fitting
    ctx.fillStyle = ball.textColor;
    ctx.font = 'bold 10px monospace';
    if (ball.label.length > 8) {
      ctx.font = 'bold 9px monospace';
    }
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(ball.label, 0, 0);

    ctx.restore();
  });

  // 3. Draw Solid Cup Rim and Structure Overlays
  ctx.beginPath();
  ctx.moveTo(-R, -H);
  ctx.lineTo(-R, 0);
  ctx.arc(0, 0, R, Math.PI, 0, true);
  ctx.lineTo(R, -H);
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = '#cbd5e1'; // slate-300 outline
  ctx.stroke();

  // Draw Two Beautiful Handles for the Cup (Touch Targets)
  // Left Handle
  ctx.beginPath();
  ctx.arc(-R - 25, -20, 30, Math.PI * 0.6, Math.PI * 1.6, false);
  ctx.lineWidth = 4.5;
  ctx.strokeStyle = '#94a3b8'; // slate-400
  ctx.stroke();

  // Right Handle
  ctx.beginPath();
  ctx.arc(R + 25, -20, 30, Math.PI * 1.4, Math.PI * 0.4, false);
  ctx.lineWidth = 4.5;
  ctx.strokeStyle = '#94a3b8';
  ctx.stroke();

  // Styled Rim Accents
  ctx.beginPath();
  ctx.arc(-R, -H, 5, 0, Math.PI * 2);
  ctx.arc(R, -H, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#64748b'; // slate-500
  ctx.fill();

  // Semi-transparent Glass Highlight
  ctx.beginPath();
  ctx.moveTo(-R + 4, -H + 10);
  ctx.lineTo(-R + 4, -10);
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.restore();
};

// Physics animation trigger
const loop = () => {
  updatePhysics();
  draw();
  animationFrameId = requestAnimationFrame(loop);
};

// Canvas Resize Adjustments
const resizeCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const parent = canvas.parentElement;
  if (!parent) return;

  const rect = parent.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  // Responsive scale of the cup dimensions
  if (rect.width < 500) {
    cupRadius.value = Math.max(110, rect.width * 0.32);
    cupWallHeight.value = Math.max(65, rect.width * 0.18);
    glassLidY.value = -cupWallHeight.value - 5;
  } else {
    cupRadius.value = 175;
    cupWallHeight.value = 95;
    glassLidY.value = -100;
  }
};

// Coordinates Converter helper (Screen Absolute to Cup Local)
const getLocalCoordinates = (screenX: number, screenY: number): { lx: number; ly: number } => {
  const canvas = canvasRef.value;
  if (!canvas) return { lx: 0, ly: 0 };

  const rect = canvas.getBoundingClientRect();
  const mx = screenX - rect.left;
  const my = screenY - rect.top;

  // Translate to cup center absolute coordinates
  const dx = mx - cupX.value;
  const dy = my - cupY.value;

  // Rotate in inverse direction of cup angle to find local positions
  const cos = Math.cos(-cupRotation.value);
  const sin = Math.sin(-cupRotation.value);

  const lx = dx * cos - dy * sin;
  const ly = dx * sin + dy * cos;

  return { lx, ly };
};

// Mouse / Touch Event Handlers
const handleInputDown = (clientX: number, clientY: number) => {
  const { lx, ly } = getLocalCoordinates(clientX, clientY);

  // 1. Check if clicked a Skill Ball
  let clickedBallIdx = -1;
  for (let i = balls.value.length - 1; i >= 0; i--) {
    const ball = balls.value[i];
    const dx = lx - ball.localX;
    const dy = ly - ball.localY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < ball.radius) {
      clickedBallIdx = i;
      break;
    }
  }

  if (clickedBallIdx !== -1) {
    isDraggingBallIndex = clickedBallIdx;
    lastMouseLocalX = lx;
    lastMouseLocalY = ly;
  } else {
    // 2. Clicked cup background / rim to rotate/tilt the cup
    isRotatingCup = true;
    startCupRotation = cupRotation.value;
    
    // Calculate angle from center
    const canvas = canvasRef.value;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const mx = clientX - rect.left - cupX.value;
      const my = clientY - rect.top - cupY.value;
      startDragAngle = Math.atan2(my, mx);
    }
  }
};

const handleInputMove = (clientX: number, clientY: number) => {
  const { lx, ly } = getLocalCoordinates(clientX, clientY);

  if (isDraggingBallIndex !== -1) {
    const ball = balls.value[isDraggingBallIndex];
    
    // Update velocities based on movement speed
    ball.vx = (lx - ball.localX) * 0.45;
    ball.vy = (ly - ball.localY) * 0.45;
    
    // Keep ball strictly within cup bounds even during drag
    const R = cupRadius.value;
    const H = cupWallHeight.value;
    const padding = ball.radius + 1;

    let clampedX = lx;
    let clampedY = ly;

    if (clampedY >= 0) {
      const dist = Math.sqrt(clampedX * clampedX + clampedY * clampedY);
      const limit = R - padding;
      if (dist > limit) {
        clampedX = (clampedX / dist) * limit;
        clampedY = (clampedY / dist) * limit;
      }
    } else {
      clampedX = Math.max(-R + padding, Math.min(R - padding, clampedX));
      clampedY = Math.max(glassLidY.value + padding, clampedY);
    }

    ball.localX = clampedX;
    ball.localY = clampedY;

    lastMouseLocalX = lx;
    lastMouseLocalY = ly;
  } else if (isRotatingCup) {
    const canvas = canvasRef.value;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const mx = clientX - rect.left - cupX.value;
      const my = clientY - rect.top - cupY.value;
      
      const currentDragAngle = Math.atan2(my, mx);
      const deltaAngle = currentDragAngle - startDragAngle;

      // Limit cup rotation to ±65 degrees for optimal usability
      const targetRotation = Math.max(-1.1, Math.min(1.1, startCupRotation + deltaAngle));
      
      cupRotVel.value = targetRotation - cupRotation.value;
      cupRotation.value = targetRotation;
    }
  }
};

const handleInputUp = () => {
  isDraggingBallIndex = -1;
  isRotatingCup = false;
};

// Desktop Event Maps
const handleMouseDown = (e: MouseEvent) => {
  handleInputDown(e.clientX, e.clientY);
};
const handleMouseMove = (e: MouseEvent) => {
  handleInputMove(e.clientX, e.clientY);
};
const handleMouseUp = () => {
  handleInputUp();
};
const handleMouseLeave = () => {
  handleInputUp();
};

// Mobile Touch Event Maps
const handleTouchStart = (e: TouchEvent) => {
  if (e.touches.length > 0) {
    handleInputDown(e.touches[0].clientX, e.touches[0].clientY);
  }
};
const handleTouchMove = (e: TouchEvent) => {
  if (e.touches.length > 0) {
    handleInputMove(e.touches[0].clientX, e.touches[0].clientY);
  }
};
const handleTouchEnd = () => {
  handleInputUp();
};

// Initialization and Lifecycles
onMounted(() => {
  initBalls();
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Start animation loop
  loop();
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas);
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>

<style scoped>
canvas {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}
</style>
