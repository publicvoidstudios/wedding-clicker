<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useGameStore } from '@/stores/game';
import { useNotifications } from '@/composables/useNotifications';
import { grantAchievement } from '@/composables/useAchievements';
import IconAchievement from '@/components/icons/IconAchievement.vue';
import IconShop from '@/components/icons/IconShop.vue';

const store = useGameStore();
const { displayScore, shopUnlocked, allShopPurchased, unlockedAchievementIds } = storeToRefs(store);

const { push } = useNotifications();
const fakeEnMode = ref(false);

const barRef = ref<HTMLElement | null>(null);
const slotHeightPx = ref(0);
const barVisible = ref(true);

let lastScrollY = 0;
let scrollRaf = 0;
const SCROLL_DIR_THRESHOLD = 6;
const TOP_SHOW_PX = 16;

function measureBarHeight() {
  if (!barRef.value) return;
  slotHeightPx.value = barRef.value.offsetHeight;
}

function applyScrollDirection() {
  const y = Math.max(0, window.scrollY);
  const dy = y - lastScrollY;
  lastScrollY = y;

  if (y <= TOP_SHOW_PX) {
    barVisible.value = true;
    return;
  }
  if (dy > SCROLL_DIR_THRESHOLD) {
    barVisible.value = false;
  } else if (dy < -SCROLL_DIR_THRESHOLD) {
    barVisible.value = true;
  }
}

function onScroll() {
  if (scrollRaf !== 0) return;
  scrollRaf = requestAnimationFrame(() => {
    scrollRaf = 0;
    applyScrollDirection();
  });
}

let resizeObserver: ResizeObserver | null = null;

function openShop() {
  store.openShop();
}

function openAchievementsModal() {
  store.openAchievementsModal();
}

function onFakeLangToggle() {
  store.bumpLangFakeToggle();
  fakeEnMode.value = !fakeEnMode.value;
  if (fakeEnMode.value) {
    grantAchievement('lang_detective', { sound: 'parrot' });
  } else {
    push({
      message: 'Тут нет английского, сколько ни кликайте)',
    });
  }
}

onMounted(() => {
  lastScrollY = window.scrollY;

  requestAnimationFrame(() => {
    measureBarHeight();
  });

  if (barRef.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      measureBarHeight();
    });
    resizeObserver.observe(barRef.value);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
  if (scrollRaf !== 0) {
    cancelAnimationFrame(scrollRaf);
    scrollRaf = 0;
  }
  resizeObserver?.disconnect();
  resizeObserver = null;
});
</script>

<template>
  <div class="score-header-root">
    <div
      class="score-header-slot"
      :style="{ height: slotHeightPx > 0 ? `${slotHeightPx}px` : undefined }"
      aria-hidden="true"
    />
    <header ref="barRef" class="score-bar" :class="{ 'score-bar--hidden': !barVisible }">
      <div class="score-inner">
        <div class="score-cluster" data-tutorial="love-scores">
          <span class="label">Очки любви</span>
          <span
            v-if="allShopPurchased"
            class="value value-infinity"
            aria-label="Бесконечность"
            title="Бесконечность"
          >
            ∞
          </span>
          <span v-else class="value">{{ displayScore }}</span>
        </div>

        <div class="score-actions">
          <div class="shop-slot">
            <button
              v-if="unlockedAchievementIds.length > 0"
              type="button"
              class="achievements-accent"
              aria-label="Открыть достижения"
              @click="openAchievementsModal"
            >
              <span class="header-action-icon" aria-hidden="true">
                <IconAchievement />
              </span>
              <span class="achievements-accent__label">Ачивки</span>
            </button>
            <button
              v-if="shopUnlocked"
              type="button"
              class="achievements-accent"
              aria-label="Открыть магазин"
              @click="openShop"
            >
              <span class="header-action-icon" aria-hidden="true">
                <IconShop />
              </span>
              <span class="achievements-accent__label">
                Магазин
              </span>
            </button>
          </div>

          <button
            type="button"
            class="lang-fake-toggle"
            role="switch"
            :aria-checked="fakeEnMode"
            aria-label="Переключатель языка RU и EN"
            @click="onFakeLangToggle"
          >
            <span class="lang-fake-toggle__track" aria-hidden="true">
              <span class="lang-fake-toggle__labels">
                <span
                  v-if="fakeEnMode"
                  class="lang-fake-toggle__bg-inactive lang-fake-toggle__bg-inactive--ru"
                >RU</span>
                <span
                  v-else
                  class="lang-fake-toggle__bg-inactive lang-fake-toggle__bg-inactive--en"
                >EN</span>
              </span>
              <span class="lang-fake-toggle__thumb" :class="{ 'lang-fake-toggle__thumb--en': fakeEnMode }" />
            </span>
          </button>


        </div>
      </div>
    </header>
  </div>
