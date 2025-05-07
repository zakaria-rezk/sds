<template>
  <div class="rounded-border">
    <table id="table">
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
          <div class="grid grid-cols-4 gap-4 p-2">
            <div v-for="field in allFields" :key="field.label">
              <OutputTextComponent
                v-if="field.label != 'Stu'"
                :label="field.label"
                :modelValue="field.value"
              />
            </div>
            <div
              class=""
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
              <!-- <ButtonComponent
               
                class="btn color-primary"
                :title="t('')"
                :icon="'fa-solid fa-lock'"
                :loading="ButtonLoad"
                @click="changeHeaderStatus(1)"
              />
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
              /> -->
              <!-- confirm -->
              <!-- <ButtonComponent
                v-if="
                  allFields.some((f) => {
                    return f.label == 'Stu' && f.value != 3;
                  })
                "
                class="btn color-primary"
                :icon="'fa-solid fa-check'"
                :loading="ButtonLoad"
                @click="changeHeaderStatus(2)"
              /> -->

            </div>

            <button
            v-if="
                allFields.some((f) => {
                  return f.label == 'Stu' && f.value == 3;
                }) && isApprove
              "
            @click="confirmPQ"
            class="btn color-primary h-10 w-[100px] flex justify-center px-3"
          >
            
            <font-awesome-icon :icon="['fas', 'check']" class="mx-3" />
          </button>

          <!-- change status from 4 to 5 -->
          <button

            v-if="
                allFields.some((f) => {
                  return f.label == 'Stu' && f.value == 4;
                }) && isApprove 
              "
            @click="changeStatus"
            class="btn color-primary h-10 w-[100px] flex justify-center px-3 aprove-button"
          >
            
            <font-awesome-icon :icon="['fas', 'check']" class="mx-3" />
          </button>
          </div>
        </tr>
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
                  <th style="display: none;"></th> 
                 
                 
                  <th v-for="(col, index) in columns" v-show="col" :key="index" class="">
                    {{ col }}
                  </th>
                  <th v-if="itemStatus==3"> 
                    <!-- <input
                      type="checkbox"
                      v-model="selectAll"
                      @change="handleSelectAllChange"
                    /> -->
                    <ToggleButtonComponent
                       v-model="selectAll"
                        @change="handleSelectAllChange" 
                        :checked="false"
                :disabled="false"

                    />
                  </th>
                </tr>
              </thead>
              <tbody v-for="(row, index) in rows" :key="index" class="">
                <tr v-if="rows.length > 0" class="hover-tr">
                  <td style="display: none;"></td>
                  
                 
                  <td
                    v-for="(value, key, colIndex) in row"
                    v-show="
                      String(key) !== 'additional_data' &&String(key) !== 'status_after' && String(key) !== 'id' && String(key) !== 'item_id'
                    "
                    :key="colIndex"
                    :class="['', alignmentClass]"
                  >
                    <div class="grid grid-col-1 divide" v-if="String(key) !== 'item_price'&&String(key) !== 'form_quantity'">
                      <span v-if="!Array.isArray(value)">{{ value }}</span>
                      <span
                        v-else
                        v-for="(val, index) in value"
                        :key="index"
                        class="item-center"
                        v-html="val.text"
                      ></span>
                      <!-- slot for TD -->
                      <slot
                        name="columnAction"
                        :row="row"
                        v-if="String(key) == slotTDcolName"
                      ></slot>
                    </div>

                    <div  v-if="String(key) == 'item_price'">
                      <div v-if="value.old!==0&&value.old!==null" class="old_price"> {{ value.old }} </div>
                      <div> {{value.current}} </div>
                    </div>
                    <div  v-if="String(key) == 'form_quantity'">
                      <div v-if="value.old!==0&&value.old!==null" class="old_price"> {{ value.old }} </div>
                      <div> {{value.current}} </div>
                    </div>
                  </td>

                  <slot name="status" :index="index" :row="row" />
                  <slot name="status_after" :index="index" :row="row" />

                  <slot
                    name="toggle"
                    :row="row"
                    :index="index"
                    :additional_data="row?.additional_data"
                  />

                  
                  <slot name="actions" :index="index" :row="row" />
                  <td v-if="itemStatus==3&&row.additional_data!='blocked'" class="divide">
                   
                   <ToggleButtonComponent :checked="newSelectedItems[index]"  v-model="newSelectedItems[index]" @change="handleCheckboxChange($event, index, row)" :disabled="false" />
                 </td>
                </tr>
                <div v-else>NO DATA FOUNDED</div>
              </tbody>
            </table>
            <!-- ------------------------------- -->
            <!-- <PaginationComponent
                :totalItems="totalItems"
                :itemsPerPageOptions="[10, 20, 30, 50]"
              ></PaginationComponent> -->
          </div>

          <!-- ------------------------------- -->
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watchEffect, onMounted } from "vue";
import ButtonComponent from "../AppLayoutComponents/ButtonComponent.vue";
import OutputTextComponent from "../FormLayoutComponents/OutputTextComponent.vue";
import PaginationComponent from "@/components/Layouts/TablesLayoutComponents/PaginationComponent.vue";
import { useI18n } from "vue-i18n";
import { useButtonLoad } from "@/composables/useButtonLoad";
import adjustments_api from "@/services/inventory/adjustment_api";
import ToggleButtonComponent from "@/components/Layouts/AppLayoutComponents/ToggleButtonComponent.vue";

