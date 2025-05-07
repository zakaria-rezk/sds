<template>
  <span
    v-if="type === 'search'"
    class="absolute inset-y-0 ltr:left-3 rtl:right-3 flex items-center text-gray-400"
  >
    <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
  </span>
  <input
    class="w-full"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
   
    v-model="model"
    :class="[{ 'rtl:pr-8 ltr:pl-8': type === 'search' }, inputClasses]"
  />
  <span v-if="error">{{ error }}</span>
</template>

<script lang="ts" setup>
import { ref, computed, defineProps, defineEmits } from "vue";
const model = defineModel<string>();
type InputType = "text" | "number" | "password" | "email" | "search" | "date";

interface Props {
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  type?: InputType;
  variant?: "default" | "rounded" | "outline";
  appearance?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "xl" | "full";
}
const props = defineProps<Props>();
const inputClasses = computed(() => {
  return {
    "py-2 px-4 min-w-[300px] bg-gray-100 text-black border-2": true,
    "rounded-md": props.variant === "rounded",
    "border-gray-300": props.variant === "outline",
    "border-transparent focus:border-gray-400": props.variant === "default",
    "bg-blue-500": props.appearance === "primary",
    "py-2 border-2 bg-violet-50 px-2": props.appearance === "secondary",
    "text-sm  px-2": props.size === "sm",
    "text-base  px-4": props.size === "md",
    "text-lg  px-6": props.size === "xl",
    "w-full": props.size === "full",
  };
});
</script>


