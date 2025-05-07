<template>
  <section class="mx-12">
    <BreadCrumpsComponent
      :BreadCrumps="breadCrumps"
      btn="Add New Supplier"
      @toggleModalEmit="openModal"
    />  

    <!-- :disabled="ActiveBtn" -->
    <SearchLayoutComponent
        @update:search="getsuppliers($event)"
        :Schema="schema"
      />
      

    <TableSkeletonLoader v-if="loading" />
    <div v-else>
      <TableLayoutComponent :columns="columns" :rows="rows" pageLable="Suppliers">
        <template #actions="{ row }"
          ><td>
            <router-link
            class="btn color-primary"
              :to="{
                name: 'Vendors-Details',
                params: { form_id: row.id , operation_id : 7},
              }"
              >
              <font-awesome-icon :icon="['fas', 'list']" /> 
            </router-link>

            <button class="btn color-primary" v-if="row.additional_data !== 'Confirmed'" @click="openEditRfq(row)">
              <font-awesome-icon :icon="['fas', 'edit']" /> 
            </button>
          </td></template
        >
      </TableLayoutComponent>
    </div>


  </section>


  <!-- add supplier  -->

    <ModalComponent :showModal="isModalOpen"
    >
    <FormPopUpLayoutComponent @closeModal="toggleModal" title="Add New supplier">
      <div
        
       
        class="flex flex-col"
        v-if="displayForm"
      >
        <div class="input flex flex-col w-full py-2 mt-1">
          <InputLableLayoutComponent
            lableFor="name"
            text="supplier Name"
          />
          <input
            type="text"
            id="name"
            class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
            placeholder="please enter supplier name"
            v-model="formData.name"
            required
          />
          <p v-if="errors.category_name" class="pt-2 text-xs text-red-500">
            {{ errors.category_name }}
          </p>
        </div>
        <div class="input flex flex-col w-full py-2 mt-1">
          <InputLableLayoutComponent
            lableFor="name"
            text="Tax Card"
          />
          <input
            type="text"
            id="name"
            class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
            placeholder="Please enter Tax Card"
            v-model="formData.tax_card"
          />
          <!-- <p v-if="errors.category_name" class="pt-2 text-xs text-red-500">
            {{ errors.category_name }}
          </p> -->
        </div>
        <div class="input flex flex-col w-full py-2 mt-1">
          <InputLableLayoutComponent
            lableFor="name"
            text="Commercial Record"
          />
          <input
            type="text"
            id="name"
            class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
            placeholder="Please enter commercial record"
            v-model="formData.commercial_record"

          />
          <!-- <p v-if="errors.category_name" class="pt-2 text-xs text-red-500">
            {{ errors.category_name }}
          </p> -->
        </div>


        <div class="input flex flex-col w-full py-2 mt-1">
          <InputLableLayoutComponent
            lableFor="name"
            text="Bank Account"
          />
         
          <input
            type="text"
            id="name"
            class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
            placeholder="Please enter Bank Account"
            v-model="formData.bank_account"

          />

          <!-- <p v-if="errors.category_name" class="pt-2 text-xs text-red-500">
            {{ errors.category_name }}
          </p> -->
        </div>

        
        <ButtonComponent
          class="form_btn"
          :loading="ButtonLoad"
          title="Add supplier"
          @click="submitForm"
        />
      </div>
      <SuccessModalComponent
        v-else
        @closeModal="
          toggleModal();
          displayForm = true;
        "
        text="Supplier Added Successfully"
      ></SuccessModalComponent>
    </FormPopUpLayoutComponent>
  </ModalComponent>

    <!-- edit supplier  -->
  <ModalComponent :showModal="editItemOpen">
    <FormPopUpLayoutComponent @closeModal="editItemOpen=false">
      <div
        
       
        class="flex flex-col"
      >
        <div class="input flex flex-col w-full py-2 mt-1">
          <InputLableLayoutComponent
            lableFor="name"
            text="supplier Name"
          />
          <input
            type="text"
            id="name"
            class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
            placeholder="please enter supplier name"
            v-model="formData.name"
            required
          />
          <p v-if="errors.category_name" class="pt-2 text-xs text-red-500">
            {{ errors.category_name }}
          </p>
        </div>
        <div class="input flex flex-col w-full py-2 mt-1">
          <InputLableLayoutComponent
            lableFor="name"
            text="Tax Card"
          />
          <input
            type="text"
            id="name"
            class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
            placeholder="Please enter Tax Card"
            v-model="formData.tax_card"
          />
          <!-- <p v-if="errors.category_name" class="pt-2 text-xs text-red-500">
            {{ errors.category_name }}
          </p> -->
        </div>
        <div class="input flex flex-col w-full py-2 mt-1">
          <InputLableLayoutComponent
            lableFor="name"
            text="Commercial Record"
          />
          <input
            type="text"
            id="name"
            class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
            placeholder="Please enter commercial record"
            v-model="formData.commercial_record"

          />
          <!-- <p v-if="errors.category_name" class="pt-2 text-xs text-red-500">
            {{ errors.category_name }}
          </p> -->
        </div>


        <div class="input flex flex-col w-full py-2 mt-1">
          <InputLableLayoutComponent
            lableFor="name"
            text="Bank Account"
          />
         
          <input
            type="text"
            id="name"
            class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
            placeholder="Please enter Bank Account"
            v-model="formData.bank_account"

          />

          <!-- <p v-if="errors.category_name" class="pt-2 text-xs text-red-500">
            {{ errors.category_name }}
          </p> -->
        </div>
        <ButtonComponent
          :loading="ButtonLoad"
          title="Edi supplier"
          @click="editSupplier"
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
import SearchLayoutComponent from "@/components/Layouts/FormLayoutComponents/SearchLayoutComponent.vue";
import TableLayoutComponent from "@/components/Layouts/TablesLayoutComponents/TableLayoutComponent.vue";
import vendor_api from "@/services/vendor_api";
import GenericSelectInputLayoutComponent from "@/components/Layouts/FormLayoutComponents/GenericSelectInputLayoutComponent.vue";
import GenericInputLayoutComponent from "@/components/Layouts/FormLayoutComponents/GenericInputLayoutComponent.vue";
import rfq_api from "@/services/rfq_api";

