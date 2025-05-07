<template>
  <div class="rounded-border">
    <table>
      <thead class="main-thead">
        <tr>
          <th>
            <span>{{ pageLable }} </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="allFields">
          <div class="grid grid-cols-1 p-2">
            <div v-for="field in allFields" :key="field.label">
              <OutputTextComponent
                :label="field.label"
                :modelValue="field.value"
              />
            </div>
          </div>
        </tr>

        <tr>
          <div class="flex flex-wrap justify-start m-2 gap-4">
            <div
              class="shadow rounded-3xl color-lite relative px-4 my-2 min-w-[250px] border-2 animated"
              v-for="(card, index) in props.Cards"
              :class="{
                'border-color-primary': ActiveCards.includes(card.id),
                'border-gray-50': !ActiveCards.includes(card.id),
              }"
              :key="index"
            >
              <div
                class="data whitespace-pre-line py-1 text-center text-md text-slate-700"
              >
                <p
                  v-for="(string, index) in card.strings"
                  :key="index"
                  class="py-1"
                >
                  {{ string }}
                </p>
              </div>
              <hr class="border-gray-300" />
              <ToggleButtonComponent
                variant="slider"
                :checked="props.ActiveCards.includes(card.id)"
                :disabled="props.DisabledBtns?.has(card.id)"
                @fireToggleEmit="switchStatus($event, card.id)"
              />
            </div>
          </div>
          <!-- ------------- -->
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts" setup>
import { defineEmits, defineProps, onMounted } from "vue";
const route = useRoute();
import ToggleButtonComponent from "@/components/Layouts/AppLayoutComponents/ToggleButtonComponent.vue";

import OutputTextComponent from "@/components/Layouts/FormLayoutComponents/OutputTextComponent.vue";

import { useRoute } from "vue-router";
interface Props {
  Cards: any;
  ActiveCards: any;
  DisabledBtns: any;
  allFields?: Array<any>;
  pageLable?: string;
}
const props = defineProps<Props>();

const emits = defineEmits<{
  (e: "switchStatus", isChecked: boolean, row_id: number): void;
}>();

const switchStatus = (isChecked: boolean, row_id: number) => {
  emits("switchStatus", isChecked, row_id);
};
</script>
<style scoped>
.animated {
  transition: all 0.5s ease-in-out;
}
.animated {
  animation: down2top 0.5s ease-in-out forwards;
}
.animated {
  transition: all 0.5s ease-in-out;
}
@keyframes down2top {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 2;
    transform: translateY(0);
  }
}
</style>
