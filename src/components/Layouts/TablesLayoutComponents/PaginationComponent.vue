<template>
  <div class="flex-center color-light">
    <div class="relative">
      <button
        @click="previousPage"
        :disabled="currentPage === 1"
        class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ $t("previous") }}
      </button>
      <button
        @click="nextPage"
        :disabled="currentPage === lastPage"
        class="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ $t("next") }}
      </button>
    </div>
    <!-- <div class="relative">
      <label for="items-per-page" class="sr-only">Items per page</label>
      <select
        id="items-per-page"
        v-model="itemsPerPage"
        @change="onItemsPerPageChange"
        class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
      >
        <option v-for="i in itemsPerPageOptions" :key="i" :value="i">
          {{ i }}/Page
        </option>
      </select>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  lastPage: number;
  totalItems: number;
  currentPage: number;
  perPage?: number;
}>();

const emit = defineEmits(["update:page"]);

const nextPage = () => {
  let nextPage = props.currentPage + 1;
  emit("update:page", nextPage);
};
const previousPage = () => {
  let nextPage = props.currentPage - 1;
  emit("update:page", nextPage);
};
</script>
