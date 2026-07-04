<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { SeasonType, Project } from './types';
import Header from './components/Header.vue';
import ResumeDrawer from './components/ResumeDrawer.vue';
import SeasonParticles from './components/SeasonParticles.vue';
import ProjectShowcase from './components/ProjectShowcase.vue';
import SkillsBowl from './components/SkillsBowl.vue';
import { 
  CheckCircle, ChevronDown, Settings, Sliders, Gauge, Shield, Terminal, Cpu, Copy, Check, Github 
} from 'lucide-vue-next';

const activeSeason = ref<SeasonType>('winter');
const scrollY = ref(0);
const isResumeOpen = ref(false);
const showConfigPanel = ref(false);

const particleIntensity = ref(1.0);
const windSpeed = ref(1.0);

const greetingName = ref('Гость');
const userName = ref('');

const copiedCommand = ref<string | null>(null);

const npmInstallCmd = 'npm install --save-dev gh-pages';
const scriptsJsonCode = '"predeploy": "npm run build",\n"deploy": "gh-pages -d dist"';
const npmDeployCmd = 'npm run deploy';

const npmInstallCmd_val = 'npm install --save-dev gh-pages';
const scriptsJsonCode_val = '"predeploy": "npm run build",\n"deploy": "gh-pages -d dist"';
const npmDeployCmd_val = 'npm run deploy';

// Section Element Refs
const winterSection = ref<HTMLElement | null>(null);
const springSection = ref<HTMLElement | null>(null);
const summerSection = ref<HTMLElement | null>(null);
const autumnSection = ref<HTMLElement | null>(null);

const sectionRefs: Record<SeasonType, any> = {
  winter: winterSection,
  spring: springSection,
  summer: summerSection,
  autumn: autumnSection
};

let ticking = false;

const handleScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      scrollY.value = window.scrollY;
      ticking = false;
    });
    ticking = true;
  }

  const scrollPosition = window.scrollY + window.innerHeight / 2;

  const winterTop = winterSection.value?.offsetTop || 0;
  const springTop = springSection.value?.offsetTop || 0;
  const summerTop = summerSection.value?.offsetTop || 0;
  const autumnTop = autumnSection.value?.offsetTop || 0;

  if (scrollPosition >= autumnTop) {
    activeSeason.value = 'autumn';
  } else if (scrollPosition >= summerTop) {
    activeSeason.value = 'summer';
  } else if (scrollPosition >= springTop) {
    activeSeason.value = 'spring';
  } else {
    activeSeason.value = 'winter';
  }
};

const scrollToSeason = (season: SeasonType) => {
  const target = sectionRefs[season].value;
  if (target) {
    const headerOffset = 80;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
    activeSeason.value = season;
  }
};

