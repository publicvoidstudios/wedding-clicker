<script setup lang="ts">
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue';
import type { CSSProperties } from 'vue';
import { storeToRefs } from 'pinia';
import { useGameStore } from '@/stores/game';
import { useShopDecorPlaced } from '@/composables/useShopDecorPlaced';

const DOC_LAYER_Z = 6;

const store = useGameStore();
const { purchasedIds } = storeToRefs(store);

const { placed } = useShopDecorPlaced(null);

const docHeightPx = ref(0);

function measureDocHeight(): number {
  return Math.max(
    document.documentElement.scrollHeight,
    document.body?.scrollHeight ?? 0,
    document.documentElement.clientHeight,
  );
}

function updateDocHeight() {
  docHeightPx.value = measureDocHeight();
}

const layerBaseStyle = ref<CSSProperties>({});

function syncLayerStyle() {
  layerBaseStyle.value = {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: docHeightPx.value > 0 ? `${docHeightPx.value}px` : '100%',
    pointerEvents: 'none',
    zIndex: DOC_LAYER_Z,
    overflow: 'visible',
  };
}

function onWinResize() {
  updateDocHeight();
  syncLayerStyle();
}

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  updateDocHeight();
  syncLayerStyle();
  window.addEventListener('resize', onWinResize, { passive: true });
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        updateDocHeight();
        syncLayerStyle();
      });
    });
    resizeObserver.observe(document.documentElement);
    if (document.body) {
      resizeObserver.observe(document.body);
    }
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onWinResize);
  resizeObserver?.disconnect();
  resizeObserver = null;
});

watch(docHeightPx, syncLayerStyle);

watch(
  purchasedIds,
  () => {
    nextTick(() => {
      updateDocHeight();
      syncLayerStyle();
    });
  },
  { deep: true },
);
</script>

<template>
  <Teleport to="body">
    <div
      v-if="placed.length > 0"
      class="purchased-doc-layer"
      :style="layerBaseStyle"
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
  </Teleport>
</template>

<style scoped>
.placed {
  display: block;
}
</style>
