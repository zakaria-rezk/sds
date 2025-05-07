<template>
  <div class="">
    <div class="flex">
      <span class="rounded-span">
        <label v-if="label" :for="inputId" class="">{{ label }}</label>
      </span>
      <output
        :id="inputId"
        :type="type"
        :value="modelValue"
        class="rounded-output"
      ></output>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";

export default defineComponent({
  props: {
    modelValue: { type: String, default: "" },
    label: { type: String, default: "" },
    type: { type: String, default: "text" },
    placeholder: { type: String, default: "" },
    required: { type: Boolean, default: false },
    inputClass: { type: String, default: "" },
  },
  // emits: ["update:modelValue"],
  // computed: {
  //   // inputId() {
  //   //   return this.label
  //   //     ? `input-${this.label.replace(/\s+/g, "-").toLowerCase()}`
  //   //     : "input";
  //   // },
  //   inputValue: {
  //     // get() {
  //     //   return this.modelValue;
  //     // },
  //     // set(value) {
  //     //   this.$emit('update:modelValue', value);
  //     // },
  //   },
  // },
});
</script>


