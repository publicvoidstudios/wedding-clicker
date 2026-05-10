<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useGameStore } from '@/stores/game';
import { achievements } from '@/config/achievements';

const store = useGameStore();
const { achievementsModalOpen, unlockedAchievementIds } = storeToRefs(store);

const rows = computed(() =>
  achievements.map((a) => ({
    ...a,
    unlocked: unlockedAchievementIds.value.includes(a.id),
  })),
);

function close() {
  store.closeAchievementsModal();
}

function onBackdrop(e: MouseEvent) {
  if (e.target === e.currentTarget) close();
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="achievementsModalOpen"
        class="backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ach-title"
        @click="onBackdrop"
      >
        <div class="dialog">
          <div class="dialog-head">
            <h2 id="ach-title" class="title">Достижения</h2>
            <button type="button" class="close" aria-label="Закрыть" @click="close">×</button>
          </div>
          <p class="lead">Соберите все штампики. Под названием — подсказка, как открыть ачивку.</p>
          <ul class="list">
            <li
              v-for="row in rows"
              :key="row.id"
              class="card"
              :class="{ 'card--locked': !row.unlocked }"
            >
              <div class="card-text">
                <span class="card-name">{{ row.title }}</span>
                <p class="card-hint">{{ row.description }}</p>
              </div>
              <span v-if="row.unlocked" class="stamp" aria-label="Получено">
                <span class="stamp__glyph" aria-hidden="true">✓</span>
              </span>
              <span v-else class="stamp stamp--empty" aria-hidden="true" />
            </li>
          </ul>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(28, 32, 42, 0.48);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
}

@media (min-width: 640px) {
  .backdrop {
    align-items: center;
    padding: 1.5rem;
  }
}

.dialog {
  width: 100%;
  max-width: 420px;
  max-height: min(88vh, 640px);
  overflow: auto;
  background: linear-gradient(165deg, #fcfdff 0%, #eef1f7 100%);
  border-radius: 1.25rem 1.25rem 0 0;
  box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--wc-border-mid);
  padding: 1.25rem 1.25rem calc(1.5rem + env(safe-area-inset-bottom));

  &::-webkit-scrollbar {
    display: none;
  }
}

@media (min-width: 640px) {
  .dialog {
    border-radius: 1.25rem;
    padding-bottom: 1.5rem;
  }
}

.dialog-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.title {
  margin: 0;
  font-family: var(--wc-serif);
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--wc-ink);
}

.close {
  border: none;
  background: rgba(140, 152, 168, 0.14);
  color: var(--wc-ink);
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
}

.lead {
  margin: 0 0 1rem;
  font-size: 0.9rem;
  color: var(--wc-muted);
  line-height: 1.4;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.card {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid var(--wc-border-soft);
  border-radius: 0.75rem;
}

.card-text {
  flex: 1;
  min-width: 0;
}

.card-name {
  font-weight: 600;
  font-size: 0.95rem;
  color: #1a1d22;
  line-height: 1.35;
  display: block;
}

.card-hint {
  margin: 0.4rem 0 0;
  font-size: 0.82rem;
  line-height: 1.45;
  color: var(--wc-ink-soft);
  font-weight: 400;
}

.card--locked .card-name {
  color: #9aa4b2;
  font-weight: 500;
}

.card--locked .card-hint {
  color: #b0b8c4;
}

.stamp {
  flex-shrink: 0;
  align-self: center;
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--wc-gold-dark);
  background: linear-gradient(180deg, rgba(255, 252, 248, 0.98) 0%, rgba(238, 241, 247, 0.95) 100%);
  box-shadow: 0 2px 8px rgba(55, 65, 80, 0.12);
}

.stamp--empty {
  border-style: dashed;
  border-color: var(--wc-border-mid);
  background: rgba(255, 255, 255, 0.35);
  box-shadow: none;
}

.stamp__glyph {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--wc-gold-dark);
  line-height: 1;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-active .dialog,
.modal-leave-active .dialog {
  transition: transform 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .dialog,
.modal-leave-to .dialog {
  transform: translateY(12px);
}

@media (min-width: 640px) {
  .modal-enter-from .dialog,
  .modal-leave-to .dialog {
    transform: scale(0.96);
  }
}
</style>
