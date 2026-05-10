import camera from '../assets/sounds/camera-i-thought-it-was-an-owl.mp3';
import cake from '../assets/sounds/i-bring-cake.mp3';
import lyapota from '../assets/sounds/lyapota.mp3';
import heat from '../assets/sounds/the-heat-has-gone.mp3';
import parrot from '../assets/sounds/the-parrot-says-quotwat-da-fuqquot.mp3';
import continued from '../assets/sounds/to-be-continued.mp3';
import tututu from '../assets/sounds/tututu.mp3';
import fuss from '../assets/sounds/want-to-make-a-fuss.mp3';
import penetration from '../assets/sounds/penetration.mp3';
import dumb from '../assets/sounds/dumb.mp3';

/**
 * Карта имён звуков для уведомлений.
 *
 * Добавьте файл в `src/assets/sounds/` и импорт:
 *   import chime from '@/assets/sounds/chime.mp3';
 *   …и ключ в объекте ниже: `chime,`
 *
 * Либо передайте в push({ sound: '/…' }) / полный URL без записи в карту.
 */
export const notificationSoundMap: Record<string, string> = {
  camera,
  cake,
  lyapota,
  heat,
  parrot,
  continued,
  tututu,
  fuss,
  penetration,
  dumb,
};

/**
 * Разрешает строку `sound` из опций уведомления:
 * - `https://…` / `http://…`
 * - путь от корня сайта, начинающийся с `/` (в т.ч. URL после `import x from '*.mp3'` в Vite)
 * - ключ из `notificationSoundMap`
 */
export function resolveNotificationSoundUrl(sound?: string | null): string | null {
  if (sound == null) return null;
  const t = String(sound).trim();
  if (!t) return null;
  if (/^https?:\/\//i.test(t)) return t;
  if (t.startsWith('/')) return t;
  if (Object.prototype.hasOwnProperty.call(notificationSoundMap, t)) {
    return notificationSoundMap[t]!;
  }
  return null;
}
