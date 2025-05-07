<template>
    <BreadCrumpsComponent
      :BreadCrumps="breadCrumps"
      :btn="$t('rfq_form.form.button')"
      @toggleModalEmit="openModal"
    />
    <!-- :disabled="ActiveBtn" -->

    <section class="flex justify-between items-center">
      <button
      class="p-3 w-1/4 flex justify-center"
      :class="activeButton === 'working' ? 'indigo_badge' : 'gray_badge'"
      @click="setActive('working', getWorking)"
    >
      {{ $t('Working On It') }}
    </button>
    <button
      class="p-3 w-1/4 flex justify-center"
      :class="activeButton === 'confirmed' ? 'indigo_badge' : 'gray_badge'"
      @click="setActive('confirmed', getConfirmed)"
    >
      {{ $t('Send To PQ') }}
    </button>
    <button
      class="p-3 w-1/4 flex justify-center"
      :class="activeButton === 'billed' ? 'indigo_badge' : 'gray_badge'"
      @click="setActive('billed', getBilled)"
    >
      {{ $t('Received From PQ') }}
    </button>
    <button
      class="p-3 w-1/4 flex justify-center"
      :class="activeButton === 'all' ? 'indigo_badge' : 'gray_badge'"
      @click="setActive('all', clear)"
    >
      {{ $t('Show All') }}
    </button>

  </section>
    <TableSkeletonLoader v-if="loading" />
  <div v-else>
    <TableLayoutComponent :columns="columns" :rows="rows" :pageLable="$t('rfq_form.title')">
      <template #status="{ row }">
        <td>
          
          <div
            class="btn"
            :class="{
              indigo_badge: row.additional_data === $t('status.confirm')||row.additional_data === $t('status.Waiting For Receive'),
                yellow_badge: row.additional_data === $t('status.close'),
                green_badge: row.additional_data === $t('status.open'),
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
              name: 'RFQ-details',
              params: { form_id: row.id, operation_id: +route.params.operation_id },
            }"
            >
            <font-awesome-icon :icon="['fas', 'list']" /> 
          </router-link>

          <button class="btn color-primary" v-if="row.additional_data !==  $t('status.confirm') &&row.additional_data !== $t('status.Waiting For Receive')" @click="openEditRfq(row)">
            <font-awesome-icon :icon="['fas', 'edit']" /> 
          </button>
        </td></template
      >
    </TableLayoutComponent>
  </div>

  <!-- add form  -->

    <ModalComponent :showModal="isModalOpen"
    >
    <FormPopUpLayoutComponent @closeModal="toggleModal" :title="$t('rfq_form.add_new')">
      <!-- <h5 class="font-bold">  </h5> -->

      <div
        
       
        class="flex flex-col"
        v-if="displayForm"
      >

      <div class="input flex flex-col w-full py-2 mt-1">
          <InputLableLayoutComponent
            lableFor="name"
            :text="$t('rfq_form.form.location_to')"
            :required="true"

          />
          <!-- <SelectToLayoutComponent
            :keys="dropDownKeys"
            :data="filterDropDownData"
            @filter="filter"
          /> -->
          <select
              id="operation-type"
              class="py-2 rounded-md border-2 bg-gray-100 text-gray-500 px-2"
              v-model="formData.to_location"
            >
              <option disabled selected value="">
                {{ $t("locations.form.I3.placeholder") }}
              </option>
              <option :value="item.id" v-for="(item, index) in filterDropDownData" :key="index">
                {{ item.location_name }}
              </option>
          </select>


          <p v-if="errors.to_location" class="pt-2 text-xs text-red-500">
            {{ errors.to_location }}
          </p>
        </div>




        <div class="input flex flex-col w-full py-2 mt-1">
          <InputLableLayoutComponent
            lableFor="date"
            :text="$t('rfq_form.form.form_datetime')"
            :required="true"
          />
          <input
            type="date"
            id="date"
            name="date"
            v-model="formData.form_datetime"

            class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p v-if="errors.form_datetime" class="pt-2 text-xs text-red-500">
            {{ errors.form_datetime }}
          </p>
        </div>


        <!-- <div class="input flex flex-col w-full py-2 mt-1">
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
            
          />
         
        </div> -->

        <div class="input flex flex-col w-full py-2 mt-1">
          <InputLableLayoutComponent
            lableFor="categories"
            :text="$t('rfq_form.form.category_name')"
            :required="false"

          />
        
          <select
              id="operation-type"
              class="py-2 rounded-md border-2 bg-gray-100 text-gray-500 px-2"
              v-model="formData.category_name"
            >
              <option disabled selected value="">
                {{ $t("rfq_form.form.category_name") }}
              </option>
              <option :value="item.cat_name" v-for="(item, index) in categories" :key="index">
                {{ item.cat_name }}
              </option>
          </select>


         
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

    <!-- edit form  -->
  <ModalComponent :showModal="editItemOpen">
    <FormPopUpLayoutComponent @closeModal="closeEditModal" :title="$t('rfq_form.edit_new')">
      <!-- <h5 class="font-bold"> Edit RFQ </h5> -->
      <div
        
       
        class="flex flex-col"
      >


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
              v-model="formData.to_location"
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

        
      <InputLableLayoutComponent
            lableFor="name"
            :text="$t('rfq_form.form.category_name')"
          />
          <select
              id="operation-type"
              class="py-2 rounded-md border-2 bg-gray-100 text-gray-500 px-2"
              v-model="formData.category_name"
            >
              <option disabled selected value="">
                {{ $t("rfq_form.form.category_name") }}
              </option>
              <option :value="item.cat_name" v-for="(item, index) in categories" :key="index">
                {{ item.cat_name }}
              </option>
          </select>

       
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


      


        
        <ButtonComponent
          :loading="ButtonLoad"
          :title="$t('rfq_form.form.Edit')"
          @click="EditRfq"
          class="form_btn"
        />
      </div>
      
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
import store from "@/Middelware/store";

  import rfq_api from "@/services/rfq_api";
  import { useRoute } from "vue-router";
  const route = useRoute();
  const { t, messages, locale } = useI18n();

  const row_id = ref(null) ;
  // edit rfq operation 
  const editItemOpen = ref<boolean>(false);
  const openEditRfq = (row)=>{
    editItemOpen.value=true ;
    row_id.value = row.id
    formData.value.doc_number = row.doc_number ;
    formData.value.category_name = row.category_name ;
    formData.value.work_order_line_num = row.work_order_line_num ;
    formData.value.form_datetime = row.form_datetime ;

    for(let i = 0 ; i < filterDropDownData.value.length ; i++){
      if(filterDropDownData.value[i].location_name == row.location_name ){
        formData.value.to_location = filterDropDownData.value[i].id ;
      }
    }
    
    
  }



  const loading = ref<boolean>(true);
  const breadCrumps = ref([
    { text: t('rfq_form.title'), route: "" },
  ]);
