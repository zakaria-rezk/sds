<template>
  <div class="mb-4">
    <div class="flex justify-between">
      <label v-if="label" :for="inputId" class="block text-sm font-medium text-gray-700">
        {{ label }}
      </label>
    </div>
    <input
        :id="inputId"
        :type="type"
        v-model="inputValue"
        :placeholder="placeholder"
        :required="required"
        :class="['mt-1 block w-full rounded-md border py-2 px-3 border-gray-300 shadow-sm', inputClass]"
    />
  </div>
</template>

<script>
import {defineComponent, computed} from 'vue';

export default defineComponent({
  props: {
    modelValue: {type: [String, Number], default: ''},
    label: {type: String, default: ''},
    type: {type: String, default: 'text'},
    placeholder: {type: String, default: ''},
    required: {type: Boolean, default: false},
    inputClass: {type: String, default: ''},
  },
  emits: ['update:modelValue'],
  computed: {
    inputId() {
      return this.label ? `input-${this.label.replace(/\s+/g, '-').toLowerCase()}` : 'input';
    },
    inputValue: {
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

