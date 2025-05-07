<template>
  <div>
    <div>
      
      <div class="flex justify-center-items-center mx-auto">
        <img src="@/assets/Logo/Mask-group-optimized.png" class="w-[200px] h-[150px] cover mx-auto" alt="">
      </div>
     
      <!--  -->
      <TableSkeletonLoader v-if="loading" />

      <section  v-else>
        <TableLayoutComponent
          ref="tableContent"
          id="table"
          :columns="columns"
          :rows="rows"
           :status-counter="statusCounter"
          :vendors="vendors"
          :pageLable="$t('PQ Operations')"
          :allFields="opHeader"
          :isApprove="false"
          :slotTDcolName="slotTDcolName"
          @getUpdatedData="getUpdatedData"
          @updatePq="getUpdatedData"
          @updateTableIds="updateTableIds"
        >
          <template #columnAction="{ row }">
            <span v-if="row.additional_data == 0" class="mx-2">
              <button
                @click="
                  openModal();
                  row_id = row.id;
                "
                class="cursor-pointer indigo_badge"
              >
                <font-awesome-icon :icon="['far', 'pen-to-square']" />
              </button>
            </span>
          </template>

         
        </TableLayoutComponent>

      
      

       <section class="flex  justify-end items-end second-thead rounded-lg p-4"> 
        <div class="flex   w-1/3 h-[46px]"  v-if="itemStatus==3||itemStatus==4">
            <h5 class="rounded-span">Signature :</h5>
            <h5 class="rounded-output"></h5>
          </div>
          <div class="flex   w-1/3 mx-3"  v-if="itemStatus==3||itemStatus==4">
            <h5 class="rounded-span">Signature :</h5>
            <h5 class="rounded-output"></h5>
          </div>
        <div class="flex   w-1/3" v-if="itemStatus==3||itemStatus==4">
          <h5 class="rounded-span">Total Price :</h5>
          <h5 class="rounded-output">{{ totalPrice }} EGP</h5>
        </div>

       </section>
       </section>
    </div>






  </div>
</template>
<script setup lang="ts">
import jsPDF from "jspdf";
import html2canvas from "html2canvas"; // Alternative for complex styling

// page
import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
import rfq_api from "@/services/rfq_api";
import { computed, onMounted, ref } from "vue";

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
import FormPopUpLayoutComponent from "@/components/Layouts/PopUpLayoutComponent/FormPopUpLayoutComponent.vue";
import ModalComponent from "@/components/Layouts/AppLayoutComponents/ModalComponent.vue";
import InputLableLayoutComponent from "@/components/Layouts/InputsFromLayoutCompoennts/InputLableLayoutComponent.vue";
import { useSchemaValidation } from "@/composables/useValidationSchema";



const activeLocationId = ref('') ;
  const operation_id_for_recive = ref('');
  const operation_id_for_Bill = ref('');
  const operation_id_Receive = ref(4);


// get active operatio_id for Custody 
const getLocationOperation = async () => {
  try {
    const response = await axios.get(env.DOMAIN + "inv-apis/settings/loc-operations", {
      params: {
        location_id: +activeLocationId.value,

        operation_type: "CUSTODY",
      },
    });
  
    operation_id_for_recive.value = response.data.data[0].id ;
  } catch (er) {
    
    throw er;
  }
};
// get active operatio_id for Bill 
const getLocationOperationForBill = async () => {
  try {
    const response = await axios.get(env.DOMAIN + "inv-apis/settings/loc-operations", {
      params: {
        location_id: +activeLocationId.value,

        operation_type: "BILL",
      },
    });
  
    operation_id_for_Bill.value = response.data.data[0].id ;
  } catch (er) {
    
    throw er;
  }
};
// get active operatio_id for Receive 
// const getLocationOperationForReceive = async () => {
//   try {
//     const response = await axios.get(env.DOMAIN + "inv-apis/settings/loc-operations", {
//       params: {
//         location_id: +activeLocationId.value,

//         operation_type: "IN",
//       },
//     });
  
//     operation_id_Receive.value = response.data.data[0].id ;
    
//   } catch (er) {
    
//     throw er;
//   }
// };



const tableContent = ref(null);

