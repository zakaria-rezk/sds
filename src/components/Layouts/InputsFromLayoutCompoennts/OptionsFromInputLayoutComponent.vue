<template>
  <div class="mb-4">
    <label v-if="label" :for="selectId" class="block text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <select
        :id="selectId"
        v-model="selectedValue"
        :required="required"
        :class="['mt-1 block w-full border py-2 rounded-md border-gray-300 shadow-sm', selectClass]"
    >
      <option v-if="placeholder" disabled value="">{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.text }}
      </option>
    </select>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    modelValue: { type: [String, Number], default: '' },
    label: { type: String, default: '' },
    options: { type: Array, required: true },
    placeholder: { type: String, default: 'Please select an option' },
    required: { type: Boolean, default: false },
    selectClass: { type: String, default: '' },
  },
  emits: ['update:modelValue'],
  computed: {
    selectId() {
      return this.label ? `select-${this.label.replace(/\s+/g, '-').toLowerCase()}` : 'select';
    },
    selectedValue: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      },
    },
  },
});
</script>


