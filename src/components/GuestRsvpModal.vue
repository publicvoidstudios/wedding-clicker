<script setup lang="ts">
import CurvyText from '@/components/parts/CurvyText.vue';
import GuestForm from '@/components/parts/GuestForm.vue';

const open = defineModel<boolean>({ default: false });

function close() {
  open.value = false;
}

function onBackdrop(e: MouseEvent) {
  if (e.target === e.currentTarget) close();
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rsvp-modal-title"
        @click="onBackdrop"
      >
        <div class="dialog">
          <div class="dialog-head">
            <h2 id="rsvp-modal-title" class="title">Подтвердите присутствие</h2>
            <button type="button" class="close" aria-label="Закрыть" @click="close">×</button>
          </div>
          <div class="body">
            <curvy-text>
              <template #default>
                <span style="font-family: var(--font-family-primary), sans-serif; text-align: right">
                  <br>
                  <br>
                  Заполните, пожалуйста, небольшую форму.
                </span>
              </template>
              <template #footer>
                Так мы поймем, сможете ли вы прийти на наш праздник, а также узнать ваши предпочтения.
              </template>
            </curvy-text>
            <div class="body-spacer" />
            <guest-form />
          </div>
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
  padding:
    env(safe-area-inset-top)
    env(safe-area-inset-right)
    env(safe-area-inset-bottom)
    env(safe-area-inset-left);
}

@media (min-width: 640px) {
  .backdrop {
    align-items: center;
    padding: 1.5rem;
  }
}

.dialog {
  width: 100%;
  max-width: min(42rem, 100vw - 1.25rem);
  max-height: min(92vh, 900px);
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
  margin-bottom: 0.65rem;
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
  flex-shrink: 0;
}

.body-spacer {
  height: 2rem;
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
