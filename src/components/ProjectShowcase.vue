<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { Project, SeasonType } from '../types';
import { 
  Globe, ArrowRight, RefreshCw, Lock, CheckCircle, 
  AlertTriangle, Sun, Wind, Thermometer,
  Droplet, ShieldCheck, Info
} from 'lucide-vue-next';

const props = defineProps<{
  project: Project;
  season: SeasonType;
  scrollY?: number;
}>();

const activeTab = ref(0);
const isRefreshing = ref(false);
const isLargeScreen = ref(false);

const updateScreenSize = () => {
  isLargeScreen.value = typeof window !== 'undefined' && window.innerWidth >= 1024;
};

onMounted(() => {
  updateScreenSize();
  window.addEventListener('resize', updateScreenSize);
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateScreenSize);
  }
});

// Interactive states for Winter (SkiFlow)
const winterLifts = ref([
  { id: '1', name: 'Peak Express', status: 'Open', wait: 2 },
  { id: '2', name: 'Alpine Gondola', status: 'Open', wait: 5 },
  { id: '3', name: 'Glacier Chair', status: 'Closed', wait: 0 },
  { id: '4', name: 'Snow Valley Quad', status: 'Open', wait: 1 },
]);
const selectedSlope = ref('Powder Peak');
const safetyAlert = ref(false);

// Interactive states for Spring (BloomHub)
const soilMoisture = ref(42);
const sunlightPercent = ref(65);
const plantState = ref<'seedling' | 'growing' | 'bloomed'>('growing');
const waterSuccess = ref(false);

// Interactive states for Summer (Solis)
const selectedBeach = ref('Gold Coast');
const swellHeight = ref(1.8);
const surfQuality = ref('Epic');

// Interactive states for Autumn (HarvestChain)
const selectedCargo = ref('Sugar Maple Syrup');
const cargoList = ref([
  { id: '1', name: 'Sugar Maple Syrup', temp: '14°C', location: 'Vermont Transit Hub', status: 'Verified' },
  { id: '2', name: 'Gourmet Pumpkins', temp: '11°C', location: 'Albany Warehouse', status: 'In Transit' },
  { id: '3', name: 'Crisp Honeycrisp Apples', temp: '4°C', location: 'New York Central Port', status: 'Verified' },
]);
const isScanning = ref(false);
const scanResult = ref<string | null>(null);

// Reset tab when project changes
watch(
  () => props.project.id,
  () => {
    activeTab.value = 0;
  }
);

const triggerRefresh = () => {
  isRefreshing.value = true;
  setTimeout(() => {
    isRefreshing.value = false;
    if (props.season === 'winter') {
      winterLifts.value = winterLifts.value.map(l => ({
        ...l,
        wait: Math.max(0, l.wait + Math.floor(Math.random() * 3) - 1)
      }));
    } else if (props.season === 'spring') {
      waterSuccess.value = false;
    } else if (props.season === 'autumn') {
      scanResult.value = null;
    }
  }, 800);
};

const handleWaterPlant = () => {
  soilMoisture.value = Math.min(100, soilMoisture.value + 15);
  waterSuccess.value = true;
  setTimeout(() => {
    if (soilMoisture.value >= 75) {
      plantState.value = 'bloomed';
    } else {
      plantState.value = 'growing';
    }
  }, 100);
};

const handleScanLedger = () => {
  isScanning.value = true;
  scanResult.value = null;
  setTimeout(() => {
    isScanning.value = false;
    const hash = '0xef41...397fd';
    scanResult.value = `Block Hash: ${hash} - Integrity Verified 100%`;
  }, 1200);
};
</script>

