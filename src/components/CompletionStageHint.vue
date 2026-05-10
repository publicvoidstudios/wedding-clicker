<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game'

const { allShopPurchased } = storeToRefs(useGameStore())
</script>

<template>
  <Transition name="hint-pop">
    <aside
      v-if="allShopPurchased"
      class="hint-card"
      role="status"
      aria-live="polite"
    >
      <p class="hint-main">Ура! Все готово для праздника!</p>
      <p class="hint-sub">Листай ниже: там место, время и программа дня.</p>
    </aside>
  </Transition>
</template>

<style scoped>
.hint-card {
  position: absolute;
  left: 50%;
  bottom: 10%;
  transform: translateX(-50%);
  z-index: 12;
  width: min(calc(100% - 2rem), 18rem);
  padding: 1rem 1.15rem;
  text-align: center;
  pointer-events: none;
  border-radius: 1rem;
  border: 1px solid var(--wc-border-strong);
  background: linear-gradient(
    165deg,
    rgba(252, 253, 255, 0.96) 0%,
    rgba(238, 241, 247, 0.94) 100%
  );
  box-shadow:
    0 10px 36px rgba(45, 55, 72, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.75);
}

.hint-main {
  margin: 0 0 0.45rem;
  font-family: var(--wc-serif);
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.35;
  color: var(--wc-ink);
}

.hint-sub {
  margin: 0;
  font-size: 0.82rem;
  line-height: 1.45;
  color: var(--wc-muted);
}

.hint-pop-enter-active,
.hint-pop-leave-active {
  transition:
    opacity 0.55s ease,
    transform 0.55s ease;
}

.hint-pop-enter-from,
.hint-pop-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}
</style>
