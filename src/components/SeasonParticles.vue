<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { SeasonType } from '../types';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  rotation?: number;
  rotationSpeed?: number;
  swing?: number;
  swingSpeed?: number;
}

const props = withDefaults(
  defineProps<{
    season: SeasonType;
    intensity?: number;
    windSpeed?: number;
  }>(),
  {
    intensity: 1.0,
    windSpeed: 1.0,
  }
);

const canvasRef = ref<HTMLCanvasElement | null>(null);
const mouse = ref({ x: -1000, y: -1000, radius: 100 });
const particleCount = ref(0);

const handleMouseMove = (e: MouseEvent) => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  mouse.value.x = e.clientX - rect.left;
  mouse.value.y = e.clientY - rect.top;
};

const handleMouseLeave = () => {
  mouse.value.x = -1000;
  mouse.value.y = -1000;
};

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseleave', handleMouseLeave);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseleave', handleMouseLeave);
});

let animationId: number;
let particles: Particle[] = [];

const getParticleColor = (type: SeasonType) => {
  switch (type) {
    case 'winter': {
      const winterColors = [
        'rgba(255, 255, 255, 0.85)',
        'rgba(224, 242, 254, 0.75)',
        'rgba(186, 230, 253, 0.65)',
        'rgba(255, 255, 255, 0.95)',
      ];
      return winterColors[Math.floor(Math.random() * winterColors.length)];
    }
    case 'spring': {
      const springColors = [
        'rgba(251, 207, 232, 0.85)', // pink
        'rgba(244, 143, 177, 0.75)', // deeper pink
        'rgba(252, 231, 243, 0.9)',  // light pink
        'rgba(253, 244, 245, 0.8)',  // blossom white
      ];
      return springColors[Math.floor(Math.random() * springColors.length)];
    }
    case 'summer': {
      const summerColors = [
        'rgba(253, 224, 71, 0.6)',  // gold
        'rgba(251, 191, 36, 0.5)',  // amber
        'rgba(249, 115, 22, 0.4)',  // orange
        'rgba(254, 240, 138, 0.7)', // warm light yellow
      ];
      return summerColors[Math.floor(Math.random() * summerColors.length)];
    }
    case 'autumn': {
      const autumnColors = [
        'rgba(217, 119, 6, 0.75)',  // amber
        'rgba(194, 65, 12, 0.8)',   // rust red
        'rgba(180, 83, 9, 0.7)',    // deep gold
        'rgba(234, 179, 8, 0.65)',  // maple yellow
      ];
      return autumnColors[Math.floor(Math.random() * autumnColors.length)];
    }
  }
};

const initParticles = (canvas: HTMLCanvasElement) => {
  particles = [];
  const baseCount = props.season === 'winter' ? 80 : props.season === 'spring' ? 60 : props.season === 'summer' ? 50 : 55;
  const targetCount = Math.floor(baseCount * props.intensity);
  particleCount.value = targetCount;

  for (let i = 0; i < targetCount; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = props.season === 'winter' 
      ? Math.random() * 3.5 + 1.2 
      : props.season === 'spring' 
      ? Math.random() * 5 + 4
      : props.season === 'summer'
      ? Math.random() * 4 + 1.5
      : Math.random() * 10 + 6; // autumn leaves are larger

    // Speeds
    let speedX = 0;
    let speedY = 0;

    if (props.season === 'winter') {
      speedX = (Math.random() * 0.6 - 0.3) + (props.windSpeed * 0.15);
      speedY = Math.random() * 1.2 + 0.6;
    } else if (props.season === 'spring') {
      speedX = (Math.random() * 0.8 + 0.4) + (props.windSpeed * 0.2);
      speedY = Math.random() * 0.6 + 0.5;
    } else if (props.season === 'summer') {
      speedX = Math.random() * 0.4 - 0.2;
      speedY = -(Math.random() * 0.8 + 0.4); // float upwards
    } else { // autumn
      speedX = (Math.random() * 0.8 - 0.2) + (props.windSpeed * 0.3);
      speedY = Math.random() * 0.8 + 0.7;
    }

    particles.push({
      x,
      y,
      size,
      speedX,
      speedY,
      opacity: Math.random() * 0.6 + 0.2,
      color: getParticleColor(props.season),
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() * 0.03 - 0.015),
      swing: Math.random() * 15,
      swingSpeed: Math.random() * 0.02 + 0.01,
    });
  }
};

