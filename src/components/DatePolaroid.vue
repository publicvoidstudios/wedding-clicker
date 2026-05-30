<template>
  <section class="date-polaroid" aria-label="Дата свадьбы">
    <div class="date-polaroid__wrapper">
      <span class="date-polaroid__names">
        Влад & Эмилия
        <span class="date-polaroid__names__additional">wedding day</span>
      </span>

      <img width="300" src="../assets/welcome.png" alt="">
      <div class="date-polaroid__welcome" aria-live="polite">
        <span class="date-polaroid__welcome-text" style="font-weight: 600">Мы решили пожениться!</span>
        <span class="date-polaroid__welcome-text">
          И хотим разделить этот день с {{ greetingPronounPlural ? 'вами' : 'тобой' }}!
          <br>
          {{ greetingName }}, будем рады видеть {{ greetingPronounPlural ? 'вас' : 'тебя' }} на нашем празднике.
          <br>
          Сохрани{{ greetingPronounPlural ? 'те' : '' }} дату в календаре — создадим теплые воспоминания вместе!
        </span>

      </div>

      <span class="date-polaroid__digit">27 августа 2026</span>

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

      <div class="date-polaroid__more">
        <span>Листайте ниже, там вся важная информация</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useAddToCalendar } from '@/composables/useAddToCalendar';

const {
  greetingName = 'гость',
  greetingPronounPlural = true,
} = defineProps<{
  greetingName?: string;
  greetingPronounPlural?: boolean;
}>();

const {
  useAppleIcs,
  onAddToCalendarIcs,
  googleCalendarUrl,
  onAddToCalendarLink,
} = useAddToCalendar();

</script>

<style scoped lang="scss">
.date-polaroid {
  --polaroid-max: min(56rem, calc(100vw - 2rem));
  --digit-font-size: 3rem;
  --welcome-font-size: 1.5rem;
  width: 100%;
  max-width: var(--polaroid-max);
  margin-inline: auto;
  padding: clamp(1rem, 3.5vw, 2.25rem) clamp(0.5rem, 3vw, 1rem);
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(1rem, 3vw, 1.5rem);

  min-height: 100dvh;

  &__wrapper {
    width: 100%;
    height: 100%;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: clamp(1rem, 3vw, 1.5rem);
    justify-content: center;
    align-items: center;
  }

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
    font-size: var(--welcome-font-size);
  }

  &__names {
    font-family: var(--font-family-primary), sans-serif;
    font-size: var(--digit-font-size);
    position: relative;

    &__additional {
      position: absolute;
      right: -40px;
      top: 70%;
      transform: rotateZ(-0.05turn);
      font-family: var(--font-family-handwritten), cursive;
      font-size: 2rem;
      color: #aa2c2c;
    }
  }

  &__more {
    font-family: var(--font-family-primary), sans-serif;
  }

  &__digit {
    margin: 0;
    font-family: var(--font-family-handwritten), cursive;
    font-weight: 500;
    line-height: 1;
    color: var(--fg-default);
    letter-spacing: 0.02em;
    white-space: nowrap;
    pointer-events: none;
    font-size: var(--digit-font-size);
  }

  &__calendar {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.65rem;
    width: 100%;
    max-width: 20rem;
    margin-inline: auto;
  }

  &__calendar-btn {
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
    font-family: var(--font-family-primary), sans-serif;
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

  &__calendar-btn:hover {
    border-color: var(--wc-border-strong);
    background: linear-gradient(180deg, #fff 0%, #faf6f0 100%);
  }

  &__calendar-btn:active {
    transform: scale(0.98);
  }

  &__calendar-link-alt {
    font-family: var(--wc-sans);
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--wc-muted);
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }

  &__calendar-link-alt:hover {
    color: var(--wc-gold-dark);
  }

  &__calendar-hint {
    margin: 0;
    padding: 0 0.25rem;
    font-family: var(--wc-sans);
    font-size: 0.72rem;
    line-height: 1.35;
    color: var(--wc-muted);
    text-align: center;
  }
}

button.date-polaroid__calendar-btn {
  border-style: solid;
  appearance: none;
}

@media (min-width: 768px) {
  .date-polaroid {
    --welcome-font-size: 2rem;
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
}
</style>
