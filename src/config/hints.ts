/** Минимальные поля стора для проверки условий подсказок */
export interface HintStoreSlice {
  readonly displayScore: number
  readonly purchasedIds: readonly string[]
}

/** Где показать карточку (классы в `GameHint.vue`) */
export type HintPreset =
  | 'stage-bottom-center'
  | 'stage-top-center'
  | 'below-header-right'

export interface HintConditions {
  /** Показать, если очков (целых) не меньше */
  minDisplayScore?: number
  /** Показать, если куплено предметов не больше (0 = ни одного) */
  maxPurchasedCount?: number
}

export interface HintDefinition {
  id: string
  text: string
  preset: HintPreset
  conditions: HintConditions
}

/**
 * Все подсказки по приоритету: первая подходящая по условиям и не закрытая пользователем.
 */
export const hints: HintDefinition[] = [
  {
    id: 'shop-nudge-at-50',
    text: 'Уже много очков! Загляни в магазин — оформи заказ, чтобы пошёл пассивный доход.',
    preset: 'stage-bottom-center',
    conditions: {
      minDisplayScore: 50,
      maxPurchasedCount: 0,
    },
  },
]

function matchesConditions(store: HintStoreSlice, c: HintConditions): boolean {
  if (c.minDisplayScore !== undefined && store.displayScore < c.minDisplayScore) {
    return false
  }
  if (
    c.maxPurchasedCount !== undefined &&
    store.purchasedIds.length > c.maxPurchasedCount
  ) {
    return false
  }
  return true
}

export function getActiveHint(
  store: HintStoreSlice,
  dismissedIds: readonly string[],
): HintDefinition | null {
  const dismissed = new Set(dismissedIds)
  for (const hint of hints) {
    if (dismissed.has(hint.id)) continue
    if (matchesConditions(store, hint.conditions)) return hint
  }
  return null
}
