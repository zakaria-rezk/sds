<template>
    <BreadCrumpsComponent
      :BreadCrumps="breadCrumps"
      
      @toggleModalEmit="openModal"
    />
          <!-- :disabled="ActiveBtn" -->

    <!-- :btn="$t('rfq_form.form.button')" -->
    <!-- <section class="flex justify-between items-center">
      <button class="indigo_badge p-3 w-1/3  flex justify-center" @click="getWorking()">
        Working On It
      </button>
      <button class="indigo_badge p-3 w-1/3 flex justify-center"  @click="getConfirmed()">
        Send To PQ
      </button>
      <button class="indigo_badge p-3 w-1/3 flex justify-center"  @click="getBilled()">
        Received From PQ
      </button>
      <button class="btn color-primary" @click="clear()">clear</button>
    </section> -->
    <TableSkeletonLoader v-if="loading" />
  <div v-else>
    <TableLayoutComponent :columns="columns" :rows="rows" pageLable="Received Orders">
      <template #status="{ row }">
        <td>
          
          <div
            class="btn"
            :class="{
              indigo_badge: row.additional_data === 'Confirmed'||row.additional_data === 'Received',
                yellow_badge: row.additional_data === 'Closed',
                green_badge: row.additional_data === 'Open',
            }"
          >
            {{ row.additional_data }}
          </div>
        </td>
      </template>
      <template #actions="{ row }"
        ><td>
          <router-link
          class="btn color-primary"
            :to="{
              name: 'Receive-Operation-Details',
              params: { form_id: row.id, operation_id: +route.params.operation_id },
            }"
            >
            <font-awesome-icon :icon="['fas', 'list']" /> 
          </router-link>

          <!-- <button class="btn color-primary" v-if="row.additional_data !== 'Confirmed'&&row.additional_data !== 'Received'" @click="openEditRfq(row)">
            <font-awesome-icon :icon="['fas', 'edit']" /> 
          </button> -->
        </td></template
      >
    </TableLayoutComponent>
  </div>









  </template>
  <script setup lang="ts">
  // components imports
  import { computed, onMounted, ref } from "vue";
  import { useModal } from "@/composables/useModal";
  import { useButtonLoad } from "@/composables/useButtonLoad";
  import { useResetValue } from "@/composables/useResetValue";
  import { useSchemaValidation } from "@/composables/useValidationSchema";
  import { useI18n } from "vue-i18n";

  import ModalComponent from "@/components/Layouts/AppLayoutComponents/ModalComponent.vue";
  import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
  import FormPopUpLayoutComponent from "@/components/Layouts/PopUpLayoutComponent/FormPopUpLayoutComponent.vue";
  import SuccessModalComponent from "@/components/Layouts/AppLayoutComponents/SuccessModalComponent.vue";
  import ButtonComponent from "@/components/Layouts/AppLayoutComponents/ButtonComponent.vue";
  import InputLableLayoutComponent from "@/components/Layouts/InputsFromLayoutCompoennts/InputLableLayoutComponent.vue";
  import SelectToLayoutComponent from "@/components/Layouts/FormLayoutComponents/SelectToLayoutComponent.vue";
import TableLayoutComponent from "@/components/Layouts/TablesLayoutComponents/TableLayoutComponent.vue";
  import rfq_api from "@/services/rfq_api";
  import { useRoute } from "vue-router";
  const route = useRoute();

  const row_id = ref(null) ;
  // edit rfq operation 
  const editItemOpen = ref<boolean>(false);
  const openEditRfq = (row)=>{
    editItemOpen.value=true ;
    row_id.value = row.id
    formData.value.doc_number = row.doc_number ;
    formData.value.work_order_line_num = row.work_order_line_num ;
    formData.value.form_datetime = row.form_datetime ;
    // 

    for(let i = 0 ; i < filterDropDownData.value.length ; i++){
      // 
      if(filterDropDownData.value[i].location_type == row.location_name ){
        formData.value.to_location = filterDropDownData.value[i].id ;
      }
    }
    
  }



  const loading = ref<boolean>(true);
  const breadCrumps = ref([
  { text: 'Received Orders', route: "" },
]);

const errors = ref<any>({});
const formData = ref<any>({
  category_name: "",
  form_datetime: "",
  doc_number: "",
  work_order_line_num: "",
  to_location : null
});


const dropDownKeys = ref<any>();
const filterDropDownData = ref<any>();


