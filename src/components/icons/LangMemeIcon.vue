<template>
  <div>
    <img src="../../assets/lang_meme.webp" alt="">
  </div>
</template>

<script setup lang="ts">
defineProps<{
  image: string;
}>()
</script>

<style scoped>
img {
  width: 48px;
  height: 48px;
  object-fit: contain;
}
</style>