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

//const PATH = `M 54 4 C 49 15 34 17 29 17 C 28 17 24 11 24 10 C 23 6 29 5 29 8 C 29 5 35 6 34 10 C 34 11 30 17 29 17 S 12 18 4 30`
const PATH = `M 54 4 C 49 15 34 17 29 17 C 28 17 24 11 24 10 C 23 6 29 5 29.204 10.003 C 29.2 10.298 28.806 10.302 28.799 9.993 C 29 5 35 6 34 10 C 34 11 30 17 29 17 S 12 18 4 30`

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
