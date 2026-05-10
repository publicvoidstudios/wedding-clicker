<template>
  <section class="date-polaroid" aria-label="Дата свадьбы">
    <div class="date-polaroid__welcome" aria-live="polite">
      <span class="date-polaroid__welcome-text">{{ welcomeDisplayed }}</span>
    </div>

    <div class="date-polaroid__grid">
      <figure
        v-for="block in blocks"
        :key="block.alt"
        class="date-polaroid__card"
      >
        <div class="date-polaroid__shell">
          <div class="date-polaroid__photo">
            <img :src="block.src" :alt="block.alt" width="720" height="1280" loading="lazy" />
            <span class="date-polaroid__digit" aria-hidden="true">{{ block.label }}</span>
          </div>
        </div>
      </figure>
    </div>

    <div class="date-polaroid__calendar">
      <template v-if="useAppleIcs">
        <button type="button" class="date-polaroid__calendar-btn" @click="onAddToCalendarIcs">
          Добавить в календарь
        </button>
        <p class="date-polaroid__calendar-hint">Откройте файл — событие добавится в «Календарь»</p>
      </template>
      <template v-else>
        <a
          class="date-polaroid__calendar-btn"
          :href="googleCalendarUrl"
          target="_blank"
          rel="noopener noreferrer"
          @click="onAddToCalendarLink"
        >
          Добавить в календарь
        </a>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { markCalendarInviteAdded } from '@/config/calendarInvite';
import { grantAchievement } from '@/composables/useAchievements';
import date1 from '@/assets/date_1.jpg';
import date3 from '@/assets/date_3.jpg';
import date4 from '@/assets/date_4.jpg';

const props = withDefaults(
  defineProps<{
    greetingName?: string;
  }>(),
  { greetingName: 'гость' },
);

const welcomeLines = computed(() => {
  const guestName = props.greetingName;
  return [
    'Мы решили пожениться!',
    `Рады видеть вас, ${guestName}!`,
    'Сохраните дату в календаре — будет волшебно...',
    'Ждём вас на нашем самом важном дне',
    'Мы хотим разделить этот день с вами!',
    'Пусть этот день станет светлой историей для нас всех',
    `${guestName}, будем счастливы видеть вас на нашем празднике`,
    'Имеем честь пригласить вас разделить с нами радость',
  ];
});

const welcomeDisplayed = ref('');
let typewriterStop = false;
let typewriterTimer: ReturnType<typeof setTimeout> | null = null;

function pickWelcomeLine(previous: string | null): string {
  const list = welcomeLines.value;
  if (list.length === 0) return '';
  if (list.length === 1) return list[0]!;
  let line = list[Math.floor(Math.random() * list.length)]!;
  let guard = 0;
  while (line === previous && guard++ < list.length * 2) {
    line = list[Math.floor(Math.random() * list.length)]!;
  }
  return line;
}

function runWelcomeTypewriter() {
  const CHAR_IN_MS = 52;
  const CHAR_OUT_MS = 36;
  const HOLD_MS = 3200;
  const BETWEEN_MS = 600;

  let target = pickWelcomeLine(null);
  let i = 0;
  let phase: 'in' | 'hold' | 'out' | 'gap' = 'in';

  const queue = (fn: () => void, ms: number) => {
    typewriterTimer = setTimeout(() => {
      typewriterTimer = null;
      if (!typewriterStop) fn();
    }, ms);
  };

  const step = () => {
    if (typewriterStop) return;

    if (phase === 'in') {
      if (i < target.length) {
        welcomeDisplayed.value = target.slice(0, i + 1);
        i += 1;
        queue(step, CHAR_IN_MS);
      } else {
        phase = 'hold';
        queue(step, HOLD_MS);
      }
      return;
    }

    if (phase === 'hold') {
      phase = 'out';
      queue(step, 0);
      return;
    }

    if (phase === 'out') {
      if (welcomeDisplayed.value.length > 0) {
        welcomeDisplayed.value = welcomeDisplayed.value.slice(0, -1);
        queue(step, CHAR_OUT_MS);
      } else {
        const prev = target;
        target = pickWelcomeLine(prev);
        i = 0;
        phase = 'gap';
        queue(step, BETWEEN_MS);
      }
      return;
    }

    phase = 'in';
    queue(step, 0);
  };

  queue(step, 400);
}

const blocks = [
  { src: date1, alt: 'День: 27', label: '27' },
  { src: date4, alt: 'Месяц: 08', label: '08' },
  { src: date3, alt: 'Год: 26', label: '26' },
] as const;

const EVENT_TITLE = 'Свадьба Влада и Эмилии';
const EVENT_DESCRIPTION = 'Сбор гостей в 16:30. Адрес и детали — на сайте приглашения.';
/** Время события в часовом поясе Москвы (UTC+3). */
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

const useAppleIcs = ref(false);

onMounted(() => {
  useAppleIcs.value = isApplePlatform();
  runWelcomeTypewriter();
});

onBeforeUnmount(() => {
  typewriterStop = true;
  if (typewriterTimer !== null) {
    clearTimeout(typewriterTimer);
    typewriterTimer = null;
  }
});

function weddingBounds() {
  const y = 2000 + Number(blocks[2].label);
  const m = Number(blocks[1].label);
  const d = Number(blocks[0].label);
  const start = new Date(
    `${y}-${pad2(m)}-${pad2(d)}T${pad2(START_H)}:${pad2(START_M)}:00+03:00`,
  );
  const end = new Date(`${y}-${pad2(m)}-${pad2(d)}T${pad2(END_H)}:${pad2(END_M)}:00+03:00`);
  return { y, m, d, start, end };
}

