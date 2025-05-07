<script setup lang="ts">
import { ref, onMounted, shallowRef } from "vue";
import { useRoute } from "vue-router";
import show_room_api from "@/services/inventory/show_room_api";
import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
import TableLayoutComponent from "@/components/Layouts/TablesLayoutComponents/TableLayoutComponent.vue";
import TableSkeletonLoader from "@/components/Layouts/TablesLayoutComponents/TableLoadersComponents/TableSkeletonLoader.vue";
const route = useRoute();
const rows = shallowRef<[]>();

const loading = ref<boolean>(true);
const breadCrumps = [
  {
    text: "Batches",
    route: "batches",
    params: { id: route.params.id },
  },
  {
    text: "History",
    route: "History",
  },
];

const columns = [
  "Item SKU code",
  "Item Name",
  "Form Label",
  "Company Code",
  "Average Price",
  "Operation Name",
  "Operation Type",
  "Quantity Before",
  "Quantity After",
];
onMounted(async () => {
  try {
    const response = await show_room_api.getHistory(+route.params.id);
    rows.value = response.map((item: any) => ({
      id: 1,
      sku_code: item.item_card.item_sku_code,
      item_name: item.item_card.item_name,
      form_label: item.form_label,
      com_code: item.operation.com_code,
      avg_price: item.item_card.avg_price,
      opeartion_name: item.operation.setting_operation.operation_name_en,
      opeartion_type: item.operation.setting_operation.operation_type,
      quantity_before: item.quantity_before,
      quantity_after: item.quantity_after,
    }));
  } catch (er) {
    throw er;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <section>
    <BreadCrumpsComponent :BreadCrumps="breadCrumps" />
    <TableSkeletonLoader v-if="loading" />
    <TableLayoutComponent
      :columns="columns"
      :rows="rows"
      :pageLable="$t('adjustment_form.BreadCrump')"
      v-else
    ></TableLayoutComponent>
  </section>
</template>
