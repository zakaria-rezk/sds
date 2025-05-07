<template>
    <div class="mx-12">
      <BreadCrumpsComponent
        :BreadCrumps="breadCrumps"
        
         btn="Add Cheque"

        @toggleModalEmit="openModal(),formType='Add'"
      />

      <!-- btn="Add Custody" -->
      <SearchLayoutComponent
        @update:search="getCheques($event)"
        :Schema="schema"
      />
      
      <TableSkeletonLoader v-if="loading" />
      <div v-else>
        <TableLayoutComponent
          :columns="columns"
          :rows="rows"
          :pageLable="$t('cheques')"
        >
          <template #status="{ row }">
            <td>
              <div
                class="btn"
                :class="{
                  indigo_badge: row.additional_data === t('New') || row.additional_data === t('Returned'),
                  yellow_badge: row.additional_data === t('Delivered') || row.additional_data === t('Rescheduled'),
                  green_badge: row.additional_data === t('WithDrawed')|| row.additional_data === t('Signtured'),
                }"
              >
                {{ row.additional_data }}
              </div>
            </td>
          </template>
          <template #actions="{ row }"
            >
            <td>
              <div class="btn color-primary">
                <router-link
                  :to="{
                    name: 'cheque-details',
                    params: { form_id: row.id, operation_id: route.params.id }, // operation id
                  }"
                >
                  <font-awesome-icon :icon="['fas', 'list']" />
                </router-link>

                
              </div>
              <button v-if="row.additional_data === t('New')" class="btn color-primary"   @click="openEditBill(row)">
                <font-awesome-icon :icon="['fas', 'edit']" /> 
              </button>
           
            </td>
          </template>
        
        </TableLayoutComponent>
      </div>

      <ModalComponent :showModal="isModalOpen" v-if="isModalOpen"
        >
        <FormPopUpLayoutComponent @closeModal="toggleModal" :title="formType=='Add' ? $t('Add Cheque') : t('Edit Cheque')">

      <div       
        class="flex flex-col"
      >
            <!-- vendor  -->
            <div class="input flex flex-col w-full py-2 mt-1">
              <InputLableLayoutComponent
                lableFor="vendor"
                text="Recipient Vendor"
                :required="true"
              />
             
                <select
                    id="vendor"
                    class="rounded-output py-2 rounded-md border-2 bg-gray-100 text-gray-500 px-2"
                    v-model="formData.recipient_id"
                    >
                    <option  value="" disabled selected hidden>
                        {{  $t('Recipient Vendor')  }}
                    </option>
                    <option  v-for="(user , index) in suppliers" :key="index" :value="user.id">
                        {{user.name}}
                    </option>
                
                </select>
                <p v-if="errors.recipient_id" class="pt-2 text-xs text-red-500">
                    {{ errors.recipient_id }}
                </p>
            </div>
    
            <!-- bank account  -->
            <div class="input flex flex-col w-full py-2 mt-1">
              <InputLableLayoutComponent
                lableFor="bank_account"
                text="Bank Account"
                :required="true"
              />
             
                <select
                    id="bank_account"
                    class="py-2 rounded-md border-2 bg-gray-100 text-gray-500 px-2"
                    v-model="formData.bank_account_id"
                    >
                    <option  value="" disabled selected hidden>
                        {{  $t('Bank Account')  }}
                    </option>
                    <option  v-for="(user , index) in bank_accounts" :key="index" :value="user.id">
                        {{user.bank_name}}
                    </option>
                
                </select>
                <p v-if="errors.bank_account_id" class="pt-2 text-xs text-red-500">
                    {{ errors.recipient_id }}
                </p>
            </div>

          

            <!-- Amount  -->
            <div class="input flex flex-col w-full py-2 mt-1">
                <InputLableLayoutComponent
                    lableFor="amount"
                    text="Amount"
                    :required="true"
                />
                
                <input
                    type="number"
                    id="amount"
                    class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
                    placeholder="Please enter Amount"
                    v-model="formData.amount"

                />

                <p v-if="errors.amount" class="pt-2 text-xs text-red-500">
                    {{ errors.amount }}
                </p>
            </div>

            <!-- cheque number  -->
            <div class="input flex flex-col w-full py-2 mt-1">
                <InputLableLayoutComponent
                    lableFor="cheque_number"
                    text="Cheque Number"
                    :required="true"
                />
                
                <input
                    type="text"
                    id="cheque_number"
                    class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
                    placeholder="Please enter Cheque Number"
                    v-model="formData.cheque_number"

                />

                <p v-if="errors.cheque_number" class="pt-2 text-xs text-red-500">
                    {{ errors.cheque_number }}
                </p>
            </div>

            <!-- created_at  -->
            <div class="input flex flex-col w-full py-2 mt-1">
                <InputLableLayoutComponent
                    lableFor="created_at"
                    text="Created At"
                    :required="true"
                />
                <input
                    type="date"
                    id="created_at"
                    name="created_at"
                    v-model="formData.created_at"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p v-if="errors.created_at" class="pt-2 text-xs text-red-500">
                    {{ errors.created_at }}
                </p>
            </div>

            <!-- maturity_date  -->
            <div class="input flex flex-col w-full py-2 mt-1">
                <InputLableLayoutComponent
                    lableFor="maturity_date"
                    text="Maturity Date"
                    :required="true"
                />
                <input
                    type="date"
                    id="maturity_date"
                    name="maturity_date"
                    v-model="formData.maturity_date"

                    class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p v-if="errors.maturity_date" class="pt-2 text-xs text-red-500">
                    {{ errors.maturity_date }}
                </p>
            </div>

            <!-- cashing_date  -->
            <div class="input flex flex-col w-full py-2 mt-1">
                <InputLableLayoutComponent
                    lableFor="cashing_date"
                    text="Cashing Date"
                    :required="true"
                />
                <input
                    type="date"
                    id="cashing_date"
                    name="cashing_date"
                    v-model="formData.cashing_date"

                    class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p v-if="errors.cashing_date" class="pt-2 text-xs text-red-500">
                    {{ errors.cashing_date }}
                </p>
            </div>

            <!-- add button  -->
            <ButtonComponent    
                v-if="formType=='Add'"
                :loading="ButtonLoad"
                title="Add Cheque"
                @click="submitForm"
                class="form_btn"
            />
            <!-- Edit button  -->
            <ButtonComponent    
                v-if="formType=='Edit'"
                :loading="ButtonLoad"
                title="Add Cheque"
                @click="submitForm"
                class="form_btn"
            />
      </div>
      
    </FormPopUpLayoutComponent>

      </ModalComponent>
    </div>
  </template>
  <script setup lang="ts">
  //GOLBAL IMPORTS
  import { computed, onMounted, ref } from "vue";
  import { useRoute } from "vue-router";
  
  import { useI18n } from "vue-i18n";
  import { defineAsyncComponent, shallowRef } from "vue";
  import ButtonComponent from "@/components/Layouts/AppLayoutComponents/ButtonComponent.vue";
  //GLOBLA DATA
  const route = useRoute();
  const { t } = useI18n();
  //TABLE
  //TABLE IMPORTS
  import TableSkeletonLoader from "@/components/Layouts/TablesLayoutComponents/TableLoadersComponents/TableSkeletonLoader.vue";
  import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
  import TableLayoutComponent from "@/components/Layouts/TablesLayoutComponents/TableLayoutComponent.vue";
  import SearchLayoutComponent from "@/components/Layouts/FormLayoutComponents/SearchLayoutComponent.vue";
  import cheques_api from "@/services/cheques_api";
  import vendor_api from "@/services/vendor_api";
  import { useButtonLoad } from "@/composables/useButtonLoad";
  import { useResetValue } from "@/composables/useResetValue";
  import { useSchemaValidation } from "@/composables/useValidationSchema";
  const { ButtonLoad, toggleButtonLoad } = useButtonLoad();
  const { reset } = useResetValue();
