<template>
  <transition name="modal">
    <div
      @keydown.esc="emitFire"
      :tabindex="1"
      ref="modal"
      class="absolute dialog overflow-y-auto max-h-[90vh] transform bg-white p-5 shadow-lg w-full px-8 md:w-1/2 lg:w-1/3 rounded overflow-y-auto m-h-[80vh]"
    >
      <div class="modal-content">
        <div class="flex justify-center">
          <span
            class="close absolute top-[10px] end-[10px] text-2xl cursor-pointer"
            @click="emitFire"
            ><font-awesome-icon :icon="['fas', 'xmark']"
          /></span>
          <div class="text-center w-full py-4 text-white" v-if="title">
            <h2 class="w-full rounded color-primary p-2">
              {{ title }}
            </h2>
          </div>
        </div>
        <slot></slot>
      </div>
    </div>
  </transition>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { ref } from "vue";
const modal = ref<HTMLDivElement>();
const emit = defineEmits<{
  (event: "closeModal"): void;
}>();
const emitFire = () => {
  emit("closeModal");
};
interface Props {
  title?: string;
}
const props = defineProps<Props>();
onMounted(() => {
  if (modal.value) {
    modal.value.focus();
  }
});
</script>
<style scoped>
.dialog {
  animation: modal 0.3s ease-out forwards;
}

.modal-enter-active {
  animation: modal 0.3s ease-out forwards;
}

.modal-leave-active {
  animation: modal 0.3s ease-in reverse;
}

@keyframes modal {
  from {
    opacity: 0;
    transform: translateY(-100px) scale(0);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
