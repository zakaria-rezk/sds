<template>

  <form @submit.prevent="handleSubmit" class="grid w-full grid-cols-12">
    <template v-for="field in formConfig" :key="field.value">
      <div
        v-if="!field.ishidden"
        class="col-span-12"
        :class="`lg:col-span-${field.cols.lg} md:col-span-${field.cols.md}`"
      >
        <label class="" :for="field.value">{{ field.label }}</label>
        <component
          :is="component(field.type)"
          v-bind="field.props"
          v-model="formData[field.model]"
        ></component>
        <span v-if="errors[field.model]" class="error">{{
          errors[field.model]
        }}</span>
      </div>
    </template>
    <!-- <ButtonComponent :loading="ButtonLoad" :title="$t('save')" /> -->
  </form>
  <ButtonComponent
    :loading="loading"
    :title="$t('save')"
    class="form_btn"
    @click="handleSubmit"
  />
</template>

<script setup lang="ts">

import ButtonComponent from "@/components/Layouts/AppLayoutComponents/ButtonComponent.vue";

import { useSchemaValidation } from "@/composables/useValidationSchema";
import { useResetValue } from "@/composables/useResetValue";

import { reactive, onMounted } from "vue";
import GenericInputLayoutComponent from "./Layouts/FormLayoutComponents/GenericInputLayoutComponent.vue";
import GenericSelectInputLayoutComponent from "./Layouts/FormLayoutComponents/GenericSelectInputLayoutComponent.vue";
import GenricTextareaLayoutComponent from "./Layouts/FormLayoutComponents/GenricTextareaLayoutComponent.vue";

// Props
const props = defineProps({
  formConfig: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    required: false,
  },
  success: {
    type: Boolean,
    required: false,
  },
});

// Emits
const emit = defineEmits(["form-submit"]);

// Reactive state
const formData = reactive({});
const errors = reactive({});

// Initialize form data with initial values
onMounted(() => {
  props.formConfig.forEach((field) => {
    formData[field.model] = field.initialValue || null; // Use initialValue if provided, otherwise default to empty string
  });
});

// Form submission handler
const handleSubmit = async () => {
  if (validateForm()) await emit("form-submit", formData);
};

// Form validationF
const validateForm = () => {
  let isValid = true;
  Object.keys(errors).forEach((key) => (errors[key] = null)); // Clear previous errors

  props.formConfig.forEach((field) => {
    if (field.required && !formData[field.model]) {
      errors[field.model] = `${field.label} is required.`;
      isValid = false;
    }
    if (field.rules) {
      for (const rule of field.rules) {
        const res = rule(formData[field.model]);
        if (typeof res === "string") errors[field.model] = res;
      }
    }
  });
  return isValid;
};
// method to get components
const component = (inputType: string) => {
  const InputComponent: Record<string, any> = {
    select: GenericSelectInputLayoutComponent,
    textarea: GenricTextareaLayoutComponent,
  };
  return InputComponent[inputType] || GenericInputLayoutComponent;
};

// Method to update form data
const updateFormData = (newValues) => {
  Object.keys(newValues).forEach((key) => {
    if (formData[key] !== undefined) {
      formData[key] = newValues[key];
    }
  });
};

// Expose updateFormData to parent component
defineExpose({ updateFormData });
</script>

<style scoped>
.error {
  color: red;
  font-size: 0.8em;
}
</style>
