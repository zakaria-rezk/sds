<template>
  <div class="mx-12">
    <div>
      <div class="flex justify-between items-center">
        <BreadCrumpsComponent :BreadCrumps="breadCrumps" />
        <div v-if="itemStatus != 2">
          <button class="btn-primary btn" @click="openBillType">
            {{ $t("Choose Bill Type") }}
          </button>
        </div>
      </div>

        <TableSkeletonLoader v-if="loading" />
        <TableLayoutComponent
          :rows="rows"
          :columns="columns"
          :all-fields="opHeader"
          :pageLable="$t('Bill Details Operations')"
          @getUpdatedData="getBill()"
        >
          <template #columnAction="{ row }">
            <span  class="p-1">
              <button
                @click="updateQuantity(row.id, row.item_price)"
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
                  indigo_badge: row.additional_data === 2,
                  yellow_badge: row.additional_data === 1,
                  green_badge: row.additional_data === 0,
                }"
              >
                {{ status(row.additional_data, true) }}
              </div>
            </td>
          </template>
         
        </TableLayoutComponent>

       <section class="flex justify-end items-end">
         
          <section class="flex flex-col  justify-end items-end w-1/2"> 
              <div class="flex  mb-1 w-1/2" >
                <h5 class="rounded-span">{{ $t('Price') }} :</h5>
                <h5 class="rounded-output">{{ invoice?.total_price }} EGP</h5>
              </div>
            
              <div class="flex  mb-1 w-1/2" >
                <h5 class="rounded-span">{{ $t('Tax Value') }} :</h5>
                <h5 class="rounded-output">{{   (invoice?.total_price * invoice?.tax_value ) / 100 }}  EGP</h5>
              </div>
              <div class="flex  mb-1 w-1/2" >
                <h5 class="rounded-span">{{ $t('Total Price') }} :</h5>
                <h5 class="rounded-output"> {{ invoice?.total_price +  (invoice?.total_price * invoice?.tax_value ) / 100  }}  EGP</h5>
              </div>
          </section>
          <section class="flex flex-col justify-end items-end  w-1/2"> 
            
            <div class="flex  mb-1 w-1/2" >
              <h5 class="rounded-span">{{ $t('Total Paid') }} :</h5>
              <h5 class="rounded-output">{{ invoice?.total_paid_amount }} EGP</h5>
            </div>
            
            <div class="flex  mb-1 w-1/2" >
              <h5 class="rounded-span">{{ $t('Total Remaining') }} :</h5>
              <h5 class="rounded-output">{{invoice?.total_price +  (invoice?.total_price * invoice?.tax_value ) / 100 -  invoice?.total_paid_amount }} EGP</h5>
            </div>
            
        </section>
        
       </section>

      </div>

      <!-- operation for payment and custdies  -->
      <section v-if="itemStatus==2" class="mb-10">
        <!-- tabs  -->
        <section class="flex justify-between items-center">
          <button class=" p-3 w-1/2 flex justify-center" :class="activeButton === 'Bills' ? 'indigo_badge' : 'gray_badge'" @click="setActive('Bills')"  >
            {{ $t('payment History') }}
          </button>
          <button class=" p-3 w-1/2  flex justify-center" :class="activeButton === 'Custody' ? 'indigo_badge' : 'gray_badge'" @click="setActive('Custody')">
            {{  $t('Settlements')  }}
          </button>
        
          
        </section>

      <!-- payment history  -->
      <section v-if="activeButton == 'Bills'">
        <button
          class="btn color-primary"
          v-if="!isPaidEqualTotal"
          @click="openModal"
        >
          Add Payment
        </button>
        <TableLayoutComponent
          v-if="payment_rows.length > 0"
          :rows="payment_rows"
          :columns="payment_columns"
          :pageLable="$t('Payment History')"
          @getUpdatedData="getBill()"
        >
          <template #columnAction="{ row }">
            <span class="p-1">
              <button
                @click="updateQuantity(row.id, row.item_price)"
                class="cursor-pointer btn text-color-light color-light"
              >
                <font-awesome-icon icon="fa-solid fa-pencil" />
              </button>
            </span>
          </template>

          <template #actions="{ row, index }">
            <td
              v-if="
                row.payment_type == 'custody_cash' &&
                invoice.payment_history[index].has_custody_settlement == false
              "
            >
              <!-- {{   rows.findIndex( el => el.id == row.id )  }} -->
              <button
                :title="'edit'"
                :loading="loading"
                class="btn color-primary"
                @click="settlement(row.id)"
              >
                {{ $t("settlement") }}
              </button>
            </td></template
          >
        </TableLayoutComponent>
      </section>

      <!-- custodies  -->
      <section>
        <TableLayoutComponent
          v-if="custodies_rows.length > 0 && activeButton == 'Custody'"
          :rows="custodies_rows"
          :columns="custodies_columns"
          :pageLable="$t('Custodys Operations')"
          @getUpdatedData="getBill()"
        >
          <template #status="{ row }">
            <td>
              <div
                class="btn"
                :class="{
                  indigo_badge: row.additional_data === $t('status.confirm'),
                  yellow_badge: row.additional_data === $t('status.close'),
                  green_badge: row.additional_data === $t('status.open'),
                }"
              >
                {{ row.additional_data }}
              </div>
            </td>
          </template>
        </TableLayoutComponent>
      </section>
    </section>

    <!-- Add Payment History  -->
    <ModalComponent :showModal="isModalOpen"
      ><FormPopUpLayoutComponent
        @closeModal="toggleModal"
        v-click-outside="toggleModal"
        title="Add Payment"
      >
        <div class="flex flex-col">
          <div class="input flex flex-col w-full py-2 mt-1">
            <InputLableLayoutComponent
              lableFor="payment_paid"
              text="Paid Amount"
            />
            <input
              type="number"
              id="payment_paid"
              placeholder="please enter Paid Amount"
              v-model="paid"
              class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
            />
            <div class="text-red-900" v-if="isPaidEqualTotal">
              total paid amount should be less than or equal total price
            </div>
          </div>

          <div class="input flex flex-col w-full py-2 mt-1">
            <InputLableLayoutComponent
              lableFor="payment_type"
              text="Payment Type"
            />
            <select v-model="payment_history_type" class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2" name="" id="payment_type">
              <option
                v-for="(type, index) in types"
                :value="type.id"
                :key="index"
              >
                {{ type.name }}
              </option>
            </select>
          </div>

          <!-- bank transfer  -->
          <section v-if="payment_history_type == 2">
            <div class="input flex flex-col w-full py-2 mt-1">
              <InputLableLayoutComponent
                lableFor="bank_acount"
                text="Bank Account"
              />
              <input
                type="text"
                id="bank_acount"
                placeholder="please enter bank account"
                v-model="bank_account"
                class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
              />
            </div>
            <div class="input flex flex-col w-full py-2 mt-1">
              <InputLableLayoutComponent
                lableFor="bank_name"
                text="Bank Name"
              />
              <input
                type="text"
                id="bank_name"
                placeholder="please enter Bank Name"
                v-model="bank_name"
                class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
              />
            </div>
          </section>

            <!-- cheque  -->
            <section v-if="payment_history_type==4">
              <div class="input flex flex-col w-full py-2 mt-1">
                <InputLableLayoutComponent
                  lableFor="cheque_transaction_number"
                  text="Cheque transaction number"
                />
                <select v-model="cheque_transaction_number" class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2" name="" id="cheque_transaction_number">
                  <option v-for="(type, index) in cheques_unrelated" :value="type" :key="index"> {{ type.cheque_number }} </option>
                </select>
              </div>
              <div class="input flex flex-col w-full py-2 mt-1">
                <InputLableLayoutComponent
                  lableFor="bank_acount"
                  text="Bank Account"
                />
                <input
                  type="text"
                  id="bank_acount"
                  placeholder="please enter bank account"
                  v-model="bank_account"
                
                  class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
                />
              </div>
              <div class="input flex flex-col w-full py-2 mt-1">
                <InputLableLayoutComponent
                  lableFor="bank_name"
                  text="Bank Name"
                />
                <input
                  type="text"
                  id="bank_name"
                  placeholder="please enter Bank Name"
                  v-model="bank_name"
                
                  class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
                />
              </div>
            </section>
            <ButtonComponent
              :loading="ButtonLoad"
              :disabled="isPaidEqualTotal"
              title="Add Payment"
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


    <!-- bill type  -->
    <ModalComponent :showModal="isModalEditOpen"
      ><FormPopUpLayoutComponent
        @closeModal="isModalEditOpen = false"
        :title="$t('Edit Bill Type')"
      >
        <div class="flex flex-col">
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
              <option disabled selected :value="formData.category_name">
                {{ formData.category_name }}
              </option>
              <option
                :value="item.cat_name"
                v-for="(item, index) in categories"
                :key="index"
              >
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

          <div class="input flex flex-col w-full py-2 mt-1">
            <InputLableLayoutComponent
              lableFor="payment_type"
              :text="$t('rfq_form.form.payment_type')"
            />
            <select
              id="payment_type"
              class="py-2 rounded-md border-2 bg-gray-100 text-gray-500 px-2"
              v-model="formData.payment_type"
            >
              <option disabled selected :value="null"></option>
              <option
                :value="item.value"
                v-for="(item, index) in payment_types"
                :key="index"
              >
                {{ item.label }}
              </option>
            </select>
          </div>

          <div class="input flex flex-col w-full py-2 mt-1">
            <InputLableLayoutComponent
              lableFor="payment_method"
              :text="$t('rfq_form.form.payment_method')"
            />

            <select
              id="payment_method"
              class="py-2 rounded-md border-2 bg-gray-100 text-gray-500 px-2"
              v-model="formData.payment_method"
            >
              <option disabled selected :value="null"></option>
              <option
                :value="item.value"
                v-for="(item, index) in payment_methods"
                :key="index"
              >
                {{ item.label }}
              </option>
            </select>
          </div>

          <div class="input flex flex-col w-full py-2 mt-1">
            <InputLableLayoutComponent
              lableFor="Bill-Type"
              :text="$t('Bill Type')"
            />
            <select
              id="Bill-Type"
              class="py-2 rounded-md border-2 bg-gray-100 text-gray-500 px-2"
              v-model="formData.bill_type"
            >
              <option value="invoice">
                {{ $t("Invoice") }}
              </option>
              <option value="tax_invoice">
                {{ $t("Tax Invoice") }}
              </option>
            </select>
          </div>
          <div
            class="input flex flex-col w-full py-2 mt-1"
            v-if="formData.bill_type == 'tax_invoice'"
          >
            <InputLableLayoutComponent
              lableFor="tax-value"
              :text="$t('Tax Value')"
            />
            <input
              type="number"
              id="tax-value"
              class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
              :placeholder="$t('rfq_form.form.tax_value')"
              v-model="formData.tax_value"
            />
          </div>

          <ButtonComponent
            :loading="ButtonLoad"
            :title="$t('adjustment_item_form.form.button')"
            class="form_btn"
            @click="submitFormEdit"
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
//GLOBAL IMPORTS
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { defineAsyncComponent, shallowRef } from "vue";
import axios from "axios";
import env from "@/env";
import ButtonComponent from "@/components/Layouts/AppLayoutComponents/ButtonComponent.vue";
//GLOBAL DATA
const { t, messages, locale } = useI18n();
const route = useRoute();
const router = useRouter();
//TABEL
//TABLE COMPOSABLES
import { useModal } from "@/composables/useModal";
const { isModalOpen, openModal, closeModal, toggleModal } = useModal();
import store from "@/Middelware/store";
import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
import TableSkeletonLoader from "@/components/Layouts/TablesLayoutComponents/TableLoadersComponents/TableSkeletonLoader.vue";
import TableLayoutComponent from "@/components/Layouts/TablesLayoutComponents/TableLayoutComponent.vue";

