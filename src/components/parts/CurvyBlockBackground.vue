<template>
  <div ref="backgroundPatternWrapperRef" class="background-pattern__wrapper">
    <div class="background-pattern__regular">
      <img
        v-if="even && variation === 1"
        class="background-pattern__regular__left"
        src="../../assets/pattern_3.png"
        alt=""
      >
      <img
        v-if="even && variation === 2"
        class="background-pattern__regular__left"
        src="../../assets/pattern_1.png"
        alt=""
      >
      <img
        v-if="!even && variation === 1"
        class="background-pattern__regular__right"
        src="../../assets/pattern_2.png"
        alt=""
      >
      <img
        v-if="!even && variation === 2"
        class="background-pattern__regular__right"
        src="../../assets/pattern_4.png"
        alt=""
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const { even = false, variation = 1 } = defineProps<{
  even?: boolean;
  variation?: 1 | 2;
}>();

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
      length: Math.max(Number((pageHeight.value / viewHeight.value).toFixed(0)), 1),
    },
    (_, i) => i,
  );
});
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

.background-pattern__regular {
  --background-image-width: 300px;

  position: relative;
  width: 100%;
  height: 100%;

  &__left {
    position: absolute;
    left: 0;
    top: 50%;
    opacity: 0.15;
    width: var(--background-image-width);
  }

  &__right {
    position: absolute;
    right: 0;
    top: 50%;
    opacity: 0.15;
    width: var(--background-image-width);
  }
}

@media (max-width: 768px) {
  .background-pattern__regular {
    --background-image-width: 200px;
  }
}
</style>