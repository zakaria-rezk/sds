<template>
  <div>
    <BreadCrumpsComponent
      :BreadCrumps="breadCrumps"
      :btn="$t('create_item.form.title')"
      :disabled="false"
      @toggleModalEmit="navigator"
    />
    <div class="flex justify-center">
      <p class="">{{ formCode }}</p>
      <p class="">
        <span>{{ $t("add_items_to_form.btn_lable") }}</span>
        <span class="font-bold px-2">{{ selectedItems.length }}</span>
      </p>
      <button-component
        @click="addItemsToForm"
        class="btn color-primary"
        :loading="ButtonLoad"
        :class="{ 'cursor-not-allowed': selectedItems.length === 0 }"
        :title="$t('add_items_to_form.adjustment.btn')"
        :disabled="selectedItems.length === 0"
      >
      </button-component>
    </div>
    <SelectToLayoutComponent
      :keys="dropDownKeys"
      :data="filterDropDownData"
      @filter="filter($event)"
    />
    <TableSkeletonLoader v-if="loading" />
    <TableLayoutComponent
      v-else
      :columns="columns"
      :paginationObj="paginationObj"
      @update:page="filter(null, $event)"
      :rows="rows"
      :pageLable="$t('add_items_to_form.page_lable')"
    >
      <template #status="{ row }">
        <td v-if="row.additional_data === 'Not Exist'">
          <ToggleButtonComponent
            @fireToggleEmit="toggleItemFromOperation($event, row.id)"
            :checked="row.additional_data != 'Not Exist'"
            :disabled="false"
            variant="slider"
          />
        </td>
        <div v-else class="grid grid-col-1 divide pt-2">
          <td class="btn w-fit bg-gray-400">
            {{ $t("status.already_added") }}
          </td>
        </div>
      </template>
    </TableLayoutComponent>
  </div>
</template>
<script lang="ts" setup>
//ERROR

//GLOBAL IMPORTS
import { ToastProps, useToast } from "vue-toast-notification";
import { ref, shallowRef } from "vue";

