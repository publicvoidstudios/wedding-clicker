import { markRaw, shallowReactive } from 'vue';
import type { Component } from 'vue';
import { resolveNotificationSoundUrl } from '@/config/notificationSounds';

export interface NotificationOptions {
  title?: string;
  message: string;
  icon?: Component;
  iconProps?: Record<string, unknown>;
  /**
   * Длительность в мс. `0` — не закрывать по таймеру (только крестик).
   * По умолчанию 5200.
   */
  durationMs?: number;
  /**
   * Звук: ключ из `notificationSoundMap` или абсолютный URL / путь от корня (`/…`).
   */
  sound?: string;
}

export interface NotificationItem {
  id: number;
  title?: string;
  message: string;
  icon?: Component;
  iconProps?: Record<string, unknown>;
  durationMs: number;
}

const items = shallowReactive<NotificationItem[]>([]);
const timers = new Map<number, ReturnType<typeof setTimeout>>();
let idSeq = 0;

const NOTIFY_SOUND_VOLUME = 0.42;

function playNotificationSound(url: string) {
  try {
    const audio = new Audio(url);
    audio.volume = NOTIFY_SOUND_VOLUME;
    void audio.play().catch(() => {});
  } catch {
    /* decode / autoplay */
  }
}

function clearTimer(id: number) {
  const t = timers.get(id);
  if (t !== undefined) {
    clearTimeout(t);
    timers.delete(id);
  }
}

export function dismissNotification(id: number) {
  clearTimer(id);
  const i = items.findIndex((x) => x.id === id);
  if (i >= 0) items.splice(i, 1);
}

export function pushNotification(opts: NotificationOptions): number {
  const soundUrl = resolveNotificationSoundUrl(opts.sound);
  if (soundUrl) {
    playNotificationSound(soundUrl);
  }

  const id = ++idSeq;
  const durationMs = opts.durationMs ?? 5200;
  items.push({
    id,
    title: opts.title,
    message: opts.message,
    icon: opts.icon ? markRaw(opts.icon) : undefined,
    iconProps: opts.iconProps,
    durationMs,
  });
  if (durationMs > 0) {
    const t = window.setTimeout(() => dismissNotification(id), durationMs);
    timers.set(id, t);
  }
  return id;
}

export function useNotifications() {
  return {
    items,
    push: pushNotification,
    dismiss: dismissNotification,
  };
}
