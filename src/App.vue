<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, onUnmounted, watch } from 'vue';
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
import GuestForm from '@/components/parts/GuestForm.vue';
import CurvyText from '@/components/parts/CurvyText.vue';
import NotificationHost from '@/components/NotificationHost.vue';
import TutorialTooltip from '@/components/TutorialTooltip.vue';
import { useNotifications } from '@/composables/useNotifications';
import { grantAchievement } from '@/composables/useAchievements';
import { achievements } from '@/config/achievements';
import { hasCalendarInviteAdded } from '@/config/calendarInvite';
import { CLICK_FAN_RING_CLICKS, FUSS_ACHIEVEMENT_MIN_LANG_TOGGLES, ACHIEVER_GRANT_DELAY_MS } from '@/config/gameConfig';

const store = useGameStore();
store.initFromUrl();
setupGamePersistence(store);

const { greetingName, allShopPurchased, ringClickCount, gameUiActive, purchasedIds, unlockedAchievementIds, langFakeToggleCount } =
  storeToRefs(store);

let achieverGrantDelayHandle: ReturnType<typeof setTimeout> | null = null;

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
    <curvy-block special="tag" shop-anchor="venue">
      <template #header>Место</template>
      <template #default>Калининград, Октябрьская улица, 12</template>
      <template #footer>Ресторан "Качели"</template>
    </curvy-block>
    <curvy-block even special="hourglass" shop-anchor="photo">
      <template #header>Время</template>
      <template #default>Сбор гостей в 16:30</template>
      <template #footer>Пожалуйста, не опаздывайте!</template>
    </curvy-block>
    <curvy-block shop-anchor="dress">
      <template #header>Дресс-код</template>
      <template #default>Мы не задаем цветовую схему мероприятия </template>
      <template #footer>...только просим вас одеться нарядно и быть готовыми вкусно проводить время!</template>
    </curvy-block>
    <curvy-block even special="gift" shop-anchor="cake">
      <template #header>Что подарить?</template>
      <template #default>Главный подарок - это ваша улыбка и хорошее настроение на нашем празднике!</template>
      <template #footer>
        • Если хотите дополнительно сделать нам приятное — будем рады вкладу в наш семейный бюджет в рублях или евро.
        <br>
        • Пожалуйста, воздержитесь от громоздких подарков и цветов. Мы не успеем ими насладиться и не сможем забрать с собой.
      </template>
    </curvy-block>
    <curvy-block special="heart">
      <template #header>Ждем вас!</template>
      <template #default>Будем счастливы провести этот день рядом с вами.</template>
      <template #footer>
        <span style="font-family: var(--font-family-handwritten); text-align: right; width: 100%">Влад и Эмилия</span>
      </template>
    </curvy-block>

    <curvy-text>
      <template #default>
        Заполните пожалуйста небольшую форму
      </template>
      <template #footer>
        Так мы сможем узнать ваши предпочтения на день и понять, сможете ли вы прийти:
      </template>
    </curvy-text>

    <div style="height: 2rem;"></div>

    <guest-form/>

    <div style="height: 15rem;"></div>
    <ShopModal v-if="gameUiActive" />
    <AchievementsModal v-if="gameUiActive" />
    <NotificationHost />
    <TutorialTooltip v-if="gameUiActive" />
  </div>
</template>

<style scoped>
.app {
  width: 100%;
  min-height: 100dvh;
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
