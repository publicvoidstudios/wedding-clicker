/** Порог очков для появления кнопки «Магазин» */
export const SHOP_UNLOCK_SCORE = 10

/** Сколько кликов по кольцу для достижения «Настоящий фанат кликеров» */
export const CLICK_FAN_RING_CLICKS = 100

/**
 * Сколько разных предметов нужно купить, чтобы показать блок приглашения.
 * Поставьте число ≤ количества апгрейдов в `upgrades`.
 */
export const INVITATION_UNLOCK_PURCHASES = 4

/**
 * «Главный суетолог»: число переключений RU/EN (каждый клик) должно быть строго больше 20.
 */
export const FUSS_ACHIEVEMENT_MIN_LANG_TOGGLES = 21

/** Пауза перед «Достигатор», чтобы звук предыдущей ачивки успел отыграть */
export const ACHIEVER_GRANT_DELAY_MS = 15_000

export const STORAGE_KEY = 'wedding-clicker-save'

/**
 * Включить кликер, шапку со счётом, магазин, достижения и переключатель языка:
 * в URL задать `?game=true` или `?game=1` (регистр значения не важен).
 * Параметр отсутствует, пустой или иное значение — игровой режим выключен.
 */
export const GAME_UI_QUERY_PARAM = 'game'

export function isGameUiEnabledInParams(params: URLSearchParams): boolean {
  if (!params.has(GAME_UI_QUERY_PARAM)) return false
  const raw = params.get(GAME_UI_QUERY_PARAM)
  if (raw === null) return false
  const v = raw.trim().toLowerCase()
  return v === 'true' || v === '1'
}
