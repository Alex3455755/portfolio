<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { SeasonType } from '../types';
import { Download, Menu, X } from 'lucide-vue-next';

const props = defineProps<{
  activeSeason: SeasonType;
}>();

const emit = defineEmits<{
  (e: 'scrollToSeason', season: SeasonType): void;
  (e: 'showResume'): void;
}>();

const scrolled = ref(false);
const mobileMenuOpen = ref(false);

const handleScroll = () => {
  scrolled.value = window.scrollY > 30;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const menuItems: { id: SeasonType; label: string; color: string }[] = [
  { id: 'winter', label: 'Зима (Winter)', color: 'text-sky-500' },
  { id: 'spring', label: 'Весна (Spring)', color: 'text-emerald-500' },
  { id: 'summer', label: 'Лето (Summer)', color: 'text-amber-500' },
  { id: 'autumn', label: 'Осень (Autumn)', color: 'text-orange-500' },
];

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
  <header 
    id="portfolio-header"
    class="fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b"
    :class="scrolled 
      ? 'bg-white/80 backdrop-blur-md shadow-sm border-slate-200/50 py-3' 
      : 'bg-transparent border-transparent py-5'"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <!-- LOGO: Google Chrome inspired minimalist circular multi-season spinner logo -->
      <div 
        @click="scrollToTop" 
        class="flex items-center gap-2.5 cursor-pointer group select-none"
        id="header-logo"
      >
        <div class="relative w-8 h-8 transition-transform duration-700 group-hover:rotate-180">
          <!-- SVG Seasons wheel -->
          <svg viewBox="0 0 100 100" class="w-full h-full">
            <!-- Winter: Top-Left Segment (Sky Blue) -->
            <path d="M 50 50 L 50 10 A 40 40 0 0 0 10 50 Z" fill="#38bdf8" />
            <!-- Spring: Top-Right Segment (Emerald Green) -->
            <path d="M 50 50 L 90 50 A 40 40 0 0 0 50 10 Z" fill="#10b981" />
            <!-- Summer: Bottom-Right Segment (Amber Gold) -->
            <path d="M 50 50 L 50 90 A 40 40 0 0 0 90 50 Z" fill="#fbbf24" />
            <!-- Autumn: Bottom-Left Segment (Orange Rust) -->
            <path d="M 50 50 L 10 50 A 40 40 0 0 0 50 90 Z" fill="#f97316" />
            <!-- Center White Core representing developer synergy -->
            <circle cx="50" cy="50" r="16" fill="#ffffff" />
            <circle cx="50" cy="50" r="8" fill="#1e293b" />
          </svg>
        </div>
        <div class="flex flex-col">
          <span class="font-display font-bold tracking-tight text-slate-950 text-sm sm:text-base">
            Alexei <span class="text-slate-500 font-normal">Gyll</span>
          </span>
          <span class="text-[10px] font-mono text-slate-400 font-bold tracking-widest uppercase">
            SEASONS_DEV
          </span>
        </div>
      </div>

      <!-- Desktop Navigation links -->
      <nav class="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200" id="desktop-nav">
        <button
          v-for="item in menuItems"
          :key="item.id"
          @click="emit('scrollToSeason', item.id)"
          class="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all flex items-center"
          :class="activeSeason === item.id 
            ? 'bg-white text-slate-900 shadow-sm font-bold' 
            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'"
        >
          <span class="inline-block w-2 h-2 rounded-full mr-1.5" :class="{
            'bg-sky-400': item.id === 'winter',
            'bg-emerald-500': item.id === 'spring',
            'bg-amber-400': item.id === 'summer',
            'bg-orange-500': item.id === 'autumn'
          }" />
          {{ item.id }}
        </button>
      </nav>

      <!-- Action Buttons -->
      <div class="hidden md:flex items-center gap-3">
        <button
          @click="emit('showResume')"
          class="px-4 py-1.5 border border-slate-300 hover:border-slate-500 hover:bg-slate-50 rounded-full font-medium text-xs flex items-center gap-1.5 text-slate-700 cursor-pointer transition-all"
          id="btn-resume-header"
        >
          <Download class="w-3.5 h-3.5" />
          Резюме / Profile
        </button>
        
        <span class="px-2.5 py-1 bg-slate-900 text-white rounded-full font-mono text-[10px] font-bold">
          V1.0
        </span>
      </div>

      <!-- Mobile Hamburger Trigger -->
      <div class="md:hidden flex items-center gap-2">
        <button
          @click="emit('showResume')"
          class="p-1.5 border border-slate-300 rounded-full text-slate-600 hover:bg-slate-50"
          aria-label="Download Profile"
        >
          <Download class="w-4 h-4" />
        </button>
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="p-1.5 text-slate-700 bg-slate-100 border border-slate-200 rounded-full"
          aria-label="Toggle Menu"
        >
          <X v-if="mobileMenuOpen" class="w-5 h-5" />
          <Menu v-else class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Mobile Dropdown Menu -->
    <div v-if="mobileMenuOpen" class="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-lg px-4 py-4 space-y-2" id="mobile-nav-panel">
      <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1">
        Выбор Экрана / Seasons
      </div>
      <button
        v-for="item in menuItems"
        :key="item.id"
        @click="emit('scrollToSeason', item.id); mobileMenuOpen = false"
        class="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between border"
        :class="activeSeason === item.id 
          ? 'bg-slate-50 border-slate-200 text-slate-900 font-bold' 
          : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-50'"
      >
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full" :class="{
            'bg-sky-400': item.id === 'winter',
            'bg-emerald-500': item.id === 'spring',
            'bg-amber-400': item.id === 'summer',
            'bg-orange-500': item.id === 'autumn'
          }" />
          <span class="capitalize">{{ item.id }} Project</span>
        </div>
        <span class="text-xs font-mono text-slate-400">Section {{ item.id === 'winter' ? 'I' : item.id === 'spring' ? 'II' : item.id === 'summer' ? 'III' : 'IV' }}</span>
      </button>
      <div class="pt-2 border-t border-slate-100 flex items-center justify-between px-2 text-xs">
        <span class="text-slate-400">Hosting on GitHub Pages</span>
        <span class="text-emerald-500 font-bold">Ready</span>
      </div>
    </div>
  </header>
</template>
