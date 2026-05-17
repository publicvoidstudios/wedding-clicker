<template>
  <div
    class="guest-form__wrapper"
    :style="{ height: formContainerHeight + 'px' }"
  >
    <div
      ref="formContainerRef"
      class="guest-form"
    >
      <iframe
        src="https://forms.yandex.ru/u/69ef6bbe90fa7b0ce9591779?iframe=0"
        frameborder="0"
        name="ya-form-69ef6bbe90fa7b0ce9591779"
        width="650"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

import { nextTick, onMounted, ref } from 'vue';

const formContainerRef = ref<HTMLElement | null>(null);

const FORM_FOOTER_HEIGHT = 66;

const formContainerHeight = ref(0);

onMounted(async () => {
  await nextTick();

  if (formContainerRef.value) {
    const observer = new ResizeObserver((ent: ResizeObserverEntry[]) => {
      formContainerHeight.value = ent[0].borderBoxSize[0].blockSize - FORM_FOOTER_HEIGHT;
    });

    observer.observe(formContainerRef.value);
  }
});
</script>

<style scoped lang="scss">
.guest-form {
  display: flex;
  justify-content: center;
  padding: 10px;
  overflow: hidden;

  &__wrapper {
    overflow: hidden;
  }
}
</style>