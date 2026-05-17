<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, onUnmounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia'
import { useGameStore, setupGamePersistence } from '@/stores/game'
import ScoreHeader from '@/components/ScoreHeader.vue'
import RingClicker from '@/components/RingClicker.vue'
import PurchasedLayer from '@/components/PurchasedLayer.vue'
import ShopModal from '@/components/ShopModal.vue'
import AchievementsModal from '@/components/AchievementsModal.vue'
import CompletionStageHint from '@/components/CompletionStageHint.vue'
import DatePolaroid from "@/components/DatePolaroid.vue";
import CurvyBlock from '@/components/parts/CurvyBlock.vue';
import GuestRsvpModal from '@/components/GuestRsvpModal.vue';
import NotificationHost from '@/components/NotificationHost.vue';
import TutorialTooltip from '@/components/TutorialTooltip.vue';
import { useNotifications } from '@/composables/useNotifications';
import { grantAchievement } from '@/composables/useAchievements';
import { achievements } from '@/config/achievements';
import { hasCalendarInviteAdded } from '@/config/calendarInvite';
import { CLICK_FAN_RING_CLICKS, FUSS_ACHIEVEMENT_MIN_LANG_TOGGLES, ACHIEVER_GRANT_DELAY_MS } from '@/config/gameConfig';
import BackgroundPattern from '@/components/parts/BackgroundPattern.vue';

const store = useGameStore();
store.initFromUrl();
setupGamePersistence(store);

const { greetingName, allShopPurchased, ringClickCount, gameUiActive, purchasedIds, unlockedAchievementIds, langFakeToggleCount } =
  storeToRefs(store);

let achieverGrantDelayHandle: ReturnType<typeof setTimeout> | null = null;

const guestRsvpModalOpen = ref(false);

const allAchievementsUnlocked = computed(
  () =>
    gameUiActive.value &&
    achievements.every((a) => unlockedAchievementIds.value.includes(a.id)),
);

watch(
  allAchievementsUnlocked,
  (on) => {
    document.documentElement.classList.toggle('wc-all-achievements', on);
  },
  { immediate: true },
);

watch(
  () => store.gameUiActive,
  (on) => {
    if (!on) {
      store.closeShop();
      store.closeAchievementsModal();
    }
  },
  { immediate: true },
);

function beforeUnloadHandler(e: BeforeUnloadEvent) {
  if (hasCalendarInviteAdded()) return;
  e.preventDefault();
  e.returnValue = '';
}

onMounted(() => {
  if (store.gameUiActive) {
    store.startPassiveIncome();
  }
  window.addEventListener('beforeunload', beforeUnloadHandler);
});

onUnmounted(() => {
  store.stopPassiveIncome();
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', beforeUnloadHandler);
  document.documentElement.classList.remove('wc-all-achievements');
  if (achieverGrantDelayHandle !== null) {
    clearTimeout(achieverGrantDelayHandle);
    achieverGrantDelayHandle = null;
  }
});

const { push } = useNotifications();

watch(allShopPurchased, (newVal) => {
  if (!store.gameUiActive) return;
  if (newVal) {
    push({
      title: 'Поздравляем!',
      message: 'Вы открыли все улучшения! Будем считать что вам понравилось наше приглашение!',
      durationMs: 10000,
    });
  }
});

watch(
  allShopPurchased,
  (newVal) => {
    if (!store.gameUiActive) return;
    if (newVal) {
      grantAchievement('shop_master', { sound: 'tututu' });
    }
  },
  { immediate: true },
);

watch(
  ringClickCount,
  (n) => {
    if (!store.gameUiActive) return;
    if (n >= CLICK_FAN_RING_CLICKS) {
      grantAchievement('click_fan', { sound: 'dumb' });
    }
  },
  { immediate: true },
);

watch(
  langFakeToggleCount,
  (n) => {
    if (!store.gameUiActive) return;
    if (n >= FUSS_ACHIEVEMENT_MIN_LANG_TOGGLES) {
      grantAchievement('fuss', { sound: 'fuss' });
    }
  },
  { immediate: true },
);