<template>
  <div :id="`project-showcase-${project.id}`" class="w-full flex flex-col lg:flex-row gap-12 lg:gap-16 items-stretch">
    <!-- LEFT: Project Text Details -->
    <div class="w-full lg:w-5/12 flex flex-col justify-center space-y-6">
      <div class="space-y-3">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-sm border transition-all duration-500"
          :class="{
            'bg-sky-50 text-sky-700 border-sky-100': season === 'winter',
            'bg-emerald-50 text-emerald-700 border-emerald-100': season === 'spring',
            'bg-amber-50 text-amber-700 border-amber-100': season === 'summer',
            'bg-orange-50 text-orange-700 border-orange-100': season === 'autumn',
          }"
          :id="`tag-${project.id}`"
        >
          {{ season }} PROJECT
        </div>
        <h3 class="text-3xl md:text-4xl font-display font-bold tracking-tight text-slate-900" :id="`title-${project.id}`">
          {{ project.title }}
        </h3>
        <p class="text-lg font-medium text-slate-600 italic" :id="`tagline-${project.id}`">
          "{{ project.tagline }}"
        </p>
      </div>

      <p class="text-slate-600 leading-relaxed text-sm md:text-base" :id="`desc-${project.id}`">
        {{ project.description }}
      </p>

      <!-- Tech Stack Badges -->
      <div class="space-y-2">
        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Tech Stack</span>
        <div class="flex flex-wrap gap-2" :id="`tech-stack-${project.id}`">
          <span 
            v-for="tech in project.techStack"
            :key="tech" 
            class="px-2.5 py-1 rounded text-xs font-medium font-mono bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 transition-colors cursor-default"
          >
            {{ tech }}
          </span>
        </div>
      </div>

      <!-- Dynamic Project Performance Stats -->
      <div class="grid grid-cols-2 gap-4 pt-2" :id="`stats-grid-${project.id}`">
        <div v-for="(stat, i) in project.stats" :key="i" class="p-3 bg-white/60 border border-slate-100 rounded-lg shadow-xs">
          <div class="text-xs text-slate-400 uppercase font-medium">{{ stat.label }}</div>
          <div class="text-lg font-display font-bold text-slate-800">{{ stat.value }}</div>
        </div>
      </div>

      <!-- Project Links -->
      <div class="flex items-center gap-4 pt-4" :id="`links-${project.id}`">
        <a 
          v-if="project.githubUrl"
          :href="project.githubUrl" 
          target="_blank" 
          rel="noreferrer" 
          class="px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer"
        >
          GitHub Code
          <ArrowRight class="w-4 h-4" />
        </a>
        <a 
          v-if="project.liveUrl"
          :href="project.liveUrl" 
          target="_blank" 
          rel="noreferrer" 
          class="px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
        >
          Live Demo
          <Globe class="w-4 h-4" />
        </a>
      </div>
    </div>

    <!-- RIGHT: Chrome Browser Showcase Frame (foreground card drifts faster for depth) -->
    <div 
      class="w-full lg:w-7/12 flex flex-col" 
      :id="`chrome-browser-frame-${project.id}`"
      :style="isLargeScreen && scrollY !== undefined ? { 
        transform: `translateY(${(scrollY - (season === 'winter' ? 650 : season === 'spring' ? 1450 : season === 'summer' ? 2250 : 3050)) * -0.05}px)`
      } : {}"
    >
      <div class="w-full bg-slate-100 border border-slate-200 rounded-xl shadow-xl flex flex-col flex-1 overflow-hidden transition-all duration-500 hover:shadow-2xl">
        <!-- Chrome Top Bar -->
        <div class="px-4 py-3 bg-slate-200 border-b border-slate-300 flex items-center gap-4 select-none">
          <!-- Browser Dots -->
          <div class="flex gap-1.5 shrink-0">
            <span class="w-3 h-3 rounded-full bg-rose-400 block" />
            <span class="w-3 h-3 rounded-full bg-amber-400 block" />
            <span class="w-3 h-3 rounded-full bg-emerald-400 block" />
          </div>

          <!-- Address Bar -->
          <div class="flex-1 bg-white border border-slate-300 rounded-md px-3 py-1 flex items-center gap-2 text-xs text-slate-500 font-mono shadow-xs overflow-hidden">
            <Lock class="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span class="truncate">https://{{ project.id }}.alexei-dev.pages.dev/dashboard</span>
            <button 
              @click="triggerRefresh" 
              class="ml-auto hover:text-slate-800 cursor-pointer p-0.5 rounded transition-transform duration-700"
              :class="{ 'rotate-360': isRefreshing }"
              aria-label="Refresh page"
            >
              <RefreshCw class="w-3 h-3" />
            </button>
          </div>
          
          <span class="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-300/60 text-[10px] font-mono text-slate-600">
            CHROME_SECURE
          </span>
        </div>

        <!-- Project Feature Selector (Tabs) -->
        <div class="px-4 bg-slate-50 border-b border-slate-200 flex overflow-x-auto scrollbar-none shrink-0">
          <button
            v-for="(feature, idx) in project.features"
            :key="idx"
            @click="activeTab = idx"
            class="py-2 px-4 text-xs font-semibold whitespace-nowrap cursor-pointer transition-all border-b-2 relative"
            :class="activeTab === idx 
              ? 'text-slate-900 border-slate-900 font-bold bg-slate-100/50' 
              : 'text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-100/30'"
          >
            {{ feature.title }}
          </button>
        </div>

        <!-- Interactive Screen Workspace -->
        <div class="p-4 sm:p-6 bg-white flex-1 min-h-[350px] flex flex-col relative overflow-hidden">
          <div v-if="isRefreshing" class="absolute inset-0 bg-white/90 z-20 flex flex-col items-center justify-center space-y-3">
            <RefreshCw class="w-8 h-8 text-indigo-500 animate-spin" />
            <span class="text-xs font-mono font-bold text-slate-500">Re-fetching secure sandbox...</span>
          </div>

          <!-- Render interactive UI content of the feature -->
          <div class="flex-1 flex flex-col">
            <div class="mb-4">
              <div class="flex items-center gap-2 mb-1">
                <Info class="w-4 h-4 text-slate-400 shrink-0" />
                <span class="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Active View</span>
              </div>
              <h4 class="text-base font-bold text-slate-800">{{ project.features[activeTab].title }}</h4>
              <p class="text-xs text-slate-500">{{ project.features[activeTab].description }}</p>
            </div>

            <!-- Dynamic interactive zones based on season and selected feature -->
            <div class="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-inner flex flex-col justify-between overflow-y-auto">
              <!-- WINTER: SkiFlow Interactive App -->
              <div v-if="season === 'winter'" class="space-y-4 flex flex-col flex-1 justify-between">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Slope Selector / Status -->
                  <div class="bg-white p-3 rounded-md border border-slate-200">
                    <span class="text-[10px] uppercase font-bold text-slate-400">Track Slope Traffic</span>
                    <div class="flex items-center justify-between mt-1">
                      <span class="text-sm font-bold text-slate-800">{{ selectedSlope }}</span>
                      <span class="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-semibold">Perfect Powder</span>
                    </div>
                    <div class="mt-3 grid grid-cols-2 gap-2">
                      <button
                        v-for="slope in ['Powder Peak', 'Glacier Bowl', 'Black Forest', 'Aspen Glen']"
                        :key="slope"
                        @click="selectedSlope = slope"
                        class="text-[10px] px-2 py-1 rounded text-center cursor-pointer font-medium border transition-colors"
                        :class="selectedSlope === slope
                          ? 'bg-sky-600 text-white border-sky-600'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'"
                      >
                        {{ slope }}
                      </button>
                    </div>
                  </div>

                  <!-- Lift Status Board -->
                  <div class="bg-white p-3 rounded-md border border-slate-200">
                    <span class="text-[10px] uppercase font-bold text-slate-400">Live Lifts Tracker</span>
                    <div class="space-y-1.5 mt-2 max-h-[110px] overflow-y-auto pr-1">
                      <div v-for="lift in winterLifts" :key="lift.id" class="flex items-center justify-between text-xs py-0.5 border-b border-slate-100">
                        <span class="font-medium text-slate-700">{{ lift.name }}</span>
                        <div class="flex items-center gap-2">
                          <span class="text-[9px] font-bold px-1.5 rounded" :class="lift.status === 'Open' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'">
                            {{ lift.status }}
                          </span>
                          <span v-if="lift.status === 'Open'" class="text-slate-400 text-[9px] font-mono">{{ lift.wait }}m wait</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Interactive Slider & Emergency Trigger -->
                <div class="mt-4 p-3 bg-white border border-slate-200 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div class="space-y-1">
                    <div class="flex items-center gap-1.5">
                      <Thermometer class="w-3.5 h-3.5 text-sky-500" />
                      <span class="text-xs font-bold text-slate-700">Temperature Tracker: -8°C</span>
                    </div>
                    <p class="text-[10px] text-slate-500">Adjust safety alert simulating extreme mountain storms.</p>
                  </div>
                  <div class="flex items-center gap-3">
                    <button
                      @click="safetyAlert = !safetyAlert"
                      class="px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                      :class="safetyAlert 
                        ? 'bg-rose-600 text-white animate-pulse' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'"
                    >
                      <AlertTriangle class="w-3.5 h-3.5" />
                      {{ safetyAlert ? 'Storm Active!' : 'Simulate Storm' }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- SPRING: BloomHub Interactive App -->
              <div v-if="season === 'spring'" class="space-y-4 flex flex-col flex-1 justify-between">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Sensors Readout -->
                  <div class="bg-white p-3 rounded-md border border-slate-200 flex flex-col justify-between">
                    <div>
                      <span class="text-[10px] uppercase font-bold text-slate-400">Greenhouse IoT Telemetry</span>
                      <div class="space-y-2 mt-2">
                        <div class="flex items-center justify-between text-xs">
                          <span class="flex items-center gap-1 text-slate-600"><Droplet class="w-3 h-3 text-sky-500" /> Soil Moisture</span>
                          <span class="font-mono font-bold text-slate-800">{{ soilMoisture }}%</span>
                        </div>
                        <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div class="h-full bg-sky-500 rounded-full transition-all duration-300" :style="{ width: `${soilMoisture}%` }" />
                        </div>

                        <div class="flex items-center justify-between text-xs mt-1">
                          <span class="flex items-center gap-1 text-slate-600"><Sun class="w-3 h-3 text-amber-500" /> Sunlight Intensity</span>
                          <span class="font-mono font-bold text-slate-800">{{ sunlightPercent }}%</span>
                        </div>
                        <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div class="h-full bg-amber-400 rounded-full transition-all duration-300" :style="{ width: `${sunlightPercent}%` }" />
                        </div>
                      </div>
                    </div>

                    <div class="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                      <button
                        @click="handleWaterPlant"
                        class="flex-1 py-1 px-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        <Droplet class="w-3 h-3" /> Water Soil (+15%)
                      </button>
                      <button
                        @click="sunlightPercent = sunlightPercent === 90 ? 45 : sunlightPercent + 15 > 100 ? 50 : sunlightPercent + 15"
                        class="py-1 px-2.5 rounded border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-[10px] flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Sun class="w-3 h-3 text-amber-500" /> Light
                      </button>
                    </div>
                  </div>

                  <!-- Plant Growth Mock Visualizer -->
                  <div class="bg-white p-3 rounded-md border border-slate-200 flex flex-col items-center justify-center text-center">
                    <span class="text-[10px] uppercase font-bold text-slate-400 self-start">Active Crop Growth</span>
                    
                    <div class="my-auto py-4 flex flex-col items-center justify-center">
                      <!-- Cute SVG Flower -->
                      <div class="relative w-16 h-16 flex items-end justify-center mb-1">
                        <!-- Stem -->
                        <div class="w-1.5 bg-emerald-500 rounded-full transition-all duration-500" :style="{ height: plantState === 'seedling' ? '20px' : plantState === 'growing' ? '40px' : '55px' }">
                          <!-- Leaves -->
                          <template v-if="plantState !== 'seedling'">
                            <div class="absolute left-4 bottom-6 w-3 h-2 bg-emerald-500 rounded-full rotate-[30deg] origin-right" />
                            <div class="absolute right-4 bottom-3 w-3 h-2 bg-emerald-500 rounded-full rotate-[-30deg] origin-left" />
                          </template>
                          <!-- Blossom head -->
                          <div 
                            v-if="plantState === 'bloomed'"
                            class="absolute top-[-10px] left-[-9px] w-6 h-6 rounded-full bg-rose-400 flex items-center justify-center transition-transform duration-500 scale-100"
                          >
                            <div class="w-3 h-3 rounded-full bg-amber-300" />
                          </div>
                        </div>
                      </div>

                      <span class="text-xs font-semibold capitalize text-slate-700">
                        Status: {{ plantState === 'seedling' ? 'Seedling' : plantState === 'growing' ? 'Growing Vine' : '🌸 Fully Bloomed!' }}
                      </span>
                      <p class="text-[9px] text-slate-400 mt-0.5">Moisture triggers blossom. Goal: &gt;75% moisture.</p>
                    </div>
                  </div>
                </div>

                <div v-if="waterSuccess" class="p-2 bg-emerald-50 border border-emerald-100 rounded text-[10px] text-emerald-800 font-medium text-center flex items-center justify-center gap-1.5">
                  <CheckCircle class="w-3.5 h-3.5 text-emerald-600" />
                  Hydrated! Crop is responding nicely to Spring rainfall signals.
                </div>
              </div>

              <!-- SUMMER: Solis Surf Interactive App -->
              <div v-if="season === 'summer'" class="space-y-4 flex flex-col flex-1 justify-between">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Swell Dial -->
                  <div class="bg-white p-3 rounded-md border border-slate-200">
                    <span class="text-[10px] uppercase font-bold text-slate-400">Live Swell Meter</span>
                    <div class="flex flex-col items-center justify-center py-4 text-center">
                      <span class="text-3xl font-display font-extrabold text-slate-800 font-mono">{{ swellHeight.toFixed(1) }}m</span>
                      <span class="text-xs font-semibold text-slate-500 flex items-center gap-1 mt-1">
                        Swell Quality: <span class="text-amber-600 font-bold">{{ surfQuality }}</span>
                      </span>
                      <!-- Slider to adjust wave height -->
                      <div class="w-full mt-4 px-2">
                        <input 
                          type="range" 
                          min="0.5" 
                          max="4.0" 
                          step="0.1"
                          :value="swellHeight" 
                          @input="(e: any) => {
                            const h = parseFloat(e.target.value);
                            swellHeight = h;
                            if (h < 1.2) {
                              surfQuality = 'Poor';
                            } else if (h < 2.0) {
                              surfQuality = 'Clean';
                            } else if (h < 3.0) {
                              surfQuality = 'Epic';
                            } else {
                              surfQuality = '⚠️ Double Overhead! Heavy';
                            }
                          }"
                          class="w-full accent-amber-500 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                        />
                        <div class="flex justify-between text-[8px] text-slate-400 mt-1">
                          <span>Flat</span>
                          <span>Moderate</span>
                          <span>Heavy</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Surf Spots List -->
                  <div class="bg-white p-3 rounded-md border border-slate-200">
                    <span class="text-[10px] uppercase font-bold text-slate-400">Coastal Spots Forecast</span>
                    <div class="space-y-1.5 mt-2">
                      <button
                        v-for="spot in [
                          { name: 'Gold Coast', temp: '21°C', wind: '8kts offshore', waves: 'Epic' },
                          { name: 'Malibu Reef', temp: '19°C', wind: '12kts cross', waves: 'Clean' },
                          { name: 'Pipeline Cove', temp: '24°C', wind: '6kts offshore', waves: '⚠️ Heavy' },
                        ]"
                        :key="spot.name"
                        @click="() => {
                          selectedBeach = spot.name;
                          if (spot.name === 'Gold Coast') { swellHeight = 1.8; surfQuality = 'Epic'; }
                          else if (spot.name === 'Malibu Reef') { swellHeight = 1.2; surfQuality = 'Clean'; }
                          else { swellHeight = 3.2; surfQuality = '⚠️ Heavy'; }
                        }"
                        class="w-full text-left p-1.5 rounded text-xs flex justify-between cursor-pointer border transition-colors"
                        :class="selectedBeach === spot.name
                          ? 'bg-amber-500 border-amber-500 text-white'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-100 text-slate-700'"
                      >
                        <span class="font-semibold">{{ spot.name }}</span>
                        <span :class="selectedBeach === spot.name ? 'text-white' : 'text-slate-400'">{{ spot.temp }}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="bg-white p-2 border border-slate-200 rounded text-[10px] text-slate-500 flex items-center justify-between">
                  <span class="flex items-center gap-1"><Wind class="w-3.5 h-3.5 text-amber-500" /> Offshore breeze: clean barrel formations.</span>
                  <span class="font-semibold text-slate-700">Live Solis data feed</span>
                </div>
              </div>

              <!-- AUTUMN: HarvestChain Blockchain Ledger -->
              <div v-if="season === 'autumn'" class="space-y-4 flex flex-col flex-1 justify-between">
                <div class="space-y-2">
                  <span class="text-[10px] uppercase font-bold text-slate-400">Cargo Logistics Ledger</span>
                  <div class="space-y-1.5">
                    <div 
                      v-for="cargo in cargoList"
                      :key="cargo.id" 
                      @click="selectedCargo = cargo.name"
                      class="p-2 rounded border text-xs cursor-pointer flex justify-between items-center transition-colors"
                      :class="selectedCargo === cargo.name
                        ? 'bg-orange-50 border-orange-400 text-orange-950 font-medium'
                        : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-700'"
                    >
                      <div>
                        <div class="font-bold">{{ cargo.name }}</div>
                        <div class="text-[10px] text-slate-400 font-medium">{{ cargo.location }}</div>
                      </div>
                      <div class="text-right flex items-center gap-2">
                        <span class="text-[10px] font-mono text-slate-500">{{ cargo.temp }}</span>
                        <span class="text-[9px] font-bold px-1.5 rounded" :class="cargo.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'">
                          {{ cargo.status }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Ledger Scan Action -->
                <div class="bg-white p-3 border border-slate-200 rounded-md flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <div class="text-xs font-bold text-slate-800">Verify Blockchain Ledger</div>
                    <div class="text-[10px] text-slate-400">Decrypt cargo block signatures to verify source organic safety.</div>
                  </div>
                  <button
                    @click="handleScanLedger"
                    :disabled="isScanning"
                    class="px-4 py-1.5 rounded bg-orange-600 hover:bg-orange-500 disabled:bg-orange-300 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <ShieldCheck class="w-3.5 h-3.5" />
                    {{ isScanning ? 'Decrypting...' : 'Verify Cryptography' }}
                  </button>
                </div>

                <!-- Scan results with beautiful terminal style block -->
                <div v-if="scanResult" class="p-2 bg-slate-900 rounded font-mono text-[9px] text-emerald-400 border border-slate-800 text-center select-all">
                  {{ scanResult }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
