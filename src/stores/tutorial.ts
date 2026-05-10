import { defineStore } from 'pinia'
import { STORAGE_KEY } from '@/config/gameConfig'

export const TUTORIAL_STORAGE_KEY = 'tutorial_progress'

export interface TutorialStep {
  id: string
  active: boolean
}

function normalizeSteps(parsed: unknown): TutorialStep[] | null {
  if (!Array.isArray(parsed)) return null
  const out: TutorialStep[] = []
  for (const row of parsed) {
    if (
      row &&
      typeof row === 'object' &&
      'id' in row &&
      typeof (row as TutorialStep).id === 'string' &&
      'active' in row &&
      typeof (row as TutorialStep).active === 'boolean'
    ) {
      out.push({ id: (row as TutorialStep).id, active: (row as TutorialStep).active })
    }
  }
  return out.length > 0 ? out : null
}

function defaultFreshSteps(): TutorialStep[] {
  return [{ id: 'welcome-love-scores', active: true }]
}

function completedSteps(): TutorialStep[] {
  return [
    { id: 'welcome-love-scores', active: false },
    { id: 'tutorial-complete', active: true },
  ]
}

function loadInitialSteps(): TutorialStep[] {
  try {
    const raw = localStorage.getItem(TUTORIAL_STORAGE_KEY)
    if (raw) {
      const parsed = normalizeSteps(JSON.parse(raw))
      if (parsed) return parsed
    }
  } catch {
    /* use default below */
  }

  /* Игрок заходил раньше (есть сейв игры), но записи о туториале ещё не было */
  if (localStorage.getItem(STORAGE_KEY) !== null) {
    const migrated = completedSteps()
    localStorage.setItem(TUTORIAL_STORAGE_KEY, JSON.stringify(migrated))
    return migrated
  }

  return defaultFreshSteps()
}

export const useTutorialStore = defineStore('tutorial', {
  state: (): { steps: TutorialStep[] } => ({
    steps: loadInitialSteps(),
  }),

  getters: {
    isWelcomeTutorialActive: (s) =>
      s.steps.some((step) => step.id === 'welcome-love-scores' && step.active),

    isTutorialComplete: (s) =>
      s.steps.some((step) => step.id === 'tutorial-complete' && step.active),
  },

  actions: {
    completeWelcomeStep() {
      const next = this.steps.map((step): TutorialStep => {
        if (step.id === 'welcome-love-scores') return { ...step, active: false }
        return step
      })
      if (!next.some((s) => s.id === 'tutorial-complete')) {
        next.push({ id: 'tutorial-complete', active: true })
      } else {
        const i = next.findIndex((s) => s.id === 'tutorial-complete')
        if (i !== -1) next[i] = { ...next[i], active: true }
      }
      this.steps = next
      localStorage.setItem(TUTORIAL_STORAGE_KEY, JSON.stringify(this.steps))
    },
  },
})

export type TutorialStore = ReturnType<typeof useTutorialStore>
