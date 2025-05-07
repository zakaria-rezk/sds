<template>
  <div>
    <BreadCrumpsComponent :BreadCrumps="breadCrumps" :disabled="true" />
    <TableSkeletonLoader v-if="loading" />
    <div v-else>
      <TableLayoutComponent
        :columns="columns"
        :rows="rows"
        :pageLable="$t('receive_form.BreadCrump')"
      >
        <template #status="{ row }">
          <td class="">
            <div class=" button">
              <button
                @click="getDetails(row.id, row.additional_data)"
                class="button"
              >
                <font-awesome-icon
                  :icon="['fas', 'list']"
                  class="btn color-primary"
                />
              </button>
            </div>
          </td>
        </template>
        <template #actions="{ row }">
          <td v-if="!hasReceives(row.id)">
            <div class="btn color-primary">
              <ButtonComponent
                :loading="ButtonLoad"
                :title="$t('accept')"
                @click="addReceive(row.id, row.additional_data)"
              />
            </div>
          </td>
          <td v-else>
            <button @click="viewInOperations(row.id)">
              VIEW RECEIVE OPERATIONS
            </button>
          </td></template
        >
      </TableLayoutComponent>
    </div>
    <ModalComponent :show-modal="isModalOpen">
      <FormPopUpLayoutComponent
        class="!w-3/4 !top-10 !my-10"
        @closeModal="closeModal"
        title="items "
        v-click-outside="closeModal"
      >
        <div v-if="!details_loading">
          <TableLayoutComponent
            :columns="in_operations ? in_columns : details_columns"
            :rows="details_rows"
            :all-fields="in_operations ? null : opHeader"
            :pageLable="in_operations ? null : $t('release_form.BreadCrump')"
          >
            <template #actions="{ row }" v-if="in_operations">
              <td>
                <a
                  :href="
                    $router.resolve({
                      name: 'receive-details',
                      params: {
                        operation_id: row.additional_data,
                        form_id: row.id,
                      },
                    }).href
                  "
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <font-awesome-icon :icon="['fas', 'list']" />
                </a>
              </td> </template
          ></TableLayoutComponent>
          <div class="flex justify-end">
            <ButtonComponent
              :loading="ButtonLoad"
              class="color-primary btn"
              :title="$t('accept')"
              @click="
                addReceive(
                  activeOperation.form_id,
                  activeOperation.operation_id
                )
              "
            />
          </div>
        </div>
        <TableSkeletonLoader v-else></TableSkeletonLoader>
      </FormPopUpLayoutComponent>
    </ModalComponent>
  </div>
</template>
<script setup lang="ts">
//GLOBAL IMPOTS
import { computed, onMounted, ref, shallowRef } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import receive_api from "@/services/receive_api";
import release_api from "@/services/inventory/release_api";
//GLOBLA DATA
const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const breadCrumps = ref([{ text: t("receive_form.BreadCrump"), route: "" }]);
//TABLE
//TABLE COMPONENTS
import ModalComponent from "@/components/Layouts/AppLayoutComponents/ModalComponent.vue";
import { useModal } from "@/composables/useModal";
const { isModalOpen, openModal, closeModal, toggleModal } = useModal();
import FormPopUpLayoutComponent from "@/components/Layouts/PopUpLayoutComponent/FormPopUpLayoutComponent.vue";
import ButtonComponent from "@/components/Layouts/AppLayoutComponents/ButtonComponent.vue";
import TableSkeletonLoader from "@/components/Layouts/TablesLayoutComponents/TableLoadersComponents/TableSkeletonLoader.vue";
import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
import TableLayoutComponent from "@/components/Layouts/TablesLayoutComponents/TableLayoutComponent.vue";
import store from "@/Middelware/store";

//TABLE COMPOSABLES
import { useButtonLoad } from "@/composables/useButtonLoad";
const { ButtonLoad, toggleButtonLoad } = useButtonLoad();
//TABLE COMPUTED

