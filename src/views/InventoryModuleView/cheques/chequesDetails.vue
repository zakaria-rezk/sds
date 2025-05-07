<template>
  <div class="mx-10">
    <div>
      <div class="flex items-center justify-between">
        <BreadCrumpsComponent :BreadCrumps="breadCrumps" />        
      </div>


    

      <!--  cheque details -->
      <TableSkeletonLoader v-if="loading" />

      <section v-else>
        <TableLayoutComponent
          :pageLable="$t('Cheque Details')"
          :allFields="opHeader"
          :rows="null"
          :columns="null"
        >
        </TableLayoutComponent>
      </section>
    </div>
    <!-- change status  -->
    <div class="flex items-center justify-end w-2/3 my-10" v-if="rows.length<5">
          <div class="lg:col-span-5 md:col-span-6 sm:col-span-12 flex">
            <p class="rounded-span">Date</p>
            <input
              type="date"
              v-model="action_date"
              placeholder="PLACEHOLDER.created_from"
              class="py-2 px-4 min-w-[300px] bg-gray-100 text-black border-2 border-gray-300 py-2 border-2 bg-violet-50 px-2 w-full"
            />
          </div>

          <div class="lg:col-span-5 md:col-span-6 sm:col-span-12 flex mx-5">
            <p class="rounded-span">Status</p>
           <select @change="convertStatus"  v-model="cheque_status" class="py-2 px-4 min-w-[300px] bg-gray-100 text-black border-2 border-gray-300 py-2 border-2 bg-violet-50 px-2 w-full">
            <option selected hidden disabled value=""> choose Status </option>
            <option  v-for="(status, index) in cheques_status" :key="index" :value="status.id"> {{  status.name  }} </option>
           </select>
          </div>
    </div>

    <!-- page divide  -->
    <section class="flex justify-between items-center">
      
      <button
        class="p-3 w-1/2 flex justify-center"
        :class="activeButton === 'history' ? 'indigo_badge' : 'gray_badge'"
        @click="setActive('history')"
      >
        {{ $t("Cheque History") }} ( {{ rows.length }} )
      </button>
      <button
        class="p-3 w-1/2 flex justify-center"
        :class="activeButton === 'Filles' ? 'indigo_badge' : 'gray_badge'"
        @click="setActive('Filles')"
      >
        {{ $t("Uplaod Files") }} ( {{ form_files.length }} )
      </button>
    </section>

    <!-- uploadedFiles  -->
    <section v-if="activeButton == 'Filles'" class="mb-10">
      <pqUploadFiles :form_files="form_files" @upadatePQ="getChequeHistory(),getFormFiles()" />
    </section>
    <section v-if="activeButton === 'history'" class="mb-10">
      <TableLayoutComponent
          :columns="columns"
          :rows="rows"
          :pageLable="$t('Cheque History')"
        >
          <template #status="{ row }">
            <td>
              <div
                class="btn"
                :class="{
                  indigo_badge:
                    row.additional_data === t('New') ||
                    row.additional_data === t('Returned'),
                  yellow_badge:
                    row.additional_data === t('Delivered') ||
                    row.additional_data === t('Rescheduled'),
                  green_badge:
                    row.additional_data === t('WithDrawed') ||
                    row.additional_data === t('Signtured'),
                }"
              >
                {{ row.additional_data }}
              </div>
            </td>
          </template>
          <template #status_after="{ row }">
            <td>
              <div
                class="btn"
                :class="{
                  indigo_badge:
                    row.status_after === t('New') ||
                    row.status_after === t('Returned'),
                  yellow_badge:
                    row.status_after === t('Delivered') ||
                    row.status_after === t('Rescheduled'),
                  green_badge:
                    row.status_after === t('WithDrawed') ||
                    row.status_after === t('Signtured'),
                }"
              >
                {{ row.status_after }}
              </div>
            </td>
          </template>

       
        </TableLayoutComponent>
    </section>

    <div
      class="yellow_badge flex items-center justify-center h-[50px]"
      v-if="form_files.length == 0 && activeButton == 'Filles'"
    >
      {{ $t("No Files Uploaded Yet") }}
    </div>
  </div>
</template>
<script setup lang="ts">
import jsPDF from "jspdf";
import html2canvas from "html2canvas"; // Alternative for complex styling
import pqUploadFiles from "./chequeUploadFiles.vue";

import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
import cheques_api from "@/services/cheques_api";

import { computed, onMounted, ref, watch } from "vue";

import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
const route = useRoute();
const router = useRouter();
import axios from "axios";
import env from "@/env";

//form
import { useModal } from "@/composables/useModal";
import { useButtonLoad } from "@/composables/useButtonLoad";
import { useResetValue } from "@/composables/useResetValue";
import { useSchemaValidation } from "@/composables/useValidationSchema";
import { ToastProps, useToast } from "vue-toast-notification";

const { getValidationSchema } = useSchemaValidation();

const $toast = useToast();
const toastOption: ToastProps = {
  position: "top-right",
  duration: 2000,
  pauseOnHover: true,
};

// end add item

const activeButton = ref("history");
const setActive = (button) => {
  activeButton.value = button;
};

