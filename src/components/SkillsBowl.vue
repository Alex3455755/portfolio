<template>
  <div class="w-full bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8 flex flex-col space-y-6 select-none relative" id="skills-bowl-container">
    <!-- Header with interactive explanation -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
      <div class="space-y-1">
        <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] text-indigo-600 font-mono font-bold uppercase tracking-wider">
          {{ viewMode === 'physics' ? 'Интерактивная песочница / Physics Sandbox' : 'Интерактивный радар / Skills Radar' }}
        </div>
        <h3 class="text-xl font-display font-extrabold text-slate-900">
          Стек технологий & Навыки
        </h3>
        <p class="text-xs text-slate-500 max-w-lg">
          {{ viewMode === 'physics' 
            ? 'Взаимодействуйте с чашей: хватайте и бросайте шары-навыки, наклоняйте чашу мышкой или встряхивайте её!' 
            : 'Кликайте по плашкам навыков, чтобы открыть подробное описание опыта, стек смежных инструментов и уровень владения.' 
          }}
        </p>
      </div>

      <!-- Controls & View Switcher -->
      <div class="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-between sm:justify-end">
        <!-- Tab Switcher -->
        <div class="inline-flex p-0.5 bg-slate-100 border border-slate-200/50 rounded-xl">
          <button 
            @click="viewMode = 'physics'"
            :class="[
              'flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer',
              viewMode === 'physics' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            ]"
            title="Физический симулятор чаши"
          >
            <Gamepad2 class="w-3.5 h-3.5" />
            <span class="inline">Чаша</span>
          </button>
          <button 
            @click="viewMode = 'grid'"
            :class="[
              'flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer',
              viewMode === 'grid' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            ]"
            title="Интерактивный список навыков"
          >
            <Grid class="w-3.5 h-3.5" />
            <span class="inline">Сетка</span>
          </button>
        </div>

        <!-- Live Physics Controls (only shown when physics mode is active) -->
        <div v-if="viewMode === 'physics'" class="flex items-center gap-1.5">
          <button 
            @click="resetBalls" 
            class="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
            title="Сбросить позиции шаров"
          >
            <RotateCcw class="w-3.5 h-3.5" />
            <span>Сброс</span>
          </button>
          <button 
            @click="addChaos" 
            class="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold rounded-lg transition-colors cursor-pointer"
            title="Встряхнуть чашу"
          >
            <Sparkles class="w-3.5 h-3.5" />
            <span>Встряска</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Mode A: The HTML5 Canvas Physics Arena -->
    <div v-if="viewMode === 'physics'" class="flex flex-col space-y-4 animate-fade-in">
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

    <!-- Mode B: Tactile Bento Grid View of Skills for Mobile and Accessibility -->
    <div v-else class="space-y-6 animate-fade-in" id="skills-grid-view">
      <!-- Active Skill Summary Banner -->
      <div class="p-4 bg-gradient-to-r from-indigo-50/50 via-slate-50 to-sky-50/50 rounded-xl border border-slate-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="text-[10px] font-semibold text-indigo-600 font-mono tracking-wider uppercase">Профессиональный профиль</div>
          <div class="text-slate-800 font-bold text-sm sm:text-base">
            Интерактивная карта компетенций
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="text-right">
            <div class="text-[10px] font-mono font-bold text-slate-400 uppercase">Уровень экспертизы</div>
            <div class="text-xs sm:text-sm font-extrabold text-indigo-600 font-mono">
              {{ selectedSkillDetails ? selectedSkillDetails.level : 'Выберите технологию' }}
            </div>
          </div>
          <div class="w-10 h-10 rounded-xl bg-white border border-indigo-100 flex items-center justify-center text-indigo-500 shadow-sm font-bold text-base select-none">
            🏆
          </div>
        </div>
      </div>

      <!-- 4 Seasons Bento Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Winter Card -->
        <div class="bg-slate-50/50 border border-slate-200/60 rounded-xl p-4 hover:border-sky-300 transition-colors">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-7 h-7 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shadow-sm">
              <Snowflake class="w-4 h-4" />
            </div>
            <div>
              <h4 class="text-xs sm:text-sm font-extrabold text-slate-800 font-display">Back-end & Systems</h4>
              <span class="text-[9px] font-mono font-bold text-sky-500 uppercase">Зима</span>
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="skill in rawSkills.filter(s => s.category === 'winter')"
              :key="skill.label"
              @click="selectSkill(skill)"
              :class="[
                'px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 flex items-center gap-1.5 cursor-pointer select-none active:scale-95',
                activeSkillLabel === skill.label
                  ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/20 scale-105'
                  : 'bg-white text-slate-700 border-slate-200/80 hover:border-sky-300 hover:bg-sky-50/40'
              ]"
            >
              <span class="w-1.5 h-1.5 rounded-full" :class="activeSkillLabel === skill.label ? 'bg-white' : 'bg-sky-400'"></span>
              <span>{{ skill.label }}</span>
            </button>
          </div>
        </div>

        <!-- Spring Card -->
        <div class="bg-slate-50/50 border border-slate-200/60 rounded-xl p-4 hover:border-emerald-300 transition-colors">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
              <Leaf class="w-4 h-4" />
            </div>
            <div>
              <h4 class="text-xs sm:text-sm font-extrabold text-slate-800 font-display">Front-end & UI</h4>
              <span class="text-[9px] font-mono font-bold text-emerald-500 uppercase">Весна</span>
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="skill in rawSkills.filter(s => s.category === 'spring')"
              :key="skill.label"
              @click="selectSkill(skill)"
              :class="[
                'px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 flex items-center gap-1.5 cursor-pointer select-none active:scale-95',
                activeSkillLabel === skill.label
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20 scale-105'
                  : 'bg-white text-slate-700 border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/40'
              ]"
            >
              <span class="w-1.5 h-1.5 rounded-full" :class="activeSkillLabel === skill.label ? 'bg-white' : 'bg-emerald-400'"></span>
              <span>{{ skill.label }}</span>
            </button>
          </div>
        </div>

        <!-- Summer Card -->
        <div class="bg-slate-50/50 border border-slate-200/60 rounded-xl p-4 hover:border-amber-300 transition-colors">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shadow-sm">
              <Sun class="w-4 h-4" />
            </div>
            <div>
              <h4 class="text-xs sm:text-sm font-extrabold text-slate-800 font-display">Real-time & High-load</h4>
              <span class="text-[9px] font-mono font-bold text-amber-500 uppercase">Лето</span>
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="skill in rawSkills.filter(s => s.category === 'summer')"
              :key="skill.label"
              @click="selectSkill(skill)"
              :class="[
                'px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 flex items-center gap-1.5 cursor-pointer select-none active:scale-95',
                activeSkillLabel === skill.label
                  ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20 scale-105'
                  : 'bg-white text-slate-700 border-slate-200/80 hover:border-amber-300 hover:bg-amber-50/40'
              ]"
            >
              <span class="w-1.5 h-1.5 rounded-full" :class="activeSkillLabel === skill.label ? 'bg-white' : 'bg-amber-400'"></span>
              <span>{{ skill.label }}</span>
            </button>
          </div>
        </div>

        <!-- Autumn Card -->
        <div class="bg-slate-50/50 border border-slate-200/60 rounded-xl p-4 hover:border-orange-300 transition-colors">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shadow-sm">
              <Flame class="w-4 h-4" />
            </div>
            <div>
              <h4 class="text-xs sm:text-sm font-extrabold text-slate-800 font-display">DevOps & QA</h4>
              <span class="text-[9px] font-mono font-bold text-orange-500 uppercase">Осень</span>
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="skill in rawSkills.filter(s => s.category === 'autumn')"
              :key="skill.label"
              @click="selectSkill(skill)"
              :class="[
                'px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 flex items-center gap-1.5 cursor-pointer select-none active:scale-95',
                activeSkillLabel === skill.label
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20 scale-105'
                  : 'bg-white text-slate-700 border-slate-200/80 hover:border-orange-300 hover:bg-orange-50/40'
              ]"
            >
              <span class="w-1.5 h-1.5 rounded-full" :class="activeSkillLabel === skill.label ? 'bg-white' : 'bg-orange-400'"></span>
              <span>{{ skill.label }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Experience Detail Drawer Card -->
      <div class="p-4 sm:p-5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs flex flex-col md:flex-row justify-between gap-5 transition-all">
        <div class="space-y-2 md:w-2/3">
          <span class="text-[9px] font-mono font-bold text-indigo-500 uppercase tracking-wide">Глубина практического опыта</span>
          <h5 class="font-extrabold text-slate-800 text-sm sm:text-base flex items-center gap-2">
            <span>{{ selectedSkillDetails ? selectedSkillDetails.title : 'Выделите технологию' }}</span>
            <span 
              v-if="selectedSkillDetails" 
              class="px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-mono font-extrabold text-white"
              :style="{ backgroundColor: colorPalette[selectedSkillDetails.category].bg }"
            >
              {{ selectedSkillDetails.category.toUpperCase() }}
            </span>
          </h5>
          <p class="text-slate-600 leading-relaxed text-xs sm:text-sm">
            {{ selectedSkillDetails ? selectedSkillDetails.description : 'Выберите любой навык из сезонных карточек выше, чтобы открыть информацию о реальном проектном опыте и глубине интеграции.' }}
          </p>
        </div>
        <div v-if="selectedSkillDetails" class="md:w-1/3 flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-200/80 pt-4 md:pt-0 md:pl-5 space-y-2">
          <div class="space-y-1.5">
            <div class="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Смежный стек / Библиотеки</div>
            <div class="flex flex-wrap gap-1.5">
              <span 
                v-for="tool in selectedSkillDetails.tools" 
                :key="tool"
                class="px-2 py-0.5 bg-white border border-slate-200 text-slate-600 rounded text-[10px] font-mono font-bold"
              >
                {{ tool }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { RotateCcw, Sparkles, Gamepad2, Grid, Snowflake, Leaf, Sun, Flame } from 'lucide-vue-next';

interface SkillBall {
  label: string;
  category: 'winter' | 'spring' | 'summer' | 'autumn';
  color: string;
  textColor: string;
  radius: number;
  x: number;      // World X coordinate
  y: number;      // World Y coordinate
  vx: number;     // World velocity X
  vy: number;     // World velocity Y
  mass: number;
  isInside: boolean; // Tracks whether ball is currently inside the physical cup boundaries
}

const canvasRef = ref<HTMLCanvasElement | null>(null);

// Initialize viewMode to 'grid' immediately on mobile to prevent canvas/layout flashes
const isMobile = typeof window !== 'undefined' ? window.innerWidth < 640 : false;
const viewMode = ref<'physics' | 'grid'>(isMobile ? 'grid' : 'physics');
const activeSkillLabel = ref('Vue 3');

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

const skillInfoDatabase: Record<string, { title: string; category: 'winter' | 'spring' | 'summer' | 'autumn'; level: string; description: string; tools: string[] }> = {
  'Postgres': {
    title: 'PostgreSQL Database Engineering',
    category: 'winter',
    level: 'Advanced / Production Ready',
    description: 'Проектирование сложных схем баз данных, оптимизация производительности запросов, индексация (B-Tree, GIN, GiST), транзакции ACID и аналитические оконные функции.',
    tools: ['Prisma', 'Drizzle ORM', 'pgAdmin', 'Supabase']
  },
  'Node.js': {
    title: 'Node.js Backend Architecture',
    category: 'winter',
    level: 'Expert',
    description: 'Разработка асинхронных высокопроизводительных сервисов, стримы данных, обработка ошибок, многопоточность с Worker Threads и кастомные скрипты автоматизации.',
    tools: ['ESM', 'NPM/PNPM', 'Fastify', 'NestJS']
  },
  'Docker': {
    title: 'Containerization & Isolation',
    category: 'winter',
    level: 'Strong Upper-Intermediate',
    description: 'Написание оптимизированных многоэтапных (multi-stage) Dockerfile, управление связками сервисов через Docker Compose, минимизация размеров образов.',
    tools: ['Compose', 'Docker Hub', 'Alpine Linux', 'Kubernetes']
  },
  'SQL/NoSQL': {
    title: 'Hybrid Data Storage Architectures',
    category: 'winter',
    level: 'Advanced',
    description: 'Опыт работы как с реляционными базами данных, так и с NoSQL решениями (MongoDB, Redis). Архитектурный выбор под бизнес-задачи.',
    tools: ['MongoDB', 'Mongoose', 'DynamoDB', 'SQL']
  },
  'Security': {
    title: 'Backend API & System Security',
    category: 'winter',
    level: 'Advanced / Security Minded',
    description: 'Реализация JWT/OAuth авторизации, хеширование паролей (bcrypt/argon2), защита от OWASP Top 10 угроз (XSS, CSRF, SQL-injection), CORS и Rate Limiting.',
    tools: ['Helmet', 'CORS', 'Passport.js', 'Jose JWT']
  },
  'Linux': {
    title: 'Linux Systems & Bash Scripting',
    category: 'winter',
    level: 'Intermediate',
    description: 'Уверенное администрирование Linux-серверов (Ubuntu/Debian), настройка Nginx, автоматизация рутинных задач с помощью Bash-скриптов и мониторинг логов.',
    tools: ['SSH', 'Systemd', 'Cron', 'Bash']
  },
  'Vue 3': {
    title: 'Vue 3 Ecosystem Mastery',
    category: 'spring',
    level: 'Expert / Preferred',
    description: 'Глубокое владение Composition API, тонкая настройка реактивности (ref/reactive), Pinia как стейт-менеджер и Vue Router для сложных SPA/MPA приложений.',
    tools: ['Composition API', 'Pinia', 'Vue Router', 'Nuxt 3']
  },
  'TS': {
    title: 'Strict TypeScript Development',
    category: 'spring',
    level: 'Expert',
    description: 'Разработка приложений со строгой типизацией: сложные generic-типы, служебные типы (Utility Types), декораторы и автогенерация контрактов.',
    tools: ['TS Config', 'Zod Schema', 'TSEST', 'Type-Fest']
  },
  'Tailwind': {
    title: 'Tailwind CSS Rapid Design',
    category: 'spring',
    level: 'Expert / Designer',
    description: 'Сборка адаптивных, отзывчивых и современных интерфейсов без написания шаблонного CSS. Создание дизайн-систем, кастомные анимации и темизация.',
    tools: ['Tailwind Play', 'PostCSS', 'clsx/tailwind-merge']
  },
  'UI/UX': {
    title: 'Interactive Interface Design',
    category: 'spring',
    level: 'Advanced',
    description: 'Проектирование пользовательского опыта с упором на эстетику, доступность (a11y), интуитивную навигацию, микро-анимации и плавность интерфейсов.',
    tools: ['Figma', 'Prototyping', 'Contrast Check', 'Motion']
  },
  'React': {
    title: 'React.js Component Ecosystem',
    category: 'spring',
    level: 'Advanced',
    description: 'Опыт создания больших SPA приложений с использованием React Hooks, контекста, кастомных хуков, оптимизации ререндеров и Server-Side Rendering (Next.js).',
    tools: ['Next.js', 'Redux Toolkit', 'Zustand', 'React Query']
  },
  'Charts': {
    title: 'Data Visualization & SVG Canvas',
    category: 'spring',
    level: 'Strong Intermediate',
    description: 'Построение интерактивных графиков, аналитических панелей и кастомных визуализаций данных с использованием D3.js, Chart.js, Recharts.',
    tools: ['D3.js', 'Recharts', 'SVG Engine', 'Canvas API']
  },
  'WebSockets': {
    title: 'Real-time Web Communications',
    category: 'summer',
    level: 'Advanced',
    description: 'Реализация двусторонней связи в реальном времени. Разработка чатов, систем уведомлений и игровых сессий с решением конфликтов синхронизации.',
    tools: ['Socket.io', 'WS Module', 'Heartbeats', 'Event-Emitter']
  },
  'Redis': {
    title: 'In-Memory Data Grid & Caching',
    category: 'summer',
    level: 'Advanced',
    description: 'Кэширование "тяжелых" запросов, хранение сессий, очередь задач (BullMQ) и распределенные блокировки для оптимизации высоконагруженных сервисов.',
    tools: ['IORedis', 'Redis Pub/Sub', 'BullMQ', 'Caching Strategy']
  },
  'Express': {
    title: 'Express.js Restful Services',
    category: 'summer',
    level: 'Expert',
    description: 'Проектирование чистого REST API, масштабируемой структуры контроллеров и роутов, кастомный middleware стек и логирование.',
    tools: ['Morgan', 'Pino Logger', 'Router API', 'Cors']
  },
  'Serverless': {
    title: 'Cloud Functions & Serverless',
    category: 'summer',
    level: 'Intermediate',
    description: 'Опыт развертывания serverless микросервисов в облаке GCP (Cloud Run, Cloud Functions) и AWS Lambda для событийно-ориентированной архитектуры.',
    tools: ['Vercel Functions', 'Cloud Run', 'AWS Lambda']
  },
  'CDN / Edge': {
    title: 'Content Delivery & Optimization',
    category: 'summer',
    level: 'Intermediate',
    description: 'Настройка кэширования статики и динамических роутов на уровне CDN, оптимизация времени до первого байта (TTFB), сжатие ресурсов.',
    tools: ['Cloudflare', 'Brotli', 'HTTP Cache Headers']
  },
  'CI/CD': {
    title: 'DevOps & Automated Workflows',
    category: 'autumn',
    level: 'Advanced / Devops-focused',
    description: 'Автоматизация сборки, тестирования и деплоя с помощью GitHub Actions. Создание пайплайнов для линтинга, статического анализа и релиза.',
    tools: ['GitHub Actions', 'Docker Deploy', 'Semantic Release']
  },
  'Git/GitHub': {
    title: 'Advanced Git Workflow',
    category: 'autumn',
    level: 'Expert',
    description: 'Профессиональная работа с ветками, разрешение конфликтов, интерактивный rebase, чистый коммит-лог (Conventional Commits), Git Hooks.',
    tools: ['Git CLI', 'Husky', 'Linter-staged', 'GitHub PRs']
  },
  'Vite': {
    title: 'Next-Generation Bundling',
    category: 'autumn',
    level: 'Expert',
    description: 'Сверхбыстрая сборка фронтенда, конфигурирование плагинов, оптимизация бандлов с разделением кода (code-splitting) и Tree Shaking.',
    tools: ['Vite Plugins', 'Rollup Config', 'Esbuild']
  },
  'Testing': {
    title: 'Comprehensive Test Suites',
    category: 'autumn',
    level: 'Advanced',
    description: 'Написание юнит-тестов (Unit Tests), интеграционных тестов и сквозного тестирования (E2E) для гарантии стабильности кодовой базы.',
    tools: ['Vitest', 'Jest', 'Playwright', 'Testing Library']
  },
  'Refactor': {
    title: 'Code Refactoring & Quality control',
    category: 'autumn',
    level: 'Advanced',
    description: 'Анализ технического долга, рефакторинг "спагетти-кода", паттерны проектирования GoF, SOLID-архитектура, настройка ESLint & Prettier.',
    tools: ['ESLint', 'Prettier', 'SonarQube', 'SOLID Design']
  }
};

const selectedSkillDetails = computed(() => skillInfoDatabase[activeSkillLabel.value] || null);

const selectSkill = (skill: { label: string }) => {
  activeSkillLabel.value = skill.label;
};

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

const cupRadius = ref(170);   // size of the bowl (radius of bottom semi-circle)
const cupWallHeight = ref(95); // height of straight side walls
const glassLidY = ref(-100);  // unused top boundary (no longer locked inside!)

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
    
    // Spawn positions inside the cup relative to its center-bottom
    const colCount = 5;
    const col = index % colCount;
    const row = Math.floor(index / colCount);
    
    const localX = -100 + col * 48 + (row % 2) * 12 + (Math.random() - 0.5) * 5;
    const localY = -35 + row * 32 + (Math.random() - 0.5) * 5;

    // Convert local positions to world positions immediately
    const cos = Math.cos(cupRotation.value);
    const sin = Math.sin(cupRotation.value);
    const x = cupX.value + localX * cos - localY * sin;
    const y = cupY.value + localX * sin + localY * cos;

    return {
      label: skill.label,
      category: skill.category,
      color: palette.bg,
      textColor: palette.text,
      radius,
      x,
      y,
      vx: 0,
      vy: 0,
      mass: radius * radius, // mass is proportional to area
      isInside: true
    };
  });
};

