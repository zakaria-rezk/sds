<template>
    <BreadCrumpsComponent
      :BreadCrumps="breadCrumps"
      @toggleModalEmit="openModal"
    />
    <!-- :btn="$t('rfq_form.form.button')" -->
    <section class="flex justify-between items-center">
      <button class=" p-3 w-1/4  flex justify-center" :class="activeButton === 'New' ? 'indigo_badge' : 'gray_badge'" @click="setActive('New', getConfirmed)">
        {{ $t('New Orders') }}
      </button>
      <button class=" p-3 w-1/4 flex justify-center" :class="activeButton === 'Working' ? 'indigo_badge' : 'gray_badge'" @click="setActive('Working', getWorking)"  >
        {{ $t('Working On It') }}
      </button>
      <button class=" p-3 w-1/4 flex justify-center" :class="activeButton === 'Billed' ? 'indigo_badge' : 'gray_badge'" @click="setActive('Billed', getBilled)"  >
        {{ $t('Billed') }}
      </button>
      <button class=" p-3 w-1/4 flex justify-center" :class="activeButton === 'all' ? 'indigo_badge' : 'gray_badge'" @click="setActive('all', clear)"  >{{ $t('Show All') }}</button>
    </section>

    <TableSkeletonLoader v-if="loading" />
  <div v-else>
    <TableLayoutComponent :columns="columns" :rows="rows" :pageLable="$t('rfq_form.title')">
     
      <template #actions="{ row }"
        ><td>
          <router-link
          class="btn color-primary"
            :to="{
              name: 'PQ-details',
              params: { form_id: row.id, operation_id: +route.params.operation_id },
            }"
            >
            <font-awesome-icon :icon="['fas', 'list']" /> 
          </router-link>
        </td></template
      >
    </TableLayoutComponent>
  </div>









    <ModalComponent :showModal="isModalOpen"
    ><FormPopUpLayoutComponent @closeModal="toggleModal">
      <div
        
       
        class="flex flex-col"
        v-if="displayForm"
      >
        <div class="input flex flex-col w-full py-2 mt-1">
          <InputLableLayoutComponent
            lableFor="name"
            :text="$t('rfq_form.form.category_name')"
          />
          <input
            type="text"
            id="name"
            class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
            :placeholder="$t('rfq_form.form.category_name')"
            v-model="formData.category_name"
            required
          />
          <p v-if="errors.category_name" class="pt-2 text-xs text-red-500">
            {{ errors.category_name }}
          </p>
        </div>
        <div class="input flex flex-col w-full py-2 mt-1">
          <InputLableLayoutComponent
            lableFor="name"
            :text="$t('rfq_form.form.doc_number')"
          />
          <input
            type="text"
            id="name"
            class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
            :placeholder="$t('rfq_form.form.doc_number')"
            v-model="formData.doc_number"
          />
          <!-- <p v-if="errors.category_name" class="pt-2 text-xs text-red-500">
            {{ errors.category_name }}
          </p> -->
        </div>
        <div class="input flex flex-col w-full py-2 mt-1">
          <InputLableLayoutComponent
            lableFor="name"
            :text="$t('rfq_form.form.work_order_line_num')"
          />
          <input
            type="text"
            id="name"
            class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
            :placeholder="$t('rfq_form.form.work_order_line_num')"
            v-model="formData.work_order_line_num"

          />
          <!-- <p v-if="errors.category_name" class="pt-2 text-xs text-red-500">
            {{ errors.category_name }}
          </p> -->
        </div>


        <div class="input flex flex-col w-full py-2 mt-1">
          <InputLableLayoutComponent
            lableFor="name"
            :text="$t('rfq_form.form.location_to')"
          />
          <!-- <SelectToLayoutComponent
            :keys="dropDownKeys"
            :data="filterDropDownData"
            @filter="filter"
          /> -->

          <select
              id="operation-type"
              class="py-2 rounded-md border-2 bg-gray-100 text-gray-500 px-2"
              v-model="formData.location_to"
            >
              <option disabled selected value="">
                {{ $t("locations.form.I3.placeholder") }}
              </option>
              <option :value="item.id" v-for="(item, index) in filterDropDownData" :key="index">
                {{ item.location_name }}
              </option>
          </select>


          <!-- <p v-if="errors.category_name" class="pt-2 text-xs text-red-500">
            {{ errors.category_name }}
          </p> -->
        </div>




        <div class="input flex flex-col w-full py-2 mt-1">
          <InputLableLayoutComponent
            lableFor="date"
            :text="$t('rfq_form.form.form_datetime')"
          />
          <input
            type="date"
            id="date"
            name="date"
            v-model="formData.form_datetime"

            class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <!-- <p v-if="errors.form_datetime" class="pt-2 text-xs text-red-500">
            {{ errors.form_datetime }}
          </p> -->
        </div>


        
        <ButtonComponent
          :loading="ButtonLoad"
          :title="$t('rfq_form.form.button')"
          @click="submitForm"
          class="form_btn"
        />
      </div>
      <SuccessModalComponent
        v-else
        @closeModal="
          toggleModal();
          displayForm = true;
        "
        :text="$t('rfq_form.form.success')"
      ></SuccessModalComponent>
    </FormPopUpLayoutComponent>
  </ModalComponent>

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
import TableSkeletonLoader from "@/components/Layouts/TablesLayoutComponents/TableLoadersComponents/TableSkeletonLoader.vue";

  import rfq_api from "@/services/rfq_api";
  const { t, messages, locale } = useI18n();