const { getValidationSchema } = useSchemaValidation();


import GenericSelectInputLayoutComponent from "@/components/Layouts/FormLayoutComponents/GenericSelectInputLayoutComponent.vue";
import GenericInputLayoutComponent from "@/components/Layouts/FormLayoutComponents/GenericInputLayoutComponent.vue";

//search
import {
  CreateInputField,
  CreateSelectField,
} from "@/utils/create_input_field";
const schema = computed(() => [
  // created 
  CreateInputField({
    label: "created_from",
    model: "created_from",
    component: GenericInputLayoutComponent,
    animation: "animate-fade-in-up",
    props: {
      type: "date",
      appearance: "secondary",
      variant: "outline",
      size: "full",
    },
  }),
  CreateInputField({
    label: "created_to",
    model: "created_to",
    component: GenericInputLayoutComponent,
    animation: "animate-fade-in-up",
    props: {
      type: "date",
      appearance: "secondary",
      variant: "outline",
      size: "full",
    },
  }),
   // MATURITY  
   CreateInputField({
    label: "maturity_from",
    model: "maturity_from",
    component: GenericInputLayoutComponent,
    animation: "animate-fade-in-up",
    props: {
      type: "date",
      appearance: "secondary",
      variant: "outline",
      size: "full",
    },
  }),
  CreateInputField({
    label: "maturity_to",
    model: "maturity_to",
    component: GenericInputLayoutComponent,
    animation: "animate-fade-in-up",
    props: {
      type: "date",
      appearance: "secondary",
      variant: "outline",
      size: "full",
    },
  }),
   // Cashing  
   CreateInputField({
    label: "cashing_from",
    model: "cashing_from",
    component: GenericInputLayoutComponent,
    animation: "animate-fade-in-up",
    props: {
      type: "date",
      appearance: "secondary",
      variant: "outline",
      size: "full",
    },
  }),
  CreateInputField({
    label: "cashing_to",
    model: "cashing_to",
    component: GenericInputLayoutComponent,
    animation: "animate-fade-in-up",
    props: {
      type: "date",
      appearance: "secondary",
      variant: "outline",
      size: "full",
    },
  }),
  CreateSelectField({
    label: "bank_account",
    model: "bank_account",
    component: GenericSelectInputLayoutComponent,
    animation: "animate-fade-in-right-to-left",
    props: {
      options: { ...bank_accounts.value },
      variant: "rounded",
      appearance: "secondary",
      size: "full",
    },
  }),
  CreateSelectField({
    label: "cheque_number",
    model: "cheque_number",
    component: GenericSelectInputLayoutComponent,
    animation: "animate-fade-in-right-to-left",
    props: {
      options: { ...cheque_numbers.value },
      variant: "rounded",
      appearance: "secondary",
      size: "full",
    },
  }),
  CreateSelectField({
    label: "cheques_status",
    model: "status",
    component: GenericSelectInputLayoutComponent,
    animation: "animate-fade-in-right-to-left",
    props: {
      options: { ...cheques_status.value },
      variant: "rounded",
      appearance: "secondary",
      size: "full",
    },
  }),
  CreateInputField({
    label: "name",
    model: "recipient_name",
    component: GenericInputLayoutComponent,
    animation: "animate-fade-in-up",
    props: {
      type: "text",
      appearance: "secondary",
      variant: "outline",
      size: "full",
    },
  }),
])
//   get vendors 
const suppliers = ref([]);
const getVendors = async ()=>{
    try{
        const response = await vendor_api.getsuppliers(null);
        suppliers.value = response;
    }catch( err ){
        console.error(err)
    }
}

