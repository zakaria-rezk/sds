<template>
  <div>
    <div>
      <BreadCrumpsComponent
        :BreadCrumps="breadCrumps"
        :btn="$t('Add Items')"
        :disabled="ActiveBtn"
        @toggleModalEmit="navigateToAddItemsPage"
      />
      <TableSkeletonLoader v-if="loading" />
      <TableLayoutComponent
        :rows="rows"
        :columns="columns"
        :all-fields="opHeader"
        pageLable="Recive Operations"
        :slotTDcolName="slotTDcolName"
        @getUpdatedData="getRelease()"
      >
        <template #columnAction="{ row }">
          <span v-if="row.additional_data == 0" class="p-1">
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
                indigo_badge: row.additional_data === 2,
                yellow_badge: row.additional_data === 1,
                green_badge: row.additional_data === 0,
              }"
            >
              {{ status(row.additional_data, true) }}
            </div>
          </td>
        </template>
        <template #actions="{ row }">
          <td v-if="row.additional_data != 2">
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
              v-if="row.additional_data == 1"
              class="btn text-color-v-dark"
              :title="''"
              :icon="'fa-solid fa-lock-open'"
              :loading="loading"
              @click="updateItemDetails({ status: 0 }, row.id)"
            >
            </ButtonComponent>
            <!-- close -->
            <ButtonComponent
              v-if="row.additional_data != 1"
              class="btn text-color-v-dark"
              :icon="'fa-solid fa-lock'"
              :loading="loading"
              @click="updateItemDetails({ status: 1 }, row.id)"
            >
            </ButtonComponent>
            <!-- delete -->
            <ButtonComponent
              v-if="row.additional_data == 0"
              class="btn text-color-v-dark"
              :icon="'fa-solid fa-xmark'"
              :loading="loading"
            >
            <!-- @click="deleteItem(row.id)" -->

            </ButtonComponent></td
        ></template>
      </TableLayoutComponent>
    </div>
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
              :required="false"
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
              :required="false"
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
  </div>
</template>
<script setup lang="ts">
//GLOBAL IMPORTS
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { defineAsyncComponent, shallowRef } from "vue";
import ButtonComponent from "@/components/Layouts/AppLayoutComponents/ButtonComponent.vue";
//GLOBAL DATA
const { t, messages, locale } = useI18n();
const route = useRoute();
const router = useRouter();
//TABEL
//TABLE COMPOSABLES
import { useModal } from "@/composables/useModal";
const { isModalOpen, openModal, closeModal, toggleModal } = useModal();

import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
import TableSkeletonLoader from "@/components/Layouts/TablesLayoutComponents/TableLoadersComponents/TableSkeletonLoader.vue";
import TableLayoutComponent from "@/components/Layouts/TablesLayoutComponents/TableLayoutComponent.vue";

import rfq_api from "@/services/rfq_api";
//TABLE DATA
const breadCrumps = ref([
  { text: "Receive Operations", route: "Receive-Operation" },
]);
const loading = ref<boolean>(true);
const slotTDcolName = "form_quantity";

const rows = ref([]);
const opHeader = ref<any>();
const columns = [
  t('table.item_batch'),
  t('table.actual_quantity'),
  t('table.quantity'),
  t('table.quantity_after'),
  t('table.status'),
  t('Actions'),
];
const release = ref<any>();
const ActiveBtn = computed(() => {
  return (
    Array.isArray(release.value) && release.value.some((el) => el.status === 0)
  );
});
//TABLE METHODS
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

const navigateToAddItemsPage = () => {
  router.push({
    name: "add-release-item",
    params: {
      form_id: +route.params.form_id,
      operation_id: +route.params.operation_id,
    },
  });
};
const getRelease = async () => {
  loading.value = true;
  try {
    const response = await rfq_api.getReceivedWithItems(+route.params.form_id);

    release.value = response;

    rows.value = response.form_details.map((item: any) => ({
      id: item.id,
      item_batch: item.item_batch_location,
      quantity_before: item.quantity_before_operation,
      form_quantity: item.form_quantity + item.uom_id,
      quantity_after: item.quantity_before_operation - item.form_quantity,
      additional_data: item.status,
    }));

    opHeader.value = [
      { label: t('receive_form.form.I2.lable'), value: response.from_location.location_name || "" },
      { label: "Code", value: response.form_label || "" },
      { label: "Doc Num.", value: response.doc_number || "" },
      { label: "Date / Time", value: response.form_datetime || "" },

      {
        label: "Created AT",
        value: response.created_at + "" + response.user.name,
      },
      { label: "Created by:", value: response.user.name || "" },

      {
        label: "Status",
        value:
          response.status === 2
            ? "Confirmed"
            : response.status === 1
            ? "Closed"
            : "Open",
      },
      { label: "Stu", value: response.status },
    ];
  } catch (er) {
    throw er;
  } finally {
    loading.value = false;
  }
};
//UPDATE SPECIFIC ITEM QUANTITY
const updateQuantity = (curr_row_id: number, item_quantity: string) => {
  intialQuantityValue.value = item_quantity;
  row_id.value = curr_row_id;
  openModal();
};

//DELETE SPECIFIC ITEM
// const deleteItem = async (row_id: string) => {
//   await rfq_api.deleteItem(+row_id);
//   getRelease();
// };
//UPDATE WHOEL FORM STATUS
const updateItemDetails = async (
  params: Record<string, any>,
  row_id: string
) => {
  await rfq_api.updateItemDetails(params, +row_id);
  getRelease();
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
  new_quantity: null as number,
});
//FORM METHODS
const submitForm = async () => {
  const schema = getValidationSchema(formData.value, "adjustment_item_form");

  try {
    toggleButtonLoad();
    await schema.validate(formData.value, { abortEarly: false });
    const payload = {
      form_quantity: formData.value.new_quantity,
    };

    await rfq_api.updateItemDetails(payload, row_id.value);
    getRelease();
    reset(formData.value);
    closeModal();
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
//LIFECYCLE HOOKS
onMounted(async () => {
  getRelease();
});
</script>
