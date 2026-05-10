<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game'
import { getActiveHint } from '@/config/hints'
import type { HintPreset } from '@/config/hints'

const store = useGameStore()
const { dismissedHints } = storeToRefs(store)

const active = computed(() => getActiveHint(store, dismissedHints.value))

function presetClass(preset: HintPreset): string {
  return `hint-pos--${preset}`
}

function close() {
  const h = active.value
  if (h) store.dismissHint(h.id)
}
</script>

<template>
  <Transition name="hint-pop">
    <aside
      v-if="active"
      class="hint-card"
      :class="presetClass(active.preset)"
      role="dialog"
      aria-live="polite"
      :aria-labelledby="'hint-title-' + active.id"
    >
      <p :id="'hint-title-' + active.id" class="hint-text">{{ active.text }}</p>
      <button type="button" class="hint-close" aria-label="Закрыть подсказку" @click="close">
        ×
      </button>
    </aside>
  </Transition>
</template>

<style scoped>
.hint-card {
  position: absolute;
  z-index: 30;
  max-width: min(20rem, calc(100vw - 2rem));
  padding: 0.85rem 2.25rem 0.85rem 1rem;
  border-radius: 0.85rem;
  border: 1px solid var(--wc-border-mid);
  background: linear-gradient(
    165deg,
    rgba(252, 253, 255, 0.97) 0%,
    rgba(236, 241, 248, 0.96) 100%
  );
  box-shadow:
    0 12px 36px rgba(40, 50, 68, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.85);
  pointer-events: auto;
}

.hint-text {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.45;
  color: var(--wc-ink-soft);
}

.hint-close {
  position: absolute;
  top: 0.35rem;
  right: 0.35rem;
  width: 1.75rem;
  height: 1.75rem;
  border: none;
  border-radius: 50%;
  background: rgba(140, 152, 168, 0.12);
  color: var(--wc-muted);
  font-size: 1.15rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;
}

.hint-close:active {
  background: rgba(140, 152, 168, 0.22);
}

/* Позиции (положение подсказки) */
.hint-pos--stage-bottom-center {
  left: 50%;
  bottom: 18%;
  transform: translateX(-50%);
}

.hint-pos--stage-top-center {
  left: 50%;
  top: 12%;
  transform: translateX(-50%);
}

.hint-pos--below-header-right {
  right: 0.75rem;
  top: calc(4.25rem + env(safe-area-inset-top));
}

.hint-pop-enter-active,
.hint-pop-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}

.hint-pop-enter-from,
.hint-pop-leave-to {
  opacity: 0;
}

.hint-pos--stage-bottom-center.hint-pop-enter-from,
.hint-pos--stage-bottom-center.hint-pop-leave-to {
  transform: translateX(-50%) translateY(8px);
}

.hint-pos--stage-top-center.hint-pop-enter-from,
.hint-pos--stage-top-center.hint-pop-leave-to {
  transform: translateX(-50%) translateY(-8px);
}

.hint-pos--below-header-right.hint-pop-enter-from,
.hint-pos--below-header-right.hint-pop-leave-to {
  transform: translateY(-6px);
}
</style>
