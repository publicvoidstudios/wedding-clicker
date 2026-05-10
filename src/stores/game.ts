import { defineStore } from 'pinia'
import { watch } from 'vue'
import {
  STORAGE_KEY,
  SHOP_UNLOCK_SCORE,
  INVITATION_UNLOCK_PURCHASES,
  isGameUiEnabledInParams,
} from '@/config/gameConfig'
import { isAchievementId } from '@/config/achievements'
import { upgrades } from '@/config/upgrades'

/**
 * true, если при загрузке страницы уже был save, или мы уже сохраняли в этой вкладке.
 * Если пользователь очистил localStorage, а здесь всё ещё true — память приложения устарела,
 * нужно сбросить стор (иначе тик/touch снова запишут старые очки).
 */
let persistenceExpectedInStorage = false

interface RawPersisted {
  score?: unknown
  guestName?: unknown
  purchasedIds?: unknown
  shopEverUnlocked?: unknown
  dismissedHints?: unknown
  unlockedAchievementIds?: unknown
  ringClickCount?: unknown
  langFakeToggleCount?: unknown
}

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as RawPersisted
    const rawScore = typeof data.score === 'number' ? data.score : 0
    const score = Math.floor(rawScore)
    const shopEverUnlocked =
      typeof data.shopEverUnlocked === 'boolean'
        ? data.shopEverUnlocked
        : score >= SHOP_UNLOCK_SCORE
    const dismissedHints = Array.isArray(data.dismissedHints)
      ? (data.dismissedHints as string[]).filter((id) => typeof id === 'string')
      : []
    const unlockedAchievementIds = Array.isArray(data.unlockedAchievementIds)
      ? (data.unlockedAchievementIds as string[]).filter((id) => typeof id === 'string')
      : []
    const ringClickRaw = data.ringClickCount
    const ringClickCount =
      typeof ringClickRaw === 'number' && Number.isFinite(ringClickRaw)
        ? Math.max(0, Math.floor(ringClickRaw))
        : 0
    const langToggleRaw = data.langFakeToggleCount
    const langFakeToggleCount =
      typeof langToggleRaw === 'number' && Number.isFinite(langToggleRaw)
        ? Math.max(0, Math.floor(langToggleRaw))
        : 0

    return {
      score,
      guestName: typeof data.guestName === 'string' ? data.guestName : '',
      purchasedIds: Array.isArray(data.purchasedIds) ? (data.purchasedIds as string[]) : [],
      shopEverUnlocked,
      dismissedHints,
      unlockedAchievementIds,
      ringClickCount,
      langFakeToggleCount,
    }
  } catch {
    return null
  }
}

interface GameState {
  score: number
  guestName: string
  purchasedIds: string[]
  shopEverUnlocked: boolean
  /** id подсказок из `config/hints`, закрытых пользователем */
  dismissedHints: string[]
  /** id из `config/achievements` */
  unlockedAchievementIds: string[]
  /** ручные клики по кольцу (не пассивный доход) */
  ringClickCount: number
  /** клики по фейковому переключателю RU/EN в шапке */
  langFakeToggleCount: number
  shopOpen: boolean
  achievementsModalOpen: boolean
  tickHandle: number | null
  /** Задаётся только из URL при `initFromUrl` (см. `isGameUiEnabledInParams` в gameConfig) */
  gameUiActive: boolean
}

