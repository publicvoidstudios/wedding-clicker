<template>
  <div ref="backgroundPatternWrapperRef" class="background-pattern__wrapper">
    <div class="background-pattern__welcome">
      <img class="background-pattern__welcome__img-1" src="../../assets/pattern_1.png">
      <img class="background-pattern__welcome__corner-1" src="../../assets/pattern_corner_1.png" alt="">
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const backgroundPatternWrapperRef = ref<HTMLElement | null>(null);

const pageHeight = ref(0);
const viewHeight = ref(0);

const repeatArray = ref<number[]>([]);

onMounted(() => {
  if (backgroundPatternWrapperRef.value) {
    pageHeight.value = backgroundPatternWrapperRef.value?.scrollHeight;
  }

  viewHeight.value = window.innerHeight;

  repeatArray.value = Array.from({
    length: Math.max(Number((pageHeight.value / viewHeight.value).toFixed(0)), 1) },
    (_, i) => i
  );
})
</script>

<style scoped lang="scss">
.background-pattern__wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  user-select: none;
}

.background-pattern__welcome {
  --background-image-width: 300px;
  position: relative;
  width: 100%;
  height: 100dvh;

  &__img-1 {
    position: absolute;
    left: 0;
    top: 100px;
    opacity: 0.15;
    width: var(--background-image-width);
  }

  &__corner-1 {
    position: absolute;
    right: 0;
    top: 0;
    opacity: 0.15;
    width: var(--background-image-width);
  }
}

@media (max-width: 768px) {
  .background-pattern__welcome {
    --background-image-width: 200px;
  }
}
</style>