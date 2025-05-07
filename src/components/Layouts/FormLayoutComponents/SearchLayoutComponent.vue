<template>
  <section class="just-rounded-border bg-white">
    <div
      class="main-thead static just-rounded-border color-primary py-3 -my-0.5 -mx-0.5"
    >
      <span class="px-8">{{ $t("search") }}</span>
    </div>
    <div
      class="grid xl:grid-cols-3 lg:grid-cols-2 gap-4 md:grid-cols-2 sm:grid-cols-1 p-2"
    >
      <div
        v-for="(field, index) in props.Schema"
        :key="index"
        class="flex"
      >
        <span class="rounded-span"
          ><label class="truncate">{{ field.label }}</label></span
        >
        <component
          :is="field.component"
          v-model="searchObject[field.model]"
          v-bind="field.props"
        />
      </div>
    </div>
    <div>
      <div class="py-2">
        <ButtonComponent
          class="btn color-primary"
          :title="$t('adjustment_form.form.search')"
          @click="() => emits('update:search', searchObject)"
        />
        <ButtonComponent
          class="btn color-primary"
          :title="$t('reset')"
          @click="reset(searchObject)"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useResetValue } from "@/composables/useResetValue";
const { reset } = useResetValue();

import ButtonComponent from "../AppLayoutComponents/ButtonComponent.vue";
// import { debounce } from "@/utils/debounce";

const emits = defineEmits<{
  (event: "update:search", form_label: any): void;
}>();
// const form_label = ref<string>("");
const props = defineProps<{
  Schema: Array<{
    label: string;
    model: string;
    component: any;
    animation?: string;
    props?: Record<string, any>;
  }>;
}>();
const searchObject = ref(
  props.Schema.reduce((acc, field) => {
    acc[field.model] = field.props.initialValue ?? null;
    return acc;
  }, {} as Record<string, any>)
);

// watch(form_label, (newVal, oldVal) => {
//   console.log(newVal, oldVal);
//   searchObject.value.form_label = newVal;
//   console.log(searchObject.value);
//   debounceFn();
// });
// const debounceFn = debounce(() => {
//   emits("update:search", searchObject.value);
// }, 500);
</script>
