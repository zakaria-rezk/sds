<template>
  <form @submit.prevent="onSubmit">
    <div class="container">
      <div class="row items-end">
        <p>{{ schema }}</p>
        <template v-for="(field, index) in schema" :key="index">
          <!-- <GenericForm
            class="w-full"
            v-if="field.type === 'group'"
            :schema="field.value"
          /> -->
          <div
            :class="getColClasses(field.cols)"
            class="mb-3"
          >
       
            <component
                :is="getFieldComponent(field.type)"
                v-bind="{ ...field }"
                v-model="field.value"
                @update:modelValue="
                  field.updateValueHandler ? field.updateValueHandler($event) : ''
                "
              /> 
            <div v-if="errors[index]" class="field-error">
              {{ errors[index] }}
            </div>
          </div>
        </template>
      </div>
      <slot name="submit"></slot>
    </div>
  </form>
</template>

<script setup>
import { ref } from "vue";
import GenericInputLayoutComponent from "./GenericInputLayoutComponent.vue";
//import { validateField } from "@/utils/validation"; // Utility function to handle validation

// import GenericForm from "./index.vue";

// import Text from "@/components/common/FieldTypes/Text.vue";
// import Number from "@/components/common/FieldTypes/Number.vue";
// import Phone from "@/components/common/FieldTypes/Phone.vue";
// import Password from "@/components/common/FieldTypes/Password.vue";
// import Date from "@/components/common/FieldTypes/Date.vue";
// import Checkbox from "@/components/common/FieldTypes/Checkbox.vue";
// import Select from "@/components/common/FieldTypes/Select.vue";
// import MultiSelect from "@/components/common/FieldTypes/MultiSelect.vue";
// import File from "@/components/common/FieldTypes/File.vue";
// import Button from "@/components/common/FieldTypes/Button.vue";

const props = defineProps({
  schema: {
    type: Array,
    required: true,
  },
});

const errors = ref({});
const emit = defineEmits(["submit"]);

const validateForm = () => {
  errors.value = {}; // Reset errors
  props.schema.forEach((field, index) => {
    const error = validateField(field.value, field.rules);
    if (error) {
      errors.value[index] = error; // Store error using field index
    }
  });
};

const iShowField = (field) => {
  if (field.hide) return false;
  return true;
};

const onSubmit = () => {
  validateForm();
  if (Object.keys(errors.value).length === 0) {
    emit("submit", props.schema);
  }
};

const getFieldComponent = (type) => {
  const components = {
    text: Text,
    number: Number,
    phone: Phone,
    date: Date,
    password: Password,
    checkbox: Checkbox,
    select: Select,
    multiselect: MultiSelect,
    file: File,
    button: Button,
  };
  return components[type] || "div";
};

const getColClasses = (cols) => {
  return {
    "col-12": !cols, // Default to full width if no cols are provided
    [`col-sm-${cols?.sm || 12}`]: cols?.sm !== undefined,
    [`col-md-${cols?.md || 12}`]: cols?.md !== undefined,
    [`col-lg-${cols?.lg || 12}`]: cols?.lg !== undefined,
    [`col-xl-${cols?.xl || 12}`]: cols?.xl !== undefined,
  };
};
</script>