import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import adjustments_api from "@/services/inventory/adjustment_api";
import ButtonComponent from "@/components/Layouts/AppLayoutComponents/ButtonComponent.vue";
import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
import { useButtonLoad } from "@/composables/useButtonLoad";
//GLOBAL DATA
const paginationObj = ref<object>();
const { ButtonLoad, toggleButtonLoad } = useButtonLoad();
const formCode = ref<string>(localStorage.getItem("form_code"));
const $toast = useToast();
const toastOption: ToastProps = {
  position: "top-right",
  duration: 2000,
  pauseOnHover: true,
};
const route = useRoute();
const router = useRouter();
const breadCrumps = [
  {
    text: t("adjustment_form.adjustment_details"),
    route: "adjustment-details",
    params: {
      operation_id: route.params.operation_id,
      form_id: route.params.form_id,
    },
  },
  { text: t("add_items_to_form.BreadCrump.adjustment.curr_page"), route: "" },
];
//GLOBLA MEHTOD
const navigator = () => {
  router.push({
    name: "CreateItem",
    params: {
      form_id: +route.params.form_id,
      operation_id: +route.params.operation_id,
    },
    state: {
      previous: String(route.name),
    },
  });
};
//SEARCH
//SEARCH IMPORTS
import SelectToLayoutComponent from "@/components/Layouts/FormLayoutComponents/SelectToLayoutComponent.vue";
///SEARCH DATA
const selectedItems = ref<number[]>([]); // ITME IDS WILL BE ADD TO FOMR WHEN USER CLICK ADD
const dropDownKeys = ref<any>();
const filterDropDownData = ref<any>();
const filterData = ref<any>(null);
//SEARCH METHOD
//GET DATA THE WITH USER FILTER (I NO FILTER ENTERED GET ALL DATA)
const filter = async (filteredData: any = null, pageNumber: number = 1) => {
  if (filteredData) {
    (filteredData.form_id = +route.params.form_id),
      (filteredData.operation_id = +route.params.operation_id),
      (filteredData.is_in_location = 1);
    filterData.value = filteredData;
  }
  try {
    loading.value = true;
    const response = await adjustments_api.getFilterdItems(
      filterData.value,
      pageNumber
    );
    rows.value = response.data.map((item: any) => ({
      id: item.item_batch_location_id,
      sku_code: item.item_sku_code,
      card_name: item.item_card_name,
      material_name: item.material_name,
      category_name: item.item_category_name,
      shape_name: item.item_shape_name,
      origin_name: item.item_origin_name,
      specifications:
        (item.length
          ? t("operation_details.rows.length") +
            (item.length + "cm" || " ") +
            "<br>"
          : " ") +
        (item.width
          ? t("operation_details.rows.width") +
            (item.width + "cm" || " ") +
            "<br>"
          : " ") +
        (item.thick_height
          ? t("operation_details.rows.thick_height") +
            (item.thick_height + "cm" || " ") +
            "<br>"
          : "") +
        (item.weight
          ? t("operation_details.rows.weight") + (item.weight + "kg" || " ")
          : "") +
        (item.diameter
          ? t("operation_details.rows.diameter") +
            (item.diameter + "cm" || " ") +
            "<br>"
          : " ") +
        (item.size
          ? t("operation_details.rows.size") +
            (item.size + "cm" || " ") +
            "<br>"
          : " "),
      uom: item.uom,

      item_quantity: item.item_batch_location_quantity,
      // unit_cost: item.unit_cost,
      // total_cost: item.total_cost,
      barcode: item.barcode,
      date:
        t("operation_details.rows.production_date") +
        (item.item_batch_full_details?.production_date?.slice(0, 10) || " ") +
        "<br>" +
        (t("operation_details.rows.experation_date") +
          (item.item_batch_full_details?.exp_date?.slice(0, 10) || " ")),
      finish_level: item.finishing_level,
      additional_data:
        item.form_status === null
          ? "Not Exist"
          : item.form_status === 0
          ? "Open"
          : item.form_status === 1
          ? "Closed"
          : item.form_status === 2
          ? "Confirmed"
          : item.form_status,
    }));
    paginationObj.value = response.pagination;
  } catch (error) {
    rows.value = [];
    throw error;
  } finally {
    loading.value = false;
  }
};
//GET SELECT TO KEYS
const getDropDownFilterData = async () => {
  try {
    filterDropDownData.value = await adjustments_api.getDropDownFilterData();
  } catch (error) {
    throw error;
  } finally {
    loading.value = false;
  }

  dropDownKeys.value = Object.keys(filterDropDownData.value);
};
//TABLE
// TABLE IMPORTS
import TableSkeletonLoader from "@/components/Layouts/TablesLayoutComponents/TableLoadersComponents/TableSkeletonLoader.vue";
import ToggleButtonComponent from "@/components/Layouts/AppLayoutComponents/ToggleButtonComponent.vue";
import TableLayoutComponent from "@/components/Layouts/TablesLayoutComponents/TableLayoutComponent.vue";
//TABLE DATA

const rows = shallowRef<any[]>([]);
const loading = ref<boolean>(true);
const columns = [
  t("table.sku_code"),
  t("table.card_name"),
  t("table.material_name"),
  // t("table.origin_name"),
  t("table.category_name"),
  t("table.shape_name"),
  t("table.origin_name"),
  t("table.specifications"),
  t("table.uom"),
  t("table.item_quantity"),
  t("table.barcode"),
  t("table.date"),
  t("table.finish_level"),
  t("table.status"),
];
//TABLE MEHOTDS
// ADD AND REMOVE ITEMS FROM SELECTED ITEMS
const toggleItemFromOperation = (toggleStatus: boolean, item_id: number) => {
  if (toggleStatus) {
    if (!selectedItems.value.includes(item_id)) {
      const selectedRow = rows.value.find(
        (release: any) => release.id === item_id
      );
      formTitle.value = selectedRow.card_name;
      currItemId.value = selectedRow.id;
      selectedItems.value.push(item_id);
    }
  } else {
    selectedItems.value = selectedItems.value.filter((id) => id !== item_id);
  }
};
// ADD SLCTED ITEMS TO FORM

const addItemsToForm = async () => {
  const payload = {
    form_id: +route.params.form_id,
    item_batch_location: selectedItems.value,
  };

  try {
    toggleButtonLoad();
    await adjustments_api.addItemsToStokingForm(payload);
    $toast.success(t("toast.items_added"), toastOption);
    selectedItems.value = [];
    filter({});
  } catch (error) {
    $toast.error(t("toast.items-added-error"), toastOption);
  } finally {
    toggleButtonLoad();
  }
};
const addItemsToArray = () => {};

//form data
// const quantity = ref<number>();
// const quantityArray = ref<number[]>();
const formTitle = ref<string>();
const currItemId = ref<number>();

//LIFECYCLE HOOKS
onMounted(async () => {
  getDropDownFilterData();
});
</script>