onMounted(() => {
  scrollY.value = window.scrollY;
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const copyToClipboard = (text: string, id: string) => {
  navigator.clipboard.writeText(text);
  copiedCommand.value = id;
  setTimeout(() => {
    copiedCommand.value = null;
  }, 2000);
};

const handleNameSubmit = (e: Event) => {
  e.preventDefault();
  if (userName.value.trim()) {
    greetingName.value = userName.value.trim();
  }
};

const projects: Project[] = [
  {
    id: 'skiflow',
    title: 'SkiFlow - Зимний Трекер Трасс',
    season: 'winter',
    tagline: 'Высокопроизводительный мониторинг горнолыжных спусков',
    description: 'Комплексная интерактивная платформа для горнолыжных курортов с отображением трасс, времени ожидания подъемников, лавинной безопасности и нагрузок в реальном времени. Включает многоуровневое серверное кэширование данных для моментального отклика в условиях холодных стартов.',
    techStack: ['Vue 3', 'TypeScript', 'Node.js', 'Redis', 'WebSocket', 'Tailwind CSS'],
    liveUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    stats: [
      { label: 'Задержка запроса', value: '< 2.4мс' },
      { label: 'Активных устройств', value: '14,200+' },
    ],
    features: [
      {
        title: 'Статусы Подъемников',
        description: 'Интерактивная панель отслеживания очередей и времени ожидания на подъемниках в реальном времени.',
        preview: null
      },
      {
        title: 'Симуляция Шторма',
        description: 'Проверьте реакцию системы на резкое изменение метеорологических параметров и лавинную угрозу.',
        preview: null
      }
    ]
  },
  {
    id: 'bloomhub',
    title: 'BloomHub - Весенняя IoT Теплица',
    season: 'spring',
    tagline: 'Умный контроль микроклимата и вегетации растений',
    description: 'IoT-система автоматизации полива и освещения для ботанических садов и закрытых теплиц. Визуализирует влажность почвы, солнечную экспозицию, транслирует графики вегетации растений и позволяет осуществлять уход в один клик.',
    techStack: ['Vue 3', 'D3.js', 'Express', 'MQTT IoT Protocol', 'PostgreSQL', 'Tailwind'],
    liveUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    stats: [
      { label: 'Опрос сенсоров', value: '100мс' },
      { label: 'Прирост урожайности', value: '+35%' },
    ],
    features: [
      {
        title: 'Панель Телеметрии',
        description: 'Детальные графики влажности почвы, температуры воздуха и интенсивности ультрафиолета.',
        preview: null
      },
      {
        title: 'Интерактивный Полив',
        description: 'Нажмите "Water Soil" для отправки команды на виртуальный насос и отслеживания реакции растения.',
        preview: null
      }
    ]
  },
  {
    id: 'solissurf',
    title: 'Solis - Летний Surf-Прогноз',
    season: 'summer',
    tagline: 'Радарное прогнозирование океанских волн и приливов',
    description: 'Приложение для серферов и спасателей, анализирующее высоту волн, силу ветра и направление течений. Оборудовано интерактивным слайдером приливов и визуальным измерителем зыби для безопасного выхода на воду.',
    techStack: ['Vue 3', 'Tailwind CSS', 'Swell API', 'GeoJSON', 'Serverless Functions'],
    liveUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    stats: [
      { label: 'Точность прогноза', value: '98.2%' },
      { label: 'Радарных станций', value: '310 по всему миру' },
    ],
    features: [
      {
        title: 'Измеритель Высоты Волн',
        description: 'Откалибруйте высоту зыби с помощью слайдера для оценки качества и крутизны волны.',
        preview: null
      },
      {
        title: 'Каталог Пляжей',
        description: 'Сравните температуру воды и ветровые условия на трех популярных мировых серф-спотах.',
        preview: null
      }
    ]
  },
  {
    id: 'harvestchain',
    title: 'HarvestChain - Осенний Блокчейн Реестр',
    season: 'autumn',
    tagline: 'Неизменяемая цепочка поставок фермерских товаров',
    description: 'Криптографический логистический хаб, регистрирующий транспортировку урожая от полей до городских рынков. Гарантирует соблюдение температурного режима, подлинность происхождения продуктов и исключает фальсификации.',
    techStack: ['Vue 3', 'Ethers.js', 'Solidity Smart Contracts', 'Docker', 'Rust', 'Tailwind'],
    liveUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    stats: [
      { label: 'Защищенный тоннаж', value: '180,000 тонн' },
      { label: 'Уровень подделок', value: '0.00% гарантировано' },
    ],
    features: [
      {
        title: 'Реестр Поставок',
        description: 'Интерактивный мониторинг перемещения тыкв, яблок и кленового сиропа по логистическим хабам.',
        preview: null
      },
      {
        title: 'Криптографический Сканер',
        description: 'Расшифруйте блок подписи в прямом эфире для проверки целостности цепочки поставок.',
        preview: null
      }
    ]
  }
];
</script>

<template>
  <div 
    class="min-h-screen text-slate-900 font-sans selection:bg-slate-900 selection:text-white relative transition-colors duration-1000"
    :class="{
      'bg-sky-50/40': activeSeason === 'winter',
      'bg-emerald-50/40': activeSeason === 'spring',
      'bg-[#FFFBEB]/50': activeSeason === 'summer',
      'bg-orange-50/40': activeSeason === 'autumn'
    }"
  >
    <!-- Header Component -->
    <Header 
      :active-season="activeSeason"
      @scroll-to-season="scrollToSeason"
      @show-resume="isResumeOpen = true"
    />

    <!-- Profile / Resume Slide-over Drawer -->
    <ResumeDrawer 
      :is-open="isResumeOpen"
      :active-season="activeSeason"
      @close="isResumeOpen = false"
    />

    <!-- Background ambient radial aura that morphs color based on active scroll section -->
    <div class="fixed inset-0 pointer-events-none z-0 transition-all duration-1000 overflow-hidden">
      <div 
        class="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full filter blur-[120px] opacity-20 transition-all duration-1000"
        :class="{
          'bg-sky-400': activeSeason === 'winter',
          'bg-emerald-400': activeSeason === 'spring',
          'bg-amber-300': activeSeason === 'summer',
          'bg-orange-400': activeSeason === 'autumn'
        }"
      />
      <div 
        class="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full filter blur-[120px] opacity-15 transition-all duration-1000"
        :class="{
          'bg-indigo-300': activeSeason === 'winter',
          'bg-teal-300': activeSeason === 'spring',
          'bg-rose-300': activeSeason === 'summer',
          'bg-red-400': activeSeason === 'autumn'
        }"
      />
    </div>

    <!-- Floating vertical sidebar scroll indicator dots -->
    <div class="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 z-40 flex-col gap-8 items-center bg-white/85 backdrop-blur-md px-4 py-8 rounded-2xl border border-slate-200/60 shadow-md transition-all duration-500" id="sidebar-dots">
      <button
        v-for="season in (['winter', 'spring', 'summer', 'autumn'] as SeasonType[])"
        :key="season"
        @click="scrollToSeason(season)"
        class="group flex flex-col items-center gap-1.5 cursor-pointer transition-all duration-300"
        :aria-label="`Scroll to ${season}`"
      >
        <span 
          class="text-[9px] font-bold uppercase tracking-widest transition-colors duration-500"
          :class="activeSeason === season 
            ? (season === 'winter' ? 'text-sky-600 font-bold' :
               season === 'spring' ? 'text-emerald-600 font-bold' :
               season === 'summer' ? 'text-amber-500 font-bold' :
               'text-orange-600 font-bold')
            : 'text-slate-400 hover:text-slate-600'"
        >
          {{ season }}
        </span>
        <div 
          class="rounded-full transition-all duration-500"
          :class="activeSeason === season
            ? (season === 'winter' ? 'bg-sky-500 w-2 h-10 shadow-lg shadow-sky-200' :
               season === 'spring' ? 'bg-emerald-500 w-2 h-10 shadow-lg shadow-emerald-200' :
               season === 'summer' ? 'bg-amber-500 w-2 h-10 shadow-lg shadow-amber-200' :
               'bg-orange-500 w-2 h-10 shadow-lg shadow-orange-200')
            : 'bg-slate-200 w-1 h-6'"
        />
      </button>
    </div>

    <!-- Interactive Environment Customizer Console -->
    <div class="fixed left-4 bottom-4 z-40" id="weather-customizer">
      <button
        @click="showConfigPanel = !showConfigPanel"
        class="w-10 h-10 rounded-full bg-white/95 hover:bg-white text-slate-700 shadow-md border border-slate-200 flex items-center justify-center cursor-pointer hover:rotate-45 transition-transform"
        title="Настройки Окружения"
      >
        <Settings class="w-5 h-5" />
      </button>

      <div
        v-if="showConfigPanel"
        class="absolute bottom-12 left-0 w-64 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-slate-200 space-y-4 text-xs"
      >
        <div>
          <h5 class="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
            <Sliders class="w-4 h-4 text-indigo-500" /> Физика Времен Года
          </h5>
          <p class="text-[10px] text-slate-500">Отрегулируйте скорость и силу падающих частиц в превью.</p>
        </div>

        <!-- Slider 1: Particle density -->
        <div class="space-y-1">
          <div class="flex justify-between font-mono font-bold text-[10px] text-slate-600">
            <span>Плотность частиц</span>
            <span>{{ Math.round(particleIntensity * 100) }}%</span>
          </div>
          <input 
            type="range" 
            min="0.2" 
            max="2.5" 
            step="0.1"
            v-model.number="particleIntensity"
            class="w-full accent-indigo-600 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <!-- Slider 2: Wind Speed -->
        <div class="space-y-1">
          <div class="flex justify-between font-mono font-bold text-[10px] text-slate-600">
            <span>Сила ветра</span>
            <span>{{ Math.round(windSpeed * 100) }}%</span>
          </div>
          <input 
            type="range" 
            min="0.0" 
            max="3.0" 
            step="0.2"
            v-model.number="windSpeed"
            class="w-full accent-indigo-600 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>Canvas render: Active</span>
          <span class="text-emerald-500">60 FPS</span>
        </div>
      </div>
    </div>

    <!-- HERO / LANDING SCREEN -->
    <section id="hero-landing" class="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center justify-center text-center space-y-12 z-20 overflow-hidden min-h-screen snap-start">
      <!-- Background giant blurry ambient blob with parallax translation -->
      <div 
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45rem] h-[45rem] rounded-full blur-[140px] pointer-events-none select-none -z-10 transition-colors duration-1000"
        :class="{
          'bg-sky-400/10': activeSeason === 'winter',
          'bg-emerald-400/10': activeSeason === 'spring',
          'bg-amber-400/10': activeSeason === 'summer',
          'bg-orange-400/10': activeSeason === 'autumn'
        }"
        :style="{ transform: `translate(-50%, calc(-50% + ${scrollY * 0.12}px))` }"
      />

      <!-- Floating Parallax Vector Element 1: Winter Snowflake -->
      <div 
        class="absolute left-[6%] top-[12%] w-14 h-14 text-sky-400/20 pointer-events-none select-none hidden sm:block"
        :style="{ transform: `translateY(${scrollY * -0.16}px) rotate(${scrollY * 0.04}deg)` }"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" class="w-full h-full">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19M12 5l3 3M12 19l-3-3M5 12l3 3M19 12l-3-3" />
        </svg>
      </div>

      <!-- Floating Parallax Vector Element 2: Summer Sunburst -->
      <div 
        class="absolute right-[8%] top-[18%] w-18 h-18 text-amber-500/20 pointer-events-none select-none hidden sm:block"
        :style="{ transform: `translateY(${scrollY * -0.24}px) rotate(${scrollY * -0.02}deg)` }"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" class="w-full h-full">
          <circle cx="12" cy="12" r="4" />
          <path stroke-linecap="round" d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.78l2.12-2.12M16.95 7.05l2.12-2.12" />
        </svg>
      </div>

      <!-- Floating Parallax Vector Element 3: Spring Blossom Leaf -->
      <div 
        class="absolute left-[10%] bottom-[20%] w-16 h-16 text-emerald-500/20 pointer-events-none select-none hidden sm:block"
        :style="{ transform: `translateY(${scrollY * 0.08}px) rotate(${scrollY * 0.06}deg)` }"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" class="w-full h-full">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3c0 4.5-3.5 8-8 8a8 8 0 0 0 8 8c0-4.5 3.5-8 8-8a8 8 0 0 0-8-8z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 11c1-1 3-1 4 0s0 3-1 4-3 1-4 0" />
        </svg>
      </div>

      <!-- Floating Parallax Vector Element 4: Autumn Maple Leaf -->
      <div 
        class="absolute right-[12%] bottom-[15%] w-14 h-14 text-orange-500/20 pointer-events-none select-none hidden sm:block"
        :style="{ transform: `translateY(${scrollY * 0.14}px) rotate(${scrollY * -0.05}deg)` }"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" class="w-full h-full">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 22v-5M12 17l-3-2M12 15l3-2M12 13l-4-4M12 11l4-4M12 17c-2-3-5-2-7-4 2-1 4-1 5 1m2-1c2-3 5-2 7-4-2-1-4-1-5 1" />
        </svg>
      </div>

      <!-- Foreground Interactive Header & Title Layer (staggered slightly slower) -->
      <div class="flex flex-col items-center space-y-6 max-w-4xl" :style="{ transform: `translateY(${scrollY * 0.08}px)` }">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 border border-slate-200/80 rounded-full text-xs text-slate-600 font-mono font-bold shadow-xs select-none" id="top-badge">
          <CheckCircle class="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          Оптимизировано для GitHub Pages (Vue.js)
        </div>

        <h1 class="text-5xl sm:text-6xl md:text-7.5xl font-display font-extrabold tracking-tight text-slate-950 max-w-4xl leading-tight select-none">
          Один сайт. <br class="hidden sm:inline" />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-emerald-500 via-amber-400 to-orange-500">
            Четыре времени года.
          </span>
        </h1>

        <p class="text-base sm:text-lg text-slate-500 max-w-2xl leading-relaxed">
          Добро пожаловать в портфолио Алексея на Vue.js. Дизайн, вдохновленный простотой Google Chrome, с динамической сменой атмосферных эффектов под каждое технологическое решение.
        </p>
      </div>

      <!-- Personalized Interactive Greeting Form (staggered speed 2) -->
      <div 
        class="w-full max-w-md bg-white p-5 rounded-2xl border border-slate-200/80 shadow-md space-y-3 z-30" 
        id="greeting-box"
        :style="{ transform: `translateY(${scrollY * 0.04}px)` }"
      >
        <p class="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest select-none">
          Персонализация опыта / Interactive
        </p>
        <div class="text-sm font-semibold text-slate-800">
          Приветствуем, <span class="text-indigo-600 font-bold">{{ greetingName }}</span>! Как мы можем обращаться к вам?
        </div>
        <form @submit="handleNameSubmit" class="flex gap-2">
          <input 
            type="text" 
            maxlength="20"
            placeholder="Введите ваше имя..." 
            v-model="userName"
            class="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800 transition-colors"
          />
          <button 
            type="submit" 
            class="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            Применить
          </button>
        </form>
      </div>

      <!-- Scroll Indicator Button (staggered speed 3) -->
      <div class="pt-6 animate-bounce" :style="{ transform: `translateY(${scrollY * 0.02}px)` }">
        <button 
          @click="scrollToSeason('winter')" 
          class="flex flex-col items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
        >
          Листайте вниз к зимнему проекту
          <ChevronDown class="w-4 h-4" />
        </button>
      </div>
    </section>

    <!-- WINTER SECTION -->
    <section 
      id="winter-section"
      ref="winterSection"
      class="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/50 flex flex-col justify-center overflow-hidden z-20 snap-start"
    >
      <!-- Giant Parallax Background Text -->
      <div 
        class="absolute left-[-5%] top-[15%] text-[14rem] sm:text-[18rem] md:text-[24rem] font-display font-black text-sky-400/[0.04] select-none pointer-events-none tracking-tighter uppercase leading-none z-0"
        :style="{ transform: `translateY(${(scrollY - 600) * 0.14}px)` }"
      >
        Winter
      </div>

      <!-- Floating Parallax Rotating Snowflake -->
      <div 
        class="absolute right-[10%] top-[15%] w-28 h-28 text-sky-400/[0.08] pointer-events-none select-none z-0 hidden sm:block"
        :style="{ transform: `translateY(${(scrollY - 600) * -0.15}px) rotate(${(scrollY - 600) * 0.05}deg)` }"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="w-full h-full">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />
          <path stroke-linecap="round" d="M12 6l3 3M12 18l-3-3M6 12l3 3M18 12l-3-3M12 4l-3 3M12 20l3-3M4 12l3-3M20 12l-3 3" />
        </svg>
      </div>

      <SeasonParticles season="winter" :intensity="particleIntensity" :wind-speed="windSpeed" />
      <ProjectShowcase :project="projects[0]" season="winter" :scroll-y="scrollY" />
    </section>

    <!-- SPRING SECTION -->
    <section 
      id="spring-section"
      ref="springSection"
      class="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/50 flex flex-col justify-center overflow-hidden z-20 snap-start"
    >
      <!-- Giant Parallax Background Text -->
      <div 
        class="absolute right-[-5%] top-[20%] text-[14rem] sm:text-[18rem] md:text-[24rem] font-display font-black text-emerald-500/[0.04] select-none pointer-events-none tracking-tighter uppercase leading-none z-0"
        :style="{ transform: `translateY(${(scrollY - 1400) * 0.16}px)` }"
      >
        Spring
      </div>

      <!-- Floating Parallax Rotating Flower Blossom -->
      <div 
        class="absolute left-[8%] top-[20%] w-32 h-32 text-emerald-500/[0.08] pointer-events-none select-none z-0 hidden sm:block"
        :style="{ transform: `translateY(${(scrollY - 1400) * -0.18}px) rotate(${(scrollY - 1400) * -0.04}deg)` }"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="w-full h-full">
          <circle cx="12" cy="12" r="2.5" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 2c1.2 2.5-1.5 4.5-1.5 5.5s.8 2 1.5 2c.7 0 1.5-1 1.5-2s-2.7-3-1.5-5.5z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 22c-1.2-2.5 1.5-4.5 1.5-5.5s-.8-2-1.5-2c-.7 0-1.5 1-1.5 2s2.7 3 1.5 5.5z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M2 12c2.5 1.2 4.5-1.5 5.5-1.5s2 .8 2 1.5c0 .7-1 1.5-2 1.5s-3-2.7-5.5-1.5z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M22 12c-2.5-1.2-4.5 1.5-5.5 1.5s-2-.8-2-1.5c0-.7 1-1.5 2-1.5s3 2.7 5.5 1.5z" />
        </svg>
      </div>

      <SeasonParticles season="spring" :intensity="particleIntensity" :wind-speed="windSpeed" />
      <ProjectShowcase :project="projects[1]" season="spring" :scroll-y="scrollY" />
    </section>

    <!-- SUMMER SECTION -->
    <section 
      id="summer-section"
      ref="summerSection"
      class="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/50 flex flex-col justify-center overflow-hidden z-20 snap-start"
    >
      <!-- Giant Parallax Background Text -->
      <div 
        class="absolute left-[-5%] top-[15%] text-[14rem] sm:text-[18rem] md:text-[24rem] font-display font-black text-amber-500/[0.04] select-none pointer-events-none tracking-tighter uppercase leading-none z-0"
        :style="{ transform: `translateY(${(scrollY - 2200) * 0.12}px)` }"
      >
        Summer
      </div>

      <!-- Floating Parallax Rotating Sun -->
      <div 
        class="absolute right-[12%] top-[12%] w-36 h-36 text-amber-500/[0.08] pointer-events-none select-none z-0 hidden sm:block"
        :style="{ transform: `translateY(${(scrollY - 2200) * -0.14}px) rotate(${(scrollY - 2200) * 0.03}deg)` }"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="w-full h-full">
          <circle cx="12" cy="12" r="4.5" />
          <path stroke-linecap="round" d="M12 1v1.5M12 21.5v1.5M3.5 12h1.5M19 12h1.5M5.3 5.3l1.1 1.1M17.6 17.6l1.1 1.1M5.3 18.7l1.1-1.1M17.6 6.4l1.1-1.1" />
        </svg>
      </div>

      <SeasonParticles season="summer" :intensity="particleIntensity" :wind-speed="windSpeed" />
      <ProjectShowcase :project="projects[2]" season="summer" :scroll-y="scrollY" />
    </section>

    <!-- AUTUMN SECTION -->
    <section 
      id="autumn-section"
      ref="autumnSection"
      class="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/50 flex flex-col justify-center overflow-hidden z-20 snap-start"
    >
      <!-- Giant Parallax Background Text -->
      <div 
        class="absolute right-[-5%] top-[20%] text-[14rem] sm:text-[18rem] md:text-[24rem] font-display font-black text-orange-500/[0.04] select-none pointer-events-none tracking-tighter uppercase leading-none z-0"
        :style="{ transform: `translateY(${(scrollY - 3000) * 0.15}px)` }"
      >
        Autumn
      </div>

      <!-- Floating Parallax Rotating Autumn Leaf -->
      <div 
        class="absolute left-[10%] top-[25%] w-32 h-32 text-orange-500/[0.08] pointer-events-none select-none z-0 hidden sm:block"
        :style="{ transform: `translateY(${(scrollY - 3000) * -0.16}px) rotate(${(scrollY - 3000) * -0.05}deg)` }"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="w-full h-full">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 22V14M12 14c2-3.5 4-3.5 6-1.5C17 9 14.5 8 12 14M12 14c-2-3.5-4-3.5-6-1.5C7 9 9.5 8 12 14" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 11.5l-2.5-2M12 9l2.5-2" />
        </svg>
      </div>

      <SeasonParticles season="autumn" :intensity="particleIntensity" :wind-speed="windSpeed" />
      <ProjectShowcase :project="projects[3]" season="autumn" :scroll-y="scrollY" />
    </section>

    <!-- TECH STANDARDS -->
    <section id="tech-standards" class="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/60 z-20 min-h-screen flex flex-col justify-center snap-start">
      <div class="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <span class="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest block">
          КАЧЕСТВО И СТАНДАРТЫ / Core Values
        </span>
        <h2 class="text-3xl md:text-4xl font-display font-extrabold text-slate-950">
          Соответствие современным веб-стандартам
        </h2>
        <p class="text-sm text-slate-500">
          Точно так же, как браузер Google Chrome задает вектор развития интернета, эти четыре проекта построены с соблюдением лучших технических практик.
        </p>
      </div>

      <!-- Bento Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="standards-grid">
        <!-- Card 1: Speed -->
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
          <div class="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Gauge class="w-5 h-5" />
          </div>
          <div>
            <h4 class="font-bold text-slate-900 text-base">Мгновенный отклик</h4>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">
              Максимальная оптимизация размеров бандлов, сжатие ассетов и отказ от тяжелых фреймворков в пользу чистого рендеринга.
            </p>
          </div>
          <span class="text-[10px] font-mono text-indigo-600 font-bold tracking-wider">LCP &lt; 1.2s</span>
        </div>

        <!-- Card 2: Security -->
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
          <div class="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Shield class="w-5 h-5" />
          </div>
          <div>
            <h4 class="font-bold text-slate-900 text-base">Безопасность песочницы</h4>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">
              Защита от XSS, внедрение CORS, строгое разделение ключей API на бэкенде и изоляция контекста выполнения.
            </p>
          </div>
          <span class="text-[10px] font-mono text-emerald-600 font-bold tracking-wider">HTTP_SECURE_HEADERS</span>
        </div>

        <!-- Card 3: Code clean -->
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
          <div class="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Terminal class="w-5 h-5" />
          </div>
          <div>
            <h4 class="font-bold text-slate-900 text-base">Чистая архитектура</h4>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">
              Строгая типизация с TypeScript, модульность файлов и слабая связанность компонентов для быстрого масштабирования.
            </p>
          </div>
          <span class="text-[10px] font-mono text-amber-600 font-bold tracking-wider">STRICT_TYPESYCRIPT</span>
        </div>

        <!-- Card 4: CI/CD Deploy -->
        <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
          <div class="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
            <Cpu class="w-5 h-5" />
          </div>
          <div>
            <h4 class="font-bold text-slate-900 text-base">Автоматизация CI/CD</h4>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">
              Автоматическое тестирование перед коммитом и мгновенная сборка в Docker/GitHub Pages при каждом пуше в ветку main.
            </p>
          </div>
          <span class="text-[10px] font-mono text-orange-600 font-bold tracking-wider">GITHUB_ACTIONS_READY</span>
        </div>
      </div>
    </section>

    <!-- GITHUB PAGES DEPLOY GUIDE & FOOTER (UNIFIED SCROLL SNAP SCREEN) -->
    <div id="deploy-and-footer" class="relative min-h-screen flex flex-col justify-between snap-start z-20 border-t border-slate-200/50 bg-slate-50/20">
      <section id="skills-sandbox" class="relative py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full flex-1 flex flex-col justify-center">
        <SkillsBowl />
      </section>

      <!-- FOOTER -->
      <footer class="bg-slate-100 border-t border-slate-200 text-slate-500 py-10 px-4 sm:px-6 lg:px-8 relative w-full">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-2.5">
          <div class="w-6 h-6">
            <svg viewBox="0 0 100 100" class="w-full h-full">
              <path d="M 50 50 L 50 10 A 40 40 0 0 0 10 50 Z" fill="#38bdf8" />
              <path d="M 50 50 L 90 50 A 40 40 0 0 0 50 10 Z" fill="#10b981" />
              <path d="M 50 50 L 50 90 A 40 40 0 0 0 90 50 Z" fill="#fbbf24" />
              <path d="M 50 50 L 10 50 A 40 40 0 0 0 50 90 Z" fill="#f97316" />
              <circle cx="50" cy="50" r="16" fill="#ffffff" />
              <circle cx="50" cy="50" r="8" fill="#1e293b" />
            </svg>
          </div>
          <span class="font-display font-bold text-slate-900 text-sm">
            Alexei Gyll Seasons Portfolio (Vue.js)
          </span>
        </div>

        <div class="flex flex-wrap justify-center gap-6 text-xs font-semibold text-slate-500">
          <button @click="scrollToSeason('winter')" class="hover:text-slate-900 cursor-pointer">Зима</button>
          <button @click="scrollToSeason('spring')" class="hover:text-slate-900 cursor-pointer">Весна</button>
          <button @click="scrollToSeason('summer')" class="hover:text-slate-900 cursor-pointer">Лето</button>
          <button @click="scrollToSeason('autumn')" class="hover:text-slate-900 cursor-pointer">Осень</button>
          <span class="text-slate-300">|</span>
          <a href="https://github.com" target="_blank" rel="noreferrer" class="hover:text-slate-900 flex items-center gap-1">
            <Github class="w-3.5 h-3.5" /> Source Code
          </a>
        </div>

        <p class="text-[11px] text-slate-400 font-mono text-center md:text-right">
          © 2026 Alexei Gyll. Designed in Google Chrome Style. Built with Vue 3 & Tailwind.
        </p>
      </div>
      </footer>
    </div>
  </div>
</template>