import rfq_api from "@/services/rfq_api";
import { ToastProps, useToast } from "vue-toast-notification";

const $toast = useToast();
const toastOption: ToastProps = {
  position: "top-right",
  duration: 2000,
  pauseOnHover: true,
};
import { useRoute } from "vue-router";
const route = useRoute();
const { ButtonLoad, toggleButtonLoad } = useButtonLoad();
const selectAll = ref(false);
const { t, messages, locale } = useI18n();


const emits = defineEmits<{
  (event: "getUpdatedData"): void;
  (event: "updateTableIds", itemsIDs: any): void;



}>();

const props = defineProps<{
  columns: Array<any>;
  rows: Array<any>;
  allFields?: Array<any>;
  pageLable?: string;
  formStatus?: number | string;
  itemStatus?: number;
  isRtl?: boolean;
  isApprove?: boolean;
  slotTDcolName?: string;
  operations_type?: any;
  vendors : Array<any>;
    statusCounter?: Array<any>;

}>();

const tableHeaderStatus = ref<string>();

// Computed properties
const alignmentClass = computed(() =>
  props.isRtl ? "pl-4 text-end" : "pr-4 text-start"
);
// const totalItems = computed(() => props.rows.length);
// const changeHeaderStatus = async (action_number: number) => {
//   toggleButtonLoad();
//   const payload = {
//     form_id: +route.params.form_id,
//     operation_id: +route.params.operation_id,
//   };

//   try {
//     action_number === 1
//       ? await adjustments_api.closeOperation(payload)
//       : action_number === 2
//       ? await adjustments_api.confirmOperation(payload)
//       : null;
//     emits("getUpdatedData");
//   } catch (er) {
//     throw er;
//   } finally {
//     toggleButtonLoad();
//   }
// };


// convert PQ to Po
const confirmPQ = async () => {
  try {
    try {
      const response = await rfq_api.ConvertPQToPO(+route.params.form_id);
      emits("getUpdatedData");
      $toast.success('RFQ Approved Successfully', toastOption);
    } catch (er) {
      $toast.error(er, toastOption);
    }
  } catch (error) {
    console.log(error)
    $toast.error(error, toastOption);
  } 
};

// convert PQ to Po
const changeStatus = async () => {
  try {
    const payload = {
      status : 5
    }
    try {
      const response = await rfq_api.updatePQDetails(payload, +route.params.form_id);
      emits("getUpdatedData");
      $toast.success('RFQ Approved Successfully', toastOption);
    } catch (er) {
      $toast.error(er, toastOption);
    }
  } catch (error) {
    console.log(error)
    $toast.error(error, toastOption);
  } 
};

//   handle checkAll
const newSelectedItems = ref([]);
const itemsIDs = ref([]);
function handleSelectAllChange(event) {
  const isChecked = event.target.checked;
  if (isChecked) {
    for (const value in props.rows) {
      itemsIDs.value.push(props.rows[value].id);
      newSelectedItems.value.push(true);
     
    }
  } else {
    newSelectedItems.value = [];
    itemsIDs.value = [];
  }
  emits('updateTableIds', itemsIDs.value)
}
// Method to handle changes in individual checkboxes
function handleCheckboxChange(event, key, item) {
  if (event.target.checked) {
    itemsIDs.value.push(item.id);
    // select.value.push(key)
  } else {
    const index = itemsIDs.value.indexOf(item.id);
    if (index > -1) {
      itemsIDs.value.splice(index, 1);
    }

    // newSelectedItems.value.splice(key, 1)
  }
  emits('updateTableIds', itemsIDs.value)

}

</script>
