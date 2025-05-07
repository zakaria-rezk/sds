<template>
  <div>
    <BreadCrumpsComponent :BreadCrumps="breadCrumps" />

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
         <router-link
          :to="{ name: 'History', params: { id: row.id } }"
          class="mt-2 inline-block px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors"
        >
          View History
        </router-link> 
      </template>
    </TableLayoutComponent>
  </div>
</template>
<script lang="ts" setup>
const breadCrumps = [];

//GLOBAL IMPORTS

import { ref, shallowRef } from "vue";

import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import adjustments_api from "@/services/inventory/adjustment_api";
import ButtonComponent from "@/components/Layouts/AppLayoutComponents/ButtonComponent.vue";
import show_room_api from "@/services/inventory/show_room_api";
import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
import { useButtonLoad } from "@/composables/useButtonLoad";
//GLOBAL DATA
const paginationObj = ref<object>();

const route = useRoute();
const router = useRouter();

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
    filterData.value = filteredData;
  }
  try {
    loading.value = true;
    const response = await show_room_api.getItems(filterData.value, pageNumber);
    rows.value = response.data.map((item: any) => ({
      id: item.itembatch_location_id,
      sku_code: item.item_sku_code,
      item_name: item.item_name,
      material_name: item.material_name,
      category_name: item.category,
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

      item_quantity: item.quantity,
      // unit_cost: item.unit_cost,
      // total_cost: item.total_cost,
      barcode: item.barcode,
      date:
        t("operation_details.rows.production_date") +
        (item.item_batch_full_details?.production_date?.slice(0, 10) || " ") +
        "<br>" +
        (t("operation_details.rows.experation_date") +
          (item.item_batch_full_details?.exp_date?.slice(0, 10) || " ")),
      finish_level: item.finishing_level_name,
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
  t("table.action"),
];

onMounted(async () => {
  getDropDownFilterData();
});
</script>
