<template>
  <div class="rounded-border z-10">
    <table>
      <thead class="main-thead">
        <tr>
          <th>
            <span>{{ pageLable }} </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- -------------------------------- -->
        <tr v-if="allFields">
          <div class="grid grid-cols-4 gap-2 p-2">
            <div
              v-for="field in allFields"
              :key="field.label"
              v-show="field.label != 'Stu'"
            >
              <div v-if="field.form_id">
                <router-link
                  :to="`/inventory/purchasing/RFQ-details/${field.form_id}/${field.operation_id}`"
                >
                  <OutputTextComponent
                    :label="field.label"
                    :modelValue="field.value"
                  />
                </router-link>
              </div>

              <OutputTextComponent
                v-else
                :label="field.label"
                :modelValue="field.value"
              />
            </div>
            <div
              v-if="
                !allFields.some((f) => {
                  return (
                    (f.label == 'Stu' && f.value == 4) ||
                    (f.label == 'Stu' && f.value == 3)
                  );
                })
              "
            >
              <!-- close -->
              <ButtonComponent
                v-if="
                  allFields.some((f) => {
                    return f.label == 'Stu' && f.value == 0;
                  })
                "
                class="btn color-primary"
                :icon="'fa-solid fa-lock'"
                :loading="ButtonLoad"
                @click="changeHeaderStatus(1)"
              />
              <!-- reopen -->
              <ButtonComponent
                class="btn text-color-v-dark"
                v-if="
                  allFields.some((f) => {
                    return f.label == 'Stu' && f.value == 1;
                  })
                "
                :icon="'fa-solid fa-lock-open'"
                :loading="ButtonLoad"
                @click="changeHeaderStatus(3)"
              />
              <!-- confirm -->
              <ButtonComponent
                v-if="
                  allFields.some((f) => {
                    return f.label == 'Stu' && f.value != 2;
                  })
                "
                class="btn color-primary"
                :icon="'fa-solid fa-check'"
                :loading="ButtonLoad"
                @click="changeHeaderStatus(2)"
              />
            </div>
          </div>
        </tr>
        <!-- ------------------------------- -->
        <tr v-if="statusCounter" class="color-lite">
          <div class="flex justify-center items-center pt-1">
            <div class="grid grid-cols-5 gap-0">
              <div v-for="cfield in statusCounter" :key="cfield.label">
                <OutputTextComponent
                  :label="cfield.label"
                  :modelValue="cfield.value"
                />
              </div>
            </div>
          </div>
        </tr>
        <!-- ------------------------------- -->
        <tr v-if="columns">
          <div class="rounded-border">
            <table :dir="isRtl ? 'rtl' : 'ltr'" v-if="rows">
              <thead class="second-thead">
                <tr>
                  <th
                    v-for="(col, index) in columns"
                    v-show="col"
                    :key="index"
                    class=""
                  >
                    {{ col }}
                  </th>
                </tr>
              </thead>
              <tbody v-for="(row, index) in rows" :key="index" class="">
                <tr v-if="rows.length > 0" class="hover-tr">
                  <td
                    v-for="(value, key, colIndex) in row"
                    v-show="
                      String(key) !== 'additional_data' && String(key) !== 'id'
                    "
                    :key="colIndex"
                    :class="['', alignmentClass]"
                  >
                    <div class="grid grid-col-1 divide">
                        <span
                          v-if="!Array.isArray(value)"
                          v-html="value"
                        ></span>
                        <!-- :class="{'red_badge': key==`total_paid_amount `&&value==0}" -->

                        <span
                          v-else
                          v-for="(val, index) in value"
                          :key="index"
                          class="item-center"
                          v-html="val.text"
                        >
                        </span>
                     
                      <!-- slot for TD -->
                      <slot
                        name="columnAction"
                        :row="row"
                        v-if="String(key) == slotTDcolName"
                      ></slot>
                    </div>
                  </td>

                  <slot name="status" :index="index" :row="row" />
                  <slot name="navagation" :index="index" :row="row" />

                  <slot
                    name="toggle"
                    :row="row"
                    :index="index"
                    :additional_data="row?.additional_data"
                  />
                  <slot name="actions" :index="index" :row="row" />
                </tr>

                <div v-else>NO DATA FOUNDED</div>
              </tbody>
            </table>
            <!-- ------------------------------- -->

            <PaginationComponent 
              :lastPage="paginationObj?.last_page"
              :totalItems="paginationObj?.total"
              :current-page="paginationObj?.current_page"
              @update:page="updatePage($event)"
            ></PaginationComponent>
          </div>
          <!-- ------------------------------- -->
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import ButtonComponent from "../AppLayoutComponents/ButtonComponent.vue";
import OutputTextComponent from "../FormLayoutComponents/OutputTextComponent.vue";
import PaginationComponent from "@/components/Layouts/TablesLayoutComponents/PaginationComponent.vue";
import { useButtonLoad } from "@/composables/useButtonLoad";
import adjustment_api from "@/services/inventory/adjustment_api";
import { useRoute } from "vue-router";
const route = useRoute();
const { ButtonLoad, toggleButtonLoad } = useButtonLoad();

const emits = defineEmits<{
  (event: "getUpdatedData"): void;
  (event: "update:page", pageNumber: number): void;
  (event: "update:search", searchQuery: string): void;
}>();
interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
}
const props = defineProps<{
  columns: Array<any>;
  rows: Array<any>;
  allFields?: Array<any>;
  statusCounter?: Array<any>;
  pageLable?: string;
  formStatus?: number | string;
  isRtl?: boolean;
  paginationObj?: any;
  slotTDcolName?: string;
  operations_type?: any;
}>();
import store from "@/Middelware/store";
const userLocation = ref<any>(store.getters.LocationType);
const updatePage = (e: number) => {
  emits("update:page", e);
};
// Computed properties
const alignmentClass = computed(() =>
  props.isRtl ? "pl-4 text-end" : "pr-4 text-start"
);

const changeHeaderStatus = async (action_number: number) => {
  toggleButtonLoad();
  const payload = {
    form_id: +route.params.form_id,
    operation_id: +route.params.operation_id,
  };

  try {
    action_number === 1
      ? await adjustment_api.closeOperation(payload)
      : action_number === 2
      ? await adjustment_api.confirmOperation(payload, userLocation.value)
      : await adjustment_api.reopenOperation(payload);
    emits("getUpdatedData");
  } catch (er) {
    throw er;
  } finally {
    toggleButtonLoad();
  }
};

onMounted(() => {
  console.log(userLocation.value , 'userLocationuserLocationuserLocationuserLocation')

});
</script>
