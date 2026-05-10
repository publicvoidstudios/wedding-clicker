<template>
  <div class="curvy-text" :class="{ 'curvy-text--even': even }">
    <span class="curvy-text__section curvy-text__header">
      <slot name="header"/>
    </span>
    <span class="curvy-text__section curvy-text__body">
      <slot/>
    </span>
    <span class="curvy-text__section curvy-text__footer">
      <slot name="footer"/>
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  even?: boolean;
}>()
</script>

<style scoped lang="scss">
.curvy-text {
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-sizing: border-box;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: 0 10px;
  user-select: none;

  &--even {
    align-items: flex-end;
    text-align: right;
  }

  &__section {
    display: flex;
  }

  &__header {
    font-family: var(--font-family-handwritten), cursive;
    font-size: 72px;
  }

  &__body {
    font-family: var(--font-family-primary), serif;
    font-weight: 500;
    font-size: 32px;
  }

  &__footer {
    font-family: var(--font-family-primary), sans-serif;
    font-weight: 400;
    font-size: 24px;
  }
}

@container (max-width: 564px) {
  .curvy-text {
    max-width: 100%;

    &__header {
      font-size: 48px;
    }

    &__body {
      font-size: 24px;
    }

    &__footer {
      font-size: 20px;
    }
  }
}
</style>