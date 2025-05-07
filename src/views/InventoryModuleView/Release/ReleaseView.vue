<template>
  <div>
    <BreadCrumpsComponent
      :BreadCrumps="breadCrumps"
      :btn="$t('release_form.form.button')"
      :disabled="false"
      @toggleModalEmit="openModal"
    />

    <SearchLayoutComponent
      @update:search="getReleases($event)"
      :Schema="SearchSchema"
    />

    <TableSkeletonLoader v-if="loading" />
    <TableLayoutComponent
      v-else
      :columns="columns"
      :rows="rows"
      :pageLable="$t('release_form.BreadCrump')"
    >
      <template #status="{ row }">
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
      <template #navagation="{ row }">
        <td>
          <ButtonComponent
            v-if="row.additional_data.status === 2 && return_out_id"
            :title="$t('create_return')"
            :loading="ButtonLoad"
            @click="createReturn(row.id)"
            class="inline-flex items-center gap-2 px-4 py-2 text-white bg-red-500 rounded-md font-semibold transition duration-300 hover:bg-red-600 hover:scale-105 active:scale-95"
          ></ButtonComponent>
        </td>
      </template>
      <template #actions="{ row }"
        ><td>
          <div class="flex">
            <router-link
              :to="{
                name: 'release-details',
                params: { form_id: row.id, operation_id: route.params.id }, // operation id
              }"
            >
              <font-awesome-icon
                :icon="['fas', 'list']"
                class="btn color-primary"
              />
            </router-link>
            <button
              class="btn color-primary button"
              v-if="row.additional_data.status !== 2"
              @click="updateForm(row.id)"
            >
              <font-awesome-icon :icon="['fas', 'edit']" />
            </button>
          </div>
        </td>
      </template>
    </TableLayoutComponent>

    <ModalComponent :showModal="isEditModalOpen || isModalOpen">
      <FormPopUpLayoutComponent
        @closeModal="closeModal"
        v-click-outside="closeModal"
        v-click-enter="submitForm"
        :title="
          isEditModalOpen
            ? $t('form_titles.release.edit')
            : $t('form_titles.release.add')
        "
      >
        <genericform
          ref="genericForm"
          :formConfig="SCHEMA"
          @form-submit="submitForm"
          :loading="ButtonLoad"
        />
        <!-- <form
          class="flex flex-col"
          v-if="displayForm"
          @submit.prevent="submitForm"
        >
          <div
            class="input flex flex-col w-full py-2 mt-1"
            v-if="isEditModalOpen"
          >
            <InputLableLayoutComponent
              lableFor="name"
              :text="$t('release_form.form.lable.lable')"
            />
            <input
              readonly
              type="text"
              id="name"
              v-model="formData.form_lable"
              class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
              :placeholder="$t('release_form.form.lable.lable')"
            />
          </div>
          <div class="input flex flex-col w-full py-2 mt-1">
            <InputLableLayoutComponent
              lableFor="name"
              :text="$t('release_form.form.I1.lable')"
            />
            <select
              type="text"
              id="name"
              class="py-2 rounded-md border-2 bg-gray-100 text-gray-500 px-2"
              v-model="formData.category_name"
            >
              <option disabled selected :value="null">
                {{ $t("adjustment_form.form.I1.placeholder") }}
              </option>
              <option
                :value="category.category_name"
                v-for="category in categories"
                :key="category.id"
              >
                {{ category.category_name }}
              </option>
            </select>
            <p v-if="errors.category_name" class="pt-2 text-xs text-red-500">
              {{ errors.category_name }}
            </p>
          </div>
          <div class="input-group flex flex-col w-full py-2 mt-1">
            <InputLableLayoutComponent
              lableFor="location_name"
              :text="$t('release_form.form.I2.lable')"
            />
            <select
              required
              id="location_name"
              class="py-2 rounded-md border-2 bg-gray-100 text-gray-500 px-2"
              v-model="formData.to_location"
            >
              <option disabled selected value="">
                {{ $t("release_form.form.I2.lable") }}
              </option>

              <option
                :value="location.id"
                v-for="(location, index) in locations.filter(
                  (location:any) => location.id !== currentLocation
                )"
                :key="location.id"
              >
                {{ location.name }}
              </option>
            </select>
            <p v-if="errors.to_location" class="pt-2 text-xs text-red-500">
              {{ errors.to_location }}
            </p>
          </div>
          <div class="input flex flex-col w-full py-2 mt-1">
            <InputLableLayoutComponent
              lableFor="date"
              :text="$t('release_form.form.I3.lable')"
            />
            <input
              required
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
              lableFor="name"
              :text="$t('release_form.form.I4.lable')"
            />
            <input
              type="text"
              id="name"
              v-model="formData.doc_number"
              class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
              :placeholder="$t('release_form.form.I4.placeholder')"
            />
            <p v-if="errors.doc_number" class="pt-2 text-xs text-red-500">
              {{ errors.doc_number }}
            </p>
          </div>
          <div class="input flex flex-col w-full py-2 mt-1">
            <InputLableLayoutComponent
              lableFor="name"
              :text="$t('release_form.form.I5.lable')"
            />
            <input
              type="text"
              id="name"
              v-model="formData.work_order_line_num"
              class="py-2 rounded-md border-2 bg-gray-100 text-black-500 px-2"
              :placeholder="$t('release_form.form.I5.placeholder')"
            />
            <p
              v-if="errors.work_order_line_num"
              class="pt-2 text-xs text-red-500"
            >
              {{ errors.work_order_line_num }}
            </p>
          </div>
          <ButtonComponent
            :loading="ButtonLoad"
            :title="$t('save')"
            class="form_btn"
          />
        </form> -->
        <!-- <SuccessModalComponent
          v-else
          @closeModal="
            closeModal();
            displayForm = true;
          "
          :text="$t('release_form.form.sucess')"
        ></SuccessModalComponent> -->
      </FormPopUpLayoutComponent>
    </ModalComponent>
  </div>