// get bank accounts
const bank_accounts = ref([]);
const getBankAccounts = async ()=>{
    try{
        const response = await cheques_api.getBankAccounts();
        // bank_accounts.value = response;
        bank_accounts.value = response.map((account: any) => ({   
          id : account.bank_name ,
          name : account.bank_name,
       }));


    }catch( err ){
        console.error(err)
    }
}
const cheque_numbers = ref([])
const errors = ref<any>({});
const formData = ref<any>({
    recipient_id: "",
    bank_account_id: "",
    cheque_number: "",
    amount: "",
    created_at : new Date().toISOString().substr(0,10),
    maturity_date : new Date().toISOString().substr(0,10),
    cashing_date : new Date().toISOString().substr(0,10),
    status : 0
});


// edit cheques 
const formType = ref('Add')
const row_to_edit = ref(null) ;
const openEditBill =(row)=>{
    openModal() ;
    formType.value = 'Edit' ;
    row_to_edit.value = row.id ;
    formData.value.cheque_number = row.cheque_number ;
    formData.value.amount = row.amount ;
    formData.value.created_at =row.created_at.split(" ")[0] ;
    formData.value.maturity_date = row.maturity_date.split(" ")[0] ;
    formData.value.cashing_date = row.cashing_date.split(" ")[0] ;
    // get bank account 
    for( let i = 0 ; i < bank_accounts.value.length ; i++ ){
        if(row.bank_name == bank_accounts.value[i].bank_name){
            formData.value.bank_account_id = bank_accounts.value[i].id ;
            break ;
        }
    }
    // get vendor 
    for( let i = 0 ; i < suppliers.value.length ; i++ ){
        if(row.recipient_name == suppliers.value[i].name){
            formData.value.recipient_id = suppliers.value[i].id ;
            break ;
        }
    }
    // get status 
    for( let i = 0 ; i < cheques_status.value.length ; i++ ){
        if(row.additional_data == cheques_status.value[i].name){
            formData.value.status = cheques_status.value[i].id ;
            break ;
        }
    }
}
// add new Cheque 
const submitForm = async () => {
  const schema = getValidationSchema(formData.value, "create_item");
  try {
    toggleButtonLoad();
    await schema.validate(formData.value, { abortEarly: false });
    if(formType.value == 'Add'){
        await cheques_api.addCheque(formData.value);
    }else{
        await cheques_api.EditCheque(formData.value , row_to_edit.value);
    } 
    reset(formData.value);
    closeModal()
    getCheques();
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


  const ModalComponent = defineAsyncComponent(
    () => import("@/components/Layouts/AppLayoutComponents/ModalComponent.vue")
  );
  const FormPopUpLayoutComponent = defineAsyncComponent(
    () =>
      import(
        "@/components/Layouts/PopUpLayoutComponent/FormPopUpLayoutComponent.vue"
      )
  );
  import InputLableLayoutComponent from "@/components/Layouts/InputsFromLayoutCompoennts/InputLableLayoutComponent.vue";
  //TABLE COMPOSABLES
  import { useModal } from "@/composables/useModal";
  const { isModalOpen, openModal, closeModal, toggleModal } = useModal();
 


  //TABLE DATA
  const loading = ref<boolean>(true);
  const rows = shallowRef<[]>();
  const cheques = shallowRef<any>([]);
  
  const breadCrumps = [{ text: t('cheques'), route: "" }];
  const columns = [
    t('recipient_name'),
    t('bank_name'),
    t('bank_account'),
    t('cheque_number'),
    t('check_created_at'),
    t('maturity_date'),
    t('cashing_date'),
    t('Amount'),
    t("release_form.table.status"),
    t("release_form.table.actions"),
  ];
  //TABLE COMPUTED
  const disableBtn = computed(() => {
    return (
      Array.isArray(cheques.value) &&
      cheques.value.some((el) => el.status === 0 || el.status === 1)
    );
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
  //TABLE METHODS
  const getCheques = async (filter=null) => {
    loading.value = true;
    try {
      const payload = {
      ...filter,
    };
      const response = await cheques_api.getCheques(payload);
      cheques.value = response;
      
      rows.value = response.map((cheque: any) => ({
        id: cheque.id,
        recipient_name: cheque.recipient_name,
        bank_name: cheque.bank_name,
        bank_account: cheque.bank_account,
        cheque_number: cheque.cheque_number,
        created_at: cheque.created_at.slice(0, 10),
        maturity_date: cheque.maturity_date.slice(0, 10),
        cashing_date: cheque.cashing_date.slice(0, 10),
        amount: cheque.amount,
        additional_data:
          cheque.status === 0
            ? t("New")
            : cheque.status === 1
            ? t("Delivered")
            : cheque.status === 2
            ? t("WithDrawed")
            : cheque.status === 3
            ? t("Returned")
            : cheque.status === 4
            ? t("Rescheduled")
            : cheque.status === 5
            ? t("Signtured")
            : t("status.open"),
      }));

      cheque_numbers.value = response.map( (cheque:any) => ({
        id : cheque.cheque_number ,
        name  : cheque.cheque_number
      }))
    } catch (er) {
      throw er;
    } finally {
      loading.value = false;
    }
  };

  
 
  //LIFECYCLE HOOKS
  onMounted(async () => {
    getCheques();
    getVendors();
    getBankAccounts();
  });
  </script>
  