const resetBalls = () => {
  cupRotation.value = 0;
  cupRotVel.value = 0;
  initBalls();
};

const addChaos = () => {
  balls.value.forEach(b => {
    b.vx += (Math.random() - 0.5) * 12;
    b.vy -= Math.random() * 8 + 4;
  });
  cupRotVel.value += (Math.random() - 0.5) * 0.4;
};

// Physical simulations inside requestAnimationFrame loop
const updatePhysics = () => {
  if (viewMode.value !== 'physics') return;

  // 1. Cup inertia logic:
  // Apply a soft restoration force to return cup to straight alignment when not dragging
  if (!isRotatingCup) {
    const restAngle = 0;
    const springStiffness = 0.05;
    const damper = 0.85;

    const force = (restAngle - cupRotation.value) * springStiffness;
    cupRotVel.value = (cupRotVel.value + force) * damper;
    cupRotation.value += cupRotVel.value;
  }

  const totalBalls = balls.value.length;

  // 2. Apply gravity and update positions in world coordinates
  for (let i = 0; i < totalBalls; i++) {
    const b = balls.value[i];
    if (i === isDraggingBallIndex) continue;

    // Gravity pulls straight down in world space
    b.vy += gravity;

    // Apply friction/air resistance
    b.vx *= friction;
    b.vy *= friction;

    // Integrate position
    b.x += b.vx;
    b.y += b.vy;
  }

  // Multi-pass constraint solver (combines boundaries and ball-to-ball checks)
  const solverSteps = 4;
  const canvas = canvasRef.value;
  const canvasWidth = canvas ? canvas.width : 500;
  const canvasHeight = canvas ? canvas.height : 400;

  for (let step = 0; step < solverSteps; step++) {
    const R = cupRadius.value;
    const H = cupWallHeight.value;
    const thickness = 10; // Collision thickness of glass wall

    // A. Resolve boundaries
    for (let i = 0; i < totalBalls; i++) {
      const b = balls.value[i];
      if (i === isDraggingBallIndex) continue;

      // A1. Screen / Sandbox Boundaries
      // Floor bounce
      if (b.y + b.radius > canvasHeight) {
        b.y = canvasHeight - b.radius;
        if (b.vy > 0) b.vy = -b.vy * wallRestitution;
        b.vx *= 0.95; // extra floor friction
      }
      // Ceiling bounce
      if (b.y - b.radius < 0) {
        b.y = b.radius;
        if (b.vy < 0) b.vy = -b.vy * wallRestitution;
      }
      // Left screen boundary
      if (b.x - b.radius < 0) {
        b.x = b.radius;
        if (b.vx < 0) b.vx = -b.vx * wallRestitution;
      }
      // Right screen boundary
      if (b.x + b.radius > canvasWidth) {
        b.x = canvasWidth - b.radius;
        if (b.vx > 0) b.vx = -b.vx * wallRestitution;
      }

      // A2. Cup Boundaries (convert world coordinates to cup-local space)
      const dx = b.x - cupX.value;
      const dy = b.y - cupY.value;
      const cos = Math.cos(-cupRotation.value);
      const sin = Math.sin(-cupRotation.value);
      let lx = dx * cos - dy * sin;
      let ly = dx * sin + dy * cos;

      // Convert velocities to local space for reflections
      let lvx = b.vx * cos - b.vy * sin;
      let lvy = b.vx * sin + b.vy * cos;

      // Detect container transition (leaving/entering)
      if (b.isInside) {
        if (ly < -H - b.radius) {
          b.isInside = false; // Popped out of the open top!
        }
      } else {
        // Entering open top of the cup
        if (ly >= -H && ly < -H + 15 && lx > -R + b.radius && lx < R - b.radius && lvy > 0) {
          b.isInside = true;
        }
      }

      let changed = false;

      if (b.isInside) {
        // Inside Cup Constraints
        if (ly >= 0) {
          // Bottom semi-circle inner wall
          const dist = Math.sqrt(lx * lx + ly * ly);
          const limit = R - b.radius;
          if (dist > limit) {
            const nx = lx / dist;
            const ny = ly / dist;
            lx = nx * limit;
            ly = ny * limit;

            const vn = lvx * nx + lvy * ny;
            if (vn > 0) {
              lvx -= vn * (1.0 + wallRestitution) * nx;
              lvy -= vn * (1.0 + wallRestitution) * ny;
              lvx *= 0.94;
              lvy *= 0.94;
            }
            changed = true;
          }
        } else {
          // Straight inner side walls (ly < 0 && ly >= -H)
          if (lx - b.radius < -R) {
            lx = -R + b.radius;
            if (lvx < 0) lvx = -lvx * wallRestitution;
            changed = true;
          }
          if (lx + b.radius > R) {
            lx = R - b.radius;
            if (lvx > 0) lvx = -lvx * wallRestitution;
            changed = true;
          }
        }
      } else {
        // Outside Cup Constraints (Bounce off exterior of the glass)
        if (ly >= -H - thickness) {
          if (ly >= 0) {
            // Semi-circular bottom outer wall
            const dist = Math.sqrt(lx * lx + ly * ly);
            const outerLimit = R + thickness + b.radius;
            if (dist < outerLimit) {
              const nx = lx / dist;
              const ny = ly / dist;
              lx = nx * outerLimit;
              ly = ny * outerLimit;

              const vn = lvx * nx + lvy * ny;
              if (vn < 0) {
                lvx -= vn * (1.0 + wallRestitution) * nx;
                lvy -= vn * (1.0 + wallRestitution) * ny;
              }
              changed = true;
            }
          } else {
            // Straight outer side walls
            // Left outer wall
            if (lx < 0 && lx > -R - thickness - b.radius && lx < -R) {
              lx = -R - thickness - b.radius;
              if (lvx > 0) lvx = -lvx * wallRestitution;
              changed = true;
            }
            // Right outer wall
            if (lx > 0 && lx < R + thickness + b.radius && lx > R) {
              lx = R + thickness + b.radius;
              if (lvx < 0) lvx = -lvx * wallRestitution;
              changed = true;
            }
          }
        }
      }

      // Convert local coordinate changes back to world space
      if (changed) {
        const cosInv = Math.cos(cupRotation.value);
        const sinInv = Math.sin(cupRotation.value);
        b.x = cupX.value + lx * cosInv - ly * sinInv;
        b.y = cupY.value + lx * sinInv + ly * cosInv;

        b.vx = lvx * cosInv - lvy * sinInv;
        b.vy = lvx * sinInv + lvy * cosInv;
      }
    }

    // B. Resolve ball-to-ball collisions in world space
    for (let i = 0; i < totalBalls; i++) {
      const b1 = balls.value[i];
      for (let j = i + 1; j < totalBalls; j++) {
        const b2 = balls.value[j];
        const dx = b2.x - b1.x;
        const dy = b2.y - b1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = b1.radius + b2.radius;

        if (dist < minDist && dist > 0.01) {
          const overlap = minDist - dist;
          const nx = dx / dist;
          const ny = dy / dist;
          const totalMass = b1.mass + b2.mass;
          const push = overlap * 0.92;

          if (i !== isDraggingBallIndex && j !== isDraggingBallIndex) {
            b1.x -= nx * push * (b2.mass / totalMass);
            b1.y -= ny * push * (b2.mass / totalMass);
            b2.x += nx * push * (b1.mass / totalMass);
            b2.y += ny * push * (b1.mass / totalMass);
          } else if (i === isDraggingBallIndex) {
            b2.x += nx * push;
            b2.y += ny * push;
          } else {
            b1.x -= nx * push;
            b1.y -= ny * push;
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
      b.vx *= 0.8;
      b.vy *= 0.8;
      if (vel < 0.03) {
        b.vx = 0;
        b.vy = 0;
      }
    }
  }
};

// Canvas Renderer
const draw = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, w, h);

  const centerX = w / 2;
  const centerY = h / 2; // centered in the middle of the block

  cupX.value = centerX;
  cupY.value = centerY;

  // 1. Draw Cup (Rotated Canvas Context)
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(cupRotation.value);

  const R = cupRadius.value;
  const H = cupWallHeight.value;

  // Draw cup backfill
  ctx.beginPath();
  ctx.moveTo(-R, -H);
  ctx.lineTo(-R, 0);
  ctx.arc(0, 0, R, Math.PI, 0, true);
  ctx.lineTo(R, -H);
  ctx.quadraticCurveTo(0, -H - 12, -R, -H);
  ctx.fillStyle = 'rgba(241, 245, 249, 0.45)';
  ctx.fill();

  const glassGrad = ctx.createLinearGradient(-R, -H, R, R);
  glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
  glassGrad.addColorStop(0.5, 'rgba(226, 232, 240, 0.1)');
  glassGrad.addColorStop(1, 'rgba(148, 163, 184, 0.15)');
  ctx.fillStyle = glassGrad;
  ctx.fill();

  // Draw Cup outer glow / shadow
  ctx.shadowColor = 'rgba(100, 116, 139, 0.08)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 6;

  // Draw physical glass bowl boundary outline
  ctx.beginPath();
  ctx.moveTo(-R, -H);
  ctx.lineTo(-R, 0);
  ctx.arc(0, 0, R, Math.PI, 0, true);
  ctx.lineTo(R, -H);

  // Styling the glass container
  ctx.strokeStyle = 'rgba(203, 213, 225, 0.9)'; // slate-300
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Reset shadow for handles
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Draw Handles for the Cup (Touch Targets)
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

  ctx.restore(); // Restore to normal canvas coordinates

  // 2. Draw Balls in World Coordinates (This keeps text perfectly unrotated!)
  balls.value.forEach((b) => {
    ctx.save();
    ctx.translate(b.x, b.y);

    // Drop shadow under balls
    ctx.beginPath();
    ctx.arc(0, 3, b.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.08)';
    ctx.fill();

    // Flat modern color fill with no glare
    ctx.fillStyle = b.color;
    ctx.beginPath();
    ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
    ctx.fill();

    // Fine border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Subtle gloss / 3D highlight arc removed to achieve clean flat modern look

    // Draw label
    ctx.fillStyle = b.textColor;
    
    // Choose dynamic crisp font sizing
    let fontSize = Math.max(7.5, Math.min(10.5, b.radius * 0.44));
    ctx.font = `bold ${fontSize}px monospace`;
    if (b.label.length > 8) {
      ctx.font = `bold ${fontSize - 1}px monospace`;
    }
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(b.label, 0, 0.5);

    ctx.restore();
  });
};

const adjustColorBrightness = (hex: string, percent: number) => {
  let R = parseInt(hex.substring(1, 3), 16);
  let G = parseInt(hex.substring(3, 5), 16);
  let B = parseInt(hex.substring(5, 7), 16);

  R = Math.max(0, Math.min(255, R + percent));
  G = Math.max(0, Math.min(255, G + percent));
  B = Math.max(0, Math.min(255, B + percent));

  const rHex = R.toString(16).padStart(2, '0');
  const gHex = G.toString(16).padStart(2, '0');
  const bHex = B.toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
};

// Frame Loop
const loop = () => {
  updatePhysics();
  draw();
  animationFrameId = requestAnimationFrame(loop);
};

// Canvas Sizing Adjustments
const resizeCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const parent = canvas.parentElement;
  if (!parent) return;

  const rect = parent.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  cupX.value = canvas.width / 2;
  cupY.value = canvas.height / 2;

  // Responsive scale of the cup dimensions to prevent overcrowding on tablets
  if (rect.width < 500) {
    cupRadius.value = Math.max(105, rect.width * 0.32);
    cupWallHeight.value = Math.max(65, rect.width * 0.18);
    glassLidY.value = -cupWallHeight.value - 5;
  } else {
    cupRadius.value = 170;
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

// Unified inputs logic
const handleInputDown = (clientX: number, clientY: number) => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const wx = clientX - rect.left;
  const wy = clientY - rect.top;

  // 1. Check if clicked any ball (using world coordinates)
  let clickedBallIdx = -1;
  for (let i = balls.value.length - 1; i >= 0; i--) {
    const ball = balls.value[i];
    const dx = wx - ball.x;
    const dy = wy - ball.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < ball.radius) {
      clickedBallIdx = i;
      break;
    }
  }

  if (clickedBallIdx !== -1) {
    isDraggingBallIndex = clickedBallIdx;
    lastMouseLocalX = wx;
    lastMouseLocalY = wy;
  } else {
    // 2. Clicked cup background / rim to rotate/tilt the cup
    isRotatingCup = true;
    startCupRotation = cupRotation.value;
    
    // Calculate angle from center
    const mx = clientX - rect.left - cupX.value;
    const my = clientY - rect.top - cupY.value;
    startDragAngle = Math.atan2(my, mx);
  }
};

