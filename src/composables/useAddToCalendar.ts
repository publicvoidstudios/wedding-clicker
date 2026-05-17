import { nextTick, onMounted, ref } from 'vue';

import { markCalendarInviteAdded } from '@/config/calendarInvite.ts';
import { grantAchievement } from '@/composables/useAchievements.ts';

export function useAddToCalendar() {
  const useAppleIcs = ref(false);

  const EVENT_TITLE = 'Свадьба Влада и Эмилии';
  const EVENT_DESCRIPTION = 'Сбор гостей в 16:30. Адрес и детали — на сайте приглашения.';
  /** Время события в часовом поясе Москвы (UTC+3). */
  const YEAR = Number(2026);
  const MONTH = Number(8);
  const DAY = Number(27);
  const START_H = 16;
  const START_M = 30;
  const END_H = 23;
  const END_M = 0;

  function pad2(n: number) {
    return String(n).padStart(2, '0');
  }

  function isApplePlatform(): boolean {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/i.test(ua)) return true;
    if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) return true;
    if (/Macintosh|Mac OS X/i.test(ua)) return true;
    return false;
  }

  function weddingBounds() {
    const start = new Date(
      `${YEAR}-${pad2(MONTH)}-${pad2(DAY)}T${pad2(START_H)}:${pad2(START_M)}:00+02:00`,
    );
    const end = new Date(`${YEAR}-${pad2(MONTH)}-${pad2(DAY)}T${pad2(END_H)}:${pad2(END_M)}:00+02:00`);
    return { start, end };
  }

  function icsEscape(text: string) {
    return text.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
  }

  function formatIcsStampUtc(date: Date): string {
    const y = date.getUTCFullYear();
    const mo = pad2(date.getUTCMonth() + 1);
    const da = pad2(date.getUTCDate());
    const h = pad2(date.getUTCHours());
    const mi = pad2(date.getUTCMinutes());
    const s = pad2(date.getUTCSeconds());
    return `${y}${mo}${da}T${h}${mi}${s}Z`;
  }

  function buildIcs(): string {
    const { start, end } = weddingBounds();
    const now = new Date();
    const uid = `wedding-${YEAR}${pad2(MONTH)}${pad2(DAY)}@wedding-invite.local`;

    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Invitation//RU',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${formatIcsStampUtc(now)}`,
      `DTSTART:${formatIcsStampUtc(start)}`,
      `DTEND:${formatIcsStampUtc(end)}`,
      `SUMMARY:${icsEscape(EVENT_TITLE)}`,
      `DESCRIPTION:${icsEscape(EVENT_DESCRIPTION)}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ];

    return lines.join('\r\n');
  }

  function onAddToCalendarLink() {
    markCalendarInviteAdded();
    grantAchievement('calendar_guest');
  }

  function onAddToCalendarIcs() {
    markCalendarInviteAdded();
    grantAchievement('calendar_guest');
    downloadIcs();
  }

  function downloadIcs() {
    const ics = buildIcs();
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `svadba-${YEAR}-${pad2(MONTH)}-${pad2(DAY)}.ics`;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function toGoogleDatesParam(start: Date, end: Date) {
    const part = (d: Date) => {
      const y = d.getUTCFullYear();
      const mo = pad2(d.getUTCMonth() + 1);
      const da = pad2(d.getUTCDate());
      const h = pad2(d.getUTCHours());
      const mi = pad2(d.getUTCMinutes());
      const s = pad2(d.getUTCSeconds());
      return `${y}${mo}${da}T${h}${mi}${s}Z`;
    };
    return `${part(start)}/${part(end)}`;
  }

  function buildCalendarUrls() {
    const { start, end } = weddingBounds();

    const googleParams = new URLSearchParams({
      action: 'TEMPLATE',
      text: EVENT_TITLE,
      dates: toGoogleDatesParam(start, end),
      details: EVENT_DESCRIPTION,
    });
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?${googleParams.toString()}`;

    return { googleCalendarUrl };
  }

  const { googleCalendarUrl } = buildCalendarUrls();

  onMounted(async () => {
    await nextTick()
    useAppleIcs.value = isApplePlatform();
  });

  return {
    useAppleIcs,
    onAddToCalendarIcs,
    googleCalendarUrl,
    onAddToCalendarLink,
  }
}