</template>

<style scoped lang="scss">
.score-header-root {
  width: 100%;
}

.score-header-slot {
  width: 100%;
  flex-shrink: 0;
  overflow: hidden;
  pointer-events: none;
}

.score-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  transform: translateY(0);
  transition: transform 0.22s ease-out;
  padding: 0.65rem 1rem calc(0.65rem + env(safe-area-inset-top));
  padding-top: calc(0.65rem + env(safe-area-inset-top));
  background: linear-gradient(180deg, rgba(255, 252, 248, 0.98) 0%, rgba(255, 252, 248, 0.88) 100%);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--wc-border-soft);
  will-change: transform;
}

.score-bar--hidden {
  transform: translateY(-100%);
}

.score-inner {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.score-cluster {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  flex-wrap: wrap;
  min-width: 0;
}

.shop-slot {
  flex-shrink: 0;
  min-height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.45rem;
}

.achievements-accent {
  border: none;
  cursor: pointer;
  padding: 0.45rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-family: var(--wc-sans);
  color: var(--wc-gold-dark);
  background: rgba(255, 252, 248, 0.92);
  border: 1px solid var(--wc-border-mid);
  box-shadow: 0 2px 10px rgba(55, 65, 80, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  -webkit-tap-highlight-color: transparent;
  white-space: nowrap;
  transition:
    border-color 0.15s ease,
    background 0.15s ease;
}

.achievements-accent:hover {
  border-color: var(--wc-border-strong);
  background: #fff;
}

.achievements-accent:active {
  transform: scale(0.97);
}

.header-action-icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--wc-gold-dark);
}

.achievements-accent__label {
  display: inline-block;
  overflow: hidden;
}

@media (max-width: 400px) {
  .achievements-accent__label {
    display: none;
  }

  .achievements-accent {
    padding: 0.45rem 0.55rem;
  }
}

.score-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: clamp(0.35rem, 2vw, 0.65rem);
  min-height: 2.5rem;
}

