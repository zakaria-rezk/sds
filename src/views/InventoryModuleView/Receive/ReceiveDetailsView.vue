<template>
  <div>
    <div>
      <BreadCrumpsComponent
        :BreadCrumps="breadCrumps"
        btn="Inbox"
        :disabled="false"
        @toggleModalEmit="navigator"
      />

      <button
        class="btn color-primary"
        @click="generateBill()"
        v-if="
          bills_rows.length == 0 &&
          itemStatus == 2 &&
          isBillAvilable &&
          source_operation_type == 'RFQ'
        "
      >
        Generate Bill
      </button>

      <TableSkeletonLoader v-if="loading" />
      <TableLayoutComponent
        :rows="rows"
        :columns="columns"
        :all-fields="opHeader"
        :status-counter="statusCounter"
        :slot-t-dcol-name="slotTDcolName"
        :pageLable="$t('receive_form.BreadCrump')"
        @getUpdatedData="getReceive()"
      >
        <template #columnAction="{ row }">
          <span v-if="row.additional_data.status == 0" class="p-1">
            <button
              @click="updateQuantity(row.id, row.form_quantity)"
              class="cursor-pointer btn text-color-light color-light"
            >
              <font-awesome-icon icon="fa-solid fa-pencil" />
            </button>
          </span>
        </template>

        <template #status="{ row }">
          <td>
            <div
              class="btn"
              :class="{
                indigo_badge: row.additional_data.status === 2,
                yellow_badge: row.additional_data.status === 1,
                green_badge: row.additional_data.status === 0,
              }"
            >
              {{ status(row.additional_data.status, true) }}
            </div>
          </td>
        </template>
        <template #actions="{ row }">
          <td v-if="row.additional_data.status != 2">
            <!-- confirm -->
            <ButtonComponent
              class="btn color-primary"
              :icon="'fa-solid fa-check'"
              :loading="loading"
              @click="updateItemDetails({ status: 2 }, row.id)"
            >
            </ButtonComponent>
            <!-- reopen -->
            <ButtonComponent
              v-if="row.additional_data.status == 1"
              class="btn text-color-v-dark"
              :title="''"
              :icon="'fa-solid fa-lock-open'"
              :loading="loading"
              @click="updateItemDetails({ status: 0 }, row.id)"
            >
            </ButtonComponent>
            <!-- close -->
            <ButtonComponent
              v-if="row.additional_data.status != 1"
              class="btn text-color-v-dark"
              :icon="'fa-solid fa-lock'"
              :loading="loading"
              @click="updateItemDetails({ status: 1 }, row.id)"
            >
            </ButtonComponent>
            <!-- delete -->
            <ButtonComponent
              v-if="row.additional_data.status == 0"
              class="btn text-color-v-dark"
              :icon="'fa-solid fa-xmark'"
              :loading="loading"
              @click="deleteItem(row.id)"
            >
            </ButtonComponent>

            <button class="btn color-primary" @click="editItem(row)">
              <font-awesome-icon :icon="['fas', 'plus']" />
              <span class="mx-3">
                {{ $t("Add Batch") }}
              </span>
            </button>
          </td>
          <!-- <td v-if="row.item_batch==''">
             
            </td> -->
        </template>
      </TableLayoutComponent>
    </div>

    <section v-if="bills_rows.length > 0">
      <TableLayoutComponent
        id="table"
        :columns="bills_columns"
        :rows="bills_rows"
        pageLable="Bills Operations"
        :slotTDcolName="slotTDcolName"
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

        <template #actions="{ row }">
          <td>
            <div class="btn color-primary">
              <router-link
                :to="{
                  name: 'Bill-Operation-Details',
                  params: {
                    form_id: row.id,
                    operation_id: operation_id_for_Bill,
                  }, // operation id
                }"
              >
                <font-awesome-icon :icon="['fas', 'list']" />
              </router-link>
            </div>
          </td>
        </template>
      </TableLayoutComponent>
    </section>
    <!-- modal for edit quantity  -->
    <ModalComponent :showModal="isModalOpen"
      ><FormPopUpLayoutComponent
        @closeModal="toggleModal"
        v-click-outside="toggleModal"
      >
        <div class="flex flex-col">
          <div class="input flex flex-col w-full py-2 mt-1">
            <InputLableLayoutComponent
              lableFor="name"
              :text="$t('adjustment_item_form.form.I1.lable')"
            />
            <input
              type="number"
              id="name"
              :placeholder="intialQuantityValue"
              readonly
              class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
            />
          </div>
          <div class="input flex flex-col w-full py-2 mt-1">
            <InputLableLayoutComponent
              lableFor="name"
              :text="$t('adjustment_item_form.form.I2.lable')"
            />
            <input
              type="number"
              id="name"
              :placeholder="intialQuantityValue"
              v-model="formData.new_quantity"
              class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
            />
            <p v-if="errors.new_quantity" class="pt-2 text-xs text-red-500">
              {{ errors.new_quantity }}
            </p>
          </div>

          <ButtonComponent
            :loading="ButtonLoad"
            :title="$t('adjustment_item_form.form.button')"
            class="form_btn"
            @click="submitForm"
          />
        </div>
        <SuccessModalComponent
          @closeModal="toggleModal()"
          :text="$t('adjustment_item_form.form.success')"
        ></SuccessModalComponent>
      </FormPopUpLayoutComponent>
    </ModalComponent>

    <!-- modal for  choose batch  -->
    <ModalComponent :showModal="editItemOpen">
      <FormPopUpLayoutComponent
        style="width: 80% !important"
        @closeModal="editItemOpen = false"
        :title="$t('Select Batch')"
      >
        <div v-if="item_batches.length > 0" class="flex flex-col">
          <table class="batches-table flex flex-col rounded-border">
            <thead class="second-thead">
              <tr>
                <th style="display: none"></th>
                <th>{{ $t("adjustment_items.table.batch_num") }}</th>
                <th>{{ $t("adjustment_items.table.barcode") }}</th>
                <th>{{ $t("items.theader.h6") }}</th>
                <th>{{ $t("items.theader.h5") }}</th>
                <th>{{ $t("items.theader.h7") }}</th>
                <th>{{ $t("items.theader.h8") }}</th>
                <th>{{ $t("add_items_to_form.filter.finishing_level") }}</th>
                <th>{{ $t("adjustment_items.table.production_date") }}</th>
                <th>{{ $t("Expiration Date") }}</th>
                <th>{{ $t("operation_details.header.created_at") }}</th>
                <th>{{ $t("Actions") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in item_batches"
                :key="index"
                class="image-continer hover-tr flex w-full relative"
              >
                <td class="" style="display: none"></td>
                <td class="mb-0 name">{{ item.batch_num }}</td>
                <td class="mb-0 name">{{ item.barcode }}</td>
                <td class="mb-0 name">{{ item.length }}</td>
                <td class="mb-0 name">{{ item.width }}</td>
                <td class="mb-0 name">{{ item.thick_height }}</td>
                <td class="mb-0 name">{{ item.weight }}</td>
                <td class="mb-0 name">{{ item.finishing_level }}</td>
                <td class="mb-0 name">{{ item.production_date }}</td>
                <td class="mb-0 name">{{ item.exp_date }}</td>
                <td class="mb-0 name">{{ item.created_at?.slice(0, 10) }}</td>

                <!-- Delete Icon -->
                <td class="mb-0 name">
                  <button class="btn">
                    <input
                      type="radio"
                      name="item_id"
                      :value="item.id"
                      v-model="batch_id"
                    />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- <div class="empty" v-else> No Item Batches avilable , please add one </div> -->

        <div class="flex justify-center">
          <button
            class="form_btn w-1/4"
            @click="upladteItemToHaveItemBatch"
            v-if="batch_id"
          >
            {{ $t("Choose Batch") }}
          </button>
          <button class="form_btn mx-3 w-1/4" @click="newBatch">
            {{ $t("Add New Batch") }}
          </button>
        </div>
      </FormPopUpLayoutComponent>
    </ModalComponent>
    <!-- modal for  Add batch  -->
    <ModalComponent :showModal="AddItemBatch">
      <FormPopUpLayoutComponent
        @closeModal="AddItemBatch = false"
        :title="$t('Add New Batch')"
      >
        <div class="flex flex-col">
          <div class="input flex flex-col w-full py-2 mt-1">
            <InputLableLayoutComponent
              lableFor="batchNumber"
              :text="$t('adjustment_items.table.batch_num')"
            />
            <input
              type="text"
              id="batchNumber"
              :placeholder="$t('adjustment_items.table.batch_num')"
              v-model="batch_num"
              class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
            />
          </div>
          <div class="input flex flex-col w-full py-2 mt-1">
            <InputLableLayoutComponent
              lableFor="barCode"
              :text="$t('adjustment_items.table.barcode')"
            />
            <input
              type="text"
              id="barCode"
              :placeholder="$t('adjustment_items.table.barcode')"
              v-model="barcode"
              class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
            />
          </div>
          <!-- <div class="input flex flex-col w-full py-2 mt-1">
            <InputLableLayoutComponent lableFor="unitCost" :text="$t('adjustment_items.table.unit_cost') " />
            <input
              type="number"
              id="unitCost"
              :placeholder="$t('adjustment_items.table.unit_cost') "
              v-model="unit_cost"
              class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
            />
          </div>
          <div class="input flex flex-col w-full py-2 mt-1">
            <InputLableLayoutComponent lableFor="totalCost" :text="$t('adjustment_items.table.total_cost') " />
            <input
              type="number"
              id="totalCost"
              :placeholder="$t('adjustment_items.table.total_cost') "
              v-model="total_cost"
              class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
            />
          </div> -->
          <div class="input flex flex-col w-full py-2 mt-1">
            <InputLableLayoutComponent
              lableFor="production_date"
              :text="$t('adjustment_items.table.production_date')"
            />
            <input
              type="date"
              id="production_date"
              :placeholder="$t('adjustment_items.table.production_date')"
              v-model="production_date"
              class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
            />
          </div>
          <div class="input flex flex-col w-full py-2 mt-1">
            <InputLableLayoutComponent
              lableFor="expDate"
              :text="$t('Expiration Date')"
            />
            <input
              type="date"
              id="expDate"
              :placeholder="$t('Expiration Date')"
              v-model="exp_date"
              class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
            />
          </div>
          <ButtonComponent
            :loading="ButtonLoad"
            :title="$t('Add Item Batch')"
            class="form_btn"
            @click="AddNewItemBtach"
          />
        </div>
      </FormPopUpLayoutComponent>
    </ModalComponent>
  </div>
</template>
<script setup lang="ts">
const batch_num = ref(null);
const barcode = ref(null);
const unit_cost = ref(null);
const total_cost = ref(null);
const exp_date = ref(null);
const production_date = ref(null);
//GLOBAL IMPORTS
import { defineAsyncComponent, shallowRef } from "vue";
import { computed, onMounted, ref } from "vue";

import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import ButtonComponent from "@/components/Layouts/AppLayoutComponents/ButtonComponent.vue";
import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
import rfq_api from "@/services/rfq_api";
import axios from "axios";
import env from "@/env";

//GLOBAL DATA
const { t, messages, locale } = useI18n();

const route = useRoute();
const router = useRouter();

const breadCrumps = [
  {
    text: t("receive_form.BreadCrump"),
    route: "Receive",
    // params: { operation_id: route.params.operation_id },
  },
  { text: t("finish-level.table.details"), route: "" },
];
//TABLE
//TABLE IMPORTS
import TableSkeletonLoader from "@/components/Layouts/TablesLayoutComponents/TableLoadersComponents/TableSkeletonLoader.vue";
import TableLayoutComponent from "@/components/Layouts/TablesLayoutComponents/TableLayoutComponent.vue";
//TABLE COMPOSABLES

import { useModal } from "@/composables/useModal";
const operation_id_for_Bill = ref(0);
const activeLocationId = ref("");
const isBillAvilable = ref(false);
// get active operatio_id for Bill
// const getLocationOperationForBill = async () => {
//   try {
//     const response = await axios.get(
//       env.DOMAIN + "inv-apis/settings/loc-operations",
//       {
//         params: {
//           location_id: +activeLocationId.value,

//           operation_type: "BILL",
//         },
//       }
//     );

//     operation_id_for_Bill.value = response.data.data[0].id;
//   } catch (er) {
//     isBillAvilable.value = false;
//     throw er;
//   }
// };
// generate bill from receive
const generateBill = async () => {
  try {
    await rfq_api.generateBillFromReceive(
      +route.params.form_id,
      operation_id_for_Bill.value
    );
    getReceive();
  } catch (err) {
    console.error(err);
  }
};

//TABLE DATA
const loading = ref<boolean>(true);
interface RowItem {
  id: number;
  item_batch: string;
  barcode: string;
  production_date: string;
  exp_date: string;
  finshing_level: string;
  quantity_before: string;
  form_quantity: string;
  quantity_after: number;
  additional_data: number; // or the correct type of `item.status`
}
const rows = ref([]);
const bills_rows = shallowRef([]);

const slotTDcolName = "form_quantity";
const opHeader = shallowRef<any>();
const statusCounter = shallowRef<any>();
const itemStatus = ref(null);

const columns = [
  // t('Item Id'),
  t("rfq_form.items.item_name"),
  t("rfq_form.items.item_sku_code"),

  t("table.item_batch"),
  t("table.barcode"),
  t("table.date"),
  t("table.finish_level"),
  t("rfq_form.items.material"),
  t("rfq_form.items.origin"),
  t("rfq_form.items.shape"),
  t("table.quantity"),
  t("table.actual_quantity"),

  t("table.quantity_after"),
  t("table.status"),
  // t("table.action"),
  t("table.action"),
];
const bills_columns = [
  t("adjustment_form.table.form_lable"),
  t("Form Code"),
  // t("Type"),
  t("Total Price"),
  t("Total Paid"),
  t("Created At"),
  t("Status"),
  t("Action"),
];

// Add Item Batches

const editItemOpen = ref<boolean>(false);
const AddItemBatch = ref<boolean>(false);
const item_batches = ref([]);
const itemBatchId = ref(null);
const Item_id = ref(null);
const batch_id = ref(null);
const rowToEdit = ref(null);
const editItem = async (row) => {
  rowToEdit.value = row;
  editItemOpen.value = true;
  item_batches.value = [];
  row_id.value = row.id;
  Item_id.value = row.additional_data?.item_id;

  const response = await receive_api.getItemBatches(
    row.additional_data?.item_id
  );
  item_batches.value = response;
};
const newBatch = () => {
  editItemOpen.value = false;
  AddItemBatch.value = true;
};
//Add New Item Batch
const AddNewItemBtach = async () => {
  const payload = {
    item_id: Item_id.value,
    exp_date: exp_date.value,
    batch_num: batch_num.value,
    barcode: barcode.value,
    // unit_cost: unit_cost.value,
    // total_cost: total_cost.value,
    production_date: production_date.value,
  };
  try {
    await receive_api.addItemBatch(payload);
    AddItemBatch.value = false;
    setTimeout(() => {
      editItemOpen.value = true;
      editItem(rowToEdit.value);
    }, 100);
  } catch (err) {
    console.error(err);
  }
};
//update row to have item batches
const upladteItemToHaveItemBatch = async () => {
  const payload = {
    batch_id: batch_id.value,
  };
  try {
    await receive_api.updateItemDetails(payload, row_id.value);
    getReceive();
    editItemOpen.value = false;
  } catch (err) {
    console.error(err);
  }
};

//TABLE MEHTODS
//UPDATE ITEM QUANTITY
const updateQuantity = (curr_row_id: number, item_quantity: string) => {
  intialQuantityValue.value = item_quantity;
  row_id.value = curr_row_id;
  openModal();
};
//REFORMAT THE STATUS TEXT SO I IT IS BTN THE TEXT WILL BE {OPEN, CLOSE, CONFIRM} IT IT THE STATUS OF THE TALBE THE TEXT WILL BE {OPEN, status.CLOSED,CONFIRMED}
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

const navigator = () => {
  router.push({
    name: "ImportReceive",
    params: {
      operation_id: +route.params.operation_id,
      type: "import",
    },
  });
};
//DELETE SPECIFIC ITEM
const deleteItem = async (row_id: string) => {
  await receive_api.deleteItem(+row_id);
  getReceive();
};
//UPDATE WHOEL FORM STATUS
const updateItemDetails = async (
  params: Record<string, any>,
  row_id: string
) => {
  await receive_api.updateItemDetails(params, +row_id);
  getReceive();
};
const source_operation_type = ref(null);
const getReceive = async () => {
  loading.value = true;
  try {
    const response = await receive_api.getSpecificReceiveFormItem(
      +route.params.form_id
    );

    rows.value = response.form_details.map((item: any) => ({
      id: item.id,
      item_name: item.item?.item_name,
      item_sku_code: item.item?.item_sku_code,
      item_batch: item.item_batch_location_full_details?.batch_num || "",
      barcode: item.item_batch_location_full_details?.barcode || "",
      date: `${
        item.item_batch_location_full_details?.production_date
          ? t("operation_details.rows.production_date") +
            item.item_batch_location_full_details.production_date +
            "<br>"
          : ""
      }${
        item.item_batch_location_full_details?.exp_date
          ? t("operation_details.rows.experation_date") +
            item.item_batch_location_full_details.exp_date
          : ""
      }`,
      finshing_level:
        item.item_batch_location_full_details?.finishing_level_name || "",
      material_name: item.item_batch_location_full_details?.material_name || "",
      origin_name: item.item_batch_location_full_details?.origin_name || "",
      shape_name: item.item_batch_location_full_details?.shape_name || "",
      actual_quantity: `${
        item.item_batch_location_full_details?.quantity && item.uom?.uom
          ? item.item_batch_location_full_details.quantity + " " + item.uom.uom
          : ""
      }`,
      form_quantity: item.form_quantity + " " + item.uom,
      quantity_after: `${
        item.item_batch_location_full_details?.quantity != null &&
        item.form_quantity != null &&
        item.uom?.uom
          ? item.item_batch_location_full_details.quantity -
            item.form_quantity +
            " " +
            item.uom.uom
          : ""
      }`,
      additional_data: { status: item.status, item_id: item.item_id },
    }));
    // bills operations for this receive
    bills_rows.value = response.bills.map((bill: any) => ({
      id: bill.id,
      form_lable: bill.form_label,
      form_code: bill.form_code,
      // type: bill.type,
      total_price: bill.total_price,
      total_paid_amount: bill.total_paid_amount,
      // description: bill.description,
      created_at: bill.created_at,
      additional_data:
        bill.status === 0
          ? "Open"
          : bill.status === 1
          ? "Closed"
          : bill.status === 2
          ? "Confirmed"
          : bill.status === 3
          ? "Confirmed"
          : "",
    }));
    itemStatus.value = response.status;
    source_operation_type.value = response.source_operation_type;
    opHeader.value = [
      {
        label: t("Form Label"),
        value: response.form_label || "",
        form_id: response.source_form_id || "",
        operation_id: response.source_operation_id || "",
      },
      {
        label: t("table.destination_location"),
        value: response.source_form_label || "",
      },
      {
        label: t("operation_details.header.location"),
        value: response.from_location.location_name || "",
      },

      {
        label: t("operation_details.header.doc_num"),
        value: response.doc_number || "",
      },
      {
        label: t("operation_details.header.date_time"),
        value: response.form_datetime || "",
      },
      {
        label: t("operation_details.header.created_at"),
        value: response.created_at.slice(0, 16) + " - " + response.user.name,
      },
      {
        label: t("operation_details.header.confirm"),
        value:
          response.confirmed_at != null
            ? response.confirmed_by.name + " - " + response.confirmed_at
            : t("operation_details.header.not_confirmed_yet"),
      },
      {
        label: t("operation_details.header.status"),
        value:
          response.status === 2
            ? t("status.confirm")
            : response.status === 1
            ? t("status.close")
            : t("status.open"),
      },
      { label: "Stu", value: response.status },
    ];

    statusCounter.value = [
      {
        label: t("status.open"),
        value: rows.value.filter((item) => item.additional_data.status === 0)
          .length,
      },
      {
        label: t("status.close"),
        value: rows.value.filter((item) => item.additional_data.status === 1)
          .length,
      },
      {
        label: t("status.confirm"),
        value: rows.value.filter((item) => item.additional_data.status === 2)
          .length,
      },
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
// page

//FORM
//FORM IMPORTS
import receive_api from "@/services/receive_api";
import InputLableLayoutComponent from "@/components/Layouts/InputsFromLayoutCompoennts/InputLableLayoutComponent.vue";
// import store from "@/Middelware/store";
import { useStore } from "vuex";
const store = useStore();

const ModalComponent = defineAsyncComponent(
  () => import("@/components/Layouts/AppLayoutComponents/ModalComponent.vue")
);
const FormPopUpLayoutComponent = defineAsyncComponent(
  () =>
    import(
      "@/components/Layouts/PopUpLayoutComponent/FormPopUpLayoutComponent.vue"
    )
);

//FORM COMSPABLES
import { useButtonLoad } from "@/composables/useButtonLoad";
import { useResetValue } from "@/composables/useResetValue";
import { useSchemaValidation } from "@/composables/useValidationSchema";
const { reset } = useResetValue();
const { isModalOpen, openModal, closeModal, toggleModal } = useModal();
const { ButtonLoad, toggleButtonLoad } = useButtonLoad();
const { getValidationSchema } = useSchemaValidation();

//FORM DATA
const row_id = ref<number>();
const intialQuantityValue = ref<string>(); // INTIAL VALUE OF THE SLECTED ITEM THAT I WANT TO UPDATE
const errors = ref<any>({});
const formData = ref<any>({
  new_quantity: "",
});
//FOMR METHODS
const submitForm = async () => {
  const schema = getValidationSchema(formData.value, "adjustment_item_form");

  try {
    toggleButtonLoad();
    await schema.validate(formData.value, { abortEarly: false });
    const payload = {
      form_quantity: formData.value.new_quantity,
    };

    await receive_api.updateItemDetails(payload, row_id.value);
    reset(formData.value);
    closeModal();
    getReceive();
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

onMounted(async () => {
  getReceive();
  activeLocationId.value = store.getters["location_module/LocationId"];
  // setTimeout(() => {
  //   getLocationOperationForBill();
  // }, 100);
});
</script>

<style>
.batches-table th,
.batches-table td {
  width: 12.5%;
}
.batches-table td {
  display: flex;
  justify-content: start;
  align-items: center;
}
.empty {
  background-color: rgb(172, 127, 127);
  padding: 10px;
  text-align: center;
  color: #fff;
}
</style>
