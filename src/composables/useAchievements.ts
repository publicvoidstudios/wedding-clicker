import { achievements, getAchievement, isAchievementId, type AchievementId } from '@/config/achievements';
import { useNotifications } from '@/composables/useNotifications';
import { useGameStore } from '@/stores/game';

export type { AchievementId };

export interface GrantAchievementOptions {
  sound?: string;
}

/**
 * Выдать достижение по `id` из `config/achievements`.
 * При первом получении — уведомление и опционально звук.
 * @returns true, если достижение впервые получено
 */
export function grantAchievement(
  id: AchievementId,
  options?: GrantAchievementOptions,
): boolean {
  if (!isAchievementId(id)) return false;
  const store = useGameStore();
  if (!store.gameUiActive) return false;
  if (!store.tryUnlockAchievement(id)) return false;

  const def = getAchievement(id);
  const { push } = useNotifications();
  push({
    title: 'Новое достижение!',
    message: def?.title ?? id,
    sound: options?.sound,
  });
  return true;
}

function getUnlockedAchievements() {
  const store = useGameStore();

  return store.unlockedAchievementIds;
}

export function useAchievements() {
  return {
    achievements,
    grantAchievement,
    isAchievementId,
    getAchievement,
    getUnlockedAchievements,
  };
}