import { useRoute } from "vue-router";
const route = useRoute();
  const loading = ref<boolean>(true);
  const breadCrumps = ref([
  { text: t('PQs'), route: "" },
]);

const errors = ref<any>({});
const formData = ref<any>({
  category_name: "",
  form_datetime: "",
  doc_number: "",
  work_order_line_num: "",
  location_to : ''
});


const dropDownKeys = ref<any>();
const filterDropDownData = ref<any>();


const getDropDownFilterData = async () => {
  filterDropDownData.value = await rfq_api.getDropDownFilterData();
  // loading.value = false;

  dropDownKeys.value = Object.keys(filterDropDownData.value);
};


const { isModalOpen, openModal, closeModal, toggleModal } = useModal();
const displayForm = ref<boolean>(true);


const { ButtonLoad, toggleButtonLoad } = useButtonLoad();
const { reset } = useResetValue();
const { getValidationSchema } = useSchemaValidation();



const submitForm = async () => {
  const schema = getValidationSchema(formData.value, "rfq_form");
  try {
    toggleButtonLoad();
    await schema.validate(formData.value, { abortEarly: false });
    await addRFQ(formData.value);
    reset(formData.value);
    displayForm.value = false;
  } catch (error) {
    if (error.inner) {
      error.inner.forEach((validationError: any) => {
        errors.value[validationError.path] = validationError.message;
      });
    }
  } finally {
    toggleButtonLoad();
  }
};

const addRFQ = async (payload) => {
  payload.operation_id = 7;

  
  // loading.value = false;
  try {
    await rfq_api.addRfq(payload);
    // getadjustments();
  } catch (er) {
    throw er;
  }
};



const rows = ref([]);
const RFQS = ref<any>([]);

const columns = [
  t("adjustment_form.table.form_lable"),
 t('Location From'),
  t("adjustment_form.table.form_date_time"),
  t("rfq_form.form.work_order_line_num"),
  t("rfq_form.form.doc_number"),
  t("rfq_form.form.created_at"),
  t("adjustment_form.table.created_by"),
  t('Quoted By'),
  t("adjustment_form.table.actions"),
];
import store from "@/Middelware/store";
const originalRows = []; // Store the original rows from the backend
const getRFQs = async () => {
  loading.value = true;
  const pyaload = {
    to_location : store.getters["location_module/LocationId"]
  }
  try {
    const response = await rfq_api.getPQs(pyaload);
    RFQS.value = response;
    
    rows.value = RFQS.value.map((rfq: any) => ({
      id: rfq.id,
      form_lable: rfq.form_label,
      from_location: rfq.from_location?.location_name,
      form_datetime: rfq.form_datetime,
      work_order_line_num: rfq.work_order_line_num,
      doc_number: rfq.doc_number,
      created_at: rfq.created_at,
      created_by: rfq.user?.name,
      quoted_by : rfq.quoted_by?.name,
      additional_data:
        rfq.status === 2
          ? "New"
          : rfq.status === 3
          ? "Working"
          : rfq.status === 4
          ? "Billed"
          : "",
    }));
    originalRows.push(...rows.value); // Store the initial rows in originalRows
  } catch (er) {
    throw er;
  } finally {
    loading.value = false;
  }
};

const activeButton = ref('all')
const setActive = (button , action)=>{
  activeButton.value = button 
  action();
}
const getWorking = () => {
  rows.value = originalRows.filter(el => el.additional_data === "Working" );
};

const getConfirmed = () => {
  rows.value = originalRows.filter(el => el.additional_data === "New");
};

const getBilled = () => {
  rows.value = originalRows.filter(el => el.additional_data === "Billed");
};
const clear = () => {
  rows.value = originalRows ;
};


onMounted(async () => {
  getDropDownFilterData();
  getRFQs();
});

  </script>
  