const getLocationData = async () => {
  filterDropDownData.value = await rfq_api.getLocationData();
  // loading.value = false;

  dropDownKeys.value = Object.keys(filterDropDownData.value);
};


const { isModalOpen, openModal, closeModal, toggleModal } = useModal();
const displayForm = ref<boolean>(true);


const { ButtonLoad, toggleButtonLoad } = useButtonLoad();
const { reset } = useResetValue();
const { getValidationSchema } = useSchemaValidation();


// add new rfq 
// const submitForm = async () => {
//   const schema = getValidationSchema(formData.value, "rfq_form");
//   try {
//     toggleButtonLoad();
//     await schema.validate(formData.value, { abortEarly: false });
//     await addRFQ(formData.value);
//     reset(formData.value);
//     displayForm.value = false;
//   } catch (error) {
//     if (error.inner) {
//       error.inner.forEach((validationError: any) => {
//         errors.value[validationError.path] = validationError.message;
//       });
//     }
//   } finally {
//     toggleButtonLoad();
//     setTimeout(() => {
//       getReceivedOrders();
//     }, 1000);
//   }
// };

// EDit Rfq 

// const EditRfq = async ()=>{
// try {
//     toggleButtonLoad();
//     await EditRFQ(formData.value);
//     reset(formData.value);
//     displayForm.value = false;
//   } catch (error) {
//     if (error.inner) {
//       error.inner.forEach((validationError: any) => {
//         errors.value[validationError.path] = validationError.message;
//       });
//     }
//   } finally {
//     toggleButtonLoad();
//     editItemOpen.value = false ;
//     closeModal()
//     setTimeout(() => {
//       getReceivedOrders();
//     }, 1000);
//   }
// }
// const addRFQ = async (payload) => {
//   payload.operation_id = +route.params.operation_id;
//   try {
//     await rfq_api.addRfq(payload);
//     // getadjustments();
//   } catch (er) {
//     throw er;
//   }
// };
// const EditRFQ = async (payload) => {
//   payload.operation_id = +route.params.operation_id;
//   try {
//     await rfq_api.EditRFQ(payload, row_id.value);
//     // getadjustments();
//   } catch (er) {
//     throw er;
//   }
// };


const { t, messages, locale } = useI18n();

const rows = ref([]);
const Orders = ref<any>([]);

const columns = [
  t("adjustment_form.table.form_lable"),
  t("From Location"),
  t("adjustment_form.table.form_date_time"),
  t("rfq_form.form.work_order_line_num"),
  t("rfq_form.form.doc_number"),
  t("adjustment_form.table.created_by"),
  t("Confirmed By"),
  t("adjustment_form.table.status"),
  t("adjustment_form.table.actions"),
];
const originalRows = []; // Store the original rows from the backend
const getReceivedOrders = async () => {
  loading.value = true;

  try {
    const payload = {
      status : [0,1,2]
    }
    const response = await rfq_api.getReceivedOrders();
    Orders.value = response;
      rows.value = Orders.value.map((rfq: any) => ({
      id: rfq.id,
      form_lable: rfq.form_label,
      location_name: rfq.from_location?.location_name,
      form_datetime: rfq.form_datetime,
      work_order_line_num: rfq.work_order_line_num,
      doc_number: rfq.doc_number,
      created_by: rfq.user.name,  
      confirmed_by: rfq.confirmed_by?.name||"",  
      additional_data:
        rfq.status === 0
          ? "Open"
          : rfq.status === 1
          ? "Closed"
          : rfq.status === 2
          ? "Confirmed"
          : rfq.status === 3 ?
          "Confirmed":
          rfq.status === 4 ?
          "Received":
          "",

    }));
    originalRows.push(...rows.value); // Store the initial rows in originalRows
  } catch (er) {
    throw er;
  } finally {
    loading.value = false;
  }
};


const getWorking = () => {
  rows.value = originalRows.filter(el => el.additional_data === "Open" || el.additional_data === "Closed");
};

const getConfirmed = () => {
  rows.value = originalRows.filter(el => el.additional_data === "Confirmed");
};

const getBilled = () => {
  rows.value = originalRows.filter(el => el.additional_data === "Received");
};
const clear = () => {
  rows.value = originalRows ;
};

onMounted(async () => {
  getLocationData();
  getReceivedOrders();
});

  </script>
  