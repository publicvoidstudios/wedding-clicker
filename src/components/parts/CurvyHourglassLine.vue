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

// const PATH = `M 4 4 C 9 13 20 18 31 18 L 28 12 C 27 10 28 9 29 9 L 33 9 C 34 9 35 10 34 12 L 31 18 L 28 24 C 27 26 28 27 29 27 L 33 27 C 34 27 35 26 34 24 L 31 18 S 49 21 54 30`
const PATH = `M 4 4 C 9 13 20 18 31 18 L 28 12 C 27 10 28 9 29 9 L 33 9 C 34 9 35 10 34 12 L 31 18 L 28 24 C 27 26 28 27 29 27 L 31 25 L 33 27 L 33 27 L 29 27 L 33 27 C 34 27 35 26 34 24 L 31 18 S 49 21 54 30`

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
