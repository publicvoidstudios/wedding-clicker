<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game'
import { useTutorialStore } from '@/stores/tutorial'
import { STORAGE_KEY } from '@/config/gameConfig'

const POPOVER_ID = 'tutorial-love-scores-anchor'

const gameStore = useGameStore()
const tutorialStore = useTutorialStore()
const { gameUiActive } = storeToRefs(gameStore)
const { isWelcomeTutorialActive } = storeToRefs(tutorialStore)

const visible = computed(
  () =>
    gameUiActive.value &&
    isWelcomeTutorialActive.value &&
    localStorage.getItem(STORAGE_KEY) === null,
)

const PAD = 6

const ringStyle = ref<Record<string, string>>({})
const popoverStyle = ref<Record<string, string>>({})

const WELCOME_TEXT =
  'Добро пожаловать! Зарабатывайте очки любви изучая сайт и с помощью кликов мышкой/тапов пальцем. Накопите 10 очков.'

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function updateLayout() {
  if (!visible.value) return

  const el = document.querySelector<HTMLElement>('[data-tutorial="love-scores"]')
  if (!el) return

  const rect = el.getBoundingClientRect()
  const vw = window.innerWidth
  const vh = window.innerHeight

  ringStyle.value = {
    position: 'fixed',
    left: `${rect.left - PAD}px`,
    top: `${rect.top - PAD}px`,
    width: `${rect.width + PAD * 2}px`,
    height: `${rect.height + PAD * 2}px`,
    pointerEvents: 'none',
    borderRadius: '12px',
    boxShadow:
      '0 0 0 3px rgba(201, 162, 82, 0.95), 0 0 0 1px rgba(255, 252, 248, 0.9), 0 8px 28px rgba(201, 162, 82, 0.35)',
    zIndex: '10001',
  }

  const popoverWidth = Math.min(400, vw - 24)
  let left = rect.left + rect.width / 2 - popoverWidth / 2
  left = clamp(left, 12, vw - popoverWidth - 12)

  let top = rect.bottom + PAD + 14
  const popoverMinHeight = 120
  if (top + popoverMinHeight > vh - 12) {
    top = rect.top - popoverMinHeight - 14
  }
  top = clamp(top, 12, vh - popoverMinHeight - 12)

  popoverStyle.value = {
    position: 'fixed',
    left: `${left}px`,
    top: `${top}px`,
    width: `${popoverWidth}px`,
    zIndex: '10002',
  }
}

let ro: ResizeObserver | null = null

function bindObservers() {
  unbindObservers()
  const el = document.querySelector<HTMLElement>('[data-tutorial="love-scores"]')
  if (el && typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(() => updateLayout())
    ro.observe(el)
  }
}

function unbindObservers() {
  ro?.disconnect()
  ro = null
}

function onViewportChange() {
  requestAnimationFrame(() => updateLayout())
}

watch(visible, (v) => {
  document.documentElement.classList.toggle('wc-tutorial-open', v)
  document.body.style.overflow = v ? 'hidden' : ''
  if (v) {
    requestAnimationFrame(() => {
      updateLayout()
      bindObservers()
    })
  } else {
    unbindObservers()
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  window.addEventListener('resize', onViewportChange)
  window.addEventListener('scroll', onViewportChange, true)
  if (visible.value) {
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => updateLayout())
    bindObservers()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onViewportChange)
  window.removeEventListener('scroll', onViewportChange, true)
  unbindObservers()
  document.documentElement.classList.remove('wc-tutorial-open')
  document.body.style.overflow = ''
})

function continueTutorial() {
  tutorialStore.completeWelcomeStep()
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="tutorial-root"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="POPOVER_ID"
    >
      <div
        class="tutorial-root__blocker"
        aria-hidden="true"
        @wheel.prevent
        @touchmove.prevent
        @click.prevent.stop
      />
      <div class="tutorial-root__dim" aria-hidden="true" />
      <div :style="ringStyle" class="tutorial-root__ring" />
      <div :style="popoverStyle" class="tutorial-popover">
        <p :id="POPOVER_ID" class="tutorial-popover__text">
          {{ WELCOME_TEXT }}
        </p>
        <button type="button" class="tutorial-popover__btn" @click="continueTutorial">
          Продолжить
        </button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.tutorial-root {
  position: fixed;
  inset: 0;
  z-index: 10000;
  pointer-events: none;
}

.tutorial-root__blocker {
  position: fixed;
  inset: 0;
  z-index: 10000;
  pointer-events: auto;
  touch-action: none;
  cursor: default;
}

.tutorial-root__dim {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  background: rgba(38, 32, 28, 0.52);
  backdrop-filter: blur(1px);
}

.tutorial-root__ring {
  box-sizing: border-box;
}

.tutorial-popover {
  pointer-events: auto;
  background: rgba(255, 252, 248, 0.98);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  box-shadow:
    0 12px 40px rgba(38, 32, 28, 0.18),
    0 0 0 1px var(--wc-border-soft);
  box-sizing: border-box;
}

.tutorial-popover__text {
  font-family: var(--wc-sans);
  font-size: 0.85rem;
  line-height: 1.45;
  color: var(--wc-text-dark);
  margin: 0 0 0.85rem;
  font-weight: 500;
}

.tutorial-popover__btn {
  border: none;
  background: var(--wc-gold-light);
  color: var(--wc-gold-dark);
  padding: 0.5rem 1.1rem;
  border-radius: 8px;
  font-family: var(--wc-sans);
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    background: var(--wc-gold-dark);
    color: #fff;
  }
}
</style>