//search
import {
  CreateInputField,
  CreateSelectField,
} from "@/utils/create_input_field";

const schema = computed(() => [
  CreateInputField({
    label: "search_by_name",
    model: "name",
    component: GenericInputLayoutComponent,
    animation: "animate-fade-in-up",
    props: {
      type: "text",
      appearance: "secondary",
      variant: "outline",
      size: "full",
    },
  }),
  CreateInputField({
    label: "tax_card",
    model: "tax_card",
    component: GenericInputLayoutComponent,
    animation: "animate-fade-in-up",
    props: {
      type: "text",
      appearance: "secondary",
      variant: "outline",
      size: "full",
    },
  }),
  CreateInputField({
    label: "commercial_record",
    model: "commercial_record",
    component: GenericInputLayoutComponent,
    animation: "animate-fade-in-up",
    props: {
      type: "text",
      appearance: "secondary",
      variant: "outline",
      size: "full",
    },
  }),
  CreateInputField({
    label: "bank_account",
    model: "bank_account",
    component: GenericInputLayoutComponent,
    animation: "animate-fade-in-up",
    props: {
      type: "text",
      appearance: "secondary",
      variant: "outline",
      size: "full",
    },
  }),
  CreateSelectField({
    label: "Category",
    model: "category_name",
    component: GenericSelectInputLayoutComponent,
    animation: "animate-fade-in-right-to-left",
    props: {
      options: { ...categories.value },
      variant: "rounded",
      appearance: "secondary",
      size: "full",
    },
  }),
])

// category 
const categories = ref<any>();
const getCategories = async ()=>{
  const response = await rfq_api.getCategoies() ;
  categories.value = response.map( (cat)=>({
    id : cat.cat_name ,
    name : cat.cat_name
  }) )
}


  const loading = ref<boolean>(true);
  const breadCrumps = ref([
    { text: 'suppliers', route: "" },
    ]);

