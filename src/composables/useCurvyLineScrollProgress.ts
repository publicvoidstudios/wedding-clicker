import { onMounted, onUnmounted, type Ref, ref } from 'vue';
import { registerLineScrollBlock } from '@/composables/curvyLineScrollRegistry';

/**
 * Прогресс рисования линии — часть **общей** прокрутки по цепочке линий на странице
 * (см. `curvyLineScrollRegistry`). Пока не дорисована i-я линия, (i+1)-я не идёт в рост
 * (при равном разбиении t ∈ [0,1]).
 */
export function useCurvyLineScrollProgress(
  elRef: Ref<HTMLElement | null>
) {
  const lineProgress = ref(0);
  let unregister: (() => void) | null = null;

  onMounted(() => {
    unregister = registerLineScrollBlock(elRef, (v) => {
      lineProgress.value = v;
    });
  });

  onUnmounted(() => {
    unregister?.();
    unregister = null;
  });

  return { lineProgress };
}