watch(
  purchasedIds,
  (ids) => {
    if (!store.gameUiActive) return;
    if (ids.includes('dj')) grantAchievement('dj', { sound: 'heat' });
    if (ids.includes('cake')) grantAchievement('cake', { sound: 'cake' });
    if (ids.includes('photo')) grantAchievement('photographer', { sound: 'camera' });
  },
  { deep: true, immediate: true },
);

watch(
  unlockedAchievementIds,
  (ids) => {
    if (achieverGrantDelayHandle !== null) {
      clearTimeout(achieverGrantDelayHandle);
      achieverGrantDelayHandle = null;
    }

    if (!store.gameUiActive) return;
    if (ids.includes('achiever')) return;

    const prereq = achievements.map((a) => a.id).filter((id) => id !== 'achiever');
    if (!prereq.every((id) => ids.includes(id))) return;

    achieverGrantDelayHandle = setTimeout(() => {
      achieverGrantDelayHandle = null;
      if (!store.gameUiActive) return;
      grantAchievement('achiever', { sound: 'continued' });
    }, ACHIEVER_GRANT_DELAY_MS);
  },
  { deep: true, immediate: true },
);
</script>

<template>
  <div class="app">
    <PurchasedLayer v-if="gameUiActive" />
    <section v-if="gameUiActive" class="game-screen" aria-label="Игра">
      <ScoreHeader />

      <div class="game-body">
        <div class="stage">
          <CompletionStageHint />
          <div class="stage-center">
            <RingClicker />
          </div>
        </div>
      </div>
    </section>

    <DatePolaroid :greeting-name="greetingName" />
    <curvy-block
      special="tag"
      shop-anchor="venue"
      header-offset="30px"
      body-offset="0px"
      footer-offset="30px"
      :outline-position="{
        desktop: { x: '0px', y: '-20px' },
        mobile: { x: '0px', y: '-15px' },
      }"
      outline-size="80%"
    >
      <template #header>Место</template>
      <template #default>Ресторан "Качели"</template>
      <template #footer>Калининград, Октябрьская улица, 12</template>
    </curvy-block>
    <curvy-block
      even
      special="hourglass"
      shop-anchor="photo"
      header-offset="40px"
      body-offset="0"
      footer-offset="40px"
      :outline-position="{
        desktop: { x: '-35px', y: '-20px' },
        mobile: { x: '-35px', y: '-12px' },
      }"
      :path-variation="2"
      outline-size="80%"
    >
      <template #header>
        <span>Время</span>
      </template>
      <template #default>Сбор гостей в 16:30</template>
      <template #footer>Пожалуйста, не опаздывайте!</template>
    </curvy-block>
    <curvy-block
      shop-anchor="dress"
      header-offset="40px"
      body-offset="0px"
      footer-offset="40px"
      :outline-stroke-width="9"
      :outline-position="{
        desktop: { x: '10px', y: '-40px' },
        mobile: { x: '20px', y: '-25px' },
      }"
      :path-variation="3"
      outline-size="80%"
      :background-variation="2"
    >
      <template #header>Дресс-код</template>
      <template #default>Мы не задаем цветовую схему мероприятия </template>
      <template #footer>...только просим вас одеться нарядно и быть готовыми вкусно проводить время!</template>
    </curvy-block>
    <curvy-block
      even
      special="gift"
      shop-anchor="cake"
      header-offset="40px"
      body-offset="0px"
      footer-offset="0px"
      :path-variation="4"
      :outline-stroke-width="6"
      :outline-position="{
        desktop: { x: '-20px', y: '-25px' },
        mobile: { x: '-20px', y: '-15px' },
      }"
      outline-size="100%"
      :background-variation="2"
    >
      <template #header>
        <div>
          <span style="padding-right: 60px; text-align: right;">Что</span><br>подарить?
        </div>
      </template>
      <template #default>
        Главный подарок - это ваша улыбка<br>и хорошее настроение на нашем празднике!
      </template>
      <template #footer>
        <div style="max-width: 600px; width: 100%; padding-inline: 7.5%; text-align: center;">
          <br>
          <p>
            Если хотите дополнительно сделать нам приятно,
            <br>
            будем рады вкладу в наш семейный бюджет в рублях или евро.
          </p>
          <p>
            Пожалуйста, воздержитесь от громоздких подарков и цветов - мы не успеем ими насладиться и не сможем забрать с собой.
          </p>
        </div>
      </template>
    </curvy-block>
    <curvy-block
      special="heart"
      header-offset="40px"
      body-offset="0px"
      footer-offset="80px"
      :path-variation="3"
      :outline-stroke-width="9"
      :outline-position="{
        desktop: { x: '10px', y: '-45px' },
        mobile: { x: '20px', y: '-25px' },
      }"
      outline-size="80%"
    >
      <template #header>Ждем вас!</template>
      <template #default>
        <div>
          <p>Будем счастливы провести этот день</p>
          <p style="padding-left: 40px">рядом с вами.</p>
        </div>
      </template>
      <template #footer>
        <span style="font-family: var(--font-family-handwritten); padding-right: 40px; text-align: right; width: 100%">Влад и Эмилия</span>
      </template>
    </curvy-block>

    <div class="invite-rsvp-wrap">
      <button
        type="button"
        class="invite-rsvp-btn"
        @click="guestRsvpModalOpen = true"
      >
        Подтвердить присутствие
      </button>
    </div>

    <curvy-block even special="glasses"></curvy-block>

    <GuestRsvpModal v-model="guestRsvpModalOpen" />

    <div style="height: 2rem;"></div>
    <ShopModal v-if="gameUiActive" />
    <AchievementsModal v-if="gameUiActive" />
    <NotificationHost />
    <TutorialTooltip v-if="gameUiActive" />
    
    <background-pattern></background-pattern>

  </div>