const errors = ref<any>({});
const formData = ref<any>({
  name: "",
  tax_card: "",
  commercial_record: "",
  bank_account: "",
});


const row_id = ref(null) ;
const row_name = ref('') ;
  // edit rfq operation 
  const editItemOpen = ref<boolean>(false);
  const openEditRfq = (row)=>{
    editItemOpen.value=true ;
    row_id.value = row.id;
    row_name.value = row.name ;
    formData.value.name = row.name ;
    formData.value.tax_card = row.tax_card ;
    formData.value.commercial_record = row.commercial_record ;
    formData.value.bank_account = row.bank_account ;

   
  }


const dropDownKeys = ref<any>();
const filterDropDownData = ref<any>();





const { isModalOpen, openModal, closeModal, toggleModal } = useModal();
const displayForm = ref<boolean>(true);


const { ButtonLoad, toggleButtonLoad } = useButtonLoad();
const { reset } = useResetValue();
const { getValidationSchema } = useSchemaValidation();


// add new supplier 
const submitForm = async () => {
  const schema = getValidationSchema(formData.value, "rfq_form");
  try {
    toggleButtonLoad();
    await schema.validate(formData.value, { abortEarly: false });
    await AddNewsupplier(formData.value);
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
    setTimeout(() => {
        getsuppliers();
    }, 1000);
  }
};

// EDit supplier 

const editSupplier = async ()=>{
try {
    toggleButtonLoad();
    const payload = {
      name : '',
      tax_card : '',
      commercial_record : '',
      bank_account : ''
    };

    // Add fields to the payload only if they have been edited
    if (formData.value.name !== row_name.value) {
      payload.name = formData.value.name;
    }
    payload.tax_card = formData.value.tax_card;
    payload.commercial_record = formData.value.commercial_record;
    payload.bank_account = formData.value.bank_account;


    await editSupplierInfo(payload);
    reset(formData.value);
    displayForm.value = false;
    getsuppliers();
  } catch (error) {
   console.error(error)
  } finally {
    toggleButtonLoad();
    editItemOpen.value = false ;
    closeModal()
  }
}
const AddNewsupplier = async (payload) => {
  try {
    await vendor_api.addsupplier(payload);
  } catch (er) {
    throw er;
  }
};
const editSupplierInfo = async (payload) => {
  
  try {
    await vendor_api.edit_supplier(payload, row_id.value);
    // getStockings();
  } catch (er) {
    throw er;
  }
};


const { t, messages, locale } = useI18n();

const rows = ref<[]>();
const suppliers = ref<any>([]);

const columns = [
  t("supplier Name"),
  t("Tax Card"),
  t("Commercial Record"),
  t("Bank Account"),
  // t("Total Bills"),
  // t("Total Price"),
  // t("Total Paid"),
  // t("Total Remaining"),
  t("Created At"),
  t("Updated At"),
  // "Status",
  t("Actions"),
];
const getsuppliers = async (filter = null) => {
  loading.value = true;

  try {
    const payload = {
      ...filter,
    };
    const response = await vendor_api.getsuppliers(payload);
    suppliers.value = response;
    
    rows.value = suppliers.value.map((supplier: any) => ({
      id: supplier.id,
      name : supplier.name,
      tax_card : supplier.tax_card,
      commercial_record : supplier.commercial_record,
      bank_account : supplier.bank_account,
      // total_bills_count : supplier.total_bills_count ,
      // total_bills_price : supplier.total_bills_price ,
      // total_paid_amount : supplier.total_paid_amount ,
      // total_remaining_amount : supplier.total_remaining_amount ,
      created_at : supplier.created_at ,
      updated_at : supplier.updated_at,
      
      // additional_data:
      //   supplier.status === 0
      //     ? "Open"
      //     : supplier.status === 1
      //     ? "Closed"
      //     : supplier.status === 2
      //     ? "Confirmed" :
      //     supplier.status === 3
      //     ? "Confirmed" :
      //     supplier.status === 4
      //     ? "Receipt"
      //     : "",
    }));
  } catch (er) {
    throw er;
  } finally {
    loading.value = false;
  }
};


onMounted(async () => {
  getsuppliers();
  getCategories()
});

  </script>
  