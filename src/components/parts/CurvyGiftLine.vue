<template>
  <div class="container">
    <svg viewBox="0 0 58 34" class="svg-canvas">
      <!-- Фоновая линия (серая) -->
      <path
        :d="PATH"
        class="base-line"
      />

      <!-- Анимированная линия -->
      <path
        ref="pathRef"
        :d="PATH"
        class="animated-line"
        :style="{
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength * (1 - lineProgress)
        }"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

withDefaults(
  defineProps<{
    /** 0..1, от прокрутки (composable) */
    lineProgress?: number;
  }>(),
  { lineProgress: 0 }
);

const pathRef = ref<SVGPathElement | null>(null);
const pathLength = ref(0);

const PATH = `M 4 4 C 6 9 12 13 22 13 C 28 13 28 13 31 14 C 32 16 33 20 31 23 C 28 26 23 23 22 22 C 20 20 21 13 23 13 L 26 13 C 38 8 27 4 26 13 C 26 2 13 8 26 13 C 28 16 28 20 26 24 C 25 24 23 23 22 22 C 21 21 21 19 21 18 C 24 16 27 21 32 17 C 32 17 32 16 31 14 C 35 15 52 17 54 30`

onMounted(() => {
  if (pathRef.value) {
    pathLength.value = pathRef.value.getTotalLength();
  }
});
</script>

<style scoped>
.container {
  container-type: inline-size;
  width: 100%;
  max-width: 600px;
}

.svg-canvas {
  display: block;
  width: 100%;
  height: auto;
}

path {
  fill: none;
  stroke-width: var(--curvy-stroke-width, 1.33);
  stroke-linecap: round;
}

.base-line {
  stroke: #cfcfcf;
}

.animated-line {
  stroke: #aa2c2c;
  will-change: stroke-dashoffset;
}

@container (max-width: 768px) {
  .container {
    max-width: 300px;
  }

  .container svg path {
    stroke-width: var(--curvy-stroke-width-compact, 0.33);
  }
}
</style>
