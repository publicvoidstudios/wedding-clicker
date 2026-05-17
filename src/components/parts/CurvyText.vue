<template>
  <div class="curvy-text" :class="{ 'curvy-text--even': even }">
    <span
      ref="lineScrollRoot"
      class="curvy-text__section curvy-text__header"
      :style="{ '--curvy-text-header-offset': headerOffset }"
    >
      <curvy-outline
        :path-variation="pathVariation"
        :absoluteStrokeWidth="outlineStrokeWidth ? outlineStrokeWidth : 12"
        class="curvy-text__outline"
        :size="outlineSize ? outlineSize : `100%`"
        :line-progress="lineProgress"
        :style="{
          '--outline-position-x-desktop': outlinePosition?.desktop?.x,
          '--outline-position-y-desktop': outlinePosition?.desktop?.y,
          '--outline-position-x-mobile': outlinePosition?.mobile?.x,
          '--outline-position-y-mobile': outlinePosition?.mobile?.y,
        }"
      />
      <slot name="header" />
    </span>
    <span
      class="curvy-text__section curvy-text__body"
      :style="{ '--curvy-text-body-offset': bodyOffset }"
    >
      <slot />
    </span>
    <span
      class="curvy-text__section curvy-text__footer"
      :style="{ '--curvy-text-footer-offset': footerOffset }"
    >
      <slot name="footer" />
    </span>
  </div>
</template>

<script setup lang="ts">
import CurvyOutline from '@/components/parts/CurvyOutline.vue';
import { ref } from 'vue';
import { useCurvyLineScrollProgress } from '@/composables/useCurvyLineScrollProgress.ts';

defineProps<{
  even?: boolean;
  headerOffset?: string;
  bodyOffset?: string;
  footerOffset?: string;
  outlinePosition?: {
    desktop?: {
      x: string;
      y: string;
    },
    mobile?: {
      x: string;
      y: string;
    }
  };
  pathVariation?: number;
  outlineSize?: string;
  outlineStrokeWidth?: number;
}>();

const lineScrollRoot = ref<HTMLElement | null>(null);
const { lineProgress } = useCurvyLineScrollProgress(lineScrollRoot);
</script>

<style scoped lang="scss">
.curvy-text {
  container-type: inline-size;

  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-sizing: border-box;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: 0 10px;
  user-select: none;

  &__header {
    position: relative;
    align-self: flex-start;
    display: block;
    font-family: var(--font-family-primary), cursive;
    font-size: 72px;
    line-height: 0.8;
    padding-left: var(--curvy-text-header-offset);
  }

  &__body {
    font-family: var(--font-family-handwritten), serif;
    font-weight: 500;
    font-size: 32px;
    padding-left: var(--curvy-text-body-offset);
  }

  &__footer {
    font-family: var(--font-family-handwritten), sans-serif;
    font-weight: 400;
    font-size: 24px;
    padding-left: var(--curvy-text-footer-offset);
  }

  &__outline {
    position: absolute;
    width: 140%;
    height: 140%;
  }

  &--even {
    align-items: flex-end;
    text-align: right;

    .curvy-text__header {
      align-self: flex-end;
      text-align: right;
      padding-left: 0;
      padding-right: var(--curvy-text-header-offset);
    }

    .curvy-text__body {
      padding-left: 0;
      padding-right: var(--curvy-text-body-offset);
    }

    .curvy-text__footer {
      padding-left: 0;
      padding-right: var(--curvy-text-footer-offset);
    }
  }

  &__section {
    display: flex;
  }
}

@container (max-width: 564px) {
  .curvy-text {
    max-width: 100%;

    &__header {
      font-size: 48px;
    }

    &__body {
      font-size: 24px;
    }

    &__footer {
      font-size: 20px;
    }
  }
}
</style>