import bill_api from "@/services/bill_api";
import rfq_api from "@/services/rfq_api";

  //TABLE DATA
  const breadCrumps = ref([{ text: t('Bills'), route: "BILL" },{ text: t('BILL-Details'), route: "" }]);
  const loading = ref<boolean>(true);
  // const slotTDcolName = "item_price";
  const activeButton = ref('Bills')
  const setActive = (button )=>{
    activeButton.value = button 
  }

  const paid = ref(null)
  const payment_history_type = ref(null)
  const bank_account = ref('')
  const bank_name = ref('')
  const cheque_transaction_number = ref(null);
  watch( cheque_transaction_number , ()=>{
    console.log(cheque_transaction_number.value) ;
    paid.value = cheque_transaction_number.value.amount ;
    bank_account.value = cheque_transaction_number.value.bank_account ;
    bank_name.value = cheque_transaction_number.value.bank_name ;
  } )
  const isPaidEqualTotal = ref(false) ;

const form_quantity = ref(null);
const row_id_for_edit = ref(null);
const itemStatus = ref(null);
const statuslevel = computed(() => {
  return itemStatus.value;
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
// const openModalForUpdate = (discount ,quantity:any, id)=>{

//   openModal()
//   form_quantity.value = quantity ;
//   item_discount.value = discount
//   row_id_for_edit.value =  id;
// }
const isModalEditOpen = ref(false);
const openBillType = () => {
  isModalEditOpen.value = true;
};

const rows = shallowRef<[]>();
const payment_rows = ref([]);
const custodies_rows = ref([]);
const opHeader = ref<any>();

const columns = ref([
  t("rfq_form.items.item_name"),
  t("rfq_form.items.item_sku_code"),
  t("rfq_form.items.material"),
  t("rfq_form.items.shape"),
  t("rfq_form.items.color"),
  t("rfq_form.items.origin"),

  t("table.actual_quantity"),
  t("table.quantity"),
  // "Quantity After",
  t("Total Price"),
  t("confirmed_price"),
  t("Item Discount"),
  t("release_form.table.status"),
  // itemStatus.value == 0 || itemStatus.value==1 ? t("release_form.table.actions") : '',
]);
const payment_columns = computed(() => [
  t("vendor"),
  t("Bank Name"),
  t("Bank Account"),
  t("Cheque Transfer Number"),
  t("Total paid"),
  t("Payment Type"),
  t("operation_details.header.created_at"),
  t("release_form.table.actions"),
]);
const custodies_columns = computed(() => [
  t("adjustment_form.table.form_lable"),
  // t("Form Code"),
  t("Type"),
  t("Amount"),
  t("Description"),
  t("created_at"),
  t("Custody Recipient"),
  t("release_form.table.status"),
]);
const invoice = ref(null);
const vendor_id = ref(null);
// get bills
const getBill = async () => {
  loading.value = true;
  try {
    const response = await bill_api.getBillWithItems(+route.params.form_id);

    invoice.value = response;

    rows.value = response.form_details.map((item: any) => ({
      id: item.id,
      item_name: item.item?.item_name,
      item_sku_code: item.item?.item_sku_code,
      material: item.item?.material?.material_nicknames,
      shape: item.item?.shape?.shape_name,
      color: item.item?.color?.color_name,
      origin: item.item?.origin?.origin_name,
      quantity_before: item.quantity_before_operation,
      form_quantity: item.form_quantity,
      item_price: item.item_price,
      confirmed_price: item.confirmed_price,
      item_discount: item.item_discount,
      additional_data: item.status,
    }));
    payment_rows.value = response.payment_history.map((item: any) => ({
      id: item.id,
      vendor: item.vendor?.name,
      bank_name: item.bank_name,
      bank_account: item.bank_account,
      cheque_transfer_number: item.cheque_transfer_number,
      paid: item.paid,
      payment_type: item.payment_type?.name,
      created_at: item.created_at,
    }));

    custodies_rows.value = response.custodies.map((custody: any) => ({
      id: custody.id,
      form_lable: custody.form_label,
      // form_code: custody.form_code,
      type: custody.type,
      amount: custody.amount,
      description: custody.description,
      created_by: [
        { text: custody.created_by?.name },
        { text: custody.created_at.slice(0, 18) },
      ],
      custody_recipient: [
        { text: custody.created_by?.name },
        { text: custody.created_at.slice(0, 18) },
      ],
      // form_datetime: custody.form_datetime,
      // created_by: [{ text: custody.user.name }, { text: custody.created_at }],

      // confirmed_at: [
      //   { text: custody.confirmed_by?.name },
      //   { text: custody.confirmed_at },
      // ],
      additional_data:
        custody.status === 2
          ? t("status.confirm")
          : response.status === 1
          ? t("status.close")
          : t("status.open"),
    }));

    opHeader.value = [
      // { label: "From Location", value: response.from_location?.location_name || "" },
      { label: t("Form Label"), value: response.form_label || "" },
      {
        label: t("table.source_location"),
        value: response.from_location?.location_name || "",
      },
      { label: t("Total Price"), value: response.total_price },
      { label: t("total_paid_amount"), value: response.total_paid_amount },
      {
        label: t("Bill Type"),
        value: response.bill_type == "tax_invoice" ? "Tax Invoice" : "Invoice",
      },
      ...(response.tax_value !== null
        ? [{ label: t("Tax Value"), value: response.tax_value }]
        : []),

      {
        label: t("operation_details.header.created_at"),
        value: response.created_at.slice(0, 14) + " - " + response.user.name,
      },
      {
        label: t("status.confirm"),
        value: response.confirmed_at,
      },
      // { label: "Created by:", value: response.form.user.name || "" },

      {
        label: t("Status"),
        value:
          response.status === 2
            ? t("status.confirm")
            : response.status === 1
            ? t("status.close")
            : t("status.open"),
      },
      { label: "Stu", value: response.status },
    ];
    itemStatus.value = response.status;
    vendor_id.value = response.vendor_id;
  } catch (er) {
    throw er;
  } finally {
    loading.value = false;
  }
};

// get cheques unrelated
const cheques_unrelated = ref([]);
const getCheques_unrelated = async () => {
  try {
    const response = await bill_api.getChequesUnrelated(vendor_id.value);
    cheques_unrelated.value = response;
  } catch (err) {
    console.error(err);
  }
};

// watch for paid amount and total price
watch(paid, () => {
  const totalPaid = invoice.value.payment_history.reduce(
    (acc, item) => acc + item.paid,
    0
  );
  const totalPrice =
    invoice?.value.total_price +
    (invoice?.value.total_price * invoice?.value.tax_value) / 100;
  if (totalPaid + paid.value > totalPrice) {
    isPaidEqualTotal.value = true;
  } else {
    isPaidEqualTotal.value = false;
  }
});

const types = ref(null);
// get payment types
const getPaymentTypes = async () => {
  try {
    const response = await bill_api.PaymentTypes();
    types.value = response;
  } catch (error) {
    console.error(error);
  }
};
//UPDATE SPECIFIC ITEM QUANTITY
const updateQuantity = (curr_row_id: number, item_quantity: string) => {
  intialQuantityValue.value = item_quantity;
  row_id.value = curr_row_id;
  openModal();
};

const activeLocationId = ref("");
const operation_id_Custody = ref(4);

// get active operatio_id for Custody
const getLocationOperation = async () => {
  try {
    const response = await axios.get(
      env.DOMAIN + "inv-apis/settings/loc-operations",
      {
        params: {
          location_id: +activeLocationId.value,

          operation_type: "CUSTODY",
        },
      }
    );

    operation_id_Custody.value = response.data.data[0].id;
  } catch (er) {
    throw er;
  }
};

//DELETE SPECIFIC ITEM
const settlement = async (source_payment_id: any) => {
  const response = await bill_api.settlement(
    source_payment_id,
    operation_id_Custody.value
  );
  activeButton.value = "Custody";

    getBill();
  };
 
  //FORM
  //FORM IMPORTS
  const ModalComponent = defineAsyncComponent(
    () => import("@/components/Layouts/AppLayoutComponents/ModalComponent.vue")
  );
  const FormPopUpLayoutComponent = defineAsyncComponent(
    () =>
      import(
        "@/components/Layouts/PopUpLayoutComponent/FormPopUpLayoutComponent.vue"
      )
  );
  
  //FOMR COMPSABLES
  import { useButtonLoad } from "@/composables/useButtonLoad";
  import { useResetValue } from "@/composables/useResetValue";
  
  import InputLableLayoutComponent from "@/components/Layouts/InputsFromLayoutCompoennts/InputLableLayoutComponent.vue";
  import { useSchemaValidation } from "@/composables/useValidationSchema";
  const { reset } = useResetValue();
  
  const { ButtonLoad, toggleButtonLoad } = useButtonLoad();
  const { getValidationSchema } = useSchemaValidation();
  //FORM DATA
  const errors = ref<any>({});
  const row_id = ref<number>();
  const intialQuantityValue = ref<string>(); // INTIAL VALUE OF THE SLECTED ITEM THAT I WANT TO UPDATE
  const formData = ref<any>({
    bill_type: "tax_invoice",
    tax_value : 14,
    form_datetime: "",
    doc_number: "",
    work_order_line_num: "",
    category_name : "",
    payment_type : null,
    payment_method : null

  });
  //FORM METHODS
  // add new payment history 
  const submitForm = async () => {
    toggleButtonLoad()
    try {
      const payload = {
        // vendor_id: invoice.value.vendor_id,
        bill_id : +route.params.form_id ,
        paid : paid.value ,
        payment_type_id : payment_history_type.value ,
        cheque_transaction_number : cheque_transaction_number.value.cheque_number,
        cheque_id : cheque_transaction_number.value.id,
        bank_account : bank_account.value ,
        bank_name : bank_name.value
      };
  
      await bill_api.addPayment(payload);
      getBill();
      closeModal();
      paid.value = null ;
      payment_history_type.value = '' ;
      cheque_transaction_number.value = '' ;
      bank_account.value = '' ;
      bank_name.value = '' ;
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



const submitFormEdit = async () => {
  try {
    toggleButtonLoad();
    await editBill(formData.value);
    reset(formData.value);
    isModalEditOpen.value = false;
  } catch (error) {
    if (error.inner) {
      error.inner.forEach((validationError: any) => {
        errors.value[validationError.path] = validationError.message;
      });
    }
  } finally {
    toggleButtonLoad();
    // closeModal();
  }
};
const editBill = async (payload) => {
  loading.value = false;
  try {
    await bill_api.editBill(payload, +route.params.form_id);
    getBill();
  } catch (er) {
    throw er;
  }
};

// const row_id = ref('');
const openEditBill = (row) => {
  row_id.value = row.id;
  formData.value.form_datetime = row.form_datetime;
  formData.value.work_order_line_num = row.work_order_line_num;
  formData.value.doc_number = row.doc_number;
  formData.value.category_name = row.category_name;

  for (let i = 0; i < payment_methods.value.length; i++) {
    if (payment_methods.value[i].label == row.payment_method) {
      formData.value.payment_method = payment_methods.value[i].value;
      break;
    }
  }
  for (let i = 0; i < payment_types.value.length; i++) {
    if (payment_types.value[i].label == row.payment_type) {
      formData.value.payment_type = payment_types.value[i].value;
      break;
    }
  }

  openModal();
};
const categories = ref<any>();
const getCategories = async () => {
  const response = await rfq_api.getCategoies();
  categories.value = response;
};

const payment_methods = ref([
  {
    label: "Cash",
    value: "cash",
  },
  {
    label: "Bank Transfer",
    value: "bank_transfer",
  },
  {
    label: "Cheque",
    value: "cheque",
  },
  {
    label: "Notes Payable",
    value: "notes_payable",
  },
]);

const payment_types = ref([
  {
    label: "Cash",
    value: "cash",
  },
  {
    label: "Postpaid",
    value: "postpaid",
  },
]);

//LIFECYCLE HOOKS
onMounted(async () => {
  getPaymentTypes();
  getBill();
  getCategories();
  activeLocationId.value = store.getters["location_module/LocationId"];
  setTimeout(() => {
    getLocationOperation();
    getCheques_unrelated();
  }, 1000);
});
</script>
