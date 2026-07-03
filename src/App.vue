<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { SeasonType, Project } from './types';
import Header from './components/Header.vue';
import ResumeDrawer from './components/ResumeDrawer.vue';
import SeasonParticles from './components/SeasonParticles.vue';
import ProjectShowcase from './components/ProjectShowcase.vue';
import { 
  CheckCircle, ChevronDown, Settings, Sliders, Gauge, Shield, Terminal, Cpu, Copy, Check, Github 
} from 'lucide-vue-next';

const activeSeason = ref<SeasonType>('winter');
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

const handleScroll = () => {
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
  window.addEventListener('scroll', handleScroll);
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
    <section id="hero-landing" class="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col items-center justify-center text-center space-y-10 z-20">
      <div class="flex flex-col items-center space-y-4">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs text-slate-600 font-mono font-semibold" id="top-badge">
          <CheckCircle class="w-3.5 h-3.5 text-emerald-500" />
          Оптимизировано для GitHub Pages (Vue.js)
        </div>

        <h1 class="text-5xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight text-slate-950 max-w-4xl leading-tight">
          Один сайт. <br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-emerald-500 via-amber-400 to-orange-500">
            Четыре времени года.
          </span>
        </h1>

        <p class="text-base sm:text-lg text-slate-500 max-w-2xl leading-relaxed">
          Добро пожаловать в портфолио Алексея на Vue.js. Дизайн, вдохновленный простотой Google Chrome, с динамической сменой атмосферных эффектов под каждое технологическое решение.
        </p>
      </div>

      <!-- Personalized Interactive Greeting Form -->
      <div class="w-full max-w-md bg-white p-5 rounded-2xl border border-slate-200/80 shadow-md space-y-3" id="greeting-box">
        <p class="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
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

      <div class="pt-6 animate-bounce">
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
      class="relative min-h-[90vh] py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/50 flex flex-col justify-center overflow-hidden z-20"
    >
      <SeasonParticles season="winter" :intensity="particleIntensity" :wind-speed="windSpeed" />
      <ProjectShowcase :project="projects[0]" season="winter" />
    </section>

    <!-- SPRING SECTION -->
    <section 
      id="spring-section"
      ref="springSection"
      class="relative min-h-[90vh] py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/50 flex flex-col justify-center overflow-hidden z-20"
    >
      <SeasonParticles season="spring" :intensity="particleIntensity" :wind-speed="windSpeed" />
      <ProjectShowcase :project="projects[1]" season="spring" />
    </section>

    <!-- SUMMER SECTION -->
    <section 
      id="summer-section"
      ref="summerSection"
      class="relative min-h-[90vh] py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/50 flex flex-col justify-center overflow-hidden z-20"
    >
      <SeasonParticles season="summer" :intensity="particleIntensity" :wind-speed="windSpeed" />
      <ProjectShowcase :project="projects[2]" season="summer" />
    </section>

    <!-- AUTUMN SECTION -->
    <section 
      id="autumn-section"
      ref="autumnSection"
      class="relative min-h-[90vh] py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/50 flex flex-col justify-center overflow-hidden z-20"
    >
      <SeasonParticles season="autumn" :intensity="particleIntensity" :wind-speed="windSpeed" />
      <ProjectShowcase :project="projects[3]" season="autumn" />
    </section>

    <!-- TECH STANDARDS -->
    <section id="tech-standards" class="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/60 z-20">
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

    <!-- GITHUB PAGES DEPLOY GUIDE -->
    <section id="deploy-guide" class="relative py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto z-20">
      <div class="bg-slate-900 text-slate-100 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-slate-800 text-indigo-400 flex items-center justify-center font-mono font-bold">
            GP
          </div>
          <div>
            <h3 class="text-lg font-bold text-white">Инструкция по публикации на GitHub Pages</h3>
            <p class="text-xs text-slate-400">Как выложить этот сайт портфолио в ваш открытый репозиторий за 3 шага.</p>
          </div>
        </div>

        <div class="space-y-4">
          <!-- Step 1 -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-xs font-semibold text-indigo-300">
              <span class="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-300 flex items-center justify-center text-[10px]">1</span>
              Установите пакет gh-pages
            </div>
            <p class="text-xs text-slate-400 leading-normal pl-7">
              Добавьте специальный пакет в devDependencies вашего проекта для автоматического деплоя билда в ветку <code class="bg-slate-800 px-1 py-0.5 rounded text-indigo-200">gh-pages</code>.
            </p>
            <div class="ml-7 bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between font-mono text-xs text-indigo-200 select-all">
              <span>npm install --save-dev gh-pages</span>
              <button 
                @click="copyToClipboard(npmInstallCmd, 'npm-install')"
                class="p-1 hover:bg-slate-800 rounded cursor-pointer text-slate-500 hover:text-white"
                title="Copy command"
              >
                <Check v-if="copiedCommand === 'npm-install'" class="w-4 h-4 text-emerald-500" />
                <Copy v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-xs font-semibold text-indigo-300">
              <span class="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-300 flex items-center justify-center text-[10px]">2</span>
              Добавьте скрипты развертывания в package.json
            </div>
            <p class="text-xs text-slate-400 leading-normal pl-7">
              Добавьте скрипты <code class="bg-slate-800 px-1 py-0.5 rounded text-indigo-200">predeploy</code> и <code class="bg-slate-800 px-1 py-0.5 rounded text-indigo-200">deploy</code> в блок <code class="bg-slate-800 px-1 py-0.5 rounded text-indigo-200">"scripts"</code>. Также укажите поле <code class="bg-slate-800 px-1 py-0.5 rounded text-indigo-200">"homepage": "https://username.github.io/repo-name"</code>.
            </p>
            <div class="ml-7 bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between font-mono text-xs text-indigo-200 select-all">
              <pre class="text-[10px] leading-relaxed">
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"</pre>
              <button 
                @click="copyToClipboard(scriptsJsonCode, 'scripts-json')"
                class="p-1 hover:bg-slate-800 rounded cursor-pointer text-slate-500 hover:text-white"
                title="Copy JSON"
              >
                <Check v-if="copiedCommand === 'scripts-json'" class="w-4 h-4 text-emerald-500" />
                <Copy v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-xs font-semibold text-indigo-300">
              <span class="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-300 flex items-center justify-center text-[10px]">3</span>
              Запустите команду деплоя
            </div>
            <p class="text-xs text-slate-400 leading-normal pl-7">
              Запустите терминальную команду. Пакет скомпилирует приложение в папку <code class="bg-slate-800 px-1 py-0.5 rounded text-indigo-200">dist</code> и автоматически запушит файлы на ваш GitHub Pages!
            </p>
            <div class="ml-7 bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between font-mono text-xs text-indigo-200 select-all">
              <span>npm run deploy</span>
              <button 
                @click="copyToClipboard(npmDeployCmd, 'run-deploy')"
                class="p-1 hover:bg-slate-800 rounded cursor-pointer text-slate-500 hover:text-white"
                title="Copy command"
              >
                <Check v-if="copiedCommand === 'run-deploy'" class="w-4 h-4 text-emerald-500" />
                <Copy v-else class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>💡 Подсказка: В этой Vue.js версии параметр base настроен на автоматическое относительное разрешение путей (<code class="bg-slate-800 px-1 rounded text-slate-300">./</code>)! Деплойте без изменений!</span>
          <span class="text-indigo-400 font-bold">Успешного деплоя! 🚀</span>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="bg-slate-100 border-t border-slate-200 text-slate-500 py-12 px-4 sm:px-6 lg:px-8 z-20 relative">
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
</template>
