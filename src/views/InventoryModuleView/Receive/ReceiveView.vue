<template>
  <div>
    <BreadCrumpsComponent
      :BreadCrumps="breadCrumps"
      :btn="$t('inbox')"
      :disabled="false"
      @toggleModalEmit="navigator"
    />
    <SearchLayoutComponent
      :Schema="schema"
      @update:search="getReceive($event)"
    />
    <TableSkeletonLoader v-if="loading" />

    <TableLayoutComponent
      v-else
      :columns="columns"
      :rows="rows"
      :pageLable="$t('receive_form.BreadCrump')"
    >
      <template #toggle="{ row }">
        <td>
          <div
            class="btn"
            :class="{
              indigo_badge: row.additional_data.status === 2,
              yellow_badge: row.additional_data.status === 1,
              green_badge: row.additional_data.status === 0,
            }"
          >
            {{ getStatus(row.additional_data.status) }}
          </div>
        </td>
      </template>
      <template #actions="{ row }">
        <td>
          <div>
            <router-link
              :to="{
                name: 'receive-details',
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
      <template #status="{ row }">
        <td>
          <div>
            <router-link
              :to="{
                name: getDetailsRoute(row.source_operation_type),
                params: {
                  form_id: row.additional_data.source_form_id,
                  operation_id: row.additional_data.source_operation_id,
                },
              }"
              class="inline-flex items-center gap-2 px-4 py-2 text-white bg-violet-500 rounded-md font-semibold transition duration-300 hover:bg-blue-600 hover:scale-105 active:scale-95"
            >
              {{ row.additional_data.source_form_label }}
              <font-awesome-icon :icon="['fas', 'arrow-right']" />
            </router-link>
          </div>
        </td>
      </template>
      <template #navagation="{ row }">
        <td>
          <ButtonComponent
            v-if="row.additional_data.status === 2 && return_in_id"
            :title="$t('create_return')"
            :loading="ButtonLoad"
            @click="createReturn(row.id)"
            class="inline-flex items-center gap-2 px-4 py-2 text-white bg-red-500 rounded-md font-semibold transition duration-300 hover:bg-red-600 hover:scale-105 active:scale-95"
          ></ButtonComponent>
        </td>
      </template>
    </TableLayoutComponent>
  </div>
</template>
<script setup lang="ts">
//GOLBAL IMPORTS

import ButtonComponent from "@/components/Layouts/AppLayoutComponents/ButtonComponent.vue";
import { useButtonLoad } from "@/composables/useButtonLoad";
const { ButtonLoad, toggleButtonLoad } = useButtonLoad();
import { computed, onMounted, ref, shallowRef } from "vue";
import { useRoute, useRouter } from "vue-router";

const updateSchema = () => {
  // Create a new first field with updated label
  schema.value[0].label = "CATEGORY";
};
//GLOBLA DATA
const route = useRoute();
const router = useRouter();

//TABLE
//search
const locations = computed(() =>
  store.getters['location_module/Locations']?.map((location) => ({
    id: location.id,
    name: location.location_name,
  }))
);
import GenericInputLayoutComponent from "@/components/Layouts/FormLayoutComponents/GenericInputLayoutComponent.vue";
import GenericSelectInputLayoutComponent from "@/components/Layouts/FormLayoutComponents/GenericSelectInputLayoutComponent.vue";
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
//TABLE IMPORTS
import store from "@/Middelware/store";
import SearchLayoutComponent from "@/components/Layouts/FormLayoutComponents/SearchLayoutComponent.vue";
import return_api from "@/services/inventory/return_in_api";
import { getDetailsRoute } from "@/utils/getOperationRoute";
import TableSkeletonLoader from "@/components/Layouts/TablesLayoutComponents/TableLoadersComponents/TableSkeletonLoader.vue";
import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
import TableLayoutComponent from "@/components/Layouts/TablesLayoutComponents/TableLayoutComponent.vue";
import receive_api from "@/services/receive_api";
import locations_api from "@/services/inventory/locations_api";
import { number } from "yup";
//TABLE DATA
const loading = ref<boolean>(true);
const rows = ref<any>([]);

const breadCrumps = ref([{ text: t("receive_form.BreadCrump"), route: "" }]);
const columns = [
  t("table.form_lable"),
  t("table.source_location"),
  t("table.destination_location"),
  t("table.source_operation_type"),
  t("table.created_by"),
  t("table.created_at"),
  t("table.date"),
  t("table.confirmed_at"),
  t("table.source_operation"),
  t("table.actions"),
  t("table.status"),
  t("table.actions"),
];
//TABLE METHODS
const getStatus = (status: number) => {
  return status === 2
    ? t("status.confirm")
    : status === 1
    ? t("status.confirm")
    : t("status.open");
};
const createReturn = async (id: number) => {
  toggleButtonLoad();
  try {
    const response = await return_api.addRetrun({
      source_form_id: id,
      operation_id: return_in_id.value,
    });
    router.push({
      name: "return-details",
      params: {
        form_id: +response.id,
        operation_id: +response.operation_id,
      },
    });
  } catch (er) {
    throw er;
  } finally {
    toggleButtonLoad();
  }
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

const getReceive = async (filter: any = null) => {
  loading.value = true;

  try {
    const payload = {
      operation_id: +route.params.operation_id,
      ...filter,
    };
    const response = await receive_api.getReceive(payload);
    rows.value = response.map((receive: any) => ({
      id: receive.id,
      form_lable: receive.form_label,
      source_location: receive.from_location?.location_name,
      destination_location: receive.to_location?.location_name,
      source_operation_type: receive.source_operation_type,
      created_by: receive.user.name,
      created_at: receive.created_at?.slice(0, 10),
      confirmed_at: receive.confirmed_at?.slice(0, 10),
      date: receive.form_datetime,
      additional_data: {
        status: receive.status,
        source_form_id: receive.source_form_id,
        source_operation_id: receive.source_operation_id,
        source_form_label: receive.source_form_label,
      },
    }));
  } catch (er) {
    rows.value = [];
    throw er;
  } finally {
    loading.value = false;
  }
};
const return_in_id = ref<number>(null);
const getReturnInId = async () => {
  try {
    const response = await locations_api.getLoactionOperations(
      +store.getters["location_module/LocationId"]
    );
    const operation = response.find(
      (op) => op.setting_operation.operation_type === "RETURN_IN"
    );
    return_in_id.value = operation ? operation.id : null;
  } catch (er) {
    throw er;
  }
};
//LIFECYCLE HOOKS
onMounted(async () => {
  getReceive();
  getReturnInId();
});
</script>

