<template>
  <div>
    <BreadCrumpsComponent
      :BreadCrumps="breadCrumps"
      :disabled="false"
      @toggleModalEmit="navigator"
    />
    <div class="flex justify-center">
      <div class="gap-2">
        <p class="text-systemColor">{{ formCode }}</p>
        <p class="">
          {{ $t("add_items_to_form.btn_lable") }}
          <span class="font-bold px-2">{{ Object.keys(items).length }}</span>
        </p>
      </div>
      <button-component
        @click="addItemsToForm"
        class="btn color-primary"
        :class="{ 'cursor-not-allowed': Object.keys(items).length === 0 }"
        :loading="ButtonLoad"
        :title="t('add_items_to_form.release.btn')"
        :disabled="Object.keys(items).length === 0"
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
      :columns="columns"
      :paginationObj="paginationObj"
      @update:page="filter(null, $event)"
      :rows="rows"
      :pageLable="$t('add_items_to_form.page_lable')"
      v-else
    >
      <template #status="{ row }">
        <td v-if="row.additional_data === 'Not Exist'" class="">
          <input
            type="number"
            :disabled="items[row.id] === undefined"
            :min="1"
            v-model="items[row.id]"
            :max="100"
            :class="{
              'w-24 p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-100': true,
              'bg-gray-300 border-gray-400 cursor-not-allowed':
                items[row.id] === undefined,
              'bg-white border-gray-300': items[row.id] !== undefined,
            }"
          />
          <input
            type="checkbox"
            :checked="false"
            :disabled="row.item_quantity === 0"
            @change="toggleItem($event, row.id)"
            class="w-5 h-5 cursor-pointer text-green-500 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-green-500 mx-2"
          />
        </td>

        <td v-else class="grid grid-col-1 divide pt-2">
          <span class="btn w-fit bg-gray-400">
            {{ $t("status.already_added") }}</span
          >
        </td>
      </template>
    </TableLayoutComponent>
  </div>
</template>
<script lang="ts" setup>
//ERROR

//GLOBAL IMPORTS
import { ToastProps, useToast } from "vue-toast-notification";
import { ref, shallowRef, defineAsyncComponent } from "vue";
import { useI18n } from "vue-i18n";
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import release_api from "@/services/inventory/release_api";
import ButtonComponent from "@/components/Layouts/AppLayoutComponents/ButtonComponent.vue";
import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
import { useButtonLoad } from "@/composables/useButtonLoad";
const paginationObj = ref<object>();
//GLOBAL DATA
const { t } = useI18n();
const { ButtonLoad, toggleButtonLoad } = useButtonLoad();
const formCode = ref<string>(localStorage.getItem("form_code"));
const $toast = useToast();
const route = useRoute();
const router = useRouter();
const toastOption: ToastProps = {
  position: "top-right",
  duration: 2000,
  pauseOnHover: true,
};
const breadCrumps = [
  {
    text: t("release_form.release_details"),
    route: "release-details",
    params: {
      operation_id: route.params.operation_id,
      form_id: route.params.form_id,
    },
  },
  { text: t("add_items_to_form.BreadCrump.release.curr_page"), route: "" },
];
// GLOBAL METHOD
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
///SEARCH DATA // ITME IDS WILL BE ADD TO FOMR WHEN USER CLICK ADD
const dropDownKeys = ref<any>();
const filterDropDownData = ref<any>();
const filterData = ref<any>({
  form_id: +route.params.form_id,
  operation_id: +route.params.operation_id,
  is_in_location: 1,
});
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
    const response = await release_api.getFilterdItems(
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
    filterDropDownData.value = await release_api.getDropDownFilterData();
  } catch (error) {
  } finally {
    loading.value = false;
  }
  dropDownKeys.value = Object.keys(filterDropDownData.value);
};
//TABLE
// TABLE IMPORTS
import TableSkeletonLoader from "@/components/Layouts/TablesLayoutComponents/TableLoadersComponents/TableSkeletonLoader.vue";
import TableLayoutComponent from "@/components/Layouts/TablesLayoutComponents/TableLayoutComponent.vue";
//TABLE DATA
const rows = shallowRef<any[]>([]);
const loading = ref<boolean>(true);
const columns = [
  t("table.sku_code"),
  t("table.card_name"),
  t("table.material_name"),
  t("table.category_name"),
  t("table.shape_name"),
  t("table.origin_name"),
  t("table.specifications"),
  t("table.uom"),
  t("table.item_quantity"),
  // t("table.unit_cost"),
  // t("table.total_cost"),
  t("table.barcode"),
  t("table.date"),
  t("table.finish_level"),
  t("table.status"),
];
//TABLE MEHOTDS
// ADD AND REMOVE ITEMS FROM SELECTED ITEMS
// ADD SLCTED ITEMS TO FORM
const addItemsToForm = async () => {
  addItems(items.value);
  try {
    toggleButtonLoad();
    const sufficientQuantity =
      selectedItems.value.length !== 0 &&
      selectedItems.value.every((item: any) => item.form_quantity > 0);
    console.log(
      "item_quantity",
      selectedItems.value.every((item: any) => item.form_quantity > 0)
    );
    if (!sufficientQuantity) {
      $toast.error(t("toast.un_suffecint_quantity"), toastOption);
      selectedItems.value = [];
      return;
    }

    const payload = {
      form_id: route.params.form_id,
      items: selectedItems.value,
    };
    await release_api.addItemsToReleaseForm(payload);
    $toast.success(t("toast.items_added"), toastOption);
    items.value = {};
    selectedItems.value = [];
    filter({});
  } catch (error) {
    $toast.error(t("toast.items-added-error"), toastOption);
    throw error;
  } finally {
    toggleButtonLoad();
  }
};
//seleted item logic
import { useSelectedItems } from "@/composables/useAdditemsToForm";
const { selectedItems, addItems } = useSelectedItems();
//Form

const items = ref({});
const toggleItem = (event: Event, id: number) => {
  const target = event.target as HTMLInputElement;

  if (target.checked) {
    items.value[id] = 1;
  } else {
    delete items.value[id];
  }
};
//form data
//LIFECYCLE HOOKS
onMounted(async () => {
  getDropDownFilterData();
});
</script>

