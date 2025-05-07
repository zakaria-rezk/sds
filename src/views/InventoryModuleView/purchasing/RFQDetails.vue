<template>
    <div>
      <div>
        <!-- <div class="flex justify-between items-center"> -->
          <BreadCrumpsComponent
          :BreadCrumps="breadCrumps"
          :btn="itemStatus!=4 ? $t('Add Items') : null"
          :disabled="ActiveBtn"
          @toggleModalEmit="navigateToAddItemsPage"/>


          <button class="cursor-pointer indigo_badge p-3" @click="ReciptOrder" v-if="itemStatus==4&&adjustments.in_operations.length==0">
            {{ $t('Receipt') }}
          </button>
        <!-- </div> -->

        <!--  -->
        <TableSkeletonLoader v-if="loading" />
        <TableLayoutComponent v-else
          :columns="columns"
          :rows="rows"
          :status-counter="statusCounter"
          :pageLable="$t('rfq_form.operations')"
          :allFields="opHeader"
          :slotTDcolName = "slotTDcolName" 
          @getUpdatedData="getUpdatedData"
        >
          <template #columnAction="{row}">
            <span v-if="row.additional_data == 0" class="mx-2">
              <button @click="openModal(); row_id = row.id;" class="cursor-pointer indigo_badge">
                <font-awesome-icon :icon="['far', 'pen-to-square']"/>
              </button>
            </span>
          </template>
       
          <template #actions="{ row }" v-if="itemStatus == 0 || itemStatus==1"
            >
            <td >
              <button
                :title="'edit'"
                :loading="loading"
                class="btn color-primary"
                @click="openModalForUpdate(row.name ,row.status, row.id, row.form_quantity)">
                <font-awesome-icon :icon="['fas', 'edit']" /> 
              </button>
              <button
                :title="'edit'"
                :loading="loading"
                class="btn red_badge"
                @click="deleteItem( row.id)">
                <font-awesome-icon :icon="['fas', 'trash']" /> 
              </button>
              <!-- <ButtonComponent
                :title="status(row.additional_data + 2, false)"
                :loading="loading"
                class="btn color-primary"
                @click="updateItemDetails({ status: row.additional_data + 1 }, row.id) ">
              </ButtonComponent> -->
            </td ></template>
        </TableLayoutComponent>
      </div>
      <section v-if="receives_rows.length>0">
        <TableLayoutComponent
          ref="tableContent"
          id="table"
          :columns="receives_columns"
          :rows="receives_rows"
          :pageLable="$t('rfq_form.receive_operations')"
          :slotTDcolName="slotTDcolName"
          @getUpdatedData="getUpdatedData"
        >
        <!-- @updateTableIds="updateTableIds" -->

          <template #columnAction="{ row }">
            <span v-if="row.additional_data == 0" class="mx-2">
              <button
                @click="
                  openModal();
                  row_id = row.id;
                  row_name = row.item_name
                "
                class="cursor-pointer indigo_badge"
              >
                <font-awesome-icon :icon="['far', 'pen-to-square']" />
              </button>
            </span>
          </template>
          <template #status="{ row }">
          <td>
            <div
              class="btn"
              :class="{
                indigo_badge: row.additional_data === 'Confirmed',
                yellow_badge: row.additional_data === 'Closed',
                green_badge: row.additional_data === 'Open',
              }"
            >
              {{ row.additional_data }}
            </div>
          </td>
        </template>

        <!-- <template #actions="{ row }">
          <td>
            <div class="btn color-primary">
              <router-link
                :to="{
                  name: 'receive-details',
                  params: { form_id: row.id, operation_id: operation_id_Receive }, // operation id
                }"
              >
                <font-awesome-icon :icon="['fas', 'list']" />
              </router-link>
            </div>
            <button class="btn color-primary" @click="generateBill(row.id)" v-if="PQS.in_operations.filter( (el)=> el.id == row.id )[0].bills.length == 0">
              Generate Bill
            </button>
          </td>
        </template> -->
        </TableLayoutComponent>

       
      </section>


      <ModalComponent :showModal="isModalOpen"
        ><FormPopUpLayoutComponent @closeModal="toggleModal" :title="item_name_for_edit">
          <!-- <h3 class="font-bold underline">{{}}</h3> -->
          <div  class="flex flex-col">
            <div class="input flex flex-col w-full py-2 mt-1">
              <InputLableLayoutComponent
                lableFor="name"
                :text="$t('Requested Quantity')"
              />
              <input
                type="number"
                id="name"
                v-model="new_quantity"
                class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
                :placeholder="$t('Enter Requested Quantity')"
              />
              <!-- <p v-if="errors.new_quantity" class="pt-2 text-xs text-red-500">
                {{ errors.new_quantity }}
              </p> -->
            </div>
            
            <ButtonComponent
              :loading="ButtonLoad"
              :title="$t('adjustment_item_form.form.button')"
              @click="submitForm"
              class="form_btn"
            />
          </div>
          <SuccessModalComponent
            @closeModal="toggleModal()"
            :text="$t('adjustment_item_form.form.success')"
          ></SuccessModalComponent>
        </FormPopUpLayoutComponent>
      </ModalComponent>
    </div>
  </template>
  <script setup lang="ts">
  // page
  import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
  import ButtonComponent from "@/components/Layouts/AppLayoutComponents/ButtonComponent.vue";
  import rfq_api from "@/services/rfq_api";
  import { computed, onMounted, ref } from "vue";
  import axios from "axios";