</template>
<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  ref,
  defineAsyncComponent,
  shallowRef,
  watch,
} from "vue";
const ModalComponent = defineAsyncComponent(
  () => import("@/components/Layouts/AppLayoutComponents/ModalComponent.vue")
);
const FormPopUpLayoutComponent = defineAsyncComponent(
  () =>
    import(
      "@/components/Layouts/PopUpLayoutComponent/FormPopUpLayoutComponent.vue"
    )
);
import { useRoute } from "vue-router";

import GenericSelectInputLayoutComponent from "@/components/Layouts/FormLayoutComponents/GenericSelectInputLayoutComponent.vue";
const currentLocation = +store.getters["location_module/LocationId"];
const locations = computed(() =>
  store.getters['location_module/Locations']?.map((location) => ({
    id: location.id,
    name: location.location_name,
  }))
);
const categories = ref<category[]>();
import categories_settings_api from "@/services/inventory/categories_settings_api";
function getCategories() {
  categories_settings_api.getCategories().then((response) => {
    categories.value = response.map((category: any) => ({
      id: category.full_category_name,
      name: category.full_category_name,
    }));
  });
}
getCategories();
import {
  CreateDataInputField,
  CreateDataSelectField,
} from "@/utils/fieldUtils";
const SCHEMA = computed(() => [
  CreateDataInputField({
    label: "FORM LABEL",
    model: "form_lable",
    required: false,
    ishidden: isEditModalOpen.value ? false : true,
    props: {
      disabled: isEditModalOpen.value ? true : false,
      type: "text",
      appearance: "primary",
      placeholder: "FORM LABEL",
      variant: "outline",
    },
  }),

  CreateDataSelectField({
    label: "CATEGORY NAME",
    model: "category_name",
    required: false,
    ishidden: false,
    props: {
      options: { ...categories.value },
      type: "select",
      appearance: "primary",
      placeholder: "CATEGORY NAME",
      variant: "outline",
    },
  }),
  CreateDataSelectField({
    label: "LOCATION",
    model: "to_location",
    required: true,
    ishidden: false,
    props: {
      options: {
        ...locations.value.filter(
          (location) => location.id !== currentLocation
        ),
      },
      type: "select",
      appearance: "primary",
      placeholder: "LOCATION",
      variant: "outline",
    },
  }),
  CreateDataInputField({
    label: "DATE",
    model: "form_datetime",

    required: true,
    ishidden: false,
    initialValue: new Date().toISOString().split("T")[0],
    props: {
      type: "date",
      appearance: "primary",
      placeholder: "DATE",
      variant: "outline",
    },
  }),
  CreateDataInputField({
    label: "DOC NUM",
    model: "doc_number",

    required: false,
    ishidden: false,
    props: {
      type: "text",
      appearance: "primary",
      placeholder: "DOC NUM",
      variant: "outline",
    },
  }),
  CreateDataInputField({
    label: "WORK ORDER",
    model: "work_order_line_num",
    required: false,
    ishidden: false,
    props: {
      type: "text",
      appearance: "primary",
      placeholder: "WORK ORDER",
      variant: "outline",
    },
  }),
]);
//search
import {
  CreateInputField,
  CreateSelectField,
} from "@/utils/create_input_field";
const SearchSchema = ref([
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
import genericform from "@/components/genericform.vue";
const genericForm = ref<any>(null);
const handleFormSubmit = (formData) => {
  // You can now send the form data to an API or handle it as needed
};
// Updated values

// Function to update form values
const updateFormValues = async (updatedValues: any) => {
  setTimeout(() => {
    genericForm.value.updateFormData(updatedValues);
  }, 500);
};
//GLOBAL IMPORTS

import ButtonComponent from "@/components/Layouts/AppLayoutComponents/ButtonComponent.vue";
//GLOBAL DATA
const route = useRoute();

//TABLE
// COMPONENTS IMPORTS
import return_out_api from "@/services/inventory/return_out_api";
import store from "@/Middelware/store";
import locations_api from "@/services/inventory/locations_api";
import GenericInputLayoutComponent from "@/components/Layouts/FormLayoutComponents/GenericInputLayoutComponent.vue";
import SearchLayoutComponent from "@/components/Layouts/FormLayoutComponents/SearchLayoutComponent.vue";
import TableSkeletonLoader from "@/components/Layouts/TablesLayoutComponents/TableLoadersComponents/TableSkeletonLoader.vue";
import BreadCrumpsComponent from "@/components/Layouts/AppLayoutComponents/BreadCrumpsComponent.vue";
import TableLayoutComponent from "@/components/Layouts/TablesLayoutComponents/TableLayoutComponent.vue";
import release_api from "@/services/inventory/release_api";
import { useToast } from "vue-toast-notification";

const toast = useToast();
//TABLE COMPOSABLES
import { useModal } from "@/composables/useModal";
const {
  isModalOpen,
  openModal,
  closeModal,
  isEditModalOpen,
  openEditModal,
  displayForm,
} = useModal();
//TABLE WATCHERS
watch(
  [() => isModalOpen.value, () => isEditModalOpen.value],
  async ([newModalValue, newEditValue], [oldModalValue, oldEditValue]) => {
    if (newModalValue || newEditValue) {
    } else if (oldEditValue) {
      // reset(formData.value);
    }
  }
);
// TABLE DATA
import { useRouter } from "vue-router";
const router = useRouter();
const breadCrumps = [{ text: t("release_form.BreadCrump"), route: "" }];
const columns = [
  t("release_form.table.category_name"),
  t("release_form.table.form_lable"),
  t("release_form.table.source_location"),
  t("release_form.table.destination_location"),
  t("release_form.table.form_date_time"),
  t("release_form.table.work_order_line_num"),
  t("release_form.table.doc_number"),
  t("release_form.table.created_by"),
  t("release_form.table.confirmed_at"),
  t("release_form.table.status"),
  t("release_form.table.actions"),
  t("release_form.table.actions"),
];
const loading = ref<boolean>(true);
const rows = shallowRef<any>([]);
const release = ref<any>([]);
const return_out_id = ref<number>(null);
const getReturnOutId = async () => {
  try {
    const response = await locations_api.getLoactionOperations(
      +store.getters["location_module/LocationId"]
    );
    const operation = response.find(
      (op) => op.setting_operation.operation_type === "RETURN_OUT"
    );
    return_out_id.value = operation ? operation.id : null;
  } catch (er) {
    throw er;
  }
};
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
    const response = await return_out_api.addRetrun({
      source_form_id: id,
      operation_id: return_out_id.value,
    });
    router.push({
      name: "return-details",
      params: {
        form_id: response.id,
        operation_id: response.operation_id,
      },
    });
  } catch (er) {
    throw er;
  } finally {
    toggleButtonLoad();
  }
};
//TABLE METHODS
const getReleases = async (filter = null) => {
  loading.value = true;
  const payload = {
    operation_id: +route.params.operation_id,
    ...filter,
  };
  try {
    const response = await release_api.getRelease(payload);
    release.value = response;
    rows.value = release.value.map((release: any) => ({
      id: release.id,
      category_name: release.category_name,
      form_lable: release.form_label,
      source_location: release.from_location?.location_name,
      destination_location: release.to_location?.location_name,
      form_datetime: release.form_datetime,
      work_order_line_num: release.work_order_line_num,
      doc_number: release.doc_number,
      created_by: [
        { text: release.user.name + " " },
        { text: release.created_at?.slice(0, 10) },
      ],
      confirmed_at: [
        { text: release.confirmed_by?.name },
        { text: release.confirmed_at?.slice(0, 10) },
      ],
      additional_data: {
        status: release.status,
        source_form_id: release.source_form_id,
        source_operation_id: release.source_operation_id,
        source_form_label: release.source_form_label,
      },
    }));
  } catch (er) {
    rows.value = [];
    throw er;
  } finally {
    loading.value = false;
  }
};
//FORM
//FORM COMPONENTS

