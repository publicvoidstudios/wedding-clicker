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

const PATH = `M4 4C6 9 12 13 22 13 25.012 13.002 29.504 13.002 30.838 13.139 32.564 13.355 33.211 23.887 31.347 24.025 28.523 24.064 23.952 23.887 22.854 23.828 19.97 23.613 20.677 12.844 23 13L26 13C38 8 27 4 26 13 26 2 13 8 26 13 27.385 15.865 27.071 20.023 26.914 23.946 24.717 23.926 23.913 23.887 22.834 23.809 20.735 23.358 21 19 21 18 23.619 18.003 27.208 18.317 32.387 18.16 32.367 16.257 31.684 13.207 30.838 13.139 35.457 14.07 52 17 54 30`

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
  stroke: transparent;
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
