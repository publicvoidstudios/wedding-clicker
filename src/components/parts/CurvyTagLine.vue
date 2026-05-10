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

const PATH = `M 54 4 C 51 10 44 16 31 16 L 31 10 C 33 10 33 7 31 7 C 29 7 29 10 31 10 L 31 16 L 34 10 C 37 3 25 3 28 10 L 31 16 C 17 16 8 25 4 30`

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
