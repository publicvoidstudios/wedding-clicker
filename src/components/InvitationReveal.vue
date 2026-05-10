<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/game'

const { invitationVisible } = storeToRefs(useGameStore())
</script>

<template>
  <div class="scroll-block">
    <div v-if="!invitationVisible" class="teaser" aria-hidden="false">
      <p class="teaser-line">Вниз — детали праздника</p>
      <span class="teaser-chevron" aria-hidden="true">↓</span>
      <p class="teaser-hint">
        Раскройте свадьбу в игре выше — и здесь появится полная программа, адрес и пожелания.
      </p>
    </div>

    <div class="invitation-root" :class="{ visible: invitationVisible }">
      <p v-if="invitationVisible" class="intro">Ниже — всё, что нужно знать гостю</p>

      <article v-if="invitationVisible" class="panel">
        <h2 class="panel-title">Место и время</h2>
        <div class="panel-body">
          <p class="panel-lead">Усадьба «Рыба»</p>
          <p class="panel-text">Лесная аллея, 7</p>
          <hr class="panel-rule" />
          <p class="panel-text">
            <time datetime="2026-08-15T14:00">14:00</time>
            — встреча гостей и церемония
          </p>
          <p class="panel-text">
            <time datetime="2026-08-15T15:30">15:30</time>
            — банкет и танцы
          </p>
        </div>
      </article>

      <article v-if="invitationVisible" class="panel">
        <h2 class="panel-title">Дресс-код</h2>
        <div class="panel-body">
          <p class="panel-text">Коктейльный стиль.</p>
          <p class="panel-text muted">
            Будем рады пастельным и натуральным оттенкам — как летний сад на закате.
          </p>
        </div>
      </article>

      <article v-if="invitationVisible" class="panel">
        <h2 class="panel-title">Что можно подарить</h2>
        <div class="panel-body">
          <p class="panel-text">
            Для нас главный подарок — ваше присутствие. Если захотите порадовать конвертом или
            вкладом в медовый месяц — мы будем благодарны.
          </p>
          <p class="panel-text muted">
            Цветы просим не дарить — лучше подарите тост или тёплые слова в книге пожеланий у входа.
          </p>
        </div>
      </article>

      <article v-if="invitationVisible" class="panel">
        <h2 class="panel-title">Расписание дня</h2>
        <div class="panel-body panel-timeline">
          <div class="slot">
            <span class="slot-time">13:30</span>
            <span class="slot-desc">Сбор гостей, приветственный напиток</span>
          </div>
          <div class="slot">
            <span class="slot-time">14:00</span>
            <span class="slot-desc">Церемония</span>
          </div>
          <div class="slot">
            <span class="slot-time">15:00</span>
            <span class="slot-desc">Фуршет и фотосессия</span>
          </div>
          <div class="slot">
            <span class="slot-time">15:30</span>
            <span class="slot-desc">Банкет</span>
          </div>
          <div class="slot">
            <span class="slot-time">22:00</span>
            <span class="slot-desc">Торт и первый танец — дальше только музыка</span>
          </div>
        </div>
      </article>



      <article v-if="invitationVisible" class="panel panel-farewell">
        <h2 class="panel-title">Ждём вас</h2>
        <div class="panel-body">
          <p class="farewell-main">Будем счастливы провести этот день рядом с вами.</p>
          <p class="farewell-sign">
            С любовью,
            <br />
            Аня и Миша
          </p>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.scroll-block {
  width: 100%;
}

iframe {
  :deep(.Footer) {
    background: red !important;
  }
}


.teaser {
  max-width: 26rem;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 4rem;
  text-align: center;
}

.teaser-line {
  font-family: var(--wc-serif);
  font-size: 1.15rem;
  color: var(--wc-muted);
  margin: 0 0 0.35rem;
}

.teaser-chevron {
  display: block;
  font-size: 1.5rem;
  color: var(--wc-accent);
  opacity: 0.7;
  margin-bottom: 1rem;
  animation: bounce-soft 2s ease-in-out infinite;
}

.teaser-hint {
  font-size: 0.88rem;
  line-height: 1.5;
  color: var(--wc-muted);
  margin: 0;
}

@keyframes bounce-soft {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(6px);
  }
}

.invitation-root {
  opacity: 0;
  transform: translateY(18px);
  transition:
    opacity 1.2s ease,
    transform 1.2s ease;
  pointer-events: none;
}

.invitation-root.visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.intro {
  max-width: 28rem;
  margin: 0 auto;
  padding: 0 1.5rem 2rem;
  text-align: center;
  font-family: var(--wc-serif);
  font-size: 1.25rem;
  color: var(--wc-ink-soft);
}

.panel {
  width: 100%;
  min-height: min(52vh, 420px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3.25rem 1.75rem;
  border-top: 1px solid var(--wc-border-soft);
  background: rgba(248, 249, 252, 0.45);
}

.panel:nth-of-type(even) {
  background: rgba(236, 240, 246, 0.72);
}

.panel:nth-of-type(odd) {
  background: rgba(244, 247, 251, 0.45);
}

.panel-farewell {
  min-height: min(48vh, 380px);
  border-bottom: none;
  padding-bottom: calc(3.5rem + env(safe-area-inset-bottom));
}

.panel-title {
  max-width: 28rem;
  width: 100%;
  margin: 0 auto 1.25rem;
  font-family: var(--font-family-handwritten);
  font-size: clamp(2rem, 10vw, 4rem);
  font-weight: 400;
  letter-spacing: 0.04em;
  color: var(--wc-ink);
}

.panel-body {
  max-width: 28rem;
  width: 100%;
  margin: 0 auto;
}

.panel-lead {
  font-family: var(--font-family-primary);
  font-size: 1.75rem;
  font-weight: 400;
  color: var(--wc-ink);
  margin: 0 0 0.35rem;
}

.panel-text {
  font-family: var(--font-family-primary);
  font-weight: 400;
  font-size: 1.5rem;
  line-height: 1.65;
  color: var(--wc-ink-soft);
  margin: 0 0 0.85rem;
}

.panel-text:last-child {
  margin-bottom: 0;
}

.panel-text.muted {
  color: var(--wc-muted);
  font-size: 0.98rem;
}

.panel-rule {
  border: none;
  border-top: 1px solid var(--wc-border-mid);
  margin: 1.25rem 0;
}

.panel-timeline {
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.slot {
  display: grid;
  grid-template-columns: 4.25rem 1fr;
  gap: 1rem 1.25rem;
  align-items: baseline;
}

.slot-time {
  font-family: var(--font-family-monotype);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--wc-gold-dark);
  font-variant-numeric: tabular-nums;
}

.slot-desc {
  font-size: 1.02rem;
  line-height: 1.55;
  color: var(--wc-ink-soft);
}

.farewell-main {
  font-family: var(--wc-serif);
  font-size: 1.35rem;
  line-height: 1.45;
  color: var(--wc-ink);
  margin: 0 0 1.75rem;
}

.farewell-sign {
  font-family: var(--wc-serif);
  font-size: 1.15rem;
  font-style: italic;
  color: var(--wc-muted);
  margin: 0;
  line-height: 1.5;
}
</style>
