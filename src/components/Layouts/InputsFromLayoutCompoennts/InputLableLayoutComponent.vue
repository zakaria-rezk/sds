<template>
  <label :for="props.lableFor">
    {{ props.text }}
    <span class="text-red-500 pb-4" v-if="required">*</span>
  </label>
</template>
<script lang="ts" setup>
const props = defineProps<{
  lableFor: string;
  text: string;
  required? : Boolean
}>();
</script>
