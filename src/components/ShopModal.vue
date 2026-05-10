<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useGameStore } from '@/stores/game';
import { upgrades } from '@/config/upgrades';
import type { Upgrade } from '@/types/upgrade';

import iconShop from '@/components/icons/shopping-bag-svgrepo-com.svg?url';

type ShopRow = Upgrade & { owned: boolean; affordable: boolean }

const store = useGameStore();
const { shopOpen, score, purchasedIds } = storeToRefs(store);

const rows = computed((): ShopRow[] =>
  upgrades.map((u) => ({
    ...u,
    owned: purchasedIds.value.includes(u.id),
    affordable: score.value >= u.cost,
  })),
);

function close() {
  store.closeShop();
}

function buy(id: string) {
  store.buy(id);
}

function onBackdrop(e: MouseEvent) {
  if (e.target === e.currentTarget) close();
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="shopOpen"
        class="backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shop-title"
        @click="onBackdrop"
      >
        <div class="dialog">
          <div class="dialog-head">
            <div class="title-row">
              <span
                class="title-icon"
                aria-hidden="true"
                :style="{
                  maskImage: `url(${iconShop})`,
                  WebkitMaskImage: `url(${iconShop})`,
                }"
              />
              <h2 id="shop-title" class="title">Магазин праздника</h2>
            </div>
            <button type="button" class="close" aria-label="Закрыть" @click="close">×</button>
          </div>
          <p class="lead">Потратьте очки на услуги — они приносят пассивный доход.</p>
          <ul class="list">
            <li v-for="item in rows" :key="item.id" class="card">
              <div class="card-main">
                <span class="card-name">{{ item.name }}</span>
                <span class="card-meta">{{ item.cost }} очков · +{{ item.cps }}/сек</span>
              </div>
              <button
                type="button"
                class="buy"
                :disabled="item.owned || !item.affordable"
                @click="buy(item.id)"
              >
                {{ item.owned ? 'Куплено' : 'Купить' }}
              </button>
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

.title-row {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  min-width: 0;
}

.title-icon {
  flex-shrink: 0;
  width: 1.6rem;
  height: 1.6rem;
  background-color: var(--wc-gold-dark);
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}

.title {
  margin: 0;
  font-family: var(--wc-serif);
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--wc-ink);
  min-width: 0;
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
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid var(--wc-border-soft);
  border-radius: 0.75rem;
}

.card-main {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}

.card-name {
  font-weight: 600;
  color: var(--wc-ink);
}

.card-meta {
  font-size: 0.8rem;
  color: var(--wc-muted);
}

.buy {
  flex-shrink: 0;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  background: linear-gradient(135deg, #c5ccd6, #8b95a6);
  color: #fff;
  box-shadow: 0 2px 12px var(--wc-shadow-metal);
}

.buy:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: none;
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