//TABLE DATA
const loading = ref<boolean>(true);
const details_loading = ref<boolean>(false);
const activeOperation = ref<{
  form_id: number;
  operation_id: number;
}>();
const rows = shallowRef<any>([]);
const details_rows = shallowRef<any>();
const Receives = ref<Array<any>>([]);
const columns = [
  t("table.form_lable"),
  t("table.source_location"),
  t("table.form_date_time"),
  t("table.created_by"),
  t("table.created_at"),
  t("table.confirmed_at"),
  t("table.details"),
  t("table.actions"),
];
const details_columns = [
  t("table.item_batch"),
  t("table.barcode"),
  t("table.prod_date"),
  t("table.exp_date"),
  t("table.finish_level"),
  t("table.quantity"),
  t("table.actual_quantity"),
  t("table.quantity_after"),
];
const in_columns = [
  t("table.form_lable"),
  t("table.source_location"),
  t("table.destination_location"),
  t("table.form_date_time"),
  t("table.created_by"),
  t("table.created_at"),
  t("table.confirmed_at"),
  t("table.actions"),
];
//TABLE MEHTODS
const releases = ref<any>();
const getRelease = async () => {
  loading.value = true;

  try {
    const payload = {
      to_location: +store.getters["location_module/LocationId"],
      status: 2,
    };
    const response = await release_api.getRelease(payload); //get release

    releases.value = response;
    rows.value = response.map((release: any) => ({
      id: release.id,
      form_lable: release.form_label,
      source_location: release.from_location?.location_name,
      form_datetime: release.form_datetime,
      created_by: release.user.name,
      created_at: release.created_at,
      confirmed_at: release.confirmed_at,
      additional_data: release.operation_id,
    }));

    Receives.value = response.map((receive: any) => ({
      form_id: receive.id,
      operation_id: receive.operation_id,
      accepted: receive.in_operations?.length > 0,
    }));
  } catch (er) {
    rows.value = [];
    throw er;
  } finally {
    loading.value = false;
  }
};
const hasReceives = (id: number) => {
  const item = Receives.value.find((r: any) => {
    return r.form_id === id;
  });
  return item.accepted;
};
const opHeader = ref<any>();
const getDetails = async (release_id: number, operation_id: number) => {
  openModal();
  activeOperation.value = {
    form_id: release_id,
    operation_id: operation_id,
  };
  
  details_loading.value = true;
  in_operations.value = false;
  const response = await release_api.getSpecificReleaseFormItem(release_id);
  details_loading.value = false;
  details_rows.value = response.form_details.map((item: any) => ({
    id: item.id,
    item_batch: item.item_batch_location.item_batch.batch_num,
    barcode: item.item_batch_location.item_batch.barcode,
    production_date: item.item_batch_location.item_batch.production_date || "",
    exp_date: item.item_batch_location.item_batch.exp_date || "",
    finshing_level: item.item_batch_location.item_batch.finshing_level || "",
    actuall_quantity: item.item_batch_location.quantity + " " + item.uom?.uom,
    form_quantity: item.form_quantity + " " + item.uom?.uom,
    quantity_after:
      item.item_batch_location.quantity -
      item.form_quantity +
      " " +
      item.uom?.uom,
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
      label: t("operation_details.header.doc_num"),
      value: response.doc_number || "",
    },
    {
      label: t("operation_details.header.date_time"),
      value: response.form_datetime || "",
    },
    {
      label: t("operation_details.header.created_at"),
      value: response.created_at + " - " + response.user.name,
    },
    {
      label: t("operation_details.header.confirm"),
      value:
        response.confirmed_at != null
          ? response.confirmed_by + " - " + response.confirmed_at
          : t("operation_details.header.not_confirmed_yet"),
    },
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
      label: t("operation_details.header.status"),
      value:
        response.status === 2
          ? t("status.confirm")
          : response.status === 1
          ? t("status.close")
          : t("status.open"),
    },
    {
      label: t("operation_details.header.total_items"),
      value: rows.value.length,
    },
    { label: "Stu", value: response.status },
  ];
};
const in_operations = ref<boolean>();
const viewInOperations = (form_id: number) => {
  openModal();
  
  in_operations.value = true;
  
  const release_operation = releases.value.find((operation: any) => {
    return operation.id === form_id;
  });
  
  details_rows.value = release_operation.in_operations.map((receive: any) => ({
    id: receive.id,
    form_lable: receive.form_label,
    destination_location: receive.to_location?.location_name,
    source_location: receive.from_location?.location_name,
    form_datetime: receive.form_datetime,
    created_by: receive.user.name,
    created_at: receive.created_at,
    confirmed_at: receive.confirmed_at,
    additional_data: receive.operation_id,
  }));
};
const navigator = (form_id: number) => {
  router.push({
    name: "receive-details",
    params: {
      operation_id: +route.params.operation_id,
      form_id: form_id,
    },
  });
};

//FORM
//FORM METHODS
//ACCPECT THE CURRENT RELEASE AND TRANSOFRM IT TO RECEIVE
const addReceive = async (
  source_form_id: number,
  source_operation_id: number
) => {
  const payload = {
    source_form_id: source_form_id,
    source_operation_id: source_operation_id,
    operation_id: +route.params.operation_id,
  };

  try {
    toggleButtonLoad();
    await receive_api.addReceive(payload);
    getRelease();
  } catch (er) {
    throw er;
  } finally {
    closeModal();
    toggleButtonLoad();
  }
};
//LIFECYCLE HOOKS
onMounted(async () => {
  getRelease();
});
</script>

