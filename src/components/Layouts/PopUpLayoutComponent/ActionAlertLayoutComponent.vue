<template>
  <div class="p-6 text-center">
    <h2 class="text-lg font-semibold">Are you sure?</h2>
    <p class="text-gray-600 mt-2">
      This action cannot be undone. Do you want to proceed?
    </p>
    <div class="mt-4 flex justify-center gap-4">
      <button
        @click="$emit('ConfirmProcess')"
        class="px-4 py-2 bg-red-600 text-white rounded"
      >
        Delete
      </button>
      <button
        @click="$emit('CancleProcess')"
        class="px-4 py-2 bg-gray-300 rounded"
      >
        Cancel
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
const emits = defineEmits<{
  (event: "ConfirmProcess"): void;
  (event: "CancleProcess"): void;
}>();
</script>
