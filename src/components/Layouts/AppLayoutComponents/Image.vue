<template>
  <img
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    class="rounded-t-2xl transition-transform object-fit border border-gray-300"
  />
</template>
<script setup lang="ts">
defineProps({
  src: String,
  alt: String,
  width: Number,
  height: Number,
  preview: Boolean,
  rounded: Boolean,
});
</script>