</template>

<style scoped lang="scss">
.pattern-images {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  user-select: none;

  &__img-1 {
    position: absolute;
    left: 0;
    top: 100px;
    opacity: 0.15;
    width: 200px;
  }

  &__corner-1 {
    position: absolute;
    right: 0;
    top: 0;
    opacity: 0.15;
    width: 200px;
  }
}


.invite-rsvp-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 20rem;
  margin-inline: auto;
  margin-top: 4rem;
}

.invite-rsvp-btn {
  flex-shrink: 0;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  padding: 0.55rem 1.15rem;
  border: 1px solid var(--wc-border-mid);
  border-radius: 999px;
  border-style: solid;
  appearance: none;
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

.invite-rsvp-btn:hover {
  border-color: var(--wc-border-strong);
  background: linear-gradient(180deg, #fff 0%, #faf6f0 100%);
}

.invite-rsvp-btn:active {
  transform: scale(0.98);
}

.app {
  width: 100%;
  min-height: 100dvh;
  overflow-x: clip;
  position: relative;
}

.game-screen {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
}

.game-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 0 1rem 2.75rem;
}

.greeting {
  flex-shrink: 0;
  text-align: center;
  font-family: var(--wc-serif);
  font-size: clamp(1rem, 3.8vw, 1.2rem);
  font-weight: 500;
  color: var(--wc-ink-soft);
  padding: 0.65rem 0.25rem 0.35rem;
  line-height: 1.35;
}

.stage {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
  width: 100%;
}

.stage-center {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.hints-layer {
  position: absolute;
  inset: 0;
  z-index: 28;
  pointer-events: none;
}

.scroll-hint {
  position: absolute;
  bottom: calc(0.55rem + env(safe-area-inset-bottom));
  left: 0;
  right: 0;
  margin: 0;
  text-align: center;
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--wc-muted);
  opacity: 0.72;
  pointer-events: none;
}
</style>
