<template>
    <div class="mx-12">
      <BreadCrumpsComponent
        :BreadCrumps="breadCrumps"
        
       
        @toggleModalEmit="openModalComponent"
      />

      
      <!-- btn="Add Custody" -->
      <SearchLayoutComponent
        @update:search="getBills($event)"
        :Schema="schema"
      />
      
      <TableSkeletonLoader v-if="loading" />
      <div v-else>
        <TableLayoutComponent
          :columns="columns"
          :rows="rows"
          :pageLable="$t('Bills')"
        >
          <template #status="{ row }">
            <td>
              <div
                class="btn"
                :class="{
                  indigo_badge: row.additional_data === t('status.confirm'),
                  yellow_badge: row.additional_data === t('status.close'),
                  green_badge: row.additional_data === t('status.open'),
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
                    name: 'Bill-Operation-Details',
                    params: { form_id: row.id, operation_id: route.params.id }, // operation id
                  }"
                >
                  <font-awesome-icon :icon="['fas', 'list']" />
                </router-link>

                
              </div>
             
           
            </td>
          </template>
          
        </TableLayoutComponent>
      </div>

    
    </div>
  </template>
  <script setup lang="ts">
  //GOLBAL IMPORTS
  import { computed, onMounted, ref } from "vue";
  import { useRoute } from "vue-router";
  
  import { useI18n } from "vue-i18n";
  import { defineAsyncComponent, shallowRef } from "vue";
  // import ButtonComponent from "@/components/Layouts/AppLayoutComponents/ButtonComponent.vue";

  //GLOBLA DATA
  const route = useRoute();
  const { t } = useI18n();
  //TABLE
  //TABLE IMPORTS
  import TableSkeletonLoader from "@/components/Layouts/TablesLayoutComponents/TableLoadersComponents/TableSkeletonLoader.vue";
  import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
  import TableLayoutComponent from "@/components/Layouts/TablesLayoutComponents/TableLayoutComponent.vue";
  import SearchLayoutComponent from "@/components/Layouts/FormLayoutComponents/SearchLayoutComponent.vue";
  import bill_api from "@/services/bill_api";
  import axios from "axios";
import env from "@/env";
import rfq_api from "@/services/rfq_api";
import GenericSelectInputLayoutComponent from "@/components/Layouts/FormLayoutComponents/GenericSelectInputLayoutComponent.vue";
import GenericInputLayoutComponent from "@/components/Layouts/FormLayoutComponents/GenericInputLayoutComponent.vue";
import { useModal } from "@/composables/useModal";
const { isModalOpen, openModal, closeModal, toggleModal } = useModal();