.lang-fake-toggle {
  flex-shrink: 0;
  margin: 0;
  padding: 0;
  border: 1px solid var(--wc-border-mid);
  border-radius: 999px;
  background: rgba(255, 252, 248, 0.82);
  box-shadow:
    0 1px 4px rgba(55, 65, 80, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: border-color 0.15s ease, background 0.15s ease;
  line-height: 0;
}

.lang-fake-toggle:hover {
  border-color: var(--wc-border-strong);
  background: rgba(255, 255, 255, 0.92);
}

.lang-fake-toggle:active {
  transform: scale(0.97);
}

.lang-fake-toggle__track {
  position: relative;
  display: block;
  width: 3rem;
  height: 1.36rem;
  border-radius: 999px;
  background: linear-gradient(180deg, #e3e7ee 0%, #c8d0dc 100%);
  box-shadow: inset 0 1px 4px rgba(45, 48, 56, 0.14);
  flex-shrink: 0;
  overflow: visible;
}

.lang-fake-toggle__labels {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.lang-fake-toggle__bg-inactive {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-family: var(--wc-sans);
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--wc-gold-dark);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.35);
  opacity: 0.88;
}

.lang-fake-toggle__bg-inactive--en {
  right: 0.4rem;
}

.lang-fake-toggle__bg-inactive--ru {
  left: 0.4rem;
}

@media (min-width: 480px) {
  .lang-fake-toggle__bg-inactive {
    font-size: 0.62rem;
  }

  .lang-fake-toggle__bg-inactive--en {
    right: 0.42rem;
  }

  .lang-fake-toggle__bg-inactive--ru {
    left: 0.42rem;
  }
}

.lang-fake-toggle__thumb {
  position: absolute;
  top: 50%;
  left: 0.12rem;
  z-index: 1;
  width: 1.05rem;
  height: 1.05rem;
  margin-top: -0.525rem;
  border-radius: 50%;
  background: linear-gradient(180deg, #ffffff 0%, #eef0f4 100%);
  box-shadow:
    0 1px 5px rgba(55, 65, 80, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  transition: left 0.24s cubic-bezier(0.22, 1, 0.36, 1);
  pointer-events: none;
}

.lang-fake-toggle__thumb--en {
  left: calc(100% - 1.05rem - 0.12rem);
}

@media (min-width: 480px) {
  .lang-fake-toggle__track {
    width: 3rem;
    height: 1.42rem;
  }

  .lang-fake-toggle__thumb {
    width: 1.1rem;
    height: 1.1rem;
    margin-top: -0.55rem;
    left: 0.13rem;
  }

  .lang-fake-toggle__thumb--en {
    left: calc(100% - 1.1rem - 0.13rem);
  }
}


.value {
  font-family: var(--wc-serif);
  font-size: clamp(1.45rem, 5vw, 1.75rem);
  font-weight: 600;
  color: var(--wc-gold-dark);
  font-variant-numeric: tabular-nums;
}

.value-infinity {
  font-size: clamp(2rem, 7vw, 2.45rem);
  line-height: 1;
  font-weight: 500;
  font-variant-numeric: normal;
}

.shop-accent {
  border: none;
  cursor: pointer;
  padding: 0.45rem 1rem;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.07em;
  font-family: var(--font-family-monotype), sans-serif;
  color: #fff;
  background: linear-gradient(135deg, #eceef3 0%, #b8c2d0 42%, #6d7788 100%);
  box-shadow:
    0 3px 14px var(--wc-shadow-metal),
    inset 0 1px 0 rgba(255, 255, 255, 0.55);
  animation: accent-glow 2.5s ease-in-out infinite;
  -webkit-tap-highlight-color: transparent;
  white-space: nowrap;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  span {
    display: inline-block; /* Обязательно для работы размеров */
    max-width: 0;
    overflow: hidden;
    transition: max-width 0.22s ease-in-out;
  }
}

.shop-accent:active {
  transform: scale(0.97);
}

.shop-accent:hover {
  span {
    max-width: 150px; /* Укажите примерный максимум текста */
  }
}

@keyframes accent-glow {
  0%,
  100% {
    box-shadow:
      0 3px 14px var(--wc-shadow-metal),
      inset 0 1px 0 rgba(255, 255, 255, 0.55);
  }

  50% {
    box-shadow:
      0 5px 22px var(--wc-glow-metal),
      inset 0 1px 0 rgba(255, 255, 255, 0.55);
  }
}

.shop-btn-enter-active,
.shop-btn-leave-active {
  transition:
    opacity 0.45s ease,
    transform 0.45s ease;
}

.shop-btn-enter-from,
.shop-btn-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>

<style lang="scss">
/* Пока открыт туториал, шапка не уезжает при скролле */
html.wc-tutorial-open .score-bar.score-bar--hidden {
  transform: translateY(0) !important;
}
</style>
