<template>
  <teleport to="#app">
    <transition name="fade-up-downs">
      <div
        v-if="props.showModal"
         
        class="bg-black  fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      >
        <slot></slot>
      </div> </transition
  ></teleport>
</template>
<script setup lang="ts">
interface Props {
  showModal: boolean;
}
const props = defineProps({
  showModal: {
    type: Boolean,
    default: false,
  },
}) as Props;
</script>