import env from "@/env";

  import { useRouter } from "vue-router";
  import { useRoute } from "vue-router";
  import { useI18n } from "vue-i18n";
  const route = useRoute();
  const router = useRouter();
  //form
  import { useModal } from "@/composables/useModal";
  import { useButtonLoad } from "@/composables/useButtonLoad";
  import { useResetValue } from "@/composables/useResetValue";
  import FormPopUpLayoutComponent from "@/components/Layouts/PopUpLayoutComponent/FormPopUpLayoutComponent.vue";
  import ModalComponent from "@/components/Layouts/AppLayoutComponents/ModalComponent.vue";
  import InputLableLayoutComponent from "@/components/Layouts/InputsFromLayoutCompoennts/InputLableLayoutComponent.vue";
  import { useSchemaValidation } from "@/composables/useValidationSchema";
  const { reset } = useResetValue();
  const { isModalOpen, openModal, closeModal, toggleModal } = useModal();
  const loading = ref<boolean>(true);
  const btnLoading = ref<boolean>(false);
  const { ButtonLoad, toggleButtonLoad } = useButtonLoad();
  const { getValidationSchema } = useSchemaValidation();
  
  const errors = ref<any>({});
  const row_id = ref<string>();
  const row_name = ref<string>();
    const activeLocationId = ref('') ;
  const operation_id_for_recive = ref('');

  const row_status = ref(null);
  const row_id_for_edit = ref(null);
  const new_quantity = ref('');
  const item_name_for_edit = ref('');
  const openModalForUpdate = (name ,status, row_id, quantity)=>{
    openModal()
    new_quantity.value = quantity
    item_name_for_edit.value = name ;
    row_status.value = status ;
    row_id_for_edit.value =  row_id;
  }


  const statusCounter = ref<any>();

  const formData = ref<any>({
    new_quantity: "",
    reason_of_change: "",
  });
  const submitForm = async () => {
    // const schema = getValidationSchema(formData.value, "adjustment_item_form");
    try {
    //   toggleButtonLoad();
    //   await schema.validate(formData.value, { abortEarly: false });
      try {

        const payload = {
            form_id :  +route.params.form_id ,
            form_quantity : new_quantity.value

        }
        await rfq_api.updateItemDetails(payload , row_id_for_edit.value  );
        reset(formData.value);
        closeModal();
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
        getRFQDetails()
        }
  };
  
  
  //table
  import TableSkeletonLoader from "@/components/Layouts/TablesLayoutComponents/TableLoadersComponents/TableSkeletonLoader.vue";
  import TableLayoutComponent from "@/components/Layouts/TablesLayoutComponents/TableLayoutComponent.vue";
  
  const rows = ref([]);
  const receives_rows = ref([])

  const opHeader = ref<any>();
  const slotTDcolName = 'form_quantity';
  
  const adjustments = ref<any>();
  const ActiveBtn = computed(() => {
    return (
      Array.isArray(adjustments.value) &&
      adjustments.value.some((el) => el.status === 0)
    );
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
    { text: t('rfq_form.title'), route: `RFQ` },
    { text: t('finish-level.table.details'), route: "" },
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

  const columns = [
    t('Item') ,
    t('rfq_form.items.item_sku_code') ,
    t('rfq_form.items.material'),
    t('rfq_form.items.shape'),
    t('rfq_form.items.color'),
    t('rfq_form.items.origin'),
    // t('Current Quantity'),
    t('Requested Quantity'),
  
    // "status",
    t('table.actions') 
  ]; 
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
import store from "@/Middelware/store";
  const getRFQDetails = async () => {
    loading.value = true;
    try {
      const response = await rfq_api.getRfqWithItems(
        +route.params.form_id
      );
  
      adjustments.value =  response;;

      rows.value = adjustments.value.form_details.map((opItem: any) => ({
        id: opItem.id,
        name : opItem.item.item_name,
        item_sku_code : opItem.item.item_sku_code,
        material : opItem.item?.material?.material_nicknames ,
        shape : opItem.item?.shape?.shape_name ,
        color : opItem.item?.color?.color_name ,
        origin : opItem.item?.origin?.origin_name ,
        // quantity_before_operation : opItem.quantity_before_operation,
        form_quantity : opItem.form_quantity +" "+opItem.item?.uom?.uom,
       

        additional_data:
        opItem.status === 0
          ? "Open"
          : opItem.status === 1
          ? "Closed"
          : opItem.status === 2
          ? "Confirmed" :
          opItem.status === 3
          ? "Confirmed" :
          opItem.status === 4
          ? "waiting for receive"
          : "",
      }));
      itemStatus.value = response.status ;
      localStorage.setItem('rfq-form-label', response.form_label)


      receives_rows.value = adjustments.value.in_operations.map((receive: any) =>({
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

    receives_rows.value = receives_rows.value.filter( (el)=> el.additional_data == "Confirmed"  )

    // console.log(adjustments.value.in_operations , 'adjustments.value.in_operations')
    //   ----------------------------------------
      opHeader.value = [
        
        { label: t('Form Label'), value: response.form_label || "" },
        { label: t('release_form.table.destination_location'), value: response.to_location?.location_name || "" },
        { label: t('rfq_form.form.doc_number'), value: response.doc_number || "" },
        { label: t('date'), value: response.form_datetime || "" },
  
        { label: t('created_at'),  value:`${t('At')} : ` +response.created_at.slice(0,16)+`, ${t('By')} : ` +response.user?.name },
  // Conditionally add the "Quoted" item only if status is 4
  ...(response.status === 4
    ? [
        {
          label: t('Quoted'),
          value: `At : ${response.quoted_at.slice(0, 16)}, By : ${response?.quoted_by?.name}` || "",
        },
      ]
    : []),  
        {
          label: t('categories.table.status'),
          value:
            response.status === 2
              ? t('status.confirm')
              : response.status === 1
              ? t('status.close') :
              response.status === 3 ?
              t('status.confirm'):
              response.status === 4 ?
              t('status.Waiting For Receive')
              : t('status.open'),
        },
        { label: "Stu", value: response.status },
      ];
    //   ----------------------------------------

    statusCounter.value = [
      {
        label: t("operation_details.header.total_items"),
        value: rows.value.length,
      },
     
    ];
      
    } catch (er) {
      throw er;
    } finally {
      loading.value = false;
    }
  };
  // get active operatio_id for receive 
  const getLocationOperation = async () => {
  try {
    const response = await axios.get(env.DOMAIN + "inv-apis/settings/loc-operations", {
      params: {
        location_id: +activeLocationId.value,

        operation_type: "IN",
      },
    });
  
    operation_id_for_recive.value = response.data.data[0].id ;
  } catch (er) {
    
    throw er;
  }
};

  // delete item before confirm 
  const deleteItem = async (id)=>{
    try{
      await rfq_api.deleteOperation(id);
    }catch(err){
      console.error(err);
    }finally{
      getRFQDetails()
    }
  }

  // receive order 
  const ReciptOrder = async ()=>{
    const payload = {
      operation_id : operation_id_for_recive.value ,
      source_form_id : +route.params.form_id
    }
    try{
    const response =   await rfq_api.receiveOrder(payload);

    // navigate to new recive order details 
    const form_id = response.id ;
    const operation_id = response.operation_id ;

    router.push({
      name: "receive-details",
      params: {
        form_id: form_id,
        operation_id:operation_id,
      },
    });

    }catch(err){
      console.error(err);
    }finally{
      getRFQDetails()
    }
  }

  const getUpdatedData = ()=>{
    getRFQDetails();
  }
  // const changeHeaderStatus = async (status: number) => {
  //   btnLoading.value = true;
  //   const payload = {
  //     form_id: +route.params.form_id,
  //     operation_id: +route.params.operation_id,
  //   };
  
  //   getRFQDetails();
  // };


//   const updateItemDetails = async (
//     params: Record<string, any>,
//     row_id: string
//   ) => {

//     const payload = {
//         form_id :  +route.params.form_id,
//         form_quantity : new_quantity.value,
        
//     }
    
//     // getRFQDetails();
//   };
  
  onMounted(async () => {
    getRFQDetails();
    
    activeLocationId.value = store.getters["location_module/LocationId"];
    setTimeout(() => {
      getLocationOperation()
    }, 100);

  });
  </script>
  