// const SuccessModalComponent = defineAsyncComponent(
//   () =>
//     import("@/components/Layouts/AppLayoutComponents/SuccessModalComponent.vue")
// );
// const InputLableLayoutComponent = defineAsyncComponent(
//   () =>
//     import(
//       "@/components/Layouts/InputsFromLayoutCompoennts/InputLableLayoutComponent.vue"
//     )
// );
//FORM COMPOSABLES
import { useButtonLoad } from "@/composables/useButtonLoad";
import { useSchemaValidation } from "@/composables/useValidationSchema";
import { useResetValue } from "@/composables/useResetValue";
const { ButtonLoad, toggleButtonLoad } = useButtonLoad();
const { reset } = useResetValue();
//data
//FORM INTERFACE
interface releaseOrder {
  category_name: string;
  form_datetime: any;
  form_lable: string;
  to_location: string | number;
  doc_number: string;
  work_order_line_num: string;
  source_form_id?: number;
}
//FORM DATA
interface category {
  id: number;
  category_name: string;
}

const selectedRowId = ref<number>(null);
//FORM METHODS
const submitForm = async (formData) => {
  try {
    toggleButtonLoad();
    isEditModalOpen.value
      ? await release_api.updateRelease(formData, selectedRowId.value)
      : await addRelease(formData);
    reset(formData.value);
    closeModal();
    toast.success("item created sucessfully", {
      position: "top-right",
      duration: 5000,
      pauseOnHover: true,
    });
    await getReleases();
    displayForm.value = false;
  } catch (error) {
    throw error;
  } finally {
    toggleButtonLoad();
  }
};
const addRelease = async (payload: any) => {
  payload.operation_id = +route.params.operation_id;
  payload.from_location = +store.getters["location_module/LocationId"];
  payload.source_form_id = null;
  loading.value = false;
  try {
    await release_api.addRelease(payload);
    getReleases();
  } catch (er) {
    throw er;
  }
};
const updateForm = async (row_id: number) => {
  openEditModal();
  let selectedRow = release.value.find((release: any) => release.id === row_id);
  selectedRow = {
    form_lable: selectedRow.form_label,
    category_name: selectedRow.category_name,
    to_location: selectedRow.to_location?.id || null,
    form_datetime: selectedRow.form_datetime
      ? new Date(selectedRow.form_datetime).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    doc_number: selectedRow.doc_number,
    work_order_line_num: selectedRow.work_order_line_num,
  };

  updateFormValues(selectedRow);
  selectedRowId.value = row_id;
};

onMounted(() => {
  getReleases();
  getReturnOutId();
});
//LIFECYCLE HOOKS
</script>
