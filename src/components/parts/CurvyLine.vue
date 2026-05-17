<template>
  <div class="container">
    <svg v-if="even" viewBox="0 0 58 34" class="svg-canvas">
      <!-- Фоновая линия (серая) -->
      <path
        d="M 4 4 C 10 16 20 18 30 18 S 50 20 54 30"
        class="base-line"
      />

      <!-- Анимированная линия -->
      <path
        ref="pathRef"
        d="M 4 4 C 10 16 20 18 30 18 S 50 20 54 30"
        class="animated-line"
        :style="{
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength * (1 - lineProgress)
        }"
      />
    </svg>
    <svg v-if="!even" viewBox="0 0 58 34" class="svg-canvas">
      <!-- Фоновая линия (серая) -->
      <path
        d="M 54 4 C 49 15 34 17 29 18 S 12 18 4 30"
        class="base-line"
      />

      <!-- Анимированная линия -->
      <path
        ref="pathRef"
        d="M 54 4 C 49 15 34 17 29 18 S 12 18 4 30"
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
    even?: boolean;
    /** 0..1, от прокрутки (composable) */
    lineProgress?: number;
  }>(),
  { lineProgress: 0 }
);

const pathRef = ref<SVGPathElement | null>(null);
const pathLength = ref(0);

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
