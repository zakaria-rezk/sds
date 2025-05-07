<template>
  <teleport to="body">
    <div class="">
      <div
        style="background-color: rgba(0, 0, 0, 0.5)"
        class="w-full shadow fixed h-screen top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-50"
        ref="container"
      >
        <div
          class="sm:w-1/3 z-50 sm:h-1/2 w-full relative text-primary bg-white rounded-3xl flex flex-col justify-center items-center"
        >
          <svg
            width="78"
            height="78"
            viewBox="0 0 78 78"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="78" height="78" rx="39" fill="#65CE00" />
            <path
              d="M27.625 42.25L32.8788 46.1903C33.5754 46.7127 34.56 46.5933 35.1115 45.9194L48.75 29.25"
              stroke="white"
              stroke-width="4.5"
              stroke-linecap="round"
            />
          </svg>
          <h2 class="py-2">{{ message }}</h2>
          <p class="">{{ followUpMessage }}</p>
          <router-link
            class="bg-systemColor py-2 px-4 my-4 text-white text-xl rounded-full"
            to=""
            @click="handleClickOutSide"
          >
            {{ routeText }}</router-link
          >
        </div>
      </div>
    </div>
  </teleport>
</template>
<script lang="ts">
import { before } from "node:test";

export default {
  props: {
    message: { type: String, required: true },
    followUpMessage: {
      type: String,
      required: false,
    },
    routeText: {
      type: String,
      required: true,
    },
    route: {
      type: String,
      required: false,
    },
  },
  methods: {
    handleClickOutSide(event: Event) {
      const e = event.target as HTMLElement;
      if (!e) return;

      if (
        e === this.$refs.container ||
        e.classList.contains("router-link-exact-active")
      ) {
        this.$emit("closeModal");
      }
    },
  },
  mounted() {
    this.container = this.$refs.container;

    document.addEventListener("click", this.handleClickOutSide);
    document.documentElement.style.overflowY = "hidden";
  },
  beforeUnmount() {
    document.documentElement.style.overflowY = "scroll";
    document.removeEventListener("click", this.handleClickOutSide);
  },
};
</script>
