<template>
  <div class="container">
    <svg viewBox="0 0 1200 1200" class="svg-canvas">
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
          strokeDashoffset: 0
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
  { lineProgress: 1 }
);

const pathRef = ref<SVGPathElement | null>(null);
const pathLength = ref(0);

const PATH = `M589 213C589.498 210.276 589.398 208.18 588 206 545 181 429 147 395 150 337 222 314.442 303.976 300 389 288 522 325 522 330 631 299 801 262 917 202 950 222 939 229 927 237 919 127 891 110 961 240 996 308 1016 391 992 273 936 268.883 953.406 268.415 964.587 268 974 263.173 963.965 312 728 376 631 435 585 484 541 521 478 554 396 578 332 589 213 564 219 409 171 396 149 344.46 212.569 322.014 279.366 305.517 359.685 316 434 481 332 555.888 383.576 563.281 359.591 582.827 291.907 584 244 578 247 556 250 556 255 563 376 596 473 620 524 644 583 684 616 730 656 791 735 862 939 824 1023 830.638 1007.111 834.175 991.264 834 978 706 1036 796 1069 882 1036 978 1010 989 935 877 967 883 978 899 993 907 995 852 973 794 779 800 653 820 590 835 528 833 475 831 387 801 289 760 192 709 189 595 220 554 253 632 237 705 223 759 192 787 269 816 337 828 416 734 478 659 476 577.574 400.005c-5.093-21.029-8.876-39.098-11.997-57.334`

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
  stroke-width: var(--curvy-stroke-width, 10);
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
    stroke-width: 5;
  }
}
</style>
