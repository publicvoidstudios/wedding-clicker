<template>
  <div class="curvy-block">
    <div
      ref="lineScrollRoot"
      class="line-scroll-root"
      :style="lineStrokeCssVars"
    >
      <curvy-gift-line
        v-if="special === 'gift'"
        :even="even"
        :line-progress="lineProgress"
      />
      <curvy-heart-line
        v-else-if="special === 'heart'"
        :even="even"
        :line-progress="lineProgress"
      />
      <curvy-tag-line
        v-else-if="special === 'tag'"
        :line-progress="lineProgress"
      />
      <curvy-hourglass-line
        v-else-if="special === 'hourglass'"
        :line-progress="lineProgress"
      />
      <curvy-line
        v-else
        :even="even"
        :line-progress="lineProgress"
      />
    </div>
    <curvy-text :even="even" >
      <template #header>
        <slot name="header" />
      </template>
      <template #default>
        <slot name="default" />
      </template>
      <template #footer>
        <slot name="footer" />
      </template>
    </curvy-text>
    <ShopDecorAnchor v-if="shopAnchor" :anchor-id="shopAnchor" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import CurvyLine from '@/components/parts/CurvyLine.vue';
import CurvyText from '@/components/parts/CurvyText.vue';
import ShopDecorAnchor from '@/components/ShopDecorAnchor.vue';
import CurvyHeartLine from '@/components/parts/CurvyHeartLine.vue';
import CurvyGiftLine from '@/components/parts/CurvyGiftLine.vue';
import CurvyTagLine from '@/components/parts/CurvyTagLine.vue';
import CurvyHourglassLine from '@/components/parts/CurvyHourglassLine.vue';
import { useCurvyLineScrollProgress } from '@/composables/useCurvyLineScrollProgress';

const COMPACT_STROKE_RATIO = 0.33 / 1.33;

const props = withDefaults(
  defineProps<{
    even?: boolean;
    special?: 'none' | 'heart' | 'gift' | 'tag' | 'hourglass';
    lineStrokeWidth?: number;
    /** Id для привязки предметов магазина (`curvyAnchor` в `config/upgrades`) */
    shopAnchor?: string;
  }>(),
  { lineStrokeWidth: 1 }
);

const lineStrokeCssVars = computed(() => {
  const w = props.lineStrokeWidth;
  return {
    '--curvy-stroke-width': String(w),
    '--curvy-stroke-width-compact': String(w * COMPACT_STROKE_RATIO),
  } as Record<string, string>;
});

const lineScrollRoot = ref<HTMLElement | null>(null);
const { lineProgress } = useCurvyLineScrollProgress(lineScrollRoot);
</script>

<style scoped lang="scss">
.curvy-block {
  container-type: inline-size;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
}

.line-scroll-root {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>