const activeLocationId = ref("");
const operation_id_for_recive = ref("");
const operation_id_for_Bill = ref("");
const operation_id_Receive = ref(4);

const loading = ref<boolean>(true);

//table
import TableSkeletonLoader from "@/components/Layouts/TablesLayoutComponents/TableLoadersComponents/TableSkeletonLoader.vue";
import TableLayoutComponent from "@/components/Layouts/TablesLayoutComponents/TableLayoutComponent.vue";

const rows = ref([]);
const receives_rows = ref([]);
const custody_rows = ref([]);
const opHeader = ref<any>();
const slotTDcolName = "form_quantity";

const cheque_history_response = ref(null);

const status = (status: number, action: boolean) => {
  const isAction = action ? "status." : "";
  return status === 0
    ? t(`${isAction}open`)
    : status === 1
    ? t(`${isAction}close`)
    : status === 2
    ? t(`${isAction}confirm`)
    : "";
};
const { t, messages, locale } = useI18n();
const breadCrumps = ref([
  { text: t("Cheques"), route: "cheques" },
  { text: t("Cheque History"), route: "" },
]);

const columns = [
  t("Created At"),
  t("Action Date"),
  t("Status Before"),
  t("Status After"),
];
const form_files = ref([]);

const getFormFiles = async () => {
  loading.value = true;
  try {
    form_files.value = await cheques_api.getChequeFiles('cheque',+route.params.form_id);    
    //   ----------------------------------------
  } catch (er) {
    throw er;
  } finally {
    loading.value = false;
  }
};

const statusCounter = ref<any>();

const getChequeHistory = async () => {
  loading.value = true;
  try {
    const response = await cheques_api.getChequeHistory(+route.params.form_id);

    cheque_history_response.value = response;
    rows.value = cheque_history_response.value.cheque_history.map((cheque: any) => ({
      id: cheque.id,
      action_date: cheque.action_date,
      created_at: cheque.created_at,

      additional_data:
        cheque.status_before === 0
          ? t("New")
          : cheque.status_before === 1
          ? t("Delivered")
          : cheque.status_before === 2
          ? t("WithDrawed")
          : cheque.status_before === 3
          ? t("Returned")
          : cheque.status_before === 4
          ? t("Rescheduled")
          : cheque.status_before === 5
          ? t("Signtured")
          : t("status.open"),

      status_after:
        cheque.status_after === 0
          ? t("New")
          : cheque.status_after === 1
          ? t("Delivered")
          : cheque.status_after === 2
          ? t("WithDrawed")
          : cheque.status_after === 3
          ? t("Returned")
          : cheque.status_after === 4
          ? t("Rescheduled")
          : cheque.status_after === 5
          ? t("Signtured")
          : t("status.open"),
    }));

    // disabled start quotation untill all items has price and vendors

    //   ----------------------------------------
    opHeader.value = [
      { label: t("Recipient Name"), value: response.recipient_name || "" },
      { label: t("Bank Name"), value: response.bank_name || "" },
      { label: t("Bank Account"), value: response.bank_account || "" },
      { label: t("Cheque Number"), value: response.cheque_number || "" },

      { label: t("Created At"), value: response.created_at },
      { label: t("Maturity Date"), value: response.maturity_date },
      { label: t("Cashing Date"), value: response.cashing_date },
      { label: t("Amount"), value: `${response.amount} EGP` },
      {
        label: t("Status"),
        value:
          response.status === 0
            ? t("New")
            : response.status === 1
            ? t("Delivered")
            : response.status === 2
            ? t("WithDrawed")
            : response.status === 3
            ? t("Returned")
            : response.status === 4
            ? t("Rescheduled")
            : response.status === 5
            ? t("Signtured")
            : t("status.open"),
      },
    ];

    //   ----------------------------------------
  } catch (er) {
    throw er;
  } finally {
    loading.value = false;
  }
};
const action_date = ref('');
const cheque_status = ref('');
const convertButton = ref(true);

// change status 
const convertStatus = async ()=>{
  try{
    await cheques_api.changeChequeStatus(+route.params.form_id, action_date.value, cheque_status.value)
    getChequeHistory() ;
    convertButton.value = true ;
  }catch(err){
    console.error(err)
  }
}
const HasItemData = computed(() => {
  return rows.value.every(
    (row) =>
      row.item_price !== undefined &&
      row.item_price !== null &&
      row.item_price !== ""
  ); // Check for undefined, null, and empty string
});


const cheques_status = ref([
    {
        name : 'New',
        id  : 0
    },
    {
        name : 'Delivered',
        id  : 1
    },
    {
        name : 'WithDrawed',
        id  : 2
    },
    {
        name : 'Returned',
        id  : 3
    },
    {
        name : 'Rescheduled',
        id  : 4
    },
    {
        name : 'Signtured',
        id  : 5
    },
])

onMounted(async () => {
  getChequeHistory();
  getFormFiles();
  activeLocationId.value = localStorage.getItem("location_id");
});
</script>

<style>
.indigo_badge:disabled {
  opacity: 0.4;
  cursor: not-allowed !important;
}

.batches-table th,
.batches-table td {
  width: 12.5%;
}
.batches-table td {
  display: flex;
  justify-content: start;
  align-items: center;
}
</style>
