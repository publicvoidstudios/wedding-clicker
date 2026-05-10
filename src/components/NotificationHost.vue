<script setup lang="ts">
import { useNotifications } from '@/composables/useNotifications';

const { items, dismiss } = useNotifications();
</script>

<template>
  <Teleport to="body">
    <div
      class="notification-host"
      aria-label="Уведомления"
    >
      <TransitionGroup name="notify" tag="div" class="notification-host__list">
        <article
          v-for="n in items"
          :key="n.id"
          class="notification"
          :class="{ 'notification--no-icon': !n.icon }"
          role="status"
        >
          <div v-if="n.icon" class="notification__icon" aria-hidden="true">
            <component :is="n.icon" v-bind="n.iconProps ?? {}" />
          </div>
          <div class="notification__body">
            <h3 v-if="n.title" class="notification__title">
              {{ n.title }}
            </h3>
            <p class="notification__message">
              {{ n.message }}
            </p>
          </div>
          <button
            type="button"
            class="notification__close"
            aria-label="Закрыть уведомление"
            @click="dismiss(n.id)"
          >
            ×
          </button>
        </article>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.notification-host {
  position: fixed;
  inset: 0;
  z-index: 110;
  pointer-events: none;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0.75rem;
  padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
}

@media (min-width: 640px) {
  .notification-host {
    align-items: flex-start;
    justify-content: flex-end;
    padding: 1rem 1.25rem;
    /* Отступ от верха ≈ высота шапки + зазор, чтобы не накрывать score-bar */
    padding-top: calc(env(safe-area-inset-top, 0px) + 5.75rem);
    padding-right: max(1.25rem, env(safe-area-inset-right));
  }
}

.notification-host__list {
  pointer-events: none;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  width: 100%;
  max-width: 22rem;
  margin: 0;
}

@media (min-width: 640px) {
  .notification-host__list {
    width: auto;
  }
}

.notification {
  pointer-events: auto;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: start;
  gap: 0.65rem 0.5rem;
  width: 100%;
  max-width: 22rem;
  margin: 0 auto;
  padding: 0.75rem 0.65rem 0.75rem 0.85rem;
  border-radius: 0.85rem;
  border: 1px solid var(--wc-border-soft);
  background: linear-gradient(165deg, rgba(252, 253, 255, 0.97) 0%, rgba(238, 241, 247, 0.96) 100%);
  box-shadow:
    0 6px 28px rgba(45, 48, 56, 0.12),
    0 2px 8px var(--wc-shadow-metal),
    inset 0 1px 0 rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

@media (min-width: 640px) {
  .notification {
    margin: 0;
    padding: 0.85rem 0.7rem 0.85rem 0.95rem;
  }
}

.notification--no-icon .notification__body {
  grid-column: 1 / 3;
}

.notification__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.25rem;
  height: 2.25rem;
  margin-top: 0.05rem;
  color: var(--wc-gold-dark);
  opacity: 0.92;
}

.notification__icon :deep(svg) {
  display: block;
}

.notification__body {
  min-width: 0;
}

.notification__title {
  margin: 0 0 0.2rem;
  font-family: var(--wc-serif);
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.25;
  color: var(--wc-ink);
  letter-spacing: 0.02em;
}

.notification__message {
  margin: 0;
  font-family: var(--wc-sans);
  font-size: 0.88rem;
  font-weight: 400;
  line-height: 1.45;
  color: var(--wc-ink-soft);
}

.notification__close {
  grid-column: 3;
  grid-row: 1;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.85rem;
  height: 1.85rem;
  margin: -0.15rem -0.05rem -0.15rem 0;
  padding: 0;
  border: none;
  border-radius: 0.45rem;
  font-family: var(--wc-sans);
  font-size: 1.35rem;
  font-weight: 400;
  line-height: 1;
  color: var(--wc-muted);
  background: transparent;
  cursor: pointer;
  transition:
    color 0.15s ease,
    background 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}

.notification__close:hover {
  color: var(--wc-gold-dark);
  background: rgba(120, 132, 148, 0.1);
}

.notification__close:active {
  transform: scale(0.94);
}

.notify-enter-active,
.notify-leave-active {
  transition:
    opacity 0.28s ease,
    transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
}

.notify-move {
  transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
}

.notify-enter-from {
  opacity: 0;
  transform: translateY(0.65rem);
}

@media (min-width: 640px) {
  .notify-enter-from {
    transform: translateX(1rem);
  }
}

.notify-leave-to {
  opacity: 0;
  transform: translateX(0.45rem) scale(0.98);
}

@media (prefers-reduced-motion: reduce) {
  .notify-enter-active,
  .notify-leave-active,
  .notify-move {
    transition-duration: 0.01ms !important;
  }

  .notify-enter-from,
  .notify-leave-to {
    transform: none;
  }
}
</style>
