<template>
  <select
    v-model="model"
    :class="[{ 'min-w-[300px] border-2': true }, selectClasses]"
    class="border rounded px-3 py-2 w-full"
  >
    <option :value="null" selected disabled class="text-gray-500">
      {{ placeholder }}
    </option>
    <option
      v-for="(option, index) in options"
      :key="index"
      :value="option.id"
      :class="optionClasses"
    >
      {{ option.name }}
    </option>
  </select>
</template>

<script lang="ts" setup>
import { computed, defineProps } from "vue";

const model = defineModel<string | number | null>();

interface SelectOption {
  id: string | number;
  name: string;
}

interface Props {
  options?: SelectOption[];
  placeholder?: string;
  variant?: "default" | "rounded" | "outline";
  appearance?: "primary" | "secondary";
  size?: "sm" | "md" | "xl" | "full";
}

const props = defineProps<Props>();

const selectClasses = computed(() => ({
  "rounded-md": props.variant === "rounded",
  "border-gray-300": props.variant === "outline",
  "border-transparent focus:border-gray-400": props.variant === "default",
  "bg-gray-100 hover:bg-gray-200": props.appearance === "primary",
  "py-2 border-2 bg-violet-50 px-2 hover:bg-violet-100":
    props.appearance === "secondary",
  "w-full": props.size === "full",
}));

const optionClasses = "text-black bg-white hover:bg-violet-100";
</script>