function icsEscape(text: string) {
  return text.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
}

function formatIcsStampUtc(d: Date): string {
  const y = d.getUTCFullYear();
  const mo = pad2(d.getUTCMonth() + 1);
  const da = pad2(d.getUTCDate());
  const h = pad2(d.getUTCHours());
  const mi = pad2(d.getUTCMinutes());
  const s = pad2(d.getUTCSeconds());
  return `${y}${mo}${da}T${h}${mi}${s}Z`;
}

function buildIcs(): string {
  const { y, m, d, start, end } = weddingBounds();
  const now = new Date();
  const uid = `wedding-${y}${pad2(m)}${pad2(d)}@wedding-invite.local`;

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
  const { y, m, d } = weddingBounds();
  const ics = buildIcs();
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `svadba-${y}-${pad2(m)}-${pad2(d)}.ics`;
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
</script>

<style scoped lang="scss">
.date-polaroid {
  --polaroid-max: min(56rem, calc(100vw - 2rem));
  --digit-font-size: 3rem;
  width: 100%;
  max-width: var(--polaroid-max);
  margin-inline: auto;
  padding: clamp(1rem, 3.5vw, 2.25rem) clamp(0.5rem, 3vw, 1rem);
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(1rem, 3vw, 1.5rem);

  &__welcome {
    display: flex;
    align-items: baseline;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.15em;
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    padding: 0 0.25rem;
    font-family: var(--font-family-handwritten), cursive;
    font-size: 1.5rem;
    line-height: 1.15;
    color: var(--wc-ink-soft);
    text-align: center;
    min-height: 2.5em;
  }

  &__welcome-text {
    user-select: none;
    flex: 1 1 auto;
    min-width: 0;
  }
}

.date-polaroid__grid {
  user-select: none;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(0.4rem, 2vw, 1rem);
  align-items: stretch;
  width: 100%;
}

.date-polaroid__card {
  margin: 0;
  min-width: 0;
  container-type: inline-size;
}

.date-polaroid__shell {
  height: 100%;
  background: linear-gradient(165deg, #fffffe 0%, #f2f0ec 100%);
  padding: clamp(0.35rem, 2.5cqw, 0.55rem) clamp(0.35rem, 2.5cqw, 0.55rem)
    clamp(0.65rem, 4.5cqw, 1rem);
  border-radius: clamp(2px, 0.4cqw, 4px);
  box-shadow:
    0 2px 4px rgba(55, 50, 45, 0.06),
    0 12px 28px rgba(45, 42, 38, 0.1),
    0 1px 0 rgba(255, 255, 255, 0.65) inset;
  box-sizing: border-box;
}

.date-polaroid__photo {
  position: relative;
  overflow: hidden;
  border-radius: clamp(1px, 0.25cqw, 2px);
}

.date-polaroid__photo img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 9 / 16;
  object-fit: cover;
}

.date-polaroid__digit {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  margin: 0;
  font-family: var(--font-family-handwritten), cursive;
  font-weight: 400;
  line-height: 1;
  color: #fff;
  letter-spacing: 0.02em;
  text-shadow:
    0 0 20px rgba(0, 0, 0, 0.45),
    0 2px 8px rgba(0, 0, 0, 0.55);
  white-space: nowrap;
  pointer-events: none;
  font-size: var(--digit-font-size);
}

.date-polaroid__calendar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  max-width: 20rem;
  margin-inline: auto;
}

.date-polaroid__calendar-btn {
  flex-shrink: 0;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  padding: 0.55rem 1.15rem;
  border: 1px solid var(--wc-border-mid);
  border-radius: 999px;
  font-family: var(--wc-sans);
  font-size: 0.88rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--wc-gold-dark);
  background: linear-gradient(180deg, rgba(255, 252, 248, 0.98) 0%, rgba(245, 242, 236, 0.95) 100%);
  box-shadow:
    0 2px 10px rgba(55, 58, 64, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.85);
  transition:
    background 0.18s ease,
    border-color 0.18s ease,
    transform 0.12s ease;
  -webkit-tap-highlight-color: transparent;
}

.date-polaroid__calendar-btn:hover {
  border-color: var(--wc-border-strong);
  background: linear-gradient(180deg, #fff 0%, #faf6f0 100%);
}

.date-polaroid__calendar-btn:active {
  transform: scale(0.98);
}

.date-polaroid__calendar-link-alt {
  font-family: var(--wc-sans);
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--wc-muted);
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.date-polaroid__calendar-link-alt:hover {
  color: var(--wc-gold-dark);
}

.date-polaroid__calendar-hint {
  margin: 0;
  padding: 0 0.25rem;
  font-family: var(--wc-sans);
  font-size: 0.72rem;
  line-height: 1.35;
  color: var(--wc-muted);
  text-align: center;
}

button.date-polaroid__calendar-btn {
  border-style: solid;
  appearance: none;
}

@media (min-width: 768px) {
  .date-polaroid {
    --digit-font-size: 6rem;
  }

  .date-polaroid__welcome {
    font-size: 3rem;
  }
}

@media (min-width: 1100px) {
  .date-polaroid {
    gap: 1.125rem;
    padding-block: 2.5rem;
  }

  .date-polaroid__grid {
    gap: 1.125rem;
  }
}
</style>
