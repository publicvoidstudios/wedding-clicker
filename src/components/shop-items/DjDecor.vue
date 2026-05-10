<template>
  <div class="decor polaroid" aria-hidden="true">
    <img src="../../assets/gifs/dj.gif" alt="">
  </div>
</template>

<style scoped lang="scss">
.decor {
  pointer-events: none;
  filter: drop-shadow(0 6px 5px rgba(0, 0, 0, 0.15));

  transform: rotate(-16deg);
}

.polaroid {
  background: white;
  padding: 4px 4px 10px;
  width: 600px;

  img {
    width: 100%;
  }
}

.svg {
  display: block;
  width: 100%;
  height: auto;
}
</style>
<script setup lang="ts">
</script>