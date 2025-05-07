<template>
    <transition name="fade">
      <div
          v-if="isMenuVisible"
          @click.self="closeMenu"
          class="fixed inset-0 bg-black bg-opacity-50 z-[50]"
      ></div>
    </transition>

    <transition name="slide">
      <div
          v-if="isMenuVisible"
          class="fixed top-0 right-0 h-full lg:w-1/3 md:w-[500px] sm:w-[300px] bg-white shadow-lg p-6 z-50"
          @keyup.esc="closeMenu"
          tabindex="0"
      >
        <button @click="toggleMenu" class="text-gray-500 hover:text-gray-700 float-right mb-4">
          Close
        </button>
        <slot></slot>
      </div>
    </transition>
</template>

<script lang="ts">


export default {
  props: {
    isMenuVisible: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    toggleMenu() {
      this.$emit('toggle-menu');
    },
    handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape' && this.isMenuVisible) {
        this.closeMenu();
      }
    },
    closeMenu() {
      this.$emit('close-menu');
    },
  },
  mounted() {
    document.addEventListener('keydown', this.handleKeydown);
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeydown);
  },
};
</script>


