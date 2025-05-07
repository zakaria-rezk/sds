<template>
  <div
    v-if="showModal"
    class="bg-black bg-opacity-50 absolute top-0 right-0 h-screen w-full"
  >
    <div
      class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 shadow-lg w-full px-8 md:w-1/2 lg:w-1/3 rounded"
    >
      <span
        class="close absolute top-[10px] end-[10px] text-2xl cursor-pointer"
        @click="closeModal"
      >
        <font-awesome-icon :icon="['fas', 'xmark']" />
      </span>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showModal: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
  },
};
</script>
