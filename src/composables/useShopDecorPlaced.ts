import { computed, defineAsyncComponent, type MaybeRefOrGetter, toValue } from 'vue';
import type { StyleValue } from 'vue';
import { storeToRefs } from 'pinia';
import { useGameStore } from '@/stores/game';
import { upgrades } from '@/config/upgrades';
import type { Upgrade } from '@/types/upgrade';
import { useIsMobile } from '@/composables/useIsMobile';

const asyncById = Object.fromEntries(
  upgrades.map((u) => [u.id, defineAsyncComponent(u.img)]),
) as Record<string, ReturnType<typeof defineAsyncComponent>>;

export function getDecorPositionStyle(
  upgrade: Upgrade,
  mobile: boolean,
  zIndex: number,
): StyleValue {
  const p = mobile ? upgrade.position.mobile : upgrade.position.desktop;
  return {
    position: 'absolute',
    zIndex,
    ...p,
  };
}

export interface ShopPlacedDecor {
  id: string;
  asyncComp: ReturnType<typeof defineAsyncComponent>;
  style: StyleValue;
}

/**
 * @param anchorMode `null` — предметы без якоря (глобальный слой на документе);
 *   иначе — id якоря CurvyBlock (`shopAnchor`).
 */
export function useShopDecorPlaced(anchorMode: MaybeRefOrGetter<string | null>) {
  const store = useGameStore();
  const { purchasedIds, gameUiActive } = storeToRefs(store);
  const { isMobile } = useIsMobile();

  const placed = computed((): ShopPlacedDecor[] => {
    if (!gameUiActive.value) return [];
    const mode = toValue(anchorMode);
    return purchasedIds.value
      .map((id): ShopPlacedDecor | null => {
        const u = upgrades.find((x) => x.id === id);
        if (!u) return null;
        const anchor = u.curvyAnchor?.trim() || null;
        if (mode === null) {
          if (anchor) return null;
        } else if (anchor !== mode) {
          return null;
        }
        const z = mode === null ? 6 : 2;
        return {
          id,
          asyncComp: asyncById[id],
          style: getDecorPositionStyle(u, isMobile.value, z),
        };
      })
      .filter((item): item is ShopPlacedDecor => item !== null);
  });

  return { placed };
}
