<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useGameStore } from '@/stores/game';

const store = useGameStore();

interface FloatPop {
  id: number;
  x: number;
  y: number;
}

const pops = ref<FloatPop[]>([]);
let nextPopId = 0;

function onPointerDown(e: PointerEvent) {
  if (e.button !== 0) return;

  store.clickRing();

  const jitterX = (Math.random() - 0.5) * 28;
  const jitterY = (Math.random() - 0.5) * 20;
  const x = e.clientX + jitterX;
  const y = e.clientY + jitterY;

  const id = ++nextPopId;
  pops.value.push({ id, x, y });

  window.setTimeout(() => {
    pops.value = pops.value.filter((p) => p.id !== id);
  }, 780);
}

onMounted(() => {
  document.addEventListener('pointerdown', onPointerDown);
});

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onPointerDown);
});
</script>

<template>
  <Teleport to="body">
    <div class="float-layer" aria-hidden="true">
      <p
        v-for="p in pops"
        :key="p.id"
        class="float-plus"
        :style="{ left: `${p.x}px`, top: `${p.y}px` }"
      >
        ❤️
      </p>
    </div>
  </Teleport>
</template>

<style scoped>
.float-layer {
  position: fixed;
  inset: 0;
  overflow: visible;
  pointer-events: none;
  z-index: 200;
}

.float-plus {
  position: absolute;
  margin: 0;
  padding: 0;
  font-family: var(--wc-sans);
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--wc-gold-dark);
  text-shadow:
    0 0 12px rgba(255, 255, 255, 0.95),
    0 1px 2px rgba(40, 48, 62, 0.35);
  transform: translate(-50%, -50%);
  animation: pop-float 0.78s ease-out forwards;
  will-change: transform, opacity;
}

@keyframes pop-float {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(0.65);
  }

  18% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.08);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -175%) scale(1.05);
  }
}
</style>