// function for print table 
function printTable() {
  const printWindow = window.open("", "", "width=800,height=600");
  printWindow.document.open();
  printWindow.document.write(document.getElementById("contentToPdf").outerHTML);
  printWindow.document.close();
  window.print();
}
// funtion for generate custom pdf 
const generatePDF = async () => {
  try {
    const element = document.getElementById("contentToPdf");
    const canvas = await html2canvas(element);
    const dataUrl = canvas.toDataURL("image/png");

    const doc = new jsPDF();
    doc.addImage(dataUrl, "PNG", 25, 25, 150, 100);

    const filename = "El-Alfy-PQ.pdf";
    // Save the PDF with the specified filename
    doc.save(filename);

    doc.output("dataurlnewwindow"); // Opens the PDF in a new tab
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};

const vendor = ref(null);

const { reset } = useResetValue();
const { isModalOpen, openModal, closeModal, toggleModal } = useModal();
const loading = ref<boolean>(true);
const btnLoading = ref<boolean>(false);
const { ButtonLoad, toggleButtonLoad } = useButtonLoad();
const { getValidationSchema } = useSchemaValidation();

const errors = ref<any>({});
const row_id = ref<string>();
const row_name = ref<string>();

const row_status = ref(null);
const row_id_for_edit = ref(null);



const item_discount = ref("");
const formData = ref<any>({
  new_quantity : "",
  vendor_id : "",
  item_price  : ""
})
const openModalForUpdate = (status, row_id, row) => {
  openModal();
  row_status.value = status;
  row_id_for_edit.value = row_id;
  row_name.value = row.name;
  formData.value.item_price = row.item_price;
  item_discount.value = row.item_discount;
  formData.value.new_quantity = row.form_quantity;

  for (let i = 0; i < vendors.value.length; i++) {
    if (vendors.value[i].id == row.vendor_id) {
      formData.value.vendor_id = vendors.value[i].id;
    }
  }
};




const submitForm = async () => {
  const schema = getValidationSchema(formData.value, "create_item");
  try {
      toggleButtonLoad();
      await schema.validate(formData.value, { abortEarly: false });
      try {
      const payload = {
        // form_id :  +route.params.form_id ,
        form_quantity: formData.value.new_quantity,
        item_discount: item_discount.value,
        item_price: formData.value.item_price,
        vendor_id: formData.value.vendor_id,
      };
      await rfq_api.updatePQDetails(payload, row_id_for_edit.value);
      reset(formData.value);
      closeModal();
      getRFQDetails();
    } catch (er) {
      throw er;
    }
  } catch (error) {
    
    if (error.inner) {
      error.inner.forEach((validationError: any) => {
        errors.value[validationError.path] = validationError.message;
      });
    }
  } finally {
    toggleButtonLoad()
  }
};

const detail_ids = ref([]);
// updates table ids
const updateTableIds = (ids) => {
  detail_ids.value = ids;
};
// convert RFQ to PQ
const covertRfqToPq = async () => {
  try {
    try {
      const response = await rfq_api.convertRfqToPq(+route.params.form_id,+route.params.operation_id );
    } catch (er) {
      throw er;
    }
  } catch (error) {
    console.error(error);
  } finally {
    getUpdatedData();
  }
};
// Generate Custody
const generateCustody = async () => {
  try {
    try {
      const response = await rfq_api.generateCustody(+route.params.form_id,operation_id_for_recive.value );
    } catch (er) {
      throw er;
    }
  } catch (error) {
    console.error(error);
  } finally {
    getUpdatedData();
  }
};


// update vendors
const updateVendors = async () => {
  const payload = {
    detail_ids: detail_ids.value,
    vendor_ids: [vendor.value],
  };
  try {
    const response = await rfq_api.updateVendors(payload);

    
  } catch (er) {
    throw er;
  } finally {
    setTimeout(() => {
      getRFQDetails();
    }, 1000);
  }
};



// generate bill from receive 
const generateBill = async (source_form_id)=>{
  try{
    const response = await rfq_api.generateBillFromReceive(source_form_id,operation_id_for_Bill.value);
  }catch(err){
    console.error(err)
  }finally{
    getRFQDetails()
  }
}
//table
import TableSkeletonLoader from "@/components/Layouts/TablesLayoutComponents/TableLoadersComponents/TableSkeletonLoader.vue";
import TableLayoutComponent from "@/components/Layouts/TablesLayoutComponents/EditableTableLayout.vue";
import TableLayoutComponent1 from "@/components/Layouts/TablesLayoutComponents/TableLayoutComponent.vue";
import store from "@/Middelware/store";

const rows = ref([]);
const receives_rows = ref([])
const opHeader = ref<any>();
const slotTDcolName = "form_quantity";

const PQS = ref<any>();
const disableBtn = computed(() => {
  return Array.isArray(PQS.value) && PQS.value.some((el) => el.status === 0);
});
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
  { text: "PQs", route: "PQ" },
  { text: "Details", route: "" },
]);
const navigateToAddItemsPage = () => {
  router.push({
    name: "add-RFQ-item",
    params: {
      form_id: +route.params.form_id,
      operation_id: +route.params.operation_id,
    },
  });
};
const itemStatus = ref(null);
const totalPrice = ref(null);

