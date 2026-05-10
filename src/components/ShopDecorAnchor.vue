<script setup lang="ts">
import { useShopDecorPlaced } from '@/composables/useShopDecorPlaced';

const { anchorId } = defineProps<{
  /** Совпадает с `curvyAnchor` в `config/upgrades` и `shop-anchor` у CurvyBlock */
  anchorId: string;
}>();

const { placed } = useShopDecorPlaced(() => anchorId);
</script>

<template>
  <div
    v-if="placed.length > 0"
    class="shop-decor-anchor"
    aria-hidden="true"
  >
    <component
      :is="item.asyncComp"
      v-for="item in placed"
      :key="item.id"
      class="placed"
      :style="item.style"
    />
  </div>
</template>

<style scoped>
.shop-decor-anchor {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  overflow: visible;
}

.placed {
  display: block;
}
</style>