//search
import {
  CreateInputField,
  CreateSelectField,
} from "@/utils/create_input_field";
const schema = computed(() => [
  
  CreateInputField({
    label: "FROM",
    model: "date_from",
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
    label: "TO",
    model: "date_to",
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
    label: "Vendor",
    model: "vendor_id",
    component: GenericSelectInputLayoutComponent,
    animation: "animate-fade-in-right-to-left",
    props: {
      options: { ...vendors.value },
      variant: "rounded",
      appearance: "secondary",
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
  CreateSelectField({
    label: "payment_type",
    model: "payment_type",
    component: GenericSelectInputLayoutComponent,
    animation: "animate-fade-in-right-to-left",
    props: {
      options: { ...payment_types.value },
      variant: "rounded",
      appearance: "secondary",
      size: "full",
    },
  }),
  CreateSelectField({
    label: "payment_method",
    model: "payment_method",
    component: GenericSelectInputLayoutComponent,
    animation: "animate-fade-in-right-to-left",
    props: {
      options: { ...payment_methods.value },
      variant: "rounded",
      appearance: "secondary",
      size: "full",
    },
  }),
  CreateSelectField({
    label: "bill_type",
    model: "bill_type",
    component: GenericSelectInputLayoutComponent,
    animation: "animate-fade-in-right-to-left",
    props: {
      options: { ...bill_types.value },
      variant: "rounded",
      appearance: "secondary",
      size: "full",
    },
  }),
  
]);
const openModalComponent = ()=>{
  openModal()
}
  //TABLE DATA
  const loading = ref<boolean>(true);
  const rows = shallowRef<[]>();
  const bills = shallowRef<any>([]);
  
  const breadCrumps = [{ text: t('Bills'), route: "" }];
  const columns = [
    t("adjustment_form.table.form_lable"),
    t('Location From'),
    t('location to'),
    t('rfq_form.form.doc_number'),
    t('rfq_form.form.work_order_line_num'),
    t('rfq_form.form.form_datetime'),
    t('categories.table.cat_name'),
    t('payment_type'),
    t('payment_method'),
    t("Type"),
    t("Total Price"),
    t('total_paid_amount'),
    t('Remaining Amount'),
    // t('operation_details.header.total_items'),
    // t("Description"),
    // t("rfq_form.form.created_at"),
        t("release_form.table.created_by"),
        t('buyer'),
        t("release_form.table.status"),
    t("release_form.table.actions"),
  ];
  //TABLE COMPUTED
  const disableBtn = computed(() => {
    return (
      Array.isArray(bills.value) &&
      bills.value.some((el) => el.status === 0 || el.status === 1)
    );
  });

  const payment_methods = ref([
  {
    name : 'Cash',
    id : 'cash'
  },
  {
    name : 'Bank Transfer',
    id : 'bank_transfer'
  },
  {
    name : 'Cheque',
    id : 'cheque'
  },
  {
    name : 'Notes Payable',
    id : 'notes_payable'
  }
])

const payment_types = ref([
  {
    name : 'Cash',
    id : 'cash'
  },
  {
    name : 'Postpaid',
    id : 'postpaid'
  }
])
const bill_types = ref([
    {
        name : 'Invoice',
        id : 'invoice'
    },
    {
        name : 'Tax Invoice',
        id : 'tax_invoice'
    }
])

  // filter 
  const dropDownKeys = ref([
    "vendor",
    "category",
    "payment_type",
    "payment_method",
    "bill_type"
  ])

  // vendor 
const vendors = ref([]);
async function getVendors() {
  try {
    const response = await axios.get(env.DOMAIN + "purch-apis/purchasing/creditors");
    vendors.value = response.data.data;
    filterDropDownData.value.vendor = response.data.data ;
  } catch (er) {
    console.error(er);
    throw er;
  }
}

// category 
const categories = ref<any>();
const getCategories = async ()=>{
  const response = await rfq_api.getCategoies() ;
  categories.value = response.map( (cat)=>({
    id : cat.cat_name ,
    name : cat.cat_name
  }) )
}

  const filterDropDownData = ref({
    payment_type : payment_types.value,
    payment_method : payment_methods.value,
    bill_type : bill_types.value,
    vendor : null,
    category : null,
  })
  //TABLE METHODS
  const getBills = async (filter=null) => {
    loading.value = true;
    try {
      const payload = {
      ...filter,
    };
      const response = await bill_api.getBills(payload);
      bills.value = response;
      
  
      rows.value = response.map((bill: any) => {
      const paymentType = payment_types.value.find(el => el.id === bill.payment_type);
      const paymentMethod = payment_methods.value.find( el => el.id === bill.payment_method )
      const BillType = bill_types.value.find( el => el.id === bill.bill_type )
      return {
        id: bill.id,
        form_lable: bill.form_label,
        from_location: bill.from_location?.location_name,
        location_to: bill.to_location?.location_name,
        doc_number: bill.doc_number,
        work_order_line_num: bill.work_order_line_num,
        form_datetime: bill.form_datetime,
        category_name: bill.category_name,
        payment_type: paymentType ? paymentType.name : null, // Get value or null if not found
        payment_method: paymentMethod ? paymentMethod.name : null,
        type: BillType ? BillType.name : null,
        total_price: bill.total_price,
        total_paid_amount: bill.total_paid_amount,
        remaining_amount : bill.total_price - bill.total_paid_amount,
        // total_items: bill.total_items,
        // description: bill.description,
        created_by: [{ text: bill.user?.name }, { text: bill.created_at }], // Check if user exists
        buyer: bill.buyer?.name,
        additional_data:
          bill.status === 2
            ? t("status.confirm")
            : response.status === 1
            ? t("status.close")
            : t("status.open"),
      };
    });
    } catch (er) {
      throw er;
    } finally {
      loading.value = false;
    }
  };

  
 
  //LIFECYCLE HOOKS
  onMounted(async () => {
    const payload = {
      operation_id: +route.params.operation_id,
    }
    getBills(payload);
    getCategories();
    getVendors();
  });
  </script>
  