const drawLeaf = (ctx: CanvasRenderingContext2D, p: Particle) => {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation || 0);
  ctx.beginPath();
  ctx.fillStyle = p.color;
  
  const s = p.size;
  ctx.moveTo(0, -s / 2);
  ctx.quadraticCurveTo(s / 2, -s / 4, s / 3, s / 2);
  ctx.quadraticCurveTo(0, s / 3, -s / 3, s / 2);
  ctx.quadraticCurveTo(-s / 2, -s / 4, 0, -s / 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 1;
  ctx.moveTo(0, -s / 2);
  ctx.lineTo(0, s / 2);
  ctx.stroke();
  ctx.restore();
};

const drawPetal = (ctx: CanvasRenderingContext2D, p: Particle) => {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation || 0);
  ctx.beginPath();
  ctx.fillStyle = p.color;
  
  const s = p.size;
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-s, -s/2, -s, s, 0, s);
  ctx.bezierCurveTo(s/2, s, s, s/2, 0, 0);
  ctx.fill();
  ctx.restore();
};

const drawSnowflake = (ctx: CanvasRenderingContext2D, p: Particle) => {
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
  ctx.fillStyle = p.color;
  
  if (p.size > 3) {
    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
    grad.addColorStop(0, p.color);
    grad.addColorStop(0.8, p.color);
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
  }
  ctx.fill();
};

const drawSummerDust = (ctx: CanvasRenderingContext2D, p: Particle) => {
  ctx.save();
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
  
  const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.5);
  gradient.addColorStop(0, p.color);
  gradient.addColorStop(0.3, p.color);
  gradient.addColorStop(1, 'rgba(253, 224, 71, 0)');
  
  ctx.fillStyle = gradient;
  ctx.shadowBlur = p.size * 2;
  ctx.shadowColor = p.color;
  ctx.fill();
  ctx.restore();
};

let resizeObserver: ResizeObserver | null = null;

const startAnimation = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const resizeCanvas = () => {
    const rect = canvas.parentElement?.getBoundingClientRect();
    canvas.width = rect?.width || window.innerWidth;
    canvas.height = rect?.height || window.innerHeight;
    initParticles(canvas);
  };

  const updateParticles = () => {
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      if (props.season === 'winter') {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * (p.swingSpeed || 0.01)) * 0.25;
      } else if (props.season === 'spring') {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
          p.rotation += p.rotationSpeed;
        }
      } else if (props.season === 'summer') {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.01) * 0.15;
      } else { // autumn
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * (p.swingSpeed || 0.01)) * 0.4;
        if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
          p.rotation += p.rotationSpeed;
        }
      }

      // Mouse avoidance
      const dx = p.x - mouse.value.x;
      const dy = p.y - mouse.value.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.value.radius) {
        const force = (mouse.value.radius - dist) / mouse.value.radius;
        const angle = Math.atan2(dy, dx);
        p.x += Math.cos(angle) * force * 5;
        p.y += Math.sin(angle) * force * 5;
      }

      // Wrap around boundaries
      if (props.season === 'summer') {
        if (p.y < -p.size * 2) {
          p.y = canvas.height + p.size * 2;
          p.x = Math.random() * canvas.width;
        }
      } else {
        if (p.y > canvas.height + p.size * 2) {
          p.y = -p.size * 2;
          p.x = Math.random() * canvas.width;
        }
      }

      if (p.x > canvas.width + p.size * 2) {
        p.x = -p.size * 2;
      } else if (p.x < -p.size * 2) {
        p.x = canvas.width + p.size * 2;
      }

      ctx.globalAlpha = p.opacity;
      if (props.season === 'winter') {
        drawSnowflake(ctx, p);
      } else if (props.season === 'spring') {
        drawPetal(ctx, p);
      } else if (props.season === 'summer') {
        drawSummerDust(ctx, p);
      } else if (props.season === 'autumn') {
        drawLeaf(ctx, p);
      }
    }
  };

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateParticles();
    animationId = requestAnimationFrame(animate);
  };

  resizeCanvas();
  animate();

  resizeObserver = new ResizeObserver(() => {
    resizeCanvas();
  });
  if (canvas.parentElement) {
    resizeObserver.observe(canvas.parentElement);
  }
};

onMounted(() => {
  startAnimation();
});

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

watch(
  () => [props.season, props.intensity, props.windSpeed],
  () => {
    if (animationId) cancelAnimationFrame(animationId);
    if (resizeObserver) resizeObserver.disconnect();
    startAnimation();
  }
);
</script>

<template>
  <canvas
    :id="`particles-canvas-${season}`"
    ref="canvasRef"
    class="absolute inset-0 pointer-events-none z-10 block transition-opacity duration-1000"
    style="mix-blend-mode: screen;"
  />
</template>
