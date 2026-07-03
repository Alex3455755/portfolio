<script setup lang="ts">
import { ref } from 'vue';
import { SeasonType } from '../types';
import { 
  X, Briefcase, Mail, Check, Code, Cpu, Layers, Terminal, Send, Github, Linkedin
} from 'lucide-vue-next';

const props = defineProps<{
  isOpen: boolean;
  activeSeason: SeasonType;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const formSubmitted = ref(false);
const name = ref('');
const email = ref('');
const message = ref('');
const sending = ref(false);

const seasonalIntro = {
  winter: 'Как зимний лед обеспечивает прочную основу, я закладываю архитектуру, устойчивую к экстремальным нагрузкам и безотказную в любых условиях.',
  spring: 'Весеннее цветение вдохновляет меня на создание чистых, эстетичных интерфейсов с плавной реактивной анимацией, радующей глаз.',
  summer: 'Летний зной символизирует высокую пропускную способность: я запускаю реалтайм микросервисы и масштабируемые системы на максимальных скоростях.',
  autumn: 'Осень — время сбора урожая: я автоматизирую конвейеры CI/CD, собираю логи телеметрии, провожу рефакторинг и закрываю технический долг.'
};

const handleContactSubmit = (e: Event) => {
  e.preventDefault();
  if (!name.value || !email.value || !message.value) return;
  
  sending.value = true;
  setTimeout(() => {
    sending.value = false;
    formSubmitted.value = true;
    name.value = '';
    email.value = '';
    message.value = '';
  }, 1200);
};
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-hidden">
    <!-- Backdrop blur overlay with fade-in effect -->
    <div
      @click="emit('close')"
      class="absolute inset-0 bg-slate-900/50 backdrop-blur-xs cursor-pointer transition-opacity duration-300"
      id="drawer-backdrop"
    />

    <!-- Drawer Panel with custom slide animation -->
    <div
      class="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col overflow-hidden border-l border-slate-200 animate-slide-in"
      id="drawer-panel"
    >
      <!-- Drawer Header -->
      <div class="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-display font-extrabold text-lg">
            A
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900">Портфолио & Резюме</h3>
            <p class="text-xs text-slate-500 font-mono">SEASONS_DEVELOPER_PROFILE</p>
          </div>
        </div>
        
        <button 
          @click="emit('close')"
          class="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer transition-colors"
          aria-label="Close panel"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Scrollable Drawer Body -->
      <div class="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin">
        <!-- Profile Intro Card -->
        <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 relative overflow-hidden">
          <div class="absolute top-0 left-0 h-1 w-full" :class="{
            'bg-sky-400': activeSeason === 'winter',
            'bg-emerald-500': activeSeason === 'spring',
            'bg-amber-400': activeSeason === 'summer',
            'bg-orange-500': activeSeason === 'autumn'
          }" />
          <span class="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-widest block">
            АКТИВНОЕ НАСТРОЕНИЕ: {{ activeSeason.toUpperCase() }}
          </span>
          <p class="text-sm font-semibold text-slate-800 leading-relaxed italic">
            "{{ seasonalIntro[activeSeason] }}"
          </p>
        </div>

        <!-- Bio Details -->
        <div class="space-y-4">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2">
            <Briefcase class="w-4 h-4 text-slate-500" /> Обо мне / Background
          </h4>
          <div class="space-y-4 text-sm text-slate-600 leading-relaxed">
            <p>
              Привет! Меня зовут <strong>Алексей</strong>, я full-stack разработчик. Я создаю веб-приложения с упором на эстетичную визуализацию, высокую надежность и отзывчивые интерфейсы.
            </p>
            <p>
              Мой уникальный подход заключается в <strong>"сезонном" разделении навыков</strong>, что позволяет мне гармонично сочетать фундаментальную серверную надежность с ярким интерактивным фронтендом.
            </p>
          </div>
        </div>

        <!-- Seasonal Skills Quadrant -->
        <div class="space-y-4">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2">
            <Code class="w-4 h-4 text-slate-500" /> Сезонные Навыки (Seasonal Skills)
          </h4>
          
          <div class="grid grid-cols-1 gap-4">
            <!-- Winter (Blue) -->
            <div class="p-3.5 rounded-lg border border-sky-100 bg-sky-50/40 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-sky-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Terminal class="w-3.5 h-3.5 text-sky-500" /> Зима: Архитектура & База
                </span>
                <span class="text-[10px] font-mono font-bold text-sky-600">СТАБИЛЬНОСТЬ</span>
              </div>
              <p class="text-[11px] text-slate-600 leading-tight">Системное проектирование, SQL/NoSQL базы данных, кэширование (Redis), безопасность API, надежные бекэнд контейнеры.</p>
            </div>

            <!-- Spring (Green) -->
            <div class="p-3.5 rounded-lg border border-emerald-100 bg-emerald-50/40 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Layers class="w-3.5 h-3.5 text-emerald-500" /> Весна: UI/UX & Анимации
                </span>
                <span class="text-[10px] font-mono font-bold text-emerald-600">РЕАКТИВНОСТЬ</span>
              </div>
              <p class="text-[11px] text-slate-600 leading-tight">React/Vue, Tailwind CSS, Framer Motion, адаптивная верстка, микро-анимации, графики Recharts & D3, дизайн системы.</p>
            </div>

            <!-- Summer (Yellow) -->
            <div class="p-3.5 rounded-lg border border-amber-100 bg-amber-50/40 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-amber-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Cpu class="w-3.5 h-3.5 text-amber-500" /> Лето: Real-time & Cloud
                </span>
                <span class="text-[10px] font-mono font-bold text-amber-600">СКОРОСТЬ</span>
              </div>
              <p class="text-[11px] text-slate-600 leading-tight">WebSockets, Node.js высокая нагрузка, serverless облачные вычисления, оптимизация CDN, real-time фиды.</p>
            </div>

            <!-- Autumn (Orange) -->
            <div class="p-3.5 rounded-lg border border-orange-100 bg-orange-50/40 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-orange-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Briefcase class="w-3.5 h-3.5 text-orange-500" /> Осень: DevOps & Сборка
                </span>
                <span class="text-[10px] font-mono font-bold text-orange-600">УРОЖАЙ</span>
              </div>
              <p class="text-[11px] text-slate-600 leading-tight">Автоматизация CI/CD (GitHub Actions), Docker, Docker-Compose, мониторинг (Sentry, Prometheus), рефакторинг кода.</p>
            </div>
          </div>
        </div>

        <!-- Interactive Contact Form -->
        <div class="space-y-4 pt-4 border-t border-slate-100">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2">
            <Mail class="w-4 h-4 text-slate-500" /> Связаться со мной / Contact
          </h4>

          <div 
            v-if="formSubmitted"
            class="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2"
          >
            <div class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto">
              <Check class="w-6 h-6" />
            </div>
            <h5 class="font-bold text-emerald-900">Спасибо! Сообщение отправлено</h5>
            <p class="text-xs text-emerald-700">Алексей ответит вам на указанный email в самое ближайшее время.</p>
            <button 
              @click="formSubmitted = false"
              class="mt-2 text-xs font-bold text-emerald-800 underline hover:text-emerald-950 cursor-pointer"
            >
              Отправить еще одно
            </button>
          </div>
          
          <form v-else @submit="handleContactSubmit" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Имя</label>
              <input 
                type="text" 
                required
                v-model="name"
                placeholder="Александр Иванов"
                class="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-slate-800 transition-colors"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
              <input 
                type="email" 
                required
                v-model="email"
                placeholder="alexander@example.com"
                class="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-slate-800 transition-colors"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Сообщение</label>
              <textarea 
                required
                rows="4"
                v-model="message"
                placeholder="Здравствуйте! Хочу пригласить вас на проект..."
                class="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-slate-800 transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              :disabled="sending"
              class="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              {{ sending ? 'Отправка...' : 'Отправить сообщение' }}
              <Send class="w-4 h-4" />
            </button>
          </form>
        </div>

        <!-- Social links -->
        <div class="flex justify-center gap-6 pt-4 text-slate-400 border-t border-slate-100">
          <a href="https://github.com" target="_blank" rel="noreferrer" class="hover:text-slate-800 flex items-center gap-1.5 text-xs font-semibold">
            <Github class="w-4 h-4" /> GitHub
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" class="hover:text-slate-800 flex items-center gap-1.5 text-xs font-semibold">
            <Linkedin class="w-4 h-4" /> LinkedIn
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
.animate-slide-in {
  animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
