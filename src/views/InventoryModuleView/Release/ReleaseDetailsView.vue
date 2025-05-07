<template>
  <div>
    <div>
      <BreadCrumpsComponent
        :BreadCrumps="breadCrumps"
        :btn="release?.status != 2 ? $t('release_form.add_new_item') : null"
        :disabled="ActiveBtn"
        @toggleModalEmit="navigateToAddItemsPage"
      />
      <TableSkeletonLoader v-if="loading" />
      <TableLayoutComponent
        v-else
        :rows="rows"
        :columns="columns"
        :status-counter="statusCounter"
        :all-fields="opHeader"
        :pageLable="$t('release_form.BreadCrump')"
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
            <!-- delete -->
            <ButtonComponent
              v-if="row.additional_data == 0"
              class="btn text-color-v-dark"
              :icon="'fa-solid fa-xmark'"
              :loading="loading"
              @click="deleteItem(row.id)"
            >
            </ButtonComponent></td
        ></template>
      </TableLayoutComponent>
    </div>
    <ModalComponent :showModal="isModalOpen"
      ><FormPopUpLayoutComponent
        @closeModal="closeModal"
        v-click-outside="closeModal"
        v-click-enter="submitForm"
        :title="$t('release_form.edit_release')"
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
            />

            <input
              type="number"
              id="name"
              :placeholder="intialQuantityValue"
              v-model="formData.new_quantity"
              class="py-2 border rounded-md border-2 bg-gray-100 text-black-500 px-2"
              :class="{ 'text-red-500': errors.new_quantity }"
              @input="checkNumValidtion(formData.new_quantity)"
            />
            <p v-if="errors.new_quantity" class="pt-2 text-xs text-red-500">
              {{ errors.new_quantity }}
            </p>
          </div>
          <ButtonComponent
            :loading="ButtonLoad"
            :title="$t('save')"
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
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
//TABEL
//TABLE COMPOSABLES
import { useModal } from "@/composables/useModal";
const { isModalOpen, openModal, closeModal, toggleModal, displayForm } =
  useModal();

import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
import TableSkeletonLoader from "@/components/Layouts/TablesLayoutComponents/TableLoadersComponents/TableSkeletonLoader.vue";
import TableLayoutComponent from "@/components/Layouts/TablesLayoutComponents/TableLayoutComponent.vue";

import release_api from "@/services/inventory/release_api";
//TABLE DATA
const breadCrumps = [
  {
    text: t("release_form.release_list"),
    route: "Release",
    params: { operation_id: route.params.operation_id },
  },
  { text: t("release_form.release_details"), route: "" },
];

const loading = ref<boolean>(true);
const slotTDcolName = "form_quantity";
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
  additional_data: number;
}
const statusCounter = shallowRef<any>();
const rows = shallowRef<RowItem[]>([]);
const opHeader = shallowRef<any>();
const columns = [
  t("table.sku_code"),
  t("table.item_name"),
  t("table.material_name"),
  t("table.category_name"),
  t("table.origin_name"),
  t("table.shape_name"),
  t("table.specifications"),
  t("table.quantity"),
  t("table.operation_quantity"),
  t("table.quantity_after"),
  t("table.barcode"),
  t("table.date"),
  t("table.finish_level"),
  t("table.status"),
  t("table.action"),
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
    const response = await release_api.getSpecificReleaseFormItem(
      +route.params.form_id
    );

    release.value = response;
    rows.value = response.form_details.map((item: any) => ({
      id: item.id,
      item_name: item.item_batch_full_details?.item_name,
      sku_code: item.item_batch_full_details?.item_sku_code,

      material_name: item.item_batch_full_details?.material_name || "",
      category_name: item.item_batch_full_details?.category_name || "",
      origin_name: item.item_batch_full_details?.origin_name || "",
      shape_name: item.item_batch_full_details?.shape_name || "",
      specifications:
        (item.item_batch_full_details.length
          ? t("operation_details.rows.length") +
            (item.item_batch_full_details.length + "cm" || " ") +
            "<br>"
          : " ") +
        (item.item_batch_full_details.width
          ? t("operation_details.rows.width") +
            (item.item_batch_full_details.width + "cm" || " ") +
            "<br>"
          : " ") +
        (item.item_batch_full_details.thick_height
          ? t("operation_details.rows.thick_height") +
            (item.item_batch_full_details.thick_height + "cm" || " ") +
            "<br>"
          : "") +
        (item.item_batch_full_details.weight
          ? t("operation_details.rows.weight") +
            (item.item_batch_full_details.weight + "kg" || " ")
          : "") +
        (item.item_batch_full_details.diameter
          ? t("operation_details.rows.diameter") +
            (item.item_batch_full_details.diameter + "cm" || " ") +
            "<br>"
          : " ") +
        (item.item_batch_full_details.size
          ? t("operation_details.rows.size") +
            (item.item_batch_full_details.size + "cm" || " ") +
            "<br>"
          : " "),
      actuall_quantity:
        item.item_batch_full_details?.quantity + " " + (item.uom?.uom || " "),
      form_quantity: item.form_quantity + " " + (item.uom?.uom || " "),
      quantity_after:
        item.item_batch_full_details?.quantity -
        item.form_quantity +
        " " +
        (item.uom?.uom || " "),
      barcode: item.item_batch_full_details?.barcode,
      date:
        t("operation_details.rows.production_date") +
        (item.item_batch_full_details?.production_date?.slice(0, 10) || "") +
        "<br>" +
        (t("operation_details.rows.experation_date") +
          (item.item_batch_full_details?.exp_date?.slice(0, 10) || " ")),
      finshing_level: item.item_batch_full_details?.finishing_level_name || "",
      additional_data: item.status,
    }));
    opHeader.value = [
      {
        label: t("operation_details.header.location"),
        value: response.from_location.location_name || "",
      },
      {
        label: t("operation_details.header.code"),
        value: response.form_label || "",
      },
      {
        label: t("operation_details.header.to_location"),
        value: response.to_location?.location_name || "",
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
        value: response.created_at?.slice(0, 10) + " - " + response.user.name,
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
        value: rows.value.filter((item) => item.additional_data === 0).length,
      },
      {
        label: t("status.close"),
        value: rows.value.filter((item) => item.additional_data === 1).length,
      },
      {
        label: t("status.confirm"),
        value: rows.value.filter((item) => item.additional_data === 2).length,
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
//UPDATE SPECIFIC ITEM QUANTITY
const updateQuantity = (curr_row_id: number, item_quantity: string) => {
  intialQuantityValue.value = item_quantity;
  row_id.value = curr_row_id;
  openModal();
};
const checkNumValidtion = (curr_quantity: number = 0) => {
  const selectedItem: any = rows.value.find((item: any) => {
    return item.id === row_id.value;
  });
  const quantity = selectedItem.actuall_quantity.match(/\d+/)[0];
  if (quantity < curr_quantity) {
    errors.value.new_quantity = t(
      "release_item_form.form.errors.new_quantity_availability"
    );
  } else errors.value.new_quantity = "";
};
//DELETE SPECIFIC ITEM
const deleteItem = async (row_id: string) => {
  await release_api.deleteItem(+row_id);
  getRelease();
};
//UPDATE WHOEL FORM STATUS
const updateItemDetails = async (
  params: Record<string, any>,
  row_id: string
) => {
  await release_api.updateItemDetails(params, +row_id);
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

    await release_api.updateItemDetails(payload, row_id.value);
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
