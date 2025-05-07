<template>
  <div class="flex justify-between items-center">
    <div class="px-4">
      <nav class="flex text-uppercase items-center text-sm rounded">
        <router-link to="/welcome">
          <span class="hover:text-color-lite mx-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="size-6"
            >
              <path
                d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z"
              />
              <path
                d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z"
              />
            </svg>
          </span> </router-link
        >/
        <div class="flex items-center text-gray-700 cursor-pointer">
          <router-link
            :to="{ name: 'Dashboard' }"
            class="mx-2 hover:text-color-lite"
            >{{ $t("side-bar.dashboard") }}</router-link
          >
        </div>
        <div
          v-for="(route, index) in props.BreadCrumps"
          :key="index"
          class="flex items-center text-gray-700 cursor-pointer"
        >
          /
          <router-link :to="{ name: route.route, params: route.params }">
            <span
              class="mx-2 hover:text-color-lite"
              :class="{ 'text-[#cdc9c9] cursor-auto': index === props.BreadCrumps.length - 1 }"
            >
              {{ route.text }}
            </span>
            <span
              v-if="index < props.BreadCrumps.length - 1"
              class="text-gray-400"
            >
            </span>
          </router-link>
        </div>
      </nav>
    </div>
    <div class="px-5" v-if="btn">
      <button
        @click="emitFire()"
        :disabled="props.disabled"
        :class="{ 'opacity-50': props.disabled }"
        class="btn-primary btn"
      >
        {{ props.btn }}
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
interface BreadCrump {
  text: string;
  route: string;
  params?: any;
}
interface Props {
  readonly BreadCrumps: BreadCrump[];
  btn?: string;
  disabled?: boolean;
}
import { useRouter } from "vue-router";
const emit = defineEmits<{
  (event: "toggleModalEmit"): void;
}>();
const emitFire = () => {
  emit("toggleModalEmit");
};
const props = defineProps<Props>();
</script>

