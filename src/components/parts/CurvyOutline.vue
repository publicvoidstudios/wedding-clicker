<template>
  <div class="container">
    <svg :width="size" viewBox="0 0 1490 555" class="svg-canvas">
      <!-- Фоновая линия (серая) -->
      <path
        :d="actualPath"
        class="base-line"
      />

      <!-- Анимированная линия -->
      <path
        ref="pathRef"
        :d="actualPath"
        class="animated-line"
        :stroke="color"
        :stroke-width="absoluteStrokeWidth"
        fill="none"
        :style="{
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength * (1 - lineProgress)
        }"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

const {
  size = '200px',
  absoluteStrokeWidth = 2,
  color = '#aa2c2c',
  lineProgress = 0,
  pathVariation
} = defineProps<{
  size?: string;
  absoluteStrokeWidth?: number;
  color?: string;
  lineProgress?: number;
  pathVariation?: number;
}>()

const PATH = `M528 137C-102 130-243 480 734 505 1831 528 1607 123 691 68 1713 126 1749 498 690 485-125 481-180 101 558 99`;
const PATH2 = `M423 129C-200 145-82 470 741 477 1807 465 1679 77 469 72 1713 126 1713 504 735 502-119 514-206 99 382 105`;
const PATH3 = `M398 117C-116 140-83 471 731 477 1636 476 1671 70 469 72-119 75-204 499 734 505 1723 513 1618 146 383 37`;
const PATH4 = `M323 25C-116 140-83 471 562 477 1276 479 1125 43 466 47-119 75-204 499 581 504 1054 507 1369 238 701 96`;

const actualPath = computed(() => {
  switch (pathVariation) {
    case 1:
      return PATH;
    case 2:
      return PATH2;
    case 3:
      return PATH3;
    case 4:
      return PATH4;
    default:
      return PATH;
  }
})

const pathRef = ref<SVGPathElement | null>(null);
const pathLength = ref(0);

onMounted(() => {
  if (pathRef.value) {
    pathLength.value = pathRef.value.getTotalLength();
  }
});
</script>

<style scoped lang="scss">
.svg-canvas {
  /* Чтобы SVG корректно тянулся, сохраняя пропорции viewBox */
  height: auto;
  display: block;
}

.container {
  container-type: inline-size;
  width: 120%;
  max-width: 600px;
  top: var(--outline-position-y-desktop);
  left: var(--outline-position-x-desktop);
}

.svg-canvas {
  display: block;
  height: auto;
}

path {
  fill: none;
  stroke-linecap: round;
}

.base-line {
  vector-effect: non-scaling-stroke;
  stroke: transparent;
}

.animated-line {
  stroke: #aa2c2c;
  will-change: stroke-dashoffset;
}

@media (max-width: 768px) {
  .container {
    top: var(--outline-position-y-mobile, var(--outline-position-y-desktop));
    left: var(--outline-position-x-mobile, var(--outline-position-x-desktop));

    max-width: 300px;
  }

  .container svg path {
    //stroke-width: var(--curvy-stroke-width-compact, 0.33);
  }
}
</style>