<template>
  <div>
    <BreadCrumpsComponent :BreadCrumps="breadCrumps" :disabled="true" />
    <SearchLayoutComponent :Schema="schema" @update:search="getRins($event)" />
    <TableSkeletonLoader v-if="loading" />
    <div v-else>
      <TableLayoutComponent
        :columns="columns"
        :rows="rows"
        :pageLable="$t('return_form.BreadCrump')"
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
        <template #actions="{ row }"
          ><td>
            <div class="flex">
              <router-link
                :to="{
                  name: 'return-out-details',
                  params: { form_id: row.id, operation_id: route.params.id }, // operation id
                }"
              >
                <font-awesome-icon
                  :icon="['fas', 'list']"
                  class="btn color-primary"
                />
              </router-link>
            </div>
          </td>
        </template>
      </TableLayoutComponent>
    </div>
  </div>
</template>
<script setup lang="ts">
//GOLBAL IMPORTS
import { computed, onMounted, ref, shallowRef } from "vue";
import store from "@/Middelware/store";
import GenericInputLayoutComponent from "@/components/Layouts/FormLayoutComponents/GenericInputLayoutComponent.vue";
import { useRoute } from "vue-router";
import TableSkeletonLoader from "@/components/Layouts/TablesLayoutComponents/TableLoadersComponents/TableSkeletonLoader.vue";
import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
import TableLayoutComponent from "@/components/Layouts/TablesLayoutComponents/TableLayoutComponent.vue";
import return_out_api from "@/services/inventory/return_out_api";
import SearchLayoutComponent from "@/components/Layouts/FormLayoutComponents/SearchLayoutComponent.vue";
import GenericSelectInputLayoutComponent from "@/components/Layouts/FormLayoutComponents/GenericSelectInputLayoutComponent.vue";

const route = useRoute();

//search
const locations = computed(() =>
  store.getters['location_module/Locations']?.map((location) => ({
    id: location.id,
    name: location.location_name,
  }))
);
import {
  CreateInputField,
  CreateSelectField,
} from "@/utils/create_input_field";

const schema = ref([
  CreateInputField({
    label: "FORM LABEL",
    model: "form_label",
    component: GenericInputLayoutComponent,
    animation: "animate-fade-in-left-to-right",
    props: {
      type: "text",
      appearance: "secondary",
      variant: "outline",
      initialValue: null,
      size: "full",
    },
  }),
  CreateInputField({
    label: "FROM",
    model: "date_from",
    component: GenericInputLayoutComponent,
    animation: "animate-fade-in-up",
    props: {
      type: "date",
      appearance: "secondary",
      variant: "outline",
      size: "full",
    },
  }),
  CreateInputField({
    label: "TO",
    model: "date_to",
    component: GenericInputLayoutComponent,
    animation: "animate-fade-in-up",
    props: {
      type: "date",
      appearance: "secondary",
      variant: "outline",
      size: "full",
      initialValue: new Date().toISOString().split("T")[0],
    },
  }),
  CreateSelectField({
    label: "LOCATION",
    model: "to_location",
    component: GenericSelectInputLayoutComponent,
    animation: "animate-fade-in-right-to-left",
    props: {
      options: { ...locations.value },
      variant: "rounded",
      appearance: "secondary",
      size: "full",
    },
  }),
]);
//TABLE
//TABLE IMPORTS

//TABLE DATA
const loading = ref<boolean>(true);
const rows = shallowRef<[]>();
const breadCrumps = [{ text: t("return_form.BreadCrump"), route: "" }];

//TABLE METHODS
const columns = [
  t("table.form_lable"),
  t("table.source_location"),
  t("table.destination_location"),

  // t("table.created_by"),
  // t("table.created_at"),
  t("table.confirmed_at"),
  t("table.date"),
  t("table.source_operation"),
  t("table.actions"),
  t("table.status"),
];
const getRins = async (filter = null) => {
  try {
    loading.value = true;
    const payload = {
      ...filter,
    };
    const response = await return_out_api.getReturns(payload);

    rows.value = response.map((item: any) => ({
      id: item.id,
      form_label: item.form_label,
      source_location: item.from_location?.location_name,
      destination_location: item.to_location,
      form_datetime: item.form_datetime,
      created_by: [
        { text: item.user.name },
        { text: item.created_at?.slice(0, 10) },
      ],
      confirmed_at: [
        { text: item.confirmed_by?.name || "" },
        { text: item.confirmed_at?.slice(0, 10) || " " },
      ],
      additional_data:
        item.status === 2
          ? t("status.confirm")
          : item.status === 1
          ? t("status.close")
          : t("status.open"),
    }));
  } catch (er) {
    throw er;
  } finally {
    loading.value = false;
  }
};

//LIFECYCLE HOOKS
onMounted(async () => {
  getRins();
});
</script>