const closeEditModal = ()=>{
  editItemOpen.value=false
   reset(formData.value);
}
const errors = ref<any>({});
const formData = ref<any>({
  category_name: "",
  form_datetime: new Date().toISOString().substr(0,10),
  doc_number: "",
  work_order_line_num: "",
  to_location : null
});
const validatedForm = ref<any>({
  form_datetime: formData.value.form_datetime,
  to_location : formData.value.to_location
});
const dropDownKeys = ref<any>();
const filterDropDownData = ref<any>();
const categories = ref<any>();


const getLocationData = async () => {
  filterDropDownData.value = await rfq_api.getLocationData();
  dropDownKeys.value = Object.keys(filterDropDownData.value);
};

const getCategories = async ()=>{
  const response = await rfq_api.getCategoies() ;
  categories.value = response
}

const { isModalOpen, openModal, closeModal, toggleModal } = useModal();
const displayForm = ref<boolean>(true);


const { ButtonLoad, toggleButtonLoad } = useButtonLoad();
const { reset } = useResetValue();
const { getValidationSchema } = useSchemaValidation();


// add new rfq 
const submitForm = async () => {
  const schema = getValidationSchema(validatedForm.value, "create_item");
  try {
    toggleButtonLoad();
    await schema.validate(formData.value, { abortEarly: false });
    await addRFQ(formData.value);
    reset(formData.value);
    displayForm.value = false;
    getRFQs();
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

// EDit Rfq 

const EditRfq = async ()=>{
try {
    toggleButtonLoad();
    await EditRFQ(formData.value);
    reset(formData.value);
    displayForm.value = false;
    getRFQs();
  } catch (error) {
    if (error.inner) {
      error.inner.forEach((validationError: any) => {
        errors.value[validationError.path] = validationError.message;
      });
    }
  } finally {
    toggleButtonLoad();
    editItemOpen.value = false ;
    closeModal()
    
  }
}
const addRFQ = async (payload) => {
  payload.operation_id = +route.params.operation_id;
  try {
    await rfq_api.addRfq(payload);
    // getadjustments();
  } catch (er) {
    throw er;
  }
};
const EditRFQ = async (payload) => {
  payload.operation_id = +route.params.operation_id;
  try {
    await rfq_api.EditRFQ(payload, row_id.value);
    // getadjustments();
  } catch (er) {
    throw er;
  }
};



const rows = ref([]);
const RFQS = ref<any>([]);

const columns = [
  t("adjustment_form.table.form_lable"),
  t("rfq_form.form.location_to"),
  // t("rfq_form.form.location_type"),
  t("adjustment_form.table.category_name"),
  t("adjustment_form.table.form_date_time"),
  t("rfq_form.form.work_order_line_num"),
  t("rfq_form.form.doc_number"),
  t("adjustment_form.table.created_by"),
  t("adjustment_form.table.created_at"),
  t("adjustment_form.table.confirmed_at"),
  t("adjustment_form.table.approved_at"),
  t("adjustment_form.table.status"),
  t("adjustment_form.table.actions"),
];

const originalRows = []; // Store the original rows from the backend
const getRFQs = async () => {
  loading.value = true;

  try {
    const payload = {
      status : [0,1,2],
      from_location : store.getters["location_module/LocationId"]
    }
    const response = await rfq_api.getRFQs(payload);
    RFQS.value = response;
          rows.value = RFQS.value.map((rfq: any) => ({
      id: rfq.id,
      form_lable: rfq.form_label,
      location_name: rfq.to_location?.location_name ,
      // location_type: rfq.to_location?.location_type,
      category_name: rfq.category_name,
      form_datetime: rfq.form_datetime,
      work_order_line_num: rfq.work_order_line_num,
      doc_number: rfq.doc_number,
      created_by: rfq.user.name,  
      created_at: rfq.created_at?.slice(0,10),  
      confirmed_at: rfq.confirmed_at?.slice(0,10),  
      approved_at: rfq.approved_at,  
      additional_data:
        rfq.status === 0
          ? t('status.open')
          : rfq.status === 1
          ? t('status.close')
          : rfq.status === 2
          ? t('status.confirm')
          : rfq.status === 3 ?
          t('status.confirm') :
          rfq.status === 4 ?
          t('status.Waiting For Receive'):
          "",

    }));
    originalRows.push(...rows.value); // Store the initial rows in originalRows
  } catch (er) {
    throw er;
  } finally {
    loading.value = false;
  }
};

const activeButton = ref('all') ;
const setActive = (button , action)=>{
  activeButton.value = button 
  action();
}
const getWorking = () => {
  rows.value = originalRows.filter(el => el.additional_data ===  t('status.open') || el.additional_data === t('status.close'));
};

const getConfirmed = () => {
  rows.value = originalRows
    .filter(el => el.additional_data === t('status.confirm'))
    .sort((a, b) => {
      const dateA = new Date(a.confirmed_at?.replace(" ", "T")).getTime();
      const dateB = new Date(b.confirmed_at?.replace(" ", "T")).getTime();
      return dateB - dateA;
    });
};


const getBilled = () => {
  rows.value = originalRows
    .filter(el => el.additional_data === t('status.Waiting For Receive'))
    .sort((a, b) => {
      const dateA = a.approved_at ? new Date(a.approved_at.replace(" ", "T")).getTime() : 0;
      const dateB = b.approved_at ? new Date(b.approved_at.replace(" ", "T")).getTime() : 0;
      return dateB - dateA;
    });
};


const clear = () => {
  rows.value = originalRows ;
};

onMounted(async () => {
  getLocationData();
  getRFQs();
  getCategories();
});

  </script>
  