export const useGameStore = defineStore('game', {
  state: (): GameState => {
    const saved = loadPersisted()
    persistenceExpectedInStorage = saved !== null
    return {
      score: saved?.score ?? 0,
      guestName: saved?.guestName ?? '',
      purchasedIds: saved?.purchasedIds ?? [],
      shopEverUnlocked: saved?.shopEverUnlocked ?? false,
      dismissedHints: saved?.dismissedHints ?? [],
      unlockedAchievementIds: saved?.unlockedAchievementIds ?? [],
      ringClickCount: saved?.ringClickCount ?? 0,
      langFakeToggleCount: saved?.langFakeToggleCount ?? 0,
      shopOpen: false,
      achievementsModalOpen: false,
      tickHandle: null,
      gameUiActive: false,
    }
  },

  getters: {
    displayScore: (s) => Math.floor(s.score),

    shopUnlocked: (s) => s.shopEverUnlocked || s.score >= SHOP_UNLOCK_SCORE,

    totalCps: (state) =>
      state.purchasedIds.reduce((sum: number, id: string) => {
        const u = upgrades.find((x) => x.id === id)
        return sum + (u?.cps ?? 0)
      }, 0),

    purchaseCount: (s) => s.purchasedIds.length,

    /** Куплены все позиции из списка `upgrades` */
    allShopPurchased: (s) => upgrades.every((u) => s.purchasedIds.includes(u.id)),

    invitationVisible: (s) => s.purchasedIds.length >= INVITATION_UNLOCK_PURCHASES,

    greetingName: (s) => s.guestName.trim() || 'Дорогой гость',
  },

  actions: {
    initFromUrl() {
      const params = new URLSearchParams(window.location.search)
      const name = params.get('name')
      if (name !== null && name.trim() !== '') {
        this.guestName = name.trim()
      }
      this.gameUiActive = isGameUiEnabledInParams(params)
    },

    /** Сброс при очистке localStorage (или из другой вкладки): новая игра, имя снова из ?name= */
    applyExternalReset() {
      this.score = 0
      this.guestName = ''
      this.purchasedIds = []
      this.shopEverUnlocked = false
      this.dismissedHints = []
      this.unlockedAchievementIds = []
      this.ringClickCount = 0
      this.langFakeToggleCount = 0
      this.shopOpen = false
      this.achievementsModalOpen = false
      this.initFromUrl()
    },

    dismissHint(id: string) {
      if (this.dismissedHints.includes(id)) return
      this.dismissedHints.push(id)
    },

    bumpLangFakeToggle() {
      this.langFakeToggleCount += 1
    },

    clickRing() {
      this.ringClickCount += 1
      this.score += 1
      this.markShopUnlockedIfNeeded()
    },

    tick(deltaMs: number) {
      const cps = this.totalCps
      if (cps <= 0) return
      this.score += (cps * deltaMs) / 1000
      this.markShopUnlockedIfNeeded()
    },

    /** Вызывать после любого роста очков: порог магазина запоминается навсегда */
    markShopUnlockedIfNeeded() {
      if (this.score >= SHOP_UNLOCK_SCORE) {
        this.shopEverUnlocked = true
      }
    },

    openShop() {
      this.shopOpen = true
    },

    closeShop() {
      this.shopOpen = false
    },

    openAchievementsModal() {
      this.achievementsModalOpen = true
    },

    closeAchievementsModal() {
      this.achievementsModalOpen = false
    },

    /** Возвращает false, если id не из списка достижений или уже получено. */
    tryUnlockAchievement(id: string): boolean {
      if (!isAchievementId(id)) return false
      if (this.unlockedAchievementIds.includes(id)) return false
      this.unlockedAchievementIds.push(id)
      return true
    },

    buy(id: string) {
      if (this.purchasedIds.includes(id)) return
      const item = upgrades.find((u) => u.id === id)
      if (!item || this.score < item.cost) return
      this.score -= item.cost
      this.purchasedIds.push(id)
    },

    startPassiveIncome() {
      if (this.tickHandle !== null) return
      let last = performance.now()
      const loop = (now: number) => {
        const delta = now - last
        last = now
        this.tick(delta)
        this.tickHandle = requestAnimationFrame(loop)
      }
      this.tickHandle = requestAnimationFrame(loop)
    },

    stopPassiveIncome() {
      if (this.tickHandle !== null) {
        cancelAnimationFrame(this.tickHandle)
        this.tickHandle = null
      }
    },
  },
})

export type GameStore = ReturnType<typeof useGameStore>

function persist(store: GameStore) {
  if (localStorage.getItem(STORAGE_KEY) === null && persistenceExpectedInStorage) {
    persistenceExpectedInStorage = false
    store.applyExternalReset()
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      score: Math.floor(Number(store.score)),
      guestName: store.guestName,
      purchasedIds: store.purchasedIds,
      shopEverUnlocked: store.shopEverUnlocked,
      dismissedHints: store.dismissedHints,
      unlockedAchievementIds: store.unlockedAchievementIds,
      ringClickCount: store.ringClickCount,
      langFakeToggleCount: store.langFakeToggleCount,
    }),
  )
  persistenceExpectedInStorage = true
}

export function setupGamePersistence(store: GameStore) {
  watch(
    () => ({
      score: store.score,
      guestName: store.guestName,
      purchasedIds: store.purchasedIds,
      shopEverUnlocked: store.shopEverUnlocked,
      dismissedHints: store.dismissedHints,
      unlockedAchievementIds: store.unlockedAchievementIds,
      ringClickCount: store.ringClickCount,
      langFakeToggleCount: store.langFakeToggleCount,
    }),
    () => persist(store),
    { deep: true },
  )

  window.addEventListener('storage', (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY || e.storageArea !== localStorage) return
    if (e.newValue != null || e.oldValue == null) return
    persist(store)
  })
}