const handleInputMove = (clientX: number, clientY: number) => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const wx = clientX - rect.left;
  const wy = clientY - rect.top;

  if (isDraggingBallIndex !== -1) {
    const ball = balls.value[isDraggingBallIndex];
    
    // Keep dragged ball within canvas boundary
    const clampedWx = Math.max(ball.radius, Math.min(canvas.width - ball.radius, wx));
    const clampedWy = Math.max(ball.radius, Math.min(canvas.height - ball.radius, wy));

    // Update velocity based on drag speed
    ball.vx = (clampedWx - ball.x) * 0.45;
    ball.vy = (clampedWy - ball.y) * 0.45;

    // Update position
    ball.x = clampedWx;
    ball.y = clampedWy;

    // Determine if it is dragged inside or outside the cup
    const dx = ball.x - cupX.value;
    const dy = ball.y - cupY.value;
    const cos = Math.cos(-cupRotation.value);
    const sin = Math.sin(-cupRotation.value);
    const lx = dx * cos - dy * sin;
    const ly = dx * sin + dy * cos;

    const R = cupRadius.value;
    const H = cupWallHeight.value;

    if (ly >= -H && ly < R && Math.abs(lx) < R) {
      if (ly >= 0) {
        const dist = Math.sqrt(lx * lx + ly * ly);
        ball.isInside = (dist < R);
      } else {
        ball.isInside = true;
      }
    } else {
      ball.isInside = false;
    }

    lastMouseLocalX = wx;
    lastMouseLocalY = wy;
  } else if (isRotatingCup) {
    const mx = clientX - rect.left - cupX.value;
    const my = clientY - rect.top - cupY.value;
    
    const currentDragAngle = Math.atan2(my, mx);
    const deltaAngle = currentDragAngle - startDragAngle;

    // Limit cup rotation to ±65 degrees for optimal usability
    const targetRotation = Math.max(-1.1, Math.min(1.1, startCupRotation + deltaAngle));
    
    cupRotVel.value = targetRotation - cupRotation.value;
    cupRotation.value = targetRotation;
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
  resizeCanvas();
  initBalls();
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