const columns = [
    t('Item') ,
    t('Item Sku Code') ,
    t('Material'),
    t('Shape'),
    t('Color'),
    t('Origin'),
  "Form Quantity",
  "Item Price",
  "Item Discount",
  // "status",
  "Vendor",
  itemStatus.value===2 ? "Actions" : '',
];
const form_files = ref([])
const receives_columns = [
t("table.form_lable"),
  t("table.source_location"),
  t("table.destination_location"),
  t("table.form_date_time"),
  t("table.created_by"),
  t("table.created_at"),
  t("table.confirmed_at"),
  t("table.status"),
  t("table.actions"),
];
const statusCounter = ref<any>();

const getRFQDetails = async () => {
  loading.value = true;
  try {
    const response = await rfq_api.getPQWithItems(+route.params.form_id);

    PQS.value = response;
    rows.value = PQS.value.form_details.map((opItem: any) => ({
      id: opItem.id,
      name : opItem.item.item_name,
        item_sku_code : opItem.item.item_sku_code,
        material : opItem.item?.material?.material_nicknames ,
        shape : opItem.item?.shape?.shape_name ,
        color : opItem.item?.color?.color_name ,
        origin : opItem.item?.origin?.origin_name ,
      form_quantity: opItem.form_quantity,
      item_price: opItem.item_price,
      item_discount: opItem.item_discount,
      vendor_id: opItem.vendor?.name,

      additional_data:
        opItem.status === 0
          ? "Open"
          : opItem.status === 1
          ? "Closed"
          : opItem.status === 2
          ? "Confirmed"
          : opItem.status === 3
          ? "Confirmed"
          : "",
    }));
    itemStatus.value = response.status;
    totalPrice.value = rows.value.reduce(
      (acc, item) => acc + item.item_price*item.form_quantity,
      0
    );

    // disabled start quotation untill all items has price and vendors 
   

   
    // receives rows for this pq 
    receives_rows.value = PQS.value.in_operations.map((receive: any) =>({
      id: receive.id,
      form_lable: receive.form_label,
      source_location: receive.from_location,
      destination_location: receive.to_location?.location_name,
      form_datetime: receive.form_datetime,
      created_by: receive.created_by,
      created_at: receive.created_at,
      confirmed_at: receive.confirmed_at,
      additional_data:
        receive.status === 0
          ? "Open"
          : receive.status === 1
          ? "Closed"
          : receive.status === 2
          ? "Confirmed"
          : receive.status === 3
          ? "Confirmed"
          : "",
    })
    );
    form_files.value = PQS.value.forms_files ;
    receives_rows.value = receives_rows.value.filter( (el)=> el.additional_data == "Confirmed"  )
    //   ----------------------------------------
    opHeader.value = [
      { label: "Form Label", value: response.form_label || "" },
      { label: "Location From", value: response.from_location?.location_name || "" },
      { label: "Doc Num.", value: response.doc_number || "" },
      { label: "Date", value: response.form_datetime || "" },

      { label: "Created", value: `At : ${response.created_at.slice(0,16)}, By : ${response.user?.name}` },
      // { label: "Total Items", value: response?.total_items || "" },
      // { label: "Total Price", value: response?.total_price || "" },
      { label: "Quoted", value: `At : ${response.quoted_at.slice(0,16)},By : ${response?.quoted_by?.name}` || "" },

      {
        label: "Status",
        value:
          response.status === 2
            ? "Confirmed"
            : response.status === 1
            ? "Closed"
            : response.status === 3
            ? "Confirmed"
            : response.status === 4
            ? "Approved"
            : "Open",
      },
      { label: "Stu", value: response.status },
    ];

    statusCounter.value = [
      {
        label: t("Total Items"),
        value: rows.value.length,
      },
      
     
    ];

    //   ----------------------------------------
  } catch (er) {
    throw er;
  } finally {
    loading.value = false;
  }
};

const getUpdatedData = () => {
  getRFQDetails();
};





const vendors = ref([]);
async function getVendors() {
  try {
    const response = await axios.get(env.DOMAIN + "purch-apis/purchasing/creditors");
    vendors.value = response.data.data;
  } catch (er) {
    console.error(er);
    throw er;
  }
}
onMounted(() => {
  getVendors();
});
onMounted(async () => {
  getRFQDetails();
  activeLocationId.value = store.getters["location_module/LocationId"];
    setTimeout(() => {
      getLocationOperation()
      getLocationOperationForBill()
      // getLocationOperationForReceive()
    }, 100);

});
</script>

<style>
.indigo_badge:disabled{
  opacity: .4;
  cursor: not-allowed !important;
}

</style>
